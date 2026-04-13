import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
    </div>
  );
}
