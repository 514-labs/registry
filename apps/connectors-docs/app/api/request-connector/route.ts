import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";

const schema = z.object({
  identifier: z
    .string()
    .trim()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(2).max(100),
  category: z.string().trim().min(2).max(50),
  tags: z.string().trim().optional(),
  description: z.string().trim().min(10).max(500),
  homepage: z.string().trim().url(),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "invalid-input" },
      { status: 400 }
    );
  }

  const { identifier, name, category, tags, description, homepage } =
    parsed.data;

  const owner = "514-labs";
  const repo = "factory";

  const session = await auth();
  const token = (
    (session as any)?.accessToken ??
    process.env.GITHUB_PAT ??
    ""
  ).trim();

  const title = `Connector request: ${name} (${identifier})`;
  const bodyLines: string[] = [];
  bodyLines.push(`Identifier: ${identifier}`);
  bodyLines.push(`Name: ${name}`);
  bodyLines.push(`Category: ${category}`);
  if (tags && tags.trim()) bodyLines.push(`Tags: ${tags}`);
  bodyLines.push(`Homepage: ${homepage}`);
  bodyLines.push("");
  bodyLines.push("Description:");
  bodyLines.push(description);

  if (!token) {
    // Require auth: client should invoke signIn("github")
    return Response.json(
      { ok: false, error: "auth-required" },
      { status: 401 }
    );
  }

  // Try to search for an existing issue with same title to avoid duplicates
  try {
    const searchUrl = new URL("https://api.github.com/search/issues");
    // Helper to robustly escape the title for GitHub search query
    function escapeGitHubSearchString(str: string): string {
      // Escape backslashes and double quotes, and wrap in double quotes
      // Also escape any control characters and normalize whitespace
      return (
        '"' +
        str
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"')
          .replace(/[\r\n\t]/g, " ")
          .replace(/\s+/g, " ")
          .trim() +
        '"'
      );
    }
    const q = `repo:${owner}/${repo} type:issue in:title ${escapeGitHubSearchString(title)}`;
    searchUrl.searchParams.set("q", q);
    const searchRes = await fetch(searchUrl.toString(), {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    });
    if (searchRes.ok) {
      const data = (await searchRes.json()) as {
        items?: Array<{ html_url: string; title: string }>;
      };
      const match = data.items?.find((i) => i.title === title);
      if (match) return Response.json({ ok: true, issueUrl: match.html_url });
    }
  } catch {}

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({ title, body: bodyLines.join("\n") }),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      return Response.json(
        {
          ok: false,
          error: `github-error: ${res.status} ${res.statusText} - ${text}`,
        },
        { status: 502 }
      );
    }
    const data = (await res.json()) as { html_url?: string };
    return Response.json({ ok: true, issueUrl: data.html_url });
  } catch (err) {
    return Response.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
