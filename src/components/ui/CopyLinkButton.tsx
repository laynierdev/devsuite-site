"use client";

import { useEffect, useState } from "react";

/** Copies the site link to the clipboard and confirms it for a moment. */
export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard access can be blocked; fall back to showing the link.
      window.prompt("Copy this link", url);
    }
  };

  return (
    <button type="button" className="share__button" onClick={copy} title="Copy link">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        {copied ? (
          <path d="m5 12.500 4.500 4.500L19 7.500" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path
            d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1"
            stroke="currentColor"
            strokeWidth="1.800"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      <span className="visually-hidden" aria-live="polite">
        {copied ? "Link copied" : "Copy link"}
      </span>
    </button>
  );
}
