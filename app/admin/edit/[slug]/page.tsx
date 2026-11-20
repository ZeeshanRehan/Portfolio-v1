import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { isValidSlug, parseEssayFile } from "@/lib/essay-file";
import { getRemoteEssay } from "@/lib/github";
import Editor from "@/components/admin/Editor";

type EditPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditEssayPage({ params }: EditPageProps) {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  const { slug } = await params;
  if (!isValidSlug(slug)) {
    notFound();
  }

  const file = await getRemoteEssay(slug);
  if (!file) {
    notFound();
  }

  return <Editor mode="edit" initial={parseEssayFile(slug, file.content)} />;
}
