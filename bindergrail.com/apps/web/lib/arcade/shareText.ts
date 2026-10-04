import { ARCADE_URL } from "./config";
import { puzzleLabel } from "./dailySeed";

// One share string for every game: name, puzzle number, score and an emoji grid,
// with the arcade link last. Emoji are chosen so the grid reads without color.
export type TileResult = "exact" | "close" | "miss" | "wrong";

const EMOJI: Record<TileResult, string> = {
  exact: "🟨",
  close: "🟦",
  miss: "⬛",
  wrong: "🟥",
};

export function shareText(opts: {
  game: string;
  number: number;
  score: string;
  grid: TileResult[];
}): string {
  const { game, number, score, grid } = opts;
  const squares = grid.map((g) => EMOJI[g]).join("");
  const header = `${game} ${puzzleLabel(number)}  ${score}`;
  return [header, squares, ARCADE_URL].filter(Boolean).join("\n");
}
