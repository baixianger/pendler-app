# pendler-app

Supplementary assets for **Pendler: Danish Transit**, the iOS app.

This is the public companion repo to the private [`baixianger/Pendler`](https://github.com/baixianger/Pendler)
source repository. Everything in here is about *shipping* the app — metadata,
release notes, the product website, screenshots, and the privacy policy —
not about the iOS code itself.

## What lives here

```
pendler-app/
├── index.html                    Product site homepage (GitHub Pages)
├── releases.html                 Release notes page (GitHub Pages)
├── privacy.html                  Privacy policy (GitHub Pages)
├── appstore-metadata.md          App Store Connect copy: name, subtitle,
│                                 description, keywords (da / en / zh-Hans)
├── releases/                     Per-version release archive (markdown)
│   └── 1.0.1.md                  Each file mirrors one ASC "What's New"
├── assets/                       Static images used by the website
│   ├── app-icon.png
│   ├── og-image.png
│   ├── bus.png / metro.png / s-tog.png
│   └── mockup.png
├── marketing/                    Hero/mockup images for the homepage carousel
│   ├── 01-hero.png
│   ├── 02-live-activity.png
│   ├── 03-map.png
│   ├── 04-schedule.png
│   └── 05-download.png
├── screenshots/                  Raw App Store screenshots (per-device sizes)
└── screenshot-generator/         Next.js app that renders the screenshots
```

## The website

Served from GitHub Pages at **<https://baixianger.github.io/pendler-app/>**.

Three pages, each a plain static HTML file with inline CSS/JS (no build step,
no framework):

| Page | URL | Purpose |
| --- | --- | --- |
| Home | `/` | Product pitch, features, screenshot carousel, Discord link |
| Release notes | `/releases.html` | What's new in each version, tri-lingual tabs |
| Privacy | `/privacy.html` | Privacy policy (required by App Store) |

To preview locally, any HTTP static server works:

```bash
cd pendler-app
python3 -m http.server 8000
# then open http://localhost:8000
```

## Adding a new release

When a new version of Pendler ships:

1. **Write the markdown archive** — copy `releases/1.0.1.md` to
   `releases/X.Y.Z.md` and fill in:
   - Metadata table (version, build, commit hashes)
   - Summary (user-facing changes, internal changes, known issues)
   - App Store Connect "What's New" text in three languages
2. **Add a card to `releases.html`** — copy the existing `<article
   class="release">` block and update:
   - Version / build / release date in the header
   - Three `<div class="lang-content">` panels with the new release notes
   The tab-switching script works automatically for any number of release
   cards.
3. **Update the "release notice" pill on `index.html`** — point to the
   new version in the header text. The pill already links to
   `releases.html` so the URL doesn't change.
4. **Commit and push** — GitHub Pages will rebuild within a minute.

```bash
cd pendler-app
git add releases/X.Y.Z.md releases.html index.html
git commit -m "docs: add X.Y.Z release notes"
git push
```

## App Store Connect copy

`appstore-metadata.md` is the canonical source for the text that goes into
App Store Connect:

- **Name**, **subtitle**, **promotional text**, **keywords**, **description**
- Three languages: Danish (`da`, primary), English (`en-US`), Simplified
  Chinese (`zh-Hans`)

The marketing *description* (the paragraphs) lives in
`appstore-metadata.md`. The per-version *release notes* (the "What's New"
bullets) live in `releases/X.Y.Z.md`. These two are intentionally
separated — description changes rarely, release notes change every release.

## Screenshot generator

`screenshot-generator/` is a Next.js app used to render the hero / feature
screenshots at the exact pixel sizes App Store Connect requires
(1290×2796 for iPhone 15 Pro Max, 1320×2868 for iPhone 16 Pro Max, etc.).
See its own README for how to run it.

## Related

- **[App Store — Pendler: Danish Transit](https://apps.apple.com/dk/app/pendler-danish-transit/id6761691300)** —
  live on the App Store (App ID `6761691300`).
- **[`baixianger/Pendler`](https://github.com/baixianger/Pendler)** — iOS
  source code (private). XcodeGen project, SwiftUI, ActivityKit, Rejseplanen
  API client.
- **Product site** — <https://baixianger.github.io/pendler-app/>
- **Discord** — <https://discord.gg/MmyCD9X4Fs>
- **Issues** — <https://github.com/baixianger/pendler-app/issues>
- **Email** — <crea.bai@gmail.com>
