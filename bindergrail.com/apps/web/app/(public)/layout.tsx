import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { flipPixel } from "@/components/flip-font";
import { siteFontClass } from "../fonts";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${siteFontClass} ${flipPixel.variable} min-h-screen flex flex-col`}>
      <Nav />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
    </div>
  );
}
