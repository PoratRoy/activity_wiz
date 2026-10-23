import { Clock, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import type { CardTag } from "@/components/ActivityCard/ActivityCard";
import { shown } from "@/data/options";

/** Age (no icon), then place and time with the activity page's icons; "לא משנה" values are left out. */
export function tagsFor(a: { place: string; duration: string; age: string }): CardTag[] {
  const tag = (icon: ReactNode, value: string) => {
    const label = shown(value);
    return label ? [{ icon, label }] : [];
  };
  return [
    ...tag(null, a.age),
    ...tag(<MapPin size={13} aria-hidden />, a.place),
    ...tag(<Clock size={13} aria-hidden />, a.duration),
  ];
}
