import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { siteFontClass } from "../fonts";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${siteFontClass} min-h-screen flex flex-col`}>
      <Nav />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
    </div>
  );
}
