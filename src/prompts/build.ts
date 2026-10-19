import { DURATION_MINUTES, findMovement, GROUP_SIZE_MAX, typeLabel, type TypeKey } from "@/data/options";
import { AI_RESPONSE_SCHEMA, parseAiActivity, type GeneratedActivity } from "@/lib/ai/schema";
import type { GeminiRequest } from "@/lib/ai/gemini";
import type { ActivityInput, GroupInput } from "@/lib/validate";
import { buildContentPrompt, parseContentActivity, type ContentPromptInput } from "./content";
import { gradeBand, stepsForDuration, STRUCTURE } from "./structure";
import { SYSTEM_PROMPT } from "./system";

/** One generation: what to send, and how to read the answer (null = unusable answer). */
export type Generation = GeminiRequest & { parse: (json: unknown) => GeneratedActivity | "refused" | null };

export function buildGeneration(group: GroupInput, a: ActivityInput): Generation {
  if (a.type === "content") return contentGeneration(group, a);
  return legacyGeneration(group, a);
}

/* content: prompts/content.ts */

function toContentInput(group: GroupInput, a: ActivityInput): ContentPromptInput {
  const movement = findMovement(group.movement);
  return {
    movement: movement?.label ?? "",
    groupTerm: movement?.groupTerm ?? "קבוצה",
    typeLabel: typeLabel(group.movement, a.type) ?? "פעולה",
    subject: a.subject.trim(),
    grade: group.grade,
    groupSize: GROUP_SIZE_MAX[group.groupSize] ?? 20,
    groupSizeLabel: group.groupSize,
    gender: group.gender as ContentPromptInput["gender"],
    place: a.place === "במקום פתוח" ? "outside" : a.place === "במקום סגור" ? "inside" : "any",
    minutes: DURATION_MINUTES[a.duration] ?? 60,
    equipment: a.equipment !== "ללא ציוד",
    teams: a.teams === "עם חלוקה לקבוצות" ? "yes" : a.teams === "ללא חלוקה לקבוצות" ? "no" : "any",
    shabbat: a.shabbat === "מותאם לשומרי שבת",
    notes: a.notes,
  };
}

function contentGeneration(group: GroupInput, a: ActivityInput): Generation {
  const { systemInstruction, contents, responseJsonSchema, timing } = buildContentPrompt(toContentInput(group, a));
  return {
    systemInstruction,
    contents,
    schema: responseJsonSchema,
    parse: (json) => {
      const c = parseContentActivity(json, timing);
      // The hidden plan is dropped here: it is never shown to the guide.
      return c && { title: c.title, goal: c.goal, materials: c.materials, steps: c.steps, summary: "", tips: [] };
    },
  };
}

/* pointOfView, survival, playTime: the previous generic prompt, until their own prompts exist. */

function legacyGeneration(group: GroupInput, a: ActivityInput): Generation {
  const minutes = DURATION_MINUTES[a.duration] ?? 60;
  const type = a.type as Exclude<TypeKey, "content">;

  const systemInstruction = [
    SYSTEM_PROMPT,
    STRUCTURE[type],
    `LENGTH: ${minutes} minutes in total, ${stepsForDuration(minutes)}.`,
    `LEVEL: ${gradeBand(group.grade)}`,
  ].join("\n\n");

  const line = (label: string, value: string) => `${label}: ${value || "לא משנה"}`;
  const contents = [
    "USER DATA",
    line("Movement", findMovement(group.movement)?.label ?? ""),
    line("Activity type", typeLabel(group.movement, a.type) ?? ""),
    `Participants grade: ${group.grade} | Group size: ${group.groupSize} | Gender: ${group.gender}`,
    line("Subject", a.subject),
    `Place: ${a.place} | Duration: ${a.duration} (${minutes} minutes)`,
    `${line("Equipment", a.equipment)} | ${line("Teams", a.teams)} | ${line("Shabbat", a.shabbat)}`,
    `Notes: ${a.notes || "-"}`,
    "END USER DATA",
  ].join("\n");

  return {
    systemInstruction,
    contents,
    schema: AI_RESPONSE_SCHEMA,
    parse: (json) => {
      const r = parseAiActivity(json);
      if (!r) return null;
      if (r.refused) return "refused";
      const { refused: _, ...activity } = r;
      return activity;
    },
  };
}
