import React from 'react';
import { LEADERSHIP, FACILITIES } from '../data/companyData';
import { ShieldCheck, Target, Eye, Award, Users, ChevronRight } from 'lucide-react';

interface AboutViewProps {
  onOpenContact: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenContact }) => {
  return (
    <div className="about-view">
      {/* Hero */}
      <section
        style={{
          padding: 'clamp(28px, 4.5vw, 54px) 0',
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(6, 2, 138, 0.4), var(--paper) 80%)',
          borderBottom: '1px solid var(--color-border-default)',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>
            <span className="eyebrow-dot" />
            <span>About Ascend Laboratories</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: 'var(--ink)', marginBottom: '20px' }}>
            Dedicated to Expanding Healthcare Access Through Science & Integrity
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--ink-2)', lineHeight: 1.7, margin: 0 }}>
            Ascend Laboratories is an established US pharmaceutical company focused on delivering dependable, affordable, high-quality generic medications to healthcare providers and millions of patients.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div className="card" style={{ padding: '32px', backgroundColor: 'var(--paper)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(6, 2, 138, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Target size={26} strokeWidth={1.6} color="var(--brand-navy)" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>Our Mission</h3>
              <p style={{ color: 'var(--ink-3)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
                To democratize healthcare access across the United States by formulating and delivering high-quality, bioequivalent generic prescription pharmaceuticals that exceed regulatory standards and reduce healthcare costs.
              </p>
            </div>

            <div className="card" style={{ padding: '32px', backgroundColor: 'var(--paper)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(15, 122, 85, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Eye size={26} strokeWidth={1.6} color="var(--ok)" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>Our Vision</h3>
              <p style={{ color: 'var(--ink-3)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
                To be the most trusted and resilient partner in American pharmaceutical supply, known for unwavering compliance, manufacturing agility, and unbroken availability of critical medicines.
              </p>
            </div>

            <div className="card" style={{ padding: '32px', backgroundColor: 'var(--paper)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(242, 61, 38, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Award size={26} strokeWidth={1.6} color="var(--brand-red)" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>Our Core Values</h3>
              <p style={{ color: 'var(--ink-3)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
                Scientific Rigor, Total Regulatory Transparency, Patient-Centric Ethics, Operational Reliability, and Long-Term Wholesale Partnerships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>
              <span className="eyebrow-dot" />
              <span>Executive Stewardship</span>
            </div>
            <h2 className="section-title">Senior Leadership Team</h2>
            <p className="section-description" style={{ margin: '0 auto' }}>
              Our executive leadership brings over a century of collective expertise in pharmaceutical science, FDA regulatory affairs, and national supply operations.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '24px' }}>
            {LEADERSHIP.map((leader) => (
              <div
                key={leader.id}
                className="card"
                style={{
                  padding: '28px',
                  backgroundColor: 'var(--paper)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(6, 2, 138, 0.4)',
                      border: '1px solid rgba(6, 2, 138, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}
                  >
                    <Users size={24} strokeWidth={1.6} color="var(--brand-navy)" />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
                    {leader.name}
                  </h3>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-navy)', marginBottom: '12px' }}>
                    {leader.role}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.6, marginBottom: '16px' }}>
                    {leader.bio}
                  </p>
                </div>

                <div style={{ paddingTop: '12px', borderTop: '1px solid var(--line)', fontSize: '11px', color: 'var(--ink-4)' }}>
                  {leader.credentials}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities & Footprint */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header text-center">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>
              <span className="eyebrow-dot" />
              <span>Infrastructure Footprint</span>
            </div>
            <h2 className="section-title">Strategic US Operations & Logistics</h2>
            <p className="section-description" style={{ margin: '0 auto' }}>
              Multi-facility network engineered for strict quality control, continuous stability testing, and same-day institutional order processing.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {FACILITIES.map((fac) => (
              <div
                key={fac.id}
                className="card"
                style={{
                  padding: '24px',
                  backgroundColor: 'var(--paper)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span className="badge badge-blue">{fac.type}</span>
                  <span style={{ fontSize: '12px', color: 'var(--ink-3)', fontFamily: 'monospace' }}>{fac.sqft}</span>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
                  {fac.name}
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--brand-navy)', marginBottom: '16px' }}>
                  {fac.location}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-4)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Core Capabilities
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {fac.capabilities.map((cap, i) => (
                      <span key={i} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--line)', color: 'var(--ink-2)' }}>
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--ok)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} strokeWidth={1.6} /> {fac.certifications.join(' • ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '60px 0', backgroundColor: 'var(--paper)', textAlign: 'center', borderTop: '1px solid var(--color-border-default)' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink)', marginBottom: '12px' }}>
            Interested in Partnering with Ascend Laboratories?
          </h2>
          <p style={{ color: 'var(--ink-3)', fontSize: '15px', marginBottom: '24px' }}>
            Reach out to our executive business development and commercial trade teams to discuss formulary integration, contract pricing, or joint ventures.
          </p>
          <button onClick={onOpenContact} className="btn btn-primary btn-lg">
            Connect With Our Team <ChevronRight size={16} strokeWidth={1.6} />
          </button>
        </div>
      </section>
    </div>
  );
};
