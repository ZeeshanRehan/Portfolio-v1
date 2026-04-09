import type { Metadata } from "next";
import Nav from "@/components/nav";

export const metadata: Metadata = {
  title: "Photos | Zeshan Rehan",
  description: "A running archive of photographs by Zeshan Rehan.",
};

/*
import Image from "next/image";
import { photos } from "@/lib/photos";

const aspectClassName = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};
*/

export default function PhotosPage() {
  return (
    <>
      <Nav />
      <main className="px-10 pt-28 pb-24">
        <section className="mx-28 max-w-4xl pb-24">
          <header className="max-w-3xl">
            <p className="font-sans text-sm uppercase tracking-[0.28em] text-[#6c6c6c]">
              Photos:
            </p>
            <h1 className="mt-6 font-serif text-4xl font-light leading-tight text-[#e8e3dc] md:text-5xl">
              Work in progress.
            </h1>
            <p className="mt-6 max-w-2xl font-sans text-2xl leading-relaxed text-[#9f9a92]">
              This section is parked for now. The full photo grid and hover
              treatment will come back once I am ready to do it properly.
            </p>
          </header>
        </section>
      </main>
    </>
  );
}

/*
Previous photos page implementation kept here for later polish work.

<section className="mx-auto max-w-[1320px]">
  <header className="mx-12 max-w-3xl">
    <p className="font-sans text-sm uppercase tracking-[0.28em] text-[#6c6c6c]">
      Photos:
    </p>
    <h1 className="mt-6 font-serif text-4xl font-light leading-tight text-[#e8e3dc] md:text-5xl">
      Frames I wanted to keep around a little longer.
    </h1>
    <p className="mt-6 max-w-2xl font-sans text-2xl leading-relaxed text-[#9f9a92]">
      A loose archive for now. The polish can come later.
    </p>
  </header>

  <div className="mt-14 columns-1 gap-6 px-6 sm:columns-2 lg:columns-3">
    {photos.map((photo) => (
      <article
        key={photo.id}
        className="mb-6 break-inside-avoid overflow-hidden border border-[#1a1a1a] bg-[#0f0f0f]"
      >
        <div className={`relative w-full ${aspectClassName[photo.aspect]}`}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        <div className="px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-serif text-3xl font-light leading-tight text-[#e8e3dc]">
              {photo.title}
            </h2>
            <p className="pt-1 font-sans text-xs uppercase tracking-[0.2em] text-[#6b6b6b]">
              {photo.takenOn}
            </p>
          </div>

          <p className="mt-2 font-sans text-sm uppercase tracking-[0.18em] text-[#5e5e5e]">
            {photo.location}
          </p>

          <p className="mt-4 font-sans text-lg leading-relaxed text-[#9f9a92]">
            {photo.description}
          </p>
        </div>
      </article>
    ))}
  </div>
</section>
*/
