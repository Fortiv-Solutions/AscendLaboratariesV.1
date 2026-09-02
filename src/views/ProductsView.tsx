import React, { useState } from 'react';
import { Product } from '../types';
import { PRODUCTS, THERAPEUTIC_AREAS } from '../data/productsData';
import { ProductCard } from '../components/ProductCard';
import { Search, Pill, X } from 'lucide-react';

interface ProductsViewProps {
  onSelectProduct: (product: Product) => void;
  onRequestQuote: (product: Product) => void;
  initialTherapy?: string;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  onSelectProduct,
  onRequestQuote,
  initialTherapy = 'All'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialTherapy);
  const [selectedDosageForm, setSelectedDosageForm] = useState<string>('All');
  const [onlyNew, setOnlyNew] = useState(false);

  const categories = ['All', ...THERAPEUTIC_AREAS.map((t) => t.name)];
  const dosageForms = ['All', 'Tablets', 'Capsules', 'Extended-Release'];

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.therapeuticCategory === selectedCategory;
    const matchesDosage = selectedDosageForm === 'All' || p.dosageForm === selectedDosageForm;
    const matchesNew = !onlyNew || p.isNew;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brandReference && p.brandReference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.ndc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.strength.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.therapeuticCategory.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesDosage && matchesNew && matchesSearch;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedDosageForm('All');
    setOnlyNew(false);
  };

  return (
    <div className="products-view">
      {/* Page Header */}
      <section
        style={{
          padding: 'clamp(28px, 4.5vw, 54px) 0',
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(6, 2, 138, 0.35), var(--paper) 75%)',
          borderBottom: '1px solid var(--color-border-default)'
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>
            <span className="eyebrow-dot" />
            <span>Prescription Pharmaceutical Portfolio</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: 800, color: 'var(--ink)', marginBottom: '16px' }}>
            Generic & Specialty Product Catalog
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
            Comprehensive NDC database of FDA-approved prescription medicines. Filter by active ingredient, therapeutic category, dosage form, or NDC package codes.
          </p>
        </div>
      </section>

      {/* Main Filter & Catalog Section */}
      <section className="section" style={{ paddingTop: '40px' }}>
        <div className="container">
          {/* Search & Filter Bar */}
          <div
            style={{
              backgroundColor: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              marginBottom: '32px'
            }}
          >
            {/* Top Row: Search Input */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Search
                size={20} strokeWidth={1.6}
                color="var(--brand-navy)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search by Generic Name, Brand Equivalent (e.g. Lipitor, Neurontin), NDC Number, or Strength..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px', fontSize: '15px' }}
                aria-label="Search pharmaceuticals"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--ink-3)', cursor: 'pointer' }}
                >
                  <X size={16} strokeWidth={1.6} />
                </button>
              )}
            </div>

            {/* Bottom Row: Multi-Filter Selectors */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-4)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Therapeutic Area
                  </label>
                  <select
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ fontSize: '13px', padding: '8px 12px', minWidth: '180px' }}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-4)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Dosage Form
                  </label>
                  <select
                    className="form-select"
                    value={selectedDosageForm}
                    onChange={(e) => setSelectedDosageForm(e.target.value)}
                    style={{ fontSize: '13px', padding: '8px 12px', minWidth: '140px' }}
                  >
                    {dosageForms.map((df) => (
                      <option key={df} value={df}>{df}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '18px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--ink-2)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={onlyNew}
                      onChange={(e) => setOnlyNew(e.target.checked)}
                      style={{ accentColor: 'var(--brand-navy)' }}
                    />
                    <span>New ANDA Approvals Only</span>
                  </label>
                </div>
              </div>

              {(searchTerm || selectedCategory !== 'All' || selectedDosageForm !== 'All' || onlyNew) && (
                <button
                  onClick={clearFilters}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--brand-red)', fontSize: '12px' }}
                >
                  <X size={14} strokeWidth={1.6} /> Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Summary Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', fontSize: '13px', color: 'var(--ink-3)' }}>
            <div>
              Showing <strong style={{ color: 'var(--ink)' }}>{filteredProducts.length}</strong> prescription formulations
              {selectedCategory !== 'All' && <span> in <strong style={{ color: 'var(--brand-navy)' }}>{selectedCategory}</strong></span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-blue">NDC Labeler: 67877</span>
            </div>
          </div>

          {/* Products Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: 'clamp(16px, 3vw, 24px)'
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onRequestQuote={onRequestQuote}
              />
            ))}
          </div>

          {/* Empty state */}
          {filteredProducts.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '64px 20px',
                backgroundColor: 'var(--paper)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--line)'
              }}
            >
              <Pill size={40} strokeWidth={1.6} color="var(--ink-4)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '20px', color: 'var(--ink)', marginBottom: '8px' }}>No matching products found</h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', maxWidth: '460px', margin: '0 auto 20px' }}>
                We couldn't find any formulations matching your current filter criteria. Try clearing search filters or searching for generic chemical names.
              </p>
              <button onClick={clearFilters} className="btn btn-primary btn-sm">
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
