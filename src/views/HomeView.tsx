import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Product, PressRelease, ActivePage } from '../types';
import { PRODUCTS, THERAPEUTIC_AREAS } from '../data/productsData';
import { KEY_METRICS, PRESS_RELEASES, MILESTONES } from '../data/companyData';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/motion/Reveal';
import { Tilt3D } from '../components/motion/Tilt3D';
import { Magnetic } from '../components/motion/Magnetic';
import { BrushStroke } from '../components/brand/Logo';

const ROTATING_WORDS = [
  'quality',
  'science',
  'rigor',
  'trust'
];

import {
  ShieldCheck,
  ArrowUpRight,
  ArrowRight,
  Search,
  Pill,
  Award,
  Building2,
  CheckCircle2,
  FileCheck2,
  Microscope,
  Layers,
  HeartPulse,
  Brain,
  ShieldAlert,
  Activity,
  Wind,
  Zap,
  Stethoscope,
  TrendingUp,
  Globe2
} from 'lucide-react';

// three.js is ~600kB — keep it out of the critical bundle.
const MoleculeScene = lazy(() =>
  import('../components/three/MoleculeScene').then((m) => ({ default: m.MoleculeScene }))
);

interface HomeViewProps {
  onSelectProduct: (product: Product) => void;
  onRequestQuote: (product: Product) => void;
  onSelectPressRelease: (pr: PressRelease) => void;
  setActivePage: (page: ActivePage) => void;
  onOpenSearch?: () => void;
  onOpenContact: () => void;
}

const ACCREDITATIONS = [
  'U.S. FDA Registered',
  '21 CFR Part 211 cGMP Compliant',
  'DEA Registered Schedules II–V',
  'NABP / VAWD Accredited',
  'DSCSA 2026 Serialized',
  'USP Monograph Verified',
  'ICH Q1A Stability Program'
];

const LIFECYCLE = [
  { step: '01', title: 'R&D Formulation', desc: 'Pre-formulation bioequivalence studies and dissolution profile optimization.' },
  { step: '02', title: 'FDA ANDA Filing', desc: 'Comprehensive regulatory dossier submission and bioequivalence review.' },
  { step: '03', title: 'cGMP Manufacturing', desc: 'High-speed automated blending, tableting, encapsulation, and fluid-bed drying.' },
  { step: '04', title: 'Analytical Lot Release', desc: 'Rigorous 100% Certificate of Analysis verification prior to dispatch.' },
  { step: '05', title: 'Cold-Chain & Storage', desc: 'Climate-controlled warehouse telemetry maintaining USP temperature integrity.' },
  { step: '06', title: 'Wholesale Distribution', desc: 'Direct EDI fulfilment to nationwide pharmacies, hospitals, and health systems.' }
];

const PILLARS = [
  {
    title: 'Unwavering Quality Discipline',
    desc: 'Zero tolerance for deviations. Every batch complies with USP dissolution and microbial limit monographs.',
    icon: <ShieldCheck size={22} strokeWidth={1.5} />,
    tone: ''
  },
  {
    title: 'Supply Chain Redundancy',
    desc: 'Dual-sourced active pharmaceutical ingredients protect healthcare partners from unexpected drug shortages.',
    icon: <Building2 size={22} strokeWidth={1.5} />,
    tone: 'icon-well-ok'
  },
  {
    title: 'Accessible & Fair Pricing',
    desc: 'Committed to lowering overall prescription drug expenditure for government and commercial health plans.',
    icon: <TrendingUp size={22} strokeWidth={1.5} />,
    tone: 'icon-well-red'
  },
  {
    title: 'Regulatory Agility',
    desc: 'Experienced US regulatory affairs team actively managing ANDA supplements, labeling, and compliance.',
    icon: <FileCheck2 size={22} strokeWidth={1.5} />,
    tone: ''
  }
];

const QUALITY_PILLARS = [
  {
    icon: <Microscope size={22} strokeWidth={1.5} />,
    title: 'Analytical Chemistry',
    desc: 'High-resolution HPLC, GC-MS, and UV spectrophotometry validating active ingredient assay.',
    tone: ''
  },
  {
    icon: <Award size={22} strokeWidth={1.5} />,
    title: 'cGMP Validation',
    desc: 'Continuous process verification and environmental monitoring across Class 100,000 cleanrooms.',
    tone: 'icon-well-ok'
  },
  {
    icon: <Activity size={22} strokeWidth={1.5} />,
    title: 'Stability & Shelf-Life',
    desc: 'ICH-compliant accelerated and real-time stability chambers ensuring long-term potency.',
    tone: ''
  },
  {
    icon: <ShieldCheck size={22} strokeWidth={1.5} />,
    title: 'Pharmacovigilance',
    desc: 'Dedicated 24/7 medical surveillance team ensuring prompt post-marketing safety reporting.',
    tone: 'icon-well-red'
  }
];

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectProduct,
  onRequestQuote,
  onSelectPressRelease,
  setActivePage,
  onOpenContact
}) => {
  const [selectedTherapy, setSelectedTherapy] = useState<string>('All');
  const [productSearch, setProductSearch] = useState<string>('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isWordFading, setIsWordFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsWordFading(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setIsWordFading(false);
      }, 320);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const therapyIcons: Record<string, React.ReactNode> = {
    Cardiovascular: <HeartPulse size={22} strokeWidth={1.5} />,
    'CNS & Neurology': <Brain size={22} strokeWidth={1.5} />,
    'Anti-Infectives': <ShieldAlert size={22} strokeWidth={1.5} />,
    Gastrointestinal: <Activity size={22} strokeWidth={1.5} />,
    Respiratory: <Wind size={22} strokeWidth={1.5} />,
    'Pain Management': <Zap size={22} strokeWidth={1.5} />,
    'Endocrinology & Metabolism': <Stethoscope size={22} strokeWidth={1.5} />,
    'Oncology Support': <Layers size={22} strokeWidth={1.5} />
  };

  const goTo = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesTherapy = selectedTherapy === 'All' || p.therapeuticCategory === selectedTherapy;
    const query = productSearch.toLowerCase();
    const matchesQuery =
      p.name.toLowerCase().includes(query) ||
      p.genericName.toLowerCase().includes(query) ||
      (p.brandReference && p.brandReference.toLowerCase().includes(query)) ||
      p.ndc.toLowerCase().includes(query);
    return matchesTherapy && matchesQuery;
  });

  return (
    <div className="home-view">
      {/* ==================================================================
          1. HERO — Editorial Split with the 3D molecular lattice
          ================================================================== */}
      {/* ==================================================================
          1. HERO — Editorial Split with the 3D molecular lattice & Telemetry
          ================================================================== */}
      <section
        style={{
          position: 'relative',
          paddingTop: 'clamp(8px, 1.4vw, 18px)',
          paddingBottom: 'clamp(40px, 4.5vw, 72px)',
          overflow: 'hidden'
        }}
      >
        <div className="grid-field" />
        <div
          className="orb orb-navy"
          style={{ width: '560px', height: '560px', top: '8%', right: '-6%', opacity: 0.85 }}
        />
        <div
          className="orb orb-red"
          style={{ width: '380px', height: '380px', bottom: '-10%', left: '-6%', opacity: 0.7 }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            className="bento"
            style={{ alignItems: 'center', gap: 'clamp(24px, 3.5vw, 48px)' }}
          >
            {/* Left — typography & direct search */}
            <div style={{ gridColumn: 'span 6' }}>
              <Reveal>
                <span className="eyebrow">
                  <span className="eyebrow-dot" />
                  United States Commercial Pharmaceuticals
                </span>
              </Reveal>

              <Reveal delay={70}>
                <h1 style={{ marginBottom: '20px', position: 'relative' }}>
                  Advancing healthcare
                  <br />
                  <span style={{ whiteSpace: 'nowrap' }}>
                    through{' '}
                    <span className="hero-rotator-wrapper">
                      <span
                        key={ROTATING_WORDS[wordIndex]}
                        className={`hero-rotator-word ${isWordFading ? 'is-fading' : ''}`}
                      >
                        {ROTATING_WORDS[wordIndex]}
                      </span>
                      <BrushStroke
                        width={200}
                        style={{
                          position: 'absolute',
                          left: '-4%',
                          bottom: '-0.25em',
                          width: '108%',
                          height: 'auto',
                          zIndex: 0,
                          pointerEvents: 'none'
                        }}
                      />
                    </span>
                    ,
                  </span>
                  <br />
                  innovation &amp; access
                </h1>
              </Reveal>

              <Reveal delay={140}>
                <p
                  style={{
                    fontSize: 'clamp(15px, 1.4vw, 17px)',
                    color: 'var(--ink-2)',
                    maxWidth: '52ch',
                    lineHeight: 1.62,
                    marginBottom: '24px'
                  }}
                >
                  Ascend Laboratories delivers high-barrier generic and specialty formulations manufactured under
                  stringent cGMP and FDA standards — ensuring dependable supply resilience for hospitals, pharmacies,
                  and patients nationwide.
                </p>
              </Reveal>

              <Reveal delay={200}>
                <div
                  className="stack-mobile"
                  style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginBottom: '32px' }}
                >
                  <Magnetic strength={8}>
                    <button onClick={() => goTo('products')} className="btn btn-primary btn-lg">
                      Explore Portfolio
                      <span className="btn-icon-well">
                        <ArrowUpRight size={16} strokeWidth={2} />
                      </span>
                    </button>
                  </Magnetic>

                  <Magnetic strength={6}>
                    <button onClick={() => goTo('quality')} className="btn btn-secondary btn-lg">
                      <ShieldCheck size={17} strokeWidth={1.6} color="var(--brand-red)" />
                      Quality Standards
                    </button>
                  </Magnetic>
                </div>
              </Reveal>

              {/* Floating credential chips */}
              <Reveal delay={280}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="hero-chip">
                    <FileCheck2 size={15} strokeWidth={1.8} color="var(--brand-navy)" />
                    300+ ANDA approvals
                  </span>
                  <span className="hero-chip">
                    <Microscope size={15} strokeWidth={1.8} color="var(--ok)" />
                    100% CoA verification
                  </span>
                  <span className="hero-chip">
                    <Globe2 size={15} strokeWidth={1.8} color="var(--brand-red)" />
                    Nationwide supply
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Right — WebGL molecular lattice */}
            <div style={{ gridColumn: 'span 6' }}>
              <div className="hero-stage">
                <Suspense fallback={null}>
                  <MoleculeScene className="hero-canvas" />
                </Suspense>

                {/* Ambient stand-in visible until the WebGL scene mounts */}
                <div className="hero-halo" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          2. ACCREDITATION TICKER
          ================================================================== */}
      <section
        className="marquee"
        style={{
          borderTop: '1px solid var(--line)',
          borderBottom: '1px solid var(--line)',
          backgroundColor: 'var(--mist)',
          padding: '18px 0'
        }}
        aria-label="Regulatory accreditations"
      >
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} style={{ display: 'flex' }} aria-hidden={copy === 1}>
              {ACCREDITATIONS.map((label) => (
                <span key={label} className="ticker-item">
                  <CheckCircle2 size={14} strokeWidth={1.7} color="var(--brand-navy)" />
                  {label}
                  <span className="ticker-sep" style={{ marginLeft: '20px' }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================
          3. CORPORATE PURPOSE — asymmetric bento
          ================================================================== */}
      <section className="section">
        <div className="container">
          <div className="bento" style={{ alignItems: 'center', gap: 'clamp(32px, 5vw, 64px)' }}>
            <Reveal style={{ gridColumn: 'span 6' }}>
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                Our Corporate Purpose
              </span>
              <h2 className="section-title">Expanding healthcare access with scientific discipline</h2>
              <p style={{ color: 'var(--ink-2)', fontSize: '16px', lineHeight: 1.7, marginBottom: '18px' }}>
                At Ascend Laboratories we believe affordable medicine should never mean compromised quality. As an
                established American pharmaceutical manufacturer, we specialise in high-demand generic oral solids,
                delayed-release therapeutics, and critical care medicines.
              </p>
              <p style={{ color: 'var(--ink-3)', fontSize: '15px', lineHeight: 1.7, marginBottom: '30px' }}>
                From our corporate headquarters in New Jersey to our nationwide distribution network, every batch
                undergoes comprehensive chromatography, dissolution, and microbiological assay verification before
                commercial release.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '34px' }}>
                {[
                  {
                    label: 'Direct wholesale integration',
                    body: 'Seamless EDI ordering for McKesson, AmerisourceBergen, Cardinal Health, and independent pharmacy cooperatives.'
                  },
                  {
                    label: 'Patient-first pricing',
                    body: 'Reducing out-of-pocket costs on life-sustaining cardiovascular, neurology, and anti-infective medications.'
                  }
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '13px' }}>
                    <CheckCircle2
                      size={18}
                      strokeWidth={1.7}
                      color="var(--brand-red)"
                      style={{ marginTop: '3px', flexShrink: 0 }}
                    />
                    <p style={{ fontSize: '14px', color: 'var(--ink-3)', margin: 0, lineHeight: 1.65 }}>
                      <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>{item.label}:</strong> {item.body}
                    </p>
                  </div>
                ))}
              </div>

              <Magnetic strength={6}>
                <button onClick={() => goTo('about')} className="btn btn-secondary">
                  Learn more about Ascend
                  <span className="btn-icon-well">
                    <ArrowRight size={13} strokeWidth={2} />
                  </span>
                </button>
              </Magnetic>
            </Reveal>

            {/* Quality assurance matrix — navy card in a double bezel */}
            <Reveal delay={120} style={{ gridColumn: 'span 6' }}>
              <Tilt3D max={5} depth={20}>
                <div className="bezel" style={{ background: 'linear-gradient(180deg, rgba(6,2,138,0.1), rgba(6,2,138,0.03))' }}>
                  <div
                    className="bezel-core card-navy"
                    style={{ padding: 'clamp(24px, 3vw, 34px)', borderRadius: 'calc(var(--radius-2xl) - var(--bezel-pad))' }}
                  >
                    <div
                      className="tilt-layer"
                      style={{
                        ['--depth' as string]: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '26px',
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <span className="badge badge-blue">Quality Assurance Matrix</span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#8ee3bd',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontWeight: 600
                        }}
                      >
                        <span className="live-dot" style={{ background: '#8ee3bd' }} />
                        Live facility verification
                      </span>
                    </div>

                    <div
                      className="tilt-layer"
                      style={{ ['--depth' as string]: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}
                    >
                      {[
                        {
                          title: 'Analytical Method Validation',
                          value: '100% passed',
                          valueColor: '#ffffff',
                          body: 'HPLC and mass-spectrometry assays matching USP reference standards.',
                          highlight: true
                        },
                        {
                          title: 'Controlled Room Temperature',
                          value: '20 – 25 °C',
                          valueColor: '#8ee3bd',
                          body: 'Continuous automated telemetry across all nationwide distribution centers.',
                          highlight: false
                        },
                        {
                          title: 'Unit-Level Serialization',
                          value: '2D DataMatrix',
                          valueColor: '#ff9a86',
                          body: 'Complete EPCIS digital traceability from manufacturing floor to dispensing pharmacy.',
                          highlight: false
                        }
                      ].map((row) => (
                        <div
                          key={row.title}
                          style={{
                            padding: '17px 18px',
                            backgroundColor: row.highlight ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)',
                            border: `1px solid ${row.highlight ? 'rgba(255,255,255,0.24)' : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'baseline',
                              gap: '12px',
                              marginBottom: '5px'
                            }}
                          >
                            <strong style={{ fontSize: '14px', color: '#fff', fontWeight: 700 }}>{row.title}</strong>
                            <span style={{ fontSize: '12px', color: row.valueColor, fontWeight: 700, whiteSpace: 'nowrap' }}>
                              {row.value}
                            </span>
                          </div>
                          <span style={{ fontSize: '12px', color: 'var(--ink-on-navy-3)', lineHeight: 1.6 }}>
                            {row.body}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Tilt3D>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==================================================================
          4. KEY METRICS — editorial numerals
          ================================================================== */}
      <section className="section-alt" style={{ paddingBlock: 'clamp(56px, 7vw, 96px)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '1px',
              backgroundColor: 'var(--line)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-1)'
            }}
          >
            {KEY_METRICS.map((metric, index) => (
              <Reveal
                key={metric.label}
                delay={index * 80}
                style={{ backgroundColor: 'var(--paper)', padding: 'clamp(26px, 3vw, 38px) 26px' }}
              >
                <span className="stat-value" style={{ fontSize: 'clamp(40px, 4.6vw, 58px)', marginBottom: '14px' }}>
                  {metric.value}
                  <span className="stat-suffix">{metric.suffix}</span>
                </span>
                <h4 style={{ fontSize: '15px', color: 'var(--ink)', marginBottom: '7px', letterSpacing: '-0.015em' }}>
                  {metric.label}
                </h4>
                <p style={{ fontSize: '12.5px', color: 'var(--ink-3)', margin: 0, lineHeight: 1.6 }}>
                  {metric.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================
          5. PRODUCT PORTFOLIO
          ================================================================== */}
      <section className="section" id="products-catalog">
        <div className="container">
          <Reveal
            className="section-header"
            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px' }}
          >
            <div>
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                Pharmaceutical Portfolio
              </span>
              <h2 className="section-title">Commercial generic product catalog</h2>
              <p className="section-description">
                FDA-approved prescription formulations with full prescribing information, NDC package codes, and
                dosage formats.
              </p>
            </div>

            <Magnetic strength={5}>
              <button onClick={() => goTo('products')} className="btn btn-secondary btn-sm">
                View full database
                <span className="btn-icon-well">
                  <ArrowRight size={12} strokeWidth={2} />
                </span>
              </button>
            </Magnetic>
          </Reveal>

          {/* Filter bar */}
          <Reveal
            style={{
              backgroundColor: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-xl)',
              padding: '16px 18px',
              marginBottom: '32px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-1)'
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '240px' }}>
              <Search
                size={17}
                strokeWidth={1.7}
                color="var(--ink-4)"
                style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
              />
              <input
                type="text"
                placeholder="Filter by drug name, brand reference, or NDC…"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '43px', margin: 0 }}
                aria-label="Filter products"
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => setSelectedTherapy('All')}
                className="pill"
                aria-pressed={selectedTherapy === 'All'}
              >
                All products ({PRODUCTS.length})
              </button>
              {['Cardiovascular', 'CNS & Neurology', 'Anti-Infectives', 'Gastrointestinal'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedTherapy(cat)}
                  className="pill"
                  aria-pressed={selectedTherapy === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '22px'
            }}
          >
            {filteredProducts.slice(0, 6).map((product, index) => (
              <Reveal key={product.id} delay={index * 70}>
                <ProductCard product={product} onSelect={onSelectProduct} onRequestQuote={onRequestQuote} />
              </Reveal>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '64px 24px',
                backgroundColor: 'var(--mist)',
                borderRadius: 'var(--radius-xl)',
                border: '1px dashed var(--line-2)'
              }}
            >
              <span className="icon-well" style={{ margin: '0 auto 16px' }}>
                <Pill size={22} strokeWidth={1.5} />
              </span>
              <h4 style={{ fontSize: '18px', color: 'var(--ink)', marginBottom: '7px' }}>No formulations found</h4>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', margin: 0 }}>
                Try adjusting your search keywords or switching category filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ==================================================================
          6. THERAPEUTIC AREAS
          ================================================================== */}
      <section className="section section-alt">
        <div className="container">
          <Reveal className="section-header text-center">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              Clinical Focus Areas
            </span>
            <h2 className="section-title">Major therapeutic categories</h2>
            <p className="section-description" style={{ marginInline: 'auto' }}>
              Targeted development across high-volume essential disease states, supporting patient outcomes through
              reliable formulation stability.
            </p>
          </Reveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(276px, 1fr))',
              gap: '20px'
            }}
          >
            {THERAPEUTIC_AREAS.map((area, index) => (
              <Reveal key={area.id} delay={(index % 4) * 70}>
                <Tilt3D
                  max={6}
                  depth={24}
                  onClick={() => goTo('products')}
                  role="button"
                  tabIndex={0}
                  ariaLabel={`${area.name} — view products`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      goTo('products');
                    }
                  }}
                >
                  <div
                    className="card card-accent"
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                      padding: '26px'
                    }}
                  >
                    <div className="tilt-layer" style={{ ['--depth' as string]: '18px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '20px',
                          gap: '10px'
                        }}
                      >
                        <span className={`icon-well ${index % 3 === 1 ? 'icon-well-red' : ''}`}>
                          {therapyIcons[area.name] || <Pill size={22} strokeWidth={1.5} />}
                        </span>
                        <span className="badge badge-blue">{area.productCount} formulations</span>
                      </div>

                      <h3 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--ink)', marginBottom: '9px' }}>
                        {area.name}
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.65, marginBottom: '18px' }}>
                        {area.description}
                      </p>
                    </div>

                    <div
                      className="tilt-layer"
                      style={{
                        ['--depth' as string]: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        paddingTop: '15px',
                        borderTop: '1px solid var(--line)'
                      }}
                    >
                      <span style={{ fontSize: '12px', color: 'var(--ink-3)', fontWeight: 500 }}>{area.highlight}</span>
                      <span className="btn-icon-well" style={{ margin: 0, background: 'rgba(6,2,138,0.07)' }}>
                        <ArrowUpRight size={13} strokeWidth={2} color="var(--brand-navy)" />
                      </span>
                    </div>
                  </div>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================
          7. QUALITY & COMPLIANCE
          ================================================================== */}
      <section className="section" id="quality-showcase">
        <div className="container">
          <div className="bento" style={{ alignItems: 'center', gap: 'clamp(36px, 5vw, 64px)' }}>
            <Reveal style={{ gridColumn: 'span 6' }}>
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                Strict Regulatory Discipline
              </span>
              <div className="brush-rule" />
              <p className="pull-quote" style={{ marginBottom: '26px' }}>
                “Quality is not a department. It is our standard.”
              </p>
              <p style={{ color: 'var(--ink-3)', fontSize: '15px', lineHeight: 1.7, marginBottom: '30px' }}>
                Every formulation marketed under the Ascend Laboratories label adheres to cGMP (21 CFR Part 210/211)
                guidelines. Our internal quality audit mechanisms enforce strict oversight across raw material
                qualification, blending homogeneity, tablet hardness, dissolution profiles, and final packaging
                integrity.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '32px' }}>
                {[
                  { value: '99.8%', label: 'First-pass batch quality release rate', accent: 'var(--brand-navy)' },
                  { value: '100%', label: 'Finished lot retention & stability', accent: 'var(--ok)' }
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      padding: '18px 20px',
                      backgroundColor: 'var(--mist)',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius-lg)'
                    }}
                  >
                    <span
                      className="numeral"
                      style={{ color: stat.accent, fontSize: '28px', display: 'block', marginBottom: '6px' }}
                    >
                      {stat.value}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.5 }}>{stat.label}</span>
                  </div>
                ))}
              </div>

              <Magnetic strength={7}>
                <button onClick={() => goTo('quality')} className="btn btn-primary">
                  Explore compliance infrastructure
                  <span className="btn-icon-well">
                    <ArrowUpRight size={14} strokeWidth={2} />
                  </span>
                </button>
              </Magnetic>
            </Reveal>

            {/* Pillar grid in double bezels */}
            <div
              style={{
                gridColumn: 'span 6',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '16px'
              }}
            >
              {QUALITY_PILLARS.map((pillar, index) => (
                <Reveal key={pillar.title} delay={index * 80}>
                  <Tilt3D max={7} depth={20}>
                    <div className="bezel" style={{ height: '100%' }}>
                      <div className="bezel-core" style={{ padding: '22px' }}>
                        <span
                          className={`icon-well icon-well-sm ${pillar.tone}`}
                          style={{ marginBottom: '16px' }}
                        >
                          {pillar.icon}
                        </span>
                        <h4 style={{ fontSize: '15px', color: 'var(--ink)', marginBottom: '7px' }}>{pillar.title}</h4>
                        <p style={{ fontSize: '12.5px', color: 'var(--ink-3)', margin: 0, lineHeight: 1.6 }}>
                          {pillar.desc}
                        </p>
                      </div>
                    </div>
                  </Tilt3D>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          8. OPERATIONAL LIFECYCLE
          ================================================================== */}
      <section className="section section-alt">
        <div className="container">
          <Reveal className="section-header text-center">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              Pharmaceutical Operations
            </span>
            <h2 className="section-title">End-to-end operational lifecycle</h2>
            <p className="section-description" style={{ marginInline: 'auto' }}>
              From formulation and regulatory approval to cGMP manufacturing and nationwide DSCSA serialization.
            </p>
          </Reveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(258px, 1fr))',
              gap: '18px'
            }}
          >
            {LIFECYCLE.map((item, index) => (
              <Reveal key={item.step} delay={(index % 3) * 80}>
                <Tilt3D max={5} depth={18}>
                  <div className="card card-accent" style={{ height: '100%', padding: '26px' }}>
                    <div className="tilt-layer">
                      <span className="step-index" style={{ marginBottom: '14px' }}>
                        {item.step}
                      </span>
                      <h4 style={{ fontSize: '16px', color: 'var(--ink)', marginBottom: '9px' }}>{item.title}</h4>
                      <p style={{ fontSize: '13px', color: 'var(--ink-3)', margin: 0, lineHeight: 1.65 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </Tilt3D>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} style={{ textAlign: 'center', marginTop: '42px' }}>
            <Magnetic strength={6}>
              <button onClick={() => goTo('operations')} className="btn btn-secondary">
                Explore manufacturing infrastructure
                <span className="btn-icon-well">
                  <ArrowRight size={13} strokeWidth={2} />
                </span>
              </button>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      {/* ==================================================================
          9. THE ASCEND DIFFERENCE
          ================================================================== */}
      <section className="section">
        <div className="container">
          <Reveal className="section-header text-center">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              The Ascend Difference
            </span>
            <h2 className="section-title">Why healthcare leaders partner with us</h2>
            <p className="section-description" style={{ marginInline: 'auto' }}>
              We combine the technical agility of a specialised generic house with the regulatory rigor of a global
              pharmaceutical enterprise.
            </p>
          </Reveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(272px, 1fr))',
              gap: '20px'
            }}
          >
            {PILLARS.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 75}>
                <Tilt3D max={6} depth={22}>
                  <div className="card" style={{ height: '100%', padding: '30px' }}>
                    <div className="tilt-layer">
                      <span className={`icon-well ${pillar.tone}`} style={{ marginBottom: '20px' }}>
                        {pillar.icon}
                      </span>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>
                        {pillar.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.65, margin: 0 }}>
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================
          10. MILESTONES
          ================================================================== */}
      <section className="section section-alt">
        <div className="container">
          <Reveal className="section-header text-center">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              Corporate Milestones
            </span>
            <h2 className="section-title">Our growth &amp; heritage</h2>
            <p className="section-description" style={{ marginInline: 'auto' }}>
              A steady track record of pharmaceutical expansion, regulatory milestones, and healthcare partnerships.
            </p>
          </Reveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(218px, 1fr))',
              gap: '18px'
            }}
          >
            {MILESTONES.map((item, index) => (
              <Reveal key={item.year} delay={(index % 4) * 70}>
                <div className="card" style={{ height: '100%', padding: '24px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px',
                      gap: '10px'
                    }}
                  >
                    <span className="numeral" style={{ fontSize: '26px', color: 'var(--brand-navy)' }}>
                      {item.year}
                    </span>
                    <span className="badge badge-blue">{item.tag}</span>
                  </div>
                  <h4 style={{ fontSize: '15px', color: 'var(--ink)', marginBottom: '9px' }}>{item.title}</h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--ink-3)', lineHeight: 1.65, margin: 0 }}>
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================
          11. NEWS & PRESS
          ================================================================== */}
      <section className="section">
        <div className="container">
          <Reveal
            className="section-header"
            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px' }}
          >
            <div>
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                Corporate Communications
              </span>
              <h2 className="section-title">Latest regulatory news</h2>
              <p className="section-description">
                Official announcements regarding FDA approvals, facility modernization, and supply chain expansion.
              </p>
            </div>

            <Magnetic strength={5}>
              <button onClick={() => goTo('news')} className="btn btn-secondary btn-sm">
                All press releases
                <span className="btn-icon-well">
                  <ArrowRight size={12} strokeWidth={2} />
                </span>
              </button>
            </Magnetic>
          </Reveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '22px'
            }}
          >
            {PRESS_RELEASES.map((pr, index) => (
              <Reveal key={pr.id} delay={(index % 3) * 80}>
                <Tilt3D
                  max={5}
                  depth={20}
                  onClick={() => onSelectPressRelease(pr)}
                  role="button"
                  tabIndex={0}
                  ariaLabel={`Read: ${pr.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectPressRelease(pr);
                    }
                  }}
                >
                  <article
                    className="card card-accent"
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                      padding: '26px'
                    }}
                  >
                    <div className="tilt-layer" style={{ ['--depth' as string]: '16px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '16px',
                          gap: '10px'
                        }}
                      >
                        <span className="badge badge-purple">{pr.category}</span>
                        <span style={{ fontSize: '11px', color: 'var(--ink-4)', fontWeight: 500 }}>{pr.readTime}</span>
                      </div>

                      <span
                        className="mono"
                        style={{
                          fontSize: '11px',
                          color: 'var(--ink-4)',
                          display: 'block',
                          marginBottom: '10px',
                          letterSpacing: '0.04em'
                        }}
                      >
                        {pr.date.toUpperCase()}
                      </span>

                      <h3
                        style={{
                          fontSize: '17px',
                          fontWeight: 700,
                          color: 'var(--ink)',
                          lineHeight: 1.35,
                          marginBottom: '12px',
                          letterSpacing: '-0.022em'
                        }}
                      >
                        {pr.title}
                      </h3>

                      <p
                        style={{
                          fontSize: '13px',
                          color: 'var(--ink-3)',
                          lineHeight: 1.65,
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {pr.summary}
                      </p>
                    </div>

                    <span
                      className="tilt-layer"
                      style={{
                        ['--depth' as string]: '26px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--brand-navy)',
                        fontSize: '13px',
                        fontWeight: 600,
                        marginTop: '20px',
                        paddingTop: '16px',
                        borderTop: '1px solid var(--line)'
                      }}
                    >
                      Read full release
                      <span className="btn-icon-well" style={{ margin: 0, background: 'rgba(6,2,138,0.07)' }}>
                        <ArrowUpRight size={13} strokeWidth={2} />
                      </span>
                    </span>
                  </article>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================
          12. CLOSING CTA — navy
          ================================================================== */}
      <section className="section-navy on-navy" style={{ paddingBlock: 'clamp(72px, 9vw, 120px)' }}>
        <div className="orb orb-red" style={{ width: '620px', height: '620px', top: '-38%', left: '-6%' }} />
        <div
          className="orb"
          style={{
            width: '520px',
            height: '520px',
            bottom: '-42%',
            right: '-4%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.16), transparent 70%)'
          }}
        />

        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Reveal style={{ maxWidth: '820px', marginInline: 'auto' }}>
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              Commercial Supply &amp; Licensing
            </span>
            <h2
              style={{
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.08,
                letterSpacing: '-0.035em',
                marginBottom: '20px'
              }}
            >
              Let’s build a more resilient healthcare supply chain
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--ink-on-navy-2)',
                lineHeight: 1.68,
                marginBottom: '38px',
                maxWidth: '62ch',
                marginInline: 'auto'
              }}
            >
              Whether you are an institutional health system seeking critical drug supply, a retail pharmacy chain
              expanding your generic formulary, or a commercial distributor, our trade operations team is ready to
              assist.
            </p>

            <div
              className="stack-mobile"
              style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '13px' }}
            >
              <Magnetic strength={8}>
                <button onClick={onOpenContact} className="btn btn-invert btn-lg">
                  Contact commercial sales
                  <span className="btn-icon-well">
                    <ArrowUpRight size={16} strokeWidth={2} />
                  </span>
                </button>
              </Magnetic>

              <Magnetic strength={6}>
                <button onClick={() => goTo('products')} className="btn btn-secondary btn-lg">
                  Browse generic catalog
                </button>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
