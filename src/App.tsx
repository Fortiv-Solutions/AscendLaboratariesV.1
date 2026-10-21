import React, { useState, useEffect } from 'react';
import { ActivePage, Product, PressRelease } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { ProductsView } from './views/ProductsView';
import { QualityView } from './views/QualityView';
import { OperationsView } from './views/OperationsView';
import { NewsView } from './views/NewsView';
import { ContactView } from './views/ContactView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AdverseEventModal } from './components/AdverseEventModal';
import { SampleRequestModal } from './components/SampleRequestModal';
import { PressDetailModal } from './components/PressDetailModal';
import { AscendAIChatbot } from './components/AscendAIChatbot';
import './components/AscendAIChatbot.css';
import './components/voice/voice.css';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quoteProduct, setQuoteProduct] = useState<Product | null>(null);
  const [selectedPressRelease, setSelectedPressRelease] = useState<PressRelease | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [adverseEventModalOpen, setAdverseEventModalOpen] = useState(false);
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [activeTherapyFilter, setActiveTherapyFilter] = useState<string>('All');

  // Handle URL hash navigation
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as ActivePage;
      if (['home', 'about', 'products', 'quality', 'operations', 'news', 'contact'].includes(hash)) {
        setActivePage(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handlePageChange = (page: ActivePage) => {
    setActivePage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuote = (product: Product) => {
    setQuoteProduct(product);
    setSampleModalOpen(true);
  };

  const handleSelectTherapy = (therapyName: string) => {
    setActiveTherapyFilter(therapyName);
    handlePageChange('products');
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--paper)' }}>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <Header
        activePage={activePage}
        setActivePage={handlePageChange}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAdverseEvent={() => setAdverseEventModalOpen(true)}
        onOpenContact={() => handlePageChange('contact')}
      />

      {/* Main View Router */}
      <main id="main" style={{ flex: 1 }}>
        {activePage === 'home' && (
          <HomeView
            onSelectProduct={(p) => setSelectedProduct(p)}
            onRequestQuote={handleOpenQuote}
            onSelectPressRelease={(pr) => setSelectedPressRelease(pr)}
            setActivePage={handlePageChange}
            onOpenSearch={() => setSearchModalOpen(true)}
            onOpenContact={() => handlePageChange('contact')}
          />
        )}

        {activePage === 'about' && (
          <AboutView onOpenContact={() => handlePageChange('contact')} />
        )}

        {activePage === 'products' && (
          <ProductsView
            onSelectProduct={(p) => setSelectedProduct(p)}
            onRequestQuote={handleOpenQuote}
            initialTherapy={activeTherapyFilter}
          />
        )}

        {activePage === 'quality' && (
          <QualityView
            onOpenAdverseEvent={() => setAdverseEventModalOpen(true)}
            onOpenContact={() => handlePageChange('contact')}
          />
        )}

        {activePage === 'operations' && (
          <OperationsView onOpenContact={() => handlePageChange('contact')} />
        )}

        {activePage === 'news' && (
          <NewsView onSelectPressRelease={(pr) => setSelectedPressRelease(pr)} />
        )}

        {activePage === 'contact' && (
          <ContactView onOpenAdverseEvent={() => setAdverseEventModalOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActivePage={handlePageChange}
        onOpenAdverseEvent={() => setAdverseEventModalOpen(true)}
        onOpenContact={() => handlePageChange('contact')}
      />

      {/* Modals & Dialogs */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onRequestQuote={handleOpenQuote}
        onReportAdverseEvent={() => {
          setSelectedProduct(null);
          setAdverseEventModalOpen(true);
        }}
      />

      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
        }}
        onSelectPressRelease={(pr) => {
          setSelectedPressRelease(pr);
        }}
        onSelectTherapy={handleSelectTherapy}
      />

      <AdverseEventModal
        isOpen={adverseEventModalOpen}
        onClose={() => setAdverseEventModalOpen(false)}
        initialProduct={selectedProduct}
      />

      <SampleRequestModal
        isOpen={sampleModalOpen}
        onClose={() => {
          setSampleModalOpen(false);
          setQuoteProduct(null);
        }}
        product={quoteProduct}
      />

      <PressDetailModal
        pressRelease={selectedPressRelease}
        onClose={() => setSelectedPressRelease(null)}
      />

      {/* Ascend AI Enterprise Chatbot */}
      <AscendAIChatbot
        onSelectProduct={(p) => setSelectedProduct(p)}
        onRequestQuote={handleOpenQuote}
        onOpenAdverseEvent={() => setAdverseEventModalOpen(true)}
        onNavigate={handlePageChange}
      />
    </div>
  );
};
