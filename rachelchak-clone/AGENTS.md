# Danica's Desk Portfolio

This repository contains Danica Hartawan's personal portfolio: selected projects, experiments, an about page, and the objects and ideas currently on Danica's desk.

## Keep this file current

Treat this as living documentation. Whenever the portfolio's structure, navigation, content model, interactions, or development workflow changes, update this file in the same change so it continues to describe the live site accurately.

## Local setup

- Start locally from this directory with `python3 -m http.server 8765`.
- Open `http://127.0.0.1:8765/`.
- No build step is currently required.

## Current pages and navigation

- `index.html` — homepage with intro, desk objects, project and experiment filters, a scroll-driven horizontal project rail, and the in-page About section.
- `info.html` — legacy standalone copy of Danica's About content; primary navigation now jumps to `index.html#about`.
- `AGENTS.md` — the internal project-maintenance guide.
- `AGENTS.txt` — the public, plain-text, agent-readable version of Danica's portfolio.
- Primary navigation: Home, About, AGENTS.txt. About is an in-page anchor on the homepage.
- The homepage clock displays live Berkeley, California time.
- The homepage footer links to Danica's LinkedIn, Substack, YouTube, and Berkeley email.

## Design direction

- Preserve the compact editorial character of the layout.
- Keep the intro typography at its current scale; avoid oversized text and excessive whitespace.
- Use the display typeface selectively for Danica's name and emphasized phrases.
- Keep desk objects grouped along the outer edges so the intro remains readable.
- Keep the pen in the lower-left desk cluster and the watch in the upper-left cluster, outside the intro copy.
- Keep Nudge and the watch together in the upper-left desk cluster, and keep the folder toward the right edge without overlapping AirDrop.
- Keep inactive project/experiment cards out of the horizontal scroll range.
- Project cards retain their original image dimensions and use Albert Sans for captions.
- Project headlines span the full card width; category metadata sits underneath.
- Vertical page scrolling drives the desktop horizontal project rail.
- Desktop project scrolling is accelerated so the in-page About section arrives without an excessively long vertical scroll.

## Important files

- `css/project-rail.css` — portfolio-specific layout, typography, desk-object placement, card captions, and responsive behavior.
- `js/project-rail.js` — navigation customization, Berkeley clock, filters, and horizontal scrolling.
- `js/desk-decor.js` — desk-object markup and reveal behavior.
- `assets/desk/` — desk-object images.
- `assets/danica-about-photo.png` — portrait used in the homepage About section and legacy About page.
- `assets/projects/` — optimized project demos and poster frames for Cady, Lucid, Luxo, Toko, Yarn, and NVIDIA.
- `assets/experiments/` — optimized personal experiment imagery plus the YouTube demo and poster.

## Editing guidelines

- Preserve responsive behavior and verify narrow and wide viewports.
- Keep the center of the intro clear of decorative objects.
- Do not enlarge project cards unless Danica explicitly requests it.
- When changing a project, update its image, headline, link, and metadata together.
- Keep the homepage project order: Cady, Lucid, Luxo, Toko, Yarn, NVIDIA.
- Keep the experiment order newest/backward as: YouTube, accessible software/hardware freelance work, teaching, mentor, snowboarding, pottery, thesis.
- Verify visual changes in the local browser before finishing.
