// Mutable values shared between the DOM (scroll, pointer) and the WebGL
// scene. They change every frame, so they deliberately live outside React
// state: the scene reads them inside its render loop.
export const sceneState = {
  /** Scroll progress through the pinned hero + journey stage, 0..1. */
  stage: 0,
  /** How far the final call-to-action has entered the viewport, 0..1. */
  cta: 0,
  /** Top edge of the final call-to-action, as a fraction of the viewport height. */
  ctaTop: 1,
  /** Pointer position, normalized to -1..1 on both axes. */
  pointerX: 0,
  pointerY: 0,
};

/** Scroll thresholds at which each journey step becomes active. */
export const JOURNEY_STEPS: Array<[number, number]> = [
  [0.5, 0.6],
  [0.62, 0.72],
  [0.74, 0.84],
];

/** Where the composition sits inside the final call-to-action (fraction of the viewport height below its top edge). */
export const CTA_ANCHOR = 0.25;
