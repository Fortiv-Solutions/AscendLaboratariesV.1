import React, { useState } from 'react';
import { Building, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContactViewProps {
  onOpenAdverseEvent: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onOpenAdverseEvent }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    department: 'Commercial Sales & Wholesaler Relations',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      company: '',
      email: '',
      phone: '',
      department: 'Commercial Sales & Wholesaler Relations',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-view">
      {/* Hero */}
      <section
        style={{
          padding: 'clamp(28px, 4.5vw, 54px) 0',
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(6, 2, 138, 0.4), var(--paper) 75%)',
          borderBottom: '1px solid var(--color-border-default)',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>
            <span className="eyebrow-dot" />
            <span>Corporate Contact & Departmental Routing</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: 800, color: 'var(--ink)', marginBottom: '16px' }}>
            Connect with Ascend Laboratories
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
            Direct your inquiry to our specialized commercial, regulatory, or business development teams for rapid response.
          </p>
        </div>
      </section>

      {/* Main Grid: Info + Form */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'start'
            }}
          >
            {/* Left: Department Directory & Locations */}
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ink)', marginBottom: '20px' }}>
                Corporate Directory & Office Locations
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div style={{ backgroundColor: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Building size={20} strokeWidth={1.6} color="var(--brand-navy)" />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
                      US Corporate Headquarters
                    </h3>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.6 }}>
                    Ascend Laboratories, LLC<br />
                    350 Campus Drive, Suite 200<br />
                    Bridgewater, NJ 08807, United States
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--ink-2)' }}>
                    <strong>Direct:</strong> (877) 204-0601 • <strong>Fax:</strong> (877) 204-0602
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Building size={20} strokeWidth={1.6} color="var(--ok)" />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
                      Central Distribution Center
                    </h3>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.6 }}>
                    Ascend Logistics Hub<br />
                    4800 Logistics Way, Suite 100<br />
                    Columbus, OH 43228, United States
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--ink-2)' }}>
                    <strong>Trade EDI Dispatch:</strong> (800) 258-3720
                  </div>
                </div>
              </div>

              {/* Adverse Event Quick Box */}
              <div
                style={{
                  backgroundColor: 'rgba(242, 61, 38, 0.08)',
                  border: '1px solid rgba(242, 61, 38, 0.3)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <AlertCircle size={20} strokeWidth={1.6} color="var(--brand-red-press)" />
                  <strong style={{ color: 'var(--ink)', fontSize: '14px' }}>
                    Adverse Drug Event Reporting
                  </strong>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--ink-2)', lineHeight: 1.5, marginBottom: '12px' }}>
                  To report an adverse reaction or product complaint regarding any Ascend formulation, use our specialized safety reporting portal.
                </p>
                <button
                  onClick={onOpenAdverseEvent}
                  className="btn btn-secondary btn-sm"
                  style={{ color: 'var(--brand-red-press)', borderColor: 'rgba(242, 61, 38, 0.4)', fontSize: '12px' }}
                >
                  Open Pharmacovigilance Form
                </button>
              </div>
            </div>

            {/* Right: Departmental Form */}
            <div
              style={{
                backgroundColor: 'var(--paper)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(24px, 4vw, 36px)',
                boxShadow: 'var(--shadow-elevated)'
              }}
            >
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '36px 12px' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(15, 122, 85, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      border: '1px solid rgba(15, 122, 85, 0.3)'
                    }}
                  >
                    <CheckCircle2 size={32} strokeWidth={1.6} color="var(--ok)" />
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
                    Inquiry Transmitted Successfully
                  </h3>
                  <p style={{ color: 'var(--ink-2)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                    Thank you, <strong style={{ color: 'var(--ink)' }}>{formData.fullName}</strong>. Your inquiry has been routed to our <strong style={{ color: 'var(--brand-navy)' }}>{formData.department}</strong> team. A representative will get in touch with you shortly.
                  </p>
                  <button onClick={handleReset} className="btn btn-primary btn-sm">
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '20px' }}>
                    Send an Inquiry
                  </h3>

                  <div className="form-group">
                    <label className="form-label">Select Department / Inquiry Nature *</label>
                    <select
                      className="form-select"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="Commercial Sales & Wholesaler Relations">Commercial Sales & Wholesaler Relations</option>
                      <option value="Business Development & ANDA Licensing">Business Development & ANDA Licensing</option>
                      <option value="Regulatory Affairs & Quality Compliance">Regulatory Affairs & Quality Compliance</option>
                      <option value="Procurement & Supplier Relations">Procurement & Supplier Relations</option>
                      <option value="General Corporate Inquiries">General Corporate Inquiries</option>
                    </select>
                  </div>

                  <div className="form-row-2col">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="Dr. Amanda Roberts"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Institution / Organization *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="Ascension Health / Cardinal..."
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row-2col">
                    <div className="form-group">
                      <label className="form-label">Business Email *</label>
                      <input
                        type="email"
                        required
                        className="form-input"
                        placeholder="aroberts@organization.com"
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
                        placeholder="(555) 234-5678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Commercial Formulary Contracting for Cardiovascular Products"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea
                      rows={4}
                      required
                      className="form-textarea"
                      placeholder="Please provide details regarding your inquiry, NDC numbers of interest, or timeline..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                  >
                    {loading ? 'Transmitting...' : 'Submit Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
