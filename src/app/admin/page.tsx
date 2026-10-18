import { ComingSoon } from "@/components/ComingSoon/ComingSoon";
import { requireAdmin } from "@/lib/auth/admin";

// Placeholder until step 13 of docs/implementation-plan.md; already admin-only.
export const metadata = { title: "ניהול", robots: { index: false } };

export default async function AdminPage() {
  await requireAdmin();
  return <ComingSoon title="ניהול" />;
}
