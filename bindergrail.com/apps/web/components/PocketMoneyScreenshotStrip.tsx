export default function PocketMoneyScreenshotStrip() {
  return (
    <section style={{ backgroundColor: "#EAF0EB", padding: "24px 0 28px" }}>
      {/* Label */}
      <p
        style={{
          fontSize: 9,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "#6A9470",
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
          scrollbarColor: "#3D5C42 #C8D8CA",
        }}
      >
        {/* ── FRAME 1: Desktop browser ─────────────────────────── */}
        <div
          style={{
            flexShrink: 0,
            backgroundColor: "#2A4230",
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
                backgroundColor: "#3D5C42",
                padding: "5px 10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: 10,
                  color: "#F5F0E8",
                }}
              >
                Pocket <span style={{ color: "#B0D4B8" }}>Money</span>
              </span>
              <span
                style={{
                  fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                  fontSize: 6,
                  color: "#6A9470",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                a Binder Grail app
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: 10, backgroundColor: "#F5F0E8" }}>
              {/* Stats row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 5,
                  marginBottom: 6,
                }}
              >
                {[
                  { label: "Spent", value: "$184", valueColor: "#2C2A22" },
                  { label: "Remaining", value: "$116", valueColor: "#3D5C42" },
                  { label: "Budget", value: "$300", valueColor: "#2C2A22" },
                ].map(({ label, value, valueColor }) => (
                  <div
                    key={label}
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #C8D8CA",
                      borderRadius: 4,
                      padding: 5,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 6,
                        color: "#8AAE90",
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

              {/* Budget bar card */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #C8D8CA",
                  borderRadius: 4,
                  padding: "7px 8px",
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 7, fontWeight: 500, color: "#2A4230" }}>April 2026</span>
                  <span style={{ fontSize: 7, color: "#3D5C42", fontWeight: 600 }}>61%</span>
                </div>
                {/* Track */}
                <div
                  style={{
                    backgroundColor: "#EAF0EB",
                    height: 5,
                    borderRadius: 3,
                    overflow: "hidden",
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#3D5C42",
                      height: "100%",
                      width: "61%",
                      borderRadius: 3,
                    }}
                  />
                </div>
                <div style={{ fontSize: 6, color: "#8AAE90" }}>
                  Packs $80 · Singles $64 · Sealed $40
                </div>
              </div>

              {/* Entry list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { name: "Obsidian Flames booster box", date: "Apr 6", pill: "SEALED", amount: "$160" },
                  { name: "Greninja ex SIR raw", date: "Apr 3", pill: "SINGLES", amount: "$24" },
                ].map(({ name, date, pill, amount }) => (
                  <div
                    key={name}
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #C8D8CA",
                      borderRadius: 3,
                      padding: "4px 8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 7, fontWeight: 500, color: "#2A4230", marginBottom: 1 }}>{name}</div>
                      <div style={{ fontSize: 6, color: "#8AAE90" }}>{date}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span
                        style={{
                          fontSize: 6,
                          fontWeight: 600,
                          backgroundColor: "#EAF0EB",
                          color: "#3D5C42",
                          borderRadius: 3,
                          padding: "1px 4px",
                          textTransform: "uppercase",
                        }}
                      >
                        {pill}
                      </span>
                      <span style={{ fontSize: 8, fontWeight: 600, color: "#3D5C42" }}>{amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FRAME 2: Mobile — dashboard ──────────────────────── */}
        <div
          style={{
            flexShrink: 0,
            backgroundColor: "#2A4230",
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
              backgroundColor: "#1A2E1E",
              borderRadius: 2,
              margin: "0 auto 5px",
            }}
          />
          {/* Screen */}
          <div style={{ backgroundColor: "#F5F0E8", borderRadius: 10, overflow: "hidden" }}>
            {/* Nav */}
            <div
              style={{
                backgroundColor: "#3D5C42",
                padding: "6px 8px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: 8,
                  color: "#F5F0E8",
                }}
              >
                Pocket <span style={{ color: "#B0D4B8" }}>Money</span>
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: 8, backgroundColor: "#F5F0E8" }}>
              {/* Month label */}
              <div
                style={{
                  fontSize: 6,
                  fontWeight: 500,
                  color: "#6A9470",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                April 2026
              </div>
              {/* Big number */}
              <div
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#3D5C42",
                  marginBottom: 2,
                }}
              >
                $184
              </div>
              {/* Sub */}
              <div style={{ fontSize: 7, color: "#8AAE90", marginBottom: 8 }}>
                of $300 budget · 61%
              </div>
              {/* Budget bar */}
              <div
                style={{
                  backgroundColor: "#EAF0EB",
                  height: 6,
                  borderRadius: 3,
                  overflow: "hidden",
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    backgroundColor: "#3D5C42",
                    height: "100%",
                    width: "61%",
                    borderRadius: 3,
                  }}
                />
              </div>

              {/* Entry rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { name: "Booster box", category: "Sealed", amount: "$160" },
                  { name: "Singles", category: "Singles", amount: "$24" },
                ].map(({ name, category, amount }) => (
                  <div
                    key={name}
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #C8D8CA",
                      borderRadius: 4,
                      padding: "5px 6px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 7, color: "#2A4230", marginBottom: 1 }}>{name}</div>
                      <div style={{ fontSize: 6, color: "#8AAE90" }}>{category}</div>
                    </div>
                    <span style={{ fontSize: 8, fontWeight: 600, color: "#3D5C42" }}>{amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FRAME 3: Mobile — log purchase screen ────────────── */}
        <div
          style={{
            flexShrink: 0,
            backgroundColor: "#2A4230",
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
              backgroundColor: "#1A2E1E",
              borderRadius: 2,
              margin: "0 auto 5px",
            }}
          />
          {/* Screen */}
          <div style={{ backgroundColor: "#F5F0E8", borderRadius: 10, overflow: "hidden" }}>
            {/* Nav */}
            <div
              style={{
                backgroundColor: "#3D5C42",
                padding: "6px 8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-dm-sans), Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: 8,
                  color: "#F5F0E8",
                }}
              >
                Pocket <span style={{ color: "#B0D4B8" }}>Money</span>
              </span>
              <span style={{ fontSize: 7, color: "#B0D4B8", fontWeight: 500 }}>+ Log</span>
            </div>

            {/* Body */}
            <div style={{ padding: 8, backgroundColor: "#F5F0E8" }}>
              {/* Section label */}
              <div
                style={{
                  fontSize: 7,
                  fontWeight: 500,
                  color: "#6A9470",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                Log a purchase
              </div>

              {/* Description input */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #C8D8CA",
                  borderRadius: 4,
                  padding: "4px 6px",
                  fontSize: 7,
                  color: "#B4B2A9",
                  marginBottom: 5,
                }}
              >
                Description...
              </div>

              {/* Amount input */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #C8D8CA",
                  borderRadius: 4,
                  padding: "4px 6px",
                  fontSize: 7,
                  color: "#B4B2A9",
                  marginBottom: 5,
                }}
              >
                Amount: $
              </div>

              {/* Category selector */}
              <div style={{ marginBottom: 8 }}>
                <div
                  style={{
                    fontSize: 6,
                    color: "#8AAE90",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 3,
                  }}
                >
                  Category
                </div>
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  {[
                    { label: "Packs", selected: true },
                    { label: "Singles", selected: false },
                    { label: "Sealed", selected: false },
                  ].map(({ label, selected }) => (
                    <div
                      key={label}
                      style={{
                        fontSize: 6,
                        fontWeight: 600,
                        padding: "2px 5px",
                        borderRadius: 3,
                        backgroundColor: selected ? "#3D5C42" : "#EAF0EB",
                        color: selected ? "#F5F0E8" : "#3D5C42",
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div
                style={{
                  backgroundColor: "#3D5C42",
                  color: "#F5F0E8",
                  borderRadius: 4,
                  padding: "5px 0",
                  fontSize: 7,
                  fontWeight: 500,
                  textAlign: "center",
                  width: "100%",
                }}
              >
                Log purchase
              </div>
            </div>
          </div>
        </div>

        {/* ── PLACEHOLDER SLOT ─────────────────────────────────── */}
        {/* SCREENSHOT PLACEHOLDER
            To add a real screenshot:
            1. Save image to public/images/apps/pocket-money-screen-1.jpg
            2. Replace this placeholder div with:
               <div style={{ flexShrink: 0, width: 110 }}>
                 <div style={{ background: '#2A4230', borderRadius: 16, padding: '6px 5px 5px' }}>
                   <div style={{ width: 30, height: 4, background: '#1A2E1E', borderRadius: 2, margin: '0 auto 5px' }} />
                   <img src="/images/apps/pocket-money-screen-1.jpg" style={{ borderRadius: 10, width: '100%' }} />
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
              border: "2px dashed #C8D8CA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              color: "#C8D8CA",
              fontWeight: 300,
            }}
          >
            +
          </div>
          <p
            style={{
              fontSize: 9,
              color: "#8AAE90",
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
