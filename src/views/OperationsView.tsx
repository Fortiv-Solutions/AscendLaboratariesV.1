import React from 'react';
import { FACILITIES } from '../data/companyData';
import { Cpu, Package, Layers, ChevronRight, ThermometerSnowflake } from 'lucide-react';

interface OperationsViewProps {
  onOpenContact: () => void;
}

export const OperationsView: React.FC<OperationsViewProps> = ({ onOpenContact }) => {
  return (
    <div className="operations-view">
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
            <span>Manufacturing & Supply Chain Resilience</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: 'var(--ink)', marginBottom: '20px' }}>
            High-Speed cGMP Manufacturing & Secure National Distribution
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--ink-2)', lineHeight: 1.7, margin: 0 }}>
            Our integrated operations ecosystem is built for high-throughput generic production, temperature-controlled logistics, and strict DSCSA unit-level drug traceability.
          </p>
        </div>
      </section>

      {/* Manufacturing Capabilities */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header text-center">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>
              <span className="eyebrow-dot" />
              <span>Core Manufacturing Infrastructure</span>
            </div>
            <h2 className="section-title">Automated Production Lines</h2>
            <p className="section-description" style={{ margin: '0 auto' }}>
              Engineered with modern enclosed granulation, rotary tablet compression, automated encapsulation, and multi-layer film coating.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="card" style={{ padding: '28px', backgroundColor: 'var(--paper)' }}>
              <Cpu size={32} strokeWidth={1.6} color="var(--brand-navy)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
                Solid Oral Dosage Lines
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6, margin: 0 }}>
                High-capacity rotary tablet presses and automated capsule filling machines capable of producing over 4 billion solid dosage units annually under enclosed dust-free cGMP containment.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', backgroundColor: 'var(--paper)' }}>
              <Layers size={32} strokeWidth={1.6} color="var(--ok)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
                Delayed & Extended-Release
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6, margin: 0 }}>
                Specialized fluid-bed wurster coating systems for precision functional enteric coating, pH-dependent release pellets, and controlled-release hydrophilic matrices.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', backgroundColor: 'var(--paper)' }}>
              <ThermometerSnowflake size={32} strokeWidth={1.6} color="var(--brand-navy)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
                Cold-Chain & Climate Control
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6, margin: 0 }}>
                Validated 2°C to 8°C cold-chain storage and strictly monitored 20°C to 25°C USP warehouse suites with continuous real-time wireless telemetry logging.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', backgroundColor: 'var(--paper)' }}>
              <Package size={32} strokeWidth={1.6} color="var(--brand-red-press)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
                High-Speed Packaging & DSCSA
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6, margin: 0 }}>
                Multi-lane bottle packaging, unit-dose thermoform blister packing, and 2D DataMatrix serialization systems transmitting EPCIS data directly to trade networks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Overview */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>
              <span className="eyebrow-dot" />
              <span>Operational Locations</span>
            </div>
            <h2 className="section-title">North American Facility Network</h2>
            <p className="section-description" style={{ margin: '0 auto' }}>
              Dedicated sites strategically positioned near major logistics hubs for rapid fulfillment to hospital systems and wholesaler distribution centers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {FACILITIES.map((fac) => (
              <div key={fac.id} className="card" style={{ padding: '24px', backgroundColor: 'var(--paper)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="badge badge-blue">{fac.type}</span>
                  <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>{fac.sqft}</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>{fac.name}</h3>
                <div style={{ fontSize: '13px', color: 'var(--brand-navy)', marginBottom: '14px' }}>{fac.location}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {fac.capabilities.map((cap, i) => (
                    <span key={i} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--line)', color: 'var(--ink-2)' }}>
                      {cap}
                    </span>
                  ))}
                </div>
                <div style={{ paddingTop: '10px', borderTop: '1px solid var(--line)', fontSize: '11px', color: 'var(--ok)' }}>
                  {fac.certifications.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 0', backgroundColor: 'var(--paper)', textAlign: 'center', borderTop: '1px solid var(--color-border-default)' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink)', marginBottom: '12px' }}>
            Inquire About Contract Supply or Wholesale Ordering
          </h2>
          <p style={{ color: 'var(--ink-3)', fontSize: '15px', marginBottom: '24px' }}>
            Contact our supply chain and commercial fulfillment specialists to set up automated EDI ordering or direct drop-shipments.
          </p>
          <button onClick={onOpenContact} className="btn btn-primary btn-lg">
            Contact Trade Operations <ChevronRight size={16} strokeWidth={1.6} />
          </button>
        </div>
      </section>
    </div>
  );
};
