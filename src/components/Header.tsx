import React, { useState, useEffect } from 'react';
import { ActivePage } from '../types';
import { Search, ArrowUpRight, PhoneCall, ShieldCheck, ChevronRight } from 'lucide-react';
import { Logo } from './brand/Logo';
import { Magnetic } from './motion/Magnetic';

interface HeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onOpenSearch: () => void;
  onOpenAdverseEvent: () => void;
  onOpenContact: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  onOpenSearch,
  onOpenAdverseEvent
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock the page behind the full-bleed overlay
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const navItems: { id: ActivePage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'products', label: 'Products' },
    { id: 'quality', label: 'Quality' },
    { id: 'operations', label: 'Operations' },
    { id: 'news', label: 'News' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Corporate utility strip — navy band above the island */}
      <div className="utility-bar">
        <div
          className="container"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '18px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
              <ShieldCheck size={13} strokeWidth={1.6} />
              <span>
                <strong>FDA Registered</strong> &amp; cGMP compliant facility network
              </span>
            </span>
            <span className="hidden-sm" style={{ opacity: 0.4 }}>
              /
            </span>
            <span className="hidden-sm">Headquarters — Bridgewater, New Jersey</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span className="hidden-sm">Wholesaler support: 1-800-258-3720</span>
            <button
              onClick={onOpenAdverseEvent}
              className="utility-action"
              title="Report an adverse drug event or medical product inquiry"
            >
              <PhoneCall size={12} strokeWidth={1.8} /> Adverse Event Reporting
            </button>
          </div>
        </div>
      </div>

      <header className={`nav-shell ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="container">
          <div className="nav-island">
            {/* Brand lockup */}
            <button
              onClick={() => handleNavClick('home')}
              style={{ display: 'flex', alignItems: 'center', padding: 0, background: 'transparent' }}
              aria-label="Ascend Laboratories — home"
            >
              <Logo size={19} animateBrush />
            </button>

            {/* Desktop navigation */}
            <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2px' }} aria-label="Main">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="nav-link"
                  aria-current={activePage === item.id ? 'page' : undefined}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <button
                onClick={onOpenSearch}
                className="btn btn-secondary btn-sm"
                title="Search products and company info"
                aria-label="Open search"
                style={{ paddingInline: '14px' }}
              >
                <Search size={14} strokeWidth={1.7} />
                <span className="hidden-sm">Search NDC</span>
                <kbd
                  className="hidden-sm mono"
                  style={{
                    fontSize: '10px',
                    background: 'rgba(6, 2, 138, 0.07)',
                    padding: '2px 6px',
                    borderRadius: '5px',
                    color: 'var(--ink-3)',
                    fontWeight: 600
                  }}
                >
                  ⌘K
                </kbd>
              </button>

              <Magnetic strength={6} className="hidden-xs">
                <button
                  onClick={() => {
                    setActivePage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Partner With Us
                  <span className="btn-icon-well">
                    <ArrowUpRight size={13} strokeWidth={2} />
                  </span>
                </button>
              </Magnetic>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="burger"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav"
              >
                <span className="burger-lines" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-bleed overlay menu with staggered reveal */}
      {mobileMenuOpen && (
        <div className="nav-overlay" id="mobile-nav">
          <div className="nav-overlay-item" style={{ ['--stagger' as string]: '40ms', marginBottom: '10px' }}>
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              Corporate Navigation
            </span>
          </div>

          {navItems.map((item, index) => (
            <div
              key={item.id}
              className="nav-overlay-item"
              style={{ ['--stagger' as string]: `${80 + index * 55}ms` }}
            >
              <button
                onClick={() => handleNavClick(item.id)}
                className="nav-overlay-link"
                aria-current={activePage === item.id ? 'page' : undefined}
              >
                <span>{item.label}</span>
                <ChevronRight size={20} strokeWidth={1.4} color="var(--ink-4)" />
              </button>
            </div>
          ))}

          <div
            className="nav-overlay-item"
            style={{
              ['--stagger' as string]: `${80 + navItems.length * 55}ms`,
              marginTop: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="btn btn-secondary btn-lg"
              style={{ width: '100%' }}
            >
              <Search size={16} strokeWidth={1.7} /> Search Product Database
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              Commercial Inquiries
              <span className="btn-icon-well">
                <ArrowUpRight size={15} strokeWidth={2} />
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
