# Hearh

/*
 * TODO: PRE-DEPLOYMENT STEPS
 * Set the repository variable `VITE_BASE44_APP_ID` in GitHub:
 * Settings -> Secrets and variables -> Actions -> Variables.
 * The value must be the Base44 application ID for this exported app.
 * Optional: set `VITE_BASE44_BACKEND_URL`; it defaults to `https://base44.app`.
 */

Static React export prepared for GitHub Pages.

## Development

```bash
npm ci
npm run dev
```

## Production build

```bash
npm run build
```

The build outputs to `dist/` and copies `index.html` to `404.html` so direct
React Router URLs work on GitHub Pages.
