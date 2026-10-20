import names from "./libraryImages.json";

/**
 * Category artwork: public/library/<name>.webp (full size) and public/library/thumbs/<name>.webp (row
 * thumbnail). libraryImages.json lists the names; `node scripts/library-thumbs.mjs` regenerates both.
 * A category shows the image whose name matches its English key, ignoring case.
 */
const byKey = new Map(names.map((name) => [name.toLowerCase(), name]));

const DEFAULT_THUMB = "/illustrations/home-trail.webp";

/** The image name for a category key, or null when no image matches. */
export function imageForKey(key: string | null | undefined): string | null {
  return (key && byKey.get(key.trim().toLowerCase())) || null;
}

/** Row thumbnail for a category key; no matching image gets the shared default. */
export function categoryThumb(key: string | null | undefined): string {
  const name = imageForKey(key);
  return name ? `/library/thumbs/${name}.webp` : DEFAULT_THUMB;
}

/** English letters, digits, "-" and "_", starting with a letter. */
export const CATEGORY_KEY_PATTERN = /^[A-Za-z][A-Za-z0-9_-]{0,39}$/;
