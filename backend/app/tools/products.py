"""Product lookup over the Ascend product sheet (replaces the n8n Google Sheets tool)."""

import asyncio
import csv
import io
import logging
import re
import time

import httpx

from .. import google_oauth
from ..config import Settings, resolve_path

log = logging.getLogger(__name__)

MAX_RESULTS = 15


class ProductCatalog:
    def __init__(self, settings: Settings):
        self._settings = settings
        self._rows: list[dict[str, str]] = []
        self._loaded_at = 0.0
        self._lock = asyncio.Lock()

    async def rows(self) -> list[dict[str, str]]:
        async with self._lock:
            if not self._rows or time.monotonic() - self._loaded_at > self._settings.products_cache_seconds:
                try:
                    self._rows = await self._load()
                    self._loaded_at = time.monotonic()
                    log.info("Loaded %d product rows", len(self._rows))
                except Exception:
                    # Keep serving the stale copy if a refresh fails
                    log.exception("Failed to load product sheet")
                    if not self._rows:
                        raise
            return self._rows

    async def _load(self) -> list[dict[str, str]]:
        s = self._settings
        if s.products_csv_path:
            text = resolve_path(s.products_csv_path).read_text(encoding="utf-8-sig")
            return _parse_csv(text)
        if s.google_service_account_file:
            return await asyncio.to_thread(self._load_with_service_account)
        if google_oauth.configured(s) and google_oauth.has_token(s):
            return await asyncio.to_thread(self._load_with_oauth)
        url = f"https://docs.google.com/spreadsheets/d/{s.google_sheet_id}/export?format=csv&gid={s.google_sheet_gid}"
        async with httpx.AsyncClient(follow_redirects=True, timeout=20) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            if "text/csv" not in resp.headers.get("content-type", ""):
                raise RuntimeError(
                    "Google Sheet is not publicly readable; sign in at /oauth/google/start, "
                    "or set GOOGLE_SERVICE_ACCOUNT_FILE or PRODUCTS_CSV_PATH"
                )
            return _parse_csv(resp.text)

    def _load_with_service_account(self) -> list[dict[str, str]]:
        import gspread

        s = self._settings
        gc = gspread.service_account(filename=str(resolve_path(s.google_service_account_file)))
        return self._read_sheet(gc)

    def _load_with_oauth(self) -> list[dict[str, str]]:
        import gspread

        return self._read_sheet(gspread.authorize(google_oauth.credentials(self._settings)))

    def _read_sheet(self, gc) -> list[dict[str, str]]:
        s = self._settings
        sheet = gc.open_by_key(s.google_sheet_id).get_worksheet_by_id(s.google_sheet_gid)
        return _rows_from_values(sheet.get_all_values())

    def invalidate(self) -> None:
        self._rows = []

    async def search(self, query: str) -> dict:
        rows = await self.rows()
        terms = _terms(query)
        if not terms:
            return {"total_rows": len(rows), "rows": rows[:MAX_RESULTS]}

        scored = []
        for row in rows:
            haystack = " ".join(row.values()).lower()
            digits = re.sub(r"\D", "", haystack)
            score = sum(1 for t in terms if t in haystack or (t.isdigit() and len(t) >= 4 and t in digits))
            if score:
                scored.append((score, row))
        scored.sort(key=lambda x: x[0], reverse=True)
        matches = [row for _, row in scored[:MAX_RESULTS]]
        result: dict = {"query": query, "match_count": len(scored), "rows": matches}
        if not matches:
            result["note"] = "No rows matched. Do not guess; tell the customer it is not in our records."
        return result


def _parse_csv(text: str) -> list[dict[str, str]]:
    return _rows_from_values(list(csv.reader(io.StringIO(text))))


def _rows_from_values(values: list[list[str]]) -> list[dict[str, str]]:
    """Turn sheet cells into dicts, skipping title rows above the real header.

    The header is the first row with at least two filled cells, e.g. a sheet that
    starts with "Alkem (India) Generic Products List" on its own row.
    """
    start = next((i for i, row in enumerate(values) if sum(1 for c in row if c.strip()) >= 2), None)
    if start is None:
        return []
    # "Therapy Area -" → "Therapy Area"
    header = [c.strip().rstrip("-").strip() for c in values[start]]
    rows = []
    for raw in values[start + 1 :]:
        row = {h: " ".join(c.split()) for h, c in zip(header, raw) if h and c.strip()}
        # Skip blank rows and header rows repeated further down (e.g. at old page breaks)
        if row and not any(v.rstrip("- ").lower() == h.lower() for h, v in row.items()):
            rows.append(row)
    return rows


_STOPWORDS = {"the", "a", "an", "of", "for", "and", "or", "is", "what", "do", "you", "have", "mg", "tablets", "tablet"}


def _terms(query: str) -> list[str]:
    words = re.findall(r"[a-z0-9]+", query.lower())
    # NDC like 67877-123-01 → also search the digits run together
    ndc = re.sub(r"\D", "", query)
    terms = [w for w in words if w not in _STOPWORDS and len(w) > 1]
    if len(ndc) >= 8:
        terms.append(ndc)
    return terms
