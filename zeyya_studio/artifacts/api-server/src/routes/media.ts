import { Router } from "express";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Uploads directory: artifacts/zeyya-studio/public/uploads/
const UPLOADS_DIR =
  process.env.UPLOADS_DIR ??
  path.resolve(__dirname, "../../zeyya-studio/public/uploads");

// Ensure uploads dir exists
async function ensureUploadsDir() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}
ensureUploadsDir().catch(() => {});

// Allowed image/media MIME types
const ALLOWED_MIME = new Set([
  "image/jpeg", "image/jpg", "image/png", "image/webp",
  "image/gif", "image/svg+xml", "image/avif",
  "video/mp4", "video/webm",
  "application/pdf",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type '${file.mimetype}' not allowed`));
    }
  },
});

// POST /api/upload — upload a file
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  const filePath = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    path: filePath,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
    url: filePath,
  });
});

// POST /api/upload/multiple — upload multiple files at once
router.post("/upload/multiple", upload.array("files", 20), (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    res.status(400).json({ error: "No files uploaded" });
    return;
  }
  res.json({
    success: true,
    files: files.map((f) => ({
      path: `/uploads/${f.filename}`,
      filename: f.filename,
      originalName: f.originalname,
      size: f.size,
      mimetype: f.mimetype,
      url: `/uploads/${f.filename}`,
    })),
  });
});

// GET /api/media — list all uploaded files
router.get("/media", async (_req, res) => {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    const entries = await fs.readdir(UPLOADS_DIR, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      if (!entry.isFile() || entry.name.startsWith(".")) continue;
      const fullPath = path.join(UPLOADS_DIR, entry.name);
      const stat = await fs.stat(fullPath);
      const ext = path.extname(entry.name).toLowerCase().slice(1);
      const isImage = ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"].includes(ext);
      files.push({
        filename: entry.name,
        path: `/uploads/${entry.name}`,
        url: `/uploads/${entry.name}`,
        size: stat.size,
        type: isImage ? "image" : "file",
        ext,
        createdAt: stat.birthtime.toISOString(),
        updatedAt: stat.mtime.toISOString(),
      });
    }
    // Sort newest first
    files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ files, total: files.length });
  } catch (err) {
    res.status(500).json({ error: "Failed to list media", detail: String(err) });
  }
});

// DELETE /api/media/:filename — delete a file
router.delete("/media/:filename", async (req, res) => {
  const { filename } = req.params;
  // Security: prevent path traversal
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    res.status(400).json({ error: "Invalid filename" });
    return;
  }
  const fullPath = path.join(UPLOADS_DIR, filename);
  try {
    await fs.unlink(fullPath);
    res.json({ success: true, deleted: filename });
  } catch {
    res.status(404).json({ error: "File not found" });
  }
});

// PATCH /api/media/rename — rename a file
router.patch("/media/rename", async (req, res) => {
  const { oldName, newName } = req.body as { oldName: string; newName: string };
  if (!oldName || !newName) {
    res.status(400).json({ error: "oldName and newName are required" });
    return;
  }
  // Security: prevent path traversal
  for (const n of [oldName, newName]) {
    if (n.includes("..") || n.includes("/") || n.includes("\\")) {
      res.status(400).json({ error: "Invalid filename" });
      return;
    }
  }
  const oldPath = path.join(UPLOADS_DIR, oldName);
  const newPath = path.join(UPLOADS_DIR, newName);
  try {
    await fs.rename(oldPath, newPath);
    res.json({ success: true, oldName, newName, path: `/uploads/${newName}` });
  } catch {
    res.status(404).json({ error: "File not found or rename failed" });
  }
});

// GET /api/media/:filename — serve a single file info
router.get("/media/:filename", async (req, res) => {
  const { filename } = req.params;
  if (filename.includes("..") || filename.includes("/")) {
    res.status(400).json({ error: "Invalid filename" });
    return;
  }
  const fullPath = path.join(UPLOADS_DIR, filename);
  try {
    const stat = await fs.stat(fullPath);
    const ext = path.extname(filename).toLowerCase().slice(1);
    const isImage = ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"].includes(ext);
    res.json({
      filename,
      path: `/uploads/${filename}`,
      url: `/uploads/${filename}`,
      size: stat.size,
      type: isImage ? "image" : "file",
      ext,
      updatedAt: stat.mtime.toISOString(),
    });
  } catch {
    res.status(404).json({ error: "File not found" });
  }
});

export default router;
