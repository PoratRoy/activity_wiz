import styles from "./illustrations.module.css";

/** Placeholder mascot: a round green spark with big eyes and a yellow scout scarf. */
export function Mascot({ size = 120, variant = "idle" }: { size?: number; variant?: "idle" | "bounce" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={variant === "bounce" ? styles.bounce : undefined}
      role="img"
      aria-label="ActivityWiz"
    >
      <path d="M60 6c6 10 18 14 18 26 0 4-2 7-4 9 10 4 20 14 20 30 0 22-15 37-34 37S26 93 26 71c0-16 10-26 20-30-2-2-4-5-4-9 0-12 12-16 18-26z" fill="var(--green)" />
      <path d="M60 14c3 7 10 10 10 18 0 4-3 7-10 7s-10-3-10-7c0-8 7-11 10-18z" fill="var(--green-light)" />
      <ellipse cx="48" cy="66" rx="8" ry="10" fill="#fff" />
      <ellipse cx="72" cy="66" rx="8" ry="10" fill="#fff" />
      <circle cx="49" cy="68" r="4.5" fill="var(--text)" />
      <circle cx="71" cy="68" r="4.5" fill="var(--text)" />
      <circle cx="50.5" cy="66" r="1.5" fill="#fff" />
      <circle cx="72.5" cy="66" r="1.5" fill="#fff" />
      <path d="M52 82q8 7 16 0" stroke="var(--text)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M34 92q26 14 52 0l-4 10q-22 10-44 0z" fill="var(--yellow)" />
      <path d="M56 100l-6 16 10-6 10 6-6-16z" fill="var(--yellow-dark)" />
    </svg>
  );
}
