# mc.myztic.dev

Static website for **mc.myztic.dev**.

## Structure

- `index.html` — page markup
- `assets/css/styles.css` — site styles
- `assets/js/app.js` — site interactions
- `Dockerfile` — production container
- `nginx.conf` — Nginx config

## Run with Docker

```bash
docker build -t mc-myztic-dev .
docker run --rm -p 8080:80 mc-myztic-dev
```

Open `http://localhost:8080`.

## Dokploy

Create an application from this GitHub repository and use the **Dockerfile** build type.

- Branch: `main`
- Dockerfile: `Dockerfile`
- Container port: `80`
- Domain: `mc.myztic.dev`

No environment variables or persistent volumes are required.

## Project downloads

The Flesh2Leather page includes a saved release download list so downloads work
without JavaScript. `assets/js/releases.js` checks the public GitHub latest-release
endpoint on page load and refreshes the list with the latest stable release's
uploaded assets. If the request fails, the saved links remain available with a
notice linking visitors to GitHub releases. No token is required.

Version-specific filenames follow `Flesh2Leather-<Minecraft-version-range>.zip`.
The all-versions bundle and checksums are listed separately. When updating the
saved HTML, keep its tag, date, and asset URLs from the same published release.

Run download logic checks with `node --test tests/releases.test.mjs`.

## Interface icons

Interface symbols use locally served Feather SVG icons (v4.29.2), styled through
CSS masks to inherit link and button colors. Keep text labels alongside icons and
mark decorative icon spans `aria-hidden="true"`. New interface actions should use
SVG icons rather than emoji or Unicode arrow characters.

Source: https://github.com/feathericons/feather/tree/v4.29.2/icons
License: `assets/icons/LICENSE` (MIT).

## Homepage project cards

Add released projects as `article.project-entry` elements inside `.project-grid`
in `index.html`. Each card contains an icon, project name, type/version line,
one-sentence description, and download/details/source links. The grid has two
columns on wider screens and one on mobile. Keep recipe tables and installation
steps on individual project pages. Planned projects stay in the separate notes
section until released.
