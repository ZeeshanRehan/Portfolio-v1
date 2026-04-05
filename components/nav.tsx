"use client";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-10 py-5 border-b border-[#1f1f1f] bg-[#080808]/90 backdrop-blur-sm">
      <Link
        href="/"
        className="font-serif text-2xl font-medium text-[#e8e3dc] tracking-wide no-underline"
      >
        Zeshan Rehan
      </Link>

      <ul className="flex gap-10 list-none">
        {[
          { label: "Essays", href: "/essays" },
          { label: "Photos", href: "/photos" },
          { label: "Contact", href: "#contact" },
        ].map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className="text-[18px] font-sans tracking-wider text-[#676565] no-underline hover:text-[#e8e3dc] transition-colors duration-200"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}