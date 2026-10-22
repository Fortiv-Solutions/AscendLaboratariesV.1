"""Supabase persistence over PostgREST.

Schema: customers ← conversations (session_id) ← messages / escalations.
Every call is best effort: a Supabase outage must never break the chat itself.
"""

import logging
from datetime import datetime, timezone

import httpx

from .config import Settings

log = logging.getLogger(__name__)

CONVERSATION_ACTIVE = "active"
CONVERSATION_ESCALATED = "escalation_requested"
ESCALATION_PENDING = "pending"
ESCALATION_NOTIFIED = "notified"
SENDER_CUSTOMER = "customer"
SENDER_AI = "ai"


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class SupabaseStore:
    def __init__(self, settings: Settings):
        self.enabled = bool(settings.supabase_url and settings.supabase_key)
        self._base = f"{settings.supabase_url.rstrip('/')}/rest/v1"
        self._headers = {
            "apikey": settings.supabase_key,
            "Authorization": f"Bearer {settings.supabase_key}",
        }
        # session_id → conversations.id
        self._conversation_ids: dict[str, str] = {}

    async def _insert(self, client: httpx.AsyncClient, table: str, row: dict) -> dict | None:
        resp = await client.post(
            f"{self._base}/{table}", json=row, headers={**self._headers, "Prefer": "return=representation"}
        )
        if resp.is_error:
            log.error("Supabase insert into %s rejected (%s): %s", table, resp.status_code, resp.text[:300])
            return None
        rows = resp.json()
        return rows[0] if rows else None

    async def _conversation_id(self, client: httpx.AsyncClient, session_id: str) -> str | None:
        if session_id in self._conversation_ids:
            return self._conversation_ids[session_id]
        resp = await client.get(
            f"{self._base}/conversations",
            params={"select": "id", "session_id": f"eq.{session_id}", "limit": "1"},
            headers=self._headers,
        )
        found = resp.json() if resp.is_success else []
        if found:
            conv_id = found[0]["id"]
        else:
            row = await self._insert(
                client,
                "conversations",
                {"session_id": session_id, "status": CONVERSATION_ACTIVE, "escalation_requested": False, "started_at": _now()},
            )
            if row is None:
                return None
            conv_id = row["id"]
        self._conversation_ids[session_id] = conv_id
        return conv_id

    async def log_exchange(self, session_id: str, user_message: str, bot_message: str) -> None:
        if not self.enabled:
            return
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                conv_id = await self._conversation_id(client, session_id)
                if conv_id is None:
                    return
                resp = await client.post(
                    f"{self._base}/messages",
                    json=[
                        {"conversation_id": conv_id, "sender_type": SENDER_CUSTOMER, "message": user_message},
                        {"conversation_id": conv_id, "sender_type": SENDER_AI, "message": bot_message},
                    ],
                    headers={**self._headers, "Prefer": "return=minimal"},
                )
                if resp.is_error:
                    log.error("Supabase insert into messages rejected (%s): %s", resp.status_code, resp.text[:300])
        except httpx.HTTPError:
            log.exception("Supabase message log failed for session %s", session_id)

    async def save_escalation(
        self, session_id: str, name: str, phone: str, email: str, issue: str, summary: str, notified: bool
    ) -> bool:
        if not self.enabled:
            return False
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                conv_id = await self._conversation_id(client, session_id)
                if conv_id is None:
                    return False
                customer = await self._insert(
                    client, "customers", {"name": name, "mobile_number": phone or None, "email": email or None}
                )
                customer_id = customer["id"] if customer else None
                escalation = await self._insert(
                    client,
                    "escalations",
                    {
                        "conversation_id": conv_id,
                        "customer_id": customer_id,
                        "reason": issue,
                        "customer_message": summary or None,
                        "status": ESCALATION_NOTIFIED if notified else ESCALATION_PENDING,
                        "escalated_at": _now(),
                    },
                )
                resp = await client.patch(
                    f"{self._base}/conversations",
                    params={"id": f"eq.{conv_id}"},
                    json={
                        "customer_id": customer_id,
                        "escalation_requested": True,
                        "status": CONVERSATION_ESCALATED,
                        "updated_at": _now(),
                    },
                    headers={**self._headers, "Prefer": "return=minimal"},
                )
                if resp.is_error:
                    log.error("Supabase conversation update rejected (%s): %s", resp.status_code, resp.text[:300])
                return escalation is not None
        except httpx.HTTPError:
            log.exception("Supabase escalation save failed for session %s", session_id)
            return False
