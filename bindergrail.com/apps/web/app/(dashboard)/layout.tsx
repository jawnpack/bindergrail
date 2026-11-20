import SiteFrame from "@/components/ui/SiteFrame";
import { siteFontClass } from "../fonts";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <SiteFrame className={siteFontClass}>{children}</SiteFrame>;
}
