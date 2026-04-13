"use client";

import MonthDivider from "@/components/dashboard/MonthDivider";
import { formatCurrency } from "@/lib/pocket-money/budget";
import { getTagStyle } from "@/lib/pocket-money/tags";

interface Transaction {
  id: string;
  type: "spend" | "return" | "sale";
  name: string;
  amount: number;
  date: string;
  tag: string | null;
  note: string | null;
}

interface TransactionLogProps {
  transactions: Transaction[];
  currency: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function groupByMonth(txs: Transaction[]): [string, Transaction[]][] {
  const groups = new Map<string, Transaction[]>();
  for (const tx of txs) {
    const key = tx.date.slice(0, 7);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(tx);
  }
  return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
}

function monthLabel(key: string): string {
  const [year, month] = key.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

const isInflow = (type: Transaction["type"]) =>
  type === "return" || type === "sale";

const typeLabel: Record<Transaction["type"], string> = {
  spend: "spend",
  return: "return",
  sale: "sale",
};

export default function TransactionLog({
  transactions,
  currency,
}: TransactionLogProps) {
  if (transactions.length === 0) {
    return (
      <div style={{ padding: "24px 20px" }}>
        <p
          style={{
            fontSize: 13,
            color: "var(--pm-gray-text)",
            fontStyle: "italic",
          }}
        >
          Your Bag is empty. Log your first purchase.
        </p>
      </div>
    );
  }

  const groups = groupByMonth(transactions);

  return (
    <div>
      {groups.map(([key, txs]) => (
        <div key={key}>
          <MonthDivider label={monthLabel(key)} />
          {txs.map((tx) => {
            const inflow = isInflow(tx.type);
            const dotColor = inflow ? "var(--pm-green-mid)" : "var(--pm-red-mid)";
            const amountColor = inflow ? "var(--pm-green-dark)" : "var(--pm-red-dark)";
            const prefix = inflow ? "+" : "-";
            const tagStyle = tx.tag ? getTagStyle(tx.tag) : null;

            return (
              <div
                key={tx.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 20px",
                  borderBottom: "0.5px solid var(--pm-gray-border)",
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    backgroundColor: dotColor,
                    flexShrink: 0,
                    alignSelf: "flex-start",
                    marginTop: 5,
                  }}
                />

                {/* Left: name + date + tag */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--pm-ink)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tx.name}
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: "var(--pm-gray-text)",
                      marginTop: 1,
                    }}
                  >
                    {formatDate(tx.date)}
                  </p>
                  {tagStyle && tx.tag && (
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: 3,
                        fontSize: 9,
                        fontWeight: 500,
                        padding: "1px 6px",
                        borderRadius: 4,
                        backgroundColor: tagStyle.bg,
                        color: tagStyle.text,
                      }}
                    >
                      {tx.tag}
                    </span>
                  )}
                </div>

                {/* Right: amount + source */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: amountColor,
                    }}
                  >
                    {prefix}
                    {formatCurrency(tx.amount, currency)}
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: "var(--pm-gray-text)",
                      marginTop: 1,
                    }}
                  >
                    {typeLabel[tx.type]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
