export function Oops({ size = 110 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 110 110" aria-hidden>
      <circle cx="55" cy="58" r="40" fill="var(--yellow)" />
      <circle cx="41" cy="52" r="5" fill="var(--text)" />
      <circle cx="69" cy="52" r="5" fill="var(--text)" />
      <ellipse cx="55" cy="74" rx="8" ry="6" fill="var(--text)" />
      <path d="M86 18l4 12M96 26l-10 4" stroke="var(--card-orange)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
