import { ImageResponse } from "next/og";
import { siteName } from "@/lib/seo";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0d0d",
          color: "#fbfbf8",
          fontFamily: "Arial",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 86, fontWeight: 800, lineHeight: 0.95 }}>{siteName}</div>
          <div style={{ fontSize: 38, color: "#c1ff4a" }}>Full-Stack Developer</div>
          <div style={{ fontSize: 28, color: "#d5d5cf" }}>React • Next.js • Node.js • Sanity CMS</div>
        </div>
      </div>
    ),
    size,
  );
}
