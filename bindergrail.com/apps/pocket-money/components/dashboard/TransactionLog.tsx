"use client";

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

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function groupByMonth(transactions: Transaction[]): [string, Transaction[]][] {
  const groups = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const key = tx.date.slice(0, 7); // "YYYY-MM"
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(tx);
  }
  // Sort descending
  return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
}

function monthLabel(key: string) {
  const [year, month] = key.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

const isInflow = (type: Transaction["type"]) => type === "return" || type === "sale";

export default function TransactionLog({
  transactions,
  currency,
}: TransactionLogProps) {
  if (transactions.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: "24px 16px",
          textAlign: "center",
          border: "1px solid var(--pm-gray-border)",
        }}
      >
        <p
          style={{
            fontSize: 14,
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
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {groups.map(([monthKey, txs]) => (
        <div key={monthKey}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--pm-gray-text)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}
          >
            {monthLabel(monthKey)}
          </p>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid var(--pm-gray-border)",
            }}
          >
            {txs.map((tx, i) => {
              const inflow = isInflow(tx.type);
              const dotColor = inflow
                ? "var(--pm-green-mid)"
                : "var(--pm-red-mid)";
              const amountColor = inflow
                ? "var(--pm-green-dark)"
                : "var(--pm-red-mid)";

              return (
                <div
                  key={tx.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 14px",
                    borderTop: i > 0 ? "1px solid var(--pm-gray-border)" : undefined,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: dotColor,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--pm-ink)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {tx.name}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--pm-gray-text)" }}>
                      {formatDate(tx.date)}
                      {tx.tag && ` · ${tx.tag}`}
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: amountColor,
                      flexShrink: 0,
                    }}
                  >
                    {inflow ? "+" : "-"}
                    {formatCurrency(tx.amount, currency)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
