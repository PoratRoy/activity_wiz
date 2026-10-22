import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      verified: boolean;
      /** Set at sign-in until the broadcast message has been checked (and dismissed, if there was one). */
      checkMessage: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    verified?: boolean;
    checkMessage?: boolean;
  }
}
