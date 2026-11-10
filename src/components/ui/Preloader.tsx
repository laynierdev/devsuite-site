"use client";

import { useEffect, useRef } from "react";

import { LogoMark } from "@/components/ui/Logo";
import { siteConfig } from "@/config/site";

/**
 * Short branded entrance. The overlay leaves through a CSS animation, so it
 * can never get stuck if JavaScript fails; this component only animates the
 * counter. Hidden entirely for visitors who prefer reduced motion.
 */
export function Preloader() {
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const duration = 1300;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (counter.current) counter.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="preloader" aria-hidden="true">
      <div className="preloader__mark">
        <LogoMark size={56} />
      </div>
      <span className="preloader__label">{siteConfig.tagline}</span>
      <span className="preloader__count" ref={counter}>
        000
      </span>
    </div>
  );
}
