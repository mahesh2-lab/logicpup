import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "LogicPup — Visual Python Flowchart IDE";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#F4F1EA",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "40px",
          border: "20px solid #F26A3D",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 100,
            fontWeight: 800,
            color: "#171717",
            marginBottom: 20,
          }}
        >
          LogicPup 🐾
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 40,
            color: "#555555",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Visual Python Flowchart IDE & Learning Playground
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
