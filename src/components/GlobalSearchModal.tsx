import React, { useState, useEffect, useRef } from 'react';
import { Product, PressRelease } from '../types';
import { PRODUCTS, THERAPEUTIC_AREAS } from '../data/productsData';
import { PRESS_RELEASES } from '../data/companyData';
import { Search, X, ChevronRight, Pill, ArrowRight } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectPressRelease: (pr: PressRelease) => void;
  onSelectTherapy: (therapyName: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectPressRelease,
  onSelectTherapy
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via parent
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const filteredProducts = cleanQuery
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.genericName.toLowerCase().includes(cleanQuery) ||
          (p.brandReference && p.brandReference.toLowerCase().includes(cleanQuery)) ||
          p.ndc.toLowerCase().includes(cleanQuery) ||
          p.therapeuticCategory.toLowerCase().includes(cleanQuery) ||
          p.strength.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredTherapies = cleanQuery
    ? THERAPEUTIC_AREAS.filter((t) => t.name.toLowerCase().includes(cleanQuery))
    : [];

  const filteredPress = cleanQuery
    ? PRESS_RELEASES.filter(
        (pr) =>
          pr.title.toLowerCase().includes(cleanQuery) ||
          pr.category.toLowerCase().includes(cleanQuery) ||
          pr.summary.toLowerCase().includes(cleanQuery)
      )
    : [];

  const hasResults =
    filteredProducts.length > 0 || filteredTherapies.length > 0 || filteredPress.length > 0;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          width: '95%',
          backgroundColor: 'var(--haze)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Search Header Bar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'var(--mist)'
          }}
        >
          <Search size={20} strokeWidth={1.6} color="var(--brand-navy)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by drug name, active ingredient, brand reference (e.g. Lipitor), NDC, or news..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: 'var(--ink)',
              fontSize: '15px',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ color: 'var(--ink-3)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <X size={16} strokeWidth={1.6} />
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              fontSize: '12px',
              padding: '4px 8px',
              backgroundColor: 'var(--line)',
              border: '1px solid var(--line)',
              borderRadius: '4px',
              color: 'var(--ink-2)',
              cursor: 'pointer'
            }}
          >
            ESC
          </button>
        </div>

        {/* Search Results / Suggestions */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '16px 20px' }}>
          {!cleanQuery && (
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-4)', fontWeight: 600, display: 'block', marginBottom: '10px' }}>
                Quick Therapeutic Discovery
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {THERAPEUTIC_AREAS.slice(0, 5).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onClose();
                      onSelectTherapy(t.name);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      backgroundColor: 'var(--mist)',
                      border: '1px solid var(--line)',
                      color: 'var(--ink-2)',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>

              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-4)', fontWeight: 600, display: 'block', marginBottom: '10px' }}>
                Featured Formulations
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {PRODUCTS.filter((p) => p.featured).slice(0, 3).map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      onClose();
                      onSelectProduct(prod);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--line)',
                      border: '1px solid var(--line)',
                      color: 'var(--ink)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '14px', display: 'block' }}>{prod.name}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>
                        NDC {prod.ndc} • {prod.strength}
                      </span>
                    </div>
                    <ChevronRight size={16} strokeWidth={1.6} color="var(--ink-3)" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {cleanQuery && !hasResults && (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <Pill size={32} strokeWidth={1.6} color="var(--ink-4)" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '16px', color: 'var(--ink)', marginBottom: '4px' }}>No direct matches found</h4>
              <p style={{ fontSize: '13px', color: 'var(--ink-3)' }}>
                We couldn't find any products or news matching "{query}". Please try searching by generic ingredient or broad category.
              </p>
            </div>
          )}

          {cleanQuery && hasResults && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Product Matches */}
              {filteredProducts.length > 0 && (
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand-navy)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    Pharmaceutical Formulations ({filteredProducts.length})
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {filteredProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onClose();
                          onSelectProduct(p);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--mist)',
                          border: '1px solid var(--line)',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>{p.name}</strong>
                            <span className="badge badge-blue" style={{ fontSize: '10px' }}>{p.dosageForm}</span>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--ink-3)', marginTop: '2px' }}>
                            Generic for: <span style={{ color: 'var(--brand-navy)' }}>{p.brandReference}</span> • NDC: {p.ndc}
                          </div>
                        </div>
                        <ArrowRight size={16} strokeWidth={1.6} color="var(--brand-navy)" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* News Matches */}
              {filteredPress.length > 0 && (
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand-navy)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    Press Releases & Regulatory Announcements ({filteredPress.length})
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {filteredPress.map((pr) => (
                      <button
                        key={pr.id}
                        onClick={() => {
                          onClose();
                          onSelectPressRelease(pr);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--mist)',
                          border: '1px solid var(--line)',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '13px', color: 'var(--ink)', display: 'block' }}>{pr.title}</strong>
                          <span style={{ fontSize: '11px', color: 'var(--ink-3)' }}>
                            {pr.category} • {pr.date}
                          </span>
                        </div>
                        <ArrowRight size={16} strokeWidth={1.6} color="var(--brand-navy)" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search Footer info */}
        <div style={{ padding: '10px 20px', backgroundColor: 'var(--mist)', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ink-4)' }}>
          <span>Press ESC to close</span>
          <span>Ascend Laboratories NDC Catalog Index</span>
        </div>
      </div>
    </div>
  );
};
