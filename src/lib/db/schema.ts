import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

// The 4 tables of docs/data-model.md. Timestamps are Unix milliseconds.

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  googleSub: text("google_sub").notNull().unique(),
  email: text("email").notNull(),
  name: text("name"),
  image: text("image"),
  movement: text("movement"),
  grade: text("grade"),
  groupSize: text("group_size"),
  gender: text("gender"),
  createdAt: integer("created_at").notNull(),
});

// Content columns shared by personal and public activities.
const activityDetails = {
  title: text("title").notNull(),
  bodyMd: text("body_md").notNull(),
};

export const activity = sqliteTable(
  "activity",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...activityDetails,
    type: text("type"),
    subject: text("subject"),
    place: text("place"),
    duration: text("duration"),
    equipment: text("equipment"),
    teams: text("teams"),
    shabbat: text("shabbat"),
    notes: text("notes"),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (t) => [index("activity_user_created_idx").on(t.userId, t.createdAt)],
);

export const publicCategory = sqliteTable(
  "public_category",
  {
    id: text("id").primaryKey(),
    /** Hebrew name shown to users. */
    title: text("title").notNull(),
    /** English name; picks the artwork in public/library with the same name (src/data/libraryImages.ts). */
    key: text("key"),
    /** Display order set by the admin, ascending; new categories go last. */
    position: integer("position").notNull().default(0),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [uniqueIndex("public_category_key_unique").on(t.key)],
);

export const publicActivity = sqliteTable(
  "public_activity",
  {
    id: text("id").primaryKey(),
    categoryId: text("category_id")
      .notNull()
      .references(() => publicCategory.id, { onDelete: "cascade" }),
    ...activityDetails,
    type: text("type").notNull(),
    subject: text("subject").notNull(),
    place: text("place").notNull(),
    duration: text("duration").notNull(),
    equipment: text("equipment"),
    teams: text("teams"),
    shabbat: text("shabbat"),
    notes: text("notes"),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [index("public_activity_category_created_idx").on(t.categoryId, t.createdAt)],
);

export type User = typeof users.$inferSelect;
export type Activity = typeof activity.$inferSelect;
export type PublicCategory = typeof publicCategory.$inferSelect;
export type PublicActivity = typeof publicActivity.$inferSelect;
