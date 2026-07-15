import { pmIcon } from "@/lib/icon";

// Browser-tab favicon. 32×32 with ~22% rounded corners.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return pmIcon(32, 7);
}
