"use client";

const usefulLinks = [
  {
    label: "Resume",
    href: "https://docs.google.com/document/d/10EszhlOV_1_btR--BHNdt3ercregQ0XA/edit",
  },
  { label: "GitHub", href: "https://github.com/ZeeshanRehan" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/zeshan-rehan-504ab0128/",
  },
  { label: "X", href: "https://x.com/ZeshanRehann" },
  { label: "Email", href: "mailto:zeeshanrehan12345@gmail.com" },
];

export default function Footer() {
  return (
    <footer id="contact" className="mt-24 pb-10">
      <div className="rounded-t-[1.35rem] border-t border-[#242424] px-6 pt-10 shadow-[0_-18px_50px_rgba(0,0,0,0.22)] md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_0.8fr] md:items-start px-4">
          <div>
            <p className="font-sans text-sm uppercase tracking-[0.3em] text-[#5d5d5d]">
              Zeshan Rehan
            </p>
            <p className="mt-5 max-w-2xl font-serif text-3xl font-light leading-tight text-[#e8e3dc] md:text-4xl">
              All round good guy.
            </p>
            <p className="mt-5 max-w-xl font-sans text-xl leading-relaxed text-[#85817a]">
              building things for myself and other people.
            </p>
          </div>

          <div className="grid gap-6 md:justify-self-end pr-12">
            {/* <p className="font-sans text-sm uppercase tracking-[0.26em] text-[#5d5d5d]">
              Useful Links
            </p> */}
            <div className="flex flex-col gap-3">
              {usefulLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  className="font-sans text-lg tracking-[0.08em] text-[#8d8881] no-underline transition-colors duration-200 hover:text-[#e8e3dc]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
