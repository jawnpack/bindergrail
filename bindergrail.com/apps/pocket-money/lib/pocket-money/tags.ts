export const DEFAULT_TAGS = [
  { name: "TCG",      color: "#639922", bg: "#EAF3DE", text: "#3B6D11" },
  { name: "Sealed",   color: "#0F6E56", bg: "#E1F5EE", text: "#0F6E56" },
  { name: "Singles",  color: "#0F6E56", bg: "#E1F5EE", text: "#0F6E56" },
  { name: "Sneakers", color: "#185FA5", bg: "#E6F1FB", text: "#185FA5" },
  { name: "Food",     color: "#854F0B", bg: "#FAEEDA", text: "#854F0B" },
  { name: "Gaming",   color: "#534AB7", bg: "#EEEDFE", text: "#534AB7" },
  { name: "Other",    color: "#5F5E5A", bg: "#F1EFE8", text: "#5F5E5A" },
] as const;

export type DefaultTag = (typeof DEFAULT_TAGS)[number];

export function getTagStyle(tagName: string): { bg: string; text: string } {
  const found = DEFAULT_TAGS.find((t) => t.name === tagName);
  return found ?? { bg: "#F1EFE8", text: "#5F5E5A" };
}
