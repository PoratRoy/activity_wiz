"use client";

import { useLinkStatus } from "next/link";
import styles from "./Button.module.css";

/** A light sweep across a ButtonLink while its page is on the way (only when it wasn't prefetched). */
export function PendingSweep() {
  const { pending } = useLinkStatus();
  return <span aria-hidden className={styles.sweep} data-pending={pending || undefined} />;
}
