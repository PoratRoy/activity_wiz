import "server-only";
import { ApiError, GoogleGenAI, HarmBlockThreshold, HarmCategory, ThinkingLevel } from "@google/genai";
import { getEnv } from "@/lib/env";

export const GENERATION_TIMEOUT_MS = 60_000;

export type GeminiRequest = { systemInstruction: string; contents: string; schema: object };

export type GeminiOutcome =
  | { kind: "ok"; json: unknown }
  | { kind: "refused" }
  | { kind: "busy" }
  | { kind: "error"; reason: string };

const SAFETY = [
  HarmCategory.HARM_CATEGORY_HARASSMENT,
  HarmCategory.HARM_CATEGORY_HATE_SPEECH,
  HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
  HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
].map((category) => ({ category, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE }));

function isOverloaded(err: unknown): boolean {
  if (err instanceof ApiError && (err.status === 503 || err.status === 429)) return true;
  const msg = err instanceof Error ? err.message.toLowerCase() : "";
  return /overloaded|unavailable|high demand|resource.?exhausted/.test(msg);
}

/** One non-streamed JSON Gemini call (no SDK retries), bounded by GENERATION_TIMEOUT_MS. */
export async function generateWithGemini({ systemInstruction, contents, schema }: GeminiRequest): Promise<GeminiOutcome> {
  const env = getEnv();
  const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY, httpOptions: { retryOptions: { attempts: 1 } } });
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), GENERATION_TIMEOUT_MS);

  try {
    const res = await ai.models.generateContent({
      model: env.GEMINI_MODEL || "gemini-3.5-flash-lite",
      contents,
      config: {
        systemInstruction,
        temperature: 0.9,
        // A 90-minute activity in Hebrew JSON can pass 4000 tokens. Thinking stays minimal:
        // the prompt's hidden "plan" field does the planning, and thinking can double the cost.
        maxOutputTokens: 8000,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        responseMimeType: "application/json",
        responseJsonSchema: schema,
        safetySettings: SAFETY,
        abortSignal: abort.signal,
      },
    });

    if (res.promptFeedback?.blockReason) return { kind: "refused" };
    const finish = res.candidates?.[0]?.finishReason;
    if (finish === "SAFETY" || finish === "PROHIBITED_CONTENT" || finish === "BLOCKLIST" || finish === "SPII") {
      return { kind: "refused" };
    }
    const text = res.text;
    if (!text) return { kind: "error", reason: `empty response (${finish ?? "no finish reason"})` };

    try {
      return { kind: "ok", json: JSON.parse(text) };
    } catch {
      return { kind: "error", reason: `invalid JSON (${finish})` };
    }
  } catch (err) {
    if (abort.signal.aborted) return { kind: "error", reason: "timeout" };
    if (isOverloaded(err)) return { kind: "busy" };
    return { kind: "error", reason: err instanceof Error ? err.message.slice(0, 200) : "unknown" };
  } finally {
    clearTimeout(timer);
  }
}
