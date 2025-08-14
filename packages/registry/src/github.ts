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
  const data = (await res.json()) as {
    reactions?: Record<string, number>;
    state?: string;
  };
  // Ignore closed issues entirely
  if ((data.state ?? "").toLowerCase() !== "open") return 0;
  return data.reactions?.["+1"] ?? 0;
}

export async function getIssueThumbsUpCountFromMeta(
  providerMeta: ProviderMeta | undefined,
  language: string,
  implementation?: string,
  options?: { token?: string }
): Promise<number> {
  const value = providerMeta?.issues?.[language];
  // Do not use a default implementation; only count when an explicit implementation URL exists
  let url: string | undefined;
  if (value && typeof value === "object" && implementation) {
    url = value[implementation];
  }
  if (!url) return 0;
  return getIssueThumbsUpCountFromUrl(url, options);
}

export async function getIssuePositiveReactionsCountFromUrl(
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
  const data = (await res.json()) as {
    reactions?: Record<string, number>;
    state?: string;
  };
  // Ignore closed issues entirely
  if ((data.state ?? "").toLowerCase() !== "open") return 0;
  const thumbsUp = data.reactions?.["+1"] ?? 0;
  const hearts = data.reactions?.heart ?? 0;
  return thumbsUp + hearts;
}

export async function getIssuePositiveReactionsCountFromMeta(
  providerMeta: ProviderMeta | undefined,
  language: string,
  implementation?: string,
  options?: { token?: string }
): Promise<number> {
  const value = providerMeta?.issues?.[language];
  // Do not use a default implementation; only count when an explicit implementation URL exists
  let url: string | undefined;
  if (value && typeof value === "object" && implementation) {
    url = value[implementation];
  }
  if (!url) return 0;
  return getIssuePositiveReactionsCountFromUrl(url, options);
}

export async function getUserAvatar(
  username: string,
  options?: { token?: string }
): Promise<string | null> {
  if (!username?.trim()) return null;

  const token = (options?.token ?? process.env.GITHUB_PAT ?? "").trim();
  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { avatar_url?: string };
  return data.avatar_url ?? null;
}

export async function getOrganizationAvatar(
  org: string,
  options?: { token?: string }
): Promise<string | null> {
  if (!org?.trim()) return null;

  const token = (options?.token ?? process.env.GITHUB_PAT ?? "").trim();
  const res = await fetch(`https://api.github.com/orgs/${org}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { avatar_url?: string };
  return data.avatar_url ?? null;
}

export async function getAuthorAvatar(
  providerMeta: ProviderMeta | undefined,
  options?: { token?: string }
): Promise<string | null> {
  if (!providerMeta) return null;
  const override = providerMeta.avatarUrlOverride?.trim();
  if (override) return override;

  const author = providerMeta.author?.trim();
  if (!author) return null;

  const type = providerMeta.authorType;
  if (type === "organization") {
    return getOrganizationAvatar(author, options);
  }
  if (type === "user") {
    return getUserAvatar(author, options);
  }
  // Fallback: try user first, then org
  const asUser = await getUserAvatar(author, options);
  if (asUser) return asUser;
  return getOrganizationAvatar(author, options);
}
