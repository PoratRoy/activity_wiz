import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ForestPage } from "@/components/ForestPage/ForestPage";
import { Reveal } from "@/components/Transitions/Transitions";
import { getUserId } from "@/lib/auth/session";
import { listActivities } from "@/lib/db/queries";
import { MyList } from "./MyList";

export const metadata: Metadata = { title: "הפעולות שלי", robots: { index: false } };

export default async function MyActivitiesPage() {
  const userId = await getUserId();
  if (!userId) redirect("/");
  const items = await listActivities(userId);
  return (
    <ForestPage title="הפעולות שלי" trail>
      <Reveal>
        <MyList items={items} />
      </Reveal>
    </ForestPage>
  );
}
