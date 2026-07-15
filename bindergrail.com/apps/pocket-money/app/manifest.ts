import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pocket Money",
    short_name: "Pocket Money",
    theme_color: BRAND.ink, // #2C2C2A
    background_color: BRAND.greenMid, // #639922
    display: "standalone",
    start_url: "/dashboard",
    icons: [
      { src: "/api/icon?size=192", sizes: "192x192", type: "image/png" },
      { src: "/api/icon?size=512", sizes: "512x512", type: "image/png" },
    ],
  };
}
