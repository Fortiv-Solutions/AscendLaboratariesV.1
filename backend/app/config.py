from functools import lru_cache
from pathlib import Path

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
PROJECT_DIR = BACKEND_DIR.parent


class Settings(BaseSettings):
    # Later files win: backend/.env overrides the shared project .env
    model_config = SettingsConfigDict(
        env_file=(PROJECT_DIR / ".env", BACKEND_DIR / ".env"),
        extra="ignore",
    )

    openai_api_key: str = ""
    openai_chat_model: str = "gpt-4o-mini"

    # Conversation memory (mirrors n8n's Window Buffer Memory, contextWindowLength=10)
    memory_window_turns: int = 10
    memory_max_sessions: int = 2000

    # Product data source — the "Alkem Product list" Google Sheet.
    # Either a service-account JSON file (private sheet) or the public CSV export.
    google_sheet_id: str = "1xvDjZr-PGSxsNLOl7IrpO__YWWlODm6dvkTvyf2VLjQ"
    google_sheet_gid: int = 1204725225
    google_service_account_file: str = ""
    # Or OAuth as a Google user: client id/secret plus a refresh token saved by the
    # one-time sign-in at /oauth/google/start
    google_client_id: str = ""
    google_client_secret: str = ""
    google_token_file: str = "backend/google-token.json"
    google_oauth_redirect_uri: str = "http://localhost:8000/oauth/callback"
    # Optional local CSV used instead of the Google Sheet
    products_csv_path: str = ""
    products_cache_seconds: int = 300

    # Human escalation: Teams channel webhook (Workflows "post to a channel" or Incoming Webhook)
    teams_webhook_url: str = ""
    # Optional Supabase logging (was disabled in n8n). The anon key works if the
    # table's RLS policy allows inserts for the anon role; the service key bypasses RLS.
    supabase_url: str = Field("", validation_alias=AliasChoices("SUPABASE_URL", "VITE_SUPABASE_URL"))
    supabase_key: str = Field(
        "",
        validation_alias=AliasChoices(
            "SUPABASE_SERVICE_KEY",
            "SUPABASE_SERVICE_ROLE_KEY",
            "SUPABASE_ANON_KEY",
            "SUPABASE_KEY",
            "VITE_SUPABASE_ANON_KEY",
        ),
    )

    allowed_origins: str = "http://localhost:5173,http://localhost:5174"


def resolve_path(path: str) -> Path:
    """Relative paths in settings are relative to the project root."""
    p = Path(path)
    return p if p.is_absolute() else PROJECT_DIR / p


@lru_cache
def get_settings() -> Settings:
    return Settings()
