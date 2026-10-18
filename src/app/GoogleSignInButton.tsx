"use client";

import { LogIn } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/Button/Button";
import { signInWithGoogle } from "@/lib/auth/actions";

export function GoogleSignInButton() {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="secondary"
      icon={<LogIn size={20} aria-hidden />}
      disabled={pending}
      onClick={() => startTransition(() => signInWithGoogle("/"))}
    >
      {pending ? "מעבירים ל-Google…" : "התחברות עם Google"}
    </Button>
  );
}
