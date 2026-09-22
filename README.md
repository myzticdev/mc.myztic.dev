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
