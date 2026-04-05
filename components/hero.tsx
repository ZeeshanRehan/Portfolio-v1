// — Hero section
// to update: just change the two lines of text below
// font sizes are responsive: smaller on mobile, larger on desktop

export default function Hero() {
  return (
    <section className="pt-30 pb-20 px-20">
      {/* main intro line — Cormorant serif, light weight */}
      <h1 className="font-serif font-light text-5xl text-[#e8e3dc] leading-tight tracking-tight">
        21 y/o software developer. Based in New Jersey.
      </h1>

      {/* currently building line — italic, slightly muted */}
        <p className="font-serif font-light italic text-5xl text-[#e8e3dc] leading-tight tracking-tight mt-1">
        Currently building - Roomy.
      </p>
    </section>
  );
}