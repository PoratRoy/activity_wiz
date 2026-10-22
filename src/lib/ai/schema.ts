// What every activity type is converted to before it becomes Markdown (lib/markdown/fromAi.ts).
// summary and tips are always empty now; aiToMarkdown still renders them when present.

export type AiStep = { name: string; minutes: number; instructions: string };

export type GeneratedActivity = {
  title: string;
  goal: string;
  materials: string[];
  steps: AiStep[];
  summary: string;
  tips: string[];
};
