/**
 * CMS API Client — all data operations for the admin panel.
 * Communicates with the Express API server at /api.
 */

const API = "/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MediaFile {
  filename: string;
  path: string;
  url: string;
  size: number;
  type: "image" | "file";
  ext: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadResult {
  success: boolean;
  path: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  url: string;
}

export interface PublishResult {
  success: boolean;
  publishedCount: number;
  totalFiles: number;
  commitUrl?: string;
  message: string;
}

// ─── Data CRUD ────────────────────────────────────────────────────────────────

/** Read a JSON data file by name (e.g. "portfolio", "hero") */
export async function getData<T = unknown>(filename: string): Promise<T> {
  const res = await fetch(`${API}/data/${filename}`);
  if (!res.ok) {
    const err = (await res.json().catch(() => ({ error: res.statusText }))) as { error: string };
    throw new Error(err.error ?? `Failed to load ${filename}`);
  }
  return res.json() as Promise<T>;
}

/** Write a JSON data file (full overwrite) */
export async function saveData<T = unknown>(filename: string, data: T): Promise<void> {
  const res = await fetch(`${API}/data/${filename}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({ error: res.statusText }))) as { error: string };
    throw new Error(err.error ?? `Failed to save ${filename}`);
  }
}

// ─── Media Library ────────────────────────────────────────────────────────────

/** Upload a single file; returns the saved path e.g. "/uploads/image-123.webp" */
export async function uploadFile(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API}/upload`, { method: "POST", body: form });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({ error: res.statusText }))) as { error: string };
    throw new Error(err.error ?? "Upload failed");
  }
  return res.json() as Promise<UploadResult>;
}

/** Upload multiple files at once */
export async function uploadFiles(files: File[]): Promise<UploadResult[]> {
  const form = new FormData();
  for (const file of files) form.append("files", file);
  const res = await fetch(`${API}/upload/multiple`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Upload failed");
  const data = (await res.json()) as { files: UploadResult[] };
  return data.files;
}

/** List all media files in the uploads directory */
export async function getMedia(): Promise<MediaFile[]> {
  const res = await fetch(`${API}/media`);
  if (!res.ok) throw new Error("Failed to list media");
  const data = (await res.json()) as { files: MediaFile[] };
  return data.files;
}

/** Delete a media file by filename */
export async function deleteMedia(filename: string): Promise<void> {
  const res = await fetch(`${API}/media/${encodeURIComponent(filename)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete file");
}

/** Rename a media file */
export async function renameMedia(oldName: string, newName: string): Promise<string> {
  const res = await fetch(`${API}/media/rename`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oldName, newName }),
  });
  if (!res.ok) throw new Error("Failed to rename file");
  const data = (await res.json()) as { path: string };
  return data.path;
}

// ─── Publish ──────────────────────────────────────────────────────────────────

/** Publish all JSON data files to GitHub (triggers Vercel redeploy) */
export async function publishToGitHub(secret: string): Promise<PublishResult> {
  const res = await fetch(`${API}/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret }),
  });
  const data = (await res.json()) as PublishResult & { error?: string };
  if (!res.ok) throw new Error(data.error ?? "Publish failed");
  return data;
}

// ─── Auth helpers (localStorage-based, no backend) ───────────────────────────

const ADMIN_PWD_KEY = "zeyya_admin_pwd";
const ADMIN_AUTH_KEY = "zeyya_admin_auth";
const DEFAULT_PWD_HASH = btoa("zeyyastudio2024");

export function checkPassword(pwd: string): boolean {
  const stored = localStorage.getItem(ADMIN_PWD_KEY) ?? DEFAULT_PWD_HASH;
  return btoa(pwd) === stored;
}

export function changePassword(pwd: string): void {
  localStorage.setItem(ADMIN_PWD_KEY, btoa(pwd));
}

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === "true";
}

export function adminLogin(pwd: string): boolean {
  if (checkPassword(pwd)) {
    sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function adminLogout(): void {
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
}
