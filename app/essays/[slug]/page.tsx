import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getEssayBySlug, getEssaySlugs } from "@/lib/essays";

type EssayPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getEssaySlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: EssayPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { metadata } = await getEssayBySlug(slug);

    return {
      title: `${metadata.title} | Essays`,
      description: metadata.description,
    };
  } catch {
    return {
      title: "Essay Not Found | Essays",
    };
  }
}

export default async function EssayPage({ params }: EssayPageProps) {
  const { slug } = await params;
  const slugs = await getEssaySlugs();

  if (!slugs.includes(slug)) {
    notFound();
  }

  const { Essay, metadata } = await getEssayBySlug(slug);

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/essays"
        className="font-sans text-sm uppercase tracking-[0.2em] text-[#6f6f6f] no-underline transition-colors hover:text-[#b9b2a8]"
      >
        Back to essays
      </Link>

      <header className="mt-10 border-b border-[#1f1f1f] pb-10">
        <p className="font-sans text-sm uppercase tracking-[0.22em] text-[#6f6f6f]">
          {metadata.publishedAt} / {metadata.readingTime}
        </p>
        <h1 className="mt-6 font-serif text-5xl font-light leading-tight tracking-tight text-[#e8e3dc] md:text-6xl">
          {metadata.title}
        </h1>
        <p className="mt-6 max-w-2xl font-sans text-xl leading-relaxed text-[#9f9a92]">
          {metadata.description}
        </p>
      </header>

      <div className="mt-10">
        <Essay />
      </div>
    </article>
  );
}
