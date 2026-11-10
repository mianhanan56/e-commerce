import { useId } from "react";
import { MONOGRAM_PATH, TICKS_PATH, WATCHES_PATH, WORDMARK_PATH } from "./logo-paths";
import styles from "./Logo.module.scss";

type LogoProps = {
  // "inline": dial and name on one line, for bars. "stacked": the full lockup with "Watches".
  layout?: "inline" | "stacked";
  // What the logo sits on. The artwork's bright gold is only used on dark surfaces.
  surface?: "light" | "dark";
};

// Size it from the parent with `--logo-height`; the width follows the artwork's proportions.
export function Logo({ layout = "inline", surface = "light" }: LogoProps) {
  // Several logos share a page (header, drawer, footer), so each needs its own gradient ids.
  const id = useId().replace(/[^\w-]/g, "");
  const dial = `url(#${id}-dial)`;
  const lettering = `url(#${id}-lettering)`;
  const stacked = layout === "stacked";

  return (
    <svg
      className={[styles.logo, stacked ? styles.stacked : styles.inline, styles[surface]].join(" ")}
      viewBox={stacked ? "-366 -160 732 526" : "0 -160 1862 320"}
      role="img"
      aria-label="Zarvonique Watches"
    >
      <defs>
        <linearGradient
          id={`${id}-dial`}
          gradientUnits="userSpaceOnUse"
          x1="-113"
          y1="-113"
          x2="113"
          y2="113"
        >
          <stop className={styles.from} />
          <stop offset="0.5" className={styles.mid} />
          <stop offset="1" className={styles.to} />
        </linearGradient>
        <linearGradient id={`${id}-lettering`} gradientUnits="userSpaceOnUse" x1="-365" x2="365">
          <stop className={styles.from} />
          <stop offset="0.5" className={styles.mid} />
          <stop offset="1" className={styles.to} />
        </linearGradient>
      </defs>

      <g transform={stacked ? undefined : "translate(160)"} fill="none" stroke={dial}>
        <circle r="156" strokeWidth="6" />
        <circle r="140" strokeWidth="2" opacity="0.55" />
        <path d={TICKS_PATH} strokeWidth="3.8" strokeLinecap="round" />
        <circle cx="2" r="9" strokeWidth="4" />
        <path d={MONOGRAM_PATH} fill={dial} stroke="none" />
      </g>

      <path
        d={WORDMARK_PATH}
        fill={lettering}
        transform={stacked ? "translate(0 292)" : "translate(1132.5 56.3) scale(2)"}
      />

      {stacked && (
        <g fill={lettering}>
          <path d={WATCHES_PATH} transform="translate(0 364)" />
          <path d="M-232 354h80v2h-80zM152 354h80v2h-80z" />
        </g>
      )}
    </svg>
  );
}
