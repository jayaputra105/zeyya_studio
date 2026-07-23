import { Router } from "express";
import { promises as fs } from "node:fs";
import path from "node:path";
import multer from "multer";

const router = Router();

// Root API server: dist/ → ../../ → workspace root → zeyya_studio/artifacts/zeyya-studio/public/uploads
const UPLOADS_DIR =
  process.env.UPLOADS_DIR ??
  path.resolve(globalThis.__dirname, "../../../zeyya_studio/artifacts/zeyya-studio/public/uploads");

// Ensure dir exists at startup
fs.mkdir(UPLOADS_DIR, { recursive: true }).catch(() => {});

const ALLOWED_MIME = new Set([
  "image/jpeg", "image/jpg", "image/png", "image/webp",
  "image/gif", "image/svg+xml", "image/avif",
  "video/mp4", "video/webm", "application/pdf",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext)
      .toLowerCase().replace(/[^a-z0-9._-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    ALLOWED_MIME.has(file.mimetype) ? cb(null, true) : cb(new Error(`Type '${file.mimetype}' not allowed`));
  },
});

// POST /api/upload
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file" }); return; }
  const url = `/uploads/${req.file.filename}`;
  res.json({ success: true, path: url, url, filename: req.file.filename,
    originalName: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype });
});

// POST /api/upload/multiple
router.post("/upload/multiple", upload.array("files", 20), (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files?.length) { res.status(400).json({ error: "No files" }); return; }
  res.json({ success: true, files: files.map(f => ({
    path: `/uploads/${f.filename}`, url: `/uploads/${f.filename}`,
    filename: f.filename, originalName: f.originalname, size: f.size, mimetype: f.mimetype,
  }))});
});

// GET /api/media
router.get("/media", async (_req, res) => {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    const entries = await fs.readdir(UPLOADS_DIR, { withFileTypes: true });
    const files = [];
    for (const e of entries) {
      if (!e.isFile() || e.name.startsWith(".")) continue;
      const full = path.join(UPLOADS_DIR, e.name);
      const stat = await fs.stat(full);
      const ext = path.extname(e.name).toLowerCase().slice(1);
      const isImage = ["jpg","jpeg","png","webp","gif","svg","avif"].includes(ext);
      files.push({ filename: e.name, path: `/uploads/${e.name}`, url: `/uploads/${e.name}`,
        size: stat.size, type: isImage ? "image" : "file", ext,
        createdAt: stat.birthtime.toISOString(), updatedAt: stat.mtime.toISOString() });
    }
    files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ files, total: files.length });
  } catch (err) {
    res.status(500).json({ error: "Failed to list media", detail: String(err) });
  }
});

// DELETE /api/media/:filename
router.delete("/media/:filename", async (req, res) => {
  const { filename } = req.params;
  if (filename.includes("..") || filename.includes("/")) { res.status(400).json({ error: "Invalid" }); return; }
  try {
    await fs.unlink(path.join(UPLOADS_DIR, filename));
    res.json({ success: true, deleted: filename });
  } catch { res.status(404).json({ error: "Not found" }); }
});

// PATCH /api/media/rename
router.patch("/media/rename", async (req, res) => {
  const { oldName, newName } = req.body as { oldName: string; newName: string };
  if (!oldName || !newName) { res.status(400).json({ error: "oldName and newName required" }); return; }
  for (const n of [oldName, newName]) {
    if (n.includes("..") || n.includes("/")) { res.status(400).json({ error: "Invalid filename" }); return; }
  }
  try {
    await fs.rename(path.join(UPLOADS_DIR, oldName), path.join(UPLOADS_DIR, newName));
    res.json({ success: true, oldName, newName, path: `/uploads/${newName}` });
  } catch { res.status(404).json({ error: "Rename failed" }); }
});

export default router;
