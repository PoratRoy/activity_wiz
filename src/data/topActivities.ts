/** The fixed «הכי פופולרי» row at the top of the library: not a category, not admin-managed. */
export const TOP_ROW = {
  title: "הכי פופולרי",
  /** Artwork name in public/library (TopTen.webp); until it's added, the row shows the default image. */
  imageKey: "TopTen",
  href: "/library/top",
  size: 10,
} as const;
