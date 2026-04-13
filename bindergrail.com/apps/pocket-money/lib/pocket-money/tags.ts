export const DEFAULT_TAGS = [
  { name: "TCG", color: "#639922" },
  { name: "Sealed", color: "#3B6D11" },
  { name: "Singles", color: "#1D9E75" },
  { name: "Sneakers", color: "#378ADD" },
  { name: "Food", color: "#EF9F27" },
  { name: "Gaming", color: "#7F77DD" },
  { name: "Other", color: "#888780" },
] as const;

export type DefaultTag = (typeof DEFAULT_TAGS)[number];
