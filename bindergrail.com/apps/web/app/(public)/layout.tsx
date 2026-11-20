import SiteFrame from "@/components/ui/SiteFrame";
import { flipPixel } from "@/components/flip-font";
import { siteFontClass } from "../fonts";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <SiteFrame className={`${siteFontClass} ${flipPixel.variable}`}>{children}</SiteFrame>;
}
