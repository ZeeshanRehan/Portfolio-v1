import { promises as fs } from "node:fs";
import path from "node:path";

export type EssayMetadata = {
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
};

export type EssayListItem = EssayMetadata & {
  slug: string;
};

const essaysDirectory = path.join(process.cwd(), "content", "essays");

async function getEssayFiles() {
  const files = await fs.readdir(essaysDirectory);

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export async function getEssaySlugs() {
  return getEssayFiles();
}

export async function getEssayBySlug(slug: string) {
  const { default: Essay, metadata } = await import(`@/content/essays/${slug}.mdx`);

  return {
    Essay,
    metadata: metadata as EssayMetadata,
  };
}

export async function getAllEssays(): Promise<EssayListItem[]> {
  const slugs = await getEssayFiles();
  const essays = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = await getEssayBySlug(slug);

      return {
        slug,
        ...metadata,
      };
    })
  );

  return essays.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
