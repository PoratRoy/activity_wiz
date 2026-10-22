import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

// The 5 tables of docs/data-model.md. Timestamps are Unix milliseconds.

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
  /** ID of the last broadcast message this user dismissed; a different current ID means it's unseen. */
  lastSeenMessageId: text("last_seen_message_id"),
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
    /** Which ages it fits (AGES in src/data/options.ts). Shown in the library only; not copied when saved. */
    age: text("age").notNull().default("לא משנה"),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [index("public_activity_category_created_idx").on(t.categoryId, t.createdAt)],
);

/** The admin's message to signed-in users. At most one row: every send replaces it with a new ID. */
export const broadcastMessage = sqliteTable("broadcast_message", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  /** Show a free-text feedback field that is emailed to the contact address. */
  withForm: integer("with_form", { mode: "boolean" }).notNull().default(false),
  sentAt: integer("sent_at").notNull(),
});

export type User = typeof users.$inferSelect;
export type Activity = typeof activity.$inferSelect;
export type PublicCategory = typeof publicCategory.$inferSelect;
export type PublicActivity = typeof publicActivity.$inferSelect;
export type BroadcastMessage = typeof broadcastMessage.$inferSelect;
