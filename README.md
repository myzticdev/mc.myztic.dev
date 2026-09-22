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
