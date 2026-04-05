const projects = [
  {
    title: "SkillSwap",
    href: "https://skillswap-one-opal.vercel.app/",
    description: "A hyper-local app built for Philly's neighbourhoods. Barter system allowing for exchange without money.",
    achievement: "Won 3rd place at Temple OwlHacks 26 hackathon.",
    year: "2024",
  },
  {
    title: "Lyra AI",
    href: "https://lyra-uqft.vercel.app/",
    description: "AI-powered music discovery platform. Describe your mood and get a curated playlist in seconds.",
    achievement: "2,000+ personalized song suggestions delivered in first week of beta.",
    year: "2025",
  },
  {
    title: "DevBytes",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSdgRQG4Tajdt5AMh4WxeA11J4RucVxnv_cyhXioLar64uc2yA/viewform",
    description: "Gamified DSA revision platform. Bite-sized daily sessions with streak tracking.",
    achievement: null,
    year: "2025",
  },
];

export default function Projects() {
  return (
    <section className="mt-[10vh] px-44 pb-20">
      <p className="font-sans text-sm tracking-[0.2em] text-[#4a4a4a] uppercase mb-12">
        Projects:
      </p>

      <div className="flex flex-col gap-12">
        {projects.map((project) => (
          <div key={project.title} className="grid grid-cols-[180px_1fr] gap-10">

            <span className="font-sans text-2xl text-[#4a4a4a] pt-1 whitespace-nowrap">
              {project.year}
            </span>

            <div className="flex flex-col gap-3">
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif font-light text-3xl text-[#e8e3dc] leading-tight hover:text-[#888] transition-colors duration-200 w-fit no-underline"
              >
                {project.title} {"\u2197"}
              </a>

              <p className="font-sans text-2xl text-[#4a4a4a] leading-relaxed">
                {project.description}
              </p>

              {project.achievement && (
                <p className="font-sans text-2xl text-[#4a4a4a] leading-relaxed flex gap-4">
                  <span className="shrink-0">—</span>
                  <span>{project.achievement}</span>
                </p>
              )}
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}