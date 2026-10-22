# Ascend Laboratories — US Commercial Pharmaceuticals Platform & AI Assistant

An enterprise-grade, high-performance web platform and AI-powered assistant for **Ascend Laboratories, LLC** (US generic and specialty pharmaceuticals).

---

## 🌟 Key Features

- **Ascend AI Assistant (Python / FastAPI backend):**
  - OpenAI tool-calling agent with Google Sheets formulary lookup, served by FastAPI.
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
- **Chat Backend:** Python 3.11+, FastAPI, Uvicorn, OpenAI GPT-4o-mini (tool calling)
- **Integrations:** Google Sheets, Microsoft Teams, Supabase (optional)

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)
- Python 3.11+

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

Add your OpenAI key to `.env`. Both the chat backend and voice chat use it (server-only — never prefix it with `VITE_`):
```env
OPENAI_API_KEY=sk-...
```
On Vercel, add `OPENAI_API_KEY` under **Project → Settings → Environment Variables** and redeploy.

Chat-backend settings (`TEAMS_WEBHOOK_URL`, Google Sheet credentials, Supabase) are listed in `backend/.env.example`. They can go in the same `.env`.

### 4. Run the Chat Backend (FastAPI)
```bash
cd backend
python -m venv .venv
.venv\Scriptsctivate          # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Check `http://localhost:8000/api/health`; interactive API docs are at `http://localhost:8000/docs`.

### 5. Run the Frontend
```bash
npm run dev
```
Open `http://localhost:5173` in your browser. Vite proxies `/api/chat` to the backend on port 8000. If the backend is down, the chatbot falls back to its built-in local answers.

### 6. Production Build
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

## 🔗 Chat Backend Architecture (`backend/`)

`POST /api/chat` with `{ message, sessionId, history }` → `{ output, sessionId, escalated }`

1. **`app/main.py`** — FastAPI app: sanitises input (800-char cap), keeps per-session memory, and returns the answer. If the server restarts, it rebuilds a session's memory from the `history` the browser sends.
2. **`app/agent.py`** — OpenAI tool-calling agent (`gpt-4o-mini`), with the same grounding rules as before (`app/prompts.py`).
3. **`app/tools/products.py`** — `search_products` tool over the "Alkem Product list" Google Sheet, cached for 5 minutes. Access is by service account, by Google sign-in (`GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`, then open `http://localhost:8000/oauth/google/start` once — see `app/google_oauth.py`), or from a local `PRODUCTS_CSV_PATH`.
4. **`app/tools/escalation.py`** — `escalate_to_human` tool: posts an Adaptive Card to the **Microsoft Teams** `Ascend Enquiry Team` channel via `TEAMS_WEBHOOK_URL`, and saves it to Supabase. Either one succeeding counts as delivered.
5. **`app/supabase_store.py`** — Supabase persistence: one `conversations` row per session, every exchange in `messages`, and on escalation a `customers` row plus an `escalations` row (status `pending`), with the conversation marked `escalated`.

The original n8n exports are kept in `n8n-workflows/` for reference only.

---

## 🎙️ Voice Chat (speech-to-speech)

The chat window has a **Text / Voice** switch. Voice mode is a live, interruptible English conversation powered by the OpenAI Realtime API over WebRTC.

```
browser mic ⇄ WebRTC ⇄ OpenAI Realtime (gpt-realtime-2.1, voice "marin")
                              │ tool call: ask_ascend_knowledge
                              ▼
                   FastAPI /api/chat  (same brain as text chat)
```

- **`api/realtime-session.ts`** — Vercel function that mints a 2-minute ephemeral key. It holds the system prompt, voice, turn detection, and tool definitions, so the API key and prompt never reach the browser. Requests from other origins are rejected (`ALLOWED_ORIGINS` adds extras). During `npm run dev`, a Vite middleware serves the same file.
- **`src/hooks/useRealtimeVoice.ts`** — WebRTC session, server events, tool-call loop, mute, interrupt, audio levels, 10-minute session cap, and 2-minute idle timeout.
- **`src/components/voice/`** — the voice stage, the animated monogram emblem, and the docked live-call pill that keeps the conversation going while a modal is open.
- **Tools the assistant can use:** `ask_ascend_knowledge` (chat API, with the local fallback), `show_product`, `navigate_site`, `open_adverse_event_form`, `request_quote`.
- Spoken turns are written into the text transcript with a **Voice** badge, including product cards and actions returned by the chat API.

Optional env overrides: `OPENAI_REALTIME_MODEL`, `OPENAI_REALTIME_VOICE`, `OPENAI_TRANSCRIBE_MODEL`, `ALLOWED_ORIGINS`.
