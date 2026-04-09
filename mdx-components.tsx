import type { MDXComponents } from "mdx/types";
import Link from "next/link";

function leadClassName(extra?: string) {
  return ["font-sans text-[1.28rem] leading-[1.95] text-[#b5b0a8]", extra]
    .filter(Boolean)
    .join(" ");
}

const components: MDXComponents = {
  h1: (props) => (
    <h1
      className="font-serif text-5xl font-light leading-tight tracking-tight text-[#e8e3dc] md:text-6xl"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-16 font-serif text-3xl font-light leading-tight text-[#e8e3dc] md:text-4xl"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-12 font-serif text-2xl font-light leading-tight text-[#e8e3dc] md:text-3xl"
      {...props}
    />
  ),
  p: (props) => <p className={leadClassName("mt-6")} {...props} />,
  strong: (props) => <strong className="font-medium text-[#e8e3dc]" {...props} />,
  em: (props) => <em className="italic text-[#d7d1c7]" {...props} />,
  ul: (props) => (
    <ul className="mt-6 space-y-3 pl-6 font-sans text-[1.2rem] leading-[1.9] text-[#b5b0a8]" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-6 space-y-3 pl-6 font-sans text-[1.2rem] leading-[1.9] text-[#b5b0a8]" {...props} />
  ),
  li: (props) => <li className="pl-2" {...props} />,
  a: (props) => {
    const href = props.href ?? "#";
    const isInternal = href.startsWith("/");

    if (isInternal) {
      return (
        <Link
          href={href}
          className="text-[#e8e3dc] underline decoration-[#4a4a4a] underline-offset-4 transition-colors hover:text-white"
        >
          {props.children}
        </Link>
      );
    }

    return (
      <a
        {...props}
        className="text-[#e8e3dc] underline decoration-[#4a4a4a] underline-offset-4 transition-colors hover:text-white"
        rel="noreferrer"
        target="_blank"
      />
    );
  },
  blockquote: (props) => (
    <blockquote
      className="mt-10 border-l border-[#2a2a2a] pl-6 font-serif text-2xl font-light italic leading-[1.7] text-[#d8d2c9]"
      {...props}
    />
  ),
  hr: () => <hr className="my-14 border-[#1f1f1f]" />,
  code: (props) => (
    <code
      className="rounded-sm bg-[#111111] px-1.5 py-0.5 font-mono text-[0.95em] text-[#ddd6cc]"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mt-8 overflow-x-auto rounded-sm border border-[#1f1f1f] bg-[#0d0d0d] p-5 font-mono text-sm leading-7 text-[#d6d0c6]"
      {...props}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
