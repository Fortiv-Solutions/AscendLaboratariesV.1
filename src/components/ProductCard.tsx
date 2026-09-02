import React from 'react';
import { Product } from '../types';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Tilt3D } from './motion/Tilt3D';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onRequestQuote?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onRequestQuote }) => {
  return (
    <Tilt3D max={5} depth={22}>
      <article
        className="card card-accent"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          padding: '26px'
        }}
      >
        <div className="tilt-layer" style={{ ['--depth' as string]: '18px' }}>
          {/* Top badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              gap: '8px'
            }}
          >
            <span className="badge badge-blue">{product.therapeuticCategory}</span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {product.isNew && (
                <span className="badge badge-emerald">
                  <Sparkles size={10} strokeWidth={2} /> New ANDA
                </span>
              )}
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--ink-3)',
                  backgroundColor: 'var(--mist)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  border: '1px solid var(--line)'
                }}
              >
                {product.dosageForm}
              </span>
            </div>
          </div>

          {/* Names */}
          <h3
            style={{
              fontSize: '21px',
              fontWeight: 700,
              color: 'var(--ink)',
              marginBottom: '5px',
              lineHeight: 1.2,
              letterSpacing: '-0.028em'
            }}
          >
            {product.name}
          </h3>

          <div style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '18px', fontWeight: 500 }}>
            Generic for{' '}
            <strong style={{ color: 'var(--brand-red)', fontWeight: 600 }}>
              {product.brandReference || product.genericName}
            </strong>
          </div>

          {/* Spec well */}
          <dl
            style={{
              backgroundColor: 'var(--mist)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              marginBottom: '18px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              fontSize: '12px'
            }}
          >
            <div>
              <dt style={{ color: 'var(--ink-4)', marginBottom: '3px', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
                Strength
              </dt>
              <dd style={{ color: 'var(--ink)', fontWeight: 700, fontSize: '13px' }}>{product.strength}</dd>
            </div>
            <div>
              <dt style={{ color: 'var(--ink-4)', marginBottom: '3px', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
                NDC
              </dt>
              <dd className="mono" style={{ color: 'var(--brand-navy)', fontWeight: 600, fontSize: '13px' }}>
                {product.ndc}
              </dd>
            </div>
          </dl>

          <p
            style={{
              fontSize: '13px',
              color: 'var(--ink-3)',
              lineHeight: 1.6,
              marginBottom: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.indications}
          </p>
        </div>

        {/* Actions */}
        <div
          className="tilt-layer"
          style={{
            ['--depth' as string]: '30px',
            display: 'flex',
            gap: '8px',
            marginTop: '22px',
            paddingTop: '18px',
            borderTop: '1px solid var(--line)'
          }}
        >
          <button
            onClick={() => onSelect(product)}
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
          >
            View Full Specs
            <span className="btn-icon-well">
              <ArrowUpRight size={12} strokeWidth={2} />
            </span>
          </button>

          {onRequestQuote && (
            <button
              onClick={() => onRequestQuote(product)}
              className="btn btn-secondary btn-sm"
              title="Request commercial supply quote or sample"
            >
              Inquire
            </button>
          )}
        </div>
      </article>
    </Tilt3D>
  );
};
