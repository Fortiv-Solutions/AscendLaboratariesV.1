import React, { useState } from 'react';
import { PressRelease } from '../types';
import { PRESS_RELEASES } from '../data/companyData';
import { Calendar, Search, ArrowRight, Newspaper } from 'lucide-react';

interface NewsViewProps {
  onSelectPressRelease: (pr: PressRelease) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({ onSelectPressRelease }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Regulatory Approval', 'Facility Expansion', 'Supply Chain', 'Product Launch'];

  const filteredReleases = PRESS_RELEASES.filter((pr) => {
    const matchesCategory = selectedCategory === 'All' || pr.category === selectedCategory;
    const matchesSearch =
      pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="news-view">
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
            <span>Corporate Communications</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: 800, color: 'var(--ink)', marginBottom: '16px' }}>
            News, Regulatory Updates & Press Releases
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
            Official announcements regarding FDA generic drug approvals, laboratory expansions, supply chain resilience initiatives, and trade partner notices.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          {/* Search & Filter Bar */}
          <div
            style={{
              backgroundColor: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              marginBottom: '32px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <Search size={18} strokeWidth={1.6} color="var(--ink-3)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search press releases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '38px' }}
                aria-label="Search press releases"
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: selectedCategory === cat ? 700 : 500,
                    backgroundColor: selectedCategory === cat ? 'var(--color-surface-strong)' : 'var(--line)',
                    color: selectedCategory === cat ? '#ffffff' : 'var(--ink-3)',
                    border: selectedCategory === cat ? '1px solid rgba(6, 2, 138, 0.3)' : '1px solid var(--line)',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Press Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {filteredReleases.map((pr) => (
              <article
                key={pr.id}
                className="card"
                onClick={() => onSelectPressRelease(pr)}
                style={{
                  cursor: 'pointer',
                  padding: '28px',
                  backgroundColor: 'var(--paper)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className="badge badge-purple">{pr.category}</span>
                    <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>{pr.readTime}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--ink-4)', marginBottom: '8px' }}>
                    <Calendar size={13} strokeWidth={1.6} color="var(--brand-navy)" /> {pr.date}
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.4, marginBottom: '10px' }}>
                    {pr.title}
                  </h3>

                  <p style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.6, marginBottom: '16px' }}>
                    {pr.summary}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-navy)', fontSize: '13px', fontWeight: 600, paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
                  Read Official Release <ArrowRight size={14} strokeWidth={1.6} />
                </div>
              </article>
            ))}
          </div>

          {filteredReleases.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 20px', backgroundColor: 'var(--paper)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)' }}>
              <Newspaper size={36} strokeWidth={1.6} color="var(--ink-4)" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '18px', color: 'var(--ink)', marginBottom: '6px' }}>No announcements found</h4>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)' }}>
                Try adjusting your search query or selecting a different category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
