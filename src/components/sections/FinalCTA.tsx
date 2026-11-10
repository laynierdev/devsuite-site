"use client";

// Closing section. In immersive mode the 3D objects from the hero come back
// together above the headline; otherwise the static composition is shown.

import { useEffect, useRef } from "react";

import { ArrowIcon } from "@/components/ui/Button";
import { StaticComposition } from "@/components/visuals/StaticComposition";
import { sceneState } from "@/components/visuals/sceneState";
import { products } from "@/data/products";
import { useImmersive } from "@/lib/immersive";
import { cx, displayHost } from "@/lib/utils";

export function FinalCTA() {
  const immersive = useImmersive();
  const section = useRef<HTMLElement>(null);

  // Tell the scene where this section is, so the composition scrolls with it.
  useEffect(() => {
    if (!immersive) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const element = section.current;
      if (!element) return;
      const top = element.getBoundingClientRect().top / window.innerHeight;
      sceneState.ctaTop = top;
      sceneState.cta = Math.min(Math.max((1 - top) / 0.7, 0), 1);
    };
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [immersive]);

  return (
    <section
      id="explore"
      ref={section}
      className={cx("cta", immersive && "cta--immersive")}
      aria-labelledby="cta-title"
      data-scene-zone
    >
      <div className="container-xxl">
        {immersive ? null : <StaticComposition className="composition composition--cta" />}

        <div className="cta__copy">
          <h2 id="cta-title" className="display" data-reveal="lines">
            <span className="line">
              <span>Find the right tool</span>
            </span>
            <span className="line" style={{ "--i": 1 } as React.CSSProperties}>
              <span>for your next challenge.</span>
            </span>
          </h2>
          <p className="cta__lead" data-reveal>
            Explore the tools, discover how they work, and start building with clarity.
          </p>
        </div>

        <ul className="cta__links">
          {products.map((product, i) => (
            <li key={product.id} data-reveal style={{ "--d": `${i * 0.08}s` } as React.CSSProperties}>
              <a
                className={cx("cta-link", `accent-${product.accent}`)}
                href={product.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="cta-link__meta">
                  {product.index} · {product.category}
                </span>
                <span className="cta-link__name">{product.name}</span>
                <span className="cta-link__foot">
                  <span>{displayHost(product.demoUrl)}</span>
                  <ArrowIcon direction="up-right" />
                </span>
                <span className="visually-hidden"> live demo (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
