import React, { useState } from 'react';
import { ShieldCheck, Award, Microscope, FileText, CheckCircle2, Download, Search, AlertCircle, PhoneCall } from 'lucide-react';

interface QualityViewProps {
  onOpenAdverseEvent: () => void;
  onOpenContact: () => void;
}

export const QualityView: React.FC<QualityViewProps> = ({ onOpenAdverseEvent, onOpenContact }) => {
  const [coaLot, setCoaLot] = useState('');
  const [coaResult, setCoaResult] = useState<string | null>(null);

  const handleSearchCoA = (e: React.FormEvent) => {
    e.preventDefault();
    if (coaLot.trim()) {
      setCoaResult(`CoA Document Verified: Lot #${coaLot.toUpperCase()} released with 99.8% Assay Purity & Passed Microbial Limits.`);
    }
  };

  return (
    <div className="quality-view">
      {/* Hero */}
      <section
        style={{
          padding: 'clamp(28px, 4.5vw, 54px) 0',
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(6, 2, 138, 0.45), var(--paper) 80%)',
          borderBottom: '1px solid var(--color-border-default)',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>
            <span className="eyebrow-dot" />
            <span>Regulatory & Quality Assurance</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: 'var(--ink)', marginBottom: '20px' }}>
            Quality Is Our Standard, Not Just a Department
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--ink-2)', lineHeight: 1.7, margin: 0 }}>
            Ascend Laboratories maintains an unwavering commitment to cGMP compliance, stringent analytical method validation, and total batch traceability to protect patient safety.
          </p>
        </div>
      </section>

      {/* Quality Architecture Pillars */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header text-center">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>
              <span className="eyebrow-dot" />
              <span>Analytical Excellence</span>
            </div>
            <h2 className="section-title">Comprehensive Quality Ecosystem</h2>
            <p className="section-description" style={{ margin: '0 auto' }}>
              Every pharmaceutical product is tested in state-of-the-art analytical chemistry and microbiology laboratories.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="card" style={{ padding: '28px', backgroundColor: 'var(--paper)' }}>
              <Microscope size={32} strokeWidth={1.6} color="var(--brand-navy)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
                Chromatography & Potency Testing
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6, margin: 0 }}>
                Equipped with ultra-high-performance liquid chromatography (UHPLC) and gas chromatography mass spectrometry (GC-MS) for precise active assay, blend uniformity, and impurity profile quantification.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', backgroundColor: 'var(--paper)' }}>
              <Award size={32} strokeWidth={1.6} color="var(--ok)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
                Dissolution & Bioequivalence Profiling
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6, margin: 0 }}>
                Automated multi-media dissolution baths verify that delayed-release, extended-release, and immediate-release tablets precisely match innovator bioavailability standards across pH levels.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', backgroundColor: 'var(--paper)' }}>
              <ShieldCheck size={32} strokeWidth={1.6} color="var(--brand-navy)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
                Microbiological & Sterility Controls
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6, margin: 0 }}>
                Class A/B cleanrooms and HEPA filtration suites conduct endotoxin, total bioburden, and environmental monitoring to prevent contamination at all stages of production.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', backgroundColor: 'var(--paper)' }}>
              <FileText size={32} strokeWidth={1.6} color="var(--brand-red-press)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
                ICH Stability Chambers
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6, margin: 0 }}>
                Continuous temperature and humidity-controlled chambers test long-term shelf-life stability according to International Council for Harmonisation (ICH) Q1A guidelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate of Analysis (CoA) Lookup Portal */}
      <section className="section">
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(28px, 5vw, 48px)',
              maxWidth: '850px',
              margin: '0 auto'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <span className="badge badge-blue" style={{ marginBottom: '12px' }}>Institutional Pharmacy Verification</span>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>
                Certificate of Analysis (CoA) Portal
              </h2>
              <p style={{ color: 'var(--ink-3)', fontSize: '14px', margin: 0 }}>
                Verify analytical lot release and download verified CoA documentation for any commercial batch distributed by Ascend Laboratories.
              </p>
            </div>

            <form onSubmit={handleSearchCoA} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Enter Finished Product Lot Number (e.g. L24098A, B89201)"
                value={coaLot}
                onChange={(e) => setCoaLot(e.target.value)}
                className="form-input"
                style={{ flex: 1, minWidth: '240px' }}
                aria-label="Lot number"
              />
              <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
                <Search size={16} strokeWidth={1.6} /> Retrieve Batch CoA
              </button>
            </form>

            {coaResult && (
              <div
                style={{
                  backgroundColor: 'rgba(15, 122, 85, 0.1)',
                  border: '1px solid rgba(15, 122, 85, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={20} strokeWidth={1.6} color="var(--ok)" />
                  <span style={{ fontSize: '13px', color: 'var(--ink)' }}>{coaResult}</span>
                </div>
                <button
                  onClick={() => alert(`Downloading signed CoA PDF for Lot ${coaLot.toUpperCase()}`)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Download size={14} strokeWidth={1.6} /> Download PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Adverse Drug Event Notice & Reporting */}
      <section className="section section-alt">
        <div className="container" style={{ maxWidth: '850px' }}>
          <div
            style={{
              backgroundColor: 'rgba(242, 61, 38, 0.08)',
              border: '1px solid rgba(242, 61, 38, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertCircle size={28} strokeWidth={1.6} color="var(--brand-red-press)" />
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
                  Pharmacovigilance & Safety Surveillance
                </h3>
                <span style={{ fontSize: '13px', color: 'var(--ink-3)' }}>
                  24/7 Patient Safety & Clinical Inquiry Hotline
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--ink-2)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
              Ascend Laboratories’s dedicated medical safety team systematically collects, investigates, and reports adverse events in compliance with FDA CFR Title 21 post-marketing surveillance requirements.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '8px' }}>
              <button onClick={onOpenAdverseEvent} className="btn btn-primary" style={{ backgroundColor: 'var(--brand-navy)', gap: '6px' }}>
                <PhoneCall size={16} strokeWidth={1.6} /> Submit Adverse Event Safety Form
              </button>
              <button onClick={onOpenContact} className="btn btn-secondary" style={{ gap: '6px' }}>
                Contact Medical Affairs
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
