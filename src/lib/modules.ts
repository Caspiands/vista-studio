import { promises as fs } from "node:fs";
import path from "node:path";
import type { ModuleData, ModuleDocument, ModuleKey } from "./modules-shared";

export * from "./modules-shared";

const SOURCE_DIR = path.join(process.cwd(), "content", "modules");
const DATA_DIR = path.join(process.env.CMS_DATA_DIR ?? path.join(process.cwd(), "data"), "modules");
const MARKER = /\/\*__VISTA_DATA__:([A-Z_][A-Z0-9_]*)\*\//g;

interface StoredModule {
  template?: string;
  data?: ModuleData;
  updatedAt: string;
  updatedBy: string;
}

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") console.error(`Failed to read ${file}:`, error);
    return null;
  }
}

export async function readOriginalModule(key: ModuleKey): Promise<{ template: string; data: ModuleData }> {
  const [template, data] = await Promise.all([
    fs.readFile(path.join(SOURCE_DIR, `${key}.html`), "utf8"),
    readJson<ModuleData>(path.join(SOURCE_DIR, `${key}.data.json`)),
  ]);
  return { template, data: data ?? {} };
}

export async function readModule(key: ModuleKey): Promise<ModuleDocument> {
  const [original, stored] = await Promise.all([readOriginalModule(key), readJson<StoredModule>(path.join(DATA_DIR, `${key}.json`))]);
  return {
    key,
    template: stored?.template ?? original.template,
    data: stored?.data ?? original.data,
    customised: Boolean(stored),
    updatedAt: stored?.updatedAt ?? null,
    updatedBy: stored?.updatedBy ?? null,
  };
}

export async function writeModule(key: ModuleKey, patch: { template?: string; data?: ModuleData }, updatedBy: string): Promise<ModuleDocument> {
  const current = await readModule(key);
  const stored: StoredModule = {
    template: patch.template ?? current.template,
    data: patch.data ?? current.data,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
  await fs.mkdir(DATA_DIR, { recursive: true });
  const file = path.join(DATA_DIR, `${key}.json`);
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(stored), "utf8");
  await fs.rename(tmp, file);
  return readModule(key);
}

export async function resetModule(key: ModuleKey): Promise<ModuleDocument> {
  await fs.rm(path.join(DATA_DIR, `${key}.json`), { force: true });
  return readModule(key);
}

/** Injects the (possibly edited) data constants back into the module HTML. */
export function renderModule(doc: ModuleDocument): string {
  return doc.template.replace(MARKER, (marker, name: string) => {
    if (!(name in doc.data)) return marker;
    // `</script>` inside a JSON string would end the script block early.
    return JSON.stringify(doc.data[name]).replace(/<\//g, "<\\/");
  });
}

/** Names of data constants a module exposes for structured editing. */
export function moduleDataNames(template: string): string[] {
  return Array.from(template.matchAll(MARKER), (m) => m[1]);
}
