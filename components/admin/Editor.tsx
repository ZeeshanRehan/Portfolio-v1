"use client";

// — Essay editor
// Dark, distraction-free markdown editor with a toolbar, live preview,
// autosaved drafts (in this browser) and one-click publish to GitHub.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import { publishEssay } from "@/app/admin/actions";
import { countWords, readingTime, slugify, type EssayDraft } from "@/lib/essay-file";

type EditorProps = {
  mode: "new" | "edit";
  initial: EssayDraft;
};

type Status =
  | { kind: "idle" }
  | { kind: "publishing" }
  | { kind: "published"; slug: string }
  | { kind: "error"; message: string };

function draftKey(mode: "new" | "edit", slug: string): string {
  if (mode === "new") {
    return "zr-draft:new";
  }
  return "zr-draft:edit:" + slug;
}

function readDraft(key: string): EssayDraft | null {
  try {
    const saved = window.localStorage.getItem(key);
    if (!saved) {
      return null;
    }
    return JSON.parse(saved) as EssayDraft;
  } catch {
    return null;
  }
}

function writeDraft(key: string, draft: EssayDraft) {
  try {
    window.localStorage.setItem(key, JSON.stringify(draft));
  } catch {
    // storage full or blocked — drafts just won't persist
  }
}

function clearDraft(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export default function Editor({ mode, initial }: EditorProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const key = draftKey(mode, initial.slug);

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [publishedAt, setPublishedAt] = useState(initial.publishedAt);
  const [body, setBody] = useState(initial.body);
  const [showPreview, setShowPreview] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [restoredDraft, setRestoredDraft] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // restore an unpublished draft from this browser, once
  useEffect(() => {
    const saved = readDraft(key);
    if (saved) {
      const differs =
        saved.title !== initial.title ||
        saved.body !== initial.body ||
        saved.description !== initial.description;
      if (differs) {
        setTitle(saved.title);
        setDescription(saved.description);
        setBody(saved.body);
        setPublishedAt(saved.publishedAt || initial.publishedAt);
        if (mode === "new" && saved.slug) {
          setSlug(saved.slug);
          setSlugTouched(true);
        }
        setRestoredDraft(true);
      }
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // autosave every change after the first load
  useEffect(() => {
    if (!loaded) {
      return;
    }
    const timer = setTimeout(() => {
      writeDraft(key, { slug, title, description, publishedAt, body });
    }, 400);
    return () => clearTimeout(timer);
  }, [loaded, key, slug, title, description, publishedAt, body]);

  // grow the textarea with its content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }, [body, showPreview]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  // wrap the selected text, e.g. **bold**
  function wrapSelection(before: string, after: string, placeholder: string) {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    let selected = body.slice(start, end);
    if (selected === "") {
      selected = placeholder;
    }
    const next = body.slice(0, start) + before + selected + after + body.slice(end);
    setBody(next);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  // put a prefix at the start of the current line, e.g. "## "
  function prefixLine(prefix: string) {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    const start = textarea.selectionStart;
    const lineStart = body.lastIndexOf("\n", start - 1) + 1;
    const next = body.slice(0, lineStart) + prefix + body.slice(lineStart);
    setBody(next);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  }

  function insertBlock(block: string) {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    const start = textarea.selectionStart;
    const next = body.slice(0, start) + "\n\n" + block + "\n\n" + body.slice(start);
    setBody(next);
    requestAnimationFrame(() => {
      textarea.focus();
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    const modifier = event.metaKey || event.ctrlKey;
    if (!modifier) {
      return;
    }
    const pressed = event.key.toLowerCase();
    if (pressed === "b") {
      event.preventDefault();
      wrapSelection("**", "**", "bold");
    } else if (pressed === "i") {
      event.preventDefault();
      wrapSelection("*", "*", "italic");
    } else if (pressed === "k") {
      event.preventDefault();
      wrapSelection("[", "](https://)", "link text");
    } else if (pressed === "enter") {
      event.preventDefault();
      handlePublish();
    }
  }

  async function handlePublish() {
    if (status.kind === "publishing") {
      return;
    }
    setStatus({ kind: "publishing" });
    const result = await publishEssay({ slug, title, description, publishedAt, body }, mode);
    if (!result.ok) {
      setStatus({ kind: "error", message: result.error });
      return;
    }
    clearDraft(key);
    setStatus({ kind: "published", slug: result.slug });
  }

  function discardDraft() {
    clearDraft(key);
    setTitle(initial.title);
    setDescription(initial.description);
    setBody(initial.body);
    setPublishedAt(initial.publishedAt);
    if (mode === "new") {
      setSlug("");
      setSlugTouched(false);
    }
    setRestoredDraft(false);
  }

  const words = countWords(body);
  const previewHtml = showPreview ? (marked.parse(body, { async: false }) as string) : "";

  const toolbarButtons: { label: string; title: string; onClick: () => void }[] = [
    { label: "B", title: "Bold (Ctrl+B)", onClick: () => wrapSelection("**", "**", "bold") },
    { label: "I", title: "Italic (Ctrl+I)", onClick: () => wrapSelection("*", "*", "italic") },
    { label: "H2", title: "Heading", onClick: () => prefixLine("## ") },
    { label: "H3", title: "Subheading", onClick: () => prefixLine("### ") },
    { label: "❝", title: "Quote", onClick: () => prefixLine("> ") },
    { label: "•", title: "List", onClick: () => prefixLine("- ") },
    { label: "Link", title: "Link (Ctrl+K)", onClick: () => wrapSelection("[", "](https://)", "link text") },
    { label: "</>", title: "Inline code", onClick: () => wrapSelection("`", "`", "code") },
    { label: "Pull quote", title: "Big pull quote", onClick: () => insertBlock("<PullQuote>\n  Your line here.\n</PullQuote>") },
    { label: "—", title: "Divider", onClick: () => insertBlock("---") },
  ];

  return (
    <div className="min-h-screen">
      {/* top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[#151515] bg-[#080808]/95 px-8 py-4 backdrop-blur-sm">
        <Link href="/admin" className="font-sans text-sm uppercase tracking-[0.2em] text-[#6f6f6f] no-underline hover:text-[#e8e3dc]">
          ← Essays
        </Link>

        <div className="flex items-center gap-6 font-sans text-sm text-[#5d5d5d]">
          <span>
            {words} words · {readingTime(body)}
          </span>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="uppercase tracking-[0.2em] text-[#8a8a8a] hover:text-[#e8e3dc]"
          >
            {showPreview ? "Write" : "Preview"}
          </button>
          <button
            onClick={handlePublish}
            disabled={status.kind === "publishing"}
            title="Ctrl+Enter"
            className="border border-[#3a3a3a] bg-[#e8e3dc] px-5 py-2 uppercase tracking-[0.2em] text-[#080808] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status.kind === "publishing" ? "Publishing…" : mode === "new" ? "Publish" : "Update"}
          </button>
        </div>
      </div>

      {/* status messages */}
      <div className="mx-auto max-w-3xl px-8">
        {restoredDraft && status.kind === "idle" && (
          <p className="mt-6 flex justify-between font-sans text-sm text-[#8a8a8a]">
            <span>Restored your unsaved draft from this browser.</span>
            <button onClick={discardDraft} className="underline underline-offset-4 hover:text-[#e8e3dc]">
              Discard it
            </button>
          </p>
        )}
        {status.kind === "error" && (
          <p className="mt-6 border border-[#3a2420] bg-[#140c0a] p-4 font-sans text-[#c98a7a]">{status.message}</p>
        )}
        {status.kind === "published" && (
          <div className="mt-6 border border-[#1f2e22] bg-[#0b130d] p-4 font-sans text-[#9fc3a5]">
            Published. It&apos;ll be live in about a minute at{" "}
            <a href={`/essays/${status.slug}`} className="underline underline-offset-4">
              /essays/{status.slug}
            </a>
            .{" "}
            <button onClick={() => router.push("/admin")} className="underline underline-offset-4">
              Back to essays
            </button>
          </div>
        )}
      </div>

      <main className="mx-auto max-w-3xl px-8 pb-40 pt-12">
        {/* title + description */}
        <input
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          placeholder="Title"
          className="w-full bg-transparent font-serif text-5xl font-light leading-tight tracking-tight text-[#e8e3dc] outline-none placeholder:text-[#2e2e2e] md:text-6xl"
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="One-line description for the essays list"
          rows={2}
          className="mt-6 w-full resize-none bg-transparent font-sans text-xl leading-relaxed text-[#9f9a92] outline-none placeholder:text-[#2e2e2e]"
        />

        {/* slug + date */}
        <div className="mt-4 flex flex-wrap gap-8 border-b border-[#1f1f1f] pb-8 font-sans text-sm text-[#5d5d5d]">
          <label className="flex items-center gap-2">
            /essays/
            <input
              value={slug}
              disabled={mode === "edit"}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(slugify(event.target.value));
              }}
              placeholder="your-essay-url"
              className="w-72 border-b border-[#1f1f1f] bg-transparent text-[#9f9a92] outline-none focus:border-[#3a3a3a] disabled:opacity-60"
            />
          </label>
          <label className="flex items-center gap-2">
            Date
            <input
              type="date"
              value={publishedAt}
              onChange={(event) => setPublishedAt(event.target.value)}
              className="border-b border-[#1f1f1f] bg-transparent text-[#9f9a92] outline-none [color-scheme:dark]"
            />
          </label>
        </div>

        {/* toolbar */}
        {!showPreview && (
          <div className="sticky top-[65px] z-30 -mx-2 mt-6 flex flex-wrap gap-1 bg-[#080808] py-2">
            {toolbarButtons.map((button) => (
              <button
                key={button.label}
                title={button.title}
                onClick={button.onClick}
                className="rounded-sm px-3 py-1.5 font-sans text-sm text-[#7a7a7a] transition-colors hover:bg-[#141414] hover:text-[#e8e3dc]"
              >
                {button.label}
              </button>
            ))}
          </div>
        )}

        {/* body */}
        {showPreview ? (
          <div className="essay-preview mt-10" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        ) : (
          <textarea
            ref={textareaRef}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Start writing…"
            className="mt-6 min-h-[50vh] w-full resize-none overflow-hidden bg-transparent font-sans text-[1.28rem] leading-[1.95] text-[#b5b0a8] outline-none placeholder:text-[#2e2e2e]"
          />
        )}
      </main>
    </div>
  );
}
