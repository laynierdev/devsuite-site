import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";
import { products } from "@/data/products";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENTS = { teal: "#12b3a2", blue: "#2f6bff", violet: "#7c5cff" } as const;

/** Social sharing image, generated at build time from the site configuration. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f6f2ea",
          color: "#0d1526",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 600 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.values(ACCENTS).map((color) => (
              <div key={color} style={{ width: 22, height: 22, borderRadius: 11, background: color }} />
            ))}
          </div>
          {siteConfig.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, fontWeight: 700, letterSpacing: -6, lineHeight: 1 }}>{siteConfig.tagline}</div>
          <div style={{ display: "flex", gap: 20, marginTop: 28, fontSize: 52 }}>
            {siteConfig.hero.roles.map((role, i) => (
              <span key={role} style={{ color: Object.values(ACCENTS)[i] }}>
                {role}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 40, fontSize: 30, color: "#3c4558" }}>
          {products.map((product) => (
            <div key={product.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: ACCENTS[product.accent] }} />
              {product.name}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
