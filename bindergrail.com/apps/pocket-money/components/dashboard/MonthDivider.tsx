interface MonthDividerProps {
  label: string;
}

export default function MonthDivider({ label }: MonthDividerProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--pm-gray-bg)",
        borderBottom: "0.5px solid var(--pm-gray-border)",
        padding: "10px 20px 2px",
      }}
    >
      <p
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "var(--pm-gray-text)",
        }}
      >
        {label}
      </p>
    </div>
  );
}
