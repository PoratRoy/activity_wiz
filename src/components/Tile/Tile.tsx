"use client";

import styles from "./Tile.module.css";

export type TileOption = { value: string; label: string };

type Props = {
  name: string;
  label?: string;
  options: TileOption[];
  value: string | null;
  onChange: (value: string) => void;
  /** Tapping the selected tile clears it (for optional fields). */
  allowClear?: boolean;
  columns?: 2 | 3;
};

/** Radio-like tiles for short option sets (2–6 options). */
export function TileGroup({ name, label, options, value, onChange, allowClear, columns = 2 }: Props) {
  return (
    <fieldset className={styles.group}>
      {label && <legend className={styles.legend}>{label}</legend>}
      <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {options.map((o) => {
          const selected = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              name={name}
              className={`${styles.tile} ${selected ? styles.selected : ""}`}
              onClick={() => (selected && allowClear ? onChange("") : onChange(o.value))}
            >
              {/* Labels without Hebrew ("30+", "1-5") render LTR so the sign stays in place. */}
              <span dir={/[\u0590-\u05FF]/.test(o.label) ? undefined : "ltr"}>{o.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
