import { isDark, type Surface } from "./surface";

// One badge, three states, each contrast-checked on the surface it sits on.
//  LIVE  live green on ink-raised (5.5:1) — carries its own dark fill
//  SOON  soon text + hairline on dark; muted ink text + hairline on light
//  NEW   ink on amber-bright (6.1:1)
type Status = "live" | "soon" | "new";

export default function StatusBadge({
  status,
  surface = "ink",
  label,
}: {
  status: Status;
  surface?: Surface;
  label?: string;
}) {
  const tone =
    status === "live"
      ? "bg-ink-raised text-live border-ink-hairline"
      : status === "new"
        ? "bg-amber-bright text-ink border-transparent"
        : isDark(surface)
          ? "text-soon border-ink-hairline"
          : "text-on-cream-muted border-cream-hairline";
  return (
    <span
      className={`inline-flex min-h-6 items-center gap-1.5 rounded-sm border px-2 text-label uppercase ${tone}`}
    >
      {status === "live" ? <span aria-hidden="true" className="size-1.5 rounded-full bg-live" /> : null}
      {label ?? status}
    </span>
  );
}
