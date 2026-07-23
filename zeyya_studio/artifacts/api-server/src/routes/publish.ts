import { Router } from "express";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR =
  process.env.DATA_DIR ??
  path.resolve(__dirname, "../../zeyya-studio/src/data");

const DATA_FILES = [
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
];

interface GHFile {
  path: string;
  content: string;
  sha?: string;
}

async function getGHFileSha(
  apiBase: string,
  filePath: string,
  branch: string,
  headers: Record<string, string>
): Promise<string | undefined> {
  try {
    const url = `${apiBase}/${filePath}?ref=${branch}`;
    const res = await fetch(url, { headers });
    if (res.ok) {
      const data = (await res.json()) as { sha: string };
      return data.sha;
    }
  } catch {
    // file may not exist yet
  }
  return undefined;
}

router.post("/publish", async (req, res) => {
  const PUBLISH_SECRET = process.env.PUBLISH_SECRET;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER;
  const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

  // Validate env
  if (!PUBLISH_SECRET || !GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
    const missing = [
      !PUBLISH_SECRET && "PUBLISH_SECRET",
      !GITHUB_TOKEN && "GITHUB_TOKEN",
      !GITHUB_REPO_OWNER && "GITHUB_REPO_OWNER",
      !GITHUB_REPO_NAME && "GITHUB_REPO_NAME",
    ]
      .filter(Boolean)
      .join(", ");
    res.status(503).json({
      error: `Server belum dikonfigurasi. Set environment variable: ${missing}`,
    });
    return;
  }

  const { secret } = req.body as { secret: string };
  if (!secret || secret !== PUBLISH_SECRET) {
    res.status(401).json({ error: "Publish secret salah." });
    return;
  }

  const ghHeaders: Record<string, string> = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
    "User-Agent": "ZeyyaStudio-CMS/2.0",
  };

  const contentsBase = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents`;

  // Collect all JSON data files to push
  const filesToPush: GHFile[] = [];

  for (const name of DATA_FILES) {
    const localPath = path.join(DATA_DIR, `${name}.json`);
    try {
      const content = await fs.readFile(localPath, "utf-8");
      const ghPath = `artifacts/zeyya-studio/src/data/${name}.json`;
      const sha = await getGHFileSha(contentsBase, ghPath, GITHUB_BRANCH, ghHeaders);
      filesToPush.push({
        path: ghPath,
        content: Buffer.from(content).toString("base64"),
        sha,
      });
    } catch {
      // file doesn't exist locally — skip
    }
  }

  if (filesToPush.length === 0) {
    res.status(400).json({ error: "Tidak ada data file yang ditemukan untuk dipublish." });
    return;
  }

  // Push each file to GitHub
  const results: { file: string; success: boolean; commitUrl?: string; error?: string }[] = [];

  for (const file of filesToPush) {
    const url = `${contentsBase}/${file.path}`;
    const body: Record<string, unknown> = {
      message: `chore: update ${path.basename(file.path)} via CMS [${new Date().toISOString()}]`,
      content: file.content,
      branch: GITHUB_BRANCH,
    };
    if (file.sha) body.sha = file.sha;

    try {
      const putRes = await fetch(url, {
        method: "PUT",
        headers: ghHeaders,
        body: JSON.stringify(body),
      });

      if (putRes.ok) {
        const data = (await putRes.json()) as { commit: { html_url: string } };
        results.push({ file: file.path, success: true, commitUrl: data.commit?.html_url });
      } else {
        const err = (await putRes.json()) as { message?: string };
        results.push({ file: file.path, success: false, error: err.message });
      }
    } catch (err) {
      results.push({ file: file.path, success: false, error: String(err) });
    }
  }

  const successCount = results.filter((r) => r.success).length;
  const lastCommit = results.filter((r) => r.commitUrl).at(-1);

  if (successCount === 0) {
    res.status(502).json({ error: "Semua file gagal dipublish", results });
    return;
  }

  res.json({
    success: true,
    publishedCount: successCount,
    totalFiles: filesToPush.length,
    commitUrl: lastCommit?.commitUrl,
    message: `${successCount} dari ${filesToPush.length} file berhasil dipublish ke GitHub! Vercel akan deploy ulang dalam 1–2 menit.`,
    results,
  });
});

export default router;
