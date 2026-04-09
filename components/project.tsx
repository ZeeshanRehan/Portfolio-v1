const projects = [
  {
    title: "SkillSwap",
    href: "https://skillswap-one-opal.vercel.app/",
    description: "A hyper-local app built for Philly's neighbourhoods. Barter system allowing for exchange without money.",
    achievement: "Won 3rd place at Temple OwlHacks 26 hackathon.",
    year: "2025",
  },
  {
  title: "RUHungry",
  href: "https://ruhungry.vercel.app/",
  description: "On-campus free food event finder for Rowan University students. Built on the Engage API with a cron job architecture.",
  achievement: "1,800+ events discovered, serving 8,000+ off-campus students.",
  year: "2025",
},
  {
    title: "DevBytes",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSdgRQG4Tajdt5AMh4WxeA11J4RucVxnv_cyhXioLar64uc2yA/viewform",
    description: "Gamified DSA revision platform. Bite-sized daily sessions with streak tracking.",
    achievement: "work in progress.",
    year: "2026",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="mt-[10vh] px-48 pb-20">
      <p className="font-sans text-3xl tracking-[0.2em] text-[#6a6a6a] uppercase mb-12">
        Projects:
      </p>

      <div className="flex flex-col gap-12">
        {projects.map((project) => (
          <div key={project.title} className="grid grid-cols-[180px_1fr] gap-10">

            <span className="font-sans text-2xl text-[#a2a2a2] pt-1 whitespace-nowrap">
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

              <p className="font-sans text-2xl text-[#6c6c6c] leading-relaxed">
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
