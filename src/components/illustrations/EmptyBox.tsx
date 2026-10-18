export function EmptyBox({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" aria-hidden>
      <ellipse cx="48" cy="84" rx="32" ry="6" fill="var(--border)" />
      <path d="M16 40l32-14 32 14v34L48 86 16 74z" fill="var(--yellow-light)" stroke="var(--yellow-dark)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M16 40l32 12 32-12M48 52v34" stroke="var(--yellow-dark)" strokeWidth="3" fill="none" strokeLinejoin="round" />
      <path d="M16 40l-8 12 32 12 8-12zM80 40l8 12-32 12-8-12z" fill="var(--yellow)" stroke="var(--yellow-dark)" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}
