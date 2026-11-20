"use server";

// — Admin server actions
// Every action re-checks isAdmin(), because server actions can be called directly by POST.

import { redirect } from "next/navigation";
import { checkPassword, endSession, isAdmin, startSession } from "@/lib/admin-auth";
import { buildEssayFile, isValidSlug, type EssayDraft } from "@/lib/essay-file";
import { deleteRemoteEssay, getRemoteEssay, putRemoteEssay } from "@/lib/github";

export type LoginState = { error: string | null };

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!process.env.ADMIN_PASSWORD) {
    return { error: "ADMIN_PASSWORD isn't set on Vercel yet." };
  }
  if (!checkPassword(password)) {
    return { error: "Wrong password." };
  }

  const started = await startSession();
  if (!started) {
    return { error: "Couldn't start a session." };
  }
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/");
}

export type PublishResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };

// mode "new": fails if the slug already exists, so you never overwrite by accident
// mode "edit": updates the existing file
export async function publishEssay(draft: EssayDraft, mode: "new" | "edit"): Promise<PublishResult> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Not logged in." };
  }

  const title = draft.title.trim();
  if (title === "") {
    return { ok: false, error: "Add a title." };
  }
  if (draft.body.trim() === "") {
    return { ok: false, error: "The essay is empty." };
  }
  if (!isValidSlug(draft.slug)) {
    return { ok: false, error: "URL slug can only use lowercase letters, numbers and dashes." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.publishedAt)) {
    return { ok: false, error: "Date must look like 2026-11-20." };
  }

  try {
    const existing = await getRemoteEssay(draft.slug);

    if (mode === "new" && existing) {
      return { ok: false, error: `An essay at /essays/${draft.slug} already exists. Change the slug.` };
    }
    if (mode === "edit" && !existing) {
      return { ok: false, error: "That essay no longer exists on GitHub." };
    }

    const file = buildEssayFile({ ...draft, title });
    const message = mode === "new" ? `essay: publish ${draft.slug}` : `essay: update ${draft.slug}`;
    await putRemoteEssay(draft.slug, file, message, existing?.sha);

    return { ok: true, slug: draft.slug };
  } catch (error) {
    const text = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, error: text };
  }
}

export async function deleteEssay(slug: string): Promise<PublishResult> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Not logged in." };
  }
  if (!isValidSlug(slug)) {
    return { ok: false, error: "Bad slug." };
  }

  try {
    const existing = await getRemoteEssay(slug);
    if (!existing) {
      return { ok: false, error: "Already gone." };
    }
    await deleteRemoteEssay(slug, existing.sha);
    return { ok: true, slug };
  } catch (error) {
    const text = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, error: text };
  }
}
