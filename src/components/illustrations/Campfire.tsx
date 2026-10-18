import styles from "./illustrations.module.css";

export function Campfire({ size = 140 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" aria-hidden>
      <ellipse cx="70" cy="122" rx="52" ry="8" fill="var(--border)" />
      <g className={styles.flicker}>
        <path d="M70 26c14 20 30 30 30 56 0 18-13 30-30 30S40 100 40 82c0-14 8-22 14-30 2 8 6 12 10 14-2-16 0-28 6-40z" fill="var(--card-orange)" />
        <path d="M70 60c8 10 16 16 16 30 0 10-7 16-16 16s-16-6-16-16c0-8 4-12 8-16 1 4 3 6 6 7-1-8 0-14 2-21z" fill="var(--yellow)" />
      </g>
      <rect x="30" y="106" width="80" height="12" rx="6" fill="#8b5a2b" transform="rotate(-12 70 112)" />
      <rect x="30" y="106" width="80" height="12" rx="6" fill="#a0693a" transform="rotate(12 70 112)" />
    </svg>
  );
}
