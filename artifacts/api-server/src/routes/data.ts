import { Router } from "express";
import { promises as fs } from "node:fs";
import path from "node:path";

const router = Router();

// __dirname is set by the build banner to dist/
// Root API server: dist/ → ../../ → workspace root → zeyya_studio/artifacts/zeyya-studio/src/data
const DATA_DIR =
  process.env.DATA_DIR ??
  path.resolve(globalThis.__dirname, "../../../zeyya_studio/artifacts/zeyya-studio/src/data");

const ALLOWED_FILES = new Set([
  "hero", "about", "services", "portfolio", "study-case",
  "pricing", "faq", "testimonial", "social", "navigation",
  "seo", "settings", "content",
]);

function sanitize(name: string) { return name.replace(/\.json$/i, ""); }
function isAllowed(name: string) { return ALLOWED_FILES.has(name); }
function fp(name: string) { return path.join(DATA_DIR, `${name}.json`); }

// GET /api/data — list all available data files
router.get("/data", async (_req, res) => {
  const files: { name: string; size: number; updatedAt: string }[] = [];
  for (const name of ALLOWED_FILES) {
    if (name === "content") continue;
    try {
      const stat = await fs.stat(fp(name));
      files.push({ name, size: stat.size, updatedAt: stat.mtime.toISOString() });
    } catch { /* skip */ }
  }
  res.json({ files });
});

// GET /api/data/:filename
router.get("/data/:filename", async (req, res) => {
  const name = sanitize(req.params.filename);
  if (!isAllowed(name)) { res.status(404).json({ error: "File not found" }); return; }
  try {
    const raw = await fs.readFile(fp(name), "utf-8");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.end(raw);
  } catch {
    res.status(404).json({ error: `'${name}.json' not found` });
  }
});

// PUT /api/data/:filename
router.put("/data/:filename", async (req, res) => {
  const name = sanitize(req.params.filename);
  if (!isAllowed(name)) { res.status(400).json({ error: "File not allowed" }); return; }
  try {
    const json = JSON.stringify(req.body, null, 2);
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(fp(name), json, "utf-8");
    res.json({ success: true, file: `${name}.json`, updatedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to save", detail: String(err) });
  }
});

export default router;
