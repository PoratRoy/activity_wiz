import "server-only";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { upsertUserByGoogleSub } from "@/lib/db/queries";
import { getEnv } from "@/lib/env";
import { hasErrors, validateGroup, type GroupInput } from "@/lib/validate";

// JWT sessions, no adapter: the `users` row is upserted on sign-in and its id lives in the token.
export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth(() => {
  const env = getEnv();
  return {
    secret: env.AUTH_SECRET,
    trustHost: true,
    // Stay signed in as long as browsers allow: Chrome caps cookie lifetime at 400 days (default here is 30).
    session: { strategy: "jwt", maxAge: 400 * 24 * 60 * 60 },
    providers: [Google({ clientId: env.AUTH_GOOGLE_ID, clientSecret: env.AUTH_GOOGLE_SECRET })],
    callbacks: {
      async jwt({ token, account, profile, trigger, session }) {
        if (account?.provider === "google" && profile?.sub && profile.email) {
          const user = await upsertUserByGoogleSub({
            sub: profile.sub,
            email: profile.email,
            name: profile.name,
            image: typeof profile.picture === "string" ? profile.picture : null,
          });
          token.uid = user.id;
          // The group rides in the cookie so pages that show it need no D1 read; saveGroup keeps it current.
          token.group = user.group;
          token.verified = profile.email_verified === true;
          // The broadcast message is checked once per sign-in (MessageGate), not on every visit.
          token.checkMessage = true;
        }
        if (trigger === "update" && session?.user?.checkMessage === false) token.checkMessage = false;
        // Updates can also come from the client (POST /api/auth/session), so only a valid group is taken.
        const group = trigger === "update" ? (session?.user?.group as GroupInput | undefined) : undefined;
        if (group && !hasErrors(validateGroup(group))) {
          token.group = { movement: group.movement, grade: group.grade, groupSize: group.groupSize, gender: group.gender };
        }
        return token;
      },
      session({ session, token }) {
        if (typeof token.uid === "string") session.user.id = token.uid;
        session.user.verified = token.verified === true;
        session.user.checkMessage = token.checkMessage === true;
        session.user.group = token.group;
        return session;
      },
    },
  };
});
