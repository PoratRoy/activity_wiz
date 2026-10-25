import { ActivitySkeleton } from "@/components/Skeleton/Skeleton";

export default function Loading() {
  return <ActivitySkeleton fallback="/library" />;
}
