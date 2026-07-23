import type { Project } from '@/data/projects';
import { projects as staticProjects } from '@/data/projects';
import initialContent from '@/data/content.json';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdminProject extends Project {
  id: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
}

export interface SiteSettings {
  whatsapp: string;
  email: string;
  facebook: string;
  instagram: string;
}

export interface PublishConfig {
  secret: string;
}

// ─── Storage keys ─────────────────────────────────────────────────────────────

const KEYS = {
  projects: 'zeyya_projects',
  testimonials: 'zeyya_testimonials',
  settings: 'zeyya_settings',
  adminPwd: 'zeyya_admin_pwd',
  adminAuth: 'zeyya_admin_auth',
  publishConfig: 'zeyya_publish_config',
} as const;

// ─── Generic helpers ──────────────────────────────────────────────────────────

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Projects ─────────────────────────────────────────────────────────────────
// Priority: localStorage (admin edits) → content.json (committed baseline) → static

function baselineProjects(): AdminProject[] {
  const fromJson = initialContent.projects as AdminProject[];
  if (fromJson && fromJson.length > 0) return fromJson;
  return staticProjects.map((p, i) => ({ ...p, id: `static-${i}` }));
}

function reattachViteAssets(list: AdminProject[]): AdminProject[] {
  return list.map((sp) => {
    if (!sp.mockupImage) {
      const match = staticProjects.find((p) => p.slug === sp.slug);
      if (match?.mockupImage) return { ...sp, mockupImage: match.mockupImage };
    }
    return sp;
  });
}

export function getProjects(): AdminProject[] {
  const stored = get<AdminProject[] | null>(KEYS.projects, null);
  const source = stored && stored.length > 0 ? stored : baselineProjects();
  return reattachViteAssets(source);
}

export function saveProjects(projects: AdminProject[]): void {
  save(KEYS.projects, projects);
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const DEFAULT_TESTIMONIALS: Testimonial[] = initialContent.testimonials as Testimonial[];

export function getTestimonials(): Testimonial[] {
  return get(KEYS.testimonials, DEFAULT_TESTIMONIALS);
}

export function saveTestimonials(list: Testimonial[]): void {
  save(KEYS.testimonials, list);
}

// ─── Site Settings ────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: SiteSettings = initialContent.settings as SiteSettings;

export function getSettings(): SiteSettings {
  return get(KEYS.settings, DEFAULT_SETTINGS);
}

export function saveSettings(s: SiteSettings): void {
  save(KEYS.settings, s);
}

// ─── Publish Config ───────────────────────────────────────────────────────────

export function getPublishConfig(): PublishConfig {
  return get(KEYS.publishConfig, { secret: '' });
}

export function savePublishConfig(cfg: PublishConfig): void {
  save(KEYS.publishConfig, cfg);
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

const DEFAULT_PWD_HASH = btoa('zeyyastudio2024');

export function checkPassword(pwd: string): boolean {
  const stored = localStorage.getItem(KEYS.adminPwd) ?? DEFAULT_PWD_HASH;
  return btoa(pwd) === stored;
}

export function changePassword(pwd: string): void {
  localStorage.setItem(KEYS.adminPwd, btoa(pwd));
}

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(KEYS.adminAuth) === 'true';
}

export function adminLogin(pwd: string): boolean {
  if (checkPassword(pwd)) {
    sessionStorage.setItem(KEYS.adminAuth, 'true');
    return true;
  }
  return false;
}

export function adminLogout(): void {
  sessionStorage.removeItem(KEYS.adminAuth);
}
