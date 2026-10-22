import { DURATION_MINUTES, findMovement, GROUP_SIZE_MAX, typeLabel } from "@/data/options";
import type { GeminiRequest } from "@/lib/ai/gemini";
import { aiToMarkdown } from "@/lib/markdown/fromAi";
import type { ActivityInput, GroupInput } from "@/lib/validate";
import { buildContentPrompt, parseContentActivity, type ContentPromptInput } from "./content";
import { buildPointOfViewPrompt, parsePointOfViewActivity } from "./pointOfView";
import { buildGamePrompt, GAME_SCHEMA, gameToMarkdown, parseGameActivity, type GamePromptInput } from "./playTime";
import { buildSurvivalPrompt, parseSurvivalActivity, SURVIVAL_SCHEMA, survivalToMarkdown } from "./survival";

/** What a generation stores: the title and the Markdown body. */
export type Generated = { title: string; bodyMd: string };

/** One generation: what to send, and how to read the answer (null = unusable answer). */
export type Generation = GeminiRequest & { parse: (json: unknown) => Generated | null };

export function buildGeneration(group: GroupInput, a: ActivityInput): Generation {
  if (a.type === "content") return contentGeneration(group, a);
  if (a.type === "pointOfView") return pointOfViewGeneration(group, a);
  if (a.type === "survival") return survivalGeneration(group, a);
  return gameGeneration(group, a);
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

/* pointOfView: prompts/pointOfView.ts. Same request fields as content; teams is not used. */

function pointOfViewGeneration(group: GroupInput, a: ActivityInput): Generation {
  const { systemInstruction, contents, responseJsonSchema, timing } = buildPointOfViewPrompt(toContentInput(group, a));
  return {
    systemInstruction,
    contents,
    schema: responseJsonSchema,
    parse: (json) => {
      const d = parsePointOfViewActivity(json, timing);
      // The hidden plan is dropped here: it is never shown to the guide.
      return d && { title: d.title, bodyMd: aiToMarkdown({ ...d, summary: "", tips: [] }) };
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

/* survival: prompts/survival.ts. Same request fields as content; the duration only sizes the practical part. */

function survivalGeneration(group: GroupInput, a: ActivityInput): Generation {
  return {
    ...buildSurvivalPrompt(toContentInput(group, a)),
    schema: SURVIVAL_SCHEMA,
    parse: (json) => {
      const s = parseSurvivalActivity(json);
      return s && { title: s.title, bodyMd: survivalToMarkdown(s) };
    },
  };
}
