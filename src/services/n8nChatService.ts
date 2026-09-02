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

export const N8N_WEBHOOK_URL =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_N8N_WEBHOOK_URL ||
  'https://n8n.fortivautomation.cloud/webhook/pharma-chat';

/**
 * Send a message to n8n webhook and parse the AI response
 */
export async function sendChatMessageToN8n(
  message: string,
  sessionId: string,
  history: ChatServiceMessage[] = []
): Promise<ChatResponse | null> {
  try {
    const payload = {
      message,
      chatInput: message,
      query: message,
      sessionId,
      timestamp: new Date().toISOString(),
      history: history.slice(-10).map((h) => ({
        role: h.sender === 'user' ? 'user' : 'assistant',
        content: h.text,
      })),
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn(`n8n webhook responded with status ${response.status}`);
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    let responseText = '';
    let parsedData: unknown = null;

    if (contentType.includes('application/json')) {
      try {
        parsedData = await response.json();
      } catch {
        parsedData = null;
      }
    } else {
      responseText = await response.text();
      try {
        parsedData = JSON.parse(responseText);
      } catch {
        // Not JSON formatted text
      }
    }

    // Extract text from parsed JSON data or raw text
    let outputText = '';
    let suggestedQuestions: string[] | undefined;
    let actions: ChatResponse['actions'] | undefined;
    let productCard: Product | undefined;

    if (parsedData) {
      if (typeof parsedData === 'string') {
        outputText = parsedData;
      } else if (Array.isArray(parsedData) && parsedData.length > 0) {
        const item = parsedData[0];
        if (typeof item === 'string') {
          outputText = item;
        } else if (typeof item === 'object' && item !== null) {
          outputText =
            item.output ||
            item.text ||
            item.response ||
            item.message ||
            item.reply ||
            item.answer ||
            item.content ||
            item.result ||
            '';
          suggestedQuestions = item.suggestedQuestions || item.followups;
          actions = item.actions;
        }
      } else if (typeof parsedData === 'object' && parsedData !== null) {
        const obj = parsedData as Record<string, unknown>;
        outputText =
          (obj.output as string) ||
          (obj.text as string) ||
          (obj.response as string) ||
          (obj.message as string) ||
          (obj.reply as string) ||
          (obj.answer as string) ||
          (obj.content as string) ||
          (obj.result as string) ||
          '';

        if (Array.isArray(obj.suggestedQuestions)) {
          suggestedQuestions = obj.suggestedQuestions as string[];
        }
        if (Array.isArray(obj.actions)) {
          actions = obj.actions as ChatResponse['actions'];
        }
      }
    } else if (responseText.trim()) {
      outputText = responseText.trim();
    }

    if (!outputText || !outputText.trim()) {
      // Empty response body from webhook
      return null;
    }

    // Check if the response mentions a specific known product to attach rich card
    const lowerText = outputText.toLowerCase();
    const matchedProduct = PRODUCTS.find(
      (p) =>
        lowerText.includes(p.name.toLowerCase()) ||
        lowerText.includes(p.genericName.toLowerCase()) ||
        lowerText.includes(p.ndc.toLowerCase())
    );
    if (matchedProduct) {
      productCard = matchedProduct;
    }

    return {
      text: outputText,
      actions,
      suggestedQuestions,
      productCard,
    };
  } catch (error) {
    console.error('Error connecting to n8n webhook:', error);
    return null;
  }
}
