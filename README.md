# Ascend Laboratories — US Commercial Pharmaceuticals Platform & AI Assistant

An enterprise-grade, high-performance web platform and AI-powered assistant for **Ascend Laboratories, LLC** (US generic and specialty pharmaceuticals).

---

## 🌟 Key Features

- **Ascend AI Assistant (n8n Integration):**
  - Connected to live n8n AI Agent workflows with Google Sheets formulary lookup & OpenAI intelligence.
  - Multi-turn conversational memory with persistent session IDs.
  - Human escalation routing to **Microsoft Teams** channel alerts and **Supabase** record logging.
  - Built-in pharmacovigilance safety fallbacks and NDC recognition.
- **Formulary & Product Catalog:**
  - 300+ generic and specialty pharmaceutical formulations.
  - Search by NDC, active ingredient, brand reference, dosage form, and therapeutic category.
  - Direct Certificate of Analysis (CoA) & commercial quote/sample requests.
- **Pharmacovigilance & Adverse Event Reporting:**
  - Dedicated 24/7 safety reporting modal adhering to US FDA MedWatch compliance.
- **Interactive 3D Visuals & Motion:**
  - Interactive Three.js pharmaceutical molecule scene and GSAP physics-driven magnetic interactions.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **3D & Animation:** Three.js, GSAP
- **Icons & Styling:** Lucide React, Modern Vanilla CSS Design Tokens
- **AI & Automation:** n8n Workflow Automation, OpenAI GPT-4o-mini, Google Sheets, Microsoft Teams, Supabase

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Installation
```bash
git clone <repository-url>
cd ascendlaboratories-main
npm install
```

### 3. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```

Set your n8n webhook URL in `.env`:
```env
VITE_N8N_WEBHOOK_URL=https://n8n.fortivautomation.cloud/webhook/pharma-chat
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## ⚙️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server |
| `npm run build` | Compiles TypeScript and builds optimized production bundle in `dist/` |
| `npm run preview` | Locally previews production build |

---

## 🔗 n8n Workflow Architecture

1. **Chat Webhook (`/webhook/pharma-chat`):** Receives customer messages, session IDs, and history.
2. **AI Agent (LangChain + OpenAI):** Answers customer queries using connected Google Sheets database and maintains conversational state via Window Buffer Memory.
3. **Human Escalation Sub-Workflow:** When a customer requests executive contact, extracts Name, Phone, Email, and Issue, notifies Microsoft Teams (`Ascend Enquiry Team`), and stores the record in Supabase.
