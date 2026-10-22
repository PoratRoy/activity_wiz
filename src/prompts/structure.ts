import type { TypeKey } from "@/data/options";

// Legacy prompt: what survival looks like until it gets its own prompt
// file like content.ts. The rest of the prompt is shared (system.ts).

export const STRUCTURE: Record<Exclude<TypeKey, "content" | "pointOfView" | "playTime">, string> = {
  survival: `ACTIVITY TYPE: scouting / outdoor skills (צופיות / הישרדות).
Structure: teach one practical skill related to the subject (knots, orientation, building, fire safety, nature knowledge) through demonstration, hands-on practice in small groups, and a closing challenge or mini-competition that uses the skill. Include clear safety notes inside the steps.`,
};

/** Number of steps to aim for, by duration in minutes. */
export function stepsForDuration(minutes: number): string {
  if (minutes <= 30) return "about 3 steps";
  if (minutes <= 60) return "4-5 steps";
  return "5-6 steps";
}

/** Level of the content by grade band (א-ג, ד-ו, ז-ט, י-יב). */
export function gradeBand(grade: string): string {
  const order = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "יא", "יב"];
  const letter = grade.replace("כיתה", "").replace(/[׳״'"\s]/g, "");
  const i = order.indexOf(letter);
  if (i <= 2) return "Young kids (grades 1-3): very simple, playful, short instructions, lots of movement, no abstract discussion.";
  if (i <= 5) return "Kids (grades 4-6): playful with simple discussion, concrete examples.";
  if (i <= 8) return "Middle school (grades 7-9): social themes, real discussion, some independence.";
  return "High school (grades 10-12): deeper discussion, values and dilemmas, mature tone.";
}
