# archieabeleda.dev

Source for my personal site. A static, single-page portfolio. No framework, no
build step. Three files and some paranoia.

**Live:** https://archieabeleda.dev

![Hosting](https://img.shields.io/badge/hosting-Firebase-orange?style=flat-square)
![Build](https://img.shields.io/badge/build-none-14b8a6?style=flat-square)
![Deploy](https://img.shields.io/badge/deploy-keyless%20OIDC-14b8a6?style=flat-square)
![HTTPS](https://img.shields.io/badge/HTTPS-enforced-14b8a6?style=flat-square)

## What this is

A one-page site. A fixed left rail for identity, and switchable panels for about,
capabilities, lab and projects, tech stack, and contact. Written by hand in plain
HTML, CSS, and a little vanilla JavaScript. No React, no bundler, nothing to
install.

The look is a telemetry console. Dark, a single teal accent, monospace labels,
and a slow topology mesh drifting behind everything on an HTML canvas. Boring by
design, which is the entire brief.

## Layout

```
public/
  index.html    the words
  styles.css    the look
  app.js        panel switching and the background mesh
firebase.json   hosting config and security headers
```

No dependencies. No build. Edit a file, push, it ships.

## Hosting and deploys

Hosted on Firebase Hosting behind a custom domain, served only over HTTPS.

Deploys are automated and keyless. Every push to `main` runs a GitHub Action that
authenticates to Google Cloud with a short-lived OIDC token through Workload
Identity Federation, then deploys. No long-lived service account key is stored
anywhere, not in the repo and not in the CI secrets.

## Security

- Static, serverless, no database. Minimal attack surface by construction.
- Strict Content-Security-Policy and security headers set in `firebase.json`.
- HTTPS only, enforced by the `.dev` domain.
- Keyless CI. Nothing durable to leak.

## Run it locally

It is static, so any web server works. With Python already on your machine:

```
cd public
python -m http.server 8000
```

Then open http://localhost:8000.

## License

MIT. See [LICENSE](https://github.com/archieabeleda/portfolio/blob/main/LICENSE). Free to use and adapt. A link back to archieabeleda.dev is appreciated, not required.
