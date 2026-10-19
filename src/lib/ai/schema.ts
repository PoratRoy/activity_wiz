// What every activity type is converted to before it becomes Markdown (lib/markdown/fromAi.ts).
// summary and tips are only filled by the legacy prompt.

export type AiStep = { name: string; minutes: number; instructions: string };

export type GeneratedActivity = {
  title: string;
  goal: string;
  materials: string[];
  steps: AiStep[];
  summary: string;
  tips: string[];
};

// Legacy JSON, still used by pointOfView, survival and playTime until their own prompts exist
// (content uses prompts/content.ts).

export type AiActivity = {
  refused: boolean;
  title: string;
  goal: string;
  materials: string[];
  steps: AiStep[];
  summary: string;
  tips: string[];
};

/** JSON Schema passed as `responseJsonSchema`. */
export const AI_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    refused: { type: "boolean", description: "true only if the request is inappropriate for kids" },
    title: { type: "string", description: "Short catchy Hebrew title" },
    goal: { type: "string", description: "1-2 sentences: what the kids should take away" },
    materials: { type: "array", items: { type: "string" }, description: "Empty if no equipment" },
    steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          minutes: { type: "integer" },
          instructions: { type: "string" },
        },
        required: ["name", "minutes", "instructions"],
      },
    },
    summary: { type: "string", description: "Closing: discussion questions or a short wrap-up" },
    tips: { type: "array", items: { type: "string" }, description: "2-4 practical tips for the guide" },
  },
  required: ["refused", "title", "goal", "materials", "steps", "summary", "tips"],
} as const;

const isString = (v: unknown): v is string => typeof v === "string";

/** Validates parsed model output. Returns null when the shape is wrong or a non-refusal is empty. */
export function parseAiActivity(raw: unknown): AiActivity | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.refused !== "boolean") return null;
  if (r.refused) return { refused: true, title: "", goal: "", materials: [], steps: [], summary: "", tips: [] };
  const steps = Array.isArray(r.steps)
    ? r.steps.filter(
        (s): s is AiStep =>
          !!s &&
          isString((s as AiStep).name) &&
          isString((s as AiStep).instructions) &&
          typeof (s as AiStep).minutes === "number",
      )
    : [];
  if (!isString(r.title) || !r.title.trim() || steps.length === 0) return null;
  return {
    refused: false,
    title: r.title.trim(),
    goal: isString(r.goal) ? r.goal.trim() : "",
    materials: Array.isArray(r.materials) ? r.materials.filter(isString) : [],
    steps,
    summary: isString(r.summary) ? r.summary.trim() : "",
    tips: Array.isArray(r.tips) ? r.tips.filter(isString) : [],
  };
}
