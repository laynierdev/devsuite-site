"use client";

// The WebGL centerpiece: three glass objects, one per product, that share a
// single orbit. Scroll drives the layout:
//   hero     -> the three objects form one composition
//   journey  -> they separate into three independent tools
//   final CTA-> they come back together
// The module is loaded with next/dynamic (no SSR) so it never blocks the
// first paint.

import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor, RoundedBox } from "@react-three/drei";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { CTA_ANCHOR, JOURNEY_STEPS, sceneState } from "./sceneState";

const { clamp, lerp, damp } = THREE.MathUtils;
const smooth = (from: number, to: number, x: number) => THREE.MathUtils.smoothstep(x, from, to);

const COLORS = {
  teal: "#0fb3a1",
  tealDeep: "#0a7f74",
  blue: "#2a63f6",
  blueDeep: "#1638b8",
  blueSoft: "#6fa0ff",
  violet: "#7c5cff",
  violetSoft: "#b9a8ff",
  ink: "#0d1526",
  white: "#ffffff",
};

/** Position of each object inside the assembled composition. */
const ASSEMBLED: Array<[number, number, number]> = [
  [-1.62, 0.02, 0.25],
  [0.08, -0.06, 0],
  [1.78, 0.14, -0.2],
];

/* -------------------------------------------------------------------------- */
/* Shared materials and helpers                                                */
/* -------------------------------------------------------------------------- */

/** Reflection cube shared by every glossy material in the scene. */
const EnvContext = createContext<THREE.CubeTexture | null>(null);

/**
 * Tinted glass. Phong shading with a small reflection cube keeps the shader
 * cheap to compile, which matters on integrated GPUs.
 */
function Glass({ color, opacity = 0.6 }: { color: string; opacity?: number }) {
  const envMap = useContext(EnvContext);
  return (
    <meshPhongMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.32}
      specular="#ffffff"
      shininess={110}
      envMap={envMap}
      combine={THREE.AddOperation}
      reflectivity={0.14}
      transparent
      opacity={opacity}
      depthWrite={false}
      side={THREE.DoubleSide}
    />
  );
}

/** Polished metal for the small spheres on the orbit. */
function Chrome() {
  const envMap = useContext(EnvContext);
  return <meshPhongMaterial color="#aeb4bf" specular="#ffffff" shininess={200} envMap={envMap} reflectivity={0.9} />;
}

/** Deterministic pseudo-random generator, so textures look the same on every load. */
function createRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function roundedRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function toTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/** Abstract code editor: a dark panel with indented, colored lines. */
function makeCodeTexture(seed: number, background: string) {
  const w = 768;
  const h = 540;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext("2d");
  if (!g) return toTexture(canvas);

  roundedRect(g, 0, 0, w, h, 30);
  g.fillStyle = background;
  g.fill();

  ["#ff8f8f", "#ffd27a", "#6ee7d6"].forEach((color, i) => {
    g.beginPath();
    g.arc(40 + i * 26, 38, 7, 0, Math.PI * 2);
    g.fillStyle = color;
    g.globalAlpha = 0.75;
    g.fill();
  });
  g.globalAlpha = 1;
  g.fillStyle = "rgba(255,255,255,0.08)";
  g.fillRect(0, 70, w, 2);

  const random = createRandom(seed);
  const palette = ["#6ee7d6", "#8db6ff", "#c4b5fd", "rgba(255,255,255,0.42)"];
  const indents = [0, 1, 1, 2, 2, 3, 2, 1, 1, 2, 2, 1, 0, 0, 1, 1];
  indents.forEach((indent, row) => {
    const y = 100 + row * 27;
    g.fillStyle = "rgba(255,255,255,0.16)";
    roundedRect(g, 30, y, 16, 9, 4);
    g.fill();
    let x = 74 + indent * 34;
    const segments = 1 + Math.floor(random() * 3);
    for (let s = 0; s < segments; s += 1) {
      const width = 46 + random() * 150;
      if (x + width > w - 40) break;
      g.fillStyle = palette[Math.floor(random() * palette.length)];
      roundedRect(g, x, y, width, 9, 4.5);
      g.fill();
      x += width + 14;
    }
  });
  return toTexture(canvas);
}

/** Small white card with a module graph. */
function makeGraphTexture() {
  const w = 420;
  const h = 300;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext("2d");
  if (!g) return toTexture(canvas);

  roundedRect(g, 0, 0, w, h, 28);
  g.fillStyle = "#ffffff";
  g.fill();
  g.fillStyle = "rgba(13,21,38,0.14)";
  roundedRect(g, 28, 28, 120, 10, 5);
  g.fill();

  const nodes: Array<[number, number, string]> = [
    [80, 180, "#7c5cff"],
    [200, 110, "#2f6bff"],
    [200, 235, "#7c5cff"],
    [330, 170, "#2f6bff"],
    [300, 250, "#b9a8ff"],
  ];
  const links: Array<[number, number]> = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [2, 4],
  ];
  g.strokeStyle = "rgba(13,21,38,0.28)";
  g.lineWidth = 3;
  links.forEach(([a, b]) => {
    g.beginPath();
    g.moveTo(nodes[a][0], nodes[a][1]);
    g.lineTo(nodes[b][0], nodes[b][1]);
    g.stroke();
  });
  nodes.forEach(([x, y, color]) => {
    g.beginPath();
    g.arc(x, y, 15, 0, Math.PI * 2);
    g.fillStyle = color;
    g.fill();
  });
  return toTexture(canvas);
}

/**
 * Builds the reflection cube: an ivory room with a few soft light panels,
 * drawn on six small canvases. No HDR file and no prefiltering pass.
 */
function makeEnvironmentCube() {
  const size = 96;
  const face = (draw: (g: CanvasRenderingContext2D) => void) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const g = canvas.getContext("2d");
    if (g) {
      g.fillStyle = "#d9d2c6";
      g.fillRect(0, 0, size, size);
      draw(g);
    }
    return canvas;
  };
  const glow = (g: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) => {
    const gradient = g.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gradient;
    g.fillRect(0, 0, size, size);
  };
  const half = size / 2;
  // Order: +x, -x, +y, -y, +z, -z
  const faces = [
    face((g) => glow(g, half, half * 0.8, size * 0.6, "#e6dcff")),
    face((g) => glow(g, half, half * 0.8, size * 0.6, "#c9f5ee")),
    face((g) => glow(g, half, half, size * 0.75, "#ffffff")),
    face((g) => glow(g, half, half, size * 0.5, "#efe9df")),
    face((g) => glow(g, half, half * 0.7, size * 0.45, "#ffffff")),
    face((g) => glow(g, half, half, size * 0.6, "#f4efe6")),
  ];
  const cube = new THREE.CubeTexture(faces);
  cube.colorSpace = THREE.SRGBColorSpace;
  cube.needsUpdate = true;
  return cube;
}

/** Soft radial blob used as a ground shadow. */
function makeBlobTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext("2d");
  if (!g) return toTexture(canvas);
  const gradient = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gradient;
  g.fillRect(0, 0, size, size);
  return toTexture(canvas);
}

function GroundShadow({ color, texture }: { color: string; texture: THREE.Texture }) {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-1.28}>
      <planeGeometry args={[3.4, 3.4]} />
      <meshBasicMaterial map={texture} color={color} transparent opacity={0.3} depthWrite={false} />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/* MobileRoad: a flowing roadmap with milestones                               */
/* -------------------------------------------------------------------------- */

function Roadmap() {
  const pulse = useRef<THREE.Mesh>(null);
  const time = useRef(0);

  const { band, curve, line, dots, end, flag } = useMemo(() => {
    const radius = 1.12;
    const turns = 1.3;
    const rise = 0.9;
    const height = 0.44;
    const steps = 200;
    const center = (t: number, scale = 1) => {
      const angle = t * Math.PI * 2 * turns + Math.PI * 0.85;
      return new THREE.Vector3(Math.cos(angle) * radius * scale, (t - 0.5) * rise, Math.sin(angle) * radius * scale);
    };

    const positions: number[] = [];
    const indices: number[] = [];
    for (let i = 0; i <= steps; i += 1) {
      const c = center(i / steps);
      positions.push(c.x, c.y + height / 2, c.z, c.x, c.y - height / 2, c.z);
      if (i < steps) {
        const a = i * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const bandGeometry = new THREE.BufferGeometry();
    bandGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    bandGeometry.setIndex(indices);
    bandGeometry.computeVertexNormals();

    const path = new THREE.CatmullRomCurve3(Array.from({ length: 80 }, (_, i) => center(i / 79, 1.015)));
    const flagGeometry = new THREE.BufferGeometry();
    flagGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([0, 0.1, 0, 0, -0.1, 0, 0.3, 0, 0], 3),
    );
    flagGeometry.computeVertexNormals();

    return {
      band: bandGeometry,
      curve: path,
      line: new THREE.TubeGeometry(path, 220, 0.011, 6, false),
      dots: [0.05, 0.2, 0.35, 0.5, 0.65, 0.8, 0.94].map((t) => path.getPoint(t)),
      end: path.getPoint(1),
      flag: flagGeometry,
    };
  }, []);

  useFrame((_, delta) => {
    time.current += Math.min(delta, 0.05);
    if (!pulse.current) return;
    const t = (time.current * 0.09) % 1;
    pulse.current.position.copy(curve.getPoint(t));
    pulse.current.scale.setScalar(0.85 + Math.sin(time.current * 6) * 0.15);
  });

  return (
    <group rotation={[0.42, 0.2, -0.2]} scale={0.98}>
      <mesh geometry={band}>
        <Glass color={COLORS.teal} opacity={0.84} />
      </mesh>
      <mesh geometry={line}>
        <meshBasicMaterial color={COLORS.white} />
      </mesh>
      {dots.map((point, i) => (
        <mesh key={i} position={point}>
          <sphereGeometry args={[0.055, 20, 20]} />
          <meshBasicMaterial color={COLORS.white} />
        </mesh>
      ))}
      <mesh ref={pulse}>
        <sphereGeometry args={[0.085, 20, 20]} />
        <meshBasicMaterial color="#d9fff9" />
      </mesh>
      <group position={end}>
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.64, 8]} />
          <meshBasicMaterial color={COLORS.tealDeep} />
        </mesh>
        <mesh geometry={flag} position={[0.012, 0.54, 0]}>
          <meshBasicMaterial color={COLORS.teal} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Architecter: glass blocks joined by a network with travelling pulses        */
/* -------------------------------------------------------------------------- */

interface Block {
  at: [number, number, number];
  size: number;
  color: string;
  opacity: number;
}

const GRID = 0.66;
const BLOCKS: Block[] = [
  { at: [0, 0, 0], size: 0.86, color: COLORS.blueDeep, opacity: 0.86 },
  { at: [-1, 0, 0], size: 0.56, color: COLORS.blue, opacity: 0.62 },
  { at: [1, 0, 0], size: 0.56, color: COLORS.blue, opacity: 0.62 },
  { at: [0, 1, 0], size: 0.56, color: COLORS.blue, opacity: 0.62 },
  { at: [0, -1, 0], size: 0.56, color: COLORS.blue, opacity: 0.62 },
  { at: [0, 0, 1], size: 0.56, color: COLORS.blue, opacity: 0.62 },
  { at: [0, 0, -1], size: 0.56, color: COLORS.blue, opacity: 0.62 },
  { at: [1, 1, 0], size: 0.38, color: COLORS.blueSoft, opacity: 0.42 },
  { at: [-1, -1, 1], size: 0.38, color: COLORS.blueSoft, opacity: 0.42 },
  { at: [-1, 1, -1], size: 0.38, color: COLORS.blueSoft, opacity: 0.42 },
  { at: [1, -1, -1], size: 0.38, color: COLORS.blueSoft, opacity: 0.42 },
  { at: [1, 0, 1], size: 0.38, color: COLORS.blueSoft, opacity: 0.42 },
  { at: [-1, 0, 1], size: 0.3, color: COLORS.blueSoft, opacity: 0.42 },
];
/** Connections between blocks, as index pairs into BLOCKS. */
const LINKS: Array<[number, number]> = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
  [2, 7], [3, 7], [1, 8], [5, 8], [3, 9], [6, 9], [2, 10], [4, 10], [2, 11], [5, 11], [1, 12], [5, 12],
];
const PULSES = 5;

function Blocks() {
  const pulses = useRef<Array<THREE.Mesh | null>>([]);
  const time = useRef(0);

  const { centers, wires } = useMemo(() => {
    const points = BLOCKS.map((block) => new THREE.Vector3(...block.at).multiplyScalar(GRID));
    const vertices: number[] = [];
    LINKS.forEach(([a, b]) => {
      vertices.push(points[a].x, points[a].y, points[a].z, points[b].x, points[b].y, points[b].z);
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    return { centers: points, wires: geometry };
  }, []);

  useFrame((_, delta) => {
    time.current += Math.min(delta, 0.05);
    for (let i = 0; i < PULSES; i += 1) {
      const mesh = pulses.current[i];
      if (!mesh) continue;
      const phase = time.current * 0.55 + i * 0.37;
      const step = Math.floor(phase);
      const [a, b] = LINKS[(step * 7 + i * 5) % LINKS.length];
      mesh.position.lerpVectors(centers[a], centers[b], phase - step);
    }
  });

  return (
    <group rotation={[0.5, 0.68, 0]} scale={0.92}>
      {BLOCKS.map((block, i) => (
        <RoundedBox
          key={i}
          args={[block.size, block.size, block.size]}
          radius={block.size * 0.09}
          smoothness={3}
          position={centers[i]}
        >
          <Glass color={block.color} opacity={block.opacity} />
        </RoundedBox>
      ))}
      <lineSegments geometry={wires}>
        <lineBasicMaterial color={COLORS.white} transparent opacity={0.85} depthTest={false} />
      </lineSegments>
      {centers.map((point, i) => (
        <mesh key={i} position={point} renderOrder={2}>
          <sphereGeometry args={[i === 0 ? 0.07 : 0.045, 16, 16]} />
          <meshBasicMaterial color={COLORS.white} depthTest={false} />
        </mesh>
      ))}
      {Array.from({ length: PULSES }, (_, i) => (
        <mesh
          key={i}
          ref={(mesh) => {
            pulses.current[i] = mesh;
          }}
          renderOrder={3}
        >
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#9ff3ff" depthTest={false} />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* CodebaseXplorer: layered code panels with a module graph                    */
/* -------------------------------------------------------------------------- */

const PANEL: [number, number, number] = [1.56, 1.1, 0.04];

function Panels() {
  const textures = useMemo(
    () => ({
      front: makeCodeTexture(7, "#101731"),
      second: makeCodeTexture(21, "#1c2350"),
      graph: makeGraphTexture(),
    }),
    [],
  );

  const glassLayers = [
    { color: COLORS.violet, opacity: 0.6 },
    { color: COLORS.violetSoft, opacity: 0.46 },
    { color: "#d6ccff", opacity: 0.36 },
  ];

  return (
    <group rotation={[0.06, -0.62, 0.03]} scale={0.98}>
      {/* Front editor panel */}
      <group position={[-0.34, -0.16, 0.62]}>
        <RoundedBox args={PANEL} radius={0.02} smoothness={2}>
          <meshBasicMaterial color="#101731" />
        </RoundedBox>
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[PANEL[0], PANEL[1]]} />
          <meshBasicMaterial map={textures.front} transparent />
        </mesh>
        <mesh position={[0.52, -0.38, 0.14]}>
          <planeGeometry args={[0.66, 0.47]} />
          <meshBasicMaterial map={textures.graph} transparent />
        </mesh>
      </group>
      {/* Second editor panel */}
      <group position={[-0.17, -0.08, 0.31]}>
        <RoundedBox args={PANEL} radius={0.02} smoothness={2}>
          <meshBasicMaterial color="#1c2350" />
        </RoundedBox>
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[PANEL[0], PANEL[1]]} />
          <meshBasicMaterial map={textures.second} transparent />
        </mesh>
      </group>
      {/* Glass layers behind */}
      {glassLayers.map((layer, i) => (
        <RoundedBox
          key={i}
          args={PANEL}
          radius={0.02}
          smoothness={2}
          position={[i * 0.17, i * 0.08, -i * 0.31]}
        >
          <Glass color={layer.color} opacity={layer.opacity} />
        </RoundedBox>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Layout: scroll-driven composition                                           */
/* -------------------------------------------------------------------------- */

function Composition() {
  const objects = useRef<Array<THREE.Group | null>>([null, null, null]);
  const ring = useRef<THREE.Group>(null);
  const ringSpin = useRef<THREE.Group>(null);
  const ringMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const orbiters = useRef<Array<THREE.Mesh | null>>([]);
  const time = useRef(0);
  const settled = useRef(false);
  const blob = useMemo(() => makeBlobTexture(), []);
  const environment = useMemo(() => makeEnvironmentCube(), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    time.current += dt;
    const t = time.current;
    const vw = state.viewport.width;
    const vh = state.viewport.height;
    const wide = vw / vh > 1.05;

    // 0 = assembled hero, 1 = separated journey.
    const split = smooth(0.16, 0.48, sceneState.stage);
    // 0 = elsewhere, 1 = reassembled in the final call to action.
    const reunite = smooth(0.05, 0.8, sceneState.cta);

    const heroScale = wide ? clamp((vw * 0.5) / 6, 0.5, 1.02) : clamp((vw * 1.02) / 6, 0.3, 0.8);
    const heroX = wide ? vw * 0.21 : 0;
    const heroY = wide ? 0.05 : vh * 0.25;

    const gap = Math.min(vw / 3.1, 3.4);
    const journeyScale = clamp(gap / 3.5, 0.3, 0.9);
    const journeyY = wide ? 0.1 : vh * 0.08;

    const ctaScale = clamp((vw * 0.9) / 6, 0.3, 0.78);
    // The composition is anchored to the section, so it scrolls with the page.
    const ctaY = vh * (0.5 - sceneState.ctaTop - CTA_ANCHOR);

    const rate = settled.current ? 5 : 1000;
    // Follow the page tightly once the composition is anchored to the final section.
    const rateY = settled.current ? lerp(5, 60, reunite) : 1000;

    for (let i = 0; i < 3; i += 1) {
      const group = objects.current[i];
      if (!group) continue;
      const [ax, ay, az] = ASSEMBLED[i];
      const [from, to] = JOURNEY_STEPS[i];
      const active = smooth(from, to, sceneState.stage);

      const x = lerp(lerp(heroX + ax * heroScale, (i - 1) * gap, split), ax * ctaScale, reunite);
      const y =
        lerp(lerp(heroY + ay * heroScale, journeyY + active * 0.12, split), ctaY + ay * ctaScale, reunite) +
        Math.sin(t * 0.8 + i * 2.1) * 0.05;
      const z = lerp(lerp(az * heroScale, 0, split), az * ctaScale, reunite);
      const scale = lerp(lerp(heroScale, journeyScale * (0.82 + 0.18 * active), split), ctaScale, reunite);
      const turn =
        Math.sin(t * 0.4 + i * 1.7) * 0.08 +
        sceneState.pointerX * 0.22 +
        split * (1 - reunite) * Math.sin(t * 0.35 + i) * 0.4;

      group.position.set(
        damp(group.position.x, x, rate, dt),
        damp(group.position.y, y, rateY, dt),
        damp(group.position.z, z, rate, dt),
      );
      group.scale.setScalar(damp(group.scale.x, scale, rate, dt));
      group.rotation.y = damp(group.rotation.y, turn, rate, dt);
      group.rotation.x = damp(group.rotation.x, -sceneState.pointerY * 0.1, rate, dt);
    }

    if (ring.current && ringMaterial.current && ringSpin.current) {
      const visible = Math.max(clamp(1 - split * 1.5, 0, 1), reunite);
      const x = lerp(lerp(heroX, 0, split), 0, reunite);
      const y = lerp(lerp(heroY, journeyY, split), ctaY, reunite);
      const scale = lerp(lerp(heroScale, journeyScale * 1.7, split), ctaScale, reunite) * (1 + (1 - visible) * 0.35);
      ring.current.position.set(damp(ring.current.position.x, x, rate, dt), damp(ring.current.position.y, y, rateY, dt), 0);
      ring.current.scale.setScalar(damp(ring.current.scale.x, scale, rate, dt));
      ring.current.rotation.y = damp(ring.current.rotation.y, sceneState.pointerX * 0.12, rate, dt);
      ring.current.visible = visible > 0.01;
      ringMaterial.current.opacity = visible * 0.5;
      ringSpin.current.rotation.z = t * 0.07;
      orbiters.current.forEach((mesh) => mesh?.scale.setScalar(visible));
    }

    settled.current = true;
  });

  const ringRadius = 3.3;
  const orbitAngles = [0.4, 2.6, 4.5];

  return (
    <EnvContext.Provider value={environment}>
      <group ref={(group) => { objects.current[0] = group; }}>
        <Roadmap />
        <GroundShadow color={COLORS.teal} texture={blob} />
      </group>
      <group ref={(group) => { objects.current[1] = group; }}>
        <Blocks />
        <GroundShadow color={COLORS.blue} texture={blob} />
      </group>
      <group ref={(group) => { objects.current[2] = group; }}>
        <Panels />
        <GroundShadow color={COLORS.violet} texture={blob} />
      </group>

      <group ref={ring}>
        <group rotation={[-1.3, 0.06, 0.14]}>
          <group ref={ringSpin}>
            <mesh>
              <torusGeometry args={[ringRadius, 0.007, 8, 220]} />
              <meshBasicMaterial ref={ringMaterial} color={COLORS.ink} transparent opacity={0.5} />
            </mesh>
            {orbitAngles.map((angle, i) => (
              <mesh
                key={i}
                ref={(mesh) => { orbiters.current[i] = mesh; }}
                position={[Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, 0]}
              >
                <sphereGeometry args={[0.085, 24, 24]} />
                <Chrome />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </EnvContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Canvas                                                                      */
/* -------------------------------------------------------------------------- */

export default function SceneCanvas() {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  // Pixel ratio drops to 1 if the device cannot keep a steady frame rate.
  const [maxDpr, setMaxDpr] = useState(1.75);

  // Follow the pointer for a subtle parallax.
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      sceneState.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Only render frames while a section that shows the scene is on screen.
  useEffect(() => {
    const zones = Array.from(document.querySelectorAll("[data-scene-zone]"));
    if (zones.length === 0) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      setActive(visible.size > 0);
    });
    zones.forEach((zone) => observer.observe(zone));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={ready ? "scene scene--ready" : "scene"} aria-hidden="true">
      <Canvas
        flat
        dpr={[1, maxDpr]}
        frameloop={ready && active ? "always" : "never"}
        camera={{ position: [0, 0.9, 10], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl, scene, camera }) => {
          // Compile every shader without blocking the main thread, then start rendering.
          const start = () => setReady(true);
          gl.compileAsync(scene, camera).then(start, start);
        }}
      >
        <PerformanceMonitor onDecline={() => setMaxDpr(1)} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 5]} intensity={1.25} />
        <directionalLight position={[-5, 2, -3]} intensity={0.5} color="#bfe9ff" />
        <Composition />
      </Canvas>
    </div>
  );
}
