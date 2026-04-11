import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getIssue } from "@/lib/beehiiv";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify the user is authenticated before returning full content
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const issue = await getIssue(id);

  if (!issue) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  return NextResponse.json(issue);
}
