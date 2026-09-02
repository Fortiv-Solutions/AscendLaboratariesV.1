import React, { useState } from 'react';
import { ActivePage } from '../types';
import { ShieldCheck, Mail, Phone, MapPin, AlertCircle, ArrowUpRight, Check } from 'lucide-react';
import { Logo } from './brand/Logo';
import { Reveal } from './motion/Reveal';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  onOpenAdverseEvent: () => void;
  onOpenContact: () => void;
}

const PORTFOLIO_LINKS = [
  'Complete Generic Catalog',
  'Cardiovascular Therapies',
  'CNS & Neurology Solutions',
  'Anti-Infective & Antibacterial',
  'Gastrointestinal Formulations',
  'Extended & Delayed Release'
];

const COMPLIANCE_LINKS: { label: string; page: ActivePage }[] = [
  { label: 'cGMP Quality Philosophy', page: 'quality' },
  { label: 'FDA & Regulatory Affairs', page: 'quality' },
  { label: 'Manufacturing Capabilities', page: 'operations' },
  { label: 'Supply Chain & Cold-Chain', page: 'operations' },
  { label: 'DSCSA Drug Serialization', page: 'operations' }
];

const ACCREDITATIONS = [
  'U.S. FDA Registered & cGMP Compliant',
  'DEA Licensed Schedules II – V',
  'NABP / VAWD Distributor Accredited',
  'DSCSA 2026 Compliant Traceability'
];

export const Footer: React.FC<FooterProps> = ({ setActivePage, onOpenAdverseEvent, onOpenContact }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ marginTop: 'auto' }}>
      {/* Pharmacovigilance notice — red-keyed safety strip on white */}
      <div
        style={{
          backgroundColor: 'rgba(242, 61, 38, 0.05)',
          borderTop: '1px solid rgba(242, 61, 38, 0.16)',
          borderBottom: '1px solid rgba(242, 61, 38, 0.16)',
          padding: '20px 0'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', maxWidth: '720px' }}>
            <span className="icon-well icon-well-sm icon-well-red" style={{ marginTop: '1px' }}>
              <AlertCircle size={17} strokeWidth={1.7} />
            </span>
            <p style={{ fontSize: '13px', color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--ink)' }}>Medical information &amp; adverse event reporting —</strong>{' '}
              if you or a patient have experienced an adverse event related to an Ascend product, contact our
              pharmacovigilance safety team immediately.
            </p>
          </div>
          <button onClick={onOpenAdverseEvent} className="btn btn-accent btn-sm">
            Report Adverse Event
            <span className="btn-icon-well">
              <ArrowUpRight size={13} strokeWidth={2} />
            </span>
          </button>
        </div>
      </div>

      {/* Navy anchor */}
      <div className="section-navy on-navy" style={{ paddingTop: '72px', paddingBottom: '32px' }}>
        <div
          className="orb orb-red"
          style={{ width: '520px', height: '520px', top: '-30%', right: '-8%', opacity: 0.7 }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '48px',
              marginBottom: '64px'
            }}
          >
            {/* Brand column */}
            <Reveal style={{ minWidth: 0 }}>
              <div style={{ marginBottom: '24px' }}>
                <Logo size={26} tone="light" />
              </div>
              <p style={{ fontSize: '14px', color: 'var(--ink-on-navy-2)', lineHeight: 1.65, marginBottom: '26px' }}>
                Advancing healthcare through high-quality generic and specialty pharmaceuticals, reliable US
                distribution, and stringent cGMP regulatory standards.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '13px', fontSize: '13px' }}>
                <span style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--ink-on-navy-2)' }}>
                  <MapPin size={15} strokeWidth={1.6} color="#f23d26" style={{ marginTop: '3px', flexShrink: 0 }} />
                  350 Campus Dr, Suite 200, Bridgewater, NJ 08807
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--ink-on-navy-2)' }}>
                  <Phone size={15} strokeWidth={1.6} color="#f23d26" style={{ flexShrink: 0 }} />
                  Customer care: (877) 204-0601
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--ink-on-navy-2)' }}>
                  <Mail size={15} strokeWidth={1.6} color="#f23d26" style={{ flexShrink: 0 }} />
                  contact@ascendlaboratories.com
                </span>
              </div>
            </Reveal>

            {/* Portfolio */}
            <Reveal delay={80}>
              <h4 className="footer-heading">Product Portfolio</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '13px' }}>
                {PORTFOLIO_LINKS.map((label) => (
                  <li key={label}>
                    <button onClick={() => navigateTo('products')} className="footer-link">
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Compliance */}
            <Reveal delay={160}>
              <h4 className="footer-heading">Quality &amp; Compliance</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '13px' }}>
                {COMPLIANCE_LINKS.map((item) => (
                  <li key={item.label}>
                    <button onClick={() => navigateTo(item.page)} className="footer-link">
                      {item.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button onClick={onOpenAdverseEvent} className="footer-link" style={{ color: '#ff8f7e' }}>
                    Pharmacovigilance Reporting
                  </button>
                </li>
              </ul>
            </Reveal>

            {/* Trade alerts */}
            <Reveal delay={240}>
              <h4 className="footer-heading">Regulatory &amp; Trade Alerts</h4>
              <p style={{ fontSize: '13px', color: 'var(--ink-on-navy-2)', lineHeight: 1.6, marginBottom: '18px' }}>
                Official ANDA approval updates, product releases, and wholesaler supply announcements.
              </p>
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="email"
                  required
                  placeholder="Institutional email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '13px', padding: '12px 15px' }}
                  aria-label="Email address for trade alerts"
                />
                <button type="submit" className="btn btn-invert btn-sm" style={{ width: '100%' }}>
                  {subscribed ? (
                    <>
                      <Check size={14} strokeWidth={2.2} /> Subscribed to alerts
                    </>
                  ) : (
                    <>
                      Subscribe to trade notices
                      <span className="btn-icon-well">
                        <ArrowUpRight size={13} strokeWidth={2} />
                      </span>
                    </>
                  )}
                </button>
              </form>
            </Reveal>
          </div>

          {/* Accreditation strip */}
          <div
            style={{
              padding: '26px 0',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '18px',
              fontSize: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
              {ACCREDITATIONS.map((label) => (
                <span
                  key={label}
                  style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'var(--ink-on-navy-2)' }}
                >
                  <ShieldCheck size={14} strokeWidth={1.6} color="#f23d26" /> {label}
                </span>
              ))}
            </div>
            <span className="mono" style={{ color: 'var(--ink-on-navy-3)' }}>
              NDC LABELER CODE: 67877
            </span>
          </div>

          {/* Legal */}
          <div
            style={{
              paddingTop: '26px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              fontSize: '12px',
              color: 'var(--ink-on-navy-3)'
            }}
          >
            <span>© {new Date().getFullYear()} Ascend Laboratories, LLC. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {['Privacy Policy', 'Terms of Use', 'California Supply Chains Act', 'Accessibility (WCAG 2.2 AA)'].map(
                (label) => (
                  <button
                    key={label}
                    onClick={onOpenContact}
                    style={{ color: 'var(--ink-on-navy-3)', fontSize: '12px', padding: 0 }}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
