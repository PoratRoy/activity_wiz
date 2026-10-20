"use client";

import Image from "next/image";
import { categoryThumb, LIBRARY_IMAGES } from "@/data/libraryImages";
import styles from "./admin.module.css";

/** Grid of the bundled category artwork; the first choice (null) is the shared default. */
export function ImagePicker({ value, onChange }: { value: string | null; onChange: (image: string | null) => void }) {
  return (
    <div className={styles.picker} role="radiogroup" aria-label="תמונה">
      {[null, ...LIBRARY_IMAGES].map((name) => (
        <button
          key={name ?? "default"}
          type="button"
          role="radio"
          aria-checked={value === name}
          aria-label={name ?? "ברירת מחדל"}
          className={styles.pickerOption}
          onClick={() => onChange(name)}
        >
          <Image src={categoryThumb(name)} alt="" width={72} height={52} unoptimized />
        </button>
      ))}
    </div>
  );
}
