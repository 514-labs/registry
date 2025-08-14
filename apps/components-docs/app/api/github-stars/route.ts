import { NextResponse } from "next/server";

const REPO = "514-labs/connector-factory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      next: { revalidate: 900 }, // 15 minutes server cache
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return NextResponse.json({ stars: null }, { status: 200 });
    const data = (await res.json()) as { stargazers_count?: number };
    return NextResponse.json({ stars: data.stargazers_count ?? null });
  } catch {
    return NextResponse.json({ stars: null }, { status: 200 });
  }
}


