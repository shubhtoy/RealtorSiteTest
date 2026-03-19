#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const root = process.cwd();
const publicDir = path.join(root, "public");
const imagesInputDir = path.join(publicDir, "images");
const uploadsInputDir = path.join(publicDir, "uploads");
const videosInputDir = path.join(publicDir, "videos");
const imagesOutputDir = path.join(publicDir, "images-optimized");
const uploadsOutputDir = path.join(publicDir, "uploads-optimized");
const videosOutputDir = path.join(publicDir, "videos-optimized");

const args = new Set(process.argv.slice(2));
const runImages = args.size === 0 || args.has("--images") || args.has("--all");
const runUploads = args.size === 0 || args.has("--uploads") || args.has("--all");
const runVideos = args.size === 0 || args.has("--videos") || args.has("--all");

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const videoExtensions = new Set([".mp4", ".mov", ".m4v", ".webm"]);

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function walk(dir) {
  const out = [];
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(fullPath)));
    } else {
      out.push(fullPath);
    }
  }
  return out;
}

function relFrom(base, fullPath) {
  return path.relative(base, fullPath);
}

async function optimizeImages() {
  const files = (await walk(imagesInputDir)).filter((f) => imageExtensions.has(path.extname(f).toLowerCase()));
  if (files.length === 0) {
    console.log("[media:optimize] No image files found in public/images.");
    return { count: 0 };
  }

  await ensureDir(imagesOutputDir);

  let optimizedCount = 0;
  for (const file of files) {
    const rel = relFrom(imagesInputDir, file);
    const parsed = path.parse(rel);
    const outDir = path.join(imagesOutputDir, parsed.dir);
    await ensureDir(outDir);

    const image = sharp(file);
    const metadata = await image.metadata();
    const widths = [640, 1280, 1920].filter((w) => !metadata.width || metadata.width >= w);
    const safeWidths = widths.length ? widths : [metadata.width || 640];

    for (const width of safeWidths) {
      const avifOut = path.join(outDir, `${parsed.name}-${width}.avif`);
      const webpOut = path.join(outDir, `${parsed.name}-${width}.webp`);

      await sharp(file)
        .resize({ width, withoutEnlargement: true })
        .avif({ quality: 58, effort: 4 })
        .toFile(avifOut);

      await sharp(file)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 78, effort: 5 })
        .toFile(webpOut);
    }

    optimizedCount += 1;
  }

  console.log(`[media:optimize] Optimized ${optimizedCount} image source files into ${imagesOutputDir}`);
  return { count: optimizedCount };
}

async function optimizeUploadedImages() {
  const files = (await walk(uploadsInputDir)).filter((f) => imageExtensions.has(path.extname(f).toLowerCase()));
  if (files.length === 0) {
    console.log("[media:optimize] No image files found in public/uploads.");
    return { count: 0 };
  }

  await ensureDir(uploadsOutputDir);

  let optimizedCount = 0;
  for (const file of files) {
    const rel = relFrom(uploadsInputDir, file);
    const parsed = path.parse(rel);
    const outDir = path.join(uploadsOutputDir, parsed.dir);
    await ensureDir(outDir);

    const image = sharp(file);
    const metadata = await image.metadata();
    const widths = [640, 1280, 1920].filter((w) => !metadata.width || metadata.width >= w);
    const safeWidths = widths.length ? widths : [metadata.width || 640];

    for (const width of safeWidths) {
      const avifOut = path.join(outDir, `${parsed.name}-${width}.avif`);
      const webpOut = path.join(outDir, `${parsed.name}-${width}.webp`);

      await sharp(file)
        .resize({ width, withoutEnlargement: true })
        .avif({ quality: 58, effort: 4 })
        .toFile(avifOut);

      await sharp(file)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 78, effort: 5 })
        .toFile(webpOut);
    }

    optimizedCount += 1;
  }

  console.log(`[media:optimize] Optimized ${optimizedCount} uploaded image files into ${uploadsOutputDir}`);
  return { count: optimizedCount };
}

function ffmpegExists() {
  const result = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
  return result.status === 0;
}

async function optimizeVideos() {
  const files = (await walk(videosInputDir)).filter((f) => videoExtensions.has(path.extname(f).toLowerCase()));
  if (files.length === 0) {
    console.log("[media:optimize] No video files found in public/videos.");
    return { count: 0, skipped: false };
  }

  if (!ffmpegExists()) {
    console.warn("[media:optimize] ffmpeg not found. Skipping video optimization.");
    console.warn("[media:optimize] Install ffmpeg (e.g. brew install ffmpeg) and run again.");
    return { count: 0, skipped: true };
  }

  await ensureDir(videosOutputDir);

  let optimizedCount = 0;
  for (const file of files) {
    const rel = relFrom(videosInputDir, file);
    const parsed = path.parse(rel);
    const outDir = path.join(videosOutputDir, parsed.dir);
    await ensureDir(outDir);

    const output = path.join(outDir, `${parsed.name}.mp4`);

    const result = spawnSync(
      "ffmpeg",
      [
        "-y",
        "-i",
        file,
        "-vf",
        "scale='min(1920,iw)':-2",
        "-c:v",
        "libx264",
        "-preset",
        "slow",
        "-crf",
        "26",
        "-movflags",
        "+faststart",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        output,
      ],
      { stdio: "inherit" },
    );

    if (result.status === 0) {
      optimizedCount += 1;
    }
  }

  console.log(`[media:optimize] Optimized ${optimizedCount} video files into ${videosOutputDir}`);
  return { count: optimizedCount, skipped: false };
}

async function main() {
  const summary = { images: 0, uploads: 0, videos: 0 };

  if (runImages) {
    const images = await optimizeImages();
    summary.images = images.count;
  }

  if (runUploads) {
    const uploads = await optimizeUploadedImages();
    summary.uploads = uploads.count;
  }

  if (runVideos) {
    const videos = await optimizeVideos();
    summary.videos = videos.count;
  }

  console.log("[media:optimize] Done.");
  console.log(`[media:optimize] Images: ${summary.images}, Uploads: ${summary.uploads}, Videos: ${summary.videos}`);
}

main().catch((err) => {
  console.error("[media:optimize] Failed:", err);
  process.exit(1);
});
