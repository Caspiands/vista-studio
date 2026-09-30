# Vista Eye Specialist — Digital Transformation 2026–27 (Client Edition)

The client-facing web edition of the **Vista DTR 2026-27 v4 Client Edition** proposal by Caspian Digital Solutions for Vista Eye Specialist, rebuilt as a login-gated site with a built-in CMS. Editors sign in and change any element on the page; client accounts sign in and see the published, read-only version.

## What's inside

- **Login screen** with two roles
  - `editor` — turns on *Edit mode*, edits text in place, reorders/adds/removes list entries and table rows, hides or shows sections, publishes, discards, or restores the original; also edits every tab's data and markup.
  - `viewer` — read-only access to the published document.
- **Overview hub** (native, fully editable): hero, the six at-a-glance tiles, the seven-step reading order, the twelve-month targets table with group headings, working principles and first-weeks agreements, the tab guide, and the footer.
- **Seven tabs carried over from the source document** — *Vista Today, Audiences, Content, SEO · AEO · GEO, Creative, Website, Roadmap* — rendered exactly as authored (charts, Gantt, sortable tables, sample creative) inside the app. Each is editable:
  - **Data & text** — the figures, labels and paragraphs each tab renders are extracted into structured data and edited through a folding tree editor; the tab redraws on publish.
  - **Edit text in page** — for the image-led tabs (Creative, Website) the page itself becomes editable; click and type, then publish.
  - **HTML source** — the full markup of any tab, for advanced changes.
- **Hover animations** throughout the hub: card lifts, tab and link transitions, button shine, icon rotations.
- **Print / Save as PDF** for the overview with a print-optimised layout.

## Stack

Next.js 16 (App Router, `proxy.ts` for auth gating), TypeScript, Tailwind CSS v4, shadcn/ui, lucide-react, sonner. No database: published content is written to `data/` as JSON; sessions are HMAC-signed cookies.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:4721>. You'll be redirected to `/login`. Sign in with a username and password, then enter the access code.

Default accounts (override these before sharing the site):

| Role   | Username | Password            |
| ------ | -------- | ------------------- |
| Editor | `admin`  | `vista-admin-2027`  |
| Viewer | `client` | `vista-client-2027` |

## Configuration

Copy `.env.example` to `.env.local` and set:

| Variable                                      | Purpose                                                                                  |
| --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `CMS_EDITOR_USERNAME` / `CMS_EDITOR_PASSWORD` | Editor account                                                                           |
| `CMS_VIEWER_USERNAME` / `CMS_VIEWER_PASSWORD` | Client (view-only) account                                                               |
| `CMS_SESSION_SECRET`                          | Long random string used to sign session cookies                                          |
| `CMS_DATA_DIR`                                | Directory for published edits (default `./data`); use a persistent volume in production |

Change all defaults before sharing the site with a client.

## Editing workflow

1. Sign in as the editor and switch on **Edit mode** in the bottom toolbar.
2. On the **Overview**, click any text to edit it. `Enter` commits single-line fields; `Esc` cancels; paragraphs accept line breaks. Use the amber controls to reorder, remove, or add list entries and table rows, click a step's *Opens* badge to change which tab it links to, and use **Hide section** to drop a section from the client view. **Publish** (or `Ctrl/Cmd + S`) saves; **Discard** reverts; the reset icon restores the original template.
3. On any **tab**, an amber editor panel appears above the page. Change values in **Data & text**, or click into the page under **Edit text in page**, then **Publish tab**. **Restore original** returns the tab to the imported version.

## Re-importing a new edition

The tabs are imported from the single-file client edition HTML. To bring in a newer version:

```bash
node scripts/import-source.mjs path/to/Vista_DTR_2026-27_v5_Client_Edition.html
```

This rewrites `content/modules/*.html` (tab markup with data-injection markers), `content/modules/*.data.json` (the extracted data constants) and `public/modules/**` (images extracted from the file). Overview copy lives in `src/lib/content.ts` as the default template. Published edits in `data/` are kept separately and are not touched by an import.

## Scripts

- `npm run dev` — dev server on port 4721
- `npm run build` / `npm start` — production build and server
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript
