import { ForestListSkeleton } from "@/components/Skeleton/Skeleton";
import { TOP_ROW } from "@/data/topActivities";

export default function Loading() {
  return <ForestListSkeleton title={TOP_ROW.title} fallback="/library" kind="activity" />;
}
