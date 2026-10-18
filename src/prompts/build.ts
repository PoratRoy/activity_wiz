import { DURATION_MINUTES, findMovement, typeLabel, type TypeKey } from "@/data/options";
import type { ActivityInput, GroupInput } from "@/lib/validate";
import { gradeBand, stepsForDuration, STRUCTURE } from "./structure";
import { SYSTEM_PROMPT } from "./system";

/** Builds the system instruction and the user message for one generation (docs/ai.md). */
export function buildPrompt(group: GroupInput, a: ActivityInput): { systemInstruction: string; contents: string } {
  const minutes = DURATION_MINUTES[a.duration] ?? 60;
  const type = a.type as TypeKey;

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

  return { systemInstruction, contents };
}
