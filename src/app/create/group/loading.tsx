import { ArrowLeft } from "lucide-react";
import { FormSkeleton } from "../FormSkeleton";

export default function Loading() {
  return <FormSkeleton title="הקבוצה שלי" rows={["picker", "picker", "picker", "picker"]} submit="המשך" icon={<ArrowLeft size={20} aria-hidden />} />;
}
