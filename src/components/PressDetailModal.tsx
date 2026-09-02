import React from 'react';
import { PressRelease } from '../types';
import { X, Calendar } from 'lucide-react';

interface PressDetailModalProps {
  pressRelease: PressRelease | null;
  onClose: () => void;
}

export const PressDetailModal: React.FC<PressDetailModalProps> = ({ pressRelease, onClose }) => {
  if (!pressRelease) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '780px',
          width: '95%',
          backgroundColor: 'var(--haze)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '24px 28px',
            backgroundColor: 'var(--mist)',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-purple">{pressRelease.category}</span>
            <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>• {pressRelease.readTime}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'var(--line)',
              border: 'none',
              borderRadius: '999px',
              padding: '6px',
              color: 'var(--ink-3)',
              cursor: 'pointer'
            }}
          >
            <X size={18} strokeWidth={1.6} />
          </button>
        </div>

        <div style={{ padding: '32px 28px', maxHeight: '80vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--ink-3)', fontSize: '13px', marginBottom: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} strokeWidth={1.6} color="var(--brand-navy)" /> {pressRelease.date}
            </span>
            <span>•</span>
            <span>Bridgewater, NJ (Corporate Communications)</span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.3, marginBottom: '20px' }}>
            {pressRelease.title}
          </h1>

          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'rgba(6, 2, 138, 0.08)',
              borderLeft: '3px solid var(--brand-navy)',
              borderRadius: '0 8px 8px 0',
              marginBottom: '24px',
              fontSize: '15px',
              color: 'var(--ink-2)',
              fontStyle: 'italic',
              lineHeight: 1.6
            }}
          >
            "{pressRelease.summary}"
          </div>

          <div style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p>{pressRelease.content}</p>
            <p>
              Ascend Laboratories continues to expand its domestic pharmaceutical supply infrastructure to support hospital groups, retail pharmacy chains, and long-term care facilities with unbroken drug availability. Rigorous analytical release testing is performed at our FDA-inspected New Jersey quality laboratories.
            </p>
            <p>
              For commercial availability, wholesale NDC order numbers, or EDI catalog inquiries, healthcare providers and distributors may contact our commercial trade operations team directly.
            </p>
          </div>

          <div
            style={{
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'var(--ink-3)'
            }}
          >
            <div>Media Contact: media.relations@ascend-usa.com</div>
            <div>Source: Ascend Laboratories Communications Office</div>
          </div>
        </div>

        <div style={{ padding: '16px 28px', backgroundColor: 'var(--mist)', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close Article
          </button>
        </div>
      </div>
    </div>
  );
};
