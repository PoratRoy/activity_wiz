import "server-only";
import { getSessionStatus } from "@/lib/db/queries";

// Session revocation. Sessions are JWT cookies that live up to 400 days, so a user can only be cut off by checking
// their row: `disabled` blocks them, and bumping `token_version` signs them out on every device (their cookie carries
// the version from sign-in). Run in D1:
//   UPDATE users SET disabled = 1 WHERE email = '…';                     -- block
//   UPDATE users SET token_version = token_version + 1 WHERE email = '…'; -- sign out everywhere
//
// The status is kept in this Worker instance's memory for a minute, so a signed-in visitor costs at most one D1 read
// per minute per instance instead of one per page. A change therefore takes effect within CHECK_TTL_MS.

const CHECK_TTL_MS = 60_000;
const MAX_ENTRIES = 5000;

const store = new Map<string, { at: number; status: Awaited<ReturnType<typeof getSessionStatus>> }>();

async function statusOf(userId: string) {
  const hit = store.get(userId);
  if (hit && Date.now() - hit.at < CHECK_TTL_MS) return hit.status;
  const status = await getSessionStatus(userId);
  if (store.size >= MAX_ENTRIES) store.clear();
  store.set(userId, { at: Date.now(), status });
  return status;
}

/**
 * Whether a session cookie for `userId`, issued at `tokenVersion`, is still accepted. Cookies from before versions
 * existed count as version 0. A failed lookup (D1 down) keeps the session rather than signing everyone out.
 */
export async function sessionAllowed(userId: string, tokenVersion: number | undefined): Promise<boolean> {
  try {
    const status = await statusOf(userId);
    return !!status && !status.disabled && status.tokenVersion === (tokenVersion ?? 0);
  } catch (e) {
    console.error("sessionAllowed: status check failed", e);
    return true;
  }
}
