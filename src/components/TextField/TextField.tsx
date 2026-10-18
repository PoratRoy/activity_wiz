import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import styles from "./TextField.module.css";

type FieldProps = { label?: string; endSlot?: ReactNode };

export function TextField({ label, endSlot, id, ...rest }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={styles.wrap} htmlFor={id}>
      {label && <span className={styles.label}>{label}</span>}
      <span className={styles.control}>
        <input id={id} className={styles.input} {...rest} />
        {endSlot && <span className={styles.end}>{endSlot}</span>}
      </span>
    </label>
  );
}

export function TextArea({ label, id, ...rest }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={styles.wrap} htmlFor={id}>
      {label && <span className={styles.label}>{label}</span>}
      <textarea id={id} className={`${styles.input} ${styles.textarea}`} {...rest} />
    </label>
  );
}
