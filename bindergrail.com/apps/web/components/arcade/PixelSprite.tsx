// Pixel sprites drawn as <rect> grids, lifted from the design files. Single-color
// sprites use currentColor so the parent sets the tint; the gem takes fill and
// highlight from the card rarity. Never an emoji.

export type SpriteName =
  | "coin"
  | "flame"
  | "heart"
  | "lock"
  | "arrow-up"
  | "arrow-down"
  | "caret"
  | "back"
  | "gem";

const VB: Record<SpriteName, [number, number]> = {
  coin: [8, 8],
  flame: [8, 9],
  heart: [7, 6],
  lock: [7, 7],
  "arrow-up": [7, 4],
  "arrow-down": [7, 4],
  caret: [5, 3],
  back: [4, 7],
  gem: [12, 9],
};

// Theme-variable colors (no raw hex).
const C = {
  gold: "var(--color-gold-400)",
  goldDeep: "var(--color-gold-700)",
  cream: "var(--color-cream-100)",
  red: "var(--color-red-400)",
  stone: "var(--color-stone-400)",
  ink: "var(--color-ink-950)",
};

type R = [number, number, number, number, string]; // x,y,w,h,fill

const COIN: R[] = [
  [2, 0, 4, 1, C.goldDeep],
  [1, 1, 1, 1, C.goldDeep],
  [2, 1, 4, 1, C.gold],
  [6, 1, 1, 1, C.goldDeep],
  [0, 2, 1, 4, C.goldDeep],
  [1, 2, 2, 4, C.gold],
  [3, 2, 1, 4, C.cream],
  [4, 2, 3, 4, C.gold],
  [7, 2, 1, 4, C.goldDeep],
  [1, 6, 1, 1, C.goldDeep],
  [2, 6, 4, 1, C.gold],
  [6, 6, 1, 1, C.goldDeep],
  [2, 7, 4, 1, C.goldDeep],
];

const FLAME: R[] = [
  [4, 0, 1, 1, C.red],
  [3, 1, 2, 1, C.red],
  [2, 2, 3, 1, C.red],
  [6, 2, 1, 1, C.red],
  [2, 3, 2, 1, C.red],
  [4, 3, 1, 1, C.gold],
  [5, 3, 2, 1, C.red],
  [1, 4, 2, 1, C.red],
  [3, 4, 2, 1, C.gold],
  [5, 4, 2, 1, C.red],
  [1, 5, 1, 2, C.red],
  [2, 5, 4, 2, C.gold],
  [6, 5, 1, 2, C.red],
  [2, 7, 1, 1, C.red],
  [3, 7, 2, 1, C.gold],
  [5, 7, 1, 1, C.red],
  [3, 8, 2, 1, C.red],
];

const HEART: R[] = [
  [1, 0, 2, 1, "currentColor"],
  [4, 0, 2, 1, "currentColor"],
  [0, 1, 7, 2, "currentColor"],
  [1, 3, 5, 1, "currentColor"],
  [2, 4, 3, 1, "currentColor"],
  [3, 5, 1, 1, "currentColor"],
];

const LOCK: R[] = [
  [2, 0, 3, 1, "currentColor"],
  [1, 1, 1, 2, "currentColor"],
  [5, 1, 1, 2, "currentColor"],
  [0, 3, 7, 1, "currentColor"],
  [0, 4, 3, 2, "currentColor"],
  [4, 4, 3, 2, "currentColor"],
  [0, 6, 7, 1, "currentColor"],
];

const ARROW_UP: R[] = [
  [3, 0, 1, 1, "currentColor"],
  [2, 1, 3, 1, "currentColor"],
  [1, 2, 5, 1, "currentColor"],
  [0, 3, 7, 1, "currentColor"],
];

const ARROW_DOWN: R[] = [
  [0, 0, 7, 1, "currentColor"],
  [1, 1, 5, 1, "currentColor"],
  [2, 2, 3, 1, "currentColor"],
  [3, 3, 1, 1, "currentColor"],
];

const CARET: R[] = [
  [0, 0, 5, 1, "currentColor"],
  [1, 1, 3, 1, "currentColor"],
  [2, 2, 1, 1, "currentColor"],
];

const BACK: R[] = [
  [0, 3, 1, 1, "currentColor"],
  [1, 2, 1, 3, "currentColor"],
  [2, 1, 1, 5, "currentColor"],
  [3, 0, 1, 7, "currentColor"],
];

function gemRects(fill: string, high: string): R[] {
  const I = C.ink;
  return [
    [4, 0, 4, 1, I],
    [3, 1, 1, 1, I],
    [4, 1, 2, 1, high],
    [6, 1, 2, 1, fill],
    [8, 1, 1, 1, I],
    [2, 2, 1, 1, I],
    [3, 2, 2, 1, high],
    [5, 2, 4, 1, fill],
    [9, 2, 1, 1, I],
    [1, 3, 10, 1, I],
    [1, 4, 1, 1, I],
    [2, 4, 1, 1, high],
    [3, 4, 7, 1, fill],
    [10, 4, 1, 1, I],
    [2, 5, 1, 1, I],
    [3, 5, 1, 1, high],
    [4, 5, 5, 1, fill],
    [9, 5, 1, 1, I],
    [3, 6, 1, 1, I],
    [4, 6, 1, 1, high],
    [5, 6, 3, 1, fill],
    [8, 6, 1, 1, I],
    [4, 7, 1, 1, I],
    [5, 7, 2, 1, fill],
    [7, 7, 1, 1, I],
    [5, 8, 2, 1, I],
  ];
}

const STATIC: Partial<Record<SpriteName, R[]>> = {
  coin: COIN,
  flame: FLAME,
  lock: LOCK,
  "arrow-up": ARROW_UP,
  "arrow-down": ARROW_DOWN,
  caret: CARET,
  back: BACK,
};

export type PixelSpriteProps = {
  name: SpriteName;
  /** Rendered height in px; width follows the sprite's aspect ratio. */
  height?: number;
  /** Fill for single-color sprites that opt out of currentColor (heart). */
  fill?: string;
  /** Gem only. */
  gemFill?: string;
  gemHigh?: string;
  className?: string;
  title?: string;
};

export default function PixelSprite({
  name,
  height = 16,
  fill,
  gemFill = C.gold,
  gemHigh = C.cream,
  className,
  title,
}: PixelSpriteProps) {
  const [vw, vh] = VB[name];
  const width = Math.round((height * vw) / vh);
  const rects: R[] =
    name === "gem"
      ? gemRects(gemFill, gemHigh)
      : name === "heart"
        ? HEART.map(([x, y, w, h]) => [x, y, w, h, fill ?? C.red] as R)
        : (STATIC[name] ?? []);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${vw} ${vh}`}
      shapeRendering="crispEdges"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      className={className}
    >
      {title ? <title>{title}</title> : null}
      {rects.map(([x, y, w, h, f], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={f} />
      ))}
    </svg>
  );
}
