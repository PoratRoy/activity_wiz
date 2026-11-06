import styles from "@/app/info.module.css";
import { TERMS } from "@/data/terms";

export function TermsText() {
  return (
    <div className={styles.terms}>
      {TERMS.map(({ label, text }, i) => (
        <p key={i}>
          {label && <strong>{label} </strong>}
          {text}
        </p>
      ))}
    </div>
  );
}
