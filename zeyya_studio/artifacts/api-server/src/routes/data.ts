import { Router } from "express";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory: artifacts/zeyya-studio/src/data/
const DATA_DIR =
  process.env.DATA_DIR ??
  path.resolve(__dirname, "../../zeyya-studio/src/data");

// Allowed data file names (whitelist for security)
const ALLOWED_FILES = new Set([
  "hero",
  "about",
  "services",
  "portfolio",
  "study-case",
  "pricing",
  "faq",
  "testimonial",
  "social",
  "navigation",
  "seo",
  "settings",
  "content", // legacy
]);

function sanitizeFilename(name: string): string {
  // Strip .json extension if provided
  return name.replace(/\.json$/i, "");
}

function isAllowed(name: string): boolean {
  return ALLOWED_FILES.has(name);
}

function filePath(name: string): string {
  return path.join(DATA_DIR, `${name}.json`);
}

// GET /api/data/:filename — read a JSON data file
router.get("/data/:filename", async (req, res) => {
  const name = sanitizeFilename(req.params.filename);
  if (!isAllowed(name)) {
    res.status(404).json({ error: "File not found" });
    return;
  }
  try {
    const raw = await fs.readFile(filePath(name), "utf-8");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.end(raw);
  } catch {
    res.status(404).json({ error: `Data file '${name}.json' not found` });
  }
});

// PUT /api/data/:filename — overwrite a JSON data file
router.put("/data/:filename", async (req, res) => {
  const name = sanitizeFilename(req.params.filename);
  if (!isAllowed(name)) {
    res.status(400).json({ error: "File not allowed" });
    return;
  }
  try {
    const body = req.body as unknown;
    const json = JSON.stringify(body, null, 2);
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(filePath(name), json, "utf-8");
    res.json({ success: true, file: `${name}.json`, updatedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to save data", detail: String(err) });
  }
});

// GET /api/data — list all available data files
router.get("/data", async (_req, res) => {
  const files: { name: string; size: number; updatedAt: string }[] = [];
  for (const name of ALLOWED_FILES) {
    if (name === "content") continue;
    try {
      const stat = await fs.stat(filePath(name));
      files.push({ name, size: stat.size, updatedAt: stat.mtime.toISOString() });
    } catch {
      // file may not exist yet — skip
    }
  }
  res.json({ files });
});

export default router;
