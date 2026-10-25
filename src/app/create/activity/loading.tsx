import { Sparkles } from "lucide-react";
import { FormSkeleton } from "../FormSkeleton";

export default function Loading() {
  return (
    <FormSkeleton
      title="תכנון הפעולה"
      fallback="/create/group"
      rows={["segment", "input", "picker", "picker", "line"]}
      submit="יצירת הפעולה"
      icon={<Sparkles size={20} aria-hidden />}
    />
  );
}
