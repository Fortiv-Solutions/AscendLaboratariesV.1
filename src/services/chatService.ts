import { Product } from '../types';
import { PRODUCTS } from '../data/productsData';

export interface ChatServiceMessage {
  sender: 'user' | 'bot';
  text: string;
}

export interface ChatResponse {
  text: string;
  actions?: Array<{
    label: string;
    type: 'product' | 'quote' | 'adverse' | 'navigate' | 'url';
    target?: string;
    product?: Product;
  }>;
  suggestedQuestions?: string[];
  productCard?: Product;
}

// FastAPI chat backend (backend/app/main.py). Vite proxies /api/chat to it during dev.
export const CHAT_API_URL =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_CHAT_API_URL || '/api/chat';

/**
 * Send a message to the FastAPI chat backend and parse the AI response
 */
export async function sendChatMessage(
  message: string,
  sessionId: string,
  history: ChatServiceMessage[] = []
): Promise<ChatResponse | null> {
  try {
    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        message,
        sessionId,
        history: history.slice(-20).map((h) => ({
          role: h.sender === 'user' ? 'user' : 'assistant',
          content: h.text,
        })),
      }),
    });

    if (!response.ok) {
      console.warn(`Chat API responded with status ${response.status}`);
      return null;
    }

    const data = (await response.json()) as { output?: string };
    const outputText = (data.output ?? '').trim();
    if (!outputText) return null;

    // Attach a rich product card when the answer mentions a known product
    const lowerText = outputText.toLowerCase();
    const productCard = PRODUCTS.find(
      (p) =>
        lowerText.includes(p.name.toLowerCase()) ||
        lowerText.includes(p.genericName.toLowerCase()) ||
        lowerText.includes(p.ndc.toLowerCase())
    );

    return { text: outputText, productCard };
  } catch (error) {
    console.error('Error connecting to chat API:', error);
    return null;
  }
}
