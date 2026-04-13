export default function OriginsScreenshotStrip() {
  return (
    <section style={{ backgroundColor: "#E8E4DC", padding: "24px 0 28px" }}>
      {/* Label */}
      <p
        style={{
          fontSize: 9,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "#B4B2A9",
          paddingLeft: 24,
          marginBottom: 14,
        }}
      >
        App preview · scroll to see more
      </p>

      {/* Scroll container */}
      <div
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 10,
          scrollbarWidth: "thin",
          scrollbarColor: "#B07035 #D8D0C0",
        }}
      >
        {/* ── FRAME 1: Desktop browser ─────────────────────────── */}
        <div
          style={{
            flexShrink: 0,
            backgroundColor: "#2C2A22",
            borderRadius: 10,
            padding: "8px 8px 5px",
            width: 290,
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#E24B4A" }} />
            <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#EF9F27" }} />
            <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#639922" }} />
          </div>

          {/* Screen */}
          <div style={{ backgroundColor: "#F5F0E8", borderRadius: 6, overflow: "hidden" }}>
            {/* Nav */}
            <div
              style={{
                backgroundColor: "#E8E4DC",
                borderBottom: "1px solid #C8C0B0",
                padding: "5px 10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontWeight: 700,
                  fontStyle: "italic",
                  fontSize: 10,
                  color: "#B07035",
                }}
              >
                Origins
              </span>
              <span
                style={{
                  fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                  fontSize: 6,
                  color: "#B4B2A9",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                a Binder Grail app
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: 10 }}>
              {/* Stats row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 5,
                  marginBottom: 8,
                }}
              >
                {[
                  { label: "Cards", value: "147", valueColor: "#2C2A22" },
                  { label: "Value", value: "$2,840", valueColor: "#B07035" },
                  { label: "Graded", value: "12", valueColor: "#2C2A22" },
                ].map(({ label, value, valueColor }) => (
                  <div
                    key={label}
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #D8D0C0",
                      borderRadius: 4,
                      padding: 5,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 6,
                        color: "#B4B2A9",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 2,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        fontWeight: 700,
                        fontSize: 12,
                        color: valueColor,
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Card list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { name: "Charizard ex SAR", set: "Obsidian Flames", badge: "NM", badgeBg: "#EAF0EB", badgeColor: "#3D5C42", price: "$38" },
                  { name: "Greninja ex SIR", set: "Twilight Masquerade", badge: "PSA 10", badgeBg: "#E8F0D8", badgeColor: "#2A4230", price: "$210" },
                  { name: "Moonbreon VMAX AA", set: "Evolving Skies", badge: "NM", badgeBg: "#EAF0EB", badgeColor: "#3D5C42", price: "$185" },
                ].map(({ name, set, badge, badgeBg, badgeColor, price }) => (
                  <div
                    key={name}
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #D8D0C0",
                      borderRadius: 4,
                      padding: "5px 8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 7, fontWeight: 600, color: "#2C2A22", marginBottom: 1 }}>{name}</div>
                      <div style={{ fontSize: 6, color: "#B4B2A9" }}>{set}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span
                        style={{
                          fontSize: 6,
                          fontWeight: 600,
                          backgroundColor: badgeBg,
                          color: badgeColor,
                          borderRadius: 3,
                          padding: "1px 4px",
                        }}
                      >
                        {badge}
                      </span>
                      <span style={{ fontSize: 7, fontWeight: 700, color: "#2C2A22" }}>{price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FRAME 2: Mobile — collection list ───────────────── */}
        <div
          style={{
            flexShrink: 0,
            backgroundColor: "#2C2A22",
            borderRadius: 16,
            padding: "6px 5px 5px",
            width: 110,
          }}
        >
          {/* Notch */}
          <div
            style={{
              width: 30,
              height: 4,
              backgroundColor: "#1A1814",
              borderRadius: 2,
              margin: "0 auto 5px",
            }}
          />
          {/* Screen */}
          <div style={{ backgroundColor: "#E8E4DC", borderRadius: 10, overflow: "hidden" }}>
            {/* Nav */}
            <div
              style={{
                backgroundColor: "#E8E4DC",
                borderBottom: "1px solid #C8C0B0",
                padding: "6px 8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 8,
                  color: "#B07035",
                  fontWeight: 700,
                }}
              >
                Origins
              </span>
              <div style={{ display: "flex", gap: 2 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "#B4B2A9" }} />
                ))}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: 8 }}>
              {/* Search bar */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D8D0C0",
                  borderRadius: 4,
                  padding: "4px 6px",
                  fontSize: 7,
                  color: "#B4B2A9",
                  marginBottom: 8,
                }}
              >
                Search cards...
              </div>

              {/* Card rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 7 }}>
                {[
                  { accentColor: "#B07035", num: "025", set: "Obsidian Flames", name: "Charizard ex SAR", price: "$38.00" },
                  { accentColor: "#3D5C42", num: "064", set: "Twilight Masquerade", name: "Greninja ex SIR", price: "$210.00" },
                ].map(({ accentColor, num, set, name, price }) => (
                  <div
                    key={name}
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #D8D0C0",
                      borderRadius: 5,
                      padding: 6,
                      display: "flex",
                      gap: 5,
                      alignItems: "stretch",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {/* Accent bar */}
                    <div
                      style={{
                        width: 3,
                        flexShrink: 0,
                        backgroundColor: accentColor,
                        borderRadius: 2,
                        alignSelf: "stretch",
                        minHeight: 36,
                      }}
                    />
                    {/* Faded number */}
                    <div
                      style={{
                        position: "absolute",
                        right: 6,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        fontSize: 14,
                        color: "#E8E4DC",
                        fontWeight: 700,
                        pointerEvents: "none",
                      }}
                    >
                      {num}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 6,
                          color: "#B4B2A9",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: 2,
                        }}
                      >
                        {set}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-playfair), Georgia, serif",
                          fontSize: 8,
                          fontWeight: 700,
                          color: "#2C2A22",
                          marginBottom: 2,
                          lineHeight: 1.2,
                        }}
                      >
                        {name}
                      </div>
                      <div style={{ fontSize: 7, color: "#B07035", fontWeight: 600 }}>{price}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary block */}
              <div
                style={{
                  backgroundColor: "#2C2A22",
                  borderRadius: 5,
                  padding: 6,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                {[
                  { label: "Total cards", value: "147", valueColor: "#F5F0E8" },
                  { label: "Total value", value: "$2,840", valueColor: "#B07035" },
                ].map(({ label, value, valueColor }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 6, color: "#5F5850" }}>{label}</span>
                    <span style={{ fontSize: 6, color: valueColor, fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FRAME 3: Mobile — add card screen ───────────────── */}
        <div
          style={{
            flexShrink: 0,
            backgroundColor: "#2C2A22",
            borderRadius: 16,
            padding: "6px 5px 5px",
            width: 110,
          }}
        >
          {/* Notch */}
          <div
            style={{
              width: 30,
              height: 4,
              backgroundColor: "#1A1814",
              borderRadius: 2,
              margin: "0 auto 5px",
            }}
          />
          {/* Screen */}
          <div style={{ backgroundColor: "#F5F0E8", borderRadius: 10, overflow: "hidden" }}>
            {/* Nav */}
            <div
              style={{
                backgroundColor: "#E8E4DC",
                borderBottom: "1px solid #C8C0B0",
                padding: "6px 8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 8,
                  color: "#B07035",
                  fontWeight: 700,
                }}
              >
                Origins
              </span>
              <span style={{ fontSize: 7, color: "#B07035", fontWeight: 600 }}>Add card</span>
            </div>

            {/* Body */}
            <div style={{ padding: 8 }}>
              {/* Section label */}
              <div
                style={{
                  fontSize: 7,
                  fontWeight: 500,
                  color: "#7A6E5F",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                Add to collection
              </div>

              {/* Search input */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D8D0C0",
                  borderRadius: 4,
                  padding: "4px 6px",
                  fontSize: 7,
                  color: "#B4B2A9",
                  marginBottom: 5,
                }}
              >
                Search card name...
              </div>

              {/* Condition selector */}
              <div style={{ marginBottom: 5 }}>
                <div
                  style={{
                    fontSize: 6,
                    color: "#B4B2A9",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 2,
                  }}
                >
                  Condition
                </div>
                <div style={{ display: "flex", gap: 3 }}>
                  {[
                    { label: "NM", selected: true },
                    { label: "LP", selected: false },
                    { label: "MP", selected: false },
                  ].map(({ label, selected }) => (
                    <div
                      key={label}
                      style={{
                        fontSize: 6,
                        fontWeight: 600,
                        padding: "2px 5px",
                        borderRadius: 3,
                        backgroundColor: selected ? "#1A1814" : "#E8E4DC",
                        color: selected ? "#F5F0E8" : "#7A6E5F",
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price input */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D8D0C0",
                  borderRadius: 4,
                  padding: "4px 6px",
                  fontSize: 7,
                  color: "#B4B2A9",
                  marginBottom: 8,
                }}
              >
                Price paid: $
              </div>

              {/* Submit */}
              <div
                style={{
                  backgroundColor: "#B07035",
                  color: "#F5F0E8",
                  borderRadius: 4,
                  padding: "5px 0",
                  fontSize: 7,
                  fontWeight: 500,
                  textAlign: "center",
                  width: "100%",
                }}
              >
                Add to collection
              </div>
            </div>
          </div>
        </div>

        {/* ── PLACEHOLDER SLOT ─────────────────────────────────── */}
        {/* SCREENSHOT PLACEHOLDER
            To add a real screenshot:
            1. Save image to public/images/apps/origins-screen-1.jpg
            2. Replace this placeholder div with:
               <div style={{ flexShrink: 0, width: 110 }}>
                 <div style={{ background: '#2C2A22', borderRadius: 16, padding: '6px 5px 5px' }}>
                   <div style={{ width: 30, height: 4, background: '#1A1814', borderRadius: 2, margin: '0 auto 5px' }} />
                   <img src="/images/apps/origins-screen-1.jpg" style={{ borderRadius: 10, width: '100%' }} />
                 </div>
               </div>
            3. Repeat for each additional screenshot, incrementing the filename
        */}
        <div
          style={{
            flexShrink: 0,
            width: 90,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "2px dashed #C8C0B0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              color: "#C8C0B0",
              fontWeight: 300,
            }}
          >
            +
          </div>
          <p
            style={{
              fontSize: 9,
              color: "#B4B2A9",
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            Your screenshots go here
          </p>
        </div>
      </div>
    </section>
  );
}
