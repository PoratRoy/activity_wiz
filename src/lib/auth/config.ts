import "server-only";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { upsertUserByGoogleSub } from "@/lib/db/queries";
import { getEnv } from "@/lib/env";

// JWT sessions, no adapter: the `users` row is upserted on sign-in and its id lives in the token.
export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const env = getEnv();
  return {
    secret: env.AUTH_SECRET,
    trustHost: true,
    // Stay signed in as long as browsers allow: Chrome caps cookie lifetime at 400 days (default here is 30).
    session: { strategy: "jwt", maxAge: 400 * 24 * 60 * 60 },
    providers: [Google({ clientId: env.AUTH_GOOGLE_ID, clientSecret: env.AUTH_GOOGLE_SECRET })],
    callbacks: {
      async jwt({ token, account, profile }) {
        if (account?.provider === "google" && profile?.sub && profile.email) {
          token.uid = await upsertUserByGoogleSub({
            sub: profile.sub,
            email: profile.email,
            name: profile.name,
            image: typeof profile.picture === "string" ? profile.picture : null,
          });
          token.verified = profile.email_verified === true;
        }
        return token;
      },
      session({ session, token }) {
        if (typeof token.uid === "string") session.user.id = token.uid;
        session.user.verified = token.verified === true;
        return session;
      },
    },
  };
});
