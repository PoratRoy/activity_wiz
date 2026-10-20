/**
 * Category artwork bundled in public/library (full size) and public/library/thumbs (row thumbnails).
 * A category stores one of these names in public_category.image; anything else falls back to the default.
 * To add one: drop `<name>.webp` in public/library, run `node scripts/library-thumbs.mjs`, add the name here.
 */
export const LIBRARY_IMAGES = [
  "games",
  "animales",
  "newyear",
  "holidays",
  "EnvironmentalQuality",
  "Leaders",
  "Superheros",
  "responsibility",
] as const;

export type LibraryImage = (typeof LIBRARY_IMAGES)[number];

export function isLibraryImage(name: unknown): name is LibraryImage {
  return typeof name === "string" && (LIBRARY_IMAGES as readonly string[]).includes(name);
}

const DEFAULT_THUMB = "/illustrations/home-trail.webp";

/** Row thumbnail for a category's stored image name; no image (or an unknown one) gets the shared default. */
export function categoryThumb(image: string | null | undefined): string {
  return isLibraryImage(image) ? `/library/thumbs/${image}.webp` : DEFAULT_THUMB;
}
