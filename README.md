# CBI Website — Center for Biologic Imaging, University of Pittsburgh

A static rebuild of [cbi-pitt.webflow.io](https://cbi-pitt.webflow.io/) with a modern, dark "fluorescence" design. Built with [Eleventy (11ty)](https://www.11ty.dev/) — no runtime frameworks, just plain HTML/CSS/JS output.

**Live URL (after deploy):** `https://cbipitt.github.io`

## Quick start

```bash
npm install
npm run dev        # dev server with live reload → http://localhost:8080
npm run build      # build static site into _site/
```

To preview the production build locally:

```bash
cd _site && python3 -m http.server 8000
```

## Deploying to GitHub Pages

This repo is set up to deploy automatically via GitHub Actions.

1. Create a repo named **`cbipitt.github.io`** under your `cbipitt` organization (this exact name makes the site serve at the domain root).
2. Push this code to the `main` branch of that repo.
3. In the repo settings → **Pages** → set **Source** to **GitHub Actions**.
4. Every push to `main` rebuilds and deploys automatically (`.github/workflows/deploy.yml`).

## Updating content

All page content lives in data files — edit, commit, and the site rebuilds automatically.

| Content | File |
|---|---|
| Site name, phones, external links, logos | `_data/site.json` |
| Faculty & staff (bios, emails, photos) | `_data/staff.json` |
| Equipment (41 instruments, tiers, rooms) | `_data/equipment.json` |
| News posts | `news/*.md` (one markdown file per post) |
| Image gallery | `_data/gallery.json` |
| Mosaic gallery | `_data/mosaics.json` |
| Periodic table of EM (118 elements) | `_data/periodic.json` |
| Protocols, recipes, training docs | `_data/protocols.json` |
| Journal covers & publication PDFs | `_data/publications.json` |
| Usage policy sections | `_data/usage_policy.json` |

**Adding a news post:** drop a new markdown file into `news/`:

```markdown
---
title: "Our new microscope"
date: "October 1, 2026"
image: "assets/images/news/photo.jpg"
permalink: /news/our-new-microscope.html
layout: base
---
The text of the post goes here.
```

**Adding equipment:** append an object to the `equipment.json` array — it will appear on the equipment page with the correct filter tier.

**Adding photos/documents:** put files under `assets/images/<category>/` or `assets/docs/`, then reference them by relative path in the relevant data file.

## Structure

```
├── _data/            # all content (JSON)
├── _includes/base.njk  # shared layout: sidebar nav, footer, contact panel, lightbox
├── news/             # news posts (markdown)
├── *.njk             # the 13 page templates
├── css/style.css     # design system (dark "fluorescence" theme)
├── js/main.js        # nav, lightbox, filters, reveal animations
├── assets/           # images + documents (migrated from Webflow CDN)
└── .github/workflows/deploy.yml
```

## Design notes

- Dark charcoal base with fluorophore accent colors (DAPI cyan, Texas-Red magenta, GFP green)
- Fraunces (display serif) + Inter (body) from Google Fonts
- All content is rendered to plain static HTML at build time — JS is only used for the lightbox, equipment filter, mobile nav and scroll animations
- The original "Get in Touch" form (which needed a backend) is replaced by a static contact panel with emails and phone numbers
