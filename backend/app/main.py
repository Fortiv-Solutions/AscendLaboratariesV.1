import html
import logging
import re
import time

from fastapi import BackgroundTasks, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, RedirectResponse

from . import google_oauth
from .agent import ChatAgent
from .config import get_settings
from .memory import WindowMemory
from .schemas import ChatRequest, ChatResponse
from .supabase_store import SupabaseStore
from .tools.products import ProductCatalog

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
log = logging.getLogger("ascend.chat")

MAX_MESSAGE_LEN = 800
FALLBACK_REPLY = (
    "I'm sorry, I couldn't process that just now. Please try again, "
    "or I can connect you with our team."
)

settings = get_settings()
catalog = ProductCatalog(settings)
memory = WindowMemory(settings.memory_window_turns, settings.memory_max_sessions)
store = SupabaseStore(settings)
agent = ChatAgent(settings, catalog, store)

app = FastAPI(title="Ascend AI Chat API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.allowed_origins.split(",") if o.strip()],
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type"],
)

_CONTROL_CHARS = re.compile(r"[\x00-\x1f\x7f]")


@app.get("/api/health")
async def health() -> dict:
    return {
        "ok": True,
        "openai_configured": bool(settings.openai_api_key),
        "supabase_configured": store.enabled,
        "google_signed_in": google_oauth.has_token(settings),
    }


@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, background: BackgroundTasks) -> ChatResponse:
    message = _CONTROL_CHARS.sub(" ", req.message).strip()[:MAX_MESSAGE_LEN]
    if not message:
        raise HTTPException(status_code=400, detail="Empty message received")
    session_id = req.sessionId[:64] or f"anon-{int(time.time() * 1000)}"

    if not settings.openai_api_key:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY is not configured")

    # After a server restart, reseed the session from the client's transcript
    if not memory.has(session_id) and req.history:
        prior = [h.model_dump() for h in req.history if h.content.strip()]
        # The frontend includes the current message as the last history entry
        if prior and prior[-1]["role"] == "user" and prior[-1]["content"].strip() == message:
            prior = prior[:-1]
        memory.append(session_id, *prior[-settings.memory_window_turns * 2 :])

    try:
        answer, escalated = await agent.reply(session_id, message, memory.get(session_id))
    except Exception:
        log.exception("Agent failed for session %s", session_id)
        answer, escalated = "", False

    if not answer:
        return ChatResponse(output=FALLBACK_REPLY, sessionId=session_id)

    memory.append(session_id, {"role": "user", "content": message}, {"role": "assistant", "content": answer})
    # Transcript goes to Supabase after the response is sent
    background.add_task(store.log_exchange, session_id, message, answer)
    return ChatResponse(output=answer, sessionId=session_id, escalated=escalated)


def _require_local(request: Request) -> None:
    # The sign-in decides whose Google account reads the sheet; only allow it from this machine
    if request.client is None or request.client.host not in ("127.0.0.1", "::1", "localhost"):
        raise HTTPException(status_code=403, detail="Google sign-in is only available from localhost")


@app.get("/oauth/google/start")
async def google_sign_in(request: Request) -> RedirectResponse:
    _require_local(request)
    if not google_oauth.configured(settings):
        raise HTTPException(status_code=503, detail="GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are not configured")
    return RedirectResponse(google_oauth.authorization_url(settings))


@app.get("/oauth/callback", response_class=HTMLResponse)
async def google_callback(request: Request, code: str = "", state: str = "", error: str = "") -> HTMLResponse:
    _require_local(request)
    if error or not code:
        return HTMLResponse(f"<h2>Google sign-in was not completed</h2><p>{html.escape(error or 'No code returned.')}</p>", 400)
    try:
        await google_oauth.complete_sign_in(settings, code, state)
    except ValueError as exc:
        return HTMLResponse(f"<h2>Google sign-in failed</h2><p>{html.escape(str(exc))}</p>", 400)
    catalog.invalidate()
    try:
        count = len(await catalog.rows())
    except Exception as exc:
        log.exception("Sheet read after sign-in failed")
        return HTMLResponse(f"<h2>Signed in, but the sheet could not be read</h2><p>{type(exc).__name__}: {html.escape(str(exc))}</p>", 500)
    return HTMLResponse(f"<h2>Connected</h2><p>The chatbot can now read the product sheet ({count} rows). You can close this tab.</p>")
