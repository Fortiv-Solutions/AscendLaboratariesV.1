import React from 'react';
import { Mic, MicOff, PhoneOff } from 'lucide-react';
import type { useRealtimeVoice } from '../../hooks/useRealtimeVoice';
import { VoiceEmblem } from './VoiceEmblem';
import { formatElapsed, voiceStatusLabel } from './VoicePanel';

interface VoiceDockProps {
  voice: ReturnType<typeof useRealtimeVoice>;
  onExpand: () => void;
}

/** Compact live-call pill shown while the chat window is closed, so the conversation can continue. */
export const VoiceDock: React.FC<VoiceDockProps> = ({ voice, onExpand }) => (
  <div className="ascend-voice-dock" role="region" aria-label="Ascend AI voice chat in progress">
    <button type="button" className="ascend-voice-dock-main" onClick={onExpand} aria-label="Open voice chat">
      <VoiceEmblem phase={voice.phase} activity={voice.activity} getLevels={voice.getLevels} size={44} compact />
      <span className="ascend-voice-dock-text">
        <strong aria-live="polite">{voiceStatusLabel(voice)}</strong>
        <span>{voice.phase === 'live' ? formatElapsed(voice.elapsedMs) : 'Ascend AI'}</span>
      </span>
    </button>
    <button
      type="button"
      className={`ascend-voice-dock-btn ${voice.muted ? 'is-active' : ''}`}
      onClick={voice.toggleMute}
      disabled={voice.phase !== 'live'}
      aria-pressed={voice.muted}
      aria-label={voice.muted ? 'Unmute microphone' : 'Mute microphone'}
    >
      {voice.muted ? <MicOff size={16} /> : <Mic size={16} />}
    </button>
    <button
      type="button"
      className="ascend-voice-dock-btn is-end"
      onClick={() => voice.stop('user')}
      aria-label="End voice chat"
    >
      <PhoneOff size={16} />
    </button>
  </div>
);
