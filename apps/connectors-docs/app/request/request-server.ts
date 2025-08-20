"use server";

import { z } from "zod";

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

type Input = z.infer<typeof schema>;

type Result = { ok: true; issueUrl?: string } | { ok: false; error?: string };

export async function requestConnector(input: Input): Promise<Result> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };

  const { identifier, name, category, tags, description, homepage } =
    parsed.data;

  const owner = "514-labs";
  const repo = "factory";
  const token = (process.env.GITHUB_PAT ?? "").trim();

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

  // If no token, we cannot create the issue server-side. Return a client-side fallback link.
  if (!token) {
    const url = new URL(`https://github.com/${owner}/${repo}/issues/new`);
    url.searchParams.set("title", title);
    url.searchParams.set("body", bodyLines.join("\n"));
    return { ok: true, issueUrl: url.toString() };
  }

  // Try to search for an existing issue with same title to avoid duplicates
  try {
    const searchUrl = new URL("https://api.github.com/search/issues");
    const q = `repo:${owner}/${repo} type:issue in:title "${title.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
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
      if (match) return { ok: true, issueUrl: match.html_url };
    }
  } catch {}

  // Create new issue
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
      return {
        ok: false,
        error: `GitHub error: ${res.status} ${res.statusText} - ${text}`,
      };
    }
    const data = (await res.json()) as { html_url?: string };
    return { ok: true, issueUrl: data.html_url };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
