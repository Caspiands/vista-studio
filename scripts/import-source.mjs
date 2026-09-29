#!/usr/bin/env node
/**
 * Imports the single-file "Vista DTR" client edition HTML into this project.
 *
 *   node scripts/import-source.mjs path/to/Vista_DTR_2026-27_v4_Client_Edition.html
 *
 * The source embeds each tab as a base64 HTML document. For every module this script:
 *   - writes the page to content/modules/<key>.html with embedded images moved to
 *     public/modules/<key>/ and JS data constants replaced by injection markers
 *   - writes the evaluated data constants to content/modules/<key>.data.json so
 *     editors can change every value from the CMS without touching the markup
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = process.argv[2];
if (!sourcePath) {
  console.error("Usage: node scripts/import-source.mjs <client-edition.html>");
  process.exit(1);
}

const source = readFileSync(sourcePath, "utf8");
const modulesMatch = source.match(/const MODULES = (\{.*?\});\n/s);
if (!modulesMatch) throw new Error("Could not find the MODULES table in the source file");
const modules = JSON.parse(modulesMatch[1]);

const contentDir = path.join(root, "content", "modules");
const publicDir = path.join(root, "public", "modules");
rmSync(contentDir, { recursive: true, force: true });
rmSync(publicDir, { recursive: true, force: true });
mkdirSync(contentDir, { recursive: true });

const MIME_EXT = { png: "png", jpeg: "jpg", jpg: "jpg", gif: "gif", webp: "webp", "svg+xml": "svg" };

function extractImages(key, html) {
  const dir = path.join(publicDir, key);
  let count = 0;
  const out = html.replace(/data:image\/([a-z+]+);base64,([A-Za-z0-9+/=]+)/g, (_, mime, b64) => {
    count += 1;
    mkdirSync(dir, { recursive: true });
    const ext = MIME_EXT[mime] ?? "bin";
    const file = `img-${String(count).padStart(2, "0")}.${ext}`;
    writeFileSync(path.join(dir, file), Buffer.from(b64, "base64"));
    return `/modules/${key}/${file}`;
  });
  return { html: out, count };
}

/** Finds the end index of a bracketed JS literal starting at `start`, skipping strings. */
function literalEnd(text, start) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") quote = c;
    else if (c === "[" || c === "{") depth++;
    else if (c === "]" || c === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function isPlainData(value) {
  if (value === null) return true;
  const t = typeof value;
  if (t === "string" || t === "boolean") return true;
  if (t === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(isPlainData);
  if (t === "object") return Object.values(value).every(isPlainData);
  return false;
}

function extractData(html) {
  const data = {};
  const skipped = [];
  const re = /const ([A-Z_][A-Z0-9_]*) ?= ?(?=[[{])/g;
  let out = "";
  let cursor = 0;
  let match;
  while ((match = re.exec(html))) {
    const start = match.index + match[0].length;
    const end = literalEnd(html, start);
    if (end === -1) continue;
    const literal = html.slice(start, end + 1);
    let value;
    try {
      value = new Function(`"use strict"; return (${literal});`)();
    } catch {
      skipped.push(`${match[1]} (depends on other symbols)`);
      continue;
    }
    if (!isPlainData(value)) {
      skipped.push(`${match[1]} (contains non-data values)`);
      continue;
    }
    data[match[1]] = value;
    out += html.slice(cursor, start) + `/*__VISTA_DATA__:${match[1]}*/`;
    cursor = end + 1;
    re.lastIndex = cursor;
  }
  out += html.slice(cursor);
  return { html: out, data, skipped };
}

for (const [key, b64] of Object.entries(modules)) {
  const decoded = Buffer.from(b64, "base64").toString("utf8");
  const images = extractImages(key, decoded);
  const extracted = extractData(images.html);
  writeFileSync(path.join(contentDir, `${key}.html`), extracted.html);
  writeFileSync(path.join(contentDir, `${key}.data.json`), JSON.stringify(extracted.data, null, 1) + "\n");
  console.log(
    `${key.padEnd(10)} template ${String(extracted.html.length).padStart(7)} chars · ${images.count} images · data: ${Object.keys(extracted.data).join(", ") || "none"}` +
      (extracted.skipped.length ? `\n${" ".repeat(11)}kept inline: ${extracted.skipped.join(", ")}` : ""),
  );
}
