# Hearh

Static React app prepared for GitHub Pages. The app has no external app
platform dependency at runtime or build time.

Content is served from local seeded data in `src/api/localData.js`. Edits made
through admin screens are saved to the visitor's browser `localStorage`, so
they are useful for local/static editing previews but are not shared between
users.

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
