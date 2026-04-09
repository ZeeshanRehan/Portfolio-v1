import type { Metadata } from "next";
import Nav from "@/components/nav";

export const metadata: Metadata = {
  title: "About | Zeshan Rehan",
  description: "About Zeshan Rehan.",
};

const links = [
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

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="px-10 pt-28">
        <section className="mx-28 max-w-4xl pb-24">
          <p className="font-sans text-sm uppercase tracking-[0.28em] text-[#6c6c6c]">
            About:
          </p>

          <div className="mt-10 max-w-3xl space-y-8">
            <p className="font-sans text-[1.95rem] leading-[1.7] text-[#a9a39b]">
              I&apos;m Zeshan - a 21 year old software developer based in New
              Jersey. I loved watching cartoons as a kid. I still do. Across my life
              I&apos;ve lived across the middle east, India and now the USA. I&apos;m a software 
              developer trying to do more.
            </p>

            <p className="font-sans text-[1.95rem] leading-[1.7] text-[#a9a39b]">
              Right now I&apos;m building Roomy - a roommate super app. I will be documenting
              the entire process publicly.
            </p>
          </div>

          <div className="mt-20">
            <p className="font-sans text-sm uppercase tracking-[0.28em] text-[#6c6c6c]">
              Where To Find Me:
            </p>

            <div className="mt-8 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  className="w-fit font-serif text-3xl font-light leading-tight text-[#b0b0b0] no-underline transition-colors duration-200 hover:text-white md:text-4xl"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
