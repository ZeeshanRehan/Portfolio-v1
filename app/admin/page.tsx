import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { parseEssayFile } from "@/lib/essay-file";
import { getRemoteEssay, listRemoteEssaySlugs } from "@/lib/github";
import { logout } from "./actions";
import DeleteButton from "./delete-button";

type Row = { slug: string; title: string; publishedAt: string };

async function loadEssays(): Promise<{ rows: Row[]; error: string | null }> {
  try {
    const slugs = await listRemoteEssaySlugs();
    const rows: Row[] = [];
    for (const slug of slugs) {
      const file = await getRemoteEssay(slug);
      if (!file) {
        continue;
      }
      const draft = parseEssayFile(slug, file.content);
      rows.push({ slug, title: draft.title || slug, publishedAt: draft.publishedAt });
    }
    rows.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    return { rows, error: null };
  } catch (error) {
    const text = error instanceof Error ? error.message : "Couldn't reach GitHub.";
    return { rows: [], error: text };
  }
}

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  const { rows, error } = await loadEssays();

  return (
    <main className="mx-auto max-w-4xl px-8 py-16">
      <header className="flex items-end justify-between border-b border-[#1f1f1f] pb-8">
        <div>
          <p className="font-sans text-sm uppercase tracking-[0.28em] text-[#6c6c6c]">Admin</p>
          <h1 className="mt-4 font-serif text-5xl font-light">Your essays</h1>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/essays" className="font-sans text-sm uppercase tracking-[0.2em] text-[#6f6f6f] no-underline hover:text-[#e8e3dc]">
            View site
          </Link>
          <form action={logout}>
            <button className="font-sans text-sm uppercase tracking-[0.2em] text-[#6f6f6f] hover:text-[#e8e3dc]">
              Log out
            </button>
          </form>
          <Link
            href="/admin/new"
            className="border border-[#2a2a2a] px-5 py-2.5 font-sans text-sm uppercase tracking-[0.2em] text-[#e8e3dc] no-underline transition-colors hover:bg-[#151515]"
          >
            + New essay
          </Link>
        </div>
      </header>

      {error && (
        <p className="mt-10 border border-[#3a2420] bg-[#140c0a] p-4 font-sans text-[#c98a7a]">
          {error}
        </p>
      )}

      <ul className="mt-6 flex flex-col">
        {rows.map((row) => (
          <li key={row.slug} className="grid grid-cols-[120px_1fr_auto] items-center gap-6 border-b border-[#151515] py-6">
            <span className="font-sans text-[#6f6f6f]">{row.publishedAt}</span>
            <span className="font-serif text-2xl font-light">{row.title}</span>
            <span className="flex gap-5 font-sans text-sm uppercase tracking-[0.18em]">
              <Link href={`/essays/${row.slug}`} className="text-[#6f6f6f] no-underline hover:text-[#e8e3dc]">
                View
              </Link>
              <Link href={`/admin/edit/${row.slug}`} className="text-[#6f6f6f] no-underline hover:text-[#e8e3dc]">
                Edit
              </Link>
              <DeleteButton slug={row.slug} />
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-10 font-sans text-[#4a4a4a]">
        Publishing commits to GitHub. The live site updates about a minute later.
      </p>
    </main>
  );
}
