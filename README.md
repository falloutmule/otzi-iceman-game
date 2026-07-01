# The Legend of Otzi the Iceman

A portrait-first, top-down, Canvas 2D, single-file HTML5 survival adventure prototype.

## Current milestone

Milestone 1 - Engine Shell.

## Runtime rule

The final playable artifact is:

```text
dist/index.html
```

No required external runtime assets, CDNs, fonts, sounds, or network calls.

## Development

```bash
npm install
npm run build
python -m http.server 8099
```

Open:

```text
http://127.0.0.1:8099/dist/index.html
```

## Tests

```bash
npx playwright test
```

## Source documents

See `docs/`.
