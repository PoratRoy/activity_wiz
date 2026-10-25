import { FormSkeleton } from "../FormSkeleton";

export default function Loading() {
  return <FormSkeleton title="הקבוצה שלי" rows={["field", "field", "field", "field"]} />;
}
