import type { ProviderMeta } from "./types";

type ParsedIssueUrl = {
  owner: string;
  repo: string;
  issueNumber: number;
};

export function parseIssueUrl(issueUrl: string): ParsedIssueUrl | undefined {
  try {
    const url = new URL(issueUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    // Expected: /{owner}/{repo}/issues/{number}
    const issuesIndex = parts.indexOf("issues");
    if (issuesIndex === -1 || issuesIndex + 1 >= parts.length) return undefined;
    const owner = parts[0];
    const repo = parts[1];
    const issueNumber = Number(parts[issuesIndex + 1]);
    if (!owner || !repo || !Number.isFinite(issueNumber)) return undefined;
    return { owner, repo, issueNumber };
  } catch {
    return undefined;
  }
}

export async function getIssueThumbsUpCountFromUrl(
  issueUrl: string,
  options?: { token?: string }
): Promise<number> {
  const parsed = parseIssueUrl(issueUrl);
  if (!parsed) return 0;

  const token = (options?.token ?? process.env.GITHUB_PAT ?? "").trim();
  const res = await fetch(
    `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/issues/${parsed.issueNumber}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!res.ok) return 0;
  const data = (await res.json()) as { reactions?: Record<string, number> };
  return data.reactions?.["+1"] ?? 0;
}

export async function getIssueThumbsUpCountFromMeta(
  providerMeta: ProviderMeta | undefined,
  language: string,
  options?: { token?: string }
): Promise<number> {
  const url = providerMeta?.issues?.[language];
  if (!url) return 0;
  return getIssueThumbsUpCountFromUrl(url, options);
}


