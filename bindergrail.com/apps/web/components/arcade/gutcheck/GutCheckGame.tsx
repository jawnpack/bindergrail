"use client";

import { useState } from "react";
import ArcadeButton from "@/components/arcade/ArcadeButton";
import ResultTile from "@/components/arcade/ResultTile";
import {
  GRADES,
  RESULT_EMOJI,
  type Confidence,
  type ResultKind,
} from "@/lib/arcade/gutcheck/config";
import { buildShareGrid, gutCheckShareText } from "@/lib/arcade/gutcheck/grade";
import type {
  PlayCard,
  RevealResult,
  DistributionRow,
} from "@/lib/arcade/gutcheck/types";

function getAnonId(): string {
  try {
    const k = "bg-arcade-anon";
    let v = localStorage.getItem(k);
    if (!v) {
      v = crypto.randomUUID();
      localStorage.setItem(k, v);
    }
    return v;
  } catch {
    return "anon";
  }
}

// Persist a simple local daily streak (account-based comes later).
function bumpDailyStreak(dateET: string): number {
  try {
    const raw = localStorage.getItem("bg-gutcheck-streak");
    const prev = raw ? (JSON.parse(raw) as { date: string; streak: number }) : null;
    if (prev?.date === dateET) return prev.streak;
    const y = new Date(dateET + "T12:00:00Z");
    y.setUTCDate(y.getUTCDate() - 1);
    const yest = y.toISOString().slice(0, 10);
    const streak = prev?.date === yest ? prev.streak + 1 : 1;
    localStorage.setItem("bg-gutcheck-streak", JSON.stringify({ date: dateET, streak }));
    return streak;
  } catch {
    return 1;
  }
}

const CONFIDENCES: Confidence[] = ["low", "medium", "high"];

type RoundState = { reveal?: RevealResult; distribution?: DistributionRow[] };

function verdictLabel(result: ResultKind, distance: number): string {
  if (result === "exact") return "DEAD ON";
  if (result === "close") return "CLOSE";
  return `OFF BY ${distance}`;
}

export default function GutCheckGame({
  cards,
  challengeDate,
  puzzleNumber,
  mode,
}: {
  cards: PlayCard[];
  challengeDate: string | null;
  puzzleNumber: number;
  mode: "daily" | "practice";
}) {
  const [index, setIndex] = useState(0);
  const [rounds, setRounds] = useState<RoundState[]>(() =>
    cards.map(() => ({}))
  );
  const [guess, setGuess] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [side, setSide] = useState<"front" | "back">("front");
  const [zoom, setZoom] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<"play" | "results">("play");
  const [copied, setCopied] = useState(false);
  const [streak, setStreak] = useState<number | null>(null);

  const card = cards[index];
  const round = rounds[index];
  const revealed = !!round.reveal;
  const results: ResultKind[] = rounds
    .map((r) => r.reveal?.result)
    .filter((r): r is ResultKind => !!r);
  const exactCount = results.filter((r) => r === "exact").length;

  const frontSrc = card.front_crop_url ?? card.certificate_redacted_image_url;
  const backSrc = card.back_crop_url;
  const imgSrc = side === "back" && backSrc ? backSrc : frontSrc;

  const clues = [
    card.condition_report,
    card.centering_notes,
    card.corner_notes,
    card.edge_notes,
    card.surface_notes,
    card.whitening_notes,
    card.print_line_notes,
  ].filter((c): c is string => !!c);

  async function submit() {
    if (guess === null || submitting || revealed) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/arcade/gut-check/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: card.id,
          guess,
          confidence: confidence ?? undefined,
          challengeDate,
          roundIndex: index,
          anonId: getAnonId(),
        }),
      });
      if (!res.ok) throw new Error("submit failed");
      const data = (await res.json()) as {
        reveal: RevealResult;
        distribution: DistributionRow[];
      };
      setRounds((prev) => {
        const next = prev.slice();
        next[index] = { reveal: data.reveal, distribution: data.distribution };
        return next;
      });
    } catch {
      setError("Couldn't submit — check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    if (index + 1 >= cards.length) {
      if (mode === "daily" && challengeDate) setStreak(bumpDailyStreak(challengeDate));
      setPhase("results");
      return;
    }
    setIndex((i) => i + 1);
    setGuess(null);
    setConfidence(null);
    setSide("front");
    setZoom(false);
  }

  async function share() {
    const text = gutCheckShareText({ number: puzzleNumber, results });
    try {
      if (navigator.share && mode === "daily") {
        await navigator.share({ text });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
      }
    } catch {
      /* user dismissed */
    }
  }

  // ---------- Results ----------
  if (phase === "results") {
    return (
      <div className="flex grow flex-col items-center gap-5 p-6 text-center">
        <span className="font-display text-[10px] text-cream-400">
          GUT CHECK {mode === "daily" ? `#${String(puzzleNumber).padStart(3, "0")}` : "PRACTICE"}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-num text-[72px] leading-[0.9] text-gold-400">
            {exactCount}
          </span>
          <span className="font-num text-[36px] text-cream-400">
            /{cards.length} exact
          </span>
        </div>
        <div className="text-[28px] tracking-[0.2em]">{buildShareGrid(results)}</div>
        {streak != null ? (
          <span className="font-body text-[16px] text-cream-100">
            Daily streak: <span className="text-gold-400">{streak}</span>
          </span>
        ) : null}
        <ArcadeButton onClick={share} className="w-full">
          {copied ? "COPIED!" : "SHARE RESULT"}
        </ArcadeButton>
        <div className="grid w-full grid-cols-2 gap-3">
          <ArcadeButton href="/arcade/gut-check/practice" variant="outline" size="sm">
            {mode === "daily" ? "PRACTICE" : "PLAY AGAIN"}
          </ArcadeButton>
          <ArcadeButton href="/arcade" variant="outline" size="sm">
            LOBBY
          </ArcadeButton>
        </div>
        <span className="font-body text-[14px] text-cream-400">
          {mode === "daily"
            ? "Next Gut Check drops at midnight ET."
            : "Practice is unlimited — play as much as you want."}
        </span>
      </div>
    );
  }

  // ---------- Play ----------
  return (
    <div className="flex grow flex-col gap-3 p-4">
      {/* progress */}
      <div className="flex items-center justify-between">
        <span className="font-display text-[10px] text-cream-100">
          CARD {index + 1}/{cards.length}
        </span>
        <div className="flex gap-[6px]">
          {rounds.map((r, i) => (
            <ResultTile
              key={i}
              size={18}
              state={
                r.reveal
                  ? r.reveal.result
                  : i === index
                    ? "current"
                    : "empty"
              }
            />
          ))}
        </div>
        <span className="font-num text-[24px] leading-none text-gold-400">
          {exactCount} EXACT
        </span>
      </div>

      {/* image */}
      <div className="relative flex items-center justify-center rounded-[4px] border-[3px] border-ink-600 bg-ink-950 p-3">
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={revealed ? (card.card_name ?? "Graded card") : "Card to grade"}
            loading="lazy"
            className="max-h-[320px] w-auto cursor-zoom-in"
            onClick={() => setZoom(true)}
          />
        ) : (
          <span className="py-16 font-display text-[9px] text-stone-400">
            IMAGE PENDING
          </span>
        )}
      </div>

      {/* front/back + zoom */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setSide("front")}
          aria-pressed={side === "front"}
          className={`min-h-[36px] cursor-pointer border-[3px] px-3 font-display text-[8px] ${side === "front" ? "border-ink-950 bg-gold-400 text-ink-950" : "border-ink-600 bg-ink-800 text-cream-100"}`}
        >
          FRONT
        </button>
        <button
          type="button"
          onClick={() => backSrc && setSide("back")}
          aria-pressed={side === "back"}
          disabled={!backSrc}
          className={`min-h-[36px] cursor-pointer border-[3px] px-3 font-display text-[8px] disabled:opacity-40 ${side === "back" ? "border-ink-950 bg-gold-400 text-ink-950" : "border-ink-600 bg-ink-800 text-cream-100"}`}
        >
          BACK
        </button>
        {imgSrc ? (
          <button
            type="button"
            onClick={() => setZoom(true)}
            className="min-h-[36px] cursor-pointer border-[3px] border-ink-600 bg-ink-800 px-3 font-display text-[8px] text-cream-100"
          >
            ZOOM
          </button>
        ) : null}
      </div>

      {/* inspector / clues */}
      {clues.length > 0 ? (
        <div className="border-[3px] border-cream-100 bg-ink-800 p-3 shadow-[0_0_0_3px_var(--color-ink-950)]">
          <span className="font-display text-[9px] text-gold-400">INSPECTOR</span>
          <ul className="m-0 mt-1 flex list-disc flex-col gap-1 pl-5 font-body text-[15px] leading-[1.3]">
            {clues.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {!revealed ? (
        <>
          {/* grade selector */}
          <div className="flex flex-col gap-2">
            <span id="grade-label" className="font-display text-[9px] text-cream-400">
              CALL THE GRADE
            </span>
            <div
              role="group"
              aria-labelledby="grade-label"
              className="grid grid-cols-5 gap-2"
            >
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  aria-pressed={guess === g}
                  onClick={() => setGuess(g)}
                  className={`h-[46px] cursor-pointer border-[3px] font-display text-[14px] shadow-[3px_3px_0_var(--color-ink-950)] ${guess === g ? "border-ink-950 bg-gold-400 text-ink-950" : "border-ink-600 bg-ink-800 text-cream-100"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* confidence */}
          <div className="flex items-center gap-2">
            <span className="font-display text-[8px] text-cream-400">CONFIDENCE</span>
            {CONFIDENCES.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={confidence === c}
                onClick={() => setConfidence(c)}
                className={`min-h-[36px] grow cursor-pointer border-[3px] px-2 font-display text-[8px] ${confidence === c ? "border-ink-950 bg-blue-400 text-ink-950" : "border-ink-600 bg-ink-800 text-cream-100"}`}
              >
                {c.toUpperCase()}
              </button>
            ))}
          </div>

          <ArcadeButton onClick={submit} disabled={guess === null || submitting}>
            {submitting ? "···" : "LOCK IN"}
          </ArcadeButton>
          {error ? (
            <span className="font-body text-[14px] text-red-400">{error}</span>
          ) : null}
        </>
      ) : (
        <RevealPanel round={round} guess={guess} onNext={next} isLast={index + 1 >= cards.length} />
      )}

      {/* zoom lightbox */}
      {zoom && imgSrc ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/95 p-4"
          onClick={() => setZoom(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt="Zoomed card"
            className="max-h-[92vh] max-w-[92vw] cursor-zoom-out"
          />
        </div>
      ) : null}
    </div>
  );
}

function RevealPanel({
  round,
  guess,
  onNext,
  isLast,
}: {
  round: RoundState;
  guess: number | null;
  onNext: () => void;
  isLast: boolean;
}) {
  const reveal = round.reveal!;
  const dist = round.distribution ?? [];
  const total = dist.reduce((s, d) => s + d.n, 0);
  const resultColor =
    reveal.result === "exact"
      ? "text-gold-400"
      : reveal.result === "close"
        ? "text-blue-400"
        : "text-red-400";

  return (
    <div className="flex flex-col gap-3">
      <div className="border-[3px] border-cream-100 bg-ink-800 p-3 shadow-[0_0_0_3px_var(--color-ink-950)]">
        <span className="font-display text-[9px] text-gold-400">GRADER</span>
        <p className="m-0 mt-1 font-body text-[18px] leading-[1.3]">
          Graded {reveal.confirmed_grade}. You called {guess}.
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span className={`font-display text-[10px] ${resultColor}`}>
            {verdictLabel(reveal.result, reveal.distance)} {RESULT_EMOJI[reveal.result]}
          </span>
        </div>
        {reveal.card_name ? (
          <p className="m-0 mt-2 font-body text-[14px] text-cream-400">
            {reveal.card_name}
            {reveal.set_name ? ` · ${reveal.set_name}` : ""}
            {reveal.collector_number ? ` · ${reveal.collector_number}` : ""}
          </p>
        ) : null}
        {reveal.teaching_points ? (
          <p className="m-0 mt-2 font-body text-[15px] leading-[1.35] text-cream-100">
            {reveal.teaching_points}
          </p>
        ) : null}
      </div>

      {total > 0 ? (
        <div className="border-[3px] border-ink-600 bg-ink-900 p-3">
          <span className="font-display text-[9px] text-cream-400">
            HOW EVERYONE GUESSED
          </span>
          <div className="mt-2 flex flex-col gap-1">
            {dist.map((d) => {
              const pct = Math.round((d.n / total) * 100);
              return (
                <div key={d.guessed_grade} className="flex items-center gap-2">
                  <span className="w-8 font-num text-[20px] leading-none text-gold-400">
                    {d.guessed_grade}
                  </span>
                  <div className="h-3 grow bg-ink-800">
                    <div
                      className="h-full bg-gold-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-num text-[18px] leading-none text-cream-400">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <ArcadeButton onClick={onNext}>
        {isLast ? "SEE RESULTS" : "NEXT CARD"}
      </ArcadeButton>
    </div>
  );
}
