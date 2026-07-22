/**
 * The wallet money model — single source of truth for every figure the UI
 * shows. Both the dashboard and the wishlist derive their numbers here so
 * they can never drift apart.
 *
 * The headline wallet total is money that is FREE TO SPEND.
 *
 * Lifecycle of a committed dollar:
 *   free in the wallet
 *     →(reserve)→  held against a grail: OUT of the total, shown as reserved
 *     →(catch)→    spent, gone
 *
 * Reserving moves money out of the total immediately. Catching the grail
 * only clears the reserve — it must NEVER deduct from pocket/stashes a
 * second time, or the same dollar is counted twice.
 */

export interface StashAmount {
  id: string;
  amount: number;
}

export interface FundEntry {
  wishlist_item_id: string;
  amount_saved: number;
}

export interface WalletBreakdown {
  /** Unassigned cash. */
  pocket: number;
  /** Sum of the category stashes. */
  stashes: number;
  /** Committed to grails not yet caught. Held — NOT spendable. */
  reserved: number;
  /** The headline number: what can actually be spent right now. */
  freeToSpend: number;
}

/**
 * Keep only the funds still held against an uncaught (active) wishlist item.
 * A fund whose item has been acquired represents money already spent, so it
 * must drop out of every wallet figure.
 */
export function activeFunds(
  funds: FundEntry[],
  activeItemIds: Iterable<string>
): FundEntry[] {
  const active = new Set(activeItemIds);
  return funds.filter((f) => active.has(f.wishlist_item_id));
}

/** Reserved amount per wishlist item id. */
export function reservedByItem(funds: FundEntry[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const f of funds) {
    out[f.wishlist_item_id] =
      (out[f.wishlist_item_id] ?? 0) + Number(f.amount_saved);
  }
  return out;
}

/** Total reserved across the supplied funds. */
export function reservedTotal(funds: FundEntry[]): number {
  return funds.reduce((sum, f) => sum + Number(f.amount_saved), 0);
}

/**
 * Build the full breakdown. `funds` must already be scoped to active items
 * (see `activeFunds`) — anything else is money that has been spent.
 */
export function computeWallet(
  pocket: number,
  stashes: StashAmount[],
  funds: FundEntry[]
): WalletBreakdown {
  const stashTotal = stashes.reduce((sum, s) => sum + Number(s.amount), 0);
  const pocketAmount = Number(pocket);
  return {
    pocket: pocketAmount,
    stashes: stashTotal,
    reserved: reservedTotal(funds),
    // Reserved is deliberately excluded: it is committed, not spendable.
    freeToSpend: pocketAmount + stashTotal,
  };
}

// ─── Invariants ───────────────────────────────────────────────────────────
// Money is only ever moved between states, never created or destroyed —
// until it is spent by catching a grail.

const EPSILON = 0.005; // half a cent

const close = (a: number, b: number) => Math.abs(a - b) < EPSILON;

/**
 * Reserving X: freeToSpend falls by X, reserved rises by X, and the sum of
 * the two is unchanged (the dollar moved, it wasn't created or destroyed).
 */
export function conservesOnReserve(
  before: WalletBreakdown,
  after: WalletBreakdown,
  amount: number
): boolean {
  return (
    close(after.freeToSpend, before.freeToSpend - amount) &&
    close(after.reserved, before.reserved + amount) &&
    close(
      after.freeToSpend + after.reserved,
      before.freeToSpend + before.reserved
    )
  );
}

/**
 * Catching the grail spends X: reserved falls by X and freeToSpend is
 * UNCHANGED. A drop in freeToSpend here is the double-count bug — that
 * dollar already left the total when it was reserved.
 */
export function conservesOnCatch(
  before: WalletBreakdown,
  after: WalletBreakdown,
  amount: number
): boolean {
  return (
    close(after.reserved, before.reserved - amount) &&
    close(after.freeToSpend, before.freeToSpend)
  );
}

/** Un-reserving X returns the money to the pocket: the exact inverse of reserving. */
export function conservesOnUnreserve(
  before: WalletBreakdown,
  after: WalletBreakdown,
  amount: number
): boolean {
  return conservesOnReserve(after, before, amount);
}
