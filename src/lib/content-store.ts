import { promises as fs } from "node:fs";
import path from "node:path";
import { defaultContent, looksLikeContent, type Content, type StoredContent } from "./content";

const DATA_DIR = process.env.CMS_DATA_DIR ?? path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "content.json");

let writeQueue: Promise<unknown> = Promise.resolve();

function serialise(stored: StoredContent) {
  return JSON.stringify(stored, null, 2) + "\n";
}

export async function readStoredContent(): Promise<StoredContent> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoredContent>;
    if (parsed && looksLikeContent(parsed.content)) {
      return {
        content: parsed.content,
        updatedAt: parsed.updatedAt ?? null,
        updatedBy: parsed.updatedBy ?? null,
      };
    }
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      console.error("Failed to read content store, falling back to defaults:", error);
    }
  }
  return { content: defaultContent, updatedAt: null, updatedBy: null };
}

export async function writeStoredContent(content: Content, updatedBy: string): Promise<StoredContent> {
  const stored: StoredContent = { content, updatedAt: new Date().toISOString(), updatedBy };
  // Serialise writes so two concurrent saves cannot interleave on disk.
  const task = writeQueue.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmp = `${DATA_FILE}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmp, serialise(stored), "utf8");
    await fs.rename(tmp, DATA_FILE);
  });
  writeQueue = task.catch(() => undefined);
  await task;
  return stored;
}

export async function resetStoredContent(updatedBy: string): Promise<StoredContent> {
  return writeStoredContent(defaultContent, updatedBy);
}
