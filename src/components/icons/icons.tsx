import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

/** Four-point sparkle centered on (x, y) with radius r. */
function sparkle(x: number, y: number, r: number) {
  const k = r * 0.2;
  return `M${x} ${y - r}Q${x + k} ${y - k} ${x + r} ${y}Q${x + k} ${y + k} ${x} ${y + r}Q${x - k} ${y + k} ${x - r} ${y}Q${x - k} ${y - k} ${x} ${y - r}Z`;
}

/** Solid magic wand with sparkles, the "create" icon. */
export function MagicWand({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <g stroke="currentColor" strokeWidth={3.8} strokeLinecap="round">
        <path d="M4.4 19.6 14.6 9.4" />
        <path d="M17.2 6.8 19.2 4.8" />
      </g>
      <path d={`${sparkle(5.5, 7, 3.6)}${sparkle(11, 3, 2)}${sparkle(18.5, 17, 3.6)}`} />
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
