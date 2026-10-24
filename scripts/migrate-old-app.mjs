// One-time import of the old Firebase app's users and saved activities into D1.
// Inputs (kept out of the repo, they hold user data):
//   auth.json       `firebase auth:export auth.json --format=json --project activity-wizard`
//   users.json      Firestore `users` collection, one object per doc with `_docId`
//   activity.json   Firestore `activity` collection, same shape
// Run: `node scripts/migrate-old-app.mjs auth.json users.json activity.json out.sql`,
// then `wrangler d1 execute DB --local --file out.sql` (or --remote).
// Safe to run twice: IDs are derived from the old IDs, users merge on google_sub and activities are INSERT OR IGNORE.
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const [authPath, usersPath, activityPath, outPath] = process.argv.slice(2);
const authUsers = JSON.parse(await readFile(authPath, "utf8")).users;
const profiles = new Map(JSON.parse(await readFile(usersPath, "utf8")).map((u) => [u._docId, u]));
const oldActivities = JSON.parse(await readFile(activityPath, "utf8"));

/** A 10-char [a-z0-9] id (the shape of newId) that is the same every run for the same old id. */
const stableId = (kind, oldId) => BigInt(`0x${createHash("sha256").update(`${kind}:${oldId}`).digest("hex").slice(0, 16)}`).toString(36).padStart(13, "0").slice(-10);

/** Old timestamps are "YYYY-MM-DD HH:MM:SS" in Israel time; returns Unix ms or null. */
function israelTime(s) {
  const m = typeof s === "string" && s.match(/^(\d{4})-(\d\d)-(\d\d)[ T](\d\d):(\d\d):(\d\d)/);
  if (!m) return null;
  const asUtc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  const offsetName = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jerusalem", timeZoneName: "longOffset" })
    .formatToParts(asUtc)
    .find((p) => p.type === "timeZoneName").value; // e.g. "GMT+03:00"
  const [, sign, hh, mm] = offsetName.match(/([+-])(\d\d):(\d\d)/) ?? [, "+", "00", "00"];
  return asUtc - (sign === "-" ? -1 : 1) * (+hh * 60 + +mm) * 60_000;
}

const blank = (v) => (typeof v === "string" ? v.trim() : v) || null;

// ---------- user fields ----------

const HEBREW_GRADES = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "יא", "יב"];
const withGeresh = (g) => (g.length === 1 ? `${g}׳` : `${g[0]}״${g[1]}`);
function grade(v) {
  const s = blank(v);
  if (!s) return null;
  const he = s.match(/^כיתה (\S+)$/);
  if (he && HEBREW_GRADES.includes(he[1])) return `כיתה ${withGeresh(he[1])}`;
  const n = s.match(/^grad[eo] (\d+)$/i);
  if (n && +n[1] >= 1 && +n[1] <= 12) return `כיתה ${withGeresh(HEBREW_GRADES[+n[1] - 1])}`;
  return null; // ranges like "7-8" and foreign school years have no single grade
}

const MOVEMENT_KEYS = new Set(["scout", "oved", "akiva", "maccabi", "camps", "shomer", "bitar", "hadasha", "medtchim", "meshachim", "sayarut", "noam", "agricultural", "shinshin", "other"]);
function movement(v) {
  const s = blank(v);
  if (!s) return null;
  if (s === "Scouts") return "scout";
  return MOVEMENT_KEYS.has(s) ? s : "other";
}

const GENDER = { "מעורב": "מעורב", "חניכים": "בנים", "חניכות": "בנות", mixed: "מעורב", misto: "מעורב", mixte: "מעורב", mixto: "מעורב", boys: "בנים", girls: "בנות", femmes: "בנות" };
const gender = (v) => GENDER[blank(v)] ?? null;

const GROUP_SIZE = { "1-5": "1-5", "5-10": "5-10", "10-20": "10-20", "20-30": "20-30", "30-50": "30+", "60+": "30+" };
const groupSize = (v) => GROUP_SIZE[blank(v)] ?? null;

// ---------- activity fields ----------

const TYPE = { content: "content", contant: "content", pointOfView: "pointOfView", survival: "survival", playTime: "playTime" };
const PLACE = { "במקום סגור": "במקום סגור", "במקום פתוח": "במקום פתוח", "לא משנה": "לא משנה", "not specified": "לא משנה" };
/** Old lengths outside the new list ("20 דקות", "שעתיים") are kept as written. */
const duration = (v) => (blank(v) === "hour" ? "שעה" : blank(v));
/** The old "no preference" answers become null, like the new form's switches when off. */
const preference = (v, english = {}) => {
  const s = english[blank(v)] ?? blank(v);
  return s && s !== "לא משנה" ? s : null;
};

// The body's first line is usually the name: "**שם הפעולה: X**", "**נושא הפעולה:** X", "# שם הפעולה: X", "**[שם המשחק:]** X".
const NAME_LINE = /^#*\s*\**\[?(?:\d+\.\s*)?(?:שם|נושא) (?:הפעולה|המשחק)\s*:?\]?\**\s*:?\s*\**\s*(.+?)\s*\**\s*$/;
function splitTitle(md, subject) {
  const lines = md.replace(/\r\n/g, "\n").trim().split("\n");
  const m = lines[0].match(NAME_LINE);
  const fromLine = m?.[1].replace(/^["“]|["”]$/g, "").replace(/\*+/g, "").trim();
  if (fromLine) return { title: fromLine.slice(0, 120), bodyMd: lines.slice(1).join("\n").trim() };
  return { title: (blank(subject) ?? "פעולה").slice(0, 120), bodyMd: md.trim() };
}

// ---------- SQL ----------

const q = (v) => (v === null || v === undefined ? "NULL" : typeof v === "number" ? String(v) : `'${String(v).replace(/'/g, "''")}'`);
const sql = [];
const googleSubByUid = new Map();

for (const a of authUsers) {
  const sub = a.providerUserInfo?.find((p) => p.providerId === "google.com")?.rawId;
  if (!sub || !a.email) continue;
  googleSubByUid.set(a.localId, sub);
  const p = profiles.get(a.localId) ?? {};
  const row = {
    id: stableId("user", a.localId),
    google_sub: sub,
    email: a.email,
    name: blank(p.name) ?? blank(a.displayName),
    image: blank(a.photoUrl) ?? blank(p.image),
    movement: movement(p.movement),
    grade: grade(p.grade),
    group_size: groupSize(p.amount),
    gender: gender(p.gender),
    created_at: Number(a.createdAt) || israelTime(p.createDate) || Date.now(),
  };
  const cols = Object.keys(row);
  // An account that already signed in to the new app keeps its own values and only gets gaps filled.
  sql.push(
    `INSERT INTO users (${cols.join(", ")}) VALUES (${cols.map((c) => q(row[c])).join(", ")}) ON CONFLICT(google_sub) DO UPDATE SET ` +
      `movement = coalesce(users.movement, excluded.movement), grade = coalesce(users.grade, excluded.grade), ` +
      `group_size = coalesce(users.group_size, excluded.group_size), gender = coalesce(users.gender, excluded.gender), ` +
      `created_at = min(users.created_at, excluded.created_at);`,
  );
}

const seen = new Set();
const skipped = { noText: 0, noUser: 0, duplicate: 0 };
let imported = 0;
for (const o of oldActivities) {
  const text = blank(o.activity);
  const sub = googleSubByUid.get(o.userId);
  if (!text) { skipped.noText++; continue; }
  if (!sub) { skipped.noUser++; continue; }
  const key = `${o.userId}\n${text}`;
  if (seen.has(key)) { skipped.duplicate++; continue; }
  seen.add(key);

  const { title, bodyMd } = splitTitle(text, o.subject);
  const created = israelTime(o.createdAt) ?? israelTime(o.savedAt) ?? israelTime(o.updatedAt) ?? israelTime(profiles.get(o.userId)?.createDate) ?? Date.now();
  const updated = Math.max(created, israelTime(o.updatedAt) ?? 0, israelTime(o.savedAt) ?? 0);
  const row = {
    id: stableId("activity", o._docId),
    title,
    body_md: bodyMd,
    type: TYPE[blank(o.category)] ?? null,
    subject: blank(o.subject),
    place: PLACE[blank(o.place)] ?? null,
    duration: duration(o.time),
    equipment: preference(o.tools, { "without tools": "ללא ציוד" }),
    teams: preference(o.contest),
    shabbat: preference(o.religion),
    notes: blank(o.info),
    created_at: created,
    updated_at: updated,
  };
  const cols = Object.keys(row);
  sql.push(
    `INSERT OR IGNORE INTO activity (user_id, ${cols.join(", ")}) VALUES ((SELECT id FROM users WHERE google_sub = ${q(sub)}), ${cols.map((c) => q(row[c])).join(", ")});`,
  );
  imported++;
}

await writeFile(outPath, `${sql.join("\n")}\n`);
console.log(`users: ${googleSubByUid.size}, activities: ${imported}, skipped: ${JSON.stringify(skipped)}`);
console.log(`wrote ${outPath}`);
