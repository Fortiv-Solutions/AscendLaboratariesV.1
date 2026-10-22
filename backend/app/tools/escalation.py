"""Human escalation (replaces the n8n "Human escalation" sub-workflow)."""

import logging
from datetime import datetime, timezone

import httpx

from ..config import Settings
from ..supabase_store import SupabaseStore

log = logging.getLogger(__name__)


def _value(v: str | None) -> str:
    v = (v or "").strip()
    return v if v and v.lower() != "not provided" else ""


async def escalate(settings: Settings, store: SupabaseStore, session_id: str, args: dict) -> dict:
    name = _value(args.get("name")) or "Customer"
    phone = _value(args.get("phone"))
    email = _value(args.get("email"))
    issue = _value(args.get("issue")) or "Requesting to connect with an executive"
    summary = _value(args.get("summary"))

    teams_on = bool(settings.teams_webhook_url)
    if not (teams_on or store.enabled):
        log.error("No escalation channel configured; escalation for session %s was not delivered", session_id)
        return {"ok": False, "error": "Escalation channel is not configured."}

    # Teams and Supabase are independent: the escalation is delivered if either one accepts it
    notified = False
    if teams_on:
        async with httpx.AsyncClient(timeout=15) as client:
            notified = await _post_teams(client, settings, session_id, name, phone, email, issue, summary)
    saved = store.enabled and await store.save_escalation(session_id, name, phone, email, issue, summary, notified)
    delivered = notified or saved

    if not delivered:
        return {"ok": False, "error": "Could not reach the executive team right now."}
    return {"ok": True, "contact": {"name": name, "phone": phone, "email": email}}


async def _post_teams(client, settings, session_id, name, phone, email, issue, summary) -> bool:
    facts = [
        {"title": "Name", "value": name},
        {"title": "Phone", "value": phone or "Not provided"},
        {"title": "Email", "value": email or "Not provided"},
        {"title": "Issue", "value": issue},
    ]
    if summary:
        facts.append({"title": "Summary", "value": summary})
    facts.append({"title": "Timestamp", "value": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")})

    card = {
        "type": "message",
        "attachments": [
            {
                "contentType": "application/vnd.microsoft.card.adaptive",
                "content": {
                    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                    "type": "AdaptiveCard",
                    "version": "1.4",
                    "body": [
                        {
                            "type": "TextBlock",
                            "text": "🚨 New Customer Escalation — Ascend Pharma Chatbot",
                            "weight": "Bolder",
                            "wrap": True,
                        },
                        {"type": "FactSet", "facts": facts},
                    ],
                },
            }
        ],
    }
    try:
        resp = await client.post(settings.teams_webhook_url, json=card)
        resp.raise_for_status()
        return True
    except httpx.HTTPError:
        log.exception("Teams escalation failed for session %s", session_id)
        return False

