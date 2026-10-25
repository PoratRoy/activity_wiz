import { ActivitySkeleton } from "@/components/Skeleton/Skeleton";

export default function Loading() {
  return <ActivitySkeleton label="הפעולה" fallback="/my" />;
}
