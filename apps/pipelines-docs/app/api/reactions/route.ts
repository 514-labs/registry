import { NextResponse } from "next/server";
import { getIssuePositiveReactionsCountFromUrl } from "@workspace/registry";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { urls?: string[] };
    const urls = Array.from(new Set((body.urls ?? []).filter(Boolean)));
    const counts = await Promise.all(
      urls.map((u) => getIssuePositiveReactionsCountFromUrl(u))
    );
    const total = counts.reduce((a, b) => a + (b || 0), 0);
    return NextResponse.json({ total, counts, urls }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { total: 0, counts: [], urls: [] },
      { status: 200 }
    );
  }
}
