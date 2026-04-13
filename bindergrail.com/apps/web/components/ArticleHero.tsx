const TAG_COLORS = {
  Market: { bg: "#FAEEDA", text: "#633806" },
  Advice: { bg: "#EAF3DE", text: "#27500A" },
  News:   { bg: "#E8E0D0", text: "#5F5E5A" },
};

type Props = {
  title: string;
  tag: "Market" | "Advice" | "News";
  date: string;
};

export default function ArticleHero({ title, tag, date }: Props) {
  const colors = TAG_COLORS[tag] ?? TAG_COLORS.News;
  return (
    <div
      style={{
        background: "#1A1814",
        borderRadius: "10px",
        padding: "32px 28px",
        marginBottom: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grain overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
        }}
      />
      <span
        style={{
          display: "inline-block",
          background: colors.bg,
          color: colors.text,
          fontSize: "10px",
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "3px 9px",
          borderRadius: "3px",
          marginBottom: "14px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {tag}
      </span>
      <h1
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: "clamp(22px, 4vw, 34px)",
          fontWeight: 900,
          color: "#F5F0E8",
          lineHeight: 1.15,
          letterSpacing: "-0.025em",
          position: "relative",
          zIndex: 1,
          margin: "0 0 12px 0",
        }}
      >
        {title}
      </h1>
      <div
        style={{
          fontFamily: '"DM Sans", Arial, sans-serif',
          fontSize: "12px",
          fontWeight: 300,
          color: "#5F5850",
          position: "relative",
          zIndex: 1,
        }}
      >
        {date}
      </div>
    </div>
  );
}
