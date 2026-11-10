import type { ReactNode } from "react";

import { cx } from "@/lib/utils";

export function ArrowIcon({ direction = "right" }: { direction?: "right" | "up-right" | "down" }) {
  const rotation = direction === "up-right" ? -45 : direction === "down" ? 90 : 0;
  return (
    <svg
      className="arrow"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path d="M3 9h11M9.5 4.5 14 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "accent";
  /** Opens in a new tab and marks the link as external. */
  external?: boolean;
  className?: string;
}

/** A link styled as a pill button with an arrow. */
export function ButtonLink({ href, children, variant = "primary", external = false, className }: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={cx("btn-ds", `btn-ds--${variant}`, className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{children}</span>
      <ArrowIcon direction={external ? "up-right" : "right"} />
      {external ? <span className="visually-hidden"> (opens in a new tab)</span> : null}
    </a>
  );
}
