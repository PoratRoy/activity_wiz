// Free text from the guide (subject, notes) goes into the user message between <<< and >>>.
// Each system prompt says that text is a request about the activity, never instructions to the model.

/** Wraps guide text in the markers. The marker characters and control characters are removed from the text. */
export function guideText(text: string, empty = "אין"): string {
  const clean = text
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/g, " ")
    .trim();
  return `<<<${clean || empty}>>>`;
}
