import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

/** Four-point sparkle centered on (x, y) with radius r. */
function sparkle(x: number, y: number, r: number) {
  const k = r * 0.22;
  return `M${x} ${y - r}Q${x + k} ${y - k} ${x + r} ${y}Q${x + k} ${y + k} ${x} ${y + r}Q${x - k} ${y + k} ${x - r} ${y}Q${x - k} ${y - k} ${x} ${y - r}Z`;
}

/** Solid magic wand with a hollow tip and sparkles, the "create" icon. */
export function MagicWand({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <g transform="translate(4.6 19.4) rotate(-45)">
        <path d="M0 -2.9H14.4V2.9H0A2.9 2.9 0 0 1 0 -2.9Z" />
        <rect x="15.9" y="-2" width="5.4" height="4" rx="1.4" fill="none" stroke="currentColor" strokeWidth={1.8} />
      </g>
      <path d={`${sparkle(5, 7.6, 3.4)}${sparkle(11, 5.2, 2.4)}${sparkle(18.6, 17.8, 3.6)}`} />
    </svg>
  );
}

/** Spiral-bound notepad with lines, the "ready activities" icon. */
export function Notepad({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="4.5" y="4" width="15" height="18.5" rx="2" />
      <path d="M7 2.5v3M9.5 2.5v3M12 2.5v3M14.5 2.5v3M17 2.5v3" />
      <path d="M8.5 10.5h7M8.5 14.5h7M8.5 18.5h7" />
    </svg>
  );
}
