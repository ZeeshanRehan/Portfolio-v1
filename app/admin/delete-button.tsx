"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteEssay } from "./actions";

export default function DeleteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setBusy(true);
    const result = await deleteEssay(slug);
    setBusy(false);
    setConfirming(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        title={error ?? undefined}
        className={error ? "uppercase tracking-[0.18em] text-[#c98a7a]" : "uppercase tracking-[0.18em] text-[#6f6f6f] hover:text-[#c98a7a]"}
      >
        {error ? "Failed — retry" : "Delete"}
      </button>
    );
  }

  return (
    <span className="flex gap-3">
      <button onClick={handleDelete} disabled={busy} className="uppercase tracking-[0.18em] text-[#c98a7a]">
        {busy ? "Deleting…" : "Sure?"}
      </button>
      <button onClick={() => setConfirming(false)} className="uppercase tracking-[0.18em] text-[#6f6f6f]">
        No
      </button>
    </span>
  );
}
