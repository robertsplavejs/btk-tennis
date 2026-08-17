import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#07121f",
          color: "#ffffff",
          display: "flex",
          fontSize: 142,
          fontWeight: 800,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-8px",
          position: "relative",
          width: "100%",
        }}
      >
        BTK
        <div
          style={{
            background: "#b7ff00",
            bottom: 94,
            display: "flex",
            height: 18,
            left: 94,
            position: "absolute",
            width: 324,
          }}
        />
      </div>
    ),
    size,
  );
}
