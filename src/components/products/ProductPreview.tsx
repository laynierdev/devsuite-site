"use client";

// Browser-style frame that shows the real screens of a product. Tabs switch
// between views; the frame tilts slightly towards the pointer.

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

import type { Product, ProductView } from "@/data/products";
import { displayHost } from "@/lib/utils";

/** Silent screen recording that only plays while it is on screen. */
function LoopingVideo({ view }: { view: ProductView }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) element.play().catch(() => {});
        else element.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={video}
      src={view.video}
      poster={view.image.src}
      muted
      loop
      playsInline
      preload="none"
      aria-label={view.alt}
    />
  );
}

export function ProductPreview({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const rotateX = useSpring(useMotionValue(0), { stiffness: 140, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 140, damping: 18 });

  const view = product.views[active];

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateY.set(x * 5);
    rotateX.set(-y * 4);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const count = product.views.length;
    let next = -1;
    if (event.key === "ArrowRight") next = (active + 1) % count;
    else if (event.key === "ArrowLeft") next = (active - 1 + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    if (next < 0) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="preview">
      <motion.div
        className="preview__frame"
        style={{ rotateX, rotateY, transformPerspective: 1400 }}
        onPointerMove={onPointerMove}
        onPointerLeave={resetTilt}
      >
        <div className="preview__bar" aria-hidden="true">
          <span className="preview__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="preview__url">{displayHost(product.demoUrl)}</span>
        </div>
        <div
          className="preview__screen"
          style={{ aspectRatio: product.frameAspect }}
          role="tabpanel"
          id={`${baseId}-panel`}
          aria-labelledby={`${baseId}-tab-${active}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view.id}
              className="preview__view"
              initial={{ opacity: 0, scale: 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
            >
              {view.video && !reduceMotion ? (
                <LoopingVideo view={view} />
              ) : (
                <Image
                  src={view.image}
                  alt={view.alt}
                  fill
                  sizes="(min-width: 1400px) 760px, (min-width: 992px) 56vw, 94vw"
                  placeholder="blur"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="preview__controls">
        <div className="preview__tabs" role="tablist" aria-label={`${product.name} screens`}>
          {product.views.map((item, i) => (
            <button
              key={item.id}
              ref={(element) => {
                tabs.current[i] = element;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`${baseId}-panel`}
              tabIndex={i === active ? 0 : -1}
              className="preview__tab"
              onClick={() => setActive(i)}
              onKeyDown={onTabKeyDown}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="preview__caption" aria-live="polite">
          {view.caption}
        </p>
      </div>
    </div>
  );
}
