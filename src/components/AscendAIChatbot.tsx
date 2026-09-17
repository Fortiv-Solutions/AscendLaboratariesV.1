import React, { useState, useRef, useEffect } from 'react';
import { Product, ActivePage } from '../types';
import { PRODUCTS, THERAPEUTIC_AREAS } from '../data/productsData';
import { sendChatMessageToN8n } from '../services/n8nChatService';
import {
  User,
  Send,
  X,
  Minimize2,
  Maximize2,
  RotateCcw,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Check,
  Copy,
  ExternalLink,
  ShieldAlert,
  FileCheck2,
  Pill,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';

/**
 * Official Ascend Laboratories Favicon / Brand Monogram
 * Crisp white background + red arc on top + stylized navy 'A' lettermark
 */
export const AscendFaviconIcon: React.FC<{
  size?: number;
  className?: string;
  withBackground?: boolean;
}> = ({ size = 22, className, withBackground = true }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible', flexShrink: 0, display: 'block' }}
      aria-hidden="true"
    >
      {withBackground && (
        <rect width="32" height="32" rx="8" fill="#FFFFFF" />
      )}
      {/* Ascend Red Brand Arc */}
      <path
        d="M6 10.5C10 6.5 22 6.5 26 10"
        stroke="#F23D26"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Ascend 'A' Lettermark */}
      <path
        d="M8 25L16 12L24 25H20L16 18.5L12 25H8Z"
        fill="#06028A"
      />
    </svg>
  );
};

interface AscendAIChatbotProps {
  onSelectProduct?: (product: Product) => void;
  onRequestQuote?: (product: Product) => void;
  onOpenAdverseEvent?: () => void;
  onNavigate?: (page: ActivePage) => void;
}

interface MessageAction {
  label: string;
  type: 'product' | 'quote' | 'adverse' | 'navigate' | 'url';
  target?: string;
  product?: Product;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actions?: MessageAction[];
  suggestedQuestions?: string[];
  productCard?: Product;
  feedback?: 'like' | 'dislike';
}

const QUICK_PROMPTS = [
  { label: 'Atorvastatin NDC', query: 'Search Atorvastatin Calcium NDC & strengths', icon: <Pill size={12} /> },
  { label: 'Report Adverse Event', query: 'How to report an Adverse Drug Event?', icon: <ShieldAlert size={12} /> },
  { label: 'cGMP & FDA Quality', query: 'What are Ascend cGMP & FDA standards?', icon: <FileCheck2 size={12} /> },
  { label: 'Wholesaler EDI Ordering', query: 'How to order via AmerisourceBergen / McKesson EDI?', icon: <ExternalLink size={12} /> }
];

const TEASER_HINTS = [
  'Ask about 300+ NDCs & cGMP specs',
  'Instant CoA lot release verification',
  'Wholesale EDI & sample inquiries',
  '24/7 Pharmacovigilance assistance'
];

export const AscendAIChatbot: React.FC<AscendAIChatbotProps> = ({
  onSelectProduct,
  onRequestQuote,
  onOpenAdverseEvent,
  onNavigate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExternalTeaser, setShowExternalTeaser] = useState(true);
  const [teaserHintIndex, setTeaserHintIndex] = useState(0);
  const [isTeaserFading, setIsTeaserFading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState<string>(() => {
    try {
      const existing = sessionStorage.getItem('ascend_chat_session_id');
      if (existing) return existing;
      const newId = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      sessionStorage.setItem('ascend_chat_session_id', newId);
      return newId;
    } catch {
      return 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    }
  });

  useEffect(() => {
    if (isOpen || !showExternalTeaser) return;
    const interval = setInterval(() => {
      setIsTeaserFading(true);
      setTimeout(() => {
        setTeaserHintIndex((prev) => (prev + 1) % TEASER_HINTS.length);
        setIsTeaserFading(false);
      }, 260);
    }, 3800);
    return () => clearInterval(interval);
  }, [isOpen, showExternalTeaser]);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: `Hello, welcome to **Ascend AI** assistant.\n\nHow can I help you today with our **300+ generic formulations**, NDC verification, cGMP compliance, or commercial quotation requests?`,
      timestamp: 'Just now',
      suggestedQuestions: [
        'Search Atorvastatin Calcium NDC',
        'Report an Adverse Drug Event',
        'cGMP & FDA Compliance Specs',
        'Wholesale & GPO Distribution'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowExternalTeaser(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages, isTyping]);

  // Web audio chime on bot reply
  const playChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch {
      // AudioContext unavailable
    }
  };

  const handleCopy = (text: string, id: string) => {
    // Strip markdown formatting for clean clipboard copy
    const cleanText = text.replace(/[#*`]/g, '');
    navigator.clipboard.writeText(cleanText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (id: string, type: 'like' | 'dislike') => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, feedback: type } : msg))
    );
  };

  const handleResetChat = () => {
    const newSession = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    try {
      sessionStorage.setItem('ascend_chat_session_id', newSession);
    } catch {
      // Storage unavailable
    }
    setSessionId(newSession);

    setMessages([
      {
        id: 'reset-msg-' + Date.now(),
        sender: 'bot',
        text: `Chat history cleared. How may I assist your clinical or commercial team today?`,
        timestamp: 'Just now',
        suggestedQuestions: [
          'Search Atorvastatin Calcium NDC',
          'Report an Adverse Event',
          'Quality Assurance & cGMP',
          'Request Product Sample'
        ]
      }
    ]);
  };

  const generateAIResponse = (userQuery: string): {
    text: string;
    actions?: MessageAction[];
    productCard?: Product;
    suggestedQuestions?: string[];
  } => {
    const q = userQuery.toLowerCase().trim();

    // 1. Adverse Event / Safety reporting
    if (
      q.includes('adverse') ||
      q.includes('side effect') ||
      q.includes('reaction') ||
      q.includes('safety') ||
      q.includes('pharmacovigilance') ||
      q.includes('report') ||
      q.includes('complaint')
    ) {
      return {
        text: `### 🚨 Pharmacovigilance & Safety Reporting\n\nAscend Laboratories maintains 24/7 medical surveillance to safeguard patient health.\n\n• **Direct Safety Hotline:** \`1-800-258-3720\` (Option 2)\n• **Medical Safety Desk:** \`safety@ascendlabs.com\`\n• **FDA MedWatch:** Report directly via **FDA Form 3500** at \`www.fda.gov/medwatch\` or \`1-800-FDA-1088\`.\n\nYou can submit an adverse event report directly below.`,
        actions: [
          {
            label: 'Submit Adverse Drug Event Report',
            type: 'adverse'
          },
          {
            label: 'Contact Medical Affairs',
            type: 'navigate',
            target: 'contact'
          }
        ],
        suggestedQuestions: [
          'What information is needed for an Adverse Event?',
          'How does Ascend ensure lot safety?',
          'Quality & cGMP Compliance'
        ]
      };
    }

    // 2. Search specific product match
    const matchedProduct = PRODUCTS.find(
      (p) =>
        q.includes(p.name.toLowerCase()) ||
        q.includes(p.genericName.toLowerCase()) ||
        (p.brandReference && q.includes(p.brandReference.toLowerCase().replace('®', ''))) ||
        q.includes(p.ndc.toLowerCase()) ||
        (q.includes('atorvastatin') && p.id.includes('atorvastatin')) ||
        (q.includes('gabapentin') && p.id.includes('gabapentin')) ||
        (q.includes('metformin') && p.id.includes('metformin')) ||
        (q.includes('lisinopril') && p.id.includes('lisinopril')) ||
        (q.includes('amlodipine') && p.id.includes('amlodipine')) ||
        (q.includes('pantoprazole') && p.id.includes('pantoprazole')) ||
        (q.includes('omeprazole') && p.id.includes('omeprazole')) ||
        (q.includes('losartan') && p.id.includes('losartan')) ||
        (q.includes('sertraline') && p.id.includes('sertraline')) ||
        (q.includes('montelukast') && p.id.includes('montelukast'))
    );

    if (matchedProduct) {
      return {
        text: `### 💊 Product Details: ${matchedProduct.name}\n\n• **Active Ingredient:** ${matchedProduct.genericName}\n• **Reference Brand:** ${matchedProduct.brandReference || 'N/A'}\n• **NDC Code:** \`${matchedProduct.ndc}\`\n• **Available Strengths:** ${matchedProduct.strength}\n• **Dosage Form:** ${matchedProduct.dosageForm}\n• **Therapeutic Category:** ${matchedProduct.therapeuticCategory}\n• **Packaging:** ${matchedProduct.packaging}\n• **Storage:** ${matchedProduct.storage}\n• **Indications:** ${matchedProduct.indications}`,
        productCard: matchedProduct,
        actions: [
          {
            label: `View ${matchedProduct.name} Monograph`,
            type: 'product',
            product: matchedProduct
          },
          {
            label: `Request Sample / Commercial Quote`,
            type: 'quote',
            product: matchedProduct
          },
          {
            label: `Browse ${matchedProduct.therapeuticCategory} Formulations`,
            type: 'navigate',
            target: 'products'
          }
        ],
        suggestedQuestions: [
          `Safety & Warnings for ${matchedProduct.genericName}`,
          `Storage specifications`,
          `Browse all ${matchedProduct.therapeuticCategory} drugs`
        ]
      };
    }

    // 3. Therapeutic Area Queries
    const matchedTherapy = THERAPEUTIC_AREAS.find((t) =>
      q.includes(t.name.toLowerCase()) || q.includes(t.id.toLowerCase())
    );

    if (matchedTherapy || q.includes('cardio') || q.includes('cns') || q.includes('neuro') || q.includes('respiratory') || q.includes('gastro') || q.includes('diabetes')) {
      const therapy = matchedTherapy || THERAPEUTIC_AREAS[0];
      const relatedProducts = PRODUCTS.filter(
        (p) => p.therapeuticCategory.toLowerCase() === therapy.name.toLowerCase()
      );

      return {
        text: `### 🩺 Therapeutic Area: ${therapy.name}\n\nAscend Laboratories offers **${therapy.productCount}+ generic and specialty formulations** in ${therapy.name}.\n\n• **Overview:** ${therapy.description}\n• **Manufacturing Rigor:** ${therapy.highlight}\n• **Key Formulations:** ${relatedProducts.map((p) => p.name).join(', ') || 'Available upon request'}`,
        actions: [
          {
            label: `Explore ${therapy.name} Portfolio`,
            type: 'navigate',
            target: 'products'
          },
          {
            label: 'Request Full Formulary Catalog',
            type: 'navigate',
            target: 'contact'
          }
        ],
        suggestedQuestions: [
          'Show Cardiovascular products',
          'Show CNS & Neurology formulations',
          'Request Full Product Catalog'
        ]
      };
    }

    // 4. Quality, cGMP, FDA, and Regulatory
    if (
      q.includes('quality') ||
      q.includes('cgmp') ||
      q.includes('fda') ||
      q.includes('compliance') ||
      q.includes('certification') ||
      q.includes('coa') ||
      q.includes('certificate of analysis') ||
      q.includes('inspection') ||
      q.includes('dscsa')
    ) {
      return {
        text: `### 🔬 Quality & Regulatory Standards\n\nAscend Laboratories operates in full compliance with US FDA and international cGMP standards:\n\n• **U.S. FDA Registered:** Flawless compliance audits across global API and finished dosage sites.\n• **21 CFR Part 211 cGMP:** Automated dissolution testing, HPLC chromatography, and environmental monitoring.\n• **DSCSA 2026 Serialized:** Full 2D DataMatrix unit-level serialization and EPCIS transaction tracking.\n• **DEA Schedules II–V:** High-containment vaults for controlled substance manufacturing.\n• **100% CoA Lot Release:** Every dispatched lot undergoes complete Certificate of Analysis verification.`,
        actions: [
          {
            label: 'View Quality Architecture',
            type: 'navigate',
            target: 'quality'
          },
          {
            label: 'Request Certificate of Analysis (CoA)',
            type: 'navigate',
            target: 'contact'
          }
        ],
        suggestedQuestions: [
          'How does Ascend maintain DSCSA serialization?',
          'What testing is conducted for lot release?',
          'Contact Quality Assurance'
        ]
      };
    }

    // 5. Wholesaler, GPO, Distribution, Ordering & Pricing
    if (
      q.includes('wholesale') ||
      q.includes('gpo') ||
      q.includes('order') ||
      q.includes('buy') ||
      q.includes('distributor') ||
      q.includes('amerisource') ||
      q.includes('cencora') ||
      q.includes('cardinal') ||
      q.includes('mckesson') ||
      q.includes('price') ||
      q.includes('quote') ||
      q.includes('sample')
    ) {
      return {
        text: `### 📦 Commercial Distribution Network\n\nAscend pharmaceuticals are stocked nationwide across major US wholesalers and group purchasing organizations (GPOs):\n\n• **National Distribution Partners:** AmerisourceBergen (Cencora), Cardinal Health, McKesson Corporation, and regional distributors.\n• **EDI Integration:** Full support for EDI 850 (PO), EDI 855 (Ack), EDI 856 (ASN), and EDI 810 (Invoice).\n• **Supply Guarantee:** 99.4% national fill rate with dual-sourced API resilience.\n• **Commercial Support Line:** \`1-800-258-3720\` (Mon–Fri 8:00 AM – 6:00 PM EST)`,
        actions: [
          {
            label: 'Request Commercial Quote / Samples',
            type: 'quote'
          },
          {
            label: 'Contact Commercial Sales Desk',
            type: 'navigate',
            target: 'contact'
          }
        ],
        suggestedQuestions: [
          'How to order via EDI 850?',
          'Request product sample',
          'Explore Manufacturing Operations'
        ]
      };
    }

    // 6. Company, Operations, Location & Leadership
    if (
      q.includes('about') ||
      q.includes('location') ||
      q.includes('headquarter') ||
      q.includes('bridgewater') ||
      q.includes('facility') ||
      q.includes('operations') ||
      q.includes('who are you') ||
      q.includes('ascend')
    ) {
      return {
        text: `### 🏢 Ascend Laboratories, LLC\n\n• **Headquarters:** Bridgewater, New Jersey, USA\n• **Core Focus:** Formulation development, ANDA regulatory filings, cGMP manufacturing, and nationwide commercial distribution of high-barrier generic prescription pharmaceuticals.\n• **Scale:** 300+ approved ANDAs with over 100 million doses distributed annually.\n• **Mission:** Expanding affordable access to essential prescription medicines through unyielding quality and supply resilience.`,
        actions: [
          {
            label: 'Read Corporate Overview',
            type: 'navigate',
            target: 'about'
          },
          {
            label: 'Explore Manufacturing Facilities',
            type: 'navigate',
            target: 'operations'
          }
        ],
        suggestedQuestions: [
          'What are Ascend’s manufacturing capabilities?',
          'Browse Generic Product Catalog',
          'Contact Corporate Headquarters'
        ]
      };
    }

    // Default intelligent pharma assistant response
    return {
      text: `### 🤖 Ascend AI Assistant\n\nI can assist you with information regarding: *"${userQuery}"*.\n\nAscend Laboratories is an established US pharmaceutical manufacturer with **300+ generic and specialty medicines** formulated under strict FDA and cGMP guidelines.\n\nHow can I help you proceed?\n1. 🔍 Look up specific **NDCs, strengths, or packaging**\n2. 📄 View **Quality & Regulatory compliance** specifications\n3. 📦 Connect with our **Wholesale & GPO commercial desk**\n4. 🚨 Guide you through **Pharmacovigilance (Adverse Event) reporting**`,
      actions: [
        {
          label: 'Search Product Catalog',
          type: 'navigate',
          target: 'products'
        },
        {
          label: 'Contact Ascend Team',
          type: 'navigate',
          target: 'contact'
        }
      ],
      suggestedQuestions: [
        'Atorvastatin Calcium NDC & Strengths',
        'cGMP & FDA Quality Standards',
        'Report an Adverse Drug Event',
        'Wholesale Ordering & Distribution'
      ]
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query.trim(),
      timestamp: 'Just now'
    };

    const updatedHistory = [...messages, userMessage];
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    setIsTyping(true);

    try {
      // Connect to n8n pharma-chat webhook
      const n8nResponse = await sendChatMessageToN8n(
        query.trim(),
        sessionId,
        updatedHistory.map((m) => ({ sender: m.sender, text: m.text }))
      );

      let botMessage: ChatMessage;

      if (n8nResponse && n8nResponse.text && n8nResponse.text.trim()) {
        botMessage = {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: n8nResponse.text,
          timestamp: 'Just now',
          actions: n8nResponse.actions,
          productCard: n8nResponse.productCard,
          suggestedQuestions: n8nResponse.suggestedQuestions
        };
      } else {
        // Fallback to internal knowledge engine if webhook returns empty or is in setup
        const fallback = generateAIResponse(query);
        botMessage = {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: fallback.text,
          timestamp: 'Just now',
          actions: fallback.actions,
          productCard: fallback.productCard,
          suggestedQuestions: fallback.suggestedQuestions
        };
      }

      setMessages((prev) => [...prev, botMessage]);
      playChime();
    } catch (err) {
      console.error('Chat error:', err);
      const fallback = generateAIResponse(query);
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: fallback.text,
          timestamp: 'Just now',
          actions: fallback.actions,
          productCard: fallback.productCard,
          suggestedQuestions: fallback.suggestedQuestions
        }
      ]);
      playChime();
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: MessageAction) => {
    if (action.type === 'product' && action.product && onSelectProduct) {
      onSelectProduct(action.product);
    } else if (action.type === 'quote' && onRequestQuote) {
      if (action.product) {
        onRequestQuote(action.product);
      } else {
        onRequestQuote(PRODUCTS[0]);
      }
    } else if (action.type === 'adverse' && onOpenAdverseEvent) {
      onOpenAdverseEvent();
    } else if (action.type === 'navigate' && action.target && onNavigate) {
      onNavigate(action.target as ActivePage);
    }
  };

  // Helper to parse text with rich bold and highlighted code tags
  const renderFormattedInlineText = (text: string) => {
    // Regex splits by bold (**...**) and backticks (`...`)
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} className="ascend-ai-strong-text">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={pIdx} className="ascend-ai-code-badge">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating launcher trigger button with website favicon & interactive message */}
      <div className="ascend-ai-launcher-wrapper">
        {!isOpen && showExternalTeaser && (
          <div className="ascend-ai-teaser-card" onClick={() => setIsOpen(true)}>
            <div className="ascend-ai-teaser-inner">
              <div className="ascend-ai-teaser-icon-slot">
                <AscendFaviconIcon size={16} withBackground />
              </div>
              <div className="ascend-ai-teaser-text">
                <div className="ascend-ai-teaser-title-row">
                  <strong>Ascend AI</strong>
                  <span className="ascend-ai-teaser-live-dot" />
                </div>
                <p
                  key={TEASER_HINTS[teaserHintIndex]}
                  className={`ascend-ai-teaser-hint-text ${isTeaserFading ? 'is-fading' : ''}`}
                >
                  {TEASER_HINTS[teaserHintIndex]}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowExternalTeaser(false);
                }}
                className="ascend-ai-teaser-close"
                title="Dismiss"
                aria-label="Dismiss message"
              >
                <X size={12} />
              </button>
            </div>
            <span className="ascend-ai-teaser-arrow" />
          </div>
        )}

        <button
          className={`ascend-ai-trigger-btn ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close Ascend AI' : 'Open Ascend AI'}
          title="Ascend AI Pharmaceutical Assistant"
        >
          <div className="ascend-ai-trigger-icon-layer">
            {isOpen ? (
              <X size={18} strokeWidth={2.4} />
            ) : (
              <AscendFaviconIcon size={24} withBackground />
            )}
          </div>
          <span className="ascend-ai-trigger-label">
            {isOpen ? 'Close' : 'Ascend AI'}
          </span>
        </button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div
          className={`ascend-ai-window ${isExpanded ? 'is-fullscreen' : ''}`}
          role="dialog"
          aria-label="Ascend AI Assistant"
        >
          {/* Header */}
          <div className="ascend-ai-header">
            <div className="ascend-ai-header-left">
              <div className="ascend-ai-avatar">
                <AscendFaviconIcon size={28} withBackground />
              </div>
              <div>
                <div className="ascend-ai-title-row">
                  <h3 className="ascend-ai-title">Ascend AI</h3>
                  <ShieldCheck size={14} color="#06028A" />
                </div>
                <div className="ascend-ai-status">
                  <span className="ascend-ai-status-dot" />
                  <span>Online · Pharmaceutical Assistant</span>
                </div>
              </div>
            </div>

            <div className="ascend-ai-header-actions">
              <button
                className="ascend-ai-tool-btn"
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
                aria-label="Toggle Sound"
              >
                {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
              <button
                className="ascend-ai-tool-btn"
                onClick={handleResetChat}
                title="Clear Chat History"
                aria-label="Clear Chat"
              >
                <RotateCcw size={15} />
              </button>
              <button
                className="ascend-ai-tool-btn hidden-xs"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Restore Size' : 'Expand Fullscreen'}
                aria-label="Toggle Fullscreen"
              >
                {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
              <button
                className="ascend-ai-tool-btn ascend-ai-close-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="ascend-ai-quick-strip">
            {QUICK_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                className="ascend-ai-quick-pill"
              >
                {p.icon}
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="ascend-ai-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`ascend-ai-bubble-row ${msg.sender === 'user' ? 'is-user' : 'is-bot'}`}
              >
                <div className="ascend-ai-bubble-avatar">
                  {msg.sender === 'user' ? (
                    <User size={13} strokeWidth={2.4} />
                  ) : (
                    <AscendFaviconIcon size={20} withBackground />
                  )}
                </div>

                <div className="ascend-ai-bubble-content">
                  <div className="ascend-ai-bubble-meta">
                    <span className="ascend-ai-bubble-name">
                      {msg.sender === 'user' ? 'You' : 'Ascend AI'}
                    </span>
                    <span className="ascend-ai-bubble-time">{msg.timestamp}</span>
                  </div>

                  <div className="ascend-ai-bubble-body">
                    {msg.text.split('\n').map((line, idx) => {
                      if (line.startsWith('### ')) {
                        return (
                          <div key={idx} className="ascend-ai-msg-header-wrap">
                            <h4 className="ascend-ai-msg-h4">
                              {renderFormattedInlineText(line.replace('### ', ''))}
                            </h4>
                          </div>
                        );
                      }
                      if (line.startsWith('• ')) {
                        const content = line.replace('• ', '');
                        return (
                          <div key={idx} className="ascend-ai-msg-bullet">
                            <span className="ascend-ai-msg-bullet-dot" />
                            <span className="ascend-ai-msg-bullet-content">
                              {renderFormattedInlineText(content)}
                            </span>
                          </div>
                        );
                      }
                      if (line.match(/^\d+\.\s/)) {
                        return (
                          <div key={idx} className="ascend-ai-msg-number-row">
                            <span className="ascend-ai-msg-number-badge">{line.slice(0, 2)}</span>
                            <span>{renderFormattedInlineText(line.replace(/^\d+\.\s/, ''))}</span>
                          </div>
                        );
                      }
                      if (!line.trim()) {
                        return <div key={idx} style={{ height: '6px' }} />;
                      }
                      return (
                        <p key={idx} className="ascend-ai-msg-p">
                          {renderFormattedInlineText(line)}
                        </p>
                      );
                    })}
                  </div>

                  {/* Attached Rich Product Snapshot */}
                  {msg.productCard && (
                    <div className="ascend-ai-product-attachment">
                      <div className="ascend-ai-product-att-head">
                        <div style={{ flex: 1 }}>
                          <span className="ascend-ai-badge-therapy">{msg.productCard.therapeuticCategory}</span>
                          <strong className="ascend-ai-prod-title">
                            {msg.productCard.name}
                          </strong>
                          <div className="ascend-ai-prod-ndc-row">
                            <span className="ascend-ai-ndc-label">NDC:</span>
                            <code className="ascend-ai-ndc-val">{msg.productCard.ndc}</code>
                            <span className="ascend-ai-ndc-dot">•</span>
                            <span className="ascend-ai-ndc-dosage">{msg.productCard.dosageForm}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => onSelectProduct && onSelectProduct(msg.productCard!)}
                          className="btn btn-sm btn-primary ascend-ai-view-ndc-btn"
                        >
                          <FileText size={13} />
                          <span>View NDC</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Interactive Action Buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="ascend-ai-action-buttons">
                      {msg.actions.map((act, actIdx) => (
                        <button
                          key={actIdx}
                          onClick={() => handleActionClick(act)}
                          className="ascend-ai-action-btn"
                        >
                          <span>{act.label}</span>
                          <ArrowRight size={13} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Suggested Follow-up Questions */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="ascend-ai-followups">
                      <div className="ascend-ai-followup-pills">
                        {msg.suggestedQuestions.map((qText, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => handleSendMessage(qText)}
                            className="ascend-ai-followup-btn"
                          >
                            <span>{qText}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bot Message Controls */}
                  {msg.sender === 'bot' && (
                    <div className="ascend-ai-msg-footer">
                      <button
                        className="ascend-ai-sub-btn"
                        onClick={() => handleCopy(msg.text, msg.id)}
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check size={12} color="var(--ok)" /> <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} /> <span>Copy</span>
                          </>
                        )}
                      </button>

                      <div className="ascend-ai-feedback-group">
                        <button
                          className={`ascend-ai-sub-btn ${msg.feedback === 'like' ? 'active' : ''}`}
                          onClick={() => handleFeedback(msg.id, 'like')}
                          title="Helpful"
                          aria-label="Thumbs up"
                        >
                          <ThumbsUp size={12} />
                        </button>
                        <button
                          className={`ascend-ai-sub-btn ${msg.feedback === 'dislike' ? 'active' : ''}`}
                          onClick={() => handleFeedback(msg.id, 'dislike')}
                          title="Not helpful"
                          aria-label="Thumbs down"
                        >
                          <ThumbsDown size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="ascend-ai-bubble-row is-bot">
                <div className="ascend-ai-bubble-avatar">
                  <AscendFaviconIcon size={20} withBackground />
                </div>
                <div className="ascend-ai-bubble-content">
                  <div className="ascend-ai-typing-box">
                    <span className="ascend-ai-typing-dot" />
                    <span className="ascend-ai-typing-dot" />
                    <span className="ascend-ai-typing-dot" />
                    <span className="ascend-ai-typing-text">Searching pharmaceutical database...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="ascend-ai-input-wrapper">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="ascend-ai-input-form"
            >
              <div className="ascend-ai-input-inner">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    const el = e.target;
                    el.style.height = 'auto';
                    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask Ascend AI (e.g., 'Atorvastatin NDC', 'cGMP specs')..."
                  className="ascend-ai-input"
                  rows={1}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="ascend-ai-send-btn"
                  title="Send query"
                  aria-label="Send query"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
            <div className="ascend-ai-disclaimer">
              <span>Official Ascend Laboratories Assistant · 24/7 Clinical &amp; Commercial Support</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
