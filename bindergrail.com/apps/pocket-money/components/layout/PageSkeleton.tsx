// Instant navigation shell for the signed-in routes, shown while the server
// fetches. Mirrors the real chrome — the 48px ink topbar and the gray page —
// so the swap to real content doesn't jump. Pulse respects reduced motion.
export default function PageSkeleton({ blocks = 3 }: { blocks?: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      style={{ minHeight: "100vh", backgroundColor: "var(--pm-gray-bg)" }}
    >
      <div style={{ height: 48, backgroundColor: "var(--pm-ink)" }} />
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {Array.from({ length: blocks }, (_, i) => (
          <div
            key={i}
            className="pm-skeleton"
            style={{
              height: i === 0 ? 120 : 88,
              borderRadius: 12,
              backgroundColor: "var(--pm-white)",
              border: "0.5px solid var(--pm-gray-border)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
