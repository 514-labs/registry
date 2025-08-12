import { NextResponse } from "next/server";

const REPO = "514-labs/connector-factory";

// Next.js requires a numeric literal for this segment config
export const revalidate = 1800; // 30 minutes ISR caching for route handlers

export async function GET() {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      // Leverage Vercel/Next fetch caching; Next will cache per revalidate
      next: { revalidate },
      headers: {
        // Hint to GitHub for appropriate API version
        Accept: "application/vnd.github+json",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ stars: null }, { status: 200 });
    }

    const data = (await res.json()) as { stargazers_count?: number };
    const stars = typeof data.stargazers_count === "number" ? data.stargazers_count : null;
    return NextResponse.json({ stars }, { status: 200 });
  } catch {
    return NextResponse.json({ stars: null }, { status: 200 });
  }
}


