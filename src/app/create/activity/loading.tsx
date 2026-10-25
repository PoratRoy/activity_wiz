import { FormSkeleton } from "../FormSkeleton";

export default function Loading() {
  return <FormSkeleton title="תכנון הפעולה" fallback="/create/group" rows={4} />;
}
