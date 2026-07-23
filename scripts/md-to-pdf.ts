/**
 * Markdown → styled PDF, via headless Chrome.
 *
 *   pnpm md:pdf docs/AI-ASSISTANT-IMPROVEMENTS-REPORT.md
 *   pnpm md:pdf docs/*.md --out results/pdf
 *   pnpm md:pdf README.md --landscape
 *
 * Renders GitHub-flavoured markdown to HTML with a print-tuned stylesheet
 * (styled after the Claude chat interface: warm accent, soft borders, roomy
 * tables), then prints it with the system Chrome. No puppeteer, no LaTeX —
 * Chrome is the layout engine, so tables, code blocks and long documents
 * paginate the way a browser would print them.
 *
 * Output lands next to each source file (`report.md` → `report.pdf`) unless
 * `--out <dir>` is given.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { marked } from "marked";

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH ?? "",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
].filter(Boolean);

function findChrome(): string {
  const found = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!found) {
    console.error(
      "No Chrome/Chromium found. Install Google Chrome or set CHROME_PATH."
    );
    process.exit(1);
  }
  return found;
}

/**
 * Print stylesheet modelled on the Claude chat interface: near-black ink on
 * white, a warm terracotta accent, hairline table borders with a tinted
 * header row, and soft-gray code blocks. Sizes are in pt because the target
 * is paper, not a viewport.
 */
const STYLE = `
  :root {
    --ink: #1f1e1d;
    --muted: #6e6b66;
    --accent: #c2410c;
    --hairline: #e8e5e1;
    --wash: #faf9f7;
    --code-bg: #f4f2ef;
  }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;
    color: var(--ink);
    font-size: 10.5pt;
    line-height: 1.6;
    margin: 0;
  }
  h1, h2, h3, h4 {
    font-weight: 650;
    line-height: 1.25;
    letter-spacing: -0.01em;
    break-after: avoid-page;
  }
  h1 { font-size: 21pt; margin: 0 0 6pt; }
  h1 + p > em:only-child { color: var(--muted); }   /* byline under the title */
  h2 {
    font-size: 14.5pt;
    margin: 22pt 0 8pt;
    padding-bottom: 4pt;
    border-bottom: 1px solid var(--hairline);
  }
  h3 { font-size: 11.5pt; margin: 16pt 0 6pt; }
  p, ul, ol { margin: 0 0 8pt; }
  li { margin-bottom: 3pt; }
  li::marker { color: var(--accent); }
  a { color: var(--accent); text-decoration: none; }
  strong { font-weight: 650; }
  hr { border: 0; border-top: 1px solid var(--hairline); margin: 18pt 0; }

  blockquote {
    margin: 10pt 0;
    padding: 6pt 12pt;
    border-left: 3px solid var(--accent);
    background: var(--wash);
    color: var(--muted);
    border-radius: 0 6pt 6pt 0;
  }
  blockquote p { margin: 0; }

  code {
    font-family: "SF Mono", ui-monospace, Menlo, Consolas, monospace;
    font-size: 9pt;
    background: var(--code-bg);
    padding: 1pt 4pt;
    border-radius: 4pt;
  }
  pre {
    background: var(--code-bg);
    border: 1px solid var(--hairline);
    border-radius: 8pt;
    padding: 10pt 12pt;
    overflow-x: auto;
    break-inside: avoid-page;
  }
  pre code { background: none; padding: 0; }

  /* Long tables flow across pages with the header repeated (browsers repeat
     thead by default); individual rows never split. Forcing whole tables to
     stay together strands half-empty pages before any table taller than the
     remaining space. */
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 10pt 0 14pt;
    font-size: 9.5pt;
  }
  tr { break-inside: avoid-page; }
  th, td {
    text-align: left;
    padding: 6pt 9pt;
    border-bottom: 1px solid var(--hairline);
    vertical-align: top;
  }
  th {
    background: var(--wash);
    font-weight: 650;
    border-bottom: 1.5px solid #d9d5cf;
  }
  tr:nth-child(even) td { background: #fcfbfa; }
  /* keep the big all-3/3 benchmark grid readable */
  td:empty { border-bottom-color: transparent; }

  @page { margin: 18mm 16mm; }
`;

function htmlDocument(title: string, body: string): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>${STYLE}</style>
</head>
<body>${body}</body>
</html>`;
}

// ---------------------------------------------------------------------------

function arg(flag: string): boolean {
  const i = process.argv.indexOf(flag);
  if (i !== -1) process.argv.splice(i, 1);
  return i !== -1;
}

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  if (i === -1) return undefined;
  const value = process.argv[i + 1];
  process.argv.splice(i, 2);
  return value;
}

async function main() {
  const landscape = arg("--landscape");
  const outDir = argValue("--out");
  const files = process.argv.slice(2);

  if (files.length === 0) {
    console.error("Usage: pnpm md:pdf <file.md> [more.md …] [--out dir] [--landscape]");
    process.exit(1);
  }

  const chrome = findChrome();
  if (outDir) mkdirSync(resolve(outDir), { recursive: true });

  for (const file of files) {
    const src = resolve(file);
    if (!existsSync(src)) {
      console.error(`skip: ${file} (not found)`);
      process.exitCode = 1;
      continue;
    }

    const markdown = readFileSync(src, "utf8");
    const title = basename(src).replace(/\.md$/i, "");
    const body = await marked.parse(markdown, { gfm: true });
    const html = htmlDocument(title, body);

    const htmlPath = join(tmpdir(), `md2pdf-${title}-${process.pid}.html`);
    writeFileSync(htmlPath, html, "utf8");

    const pdfPath = outDir
      ? join(resolve(outDir), `${title}.pdf`)
      : join(dirname(src), `${title}.pdf`);

    try {
      execFileSync(
        chrome,
        [
          "--headless",
          "--disable-gpu",
          "--no-pdf-header-footer",
          landscape ? "--print-to-pdf-landscape" : "",
          `--print-to-pdf=${pdfPath}`,
          `file://${htmlPath}`,
        ].filter(Boolean),
        { stdio: "pipe", timeout: 60_000 }
      );
      console.log(`✓ ${file} → ${pdfPath}`);
    } finally {
      rmSync(htmlPath, { force: true });
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
