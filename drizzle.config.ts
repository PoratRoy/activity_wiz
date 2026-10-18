import { defineConfig } from "drizzle-kit";

// Generates SQL migrations into ./drizzle; Wrangler applies them (`npm run db:migrate:*`).
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
});
