/**
 * POST /api/realtime-session
 *
 * Mints a short-lived OpenAI Realtime client secret for the browser voice
 * assistant. The standard API key never leaves the server; the browser uses
 * the ephemeral key to open a WebRTC call directly with OpenAI.
 *
 * Env:
 *   OPENAI_API_KEY              required
 *   OPENAI_REALTIME_MODEL       default gpt-realtime-2.1
 *   OPENAI_REALTIME_VOICE       default marin
 *   OPENAI_TRANSCRIBE_MODEL     default whisper-1
 *   ALLOWED_ORIGINS             optional comma-separated list of extra origins
 */

const MODEL = process.env.OPENAI_REALTIME_MODEL || 'gpt-realtime-2.1';
const VOICE = process.env.OPENAI_REALTIME_VOICE || 'marin';
const TRANSCRIBE_MODEL = process.env.OPENAI_TRANSCRIBE_MODEL || 'whisper-1';

const SITE_PAGES = ['home', 'about', 'products', 'quality', 'operations', 'news', 'contact'];

const INSTRUCTIONS = `
# Role
You are Ascend AI, the voice assistant on the Ascend Laboratories website. Ascend Laboratories, LLC is a US manufacturer and distributor of generic prescription medicines, headquartered in New Jersey. You help pharmacists, healthcare professionals, wholesalers, and patients.

# Language
- Speak only in clear, natural US English, whatever language the caller uses.
- If someone speaks another language, say in English that you can only help in English right now.

# How to talk
- This is a spoken conversation. Keep every turn to one to three short sentences.
- Sound warm, calm, and professional, like a knowledgeable colleague on the phone.
- Ask one question at a time. Offer more detail instead of reading everything at once.
- Never read out markdown, symbols, bullet characters, URLs, or emoji.
- Read NDC codes digit by digit in their groups, for example "six eight one eight zero, dash, zero one, dash, zero nine".
- Read phone numbers digit by digit: "one, eight hundred, two five eight, three seven two zero".
- Vary your phrasing; do not repeat the same sentence twice in a row.

# Facts and tools
- For any question about Ascend products, NDCs, strengths, dosage forms, packaging, storage, therapeutic areas, quality, cGMP, FDA, DSCSA, certificates of analysis, ordering, wholesalers, pricing, samples, or the company, call ask_ascend_knowledge first and answer from its result.
- Before calling ask_ascend_knowledge, say a very short bridge such as "Let me check that for you."
- Never invent NDCs, lot numbers, prices, or availability. If the knowledge base has no answer, say so and offer to connect them with the Ascend team.
- When the caller wants to see a product, call show_product. When they want a page of the site, call navigate_site. When they want a quote or sample, call request_quote.

# Safety
- If someone describes a side effect, adverse event, or product complaint: acknowledge it with care, give the safety line one, eight hundred, two five eight, three seven two zero, option two, and offer to open the adverse event report form with open_adverse_event_form.
- If anything sounds like a medical emergency, tell them to call nine one one right away.
- Do not give personal medical advice, diagnoses, or dosing for an individual. Refer them to their pharmacist or healthcare provider.

# Opening
When the call starts, greet the caller in one short sentence and ask how you can help.
`.trim();

const TOOLS = [
  {
    type: 'function',
    name: 'ask_ascend_knowledge',
    description:
      'Look up Ascend Laboratories information: products, NDCs, strengths, packaging, quality and compliance, ordering and distribution, safety reporting, and company details. Always use this before answering factual questions.',
    parameters: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          description: "The caller's question, rewritten as a clear standalone question.",
        },
      },
      required: ['question'],
    },
  },
  {
    type: 'function',
    name: 'show_product',
    description: "Open a product's monograph on screen so the caller can see its full details.",
    parameters: {
      type: 'object',
      properties: {
        product_name: { type: 'string', description: 'Product or generic name, e.g. "Atorvastatin Calcium".' },
      },
      required: ['product_name'],
    },
  },
  {
    type: 'function',
    name: 'navigate_site',
    description: 'Take the caller to a page of the Ascend website.',
    parameters: {
      type: 'object',
      properties: {
        page: { type: 'string', enum: SITE_PAGES },
      },
      required: ['page'],
    },
  },
  {
    type: 'function',
    name: 'open_adverse_event_form',
    description: 'Open the adverse drug event report form on screen.',
    parameters: { type: 'object', properties: {} },
  },
  {
    type: 'function',
    name: 'request_quote',
    description: 'Open the sample and commercial quote request form, optionally for a specific product.',
    parameters: {
      type: 'object',
      properties: {
        product_name: { type: 'string', description: 'Optional product or generic name.' },
      },
    },
  },
];

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/**
 * Blocks other websites from minting sessions via a visitor's browser.
 * This is NOT authentication: non-browser clients can forge Origin. Abuse
 * protection needs a bot check (e.g. Turnstile) plus a rate limit store.
 */
function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  const requestHost = request.headers.get('host');
  if (requestHost && originHost === requestHost) return true;
  if (process.env.VERCEL_ENV !== 'production' && /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(originHost)) return true;

  const extra = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  return extra.includes(origin);
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({ error: 'voice_not_configured' }, 503);
  }
  if (!isAllowedOrigin(request)) {
    return json({ error: 'forbidden_origin' }, 403);
  }

  const upstream = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      expires_after: { anchor: 'created_at', seconds: 120 },
      session: {
        type: 'realtime',
        model: MODEL,
        instructions: INSTRUCTIONS,
        audio: {
          input: {
            noise_reduction: { type: 'near_field' },
            transcription: { model: TRANSCRIBE_MODEL, language: 'en' },
            turn_detection: {
              type: 'semantic_vad',
              eagerness: 'auto',
              create_response: true,
              interrupt_response: true,
            },
          },
          output: { voice: VOICE },
        },
        tools: TOOLS,
        tool_choice: 'auto',
      },
    }),
  }).catch(() => null);

  if (!upstream || !upstream.ok) {
    const detail = upstream ? await upstream.text().catch(() => '') : 'network error';
    console.error('Realtime client secret request failed:', upstream?.status, detail);
    return json(
      {
        error: 'upstream_error',
        ...(process.env.VERCEL_ENV === 'production' ? {} : { detail }),
      },
      502
    );
  }

  const data = (await upstream.json()) as { value?: string; expires_at?: number };
  if (!data.value) {
    return json({ error: 'upstream_error' }, 502);
  }

  return json({ value: data.value, expiresAt: data.expires_at, model: MODEL });
}
