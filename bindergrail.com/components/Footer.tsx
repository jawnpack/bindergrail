import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{ borderColor: "#D8D0C0", backgroundColor: "#F5F0E8" }}
    >
      <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
        <Link href="/" className="block shrink-0" aria-label="Binder Grail home">
          <Image
            src="/images/binder_grail_logo.png"
            alt="Binder Grail"
            height={24}
            width={110}
            style={{ objectFit: "contain", objectPosition: "left", height: 24, width: "auto" }}
          />
        </Link>
        <div className="flex items-center gap-5">
          <a
            href="https://commonrare.bindergrail.com"
            className="text-xs hover:underline"
            style={{ color: "#7A7468" }}
          >
            Common Rare newsletter
          </a>
          <p className="text-xs" style={{ color: "#7A7468" }}>
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
