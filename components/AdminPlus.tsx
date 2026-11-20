"use client";

// Floating "+" button on /essays. Only renders when you're logged in as admin.

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPlus() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const response = await fetch("/api/admin/session", { cache: "no-store" });
        const data: { admin: boolean } = await response.json();
        if (!cancelled) {
          setIsAdmin(data.admin === true);
        }
      } catch {
        // not logged in / offline — show nothing
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <Link
      href="/admin/new"
      title="New essay"
      className="fixed bottom-10 right-10 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#111111] font-serif text-3xl font-light text-[#e8e3dc] no-underline shadow-lg transition-colors hover:bg-[#1a1a1a]"
    >
      +
    </Link>
  );
}
