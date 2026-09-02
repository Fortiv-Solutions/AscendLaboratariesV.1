import React, { useState } from 'react';
import { Product } from '../types';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AdverseEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product | null;
}

export const AdverseEventModal: React.FC<AdverseEventModalProps> = ({
  isOpen,
  onClose,
  initialProduct
}) => {
  const [formData, setFormData] = useState({
    reporterName: '',
    reporterType: 'Healthcare Professional (MD, PharmD, RN)',
    contactEmail: '',
    contactPhone: '',
    productName: initialProduct ? initialProduct.name : '',
    lotNumber: '',
    patientAge: '',
    eventDescription: '',
    dateOfEvent: '',
    urgentMedicalAttention: 'No'
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '750px',
          width: '95%',
          backgroundColor: 'var(--haze)',
          border: '1px solid rgba(242, 61, 38, 0.4)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 28px',
            backgroundColor: 'var(--mist)',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={22} strokeWidth={1.6} color="var(--brand-red-press)" />
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
                Pharmacovigilance & Adverse Event Reporting
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>
                FDA Form 3500A Compliant Intake • 24/7 Safety Surveillance
              </span>
            </div>
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

        {submitted ? (
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(15, 122, 85, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                border: '1px solid rgba(15, 122, 85, 0.3)'
              }}
            >
              <CheckCircle2 size={36} strokeWidth={1.6} color="var(--ok)" />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>
              Safety Report Successfully Logged
            </h3>
            <p style={{ color: 'var(--ink-2)', fontSize: '14px', maxWidth: '520px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              Your case has been transmitted to Ascend Laboratories’s Medical Affairs & Pharmacovigilance Department (Case Reference: <strong style={{ color: 'var(--brand-navy)' }}>ASC-PV-{Math.floor(100000 + Math.random() * 900000)}</strong>). A safety officer may follow up within 24 hours if additional clinical clarification is needed.
            </p>
            <button onClick={handleReset} className="btn btn-primary">
              Return to Website
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '28px', maxHeight: '80vh', overflowY: 'auto' }}>
            {/* Urgent Warning */}
            <div
              style={{
                backgroundColor: 'rgba(242, 61, 38, 0.08)',
                border: '1px solid rgba(242, 61, 38, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                marginBottom: '20px',
                fontSize: '13px',
                color: 'var(--ink-2)',
                lineHeight: 1.5
              }}
            >
              <strong style={{ color: 'var(--brand-red-press)', display: 'block', marginBottom: '4px' }}>
                Important Medical Notice:
              </strong>
              If this is a life-threatening emergency, please dial 911 immediately. For urgent medical inquiries or to reach our 24/7 on-call medical team, call <strong style={{ color: 'var(--ink)' }}>1-877-204-0601 (Option 2)</strong>.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Reporter Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Dr. Jane Smith"
                  value={formData.reporterName}
                  onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reporter Designation *</label>
                <select
                  className="form-select"
                  value={formData.reporterType}
                  onChange={(e) => setFormData({ ...formData, reporterType: e.target.value })}
                >
                  <option value="Healthcare Professional (MD, PharmD, RN)">Healthcare Professional (MD, PharmD, RN)</option>
                  <option value="Patient / Consumer">Patient / Consumer</option>
                  <option value="Caregiver / Family Member">Caregiver / Family Member</option>
                  <option value="Wholesaler / Distributor">Wholesaler / Distributor</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Email *</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="name@hospital.org"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone Number *</label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  placeholder="(555) 000-0000"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Suspected Product Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Atorvastatin Calcium Tablets 20mg"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lot / Batch Number (if available)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. L24098A"
                  value={formData.lotNumber}
                  onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description of Adverse Event or Product Quality Complaint *</label>
              <textarea
                rows={4}
                required
                className="form-textarea"
                placeholder="Please describe symptoms, onset time, concomitant medications, and clinical outcome..."
                value={formData.eventDescription}
                onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ backgroundColor: 'var(--brand-navy)' }}>
                {loading ? 'Submitting to Safety Database...' : 'Submit Confidential Safety Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
