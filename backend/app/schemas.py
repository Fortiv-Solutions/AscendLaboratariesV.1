from typing import Literal

from pydantic import BaseModel, Field


class HistoryMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str = ""
    sessionId: str = ""
    history: list[HistoryMessage] = Field(default_factory=list)
    contactName: str = ""
    contactEmail: str = ""
    contactPhone: str = ""
    market: str = "IN"
    locale: str = "en"
    pageUrl: str = ""
    consent: bool = False


class ChatResponse(BaseModel):
    output: str
    sessionId: str
    escalated: bool = False
