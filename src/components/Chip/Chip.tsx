import styles from "./Chip.module.css";

export function Chip({ children }: { children: React.ReactNode }) {
  return <span className={styles.chip}>{children}</span>;
}

export function ChipRow({ items }: { items: (string | null | undefined)[] }) {
  const shown = items.filter(Boolean) as string[];
  if (shown.length === 0) return null;
  return (
    <div className={styles.row}>
      {shown.map((t) => (
        <Chip key={t}>{t}</Chip>
      ))}
    </div>
  );
}
