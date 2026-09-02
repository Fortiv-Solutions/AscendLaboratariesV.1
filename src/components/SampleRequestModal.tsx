import React, { useState } from 'react';
import { Product } from '../types';
import { X, Building, CheckCircle2 } from 'lucide-react';

interface SampleRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export const SampleRequestModal: React.FC<SampleRequestModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    institution: '',
    deaNumber: '',
    stateLicense: '',
    email: '',
    phone: '',
    inquiryType: 'Commercial Pricing & Volume Supply',
    productRequested: product ? `${product.name} (${product.strength})` : '',
    monthlyVolumeEstimated: '5,000 - 25,000 units',
    notes: ''
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
    }, 900);
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
          maxWidth: '720px',
          width: '95%',
          backgroundColor: 'var(--haze)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden'
        }}
      >
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
            <Building size={22} strokeWidth={1.6} color="var(--brand-navy)" />
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
                Commercial Quotation & Trade Supply Request
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>
                For Licensed Wholesalers, Health Systems, GPOs & Pharmacies
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
                backgroundColor: 'rgba(6, 2, 138, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                border: '1px solid rgba(6, 2, 138, 0.3)'
              }}
            >
              <CheckCircle2 size={36} strokeWidth={1.6} color="var(--brand-navy)" />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>
              Commercial Request Transmitted
            </h3>
            <p style={{ color: 'var(--ink-2)', fontSize: '14px', maxWidth: '520px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              Thank you for your interest in Ascend Laboratories pharmaceutical formulations. Our Commercial Trade & Account Management team will review your credential details and provide contractual tier pricing and EDI catalog setup within 1 business day.
            </p>
            <button onClick={handleReset} className="btn btn-primary">
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '28px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Contact Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Johnathan Davis"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Professional Title / Role *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Director of Pharmacy / Procurement Mgr"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Institution / Pharmacy / Wholesaler *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Memorial Health System / AmerisourceBergen..."
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">State Pharmacy / Wholesaler License #</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. PH-204928"
                  value={formData.stateLicense}
                  onChange={(e) => setFormData({ ...formData, stateLicense: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Business Email *</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="jdavis@healthsystem.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  placeholder="(800) 555-0199"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Product / Formulation of Interest *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Atorvastatin Calcium 20mg Tablets"
                  value={formData.productRequested}
                  onChange={(e) => setFormData({ ...formData, productRequested: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Monthly Supply Demand</label>
                <select
                  className="form-select"
                  value={formData.monthlyVolumeEstimated}
                  onChange={(e) => setFormData({ ...formData, monthlyVolumeEstimated: e.target.value })}
                >
                  <option value="Under 5,000 units">Under 5,000 bottles/units</option>
                  <option value="5,000 - 25,000 units">5,000 - 25,000 bottles/units</option>
                  <option value="25,000 - 100,000 units">25,000 - 100,000 bottles/units</option>
                  <option value="100,000+ units (National Scale)">100,000+ bottles/units (National Scale)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Additional Specification Notes or Delivery Requirements</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="Include details about preferred wholesaler drop-ship, GPO contract tier, or delivery timelines..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Submitting Quotation Request...' : 'Send Commercial Inquiry'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
