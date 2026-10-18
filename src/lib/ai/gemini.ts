import "server-only";
import { ApiError, GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";
import { getEnv } from "@/lib/env";
import { AI_RESPONSE_SCHEMA, parseAiActivity, type AiActivity } from "./schema";

export const GENERATION_TIMEOUT_MS = 60_000;

export type GeminiOutcome =
  | { kind: "ok"; activity: AiActivity }
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

/** One non-streamed Gemini call (no SDK retries), bounded by GENERATION_TIMEOUT_MS. */
export async function generateWithGemini(systemInstruction: string, contents: string): Promise<GeminiOutcome> {
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
        maxOutputTokens: 4000,
        responseMimeType: "application/json",
        responseJsonSchema: AI_RESPONSE_SCHEMA,
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

    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return { kind: "error", reason: `invalid JSON (${finish})` };
    }
    const activity = parseAiActivity(json);
    if (!activity) return { kind: "error", reason: "schema mismatch" };
    if (activity.refused) return { kind: "refused" };
    return { kind: "ok", activity };
  } catch (err) {
    if (abort.signal.aborted) return { kind: "error", reason: "timeout" };
    if (isOverloaded(err)) return { kind: "busy" };
    return { kind: "error", reason: err instanceof Error ? err.message.slice(0, 200) : "unknown" };
  } finally {
    clearTimeout(timer);
  }
}
