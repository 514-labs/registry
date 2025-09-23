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

// ----------------------------------------
// Connector request issue helpers
// ----------------------------------------

export type ConnectorRequest = {
  identifier: string;
  name: string;
  category: string;
  tags: string[];
  homepage: string;
  description: string;
  issueUrl: string;
};

function safeParseConnectorRequestFromBody(
  body: string
): Omit<ConnectorRequest, "issueUrl"> | null {
  try {
    // Expect a fenced JSON block between our markers
    const start = body.indexOf("<!-- connector-request:start -->");
    const end = body.indexOf("<!-- connector-request:end -->");
    if (start === -1 || end === -1 || end <= start) return null;
    const between = body.slice(start, end);
    const fenceStart = between.indexOf("```json");
    if (fenceStart === -1) return null;
    const afterFence = between.slice(fenceStart + "```json".length);
    const fenceEnd = afterFence.indexOf("```");
    if (fenceEnd === -1) return null;
    const jsonText = afterFence.slice(0, fenceEnd).trim();
    const parsed = JSON.parse(jsonText) as any;
    if (parsed && parsed.kind === "connector-request") {
      const identifier = String(parsed.identifier || "").trim();
      const name = String(parsed.name || "").trim();
      const category = String(parsed.category || "").trim();
      const homepage = String(parsed.homepage || "").trim();
      const description = String(parsed.description || "").trim();
      const tags: string[] = Array.isArray(parsed.tags)
        ? parsed.tags
            .map((t: unknown) => String(t || "").trim())
            .filter(Boolean)
        : [];
      if (!identifier || !name || !category || !homepage) return null;
      return { identifier, name, category, tags, homepage, description };
    }
  } catch {}
  return null;
}

export async function listConnectorRequestsFromIssues(options?: {
  owner?: string;
  repo?: string;
  token?: string;
  state?: "open" | "closed" | "all";
}): Promise<ConnectorRequest[]> {
  const owner = (
    options?.owner ??
    process.env.CONNECTOR_REQUESTS_OWNER ??
    "514-labs"
  ).trim();
  // Default to "registry" repo (connector requests are filed there now)
  const repo = (
    options?.repo ??
    process.env.CONNECTOR_REQUESTS_REPO ??
    "registry"
  ).trim();
  const token = (options?.token ?? process.env.GITHUB_PAT ?? "").trim();
  const state = options?.state ?? "open";

  // Search by a title prefix for efficiency and then fetch bodies
  // We use pagination with a reasonable upper bound
  const results: ConnectorRequest[] = [];
  let page = 1;
  const perPage = 50;
  for (let i = 0; i < 5; i += 1) {
    const searchUrl = new URL("https://api.github.com/search/issues");
    const q = `repo:${owner}/${repo} type:issue in:title "Connector request:" state:${state}`;
    searchUrl.searchParams.set("q", q);
    searchUrl.searchParams.set("per_page", String(perPage));
    searchUrl.searchParams.set("page", String(page));
    const searchRes = await fetch(searchUrl.toString(), {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (!searchRes.ok) break;
    const data = (await searchRes.json()) as {
      items?: Array<{
        html_url: string;
        number: number;
        title: string;
        state: string;
      }>;
      total_count?: number;
    };
    const items = data.items ?? [];
    if (items.length === 0) break;

    // Fetch each issue to get the full body
    const pageResults = await Promise.all(
      items.map(async (item) => {
        const parsed = parseIssueUrl(item.html_url);
        if (!parsed) return null;
        const issueRes = await fetch(
          `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/issues/${parsed.issueNumber}`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        if (!issueRes.ok) return null;
        const issue = (await issueRes.json()) as {
          body?: string;
          html_url?: string;
          state?: string;
        };
        if ((issue.state ?? "").toLowerCase() !== "open") return null;
        const parsedBody = safeParseConnectorRequestFromBody(issue.body ?? "");
        if (!parsedBody) return null;
        return { ...parsedBody, issueUrl: issue.html_url ?? item.html_url };
      })
    );
    for (const r of pageResults) if (r) results.push(r);
    if (items.length < perPage) break;
    page += 1;
  }

  // Deduplicate by identifier (keep first occurrence)
  const dedupedMap = new Map<string, ConnectorRequest>();
  for (const r of results) {
    if (!dedupedMap.has(r.identifier)) dedupedMap.set(r.identifier, r);
  }
  return Array.from(dedupedMap.values());
}
