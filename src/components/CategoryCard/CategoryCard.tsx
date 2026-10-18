import { Compass, Flame, Heart, Leaf, Mountain, Snowflake, Star, Sun, Tent, Users } from "lucide-react";
import Link from "next/link";
import styles from "./CategoryCard.module.css";

// Yellow gets dark text for contrast.
const COLORS = [
  { bg: "var(--green)", fg: "#fff" },
  { bg: "var(--yellow)", fg: "var(--text)" },
  { bg: "var(--card-blue)", fg: "#fff" },
  { bg: "var(--card-orange)", fg: "#fff" },
];
const ICONS = [Tent, Sun, Leaf, Star, Flame, Compass, Heart, Users, Mountain, Snowflake];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Square category tile: colors rotate by position, the icon is picked from the id so it stays stable. */
export function CategoryCard({
  id,
  index,
  title,
  href,
  count,
}: {
  id: string;
  index: number;
  title: string;
  href: string;
  count?: number;
}) {
  const Icon = ICONS[hash(id) % ICONS.length];
  const color = COLORS[index % COLORS.length];
  return (
    <Link href={href} className={styles.card} style={{ background: color.bg, color: color.fg }}>
      <Icon size={40} strokeWidth={2.2} aria-hidden className={styles.icon} />
      <span className={styles.title}>{title}</span>
      {count !== undefined && <span className={styles.count}>{count} פעולות</span>}
    </Link>
  );
}
