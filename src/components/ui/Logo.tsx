import { siteConfig } from "@/config/site";

/** Brand mark: three stacked layers, one per tool (plan, design, understand). */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <path d="M16 3.5 28.5 9.75 16 16 3.5 9.75Z" fill="#12b3a2" />
      <path d="M4 16 16 22 28 16" stroke="#2f6bff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 22.5 16 28.5 28 22.5" stroke="#7c5cff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo__name">{siteConfig.name}</span>
    </span>
  );
}
