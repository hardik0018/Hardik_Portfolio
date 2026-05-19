import { ImageResponse } from "next/og";

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
          flexDirection: "column",
          justifyContent: "center",
          background: "#fbfbf8",
          color: "#171716",
          fontFamily: "Arial",
          padding: 72,
        }}
      >
        <div style={{ fontSize: 28, color: "#00994a", fontWeight: 700 }}>Hardik Vatukiya</div>
        <div style={{ marginTop: 24, fontSize: 92, fontWeight: 900, lineHeight: 0.92 }}>Selected Projects</div>
        <div style={{ marginTop: 32, fontSize: 30, color: "#393936" }}>Full-stack web apps, MERN systems, and polished frontend builds.</div>
      </div>
    ),
    size,
  );
}
