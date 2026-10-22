"""OpenAI tool-calling agent (replaces the n8n AI Agent node)."""

import json
import logging

from openai import AsyncOpenAI

from .config import Settings
from .prompts import SYSTEM_PROMPT, TOOLS, USER_PROMPT_TEMPLATE
from .supabase_store import SupabaseStore
from .tools.escalation import escalate
from .tools.products import ProductCatalog

log = logging.getLogger(__name__)

MAX_TOOL_ROUNDS = 5


class ChatAgent:
    def __init__(self, settings: Settings, catalog: ProductCatalog, store: SupabaseStore):
        self._settings = settings
        self._catalog = catalog
        self._store = store
        self._client: AsyncOpenAI | None = None

    async def reply(self, session_id: str, message: str, history: list[dict]) -> tuple[str, bool]:
        """Returns (answer, escalated)."""
        if self._client is None:
            # Created lazily so the server can boot (and report health) without a key
            self._client = AsyncOpenAI(api_key=self._settings.openai_api_key)
        # Memory keeps the raw text; only the current turn gets the n8n-style wrapper
        prompt = USER_PROMPT_TEMPLATE.format(message=message)
        messages: list = [{"role": "system", "content": SYSTEM_PROMPT}, *history, {"role": "user", "content": prompt}]
        escalated = False

        for _ in range(MAX_TOOL_ROUNDS):
            completion = await self._client.chat.completions.create(
                model=self._settings.openai_chat_model,
                messages=messages,
                tools=TOOLS,
                temperature=0.3,
            )
            choice = completion.choices[0].message
            if not choice.tool_calls:
                return (choice.content or "").strip(), escalated

            messages.append(choice.model_dump(exclude_none=True))
            for call in choice.tool_calls:
                result = await self._run_tool(session_id, call.function.name, call.function.arguments)
                if call.function.name == "escalate_to_human" and result.get("ok"):
                    escalated = True
                messages.append(
                    {"role": "tool", "tool_call_id": call.id, "content": json.dumps(result, ensure_ascii=False)}
                )

        log.warning("Session %s hit the tool-round limit", session_id)
        return "", escalated

    async def _run_tool(self, session_id: str, name: str, raw_args: str) -> dict:
        try:
            args = json.loads(raw_args or "{}")
        except json.JSONDecodeError:
            return {"error": "Invalid tool arguments."}
        try:
            if name == "search_products":
                return await self._catalog.search(str(args.get("query", "")))
            if name == "escalate_to_human":
                return await escalate(self._settings, self._store, session_id, args)
        except Exception:
            log.exception("Tool %s failed", name)
            return {"error": f"{name} is temporarily unavailable."}
        return {"error": f"Unknown tool {name}."}
