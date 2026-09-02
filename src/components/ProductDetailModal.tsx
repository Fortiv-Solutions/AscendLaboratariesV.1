import React, { useState } from 'react';
import { Product } from '../types';
import { X, FileText, Download, ShieldAlert, CheckCircle2, Package, Mail, PhoneCall } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onRequestQuote: (product: Product) => void;
  onReportAdverseEvent: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onRequestQuote,
  onReportAdverseEvent
}) => {
  const [activeTab, setActiveTab] = useState<'clinical' | 'dosage' | 'packaging' | 'pi'>('clinical');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!product) return null;

  const handleDownloadPI = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="product-title">
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '850px',
          width: '95%',
          maxHeight: '90vh',
          backgroundColor: 'var(--haze)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '24px 28px',
            backgroundColor: 'var(--mist)',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-blue">{product.therapeuticCategory}</span>
              <span className="badge badge-emerald">{product.dosageForm}</span>
              <span style={{ fontSize: '12px', color: 'var(--ink-3)', fontFamily: 'monospace' }}>
                NDC: {product.ndc}
              </span>
            </div>
            <h2 id="product-title" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>
              {product.name}
            </h2>
            <div style={{ fontSize: '14px', color: 'var(--ink-2)' }}>
              <span>Generic Equivalent to: </span>
              <strong style={{ color: 'var(--brand-navy)' }}>{product.brandReference || product.genericName}</strong>
              <span style={{ margin: '0 8px', color: 'var(--ink-4)' }}>|</span>
              <span>Available Strengths: <strong style={{ color: 'var(--ink)' }}>{product.strength}</strong></span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Product Details Modal"
            style={{
              background: 'var(--line)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-md)',
              padding: '8px',
              color: 'var(--ink-2)',
              cursor: 'pointer'
            }}
          >
            <X size={20} strokeWidth={1.6} />
          </button>
        </div>

        {/* Modal Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--line)',
            backgroundColor: 'var(--mist)',
            padding: '0 28px',
            overflowX: 'auto'
          }}
        >
          <button
            onClick={() => setActiveTab('clinical')}
            style={{
              padding: '14px 18px',
              fontSize: '13px',
              fontWeight: 600,
              color: activeTab === 'clinical' ? 'var(--brand-navy)' : 'var(--ink-3)',
              borderBottom: activeTab === 'clinical' ? '2px solid var(--brand-navy)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Clinical Overview
          </button>
          <button
            onClick={() => setActiveTab('dosage')}
            style={{
              padding: '14px 18px',
              fontSize: '13px',
              fontWeight: 600,
              color: activeTab === 'dosage' ? 'var(--brand-navy)' : 'var(--ink-3)',
              borderBottom: activeTab === 'dosage' ? '2px solid var(--brand-navy)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Dosage & Administration
          </button>
          <button
            onClick={() => setActiveTab('packaging')}
            style={{
              padding: '14px 18px',
              fontSize: '13px',
              fontWeight: 600,
              color: activeTab === 'packaging' ? 'var(--brand-navy)' : 'var(--ink-3)',
              borderBottom: activeTab === 'packaging' ? '2px solid var(--brand-navy)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Packaging & Storage
          </button>
          <button
            onClick={() => setActiveTab('pi')}
            style={{
              padding: '14px 18px',
              fontSize: '13px',
              fontWeight: 600,
              color: activeTab === 'pi' ? 'var(--brand-navy)' : 'var(--ink-3)',
              borderBottom: activeTab === 'pi' ? '2px solid var(--brand-navy)' : '2px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Safety & Prescribing Info (PI)
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px', overflowY: 'auto', flex: 1, fontSize: '14px', lineHeight: 1.6 }}>
          {activeTab === 'clinical' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '14px', color: 'var(--brand-navy)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  Therapeutic Indications & Usage
                </h4>
                <p style={{ color: 'var(--ink-2)' }}>{product.indications}</p>
              </div>

              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '14px', color: 'var(--brand-navy)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  Product Description & Mechanism
                </h4>
                <p style={{ color: 'var(--ink-2)' }}>{product.description}</p>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(6, 2, 138, 0.08)',
                  border: '1px solid rgba(6, 2, 138, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px'
                }}
              >
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--ink-3)', display: 'block' }}>Generic Formulation</span>
                  <strong style={{ color: 'var(--ink)' }}>{product.genericName}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--ink-3)', display: 'block' }}>Therapeutic Classification</span>
                  <strong style={{ color: 'var(--ink)' }}>{product.therapeuticCategory}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--ink-3)', display: 'block' }}>Dosage Form</span>
                  <strong style={{ color: 'var(--ink)' }}>{product.dosageForm}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--ink-3)', display: 'block' }}>FDA Regulatory Status</span>
                  <strong style={{ color: 'var(--ok)' }}>Approved Abbreviated NDA</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dosage' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '14px', color: 'var(--brand-navy)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  Dosage and Administration Guidelines
                </h4>
                <p style={{ color: 'var(--ink-2)' }}>{product.dosageAdmin}</p>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--mist)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px'
                }}
              >
                <h5 style={{ fontSize: '13px', color: 'var(--ink)', marginBottom: '8px' }}>
                  Standard Commercial Formats & Strengths
                </h5>
                <p style={{ color: 'var(--ink-3)', fontSize: '13px', margin: 0 }}>
                  This product is manufactured under strict cGMP lot-to-lot bioequivalence standards in available dosage strengths: <strong style={{ color: 'var(--ink)' }}>{product.strength}</strong>. Refer to full prescribing information for comprehensive pediatric, geriatric, and renal adjustment protocols.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'packaging' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '14px', color: 'var(--brand-navy)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  Packaging Configurations & Bottle Sizes
                </h4>
                <p style={{ color: 'var(--ink-2)' }}>{product.packaging}</p>
              </div>

              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '14px', color: 'var(--brand-navy)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  Storage, Stability & Handling Requirements
                </h4>
                <p style={{ color: 'var(--ink-2)' }}>{product.storage}</p>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(15, 122, 85, 0.08)',
                  border: '1px solid rgba(15, 122, 85, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <Package size={24} strokeWidth={1.6} color="var(--ok)" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--ink)', display: 'block', fontSize: '13px' }}>
                    DSCSA 2026 Serialized & Tamper-Evident Packaging
                  </strong>
                  <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>
                    Every unit is verified with 2D DataMatrix barcodes, expiration dates, and lot numbers compliant with Drug Supply Chain Security Act regulations.
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pi' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  backgroundColor: 'rgba(242, 61, 38, 0.08)',
                  border: '1px solid rgba(242, 61, 38, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <ShieldAlert size={18} strokeWidth={1.6} color="var(--brand-red)" />
                  <strong style={{ color: 'var(--brand-red)', fontSize: '13px', textTransform: 'uppercase' }}>
                    Safety Considerations & Contraindications
                  </strong>
                </div>
                <p style={{ color: 'var(--brand-red-press)', fontSize: '13px', margin: 0 }}>
                  {product.safetyWarnings}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', color: 'var(--brand-navy)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  Official Prescribing Information (PI) & Safety Data Sheet (SDS)
                </h4>
                <p style={{ color: 'var(--ink-3)', fontSize: '13px' }}>
                  Download official FDA-approved package inserts, safety data sheets, and Certificate of Analysis (CoA) documentation for institutional pharmacy verification.
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleDownloadPI}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {downloadSuccess ? (
                      <>
                        <CheckCircle2 size={16} strokeWidth={1.6} color="var(--ok)" />
                        <span style={{ color: 'var(--ok)' }}>Prescribing Info Downloaded</span>
                      </>
                    ) : (
                      <>
                        <Download size={16} strokeWidth={1.6} color="var(--brand-navy)" />
                        <span>Download Full Prescribing Info (PDF)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadPI}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <FileText size={16} strokeWidth={1.6} color="var(--ink-2)" />
                    <span>Safety Data Sheet (SDS)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            padding: '18px 28px',
            backgroundColor: 'var(--mist)',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <button
            onClick={() => onReportAdverseEvent(product)}
            style={{
              color: 'var(--brand-red-press)',
              background: 'none',
              border: 'none',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <PhoneCall size={14} strokeWidth={1.6} /> Report Medical Event for {product.genericName}
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} className="btn btn-secondary btn-sm">
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRequestQuote(product);
              }}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Mail size={14} strokeWidth={1.6} /> Request Commercial Quotation / Samples
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
