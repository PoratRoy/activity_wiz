// Public URLs are `{hebrew-slug}-{id}` (docs/screens.md). Only the id is used for lookup;
// a wrong or outdated slug redirects to the canonical one.

const ID = /^[a-z0-9]{10}$/;

/** Keeps Hebrew/Latin letters and digits, joins words with "-", max 60 chars. */
export function slugify(title: string): string {
  return title
    .normalize("NFKC")
    .replace(/[֑-ׇ]/g, "") // Hebrew vowel marks
    .replace(/[׳״'"]/g, "")
    .replace(/[^א-תa-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 60)
    .replace(/-+$/, "");
}

export function toSegment(title: string, id: string): string {
  const slug = slugify(title);
  return slug ? `${slug}-${id}` : id;
}

/** The id at the end of a `{slug}-{id}` segment, or null. Accepts percent-encoded input. */
export function parseId(segment: string): string | null {
  let s = segment;
  try {
    s = decodeURIComponent(segment);
  } catch {}
  const id = s.slice(s.lastIndexOf("-") + 1);
  return ID.test(id) ? id : null;
}

// Paths are percent-encoded: Hebrew is not allowed raw in Location headers or sitemap URLs.
export const categoryPath = (c: { id: string; title: string }) => `/library/${encodeURIComponent(toSegment(c.title, c.id))}`;
export const publicActivityPath = (c: { id: string; title: string }, a: { id: string; title: string }) =>
  `${categoryPath(c)}/${encodeURIComponent(toSegment(a.title, a.id))}`;

/** True when a route segment (encoded or not) equals the canonical segment. */
export function sameSegment(segment: string, canonical: string): boolean {
  const dec = (s: string) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  };
  return dec(segment) === dec(canonical);
}
