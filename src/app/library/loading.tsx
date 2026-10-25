import { ForestListSkeleton } from "@/components/Skeleton/Skeleton";

export default function Loading() {
  return <ForestListSkeleton title="מאגר פעולות" kind="category" count={9} />;
}
