import { TopBar } from "@/components/TopBar/TopBar";
import styles from "./create.module.css";

/** The fixed forest bar of the create pages, with a faint dotted trail behind the title. */
export function CreateMasthead({ title, fallback }: { title: string; fallback?: string }) {
  return (
    <div className={styles.masthead}>
      <svg className={styles.trail} viewBox="0 0 390 64" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden>
        <path d="M-10 56 C 50 34, 110 62, 175 42 S 285 28, 400 72" stroke="#f4d675" strokeOpacity=".38" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 9" />
        <path d="M-10 22 C 70 4, 140 30, 210 14" stroke="#faf8f1" strokeOpacity=".1" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 9" />
        <g fill="#faf8f1" fillOpacity=".28">
          <path d="M80 10 l1.6 4.4 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6 -4.4 -4.4 -1.6 4.4 -1.6 Z" />
          <circle cx="250" cy="10" r="1.6" />
          <circle cx="292" cy="12" r="1.4" />
        </g>
        <path d="M226 38 l1.4 3.8 3.8 1.4 -3.8 1.4 -1.4 3.8 -1.4 -3.8 -3.8 -1.4 3.8 -1.4 Z" fill="#f4d675" fillOpacity=".55" />
      </svg>
      <TopBar title={title} fallback={fallback} tone="forest" />
    </div>
  );
}
