import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Medicaid Spending Explorer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
      }}
    >
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "white",
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        Medicaid Spending Explorer
      </div>
      <div
        style={{
          fontSize: 24,
          color: "#94a3b8",
          marginTop: 20,
          textAlign: "center",
        }}
      >
        $1.09 trillion in provider spending data (2018-2024)
      </div>
      <div
        style={{
          display: "flex",
          gap: "48px",
          marginTop: 48,
        }}
      >
        {[
          { value: "227M", label: "Data Rows" },
          { value: "50", label: "States" },
          { value: "7 Years", label: "Coverage" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 36, fontWeight: 700, color: "#60a5fa" }}>
              {stat.value}
            </span>
            <span style={{ fontSize: 16, color: "#94a3b8", marginTop: 4 }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>,
    { ...size },
  );
}
