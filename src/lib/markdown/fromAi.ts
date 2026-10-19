import type { GeneratedActivity } from "@/lib/ai/schema";

/** Converts the AI JSON to the stored Markdown body (title is stored separately). */
export function aiToMarkdown(a: GeneratedActivity): string {
  const parts: string[] = [];
  if (a.goal) parts.push(`**מטרה:** ${a.goal}`);
  if (a.materials.length) parts.push(`## ציוד\n${a.materials.map((m) => `- ${m}`).join("\n")}`);
  parts.push(
    `## מהלך הפעולה\n${a.steps
      .map((s, i) => `### ${i + 1}. ${s.name} (${s.minutes} דק׳)\n${s.instructions.trim()}`)
      .join("\n\n")}`,
  );
  if (a.summary) parts.push(`## סיכום\n${a.summary}`);
  if (a.tips.length) parts.push(`## טיפים למדריך\n${a.tips.map((t) => `- ${t}`).join("\n")}`);
  return parts.join("\n\n");
}
