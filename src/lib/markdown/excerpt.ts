import { stripInline } from "./toPlain";

/** First words of a Markdown body as one plain line (cards, meta descriptions). */
export function excerpt(bodyMd: string, max = 150): string {
  const text = bodyMd
    .split("\n")
    .map((l) => stripInline(l.replace(/^#{1,6}\s+/, "").replace(/^\s*([-*+]|\d+\.)\s+/, "")).trim())
    .filter(Boolean)
    .join(" ");
  return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, "")}…` : text;
}
