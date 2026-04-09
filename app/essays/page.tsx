import Link from "next/link";
import { getAllEssays } from "@/lib/essays";

export const metadata = {
  title: "Essays | Zeshan Rehan",
  description: "Writing on software, taste, and work.",
};

export default async function EssaysPage() {
  const essays = await getAllEssays();

  return (
    <section className="mx-28 max-w-5xl">
      <header className="border-b border-[#1f1f1f] pb-10">
        <p className="font-sans text-sm uppercase tracking-[0.28em] text-[#6c6c6c]">
          Essays
        </p>
        <h1 className="mt-6 max-w-3xl font-serif text-4xl font-light leading-tight  text-[#e8e3dc] md:text-5xl">
          I write weekly, or more if I feel like it.
        </h1>
        <p className="mt-6 max-w-2xl font-sans text-2xl leading-relaxed text-[#9f9a92]">
          topics range from my thoughts, opinions to learnings I have.
        </p>
      </header>

      <div className="mt-12 flex flex-col gap-10">
        {essays.map((essay) => (
          <Link
            key={essay.slug}
            href={`/essays/${essay.slug}`}
            className="group grid gap-4 border-b border-[#151515] pb-10 no-underline md:grid-cols-[180px_1fr]"
          >
            <p className="pt-1 font-sans uppercase text-[#6f6f6f]">
              {essay.publishedAt}
            </p>
            <div>
              <p className="font-serif text-3xl font-light leading-tight text-[#e8e3dc] transition-colors group-hover:text-white md:text-4xl">
                {essay.title}
              </p>
              <p className="mt-3 max-w-2xl font-sans text-xl leading-relaxed text-[#9f9a92] transition-colors group-hover:text-[#b5afa6]">
                {essay.description}
              </p>
              <p className="mt-4 font-sans text-sm uppercase tracking-[0.18em] text-[#5d5d5d] transition-colors group-hover:text-[#787878]">
                {essay.readingTime}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
