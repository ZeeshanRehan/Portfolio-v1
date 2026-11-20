import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import LoginForm from "./login-form";

export default async function LoginPage() {
  if (await isAdmin()) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-sans text-sm uppercase tracking-[0.28em] text-[#6c6c6c]">Admin</p>
        <h1 className="mt-4 font-serif text-4xl font-light">Only Zeshan beyond this point.</h1>
        <LoginForm />
      </div>
    </main>
  );
}
