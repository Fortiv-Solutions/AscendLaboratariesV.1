import React from 'react';
import { Mic, MicOff, PhoneOff, MessageSquareText, ArrowUpRight, FileText, RotateCcw } from 'lucide-react';
import type { Product } from '../../types';
import type { MessageAction } from '../AscendAIChatbot';
import type { useRealtimeVoice, VoiceActivity, VoiceEndReason, VoiceErrorCode } from '../../hooks/useRealtimeVoice';
import { VoiceEmblem } from './VoiceEmblem';

type VoiceSession = ReturnType<typeof useRealtimeVoice>;

interface VoicePanelProps {
  voice: VoiceSession;
  userCaption: string | null;
  assistantCaption: string;
  productCard?: Product;
  actions?: MessageAction[];
  expanded: boolean;
  onAction: (action: MessageAction) => void;
  onViewProduct: (product: Product) => void;
  onSwitchToText: () => void;
}

const ACTIVITY_LABEL: Record<VoiceActivity, string> = {
  listening: 'Listening',
  hearing: 'Hearing you',
  thinking: 'Thinking',
  working: 'Checking Ascend records',
  speaking: 'Speaking',
};

const ERROR_COPY: Record<VoiceErrorCode, { title: string; body: string; retry: boolean }> = {
  mic_denied: {
    title: 'Microphone access is blocked',
    body: 'Allow microphone access from the icon in your address bar, then try again.',
    retry: true,
  },
  mic_missing: {
    title: 'No microphone found',
    body: 'Connect a microphone or headset, then try again.',
    retry: true,
  },
  unsupported: {
    title: 'Voice chat isn’t available in this browser',
    body: 'Use a current version of Chrome, Edge, Safari, or Firefox, or keep chatting in text.',
    retry: false,
  },
  not_configured: {
    title: 'Voice chat isn’t set up yet',
    body: 'Voice is not enabled on this site right now. Switch to text to keep chatting.',
    retry: false,
  },
  network: {
    title: 'The voice connection dropped',
    body: 'Check your internet connection, then start again.',
    retry: true,
  },
  session: {
    title: 'Voice chat couldn’t connect',
    body: 'The voice service didn’t respond. Try again in a moment.',
    retry: true,
  },
};

const END_NOTE: Partial<Record<VoiceEndReason, string>> = {
  timeout: 'Voice chat ended after 10 minutes. Start again to keep talking.',
  idle: 'Voice chat ended after 2 minutes of silence.',
};

export const formatElapsed = (ms: number) => {
  const total = Math.floor(ms / 1000);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

export const voiceStatusLabel = (voice: VoiceSession) => {
  if (voice.phase === 'connecting') return 'Connecting';
  if (voice.muted) return 'Microphone muted';
  return ACTIVITY_LABEL[voice.activity];
};

export const VoicePanel: React.FC<VoicePanelProps> = ({
  voice,
  userCaption,
  assistantCaption,
  productCard,
  actions,
  expanded,
  onAction,
  onViewProduct,
  onSwitchToText,
}) => {
  const { phase, activity } = voice;
  const emblemSize = expanded ? 240 : 164;
  const inCall = phase === 'live' || phase === 'connecting';

  if (phase === 'error' && voice.error) {
    const copy = ERROR_COPY[voice.error];
    return (
      <div className="ascend-voice-stage is-error">
        <div className="ascend-voice-emblem">
          <VoiceEmblem phase={phase} activity={activity} getLevels={voice.getLevels} size={emblemSize} />
        </div>
        <div className="ascend-voice-intro" role="alert">
          <h4 className="ascend-voice-intro-title">{copy.title}</h4>
          <p className="ascend-voice-intro-body">{copy.body}</p>
        </div>
        <div className="ascend-voice-intro-actions">
          {copy.retry && (
            <button type="button" className="ascend-voice-start-btn" onClick={() => void voice.start()}>
              <RotateCcw size={16} />
              <span>Try again</span>
            </button>
          )}
          <button type="button" className="ascend-voice-ghost-btn" onClick={onSwitchToText}>
            <MessageSquareText size={15} />
            <span>Switch to text</span>
          </button>
        </div>
      </div>
    );
  }

  if (!inCall) {
    const endNote = voice.endReason ? END_NOTE[voice.endReason] : undefined;
    return (
      <div className="ascend-voice-stage is-idle">
        <div className="ascend-voice-emblem">
          <VoiceEmblem phase={phase} activity={activity} getLevels={voice.getLevels} size={emblemSize} />
        </div>
        <div className="ascend-voice-intro">
          <h4 className="ascend-voice-intro-title">Speak with Ascend AI</h4>
          <p className="ascend-voice-intro-body">
            Ask about NDCs, strengths, quality documents, ordering, or safety reporting. Talk naturally — you can
            interrupt at any time.
          </p>
          <ul className="ascend-voice-examples" aria-label="Things you can ask">
            <li>“What strengths does Atorvastatin come in?”</li>
            <li>“How do I report a side effect?”</li>
          </ul>
        </div>
        {endNote && <p className="ascend-voice-end-note">{endNote}</p>}
        <div className="ascend-voice-intro-actions">
          <button type="button" className="ascend-voice-start-btn" onClick={() => void voice.start()}>
            <Mic size={16} />
            <span>Start voice chat</span>
          </button>
        </div>
        <p className="ascend-voice-fineprint">English only · Uses your microphone · Audio is processed by OpenAI</p>
      </div>
    );
  }

  const canInterrupt = phase === 'live' && activity === 'speaking';
  const hasAttachments = !!productCard || (actions && actions.length > 0);

  return (
    <div className={`ascend-voice-stage is-live is-${phase === 'connecting' ? 'connecting' : activity}`}>
      <div className="ascend-voice-topline">
        <span className="ascend-voice-state" aria-live="polite">
          <span className="ascend-voice-state-dot" />
          {voiceStatusLabel(voice)}
        </span>
        <span className="ascend-voice-timer">{phase === 'live' ? formatElapsed(voice.elapsedMs) : '--:--'}</span>
      </div>

      <button
        type="button"
        className="ascend-voice-emblem is-interactive"
        onClick={voice.interrupt}
        disabled={!canInterrupt}
        aria-label={canInterrupt ? 'Interrupt Ascend AI' : 'Ascend AI voice activity'}
        title={canInterrupt ? 'Tap to interrupt' : undefined}
      >
        <VoiceEmblem phase={phase} activity={activity} getLevels={voice.getLevels} size={emblemSize} />
        <span className={`ascend-voice-hint ${canInterrupt ? 'is-visible' : ''}`}>Tap to interrupt</span>
      </button>

      <div className="ascend-voice-captions">
        {userCaption !== null && (
          <p className="ascend-voice-caption-user">
            <span className="ascend-voice-caption-label">You</span>
            {userCaption || <span className="ascend-voice-caption-pending">…</span>}
          </p>
        )}
        <div className="ascend-voice-caption-window">
          <p className="ascend-voice-caption-bot">
            {assistantCaption ||
              (phase === 'connecting' ? 'Connecting to Ascend AI…' : activity === 'working' ? 'Looking that up…' : '')}
          </p>
        </div>
      </div>

      {hasAttachments && (
        <div className="ascend-voice-attachments">
          {productCard && (
            <button type="button" className="ascend-voice-chip" onClick={() => onViewProduct(productCard)}>
              <FileText size={13} />
              <span>View {productCard.name}</span>
            </button>
          )}
          {actions?.slice(0, productCard ? 1 : 2).map((act, idx) => (
            <button key={idx} type="button" className="ascend-voice-chip" onClick={() => onAction(act)}>
              <span>{act.label}</span>
              <ArrowUpRight size={13} />
            </button>
          ))}
        </div>
      )}

      <div className="ascend-voice-controls">
        <div className="ascend-voice-control">
          <button
            type="button"
            className={`ascend-voice-round-btn ${voice.muted ? 'is-active' : ''}`}
            onClick={voice.toggleMute}
            disabled={phase !== 'live'}
            aria-pressed={voice.muted}
            aria-label={voice.muted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {voice.muted ? <MicOff size={19} /> : <Mic size={19} />}
          </button>
          <span>{voice.muted ? 'Unmute' : 'Mute'}</span>
        </div>
        <div className="ascend-voice-control">
          <button
            type="button"
            className="ascend-voice-end-btn"
            onClick={() => voice.stop('user')}
            aria-label="End voice chat"
          >
            <PhoneOff size={21} />
          </button>
          <span>End</span>
        </div>
        <div className="ascend-voice-control">
          <button
            type="button"
            className="ascend-voice-round-btn"
            onClick={onSwitchToText}
            aria-label="End voice chat and show the transcript"
          >
            <MessageSquareText size={19} />
          </button>
          <span>Transcript</span>
        </div>
      </div>
    </div>
  );
};
