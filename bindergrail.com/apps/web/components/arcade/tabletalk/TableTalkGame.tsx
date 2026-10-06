"use client";

import { useRef, useState } from "react";
import ArcadeButton from "@/components/arcade/ArcadeButton";
import CardFrame from "@/components/arcade/CardFrame";
import TextBox from "@/components/arcade/TextBox";
import { makeRng, type Rng } from "@/lib/arcade/tabletalk/rng";
import {
  applyTactic,
  createEncounter,
  dealResult,
  vendorTension,
} from "@/lib/arcade/tabletalk/engine";
import { CARDS } from "@/lib/arcade/tabletalk/cards";
import { TACTICS, TACTIC_ORDER, VENDORS } from "@/lib/arcade/tabletalk/data";
import type { EncounterState, EraId, VendorId } from "@/lib/arcade/tabletalk/types";

const ERA_FRAME: Record<EraId, "rare" | "holo" | "grail"> = {
  modern: "rare",
  mid: "holo",
  vintage: "grail",
};

const TENSION = {
  calm: { label: "Relaxed", color: "bg-green-400", n: 1 },
  wary: { label: "Getting impatient", color: "bg-gold-400", n: 2 },
  edge: { label: "On edge", color: "bg-red-400", n: 3 },
} as const;

type RunStats = {
  savings: number;
  cards: number;
  bestDeal: number;
  bestDiscountPct: number;
  vendorsSeen: number;
  vendorCounts: Record<VendorId, number>;
};

const EMPTY_RUN: RunStats = {
  savings: 0,
  cards: 0,
  bestDeal: 0,
  bestDiscountPct: 0,
  vendorsSeen: 0,
  vendorCounts: { friendly: 0, busy: 0, tough: 0 },
};

const money = (n: number) => `$${n.toFixed(2)}`;

export default function TableTalkGame() {
  const rngRef = useRef<Rng | null>(null);
  if (rngRef.current === null) rngRef.current = makeRng();
  const rng = rngRef.current;

  const [phase, setPhase] = useState<"title" | "negotiate" | "deal" | "over">("title");
  const [enc, setEnc] = useState<EncounterState | null>(null);
  const [run, setRun] = useState<RunStats>(EMPTY_RUN);
  const [lastDeal, setLastDeal] = useState<{
    name: string;
    ask: number;
    paid: number;
    savings: number;
    discountPct: number;
  } | null>(null);
  const recentRef = useRef<string[]>([]);

  function spawn(stats: RunStats) {
    const e = createEncounter(rng, {
      cardPool: CARDS,
      recentCardIds: recentRef.current,
    });
    recentRef.current = [e.card.card_id, ...recentRef.current].slice(0, 6);
    setEnc(e);
    setRun({
      ...stats,
      vendorsSeen: stats.vendorsSeen + 1,
      vendorCounts: {
        ...stats.vendorCounts,
        [e.vendor]: stats.vendorCounts[e.vendor] + 1,
      },
    });
    setPhase("negotiate");
  }

  function start() {
    recentRef.current = [];
    spawn(EMPTY_RUN);
  }

  async function submitScore(stats: RunStats) {
    try {
      await fetch("/api/arcade/table-talk/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: Math.round(stats.savings),
          cards: stats.cards,
          runLength: stats.vendorsSeen,
          bestDiscountPct: stats.bestDiscountPct,
        }),
      });
    } catch {
      /* leaderboard is best-effort */
    }
  }

  function doTactic(tacticId: (typeof TACTIC_ORDER)[number]) {
    if (!enc || phase !== "negotiate") return;
    const e2 = applyTactic(enc, tacticId, rng);
    setEnc(e2);
    if (e2.crashed) {
      setPhase("over");
      void submitScore(run);
    }
  }

  function buy() {
    if (!enc || phase !== "negotiate") return;
    const d = dealResult(enc);
    const stats: RunStats = {
      ...run,
      savings: Math.round((run.savings + d.savings) * 100) / 100,
      cards: run.cards + 1,
      bestDeal: Math.max(run.bestDeal, d.savings),
      bestDiscountPct: Math.max(run.bestDiscountPct, d.discountPct),
    };
    setRun(stats);
    setLastDeal({
      name: enc.card.display_name,
      ask: enc.openingAsk,
      paid: enc.currentPrice,
      savings: d.savings,
      discountPct: d.discountPct,
    });
    setPhase("deal");
  }

  function walkAway() {
    if (!enc) return;
    spawn(run);
  }

  // ---------- Title ----------
  if (phase === "title") {
    return (
      <div className="flex grow flex-col items-center gap-5 p-6 text-center">
        <span className="font-body text-[15px] text-cream-400">
          Card-show haggling
        </span>
        <h1 className="m-0 font-display text-[28px] leading-[1.3] text-cyan-300 [text-shadow:4px_4px_0_var(--color-ink-800)]">
          TABLE TALK
        </h1>
        <p className="m-0 max-w-[360px] font-body text-[16px] leading-[1.4] text-cream-100">
          Work the table. Read the vendor. Talk the price down — and quit before
          someone gets annoyed enough to throw you out.
        </p>
        <div className="flex w-full flex-col gap-2 text-left">
          {(["friendly", "busy", "tough"] as VendorId[]).map((v) => (
            <div key={v} className="border-[3px] border-ink-600 bg-ink-900 p-3">
              <span className="font-display text-[9px] text-gold-400">
                {VENDORS[v].label}
              </span>
              <p className="m-0 mt-1 font-body text-[14px] text-cream-400">
                {VENDORS[v].blurb}
              </p>
            </div>
          ))}
        </div>
        <ArcadeButton onClick={start} className="w-full">
          ▶ START HAGGLING
        </ArcadeButton>
        <span className="font-body text-[13px] text-cream-400">
          Score = total money saved before you&apos;re thrown out.
        </span>
      </div>
    );
  }

  // ---------- Deal ----------
  if (phase === "deal" && lastDeal) {
    return (
      <div className="flex grow flex-col items-center gap-4 p-6 text-center">
        <span className="font-display text-[20px] text-gold-400 [text-shadow:3px_3px_0_var(--color-ink-950)]">
          DEAL!
        </span>
        <span className="font-body text-[18px] text-cream-100">{lastDeal.name}</span>
        <div className="flex w-full flex-col gap-1">
          <Row label="Original ask" value={money(lastDeal.ask)} />
          <Row label="You paid" value={money(lastDeal.paid)} />
          <Row label="You saved" value={money(lastDeal.savings)} highlight />
        </div>
        <span className="font-num text-[40px] leading-none text-gold-400">
          {lastDeal.discountPct}% off
        </span>
        <div className="mt-2 flex w-full flex-col gap-1 border-t-[3px] border-ink-700 pt-3">
          <Row label="Run total saved" value={money(run.savings)} />
          <Row label="Cards bought" value={String(run.cards)} />
        </div>
        <ArcadeButton onClick={() => spawn(run)} className="w-full">
          NEXT VENDOR ▶
        </ArcadeButton>
      </div>
    );
  }

  // ---------- Over (thrown out) ----------
  if (phase === "over") {
    const topVendor = (Object.entries(run.vendorCounts) as [VendorId, number][])
      .sort((a, b) => b[1] - a[1])[0];
    return (
      <div className="flex grow flex-col items-center gap-4 p-6 text-center">
        <span className="font-display text-[16px] text-red-400 [text-shadow:3px_3px_0_var(--color-ink-950)]">
          YOU&apos;RE DONE
        </span>
        <p className="m-0 max-w-[340px] font-body text-[16px] leading-[1.4] text-cream-100">
          The vendor waves you off. &ldquo;Okay, that&apos;s enough.&rdquo; Security
          has already seen what happened — you&apos;ve been asked to leave the
          convention.
        </p>
        <div className="flex w-full flex-col gap-1">
          <Row label="Final savings" value={money(run.savings)} highlight />
          <Row label="Cards purchased" value={String(run.cards)} />
          <Row
            label="Avg / card"
            value={run.cards ? money(run.savings / run.cards) : "$0.00"}
          />
          <Row label="Best deal" value={money(run.bestDeal)} />
          <Row label="Best discount" value={`${run.bestDiscountPct}%`} />
          <Row label="Run length" value={`${run.vendorsSeen} vendors`} />
          {topVendor ? (
            <Row label="Most seen" value={VENDORS[topVendor[0]].label} />
          ) : null}
        </div>
        <span className="font-body text-[13px] text-cream-400">
          Signed in? Your run total is on the leaderboard.
        </span>
        <div className="grid w-full grid-cols-2 gap-3">
          <ArcadeButton onClick={start} size="sm">
            PLAY AGAIN
          </ArcadeButton>
          <ArcadeButton href="/arcade" variant="outline" size="sm">
            LOBBY
          </ArcadeButton>
        </div>
      </div>
    );
  }

  // ---------- Negotiate ----------
  if (!enc) return null;
  const vendor = VENDORS[enc.vendor];
  const tension = TENSION[vendorTension(enc)];
  const distracted = enc.distractedTurns > 0;

  return (
    <div className="flex grow flex-col gap-3 p-4">
      {/* run HUD */}
      <div className="flex items-center justify-between font-display text-[9px] text-cream-400">
        <span>SAVED <span className="text-gold-400">{money(run.savings)}</span></span>
        <span>CARDS {run.cards}</span>
        <span>VENDOR #{run.vendorsSeen}</span>
      </div>

      {/* vendor */}
      <div className="flex items-center justify-between gap-2 border-[3px] border-ink-600 bg-ink-900 p-3">
        <div className="min-w-0">
          <div className="font-display text-[10px] text-cyan-300">{vendor.label}</div>
          <div className="mt-1 font-body text-[13px] text-cream-400">
            {distracted ? "Checking his phone…" : TENSION[vendorTension(enc)].label}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-display text-[7px] text-cream-400">MOOD</span>
          <div className="flex gap-1" aria-label={`Vendor mood: ${tension.label}`}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-3 w-3 border-2 border-ink-950 ${i < tension.n ? tension.color : "bg-ink-700"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* card + price */}
      <div className="flex items-center gap-4 border-[3px] border-ink-600 bg-ink-950 p-3">
        <div className="shrink-0">
          <CardFrame rarity={ERA_FRAME[enc.card.era_category]} size="md" />
        </div>
        <div className="flex min-w-0 grow flex-col gap-1">
          <span className="font-body text-[17px] leading-[1.2] text-cream-100">
            {enc.card.display_name}
          </span>
          <span className="font-body text-[13px] text-cream-400">
            {enc.card.set_name} · {enc.card.year}
          </span>
          <span className="font-display text-[8px] text-cyan-300">
            {enc.card.condition_type === "graded"
              ? `${enc.card.grading_company ?? "GRADED"} ${enc.card.grade ?? ""}`.trim()
              : "RAW"}
          </span>
          <span className="mt-1 font-display text-[7px] text-cream-400">ASKING</span>
          <span className="font-num text-[40px] leading-none text-gold-400">
            {money(enc.currentPrice)}
          </span>
        </div>
      </div>

      {/* reaction */}
      <TextBox
        speaker={vendor.label.replace("The ", "").toUpperCase()}
        line={enc.lastReaction ? enc.lastReaction.line : vendor.reactions.open[0]}
        caret={false}
      />

      {/* tactics */}
      <div className="grid grid-cols-2 gap-2">
        {TACTIC_ORDER.map((tid) => (
          <button
            key={tid}
            type="button"
            onClick={() => doTactic(tid)}
            className="flex min-h-[52px] cursor-pointer flex-col items-start justify-center border-[3px] border-ink-600 bg-ink-800 px-3 py-1 text-left shadow-[3px_3px_0_var(--color-ink-950)] hover:border-cyan-300"
          >
            <span className="font-display text-[9px] text-cream-100">
              {TACTICS[tid].label}
            </span>
            <span className="font-body text-[12px] leading-[1.2] text-cream-400">
              {TACTICS[tid].hint}
            </span>
          </button>
        ))}
      </div>

      {/* buy / walk */}
      <div className="grid grid-cols-2 gap-3">
        <ArcadeButton onClick={buy}>BUY {money(enc.currentPrice)}</ArcadeButton>
        <ArcadeButton onClick={walkAway} variant="danger">
          WALK AWAY
        </ArcadeButton>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-body text-[14px] text-cream-400">{label}</span>
      <span
        className={`font-num text-[22px] leading-none ${highlight ? "text-gold-400" : "text-cream-100"}`}
      >
        {value}
      </span>
    </div>
  );
}
