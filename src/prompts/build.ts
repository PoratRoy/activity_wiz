import { DURATION_MINUTES, findMovement, GROUP_SIZE_MAX, typeLabel, type TypeKey } from "@/data/options";
import { AI_RESPONSE_SCHEMA, parseAiActivity } from "@/lib/ai/schema";
import type { GeminiRequest } from "@/lib/ai/gemini";
import { aiToMarkdown } from "@/lib/markdown/fromAi";
import type { ActivityInput, GroupInput } from "@/lib/validate";
import { buildContentPrompt, parseContentActivity, type ContentPromptInput } from "./content";
import { buildGamePrompt, GAME_SCHEMA, gameToMarkdown, parseGameActivity, type GamePromptInput } from "./playTime";
import { gradeBand, stepsForDuration, STRUCTURE } from "./structure";
import { SYSTEM_PROMPT } from "./system";

/** What a generation stores: the title and the Markdown body. */
export type Generated = { title: string; bodyMd: string };

/** One generation: what to send, and how to read the answer (null = unusable answer). */
export type Generation = GeminiRequest & { parse: (json: unknown) => Generated | "refused" | null };

export function buildGeneration(group: GroupInput, a: ActivityInput): Generation {
  if (a.type === "content") return contentGeneration(group, a);
  if (a.type === "playTime") return gameGeneration(group, a);
  return legacyGeneration(group, a);
}

const toPlace = (place: string) => (place === "במקום פתוח" ? "outside" : place === "במקום סגור" ? "inside" : "any");
const toTeams = (teams: string) => (teams === "עם חלוקה לקבוצות" ? "yes" : teams === "ללא חלוקה לקבוצות" ? "no" : "any");

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
    place: toPlace(a.place),
    minutes: DURATION_MINUTES[a.duration] ?? 60,
    equipment: a.equipment !== "ללא ציוד",
    teams: toTeams(a.teams),
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
      return c && { title: c.title, bodyMd: aiToMarkdown({ ...c, summary: "", tips: [] }) };
    },
  };
}

/* playTime: prompts/playTime.ts. The duration is not used for games. */

function gameGeneration(group: GroupInput, a: ActivityInput): Generation {
  const movement = findMovement(group.movement);
  const input: GamePromptInput = {
    movement: movement?.label ?? "",
    typeLabel: typeLabel(group.movement, a.type) ?? "משחק",
    subject: a.subject.trim(),
    grade: group.grade,
    groupSize: GROUP_SIZE_MAX[group.groupSize] ?? 20,
    groupSizeLabel: group.groupSize,
    gender: group.gender as GamePromptInput["gender"],
    place: toPlace(a.place),
    equipment: a.equipment !== "ללא ציוד",
    teams: toTeams(a.teams),
    shabbat: a.shabbat === "מותאם לשומרי שבת",
    notes: a.notes,
  };
  return {
    ...buildGamePrompt(input),
    schema: GAME_SCHEMA,
    parse: (json) => {
      const g = parseGameActivity(json);
      return g && { title: g.title, bodyMd: gameToMarkdown(g) };
    },
  };
}

/* pointOfView, survival: the previous generic prompt, until their own prompts exist. */

function legacyGeneration(group: GroupInput, a: ActivityInput): Generation {
  const minutes = DURATION_MINUTES[a.duration] ?? 60;
  const type = a.type as Exclude<TypeKey, "content" | "playTime">;

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
      return { title: r.title, bodyMd: aiToMarkdown(r) };
    },
  };
}
