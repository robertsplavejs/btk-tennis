import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#07121f",
          color: "#ffffff",
          display: "flex",
          fontSize: 50,
          fontWeight: 800,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-3px",
          position: "relative",
          width: "100%",
        }}
      >
        BTK
        <div
          style={{
            background: "#b7ff00",
            bottom: 33,
            display: "flex",
            height: 6,
            left: 33,
            position: "absolute",
            width: 114,
          }}
        />
      </div>
    ),
    size,
  );
}
