# The wallet money model

The headline wallet number is **money free to spend**. Everything else is
derived from that one idea.

```
free in the wallet
   →(reserve)→   held against a grail: OUT of the total, shown as "reserved"
   →(catch)→     spent, gone
```

- **Reserving** moves money out of the total *immediately*: pocket goes down,
  reserved goes up, the total goes down by the reserved amount.
- **Catching** the grail spends it: the hold clears and the total is
  **unchanged** — that dollar already left when it was reserved. Deducting
  again here is the double-count bug.
- **Un-reserving** is the exact inverse of reserving: the money returns to
  the pocket.

```
freeToSpend = pocket + stashes          (reserved is deliberately excluded)
reserved    = Σ funds held against wishlist items that are still ACTIVE
```

## Single source of truth

All of it lives in [`lib/pocket-money/wallet.ts`](lib/pocket-money/wallet.ts).
The dashboard and the wishlist both derive their figures from it so they
cannot drift. Invariants (`conservesOnReserve`, `conservesOnCatch`,
`conservesOnUnreserve`) are covered by `npm run test:wallet`.

## The bug this replaced (July 2026)

Three defects compounded:

1. **The total included committed money** — it was computed as
   `pocket + stashes + reserved`. Reserving lowered the pocket and raised
   reserved by the same amount, so the total never moved. By construction,
   reserving could never reduce it.
2. **Catching never cleared the hold.** `markAcquired` only set
   `status = 'acquired'`; the `pm_grail_fund` row survived and kept counting,
   because the reserve total had no status filter. Real consequence: $2,250
   held against an already-caught Gengar VMAX was still inflating the wallet.
3. **Two sources for one number.** The grail's "saved" figure came from
   `getActiveGrail`'s own `.maybeSingle()` fund lookup while the wallet's
   "reserved" came from `getGrailFunds`. They could disagree — and did.

Also fixed: deleting a funded wishlist item used to cascade its fund row away
and destroy the money; it now returns to the pocket first.

## Rules for future changes

- Never add `reserved` into the spendable total.
- Catching (or any acquisition path) must **only** clear the hold. It must
  never touch `pm_user_settings.cash_reserve` or a stash amount.
- Any figure showing reserved/saved money reads from `wallet.ts`, never from
  its own query.
- A fund row is only meaningful while its wishlist item is `active`.
