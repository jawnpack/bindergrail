"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header style={{ backgroundColor: "#1A1814" }}>
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="block" aria-label="Binder Grail home">
          <Image
            src="/images/binder_grail_logo.png"
            alt="Binder Grail"
            height={48}
            width={210}
            priority
            style={{
              objectFit: "contain",
              objectPosition: "left",
              filter: "brightness(0) invert(1)",
              opacity: 0.92,
              height: 44,
              width: "auto",
            }}
            className="md:!h-[48px]"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/blog"
            className="text-sm transition-colors hover:text-white"
            style={{ color: "#7A7468" }}
          >
            Posts
          </Link>
          <Link
            href="/newsletter"
            className="text-sm transition-colors hover:text-white"
            style={{ color: "#7A7468" }}
          >
            Newsletter
          </Link>
          <Link
            href="/about"
            className="text-sm transition-colors hover:text-white"
            style={{ color: "#7A7468" }}
          >
            About
          </Link>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <a
              href="/origins"
              style={{ fontSize: "13px", color: "#7A7468", textDecoration: "none", lineHeight: 1 }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B07035")}
              onMouseLeave={e => (e.currentTarget.style.color = "#7A7468")}
            >
              Origins
            </a>
            <span style={{ fontSize: "9px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B07035", marginTop: "2px" }}>
              Soon
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <a
              href="/pocket-money"
              style={{ fontSize: "13px", color: "#7A7468", textDecoration: "none", lineHeight: 1 }}
              onMouseEnter={e => (e.currentTarget.style.color = "#3D5C42")}
              onMouseLeave={e => (e.currentTarget.style.color = "#7A7468")}
            >
              Pocket Money
            </a>
            <span style={{ fontSize: "9px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3D5C42", marginTop: "2px" }}>
              Soon
            </span>
          </div>
          <Link
            href="/signup"
            className="text-sm font-semibold rounded-sm px-4 py-1.5 transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#B07035", color: "#F5F0E8" }}
          >
            Sign up
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-0.5 transition-transform"
            style={{ backgroundColor: "#F5F0E8", transform: open ? "rotate(45deg) translate(3px, 3px)" : "none" }}
          />
          <span
            className="block w-6 h-0.5 transition-opacity"
            style={{ backgroundColor: "#F5F0E8", opacity: open ? 0 : 1 }}
          />
          <span
            className="block w-6 h-0.5 transition-transform"
            style={{ backgroundColor: "#F5F0E8", transform: open ? "rotate(-45deg) translate(3px, -3px)" : "none" }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t px-6 py-5 flex flex-col gap-5"
          style={{ borderColor: "#2C2920" }}
        >
          <Link href="/blog" className="text-sm" style={{ color: "#F5F0E8" }} onClick={() => setOpen(false)}>
            Posts
          </Link>
          <Link href="/newsletter" className="text-sm" style={{ color: "#F5F0E8" }} onClick={() => setOpen(false)}>
            Newsletter
          </Link>
          <Link href="/about" className="text-sm" style={{ color: "#F5F0E8" }} onClick={() => setOpen(false)}>
            About
          </Link>
          <a
            href="/origins"
            className="text-sm"
            style={{ color: "#F5F0E8", textDecoration: "none" }}
            onClick={() => setOpen(false)}
            onMouseEnter={e => (e.currentTarget.style.color = "#B07035")}
            onMouseLeave={e => (e.currentTarget.style.color = "#F5F0E8")}
          >
            Origins{" "}
            <span style={{ fontSize: "9px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B07035" }}>· Soon</span>
          </a>
          <a
            href="/pocket-money"
            className="text-sm"
            style={{ color: "#F5F0E8", textDecoration: "none" }}
            onClick={() => setOpen(false)}
            onMouseEnter={e => (e.currentTarget.style.color = "#3D5C42")}
            onMouseLeave={e => (e.currentTarget.style.color = "#F5F0E8")}
          >
            Pocket Money{" "}
            <span style={{ fontSize: "9px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3D5C42" }}>· Soon</span>
          </a>
          <Link
            href="/signup"
            className="text-sm font-semibold rounded-sm px-4 py-2 text-center transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#B07035", color: "#F5F0E8" }}
            onClick={() => setOpen(false)}
          >
            Sign up free
          </Link>
        </div>
      )}
    </header>
  );
}
