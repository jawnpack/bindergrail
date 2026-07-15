import { pmIcon } from "@/lib/icon";

// iOS home-screen icon. 180×180, full-bleed square with NO pre-rounding —
// iOS applies its own corner mask, so rounding here would double-round.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return pmIcon(180, 0);
}
