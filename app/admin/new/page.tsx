import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { todayInNewYork } from "@/lib/essay-file";
import Editor from "@/components/admin/Editor";

export default async function NewEssayPage() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  return (
    <Editor
      mode="new"
      initial={{ slug: "", title: "", description: "", publishedAt: todayInNewYork(), body: "" }}
    />
  );
}
