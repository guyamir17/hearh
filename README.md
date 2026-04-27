# Hearh

Static React app prepared for GitHub Pages. The app has no external app
platform dependency at runtime or build time.

Content is served from source-controlled static data in `src/api/localData.js`.
The published site is read-only: contact, newsletter, and product actions use
plain email links instead of backend submissions.

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
