// Regenerates src/data/legacyRedirects.ts from live D1.
// Usage: npx wrangler d1 execute activitywiz --remote --json --command "SELECT c.id cid, c.key, c.title ctitle, a.id aid, a.title atitle FROM public_category c LEFT JOIN public_activity a ON a.category_id=c.id" > /tmp/lib.json
//        node scripts/legacy-redirects.mjs /tmp/lib.json src/data/legacyRedirects.ts
import { readFileSync, writeFileSync } from "node:fs";

const [libJson, outFile] = process.argv.slice(2);
const rows = JSON.parse(readFileSync(libJson, "utf8"))[0].results;

// Same as src/lib/slug.ts.
function slugify(title) {
  return title
    .normalize("NFKC")
    .replace(/[֑-ׇ]/g, "")
    .replace(/[׳״'"]/g, "")
    .replace(/[^א-תa-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 60)
    .replace(/-+$/, "");
}
const seg = (t, id) => (slugify(t) ? `${slugify(t)}-${id}` : id);

const cats = new Map();
const acts = new Map();
for (const r of rows) {
  cats.set(r.key, { id: r.cid, title: r.ctitle });
  if (r.aid) acts.set(r.aid, { id: r.aid, title: r.atitle, cat: { id: r.cid, title: r.ctitle } });
}
const catPath = (c) => `/library/${encodeURIComponent(seg(c.title, c.id))}`;
const actPath = (a) => `${catPath(a.cat)}/${encodeURIComponent(seg(a.title, a.id))}`;

// Old category slug → new category key.
const CATEGORY = {
  games: "Games", intro: "Games", holidays: "Holidays", responsibility: "Responsibility",
  environmental: "Environment", animals: "Animals", superhero: "Superheroes", harassment: "SexualHarassment",
  traffic: "RoadSafety", friendship: "Friendship", israel: "Israel", sevenOct: "Israel", personalities: "Israel",
  movies: "Movies", teamwork: "Teamwork", seasons: "Seasons", peak: "Highlights",
};

// Old "category/activity" slug → new public activity id. Unlisted activities go to their category.
const ACTIVITY = {
  "games/chaos": "4wgegjyi91", "games/rabbit": "19h67fuhn5", "games/balloon": "my4qpslyh3",
  "games/hockey": "wy7g2791zu", "games/machine": "keblh515x2", "games/circle": "ifcniiq80n",
  "games/kettle": "ucqx27bqic", "games/wind": "bdy1d1la2t", "games/killer": "5k8lepjnrv",
  "games/story": "mwzhb1dled", "games/bingo": "t68egdke56", "games/character": "65ebiifhcx",
  "games/flag": "1c2vmvyn2u", "games/ball": "ozazzxnvvt", "games/champion": "0sk1nvgdzr",
  "games/laugh": "b79mbbagux", "games/evolution": "5toniv8hs0", "games/dialogue": "m5affw85es",
  "games/funny": "m5affw85es", "games/sing": "9r42va797i",
  "holidays/roshHashanah": "8vplf4nqp4", "holidays/hanukkah": "uqraj1qs18",
  "holidays/tuBshvat": "nir5s96f1f", "holidays/tuBshvatGame": "nir5s96f1f",
  "holidays/purim": "tvn4cq7o7g", "holidays/purimGames": "tvn4cq7o7g",
  "holidays/pesah": "n9kfid4w32", "holidays/pesah4sons": "n9kfid4w32",
  "holidays/yomshoa": "qoatss0ucf", "holidays/yomzikaron": "hqo84ywhk7",
  "holidays/yomazmaut": "kr8x7lq33d", "holidays/lagBaomer": "rw7vxxsu0o",
  "animals/animalWorld": "em77xdgsvb", "animals/myPets": "bekiy38t5l",
  "animals/animalHabitats": "9mciv7ibay", "animals/animalProtection": "ojfkf6j0ce",
  "superhero/superheroAcademy": "hy1gr7gdpk", "harassment/harassment": "k3zgx8897q",
  "traffic/publicTransport": "9c82d8sv3l", "traffic/trafficLight": "ff83ux6gyc",
  "friendship/friendsForever": "ql7jt4r198",
  "israel/idf": "tvq22lquq6", "israel/AliyahToIsrael": "s3p2crinq0", "israel/kaftet": "z49yy7h741",
  "israel/memory": "ilqkomna2k", "israel/haravotBarzel": "zfw50h1smx",
  "sevenOct/memory": "ilqkomna2k", "sevenOct/haravotBarzel": "zfw50h1smx", "sevenOct/emotional": "qmtp3iyzt6",
  "israel/emotional": "qmtp3iyzt6",
  "movies/movieJourney": "35z4fz1fnl", "movies/hollywoodInMiniature": "33i85izvtb",
  "teamwork/survival": "ql6qolf3gy",
  "seasons/summerAdventure": "b5d0ovz0w7", "seasons/winterWorld": "wv36tyc2sz",
  "seasons/autumnJourney": "gz758wgo9z", "seasons/springBlossom": "mwhccgd5ih",
  "peak/escape": "o0fndwyrpb", "peak/treasure": "5ulms3lt6c", "peak/skyline": "1hrvsc86lu",
};

const activityRedirects = Object.entries(ACTIVITY).map(([old, id]) => {
  const a = acts.get(id);
  if (!a) throw new Error(`missing activity ${id} for ${old}`);
  return [old, actPath(a), a.title];
});
const categoryRedirects = Object.entries(CATEGORY).map(([old, key]) => {
  const c = cats.get(key);
  if (!c) throw new Error(`missing category ${key}`);
  return [old, catPath(c), c.title];
});

const line = ([old, path, title]) => `  ${JSON.stringify(old)}: ${JSON.stringify(path)}, // ${title}`;
writeFileSync(
  outFile,
  `// Old activitywiz.com library URLs (/he/youth/content/...) and where they now redirect (docs/domain-migration.md).
// Generated from live D1 on ${new Date().toISOString().slice(0, 10)}. Targets are full canonical paths so each redirect is one hop;
// if an activity is renamed later, the page itself redirects the outdated slug, so these keep working.

/** "{old category}/{old activity}" → new public activity path. */
export const LEGACY_ACTIVITIES: Record<string, string> = {
${activityRedirects.map(line).join("\n")}
};

/** Old category slug → new category path. Old activities not listed above land on their category. */
export const LEGACY_CATEGORIES: Record<string, string> = {
${categoryRedirects.map(line).join("\n")}
};
`,
);
console.log(activityRedirects.length, "activities,", categoryRedirects.length, "categories");
