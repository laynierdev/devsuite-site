"use client";

// Hero + "how the tools fit together", presented as one stage.
//
// Static mode (server render, reduced motion, low-end devices): two regular
// blocks, with an SVG composition.
// Immersive mode: the stage is pinned while the visitor scrolls; the hero
// fades out, the 3D objects separate, and the three journey steps light up.

import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { ProductGlyph, StaticComposition } from "@/components/visuals/StaticComposition";
import { JOURNEY_STEPS, sceneState } from "@/components/visuals/sceneState";
import { siteConfig } from "@/config/site";
import { products, type Product } from "@/data/products";
import { useImmersive } from "@/lib/immersive";
import { cx } from "@/lib/utils";

const SceneCanvas = dynamic(() => import("@/components/visuals/SceneCanvas"), {
  ssr: false,
  loading: () => null,
});

const ROLE_ACCENTS = ["teal", "blue", "violet"] as const;

interface JourneyStepProps {
  product: Product;
  index: number;
  progress: MotionValue<number>;
  immersive: boolean;
}

function JourneyStep({ product, index, progress, immersive }: JourneyStepProps) {
  const [from, to] = JOURNEY_STEPS[index];
  const opacity = useTransform(progress, [from, to], [0.2, 1]);
  const y = useTransform(progress, [from, to], [16, 0]);

  return (
    <motion.li
      className={cx("journey__step", `accent-${product.accent}`)}
      style={immersive ? { opacity, y } : undefined}
    >
      {immersive ? null : <ProductGlyph product={product.id} />}
      <p className="journey__num">
        <span>{product.index}</span> {product.role}
      </p>
      <h3 className="journey__name">{product.name}</h3>
      <p className="journey__text">{product.journey}</p>
    </motion.li>
  );
}

export function Stage() {
  const immersive = useImmersive();
  const stage = useRef<HTMLElement>(null);
  const [away, setAway] = useState(false);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    sceneState.stage = value;
    setAway(value > 0.32);
  });

  const heroOpacity = useTransform(scrollYProgress, [0.06, 0.28], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -70]);
  const journeyOpacity = useTransform(scrollYProgress, [0.36, 0.5], [0, 1]);
  const journeyY = useTransform(scrollYProgress, [0.36, 0.5], [40, 0]);

  const { hero } = siteConfig;

  return (
    <section
      id="top"
      ref={stage}
      className={cx("stage", immersive && "stage--immersive")}
      data-scene-zone
    >
      {immersive ? <SceneCanvas /> : null}

      <div className="stage__pin">
        <motion.div
          className={cx("hero", immersive && away && "is-away")}
          style={immersive ? { opacity: heroOpacity, y: heroY } : undefined}
        >
          <div className="container-xxl hero__inner">
            <div className="hero__copy">
              <p className="eyebrow" data-intro>
                <span className="eyebrow__dots" aria-hidden="true">
                  <i className="accent-teal" />
                  <i className="accent-blue" />
                  <i className="accent-violet" />
                </span>
                Three independent tools
              </p>
              <h1 className="hero__title">
                {hero.heading.map((line, i) => (
                  <span className="line" key={line} style={{ "--i": i } as React.CSSProperties}>
                    <span>{line}</span>
                  </span>
                ))}
              </h1>
              <p className="hero__roles" data-intro style={{ "--d": "0.35s" } as React.CSSProperties}>
                {hero.roles.map((role, i) => (
                  <span key={role} className={`accent-${ROLE_ACCENTS[i]}`}>
                    {role}{" "}
                  </span>
                ))}
              </p>
              <p className="hero__lead" data-intro style={{ "--d": "0.45s" } as React.CSSProperties}>
                {hero.description}
              </p>
              <div className="hero__actions" data-intro style={{ "--d": "0.55s" } as React.CSSProperties}>
                <ButtonLink href={siteConfig.primaryCta.href}>{siteConfig.primaryCta.label}</ButtonLink>
                <a className="text-link" href={siteConfig.secondaryCta.href}>
                  {siteConfig.secondaryCta.label}
                </a>
              </div>
            </div>

            {immersive ? null : (
              <div className="hero__art" data-intro style={{ "--d": "0.3s" } as React.CSSProperties}>
                <StaticComposition className="composition" />
              </div>
            )}
          </div>

          <div className="container-xxl hero__foot" data-intro style={{ "--d": "0.75s" } as React.CSSProperties}>
            <p className="hero__scroll">
              <span className="hero__scroll-line" aria-hidden="true" />
              Scroll
            </p>
            <ol className="hero__index">
              {products.map((product) => (
                <li key={product.id} className={`accent-${product.accent}`}>
                  <a href={`#${product.id}`}>
                    <span>{product.index}</span>
                    {product.name}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>

        <motion.div
          className={cx("journey", immersive && !away && "is-away")}
          style={immersive ? { opacity: journeyOpacity, y: journeyY } : undefined}
        >
          <div className="container-xxl journey__head">
            <p className="eyebrow">How they fit together</p>
            <h2 className="journey__title">
              One development journey. <br />
              Three focused tools.
            </h2>
          </div>
          <ol className="journey__grid">
            {products.map((product, i) => (
              <JourneyStep
                key={product.id}
                product={product}
                index={i}
                progress={scrollYProgress}
                immersive={immersive}
              />
            ))}
          </ol>
          <p className="journey__note">
            A way of thinking, not an automated workflow. The three tools are independent products: no shared
            accounts, no shared project data.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
