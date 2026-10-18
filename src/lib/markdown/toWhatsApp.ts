import { stripInline } from "./toPlain";

// Markdown → WhatsApp formatting (docs/ai.md "Share text"): **x** → *x*, headings → *bold* lines,
// "- " → "• ", numbered lists kept, underline dropped, title first, site link last.

function inlineToWhatsApp(line: string): string {
  return line
    .replace(/<\/?u>/gi, "")
    .replace(/\*\*(.+?)\*\*/g, "\u0000$1\u0000")
    .replace(/__(.+?)__/g, "\u0000$1\u0000")
    .replace(/(^|[^*\u0000])\*(?!\s)(.+?)\*/g, "$1_$2_")
    .replace(/\u0000/g, "*");
}

export function toWhatsApp(title: string, bodyMd: string, siteUrl?: string): string {
  const lines = bodyMd.split("\n").map((raw) => {
    const heading = raw.match(/^#{1,6}\s+(.*)$/);
    if (heading) return `*${stripInline(heading[1])}*`;
    const bullet = raw.match(/^(\s*)[-*+]\s+(.*)$/);
    if (bullet) return `${bullet[1]}• ${inlineToWhatsApp(bullet[2])}`;
    return inlineToWhatsApp(raw);
  });
  const text = `*${title}*\n\n${lines.join("\n")}`.replace(/\n{3,}/g, "\n\n").trim();
  return siteUrl ? `${text}\n\n${siteUrl}` : text;
}
