// Makes the library row thumbnails (3× the 72 × 52 slot) from the full-size art in public/library.
// Run after adding an image: `node scripts/library-thumbs.mjs`, then list the name in src/data/libraryImages.ts.
import { mkdir, readdir } from "node:fs/promises";
import sharp from "sharp";

const SRC = "public/library";
const OUT = "public/library/thumbs";

await mkdir(OUT, { recursive: true });
for (const file of (await readdir(SRC)).filter((f) => f.endsWith(".webp"))) {
  await sharp(`${SRC}/${file}`).resize(216, 156, { fit: "cover" }).webp({ quality: 80 }).toFile(`${OUT}/${file}`);
  console.log(`${OUT}/${file}`);
}
