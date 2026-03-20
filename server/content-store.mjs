import { mkdir, readFile, writeFile, access, copyFile } from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.resolve(process.cwd(), "server/data");
const DRAFT_FILE = path.join(DATA_DIR, "draft.json");
const PUBLISHED_FILE = path.join(DATA_DIR, "published.json");

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Corrupted or unreadable JSON file: ${filePath} — ${err.message}`);
  }
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf-8");
}

export async function getDraftDocument() {
  await ensureDataDir();
  if (!(await fileExists(DRAFT_FILE))) return null;
  return readJson(DRAFT_FILE);
}

export async function getPublishedDocument() {
  await ensureDataDir();
  if (!(await fileExists(PUBLISHED_FILE))) return null;
  return readJson(PUBLISHED_FILE);
}

export async function setDraftDocument(document) {
  await ensureDataDir();
  await writeJson(DRAFT_FILE, document);
  return document;
}

export async function publishDraftDocument() {
  await ensureDataDir();
  if (!(await fileExists(DRAFT_FILE))) {
    throw new Error("Draft document not found. Initialize draft first.");
  }

  await copyFile(DRAFT_FILE, PUBLISHED_FILE);
  return readJson(PUBLISHED_FILE);
}

export async function bootstrapContent(document) {
  await ensureDataDir();

  if (!(await fileExists(DRAFT_FILE))) {
    await writeJson(DRAFT_FILE, document);
  }

  if (!(await fileExists(PUBLISHED_FILE))) {
    await writeJson(PUBLISHED_FILE, document);
  }

  return {
    draft: await readJson(DRAFT_FILE),
    published: await readJson(PUBLISHED_FILE),
  };
}
