// — Essay file helpers
// Turns editor fields into an .mdx file (same format as content/essays/*.mdx)
// and turns an existing .mdx file back into editor fields.
// No Node imports here, so the editor (client) can use these too.

export type EssayDraft = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // YYYY-MM-DD
  body: string; // what you type in the editor (markdown)
};

// "Building Before Certainty!" -> "building-before-certainty"
export function slugify(text: string): string {
  let slug = text.toLowerCase().trim();
  slug = slug.replace(/[^a-z0-9\s-]/g, "");
  slug = slug.replace(/\s+/g, "-");
  slug = slug.replace(/-+/g, "-");
  slug = slug.replace(/^-|-$/g, "");
  return slug;
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

export function countWords(text: string): number {
  const words = text.trim().split(/\s+/);
  if (words.length === 1 && words[0] === "") {
    return 0;
  }
  return words.length;
}

// ~200 words per minute, minimum 1 minute
export function readingTime(text: string): string {
  const words = countWords(text);
  let minutes = Math.round(words / 200);
  if (minutes < 1) {
    minutes = 1;
  }
  return `${minutes} min read`;
}

export function todayInNewYork(): string {
  // en-CA formats dates as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// A line that is a component (<EssayImage ... />, <PullQuote>, </PullQuote>)
// or a closing tag is left exactly as written.
function isComponentLine(line: string): boolean {
  const trimmed = line.trim();
  if (/^<[A-Z]/.test(trimmed)) {
    return true;
  }
  if (/^<\/[A-Z]/.test(trimmed)) {
    return true;
  }
  if (trimmed.startsWith("/>")) {
    return true;
  }
  return false;
}

// A component tag that opens on one line and closes on a later one, e.g.
//   <EssayImage
//     src="/a.png"
//     width={600}
//   />
// returns true while we're still inside that tag.
function opensMultilineTag(line: string): boolean {
  const trimmed = line.trim();
  if (!/^<[A-Z]/.test(trimmed)) {
    return false;
  }
  return !trimmed.includes(">");
}

// MDX treats { } and < as code. If you type them in normal text the build breaks,
// so we put a backslash in front of them (outside of code blocks and `inline code`).
function escapeLine(line: string): string {
  let result = "";
  let insideInlineCode = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const previous = i > 0 ? line[i - 1] : "";
    const next = i + 1 < line.length ? line[i + 1] : "";

    if (char === "`") {
      insideInlineCode = !insideInlineCode;
      result += char;
      continue;
    }

    if (insideInlineCode) {
      result += char;
      continue;
    }

    const alreadyEscaped = previous === "\\";

    if ((char === "{" || char === "}") && !alreadyEscaped) {
      result += "\\" + char;
      continue;
    }

    // keep <Component inline, escape everything else like "a < b"
    if (char === "<" && !alreadyEscaped) {
      const startsComponent = /[A-Z]/.test(next);
      if (!startsComponent) {
        result += "\\<";
        continue;
      }
    }

    result += char;
  }

  return result;
}

export function escapeBody(body: string): string {
  const lines = body.split("\n");
  const output: string[] = [];
  let insideCodeFence = false;
  let insideTag = false;

  for (const line of lines) {
    if (insideTag) {
      output.push(line);
      if (line.includes(">")) {
        insideTag = false;
      }
      continue;
    }

    if (line.trim().startsWith("```")) {
      insideCodeFence = !insideCodeFence;
      output.push(line);
      continue;
    }

    if (insideCodeFence) {
      output.push(line);
      continue;
    }

    if (isComponentLine(line)) {
      output.push(line);
      if (opensMultilineTag(line)) {
        insideTag = true;
      }
      continue;
    }

    output.push(escapeLine(line));
  }

  return output.join("\n");
}

// Reverse of escapeBody, so you see clean text in the editor.
export function unescapeBody(body: string): string {
  const lines = body.split("\n");
  const output: string[] = [];
  let insideCodeFence = false;
  let insideTag = false;

  for (const line of lines) {
    if (insideTag) {
      output.push(line);
      if (line.includes(">")) {
        insideTag = false;
      }
      continue;
    }

    if (line.trim().startsWith("```")) {
      insideCodeFence = !insideCodeFence;
      output.push(line);
      continue;
    }

    if (insideCodeFence || isComponentLine(line)) {
      output.push(line);
      if (!insideCodeFence && opensMultilineTag(line)) {
        insideTag = true;
      }
      continue;
    }

    let cleaned = line.replace(/\\\{/g, "{");
    cleaned = cleaned.replace(/\\\}/g, "}");
    cleaned = cleaned.replace(/\\</g, "<");
    output.push(cleaned);
  }

  return output.join("\n");
}

// Which components the body uses, so we only import those.
const knownComponents: { name: string; importLine: string }[] = [
  { name: "EssayImage", importLine: 'import EssayImage from "@/components/EssayImage";' },
  { name: "PullQuote", importLine: 'import PullQuote from "@/components/PullQuote";' },
];

export function buildEssayFile(draft: EssayDraft): string {
  const importLines: string[] = [];
  for (const component of knownComponents) {
    if (draft.body.includes("<" + component.name)) {
      importLines.push(component.importLine);
    }
  }

  // JSON.stringify safely quotes titles with " or ' in them
  const metadataBlock = [
    "export const metadata = {",
    `  title: ${JSON.stringify(draft.title.trim())},`,
    `  description: ${JSON.stringify(draft.description.trim())},`,
    `  publishedAt: ${JSON.stringify(draft.publishedAt)},`,
    `  readingTime: ${JSON.stringify(readingTime(draft.body))},`,
    "};",
  ].join("\n");

  let file = "";
  if (importLines.length > 0) {
    file += importLines.join("\n") + "\n\n";
  }
  file += metadataBlock + "\n\n";
  file += escapeBody(draft.body.trim()) + "\n";
  return file;
}

function readStringField(source: string, field: string): string {
  // matches: title: "Some title",  (double or single quotes)
  const pattern = new RegExp(field + `\\s*:\\s*("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')`);
  const match = source.match(pattern);
  if (!match) {
    return "";
  }
  const quoted = match[1];
  if (quoted.startsWith('"')) {
    try {
      return JSON.parse(quoted);
    } catch {
      return quoted.slice(1, -1);
    }
  }
  return quoted.slice(1, -1).replace(/\\'/g, "'");
}

export function parseEssayFile(slug: string, file: string): EssayDraft {
  const metadataStart = file.indexOf("export const metadata");
  let metadataSource = "";
  let body = file;

  if (metadataStart !== -1) {
    const metadataEnd = file.indexOf("};", metadataStart);
    if (metadataEnd !== -1) {
      metadataSource = file.slice(metadataStart, metadataEnd + 2);
      body = file.slice(metadataEnd + 2);
    }
  }

  // drop import lines; buildEssayFile adds them back when needed
  const bodyLines = body.split("\n").filter((line) => {
    return !line.trim().startsWith("import ");
  });

  return {
    slug,
    title: readStringField(metadataSource, "title"),
    description: readStringField(metadataSource, "description"),
    publishedAt: readStringField(metadataSource, "publishedAt") || todayInNewYork(),
    body: unescapeBody(bodyLines.join("\n").trim()),
  };
}
