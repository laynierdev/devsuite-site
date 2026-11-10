"use client";

import { useSyncExternalStore } from "react";

// Decides, once per page load, whether the device should run the WebGL scene
// ("immersive" mode) or the lightweight static composition.

let cached: boolean | undefined;

function detect(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return false;
  if ((nav.deviceMemory ?? 8) < 4) return false;
  if ((nav.hardwareConcurrency ?? 8) < 4) return false;

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) return false;
    // Software rendering (no GPU acceleration) is too slow for the scene.
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    const software = /swiftshader|llvmpipe|software|basic render/i.test(renderer);
    // Release the probe context right away.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !software;
  } catch {
    return false;
  }
}

const subscribe = () => () => {};
const getSnapshot = () => (cached ??= detect());
const getServerSnapshot = () => false;

/** True when the WebGL scene should run. Always false during server rendering. */
export function useImmersive(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
