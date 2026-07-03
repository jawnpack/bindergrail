const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM =
  process.env.RESEND_FROM ?? "Binder Grail <hello@bindergrail.com>";

function isConfigured() {
  return Boolean(RESEND_API_KEY);
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!isConfigured()) {
    console.warn("Resend not configured, skipping email:", subject);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: RESEND_FROM, to: [to], subject, html }),
  });
  if (!res.ok) {
    console.error("Resend send failed:", res.status, await res.text());
  }
}

export async function sendWaitlistConfirmation(email: string) {
  const html = `
  <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #1A1814;">
    <p style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #B07035; margin-bottom: 16px;">Binder Grail</p>
    <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">You're on the Origins waitlist.</h1>
    <p style="font-size: 15px; line-height: 1.7; color: #444;">
      Origins is the collection tracker from Binder Grail. Log every card you own,
      track condition and price paid, and see what your binder is actually worth.
    </p>
    <p style="font-size: 15px; line-height: 1.7; color: #444;">
      We'll email you the moment it launches. That's the only reason we'll use this address.
    </p>
    <p style="font-size: 13px; line-height: 1.6; color: #7A7468; margin-top: 28px;">
      In the meantime, our free newsletter Common Rare covers the Pok&eacute;mon TCG market every week:
      <a href="https://commonrare.bindergrail.com" style="color: #B07035;">commonrare.bindergrail.com</a>
    </p>
  </div>`;
  await sendEmail(email, "You're on the Origins waitlist", html);
}
