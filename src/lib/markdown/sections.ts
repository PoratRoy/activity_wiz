// Display-only cleanups of an activity body before it is rendered on the activity pages.

const EQUIPMENT_HEADING = /^##\s+ציוד/;
const SECTION_END = /^#{1,2}\s/;
const LIST_MARKER = /^\s*(?:[-*+]|\d+[.)])\s*/;
// "ללא ציוד", "אין צורך בציוד", "לא נדרש ציוד", "בלי ציוד", or a lone dash.
const NO_EQUIPMENT = /^(?:ללא|אין|בלי|לא\s+(?:נדרש|נדרשים|צריך|צריכים|נחוץ))(?:\s|$)|^[-–—.]*$/;

/** Drops the ציוד section when it lists nothing real (empty, or only "no equipment" lines). */
export function withoutEmptyEquipment(md: string): string {
  const lines = md.split("\n");
  const start = lines.findIndex((l) => EQUIPMENT_HEADING.test(l.trim()));
  if (start === -1) return md;
  let end = start + 1;
  while (end < lines.length && !SECTION_END.test(lines[end].trim())) end++;
  const items = lines
    .slice(start + 1, end)
    .map((l) => l.replace(LIST_MARKER, "").replace(/\*\*|__/g, "").trim())
    .filter(Boolean);
  if (items.some((i) => !NO_EQUIPMENT.test(i))) return md;
  return [...lines.slice(0, start), ...lines.slice(end)].join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
