import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "accent" | "danger";

type CommonProps = {
  variant?: Variant;
  /** Full width by default; set false for inline buttons. */
  block?: boolean;
  icon?: ReactNode;
  children: ReactNode;
};

function classes(variant: Variant, block: boolean, extra?: string) {
  return [styles.button, styles[variant], block ? styles.block : "", extra ?? ""].join(" ");
}

export function Button({
  variant = "primary",
  block = true,
  icon,
  children,
  className,
  type = "button",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes(variant, block, className)} {...rest}>
      {icon}
      <span>{children}</span>
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  block = true,
  icon,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={classes(variant, block)}>
      {icon}
      <span>{children}</span>
    </Link>
  );
}
