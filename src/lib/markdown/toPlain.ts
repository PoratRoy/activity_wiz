// Markdown → plain text for the copy button: symbols stripped, bullets and numbering kept.

export function stripInline(line: string): string {
  return line
    .replace(/<\/?u>/gi, "")
    .replace(/\+\+(.+?)\+\+/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, "$1$2")
    .replace(/`([^`]+)`/g, "$1");
}

export function toPlainText(title: string, bodyMd: string): string {
  const lines = bodyMd.split("\n").map((raw) => {
    const heading = raw.match(/^#{1,6}\s+(.*)$/);
    if (heading) return stripInline(heading[1]);
    const bullet = raw.match(/^(\s*)[-*+]\s+(.*)$/);
    if (bullet) return `${bullet[1]}• ${stripInline(bullet[2])}`;
    return stripInline(raw);
  });
  return `${title}\n\n${lines.join("\n")}`.replace(/\n{3,}/g, "\n\n").trim();
}
