# ReleaseDock Widget

The embeddable changelog widget for ReleaseDock.

## Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your Convex URL:
```bash
VITE_CONVEX_URL=https://your-convex-deployment.convex.cloud
```

3. Run development server:
```bash
npm run dev
```

## Building

Build the production widget bundle:
```bash
npm run build
```

The output will be in `dist/releasedock.js` as an IIFE bundle.

## Usage

Add the widget to any website:

```html
<script src="https://your-cdn.com/releasedock.js" data-project="rd_your_api_key_here"></script>
```

### Programmatic API

```javascript
// Open the changelog feed
window.ReleaseDock.open();

// Close the changelog feed
window.ReleaseDock.close();

// Mark all changelogs as read
window.ReleaseDock.markAsRead();
```

### Custom Triggers

Add the `data-releasedock-changelog` attribute to any element to make it open the changelog when clicked:

```html
<button data-releasedock-changelog>What's New?</button>
```

## Features

- Shadow DOM isolation for CSS encapsulation
- Configurable position (bottom-right or bottom-left)
- Unread badge count based on last visit
- Theming support (primary color, branding toggle)
- Rich text content rendering (BlockNote JSON)
- localStorage-based read tracking
- Responsive design
- ~40-50KB gzipped bundle size
