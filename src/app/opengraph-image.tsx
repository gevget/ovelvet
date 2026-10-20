import { ImageResponse } from "next/og";

export const alt = "OTAGAN VELVET — натяжные стены и архитектурный текстиль";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "70px", background: "#f5f2ed", color: "#20201f" }}>
      <div style={{ display: "flex", fontSize: 24, letterSpacing: "0.16em" }}>OTAGAN&nbsp;VELVET</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", width: 48, height: 2, background: "#a78c75" }} />
        <div style={{ display: "flex", maxWidth: 930, fontSize: 68, lineHeight: 1.02, fontWeight: 500, textTransform: "uppercase" }}>Натяжные стены<br />из архитектурного текстиля</div>
      </div>
      <div style={{ display: "flex", fontSize: 20, color: "#56534f" }}>Для дома и коммерческих пространств</div>
    </div>,
    size
  );
}
