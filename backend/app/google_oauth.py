"""One-time Google sign-in so the backend can read the product sheet as a Google user.

Visit /oauth/google/start, approve read-only Sheets access, and the refresh token is
saved to GOOGLE_TOKEN_FILE. The product catalog then reads the sheet with it.
"""

import json
import secrets
from urllib.parse import urlencode

import httpx

from .config import Settings, resolve_path

AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly"

# Pending sign-in states (CSRF protection); single-process dev server, so memory is enough
_pending_states: set[str] = set()


def configured(settings: Settings) -> bool:
    return bool(settings.google_client_id and settings.google_client_secret)


def has_token(settings: Settings) -> bool:
    return resolve_path(settings.google_token_file).is_file()


def authorization_url(settings: Settings) -> str:
    state = secrets.token_urlsafe(24)
    _pending_states.add(state)
    return AUTH_URL + "?" + urlencode(
        {
            "client_id": settings.google_client_id,
            "redirect_uri": settings.google_oauth_redirect_uri,
            "response_type": "code",
            "scope": SCOPE,
            # offline + consent guarantees a refresh token is returned
            "access_type": "offline",
            "prompt": "consent",
            "state": state,
        }
    )


async def complete_sign_in(settings: Settings, code: str, state: str) -> None:
    if state not in _pending_states:
        raise ValueError("Sign-in link expired or was not started here. Start again.")
    _pending_states.discard(state)

    async with httpx.AsyncClient(timeout=20) as client:
        resp = await client.post(
            TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.google_client_id,
                "client_secret": settings.google_client_secret,
                "redirect_uri": settings.google_oauth_redirect_uri,
                "grant_type": "authorization_code",
            },
        )
    data = resp.json()
    if resp.is_error or "refresh_token" not in data:
        raise ValueError(f"Google did not return a refresh token: {data.get('error_description') or data}")

    path = resolve_path(settings.google_token_file)
    path.write_text(json.dumps({"refresh_token": data["refresh_token"]}), encoding="utf-8")


def credentials(settings: Settings):
    from google.oauth2.credentials import Credentials

    token = json.loads(resolve_path(settings.google_token_file).read_text(encoding="utf-8"))
    return Credentials(
        token=None,
        refresh_token=token["refresh_token"],
        client_id=settings.google_client_id,
        client_secret=settings.google_client_secret,
        token_uri=TOKEN_URL,
        scopes=[SCOPE],
    )
