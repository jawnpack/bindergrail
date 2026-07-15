import { pmIcon } from "@/lib/icon";

// Manifest / PWA icons at arbitrary sizes (192, 512). Full-bleed square —
// Android launchers apply their own masking.
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = Number(searchParams.get("size")) || 512;
  const size = Math.min(Math.max(raw, 16), 1024);
  return pmIcon(size, 0);
}
