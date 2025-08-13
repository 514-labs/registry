"use server";

const REPO = "514-labs/connector-factory";
const revalidateSeconds = 60 * 30; // 30 minutes

export async function getGithubStars(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      next: { revalidate: revalidateSeconds },
      headers: {
        Accept: "application/vnd.github+json",
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}


