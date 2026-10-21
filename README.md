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

To enable **voice chat**, add your OpenAI key (server-only — never prefix it with `VITE_`):
```env
OPENAI_API_KEY=sk-...
```
On Vercel, add `OPENAI_API_KEY` under **Project → Settings → Environment Variables** and redeploy.

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

---

## 🎙️ Voice Chat (speech-to-speech)

The chat window has a **Text / Voice** switch. Voice mode is a live, interruptible English conversation powered by the OpenAI Realtime API over WebRTC.

```
browser mic ⇄ WebRTC ⇄ OpenAI Realtime (gpt-realtime-2.1, voice "marin")
                              │ tool call: ask_ascend_knowledge
                              ▼
                   n8n /webhook/pharma-chat  (same brain as text chat)
```

- **`api/realtime-session.ts`** — Vercel function that mints a 2-minute ephemeral key. It holds the system prompt, voice, turn detection, and tool definitions, so the API key and prompt never reach the browser. Requests from other origins are rejected (`ALLOWED_ORIGINS` adds extras). During `npm run dev`, a Vite middleware serves the same file.
- **`src/hooks/useRealtimeVoice.ts`** — WebRTC session, server events, tool-call loop, mute, interrupt, audio levels, 10-minute session cap, and 2-minute idle timeout.
- **`src/components/voice/`** — the voice stage, the animated monogram emblem, and the docked live-call pill that keeps the conversation going while a modal is open.
- **Tools the assistant can use:** `ask_ascend_knowledge` (n8n, with the local fallback), `show_product`, `navigate_site`, `open_adverse_event_form`, `request_quote`.
- Spoken turns are written into the text transcript with a **Voice** badge, including product cards and actions returned by n8n.

Optional env overrides: `OPENAI_REALTIME_MODEL`, `OPENAI_REALTIME_VOICE`, `OPENAI_TRANSCRIBE_MODEL`, `ALLOWED_ORIGINS`.
