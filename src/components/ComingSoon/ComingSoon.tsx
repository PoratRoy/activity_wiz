import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Mascot } from "@/components/illustrations/Mascot";
import { TopBar } from "@/components/TopBar/TopBar";

/** Placeholder for tabs whose real page is built in a later step. */
export function ComingSoon({ title }: { title: string }) {
  return (
    <>
      <TopBar title={title} />
      <EmptyState illustration={<Mascot size={100} />} text="בקרוב כאן 🙂" />
    </>
  );
}
