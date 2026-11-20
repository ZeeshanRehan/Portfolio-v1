// — GitHub contents API (server only)
// Publishing = committing content/essays/<slug>.mdx to the repo.
// Vercel sees the commit and redeploys the site (~1 minute).
//
// Env vars (set on Vercel):
//   GITHUB_TOKEN   fine-grained token with "Contents: Read and write" on this repo
//   GITHUB_REPO    optional, defaults to ZeeshanRehan/portfolio-v1
//   GITHUB_BRANCH  optional, defaults to main

import "server-only";

const ESSAYS_DIR = "content/essays";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is not set on the server.");
  }
  const repo = process.env.GITHUB_REPO || "ZeeshanRehan/portfolio-v1";
  const branch = process.env.GITHUB_BRANCH || "main";
  return { token, repo, branch };
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

function essayPath(slug: string): string {
  return `${ESSAYS_DIR}/${slug}.mdx`;
}

export type RemoteEssayFile = {
  slug: string;
  content: string;
  sha: string;
};

export async function listRemoteEssaySlugs(): Promise<string[]> {
  const { token, repo, branch } = getConfig();
  const url = `https://api.github.com/repos/${repo}/contents/${ESSAYS_DIR}?ref=${branch}`;
  const response = await fetch(url, { headers: headers(token), cache: "no-store" });

  if (response.status === 404) {
    return [];
  }
  if (!response.ok) {
    throw new Error(`GitHub list failed: ${response.status}`);
  }

  const items: { name: string; type: string }[] = await response.json();
  const slugs: string[] = [];
  for (const item of items) {
    if (item.type === "file" && item.name.endsWith(".mdx")) {
      slugs.push(item.name.replace(/\.mdx$/, ""));
    }
  }
  return slugs;
}

export async function getRemoteEssay(slug: string): Promise<RemoteEssayFile | null> {
  const { token, repo, branch } = getConfig();
  const url = `https://api.github.com/repos/${repo}/contents/${essayPath(slug)}?ref=${branch}`;
  const response = await fetch(url, { headers: headers(token), cache: "no-store" });

  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`GitHub read failed: ${response.status}`);
  }

  const data: { content: string; sha: string } = await response.json();
  const content = Buffer.from(data.content, "base64").toString("utf8");
  return { slug, content, sha: data.sha };
}

// sha = the current file's sha when updating, undefined when creating
export async function putRemoteEssay(
  slug: string,
  fileContent: string,
  message: string,
  sha?: string
): Promise<void> {
  const { token, repo, branch } = getConfig();
  const url = `https://api.github.com/repos/${repo}/contents/${essayPath(slug)}`;

  const body: Record<string, string> = {
    message,
    content: Buffer.from(fileContent, "utf8").toString("base64"),
    branch,
  };
  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub publish failed: ${response.status} ${text.slice(0, 200)}`);
  }
}

export async function deleteRemoteEssay(slug: string, sha: string): Promise<void> {
  const { token, repo, branch } = getConfig();
  const url = `https://api.github.com/repos/${repo}/contents/${essayPath(slug)}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: headers(token),
    body: JSON.stringify({ message: `essay: delete ${slug}`, sha, branch }),
  });

  if (!response.ok) {
    throw new Error(`GitHub delete failed: ${response.status}`);
  }
}
