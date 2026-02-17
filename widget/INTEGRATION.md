# Widget Integration Guide

## Setup

1. Navigate to the widget directory:
```bash
cd widget
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Convex site URL:
```bash
VITE_CONVEX_SITE_URL=https://your-deployment.convex.site
```

4. Build the widget:
```bash
npm run build
```

Output: `dist/releasedock.js` — a self-contained IIFE bundle (~8KB gzipped with Preact).

## Deployment

Upload `dist/releasedock.js` to your CDN or static hosting.

## Integration Options

### Option 1: Single Script Tag (simplest)

```html
<script src="https://cdn.releasedock.co/widget.js" data-project="rd_abc123..." async></script>
```

### Option 2: Config Object (Beamer-style, more flexible)

```html
<script>
  window.releasedock_config = {
    project: "rd_abc123..."
  };
</script>
<script src="https://cdn.releasedock.co/widget.js" async></script>
```

The config object pattern is useful when loading the script dynamically or when you need to set the API key from application state.

## Features

### Automatic Launcher
Floating button in the configured corner (bottom-right or bottom-left).

### Unread Badge
Shows count of changelogs published since the user's last visit (localStorage).
Opening the feed automatically marks all entries as read.

### Custom Triggers
Any element with `data-releasedock-changelog` opens the feed on click:

```html
<button data-releasedock-changelog>See What's New</button>
```

### JavaScript API

```javascript
window.ReleaseDock.open();
window.ReleaseDock.close();
window.ReleaseDock.markAsRead();
```

## Architecture

- **Preact**: ~3KB UI framework (replaces React for minimal bundle size)
- **Shadow DOM**: Complete CSS isolation from host site
- **IIFE Bundle**: Self-contained, zero external dependencies
- **localStorage**: Tracks last visit for unread count
- **Convex HTTP API**: Fetches published changelogs (URL baked in at build time)

## Bundle Size

Target: ~8-12KB gzipped (Preact + all widget code).

## Browser Support

All modern browsers with Shadow DOM support (Chrome 53+, Firefox 63+, Safari 10+, Edge 79+).
