import styles from "./Chip.module.css";

/** A chip's text, or text plus a `kind` (exposed as `data-kind`) that a page can style, e.g. with an icon. */
export type ChipItem = string | { label: string; kind: string } | null | undefined;

export function Chip({ children, kind }: { children: React.ReactNode; kind?: string }) {
  return (
    <span className={styles.chip} data-kind={kind}>
      {children}
    </span>
  );
}

export function ChipRow({ items }: { items: ChipItem[] }) {
  const shown = items.flatMap((i): { label: string; kind?: string }[] =>
    !i ? [] : typeof i === "string" ? [{ label: i }] : i.label ? [i] : [],
  );
  if (shown.length === 0) return null;
  return (
    <div className={styles.row}>
      {shown.map((c) => (
        <Chip key={c.label} kind={c.kind}>
          {c.label}
        </Chip>
      ))}
    </div>
  );
}
