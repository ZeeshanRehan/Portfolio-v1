// — Stack section
// to update: edit the stack string or the copy line below

export default function Stack() {
  return (
    <section id="stack" className="mt-[10vh] px-48 pb-20">

      {/* section label */}
      <p className="font-sans text-3xl tracking-[0.2em] text-[#4a4a4a] uppercase mb-8">
        Stack:
      </p>

      {/* main stack line */}
      <p className="font-serif font-light text-2xl text-[#e8e3dc] leading-relaxed tracking-widest ">
        Next.js, React, Node.js, Express, TypeScript,
        Prisma, AWS, MongoDB, Tailwind, Figma.
      </p>

      {/* copy line */}
      <p className="font-sans text-2xl text-[#5d5d5d] mt-4 max-w-2x, leading-relaxed">
        If I haven&apos;t already worked with the tech, I usually pick it up and learn on the go.
      </p>

    </section>
  );
}
