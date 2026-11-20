// — Experience section
// to add a new role: copy one object in the `roles` array and fill it in

const roles = [
  {
    period: "2026",
    role: "Software Engineer",
    org: "BrightStone",
    bullets: [
      "Rebuilt a legacy low-code site for a nonprofit serving adults with disabilities into React and TypeScript, with Node APIs on AWS.",
      "Built donation and intake pipelines with Prisma and MongoDB, and cleaned years of legacy donor data with Python.",
      "Cut page load from 6.5s to 2s, so more families actually made it through sign-up.",
    ],
  },
  {
    period: "2025 — 2026",
    role: "Software Developer",
    org: "InvolveMINT Inc.",
    bullets: [
      "Led a team of 6 rebuilding the mutual-credit marketplace, re-architecting messaging, transactions, and deals as modular services for 800+ businesses.",
      "Built real-time messaging over WebSockets across React Native mobile and web.",
      "Redesigned the discovery-to-deal flow, projected to lift conversion from ~35% to 65%+.",
    ],
  },
  {
    period: "2025 — Present",
    role: "Housing Preparation Assistant",
    org: "Rowan University",
    bullets: [
      "Managed room assignments and occupancy data for 500+ residential units ahead of student move-in.",
      "Corrected 100+ database inconsistencies, reducing last-minute room change requests by 35%.",
    ],
  },
  {
    period: "2023",
    role: "Secretary",
    org: "Pahal Org, LPU Punjab",
    bullets: [
      "Organized outreach programs and community initiatives as part of a student-led NGO.",
      "Coordinated volunteers, managed logistics, and led event planning for incoming freshmen.",
    ],
  },
];


export default function Experience() {
  return (
    // mt-[70vh] pushes this section down so hero has room to breathe
    <section id="experience" className="mt-[16vh] px-48 pb-20">

      {/* section label — Abel mono feel, muted and small */}
      <p className="font-sans text-4xl tracking-[0.2em] text-[#acacac] uppercase mb-12">
        Experience:
      </p>

      {/* roles list */}
      <div className="flex flex-col gap-12">
        {roles.map((item) => (
          <div key={item.role} className="grid grid-cols-[140px_1fr] gap-12">

            {/* left: period */}
            <span className="font-sans text-2xl text-[#a1a1a1] pt-1 whitespace-nowrap">
              {item.period}
            </span>

            {/* right: role details */}
            <div className="flex flex-col gap-3">
              <div>
                {/* role title in serif */}
                <p className="font-serif text-4xl text-[#e8e3dc] leading-tight">
                  {item.role}
                </p>
                {/* org name, muted */}
                <p className="font-sans text-3xl text-[#676767] mt-1 tracking-wide">
                  {item.org}
                </p>
              </div>

              {/* bullet points */}
              <ul className="flex flex-col gap-2">
                {item.bullets.map((b) => (
                  <li key={b} className="font-sans text-2xl text-[#a4a4a4] leading-relaxed flex gap-4">
  <span className="shrink-0">—</span>
  <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
