"""In-process window buffer memory keyed by session id.

Equivalent to n8n's Window Buffer Memory: keeps the last N user/assistant turns.
State is lost on restart; the frontend's history is used to reseed a session then.
"""

from collections import OrderedDict, deque
from threading import Lock


class WindowMemory:
    def __init__(self, window_turns: int, max_sessions: int):
        self._max_messages = window_turns * 2
        self._max_sessions = max_sessions
        self._sessions: OrderedDict[str, deque[dict]] = OrderedDict()
        self._lock = Lock()

    def has(self, session_id: str) -> bool:
        with self._lock:
            return session_id in self._sessions

    def get(self, session_id: str) -> list[dict]:
        with self._lock:
            buf = self._sessions.get(session_id)
            if buf is None:
                return []
            self._sessions.move_to_end(session_id)
            return list(buf)

    def append(self, session_id: str, *messages: dict) -> None:
        with self._lock:
            buf = self._sessions.get(session_id)
            if buf is None:
                buf = deque(maxlen=self._max_messages)
                self._sessions[session_id] = buf
                # Evict the least recently used session
                while len(self._sessions) > self._max_sessions:
                    self._sessions.popitem(last=False)
            self._sessions.move_to_end(session_id)
            buf.extend(messages)
