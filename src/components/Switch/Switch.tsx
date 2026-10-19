"use client";

import styles from "./Switch.module.css";

type Props = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/** An on/off row: label on the inline start, switch on the inline end. Tapping the label toggles it too. */
export function Switch({ id, label, checked, onChange }: Props) {
  return (
    <div className={styles.row}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <button id={id} type="button" role="switch" aria-checked={checked} className={styles.track} onClick={() => onChange(!checked)}>
        <span className={styles.knob} />
      </button>
    </div>
  );
}
