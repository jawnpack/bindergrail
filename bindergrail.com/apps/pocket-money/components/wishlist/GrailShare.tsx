"use client";

import { useEffect, useMemo, useState } from "react";

interface GrailShareProps {
  name: string;
  days: number | null;
}

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "grail"
  );
}

// ── Button styles (token-based; sit on the dark GrailMoment overlay) ──
const primaryBtn: React.CSSProperties = {
  width: "100%",
  backgroundColor: "var(--pm-green-mid)",
  color: "var(--pm-white)",
  border: "none",
  borderRadius: 10,
  padding: "13px 16px",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
};

const outlineBtn: React.CSSProperties = {
  flex: 1,
  backgroundColor: "transparent",
  color: "var(--pm-green-lightest)",
  border: "0.5px solid var(--pm-green-dark)",
  borderRadius: 8,
  padding: "10px 8px",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
  textDecoration: "none",
  textAlign: "center",
};

const textBtn: React.CSSProperties = {
  flex: 1,
  backgroundColor: "transparent",
  color: "var(--pm-gray-text)",
  border: "none",
  padding: "8px 4px",
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
  textDecoration: "none",
  textAlign: "center",
};

export default function GrailShare({ name, days }: GrailShareProps) {
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [status, setStatus] = useState("");
  const [caption, setCaption] = useState(
    `Caught my grail: ${name}${
      days !== null
        ? ` — ${days === 0 ? "same day it hit the list" : `${days} ${days === 1 ? "day" : "days"} in the making`}`
        : ""
    }. Tracked with Pocket Money.`
  );

  // Absolute URL to the generated grail card, built client-side.
  const imageUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams({ name });
    if (days !== null) params.set("days", String(days));
    return `${window.location.origin}/api/og/grail?${params.toString()}`;
  }, [name, days]);

  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanNativeShare(true);
    }
  }, []);

  function flash(msg: string) {
    setStatus(msg);
    window.setTimeout(() => setStatus(""), 3000);
  }

  function openIntent(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copyText(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  async function downloadImage(): Promise<boolean> {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `grail-${slugify(name)}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return true;
    } catch {
      return false;
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({
        title: "Caught my grail",
        text: caption,
        url: imageUrl,
      });
    } catch {
      // user dismissed the sheet — nothing to report
    }
  }

  async function igTikTokSave() {
    const dl = await downloadImage();
    const cp = await copyText(caption);
    if (dl && cp) {
      flash("Image saved + caption copied — paste it into your post.");
    } else if (dl) {
      flash("Image saved. Copy the caption manually and paste it in.");
    } else {
      flash("Couldn't save the image. Try Download image below.");
    }
  }

  async function copyLink() {
    flash((await copyText(imageUrl)) ? "Link copied." : "Couldn't copy the link.");
  }

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}&url=${encodeURIComponent(imageUrl)}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`;
  const bskyUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(`${caption} ${imageUrl}`)}`;
  const threadsUrl = `https://www.threads.net/intent/post?text=${encodeURIComponent(`${caption} ${imageUrl}`)}`;
  const mailto = `mailto:?subject=${encodeURIComponent("Caught my grail")}&body=${encodeURIComponent(`${caption}\n\n${imageUrl}`)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
      {/* Editable caption */}
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={2}
        aria-label="Share caption"
        style={{
          width: "100%",
          resize: "vertical",
          backgroundColor: "var(--pm-ink-light)",
          color: "var(--pm-green-lightest)",
          border: "0.5px solid var(--pm-green-dark)",
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: 13,
          fontFamily: "inherit",
          lineHeight: 1.5,
          outline: "none",
        }}
      />

      {/* Native share sheet (mobile / supported browsers) */}
      {canNativeShare && (
        <button type="button" onClick={nativeShare} style={primaryBtn}>
          Share your grail
        </button>
      )}

      {/* Platform intents */}
      <div style={{ display: "flex", gap: 6 }}>
        <button type="button" onClick={() => openIntent(xUrl)} style={outlineBtn}>
          X
        </button>
        <button type="button" onClick={() => openIntent(fbUrl)} style={outlineBtn}>
          Facebook
        </button>
        <button type="button" onClick={() => openIntent(bskyUrl)} style={outlineBtn}>
          Bluesky
        </button>
        <button type="button" onClick={() => openIntent(threadsUrl)} style={outlineBtn}>
          Threads
        </button>
      </div>

      {/* Instagram / TikTok — save + copy caption (no fake deep-link) */}
      <button
        type="button"
        onClick={igTikTokSave}
        style={{ ...outlineBtn, flex: "unset", width: "100%", padding: "11px 12px" }}
      >
        Instagram / TikTok — save image + copy caption
      </button>

      {/* Universal fallbacks */}
      <div style={{ display: "flex", gap: 6 }}>
        <button type="button" onClick={copyLink} style={textBtn}>
          Copy link
        </button>
        <button type="button" onClick={() => downloadImage()} style={textBtn}>
          Download image
        </button>
        <a href={mailto} style={textBtn}>
          Email
        </a>
      </div>

      {/* Status line */}
      {status && (
        <p style={{ fontSize: 12, color: "var(--pm-green-light)", margin: 0 }}>
          {status}
        </p>
      )}

      {/* Privacy microcopy */}
      <p
        style={{
          fontSize: 11,
          color: "var(--pm-gray-text)",
          fontStyle: "italic",
          margin: 0,
          textAlign: "center",
        }}
      >
        Share the win, not your wallet.
      </p>
    </div>
  );
}
