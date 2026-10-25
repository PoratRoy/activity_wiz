import { ForestListSkeleton } from "@/components/Skeleton/Skeleton";

/** The category's name is not known until it loads, so the bar shows a placeholder for it. */
export default function Loading() {
  return <ForestListSkeleton fallback="/library" kind="activity" />;
}
