# Vista DTR 2026-27 · Client Edition

A client-facing showcase of the **Vista Digital Transformation Roadmap (DTR) for FY 2026-27**, with a built-in login and a lightweight CMS. Editors sign in and change any element directly on the page; client accounts sign in and see the published, read-only version.

## What's inside

- **Login screen** with two roles
  - `editor` — can turn on *Edit mode*, change any text, reorder/add/remove list entries, cycle icons and statuses, hide or show whole sections, publish, discard, or reset to the original template.
  - `viewer` — read-only access to the published showcase.
- **In-place editing** — every heading, paragraph, metric, table cell, badge, and label is editable where it sits. Changes are drafted locally and published to the server with one click (or `Ctrl/Cmd + S`).
- **Showcase sections** — hero, executive summary, projected impact, strategic pillars, quarterly roadmap, scope & deliverables table, investment options, governance team, risk register, next steps, footer.
- **Hover animations** — card lifts, animated nav underlines, button shine sweeps, icon rotations, and timeline node glows throughout.
- **Print / Save as PDF** — the hero's secondary button opens the browser print dialog with a print-optimised layout (nav and editor controls hidden).

## Stack

Next.js 16 (App Router, `proxy.ts` for auth gating), TypeScript, Tailwind CSS v4, shadcn/ui, lucide-react, sonner. No database: published content is written to `data/content.json`; sessions are HMAC-signed cookies.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:4721>. You'll be redirected to `/login`.

Default demo credentials (shown on the login page until you override them):

| Role   | Username | Password            |
| ------ | -------- | ------------------- |
| Editor | `admin`  | `vista-admin-2027`  |
| Viewer | `client` | `vista-client-2027` |

## Configuration

Copy `.env.example` to `.env.local` and set:

| Variable                     | Purpose                                                        |
| ---------------------------- | -------------------------------------------------------------- |
| `CMS_EDITOR_USERNAME` / `CMS_EDITOR_PASSWORD` | Editor account                                |
| `CMS_VIEWER_USERNAME` / `CMS_VIEWER_PASSWORD` | Client (view-only) account                    |
| `CMS_SESSION_SECRET`         | Long random string used to sign session cookies                |
| `CMS_DATA_DIR`               | Directory for `content.json` (default `./data`); use a persistent volume in production |
| `CMS_HIDE_DEMO_CREDENTIALS`  | `true` to hide the demo panel on the login page                |

Change all defaults before sharing the site with a client.

## Editing workflow

1. Sign in as the editor and switch on **Edit mode** in the bottom toolbar.
2. Click any text to edit it. `Enter` commits single-line fields; `Esc` cancels. Paragraphs accept line breaks.
3. Use the small amber controls to reorder, remove, or add list entries; click a pillar icon, phase status, or risk level to cycle through options; use **Mark recommended** to highlight an investment option; use **Hide section** to drop a whole section from the client view.
4. Click **Publish** to save. Viewers see the update on their next page load. **Discard** reverts to the last published version; the reset icon restores the original template.

## Scripts

- `npm run dev` — dev server on port 4721
- `npm run build` / `npm start` — production build and server
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript
