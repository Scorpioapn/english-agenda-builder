# English Agenda Builder

Static GitHub Pages app for building and printing a one-page English Toastmasters A4 meeting agenda for CBD Toastmasters Club.

## Main Page

- Root entry: `index.html`
- App page: `english_agenda_builder.html`

`index.html` redirects to `english_agenda_builder.html` so existing GitHub Pages links continue to work.

## File Structure

- `english_agenda_builder.html` - static app shell and editor/preview containers
- `styles/app.css` - editor, layout, responsive, and shared UI styles
- `styles/preview-ref.css` - A4 agenda preview and print styles
- `scripts/data.js` - default agenda data, field definitions, and constants
- `scripts/storage.js` - localStorage loading, saving, normalization, and migration
- `scripts/agenda-time.js` - duration parsing and automatic agenda time scheduling
- `scripts/render-editor.js` - editor field, agenda list, and validation rendering
- `scripts/render-preview.js` - A4 preview rendering and overflow detection
- `scripts/app.js` - app startup, event binding, import/export, QR uploads, and commands
- `assets/` - Toastmasters logo and default QR image assets

## Run Locally

Open `english_agenda_builder.html` directly in a browser, or serve the folder with any static file server:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/english_agenda_builder.html`.

## Deploy

This project has no build step. Push changes to the `main` branch and configure GitHub Pages to serve the repository root.

## Data Notes

- Draft edits are saved in browser `localStorage` under `cbd_english_agenda_builder_v2`.
- Export JSON creates a portable backup of the current agenda state.
- Import JSON restores an exported agenda and supports older unversioned drafts.
- QR images are stored as data URLs in localStorage, so uploaded images are limited to 1MB to reduce quota failures.
