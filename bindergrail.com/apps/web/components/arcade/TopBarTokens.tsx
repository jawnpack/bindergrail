"use client";

import Link from "next/link";
import PixelSprite from "./PixelSprite";
import { usePlayer } from "./usePlayer";

// Game top bar's right slot: token balance when signed in, SIGN IN otherwise.
// Fixed width so the centered game title never moves when this fills in.
// SIGN IN doesn't prefetch: /login uses the marketing layout, whose fonts the
// arcade doesn't use, and prefetching it would preload them here.
export default function TopBarTokens() {
  const player = usePlayer();
  return (
    <div className="flex w-[76px] items-center justify-end gap-[6px]">
      {player === null ? null : player.signedIn ? (
        <>
          <PixelSprite name="coin" height={16} />
          <span className="font-num text-[24px] leading-none text-gold-400">
            {player.tokens}
          </span>
        </>
      ) : (
        <Link href="/login" prefetch={false} className="font-display text-[9px] text-cream-400 no-underline">
          SIGN IN
        </Link>
      )}
    </div>
  );
}
