import "server-only";
import { and, asc, count, desc, eq, max, ne, sql } from "drizzle-orm";
import { getDb, newId } from "./client";
import { activity, publicActivity, publicCategory, users } from "./schema";

export type Group = {
  movement: string;
  grade: string;
  groupSize: string;
  gender: string;
};

export type ActivityDetails = {
  type: string;
  subject: string;
  place: string;
  duration: string;
  equipment?: string | null;
  teams?: string | null;
  shabbat?: string | null;
  notes?: string | null;
};

/** Personal activities may have no details (e.g. claimed drafts with unknown values). */
export type ActivityContent = { [K in keyof ActivityDetails]?: string | null } & { title: string; bodyMd: string };

// ---------- users ----------

export async function upsertUserByGoogleSub(p: {
  sub: string;
  email: string;
  name?: string | null;
  image?: string | null;
}): Promise<string> {
  const db = getDb();
  const [row] = await db
    .insert(users)
    .values({
      id: newId(),
      googleSub: p.sub,
      email: p.email,
      name: p.name ?? null,
      image: p.image ?? null,
      createdAt: Date.now(),
    })
    .onConflictDoUpdate({
      target: users.googleSub,
      set: { email: p.email, name: p.name ?? null, image: p.image ?? null },
    })
    .returning({ id: users.id });
  return row.id;
}

export async function getUser(id: string) {
  return (await getDb().select().from(users).where(eq(users.id, id)).get()) ?? null;
}

export async function updateGroup(userId: string, group: Group) {
  await getDb().update(users).set(group).where(eq(users.id, userId));
}

// ---------- personal activities ----------

export async function listActivities(userId: string) {
  return getDb()
    .select({ id: activity.id, title: activity.title, createdAt: activity.createdAt })
    .from(activity)
    .where(eq(activity.userId, userId))
    .orderBy(desc(activity.createdAt));
}

export async function countActivities(userId: string): Promise<number> {
  const row = await getDb().select({ n: count() }).from(activity).where(eq(activity.userId, userId)).get();
  return row?.n ?? 0;
}

export async function getActivity(id: string, userId: string) {
  return (
    (await getDb()
      .select()
      .from(activity)
      .where(and(eq(activity.id, id), eq(activity.userId, userId)))
      .get()) ?? null
  );
}

export async function insertActivity(userId: string, data: ActivityContent): Promise<string> {
  const id = newId();
  const now = Date.now();
  await getDb()
    .insert(activity)
    .values({
      id,
      userId,
      title: data.title,
      bodyMd: data.bodyMd,
      type: data.type ?? null,
      subject: data.subject ?? null,
      place: data.place ?? null,
      duration: data.duration ?? null,
      equipment: data.equipment ?? null,
      teams: data.teams ?? null,
      shabbat: data.shabbat ?? null,
      notes: data.notes ?? null,
      createdAt: now,
      updatedAt: now,
    });
  return id;
}

/** Returns false when the activity doesn't exist or isn't owned by userId. */
export async function updateActivity(
  id: string,
  userId: string,
  patch: { title: string; bodyMd: string },
): Promise<boolean> {
  const rows = await getDb()
    .update(activity)
    .set({ ...patch, updatedAt: Date.now() })
    .where(and(eq(activity.id, id), eq(activity.userId, userId)))
    .returning({ id: activity.id });
  return rows.length > 0;
}

export async function deleteActivity(id: string, userId: string): Promise<boolean> {
  const rows = await getDb()
    .delete(activity)
    .where(and(eq(activity.id, id), eq(activity.userId, userId)))
    .returning({ id: activity.id });
  return rows.length > 0;
}

// ---------- public library ----------

/** Admin-set order; creation time breaks ties. */
const categoryOrder = [asc(publicCategory.position), asc(publicCategory.createdAt)];

export async function listCategories() {
  return getDb().select().from(publicCategory).orderBy(...categoryOrder);
}

/** Categories in display order, with their public activity counts. */
export async function listCategoriesWithCounts() {
  return getDb()
    .select({
      id: publicCategory.id,
      title: publicCategory.title,
      key: publicCategory.key,
      createdAt: publicCategory.createdAt,
      count: count(publicActivity.id),
    })
    .from(publicCategory)
    .leftJoin(publicActivity, eq(publicActivity.categoryId, publicCategory.id))
    .groupBy(publicCategory.id)
    .orderBy(...categoryOrder);
}

export async function getCategory(id: string) {
  return (await getDb().select().from(publicCategory).where(eq(publicCategory.id, id)).get()) ?? null;
}

export async function insertCategory(title: string, key: string): Promise<string> {
  const id = newId();
  const db = getDb();
  const last = await db.select({ position: max(publicCategory.position) }).from(publicCategory).get();
  await db.insert(publicCategory).values({ id, title, key, position: (last?.position ?? -1) + 1, createdAt: Date.now() });
  return id;
}

export async function updateCategoryKey(id: string, key: string): Promise<boolean> {
  const rows = await getDb().update(publicCategory).set({ key }).where(eq(publicCategory.id, id)).returning({ id: publicCategory.id });
  return rows.length > 0;
}

/** True when another category already uses this key, ignoring case. */
export async function categoryKeyTaken(key: string, exceptId?: string): Promise<boolean> {
  const match = and(
    sql`lower(${publicCategory.key}) = ${key.toLowerCase()}`,
    exceptId ? ne(publicCategory.id, exceptId) : undefined,
  );
  return !!(await getDb().select({ id: publicCategory.id }).from(publicCategory).where(match).get());
}

/** Saves a full category order. Returns false unless `ids` is exactly the current set of categories. */
export async function setCategoryOrder(ids: string[]): Promise<boolean> {
  const db = getDb();
  const current = await db.select({ id: publicCategory.id }).from(publicCategory);
  const known = new Set(current.map((c) => c.id));
  if (ids.length !== known.size || new Set(ids).size !== ids.length || !ids.every((id) => known.has(id))) return false;
  if (ids.length === 0) return true;
  const [first, ...rest] = ids.map((id, position) =>
    db.update(publicCategory).set({ position }).where(eq(publicCategory.id, id)),
  );
  await db.batch([first, ...rest]);
  return true;
}

/** Cascades to the category's public activities (FK on delete cascade). */
export async function deleteCategory(id: string) {
  await getDb().delete(publicCategory).where(eq(publicCategory.id, id));
}

export async function listPublicActivities(categoryId: string) {
  return getDb()
    .select({
      id: publicActivity.id,
      title: publicActivity.title,
      bodyMd: publicActivity.bodyMd,
      place: publicActivity.place,
      duration: publicActivity.duration,
      age: publicActivity.age,
      createdAt: publicActivity.createdAt,
    })
    .from(publicActivity)
    .where(eq(publicActivity.categoryId, categoryId))
    .orderBy(desc(publicActivity.createdAt));
}

export async function listAllPublicActivityRefs() {
  return getDb()
    .select({
      id: publicActivity.id,
      title: publicActivity.title,
      categoryId: publicActivity.categoryId,
      createdAt: publicActivity.createdAt,
    })
    .from(publicActivity);
}

export async function getPublicActivity(id: string) {
  return (await getDb().select().from(publicActivity).where(eq(publicActivity.id, id)).get()) ?? null;
}

export async function insertPublicActivity(
  categoryId: string,
  data: ActivityDetails & { title: string; bodyMd: string; age: string },
): Promise<string> {
  const id = newId();
  await getDb()
    .insert(publicActivity)
    .values({
      id,
      categoryId,
      title: data.title,
      bodyMd: data.bodyMd,
      type: data.type,
      subject: data.subject,
      place: data.place,
      duration: data.duration,
      equipment: data.equipment ?? null,
      teams: data.teams ?? null,
      shabbat: data.shabbat ?? null,
      notes: data.notes ?? null,
      age: data.age,
      createdAt: Date.now(),
    });
  return id;
}

export async function deletePublicActivity(id: string) {
  await getDb().delete(publicActivity).where(eq(publicActivity.id, id));
}

export async function countPublicActivities(categoryId: string): Promise<number> {
  const [row] = await getDb()
    .select({ n: count() })
    .from(publicActivity)
    .where(eq(publicActivity.categoryId, categoryId));
  return row?.n ?? 0;
}
