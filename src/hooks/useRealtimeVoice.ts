import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Speech-to-speech voice session with the OpenAI Realtime API over WebRTC.
 *
 * Flow: mic → WebRTC → realtime model → spoken reply on a remote audio track.
 * Server events arrive on the "oai-events" data channel; function calls are
 * delegated to `onToolCall` so answers stay grounded in the n8n knowledge base.
 */

const SESSION_ENDPOINT = '/api/realtime-session';
const CALLS_ENDPOINT = 'https://api.openai.com/v1/realtime/calls';
const MAX_SESSION_MS = 10 * 60 * 1000;
const IDLE_TIMEOUT_MS = 2 * 60 * 1000;

export type VoicePhase = 'idle' | 'connecting' | 'live' | 'error';
export type VoiceActivity = 'listening' | 'hearing' | 'thinking' | 'working' | 'speaking';
export type VoiceErrorCode = 'mic_denied' | 'mic_missing' | 'unsupported' | 'not_configured' | 'network' | 'session';
export type VoiceEndReason = 'user' | 'timeout' | 'idle';

export interface VoiceLevels {
  input: number;
  output: number;
}

export interface RealtimeVoiceHandlers {
  onUserTurnStarted?: (itemId: string) => void;
  onUserTranscript?: (itemId: string, transcript: string) => void;
  onUserTranscriptFailed?: (itemId: string) => void;
  onAssistantDelta?: (responseId: string, delta: string) => void;
  onAssistantDone?: (responseId: string, transcript: string) => void;
  onToolCall?: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

interface ServerEvent {
  type: string;
  item_id?: string;
  response_id?: string;
  delta?: string;
  transcript?: string;
  error?: { message?: string; code?: string };
  response?: {
    status?: string;
    output?: Array<{ type: string; name?: string; call_id?: string; arguments?: string }>;
  };
}

interface Connection {
  pc: RTCPeerConnection;
  dc: RTCDataChannel;
  mic: MediaStream;
  audioEl: HTMLAudioElement;
  ctx: AudioContext | null;
  inputAnalyser: AnalyserNode | null;
  outputAnalyser: AnalyserNode | null;
}

class VoiceError extends Error {
  constructor(public code: VoiceErrorCode) {
    super(code);
  }
}

const levelBuffer = new Float32Array(1024);

function readLevel(analyser: AnalyserNode | null): number {
  if (!analyser) return 0;
  const size = Math.min(analyser.fftSize, levelBuffer.length);
  const view = levelBuffer.subarray(0, size);
  analyser.getFloatTimeDomainData(view);
  let sum = 0;
  for (let i = 0; i < size; i++) sum += view[i] * view[i];
  // RMS of speech sits around 0.02–0.25; map it to a 0..1 visual level
  return Math.min(1, Math.sqrt(sum / size) * 5);
}

/** Strip markdown, emoji, and symbols so text reads naturally when spoken. */
export function toSpeakable(text: string): string {
  return text
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/^[•\-*]\s+/gm, '')
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

export function isVoiceSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof RTCPeerConnection !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia
  );
}

export function useRealtimeVoice(handlers: RealtimeVoiceHandlers) {
  const [phase, setPhase] = useState<VoicePhase>('idle');
  const [activity, setActivity] = useState<VoiceActivity>('listening');
  const [error, setError] = useState<VoiceErrorCode | null>(null);
  const [endReason, setEndReason] = useState<VoiceEndReason | null>(null);
  const [muted, setMuted] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const connRef = useRef<Connection | null>(null);
  const attemptRef = useRef(0);
  const phaseRef = useRef<VoicePhase>('idle');
  const activityRef = useRef<VoiceActivity>('listening');
  const tickRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);
  const lastActivityAtRef = useRef(0);
  const responseDoneRef = useRef(false);
  const quietSinceRef = useRef(0);

  const updatePhase = useCallback((next: VoicePhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const updateActivity = useCallback((next: VoiceActivity) => {
    activityRef.current = next;
    setActivity(next);
  }, []);

  const send = useCallback((event: Record<string, unknown>) => {
    const dc = connRef.current?.dc;
    if (dc && dc.readyState === 'open') dc.send(JSON.stringify(event));
  }, []);

  const teardown = useCallback(() => {
    attemptRef.current += 1;
    if (tickRef.current !== null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
    const conn = connRef.current;
    connRef.current = null;
    if (!conn) return;
    try { conn.dc.close(); } catch { /* already closed */ }
    try { conn.pc.close(); } catch { /* already closed */ }
    conn.mic.getTracks().forEach((t) => t.stop());
    conn.audioEl.pause();
    conn.audioEl.srcObject = null;
    conn.ctx?.close().catch(() => undefined);
  }, []);

  const stop = useCallback(
    (reason: VoiceEndReason = 'user') => {
      if (phaseRef.current === 'idle' && !connRef.current) return;
      teardown();
      setMuted(false);
      setEndReason(reason);
      updateActivity('listening');
      updatePhase('idle');
    },
    [teardown, updateActivity, updatePhase]
  );

  const fail = useCallback(
    (code: VoiceErrorCode) => {
      teardown();
      setMuted(false);
      setError(code);
      updatePhase('error');
    },
    [teardown, updatePhase]
  );

  const handleResponseDone = useCallback(
    async (response: ServerEvent['response'], attempt: number) => {
      const calls = (response?.output ?? []).filter((item) => item.type === 'function_call' && item.call_id);
      if (calls.length === 0) {
        responseDoneRef.current = true;
        if (activityRef.current === 'thinking' || activityRef.current === 'working') {
          updateActivity('listening');
        }
        return;
      }

      updateActivity('working');
      for (const call of calls) {
        let output: unknown;
        try {
          const args = call.arguments ? (JSON.parse(call.arguments) as Record<string, unknown>) : {};
          output = handlersRef.current.onToolCall
            ? await handlersRef.current.onToolCall(call.name ?? '', args)
            : { error: 'Tool unavailable.' };
        } catch (err) {
          console.warn('Voice tool call failed:', call.name, err);
          output = { error: 'The lookup failed. Tell the caller and offer to connect them with the Ascend team.' };
        }
        if (attempt !== attemptRef.current) return;
        send({
          type: 'conversation.item.create',
          item: { type: 'function_call_output', call_id: call.call_id, output: JSON.stringify(output ?? {}) },
        });
      }
      if (attempt !== attemptRef.current) return;
      responseDoneRef.current = false;
      updateActivity('thinking');
      send({ type: 'response.create' });
    },
    [send, updateActivity]
  );

  const handleServerEvent = useCallback(
    (event: ServerEvent, attempt: number) => {
      const h = handlersRef.current;
      switch (event.type) {
        case 'input_audio_buffer.speech_started':
          lastActivityAtRef.current = Date.now();
          updateActivity('hearing');
          break;
        case 'input_audio_buffer.speech_stopped':
          lastActivityAtRef.current = Date.now();
          updateActivity('thinking');
          break;
        case 'input_audio_buffer.committed':
          if (event.item_id) h.onUserTurnStarted?.(event.item_id);
          break;
        case 'conversation.item.input_audio_transcription.completed':
          if (event.item_id) h.onUserTranscript?.(event.item_id, (event.transcript ?? '').trim());
          break;
        case 'conversation.item.input_audio_transcription.failed':
          if (event.item_id) h.onUserTranscriptFailed?.(event.item_id);
          break;
        case 'response.created':
          responseDoneRef.current = false;
          if (activityRef.current !== 'hearing' && activityRef.current !== 'working') updateActivity('thinking');
          break;
        case 'output_audio_buffer.started':
          updateActivity('speaking');
          break;
        case 'output_audio_buffer.stopped':
        case 'output_audio_buffer.cleared':
          lastActivityAtRef.current = Date.now();
          if (activityRef.current === 'speaking') updateActivity('listening');
          break;
        case 'response.output_audio_transcript.delta':
          if (event.response_id && event.delta) {
            if (activityRef.current === 'thinking') updateActivity('speaking');
            h.onAssistantDelta?.(event.response_id, event.delta);
          }
          break;
        case 'response.output_audio_transcript.done':
          if (event.response_id) h.onAssistantDone?.(event.response_id, (event.transcript ?? '').trim());
          break;
        case 'response.done':
          void handleResponseDone(event.response, attempt);
          break;
        case 'error':
          console.warn('Realtime error event:', event.error?.code, event.error?.message);
          break;
        default:
          break;
      }
    },
    [handleResponseDone, updateActivity]
  );

  const start = useCallback(async () => {
    if (phaseRef.current === 'connecting' || phaseRef.current === 'live') return;
    if (!isVoiceSupported()) {
      setError('unsupported');
      updatePhase('error');
      return;
    }

    teardown();
    const attempt = ++attemptRef.current;
    setError(null);
    setEndReason(null);
    setElapsedMs(0);
    updateActivity('listening');
    updatePhase('connecting');

    // Create the AudioContext inside the click gesture so Safari lets it run
    let ctx: AudioContext | null = null;
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = Ctx ? new Ctx() : null;
      void ctx?.resume();
    } catch {
      ctx = null;
    }

    const audioEl = document.createElement('audio');
    audioEl.autoplay = true;
    audioEl.setAttribute('playsinline', '');

    let mic: MediaStream | null = null;
    let pc: RTCPeerConnection | null = null;

    try {
      try {
        mic = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
      } catch (err) {
        const name = (err as DOMException)?.name;
        throw new VoiceError(name === 'NotFoundError' || name === 'OverconstrainedError' ? 'mic_missing' : 'mic_denied');
      }
      if (attempt !== attemptRef.current) throw new Error('cancelled');

      const tokenRes = await fetch(SESSION_ENDPOINT, { method: 'POST' }).catch(() => {
        throw new VoiceError('network');
      });
      if (tokenRes.status === 503) throw new VoiceError('not_configured');
      if (!tokenRes.ok) throw new VoiceError('session');
      const { value: ephemeralKey } = (await tokenRes.json()) as { value?: string };
      if (!ephemeralKey) throw new VoiceError('session');
      if (attempt !== attemptRef.current) throw new Error('cancelled');

      pc = new RTCPeerConnection();
      const dc = pc.createDataChannel('oai-events');

      let inputAnalyser: AnalyserNode | null = null;
      if (ctx) {
        inputAnalyser = ctx.createAnalyser();
        inputAnalyser.fftSize = 1024;
        ctx.createMediaStreamSource(mic).connect(inputAnalyser);
      }

      const conn: Connection = { pc, dc, mic, audioEl, ctx, inputAnalyser, outputAnalyser: null };
      connRef.current = conn;

      pc.ontrack = (e) => {
        const [remote] = e.streams;
        if (!remote) return;
        audioEl.srcObject = remote;
        void audioEl.play().catch(() => undefined);
        if (ctx && !conn.outputAnalyser) {
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 1024;
          ctx.createMediaStreamSource(remote).connect(analyser);
          conn.outputAnalyser = analyser;
        }
      };

      pc.onconnectionstatechange = () => {
        if (attempt !== attemptRef.current) return;
        if (pc?.connectionState === 'failed') fail('network');
      };

      mic.getAudioTracks().forEach((track) => pc!.addTrack(track, mic!));

      dc.onmessage = (e) => {
        if (attempt !== attemptRef.current) return;
        try {
          handleServerEvent(JSON.parse(e.data) as ServerEvent, attempt);
        } catch {
          // Ignore malformed events
        }
      };

      dc.onopen = () => {
        if (attempt !== attemptRef.current) return;
        startedAtRef.current = Date.now();
        lastActivityAtRef.current = Date.now();
        updatePhase('live');
        updateActivity('thinking');
        // Let the assistant greet first so the conversation opens naturally
        send({ type: 'response.create' });

        tickRef.current = window.setInterval(() => {
          const now = Date.now();
          setElapsedMs(now - startedAtRef.current);

          // Fallback for missing output_audio_buffer events: settle back to listening on silence
          if (activityRef.current === 'speaking' && responseDoneRef.current) {
            if (readLevel(conn.outputAnalyser) < 0.02) {
              if (!quietSinceRef.current) quietSinceRef.current = now;
              else if (now - quietSinceRef.current > 1400) {
                lastActivityAtRef.current = now;
                updateActivity('listening');
              }
            } else {
              quietSinceRef.current = 0;
            }
          } else {
            quietSinceRef.current = 0;
          }

          if (now - startedAtRef.current > MAX_SESSION_MS) stop('timeout');
          else if (activityRef.current === 'listening' && now - lastActivityAtRef.current > IDLE_TIMEOUT_MS) stop('idle');
        }, 250);
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch(CALLS_ENDPOINT, {
        method: 'POST',
        body: offer.sdp,
        headers: { Authorization: `Bearer ${ephemeralKey}`, 'Content-Type': 'application/sdp' },
      }).catch(() => {
        throw new VoiceError('network');
      });
      if (!sdpRes.ok) throw new VoiceError('session');
      if (attempt !== attemptRef.current) throw new Error('cancelled');

      await pc.setRemoteDescription({ type: 'answer', sdp: await sdpRes.text() });
    } catch (err) {
      if (attempt !== attemptRef.current) {
        // Superseded by stop() or a newer start(); release anything this attempt opened
        mic?.getTracks().forEach((t) => t.stop());
        if (!connRef.current) {
          pc?.close();
          ctx?.close().catch(() => undefined);
        }
        return;
      }
      if (!connRef.current) {
        mic?.getTracks().forEach((t) => t.stop());
        pc?.close();
        ctx?.close().catch(() => undefined);
      }
      fail(err instanceof VoiceError ? err.code : 'session');
    }
  }, [fail, handleServerEvent, send, stop, teardown, updateActivity, updatePhase]);

  const toggleMute = useCallback(() => {
    const conn = connRef.current;
    if (!conn) return;
    setMuted((prev) => {
      const next = !prev;
      conn.mic.getAudioTracks().forEach((t) => (t.enabled = !next));
      return next;
    });
  }, []);

  /** Stop the assistant mid-sentence so the caller can speak. */
  const interrupt = useCallback(() => {
    if (activityRef.current !== 'speaking') return;
    send({ type: 'response.cancel' });
    send({ type: 'output_audio_buffer.clear' });
    lastActivityAtRef.current = Date.now();
    updateActivity('listening');
  }, [send, updateActivity]);

  const getLevels = useCallback((): VoiceLevels => {
    const conn = connRef.current;
    if (!conn) return { input: 0, output: 0 };
    return {
      input: muted ? 0 : readLevel(conn.inputAnalyser),
      output: readLevel(conn.outputAnalyser),
    };
  }, [muted]);

  const clearError = useCallback(() => {
    setError(null);
    setEndReason(null);
    if (phaseRef.current === 'error') updatePhase('idle');
  }, [updatePhase]);

  useEffect(() => teardown, [teardown]);

  return {
    phase,
    activity,
    error,
    endReason,
    muted,
    elapsedMs,
    start,
    stop,
    toggleMute,
    interrupt,
    getLevels,
    clearError,
  };
}
