---
name: Zeyya Studio CMS Architecture
description: Full CMS built for zeyya_studio project — key paths, architecture decisions, and gotchas.
---

## Architecture

- **Cloned repo location**: `/home/runner/workspace/zeyya_studio/` (inside root workspace)
- **Frontend**: `zeyya_studio/artifacts/zeyya-studio/` — Vite + React, deploys to Vercel
- **API server (project)**: `zeyya_studio/artifacts/api-server/` — Express, used for Vercel/standalone
- **API server (running in Replit)**: `artifacts/api-server/` — ROOT workspace server, port 8080
- **Data files**: `zeyya_studio/artifacts/zeyya-studio/src/data/` — 12 JSON files
- **Uploads**: `zeyya_studio/artifacts/zeyya-studio/public/uploads/`

## Critical Path Fix

From `artifacts/api-server/dist/` (`__dirname`), reach workspace root:
```
../../../  →  /home/runner/workspace/
```
NOT `../../` which only reaches `artifacts/`.

```ts
// CORRECT for root API server routes
path.resolve(globalThis.__dirname, "../../../zeyya_studio/artifacts/zeyya-studio/src/data")
path.resolve(globalThis.__dirname, "../../../zeyya_studio/artifacts/zeyya-studio/public/uploads")
```

**Why:** `dist/` → `../` → `api-server/` → `../` → `artifacts/` → `../` → workspace root. Three levels, not two.

## CMS Routes (root API server)

- `GET|PUT /api/data/:filename` — read/write JSON data files (allowlist of 12 names)
- `GET /api/data` — list all data files
- `POST /api/upload` — upload single file via multer
- `POST /api/upload/multiple` — upload multiple files
- `GET /api/media` — list uploads dir
- `DELETE /api/media/:filename` — delete file
- `PATCH /api/media/rename` — rename file
- `POST /api/publish` — push all 12 JSON files to GitHub via Contents API (triggers Vercel redeploy)

## CMS Frontend

All files in `zeyya_studio/artifacts/zeyya-studio/src/admin/`:
- `CMSApp.tsx` — auth gate + sidebar layout + nested Switch routing
- `cmsApi.ts` — typed fetch client for all API endpoints + localStorage auth helpers
- `types.ts` — TypeScript interfaces for all 12 JSON shapes
- `components/` — Sidebar, Header, ImageUpload, MediaPickerModal, ConfirmDialog, SortableList, TagInput, FormField, StatusBadge
- `pages/` — Login, Dashboard, Portfolio (list+form), StudyCase (list+form), MediaLibrary, Hero/About/Services/Pricing/FAQ/Testimonials/SEO/Navigation/Social/Settings editors

## Vite Proxy

Already configured in `vite.config.ts`:
```ts
proxy: { '/api': { target: 'http://localhost:8080', changeOrigin: true } }
```

## Vercel Deployment

`zeyya_studio/vercel.json` — static frontend only, no API routes.
For production CMS usage: run API server separately and point `VITE_API_URL` to it (or deploy as separate service).

## Auth

Simple localStorage-based password hashing (`btoa(pwd)`). Default password: `zeyyastudio2024`.
No backend auth — suitable for private/local use only.

## Default Data Password

`cmsApi.ts`: `const DEFAULT_PWD_HASH = btoa("zeyyastudio2024")`

## Multer

Installed in both `artifacts/api-server/` (root) and `zeyya_studio/artifacts/api-server/`.
Max file size: 20MB. Allowed: jpeg, png, webp, gif, svg, avif, mp4, webm, pdf.
