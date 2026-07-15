import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";
import { BRAND } from "./brand";

// Inter Medium loaded from a local TTF so Satori renders the monogram in
// the real typeface (a hand-written SVG font-family would drift to system
// fonts per device). Read once at module load.
const interMedium = readFileSync(
  join(process.cwd(), "assets/Inter-Medium.ttf")
);

/**
 * Render the "pm" monogram tile as a PNG ImageResponse.
 * @param size    tile edge in px (square)
 * @param radius  corner radius in px (0 = full-bleed square, for apple-icon)
 */
export function pmIcon(size: number, radius: number): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BRAND.greenMid,
          borderRadius: radius,
          // Optical centering: "pm" sits slightly low from the baseline,
          // so nudge up a hair for a centered read.
          paddingBottom: size * 0.04,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: size * 0.45,
            lineHeight: 1,
            color: BRAND.greenLightest,
            letterSpacing: -size * 0.01,
          }}
        >
          pm
        </div>
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [
        { name: "Inter", data: interMedium, weight: 500, style: "normal" },
      ],
    }
  );
}
