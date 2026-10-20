// Makes the library row thumbnails (3× the 130px-wide row artwork, aspect ratio kept) from the full-size art in public/library,
// and writes the list of image names to src/data/libraryImages.json.
// Run after adding an image: `node scripts/library-thumbs.mjs`. A category whose key matches a name
// (case-insensitive) shows that image.
import { mkdir, readdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SRC = "public/library";
const OUT = "public/library/thumbs";

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => f.endsWith(".webp")).sort();
for (const file of files) {
  await sharp(`${SRC}/${file}`).resize({ width: 390 }).webp({ quality: 80 }).toFile(`${OUT}/${file}`);
  console.log(`${OUT}/${file}`);
}
const names = files.map((f) => f.replace(/\.webp$/, ""));
await writeFile("src/data/libraryImages.json", `${JSON.stringify(names, null, 2)}\n`);
console.log(`src/data/libraryImages.json: ${names.length} images`);
