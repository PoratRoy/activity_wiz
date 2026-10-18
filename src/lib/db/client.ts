import "server-only";
import { drizzle } from "drizzle-orm/d1";
import { customAlphabet } from "nanoid";
import { getEnv } from "@/lib/env";
import * as schema from "./schema";

export function getDb() {
  return drizzle(getEnv().DB, { schema });
}

export type Db = ReturnType<typeof getDb>;

/** 10-char lowercase alphanumeric IDs; URL-safe and readable after a Hebrew slug. */
export const newId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);
