import { FALLBACK_FOCALIPSE_KNOWLEDGE } from './focalipseKnowledge';

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-70b-versatile";
const GROQ_KEY_STORAGE = "focalipse:groq-api-key";

let knowledgeCache: string | null = null;
let knowledgePromise: Promise<string> | null = null;

type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type GroqChatOptions = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
};

export function stripCodeFences(text: string) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

export async function loadFocalipseKnowledge() {
  if (knowledgeCache) {
    return knowledgeCache;
  }

  if (!knowledgePromise) {
    knowledgePromise = fetch("/about/Focalipse-Expert-Knowledge.txt", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Falha ao carregar conhecimento: ${response.status}`);
        }

        return response.text();
      })
        .catch(() => FALLBACK_FOCALIPSE_KNOWLEDGE);
  }

  knowledgeCache = await knowledgePromise;
  return knowledgeCache;
}

export async function callGroqChat(messages: GroqMessage[], options: GroqChatOptions = {}) {
  const apiKey = typeof window !== "undefined"
    ? window.localStorage.getItem(GROQ_KEY_STORAGE)
    : null;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY não configurada");
  }

  const response = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model ?? GROQ_MODEL,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 256,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq respondeu com ${response.status}`);
  }

  const data = await response.json() as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Groq devolveu resposta vazia");
  }

  return content;
}

export function promptAndStoreGroqApiKey() {
  if (typeof window === "undefined") {
    return null;
  }

  const enteredKey = window.prompt("Cole a chave da API Groq para uso local");
  const trimmedKey = enteredKey?.trim();

  if (!trimmedKey) {
    return null;
  }

  window.localStorage.setItem(GROQ_KEY_STORAGE, trimmedKey);
  return trimmedKey;
}

export function safeParseJson<T>(text: string): T | null {
  const cleaned = stripCodeFences(text);

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]) as T;
    } catch {
      return null;
    }
  }
}
