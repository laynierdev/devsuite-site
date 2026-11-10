"use client";

/** Renders the current year in the visitor's browser, so it never goes stale. */
export function CurrentYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
