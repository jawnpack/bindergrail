const BASE = "https://api.beehiiv.com/v2";
const PUB = process.env.BEEHIIV_PUBLICATION_ID!;
const KEY = process.env.BEEHIIV_API_KEY!;

// ─── Types ────────────────────────────────────────────────────────────────────

export type Issue = {
  id: string;
  title: string;
  subtitle: string;
  /** Unix timestamp (seconds) from Beehiiv */
  date: number;
  /** Chronological issue number — highest = most recent */
  number: number;
  tag: "Market" | "Advice" | "News";
};

export type IssueDetail = {
  id: string;
  title: string;
  date: number;
  /** Cleaned HTML content ready to render */
  content: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isConfigured() {
  return Boolean(process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function detectTag(post: any): Issue["tag"] {
  const desc: string =
    (post.meta_default_description ?? post.subtitle ?? post.preview_text ?? "").toLowerCase();
  if (desc.includes("advice") || desc.includes("tip")) return "Advice";
  if (desc.includes("news") || desc.includes("announc")) return "News";
  return "Market";
}

/** Strip Beehiiv navigation chrome from issue HTML */
function stripChrome(html: string): string {
  return html
    .replace(/<a[^>]*>[\s\S]*?unsubscribe[\s\S]*?<\/a>/gi, "")
    .replace(/<a[^>]*>[\s\S]*?view in browser[\s\S]*?<\/a>/gi, "")
    .replace(/Keep Reading[\s\S]*?$/i, "")
    .replace(/<a[^>]*>[\s\S]*?manage preferences[\s\S]*?<\/a>/gi, "")
    .replace(/<a[^>]*>[\s\S]*?privacy policy[\s\S]*?<\/a>/gi, "");
}

// ─── Newsletter API ───────────────────────────────────────────────────────────

/** Fetch paginated list of published issues, ordered newest first. */
export async function getIssues(): Promise<Issue[]> {
  if (!isConfigured()) return [];

  try {
    const res = await fetch(
      `${BASE}/publications/${PUB}/posts?status=confirmed&platform=both&limit=100&order_by=publish_date&direction=desc`,
      {
        headers: { Authorization: `Bearer ${KEY}` },
        next: { revalidate: 3600 }, // cache 1 hour
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const posts = data.data ?? [];

    return posts.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (post: any, index: number): Issue => ({
        id: post.id as string,
        title: post.title as string,
        subtitle: (post.subtitle ?? post.preview_text ?? "") as string,
        date: post.publish_date as number,
        number: posts.length - index, // highest number = most recent
        tag: detectTag(post),
      })
    );
  } catch {
    return [];
  }
}

/** Fetch full HTML content of a single issue. */
export async function getIssue(id: string): Promise<IssueDetail | null> {
  if (!isConfigured()) return null;

  try {
    const res = await fetch(
      `${BASE}/publications/${PUB}/posts/${id}?expand[]=free_email_content`,
      {
        headers: { Authorization: `Bearer ${KEY}` },
        next: { revalidate: 86400 }, // cache 24 hours
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const post = data.data;
    if (!post) return null;

    const rawHtml: string =
      post.free_email_content ?? post.content_html ?? post.content ?? "";

    return {
      id: post.id as string,
      title: post.title as string,
      date: post.publish_date as number,
      content: stripChrome(rawHtml),
    };
  } catch {
    return null;
  }
}

// ─── Subscription helpers ─────────────────────────────────────────────────────

export async function subscribeToBeehiiv(
  email: string,
  tag: string = "free"
): Promise<string | undefined> {
  const res = await fetch(`${BASE}/publications/${PUB}/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify({
      email,
      reactivate_existing: true,
      send_welcome_email: true,
      tags: [tag],
    }),
  });
  const data = await res.json();
  return data.data?.id as string | undefined;
}

export async function updateBeehiivTag(
  subscriberId: string,
  plan: "free" | "premium" | "premium_waitlist"
): Promise<void> {
  await fetch(`${BASE}/publications/${PUB}/subscriptions/${subscriberId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify({ tags: [plan] }),
  });
}

export async function unsubscribeFromBeehiiv(subscriberId: string): Promise<void> {
  await fetch(`${BASE}/publications/${PUB}/subscriptions/${subscriberId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify({ status: "inactive" }),
  });
}

export async function resubscribeToBeehiiv(subscriberId: string): Promise<void> {
  await fetch(`${BASE}/publications/${PUB}/subscriptions/${subscriberId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify({ status: "active" }),
  });
}
