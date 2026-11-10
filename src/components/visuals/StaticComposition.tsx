// Lightweight SVG counterpart of the WebGL scene. It is what visitors see
// when the 3D scene is not run: reduced motion, data saver, low-end devices
// or no WebGL. The three glyphs are also used on their own.

const TEAL = "#12b3a2";
const BLUE = "#2f6bff";
const VIOLET = "#7c5cff";
const INK = "#0d1526";

/** MobileRoad: a looping roadmap band with milestones and a flag. */
export function RoadmapGlyph() {
  // Milestones sit on the front half of the band, along its center line.
  const dots = [28, 62, 90, 118, 152].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return { x: 120 + Math.cos(rad) * 96, y: 103 + Math.sin(rad) * 44 };
  });
  return (
    <g>
      <path d="M24 82 A96 44 0 0 1 216 82 L216 124 A96 44 0 0 0 24 124 Z" fill={TEAL} opacity="0.28" />
      <path d="M24 82 A96 44 0 0 0 216 82 L216 124 A96 44 0 0 1 24 124 Z" fill="url(#ds-teal)" opacity="0.9" />
      <path d="M24 103 A96 44 0 0 0 216 103" fill="none" stroke="#fff" strokeWidth="1.6" opacity="0.9" />
      {dots.map((dot, i) => (
        <circle key={i} cx={dot.x} cy={dot.y} r="4.5" fill="#fff" />
      ))}
      <line x1="216" y1="103" x2="216" y2="38" stroke="#0a7f74" strokeWidth="2" strokeLinecap="round" />
      <path d="M217 38 L243 47 L217 56 Z" fill={TEAL} />
    </g>
  );
}

function IsoCube({ x, y, size, opacity }: { x: number; y: number; size: number; opacity: number }) {
  const w = size;
  const h = size * 0.5;
  return (
    <g opacity={opacity}>
      <path d={`M${x} ${y - h} L${x + w} ${y} L${x} ${y + h} L${x - w} ${y} Z`} fill="#8db6ff" />
      <path d={`M${x - w} ${y} L${x} ${y + h} L${x} ${y + h + size} L${x - w} ${y + size} Z`} fill={BLUE} />
      <path d={`M${x + w} ${y} L${x} ${y + h} L${x} ${y + h + size} L${x + w} ${y + size} Z`} fill="#1a3fc4" />
    </g>
  );
}

/** Architecter: glass blocks joined by connections. */
export function BlocksGlyph() {
  return (
    <g>
      <IsoCube x={120} y={38} size={30} opacity={0.55} />
      <IsoCube x={64} y={92} size={30} opacity={0.6} />
      <IsoCube x={176} y={92} size={30} opacity={0.6} />
      <IsoCube x={120} y={96} size={46} opacity={0.92} />
      <IsoCube x={120} y={160} size={26} opacity={0.5} />
      <g stroke="#fff" strokeWidth="1.6" fill="#fff">
        <path d="M120 60 L120 122 M64 114 L120 122 L176 114 M120 122 L120 178" fill="none" opacity="0.9" />
        <circle cx="120" cy="60" r="3.5" />
        <circle cx="64" cy="114" r="3.5" />
        <circle cx="176" cy="114" r="3.5" />
        <circle cx="120" cy="178" r="3.5" />
        <circle cx="120" cy="122" r="5" />
      </g>
    </g>
  );
}

/** CodebaseXplorer: layered panels with code lines and a module graph. */
export function PanelsGlyph() {
  const lines = [
    [0, 62, "#6ee7d6"],
    [14, 88, "#8db6ff"],
    [14, 54, "#c4b5fd"],
    [28, 72, "#ffffff"],
    [28, 46, "#6ee7d6"],
    [14, 80, "#8db6ff"],
    [0, 40, "#c4b5fd"],
  ] as const;
  return (
    <g>
      <rect x="92" y="24" width="132" height="96" rx="8" fill="#d6ccff" opacity="0.55" />
      <rect x="72" y="40" width="132" height="96" rx="8" fill="#b9a8ff" opacity="0.65" />
      <rect x="52" y="56" width="132" height="96" rx="8" fill={VIOLET} opacity="0.75" />
      <rect x="28" y="74" width="140" height="102" rx="9" fill="#101731" />
      <g>
        <circle cx="41" cy="87" r="2.6" fill="#ff8f8f" />
        <circle cx="50" cy="87" r="2.6" fill="#ffd27a" />
        <circle cx="59" cy="87" r="2.6" fill="#6ee7d6" />
      </g>
      {lines.map(([indent, width, color], i) => (
        <rect key={i} x={42 + indent} y={100 + i * 10} width={width} height="3.6" rx="1.8" fill={color} opacity={color === "#ffffff" ? 0.45 : 0.95} />
      ))}
      <g>
        <rect x="126" y="134" width="78" height="56" rx="8" fill="#fff" stroke={INK} strokeOpacity="0.08" />
        <path d="M142 166 L164 152 L188 164 M142 166 L166 178 L188 164" fill="none" stroke={INK} strokeOpacity="0.3" strokeWidth="1.4" />
        <circle cx="142" cy="166" r="4.5" fill={VIOLET} />
        <circle cx="164" cy="152" r="4.5" fill={BLUE} />
        <circle cx="166" cy="178" r="4.5" fill={VIOLET} />
        <circle cx="188" cy="164" r="4.5" fill={BLUE} />
      </g>
    </g>
  );
}

function Gradients() {
  return (
    <defs>
      <linearGradient id="ds-teal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4fd8c8" />
        <stop offset="1" stopColor="#0a8f82" />
      </linearGradient>
    </defs>
  );
}

const GLYPHS = {
  mobileroad: RoadmapGlyph,
  architecter: BlocksGlyph,
  codebasexplorer: PanelsGlyph,
} as const;

/** One product glyph on its own. Decorative. */
export function ProductGlyph({ product }: { product: keyof typeof GLYPHS }) {
  const Glyph = GLYPHS[product];
  return (
    <svg viewBox="0 0 248 208" className="glyph" aria-hidden="true" focusable="false">
      <Gradients />
      <Glyph />
    </svg>
  );
}

/** The three glyphs composed on one orbit. Decorative. */
export function StaticComposition({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 400" className={className} aria-hidden="true" focusable="false">
      <Gradients />
      <ellipse cx="320" cy="214" rx="300" ry="104" fill="none" stroke={INK} strokeOpacity="0.28" strokeWidth="1.2" transform="rotate(-9 320 214)" />
      <g className="float float--a" transform="translate(8 112)">
        <RoadmapGlyph />
      </g>
      <g className="float float--b" transform="translate(196 78)">
        <BlocksGlyph />
      </g>
      <g className="float float--c" transform="translate(392 86)">
        <PanelsGlyph />
      </g>
      <g fill="#c3c8d1" stroke={INK} strokeOpacity="0.25">
        <circle cx="52" cy="286" r="8" />
        <circle cx="604" cy="150" r="8" />
        <circle cx="210" cy="112" r="6" />
      </g>
    </svg>
  );
}
