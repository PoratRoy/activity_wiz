import styles from "./MastheadTrail.module.css";

/** The faint dotted trail and sparkles behind a forest TopBar's title (pass as its `backdrop`). */
export function MastheadTrail() {
  return (
    <span className={styles.trail} aria-hidden>
      <svg viewBox="0 0 390 64" preserveAspectRatio="xMidYMid slice" fill="none">
        <path d="M-10 44 C 50 18, 110 64, 195 54 S 330 16, 400 34" stroke="#f4d675" strokeOpacity=".38" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 9" />
        <path d="M130 10 C 200 -2, 270 26, 400 8" stroke="#faf8f1" strokeOpacity=".1" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 9" />
        <g fill="#f4d675" fillOpacity=".55">
          <path d="M66 8 L67.62 12.38 L72 14 L67.62 15.62 L66 20 L64.38 15.62 L60 14 L64.38 12.38 Z" />
          <path d="M318 41.4 L319.24 44.76 L322.6 46 L319.24 47.24 L318 50.6 L316.76 47.24 L313.4 46 L316.76 44.76 Z" />
        </g>
        <g fill="#a9dcf5" fillOpacity=".4">
          <path d="M104 27.4 L104.7 29.3 L106.6 30 L104.7 30.7 L104 32.6 L103.3 30.7 L101.4 30 L103.3 29.3 Z" />
          <path d="M146 8.8 L146.86 11.14 L149.2 12 L146.86 12.86 L146 15.2 L145.14 12.86 L142.8 12 L145.14 11.14 Z" />
          <path d="M250 43.6 L250.65 45.35 L252.4 46 L250.65 46.65 L250 48.4 L249.35 46.65 L247.6 46 L249.35 45.35 Z" />
          <path d="M272 11 L272.81 13.19 L275 14 L272.81 14.81 L272 17 L271.19 14.81 L269 14 L271.19 13.19 Z" />
          <path d="M348 51.8 L348.59 53.41 L350.2 54 L348.59 54.59 L348 56.2 L347.41 54.59 L345.8 54 L347.41 53.41 Z" />
        </g>
        <g fill="#faf8f1" fillOpacity=".28">
          <circle cx="40" cy="52" r="1.6" />
          <circle cx="230" cy="8" r="1.4" />
          <circle cx="300" cy="22" r="1.4" />
        </g>
      </svg>
    </span>
  );
}
