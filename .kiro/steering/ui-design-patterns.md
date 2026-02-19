---
inclusion: auto
---

# UI Design Patterns

This document captures the design language and component patterns used across ReleaseDock. Follow these patterns when building new UI to keep the product visually consistent and polished.

## Design Tokens

All colors, spacing, radii, and shadows come from `constants/theme.js`. Never hardcode color values — always reference the theme object. This is the single source of truth for the visual language.

## Modal Pattern

Reference implementation: `components/PreviewModal.jsx`

Modals follow a three-zone layout:

1. Header — title + subtitle on the left, close (×) button on the right. Separated by a `theme.neutral.border` bottom border. Padding: `16px 24px`.
2. Body — scrollable content area with `flex: 1` and `overflow: auto`. Padding: `24px`.
3. Footer (when actions are needed) — right-aligned buttons separated by a top border. Padding: `16px 24px`.

Key details:
- Backdrop uses `rgba(0,0,0,0.5)` with `position: fixed; inset: 0`.
- Modal container uses `maxWidth` constraint, `maxHeight: 90vh`, `flexDirection: column`, and `overflow: hidden`.
- Close button is a minimal icon button with `theme.text.tertiary` color, no background.
- `e.stopPropagation()` on the modal container to prevent backdrop click-through.

## Browser Frame Pattern

Reference: `BrowserFrame` in `components/PreviewModal.jsx`

When showing how something looks on a user's website, wrap the preview in a fake browser chrome:

- Three colored dots: `#ff5f57` (red), `#febc2e` (yellow), `#28c840` (green) — 10px circles.
- A centered URL bar with light gray text (`#999`) on white background, `borderRadius: 6`.
- Title bar background: `#e8e8e8`, page area background: `#fafafa`.
- Include skeleton content lines (varying widths of gray rounded rectangles) behind the actual preview element to simulate a real page.

This pattern makes previews feel realistic and contextual rather than floating in a void.

## Skeleton / Placeholder Content

When simulating page content behind overlays or in loading states:

- Use rounded rectangles (`borderRadius: 3-4px`) with `backgroundColor: #e5e5e5` or `#ececec`.
- Vary widths (40%, 55%, 65%, 70%) to look natural — never make them all the same width.
- Use `height: 8-14px` depending on whether it represents a heading or body text.
- Space them with `marginBottom: 6-12px`.

## Pill Selector Pattern

Reference: the type selector row in `PreviewModal.jsx`

When offering a set of mutually exclusive options (like preview types):

- Horizontal row of pill buttons with `icon + label`.
- Active state: `border: 1.5px solid theme.brand.primary`, `backgroundColor: theme.brand.primaryLight`, `color: theme.brand.primary`.
- Inactive state: `border: 1.5px solid theme.neutral.border`, `backgroundColor: theme.neutral.white`, `color: theme.text.muted`.
- Hover: transition border and background to the active colors.
- Font: `12px`, `fontWeight: 500`, `whiteSpace: nowrap`.
- Icons: 20×20 SVG with `strokeWidth: 1.5`.

## Dropdown Pattern

Reference: `components/PreviewDropdown.jsx`

Contextual dropdowns that appear from icon buttons:

- Positioned `absolute`, anchored to the trigger with `top: 100%; right: 0; marginTop: 4px`.
- Container: white background, `theme.neutral.border` border, `theme.radius.md` corners, `theme.shadow.lg`.
- Section header: `10px` uppercase text with `letterSpacing: 0.04em` in `theme.text.tertiary`.
- Items: full-width buttons with `icon + label + description` layout. `8px 12px` padding.
- Hover: `theme.neutral.hover` background.
- Close on outside click using a `mousedown` listener with a ref.

## Live Preview / Overlay Pattern

Reference: `components/LivePreview.jsx`

When rendering a live preview of how content appears to end users:

- Render directly on the page using `position: fixed` with high z-index (99997+).
- Use the actual production rendering component (`ChangelogRenderer`) — never mock the content.
- Include a `PreviewBadge` — a small fixed pill at `bottom: 20px; left: 50%` with dark background, white text, showing the preview type name and a close button. z-index: 100000 (above everything).
- Each preview type has its own backdrop behavior:
  - Widget/Popup: semi-transparent backdrop that closes on click.
  - Banner: no backdrop (it's non-intrusive by nature).
  - Snippet: transparent backdrop for click-to-close without visual dimming.

## Accent Bar Pattern

Used in Popup, Snippet, and similar notification-style components:

- A thin `3px` bar at the very top of the container using `theme.brand.primary`.
- Signals "this is a branded notification" without being heavy.
- Always `flexShrink: 0` so it doesn't collapse in flex containers.

## "New Update" Badge Pattern

Used in Popup and Snippet previews:

- Sparkle icon (star/diamond SVG) + uppercase label "New Update".
- Font: `10-11px`, `fontWeight: 600`, `textTransform: uppercase`, `letterSpacing: 0.04-0.05em`.
- Color: `theme.brand.primary`.
- Often paired with a small icon container (`20-22px` square, `theme.brand.primaryLight` background, `borderRadius: 4-5px`).

## Label Badge Pattern

Labels are displayed as colored pills throughout the app:

- `borderRadius: 9999px` (full pill shape).
- Background: label color at 20% opacity (`${color}20`).
- Text: the label's full color.
- Font: `10-12px`, `fontWeight: 500`.
- Padding: `2px 8-10px`.
- In compact contexts (table rows, small cards), use smaller sizing: `1px 6px` padding, `9px` font.

## Inline Action Buttons (Table Rows)

Reference: the Actions column in `app/dashboard/changelogs/page.jsx`

- Icon-only buttons: `28×28px`, no border, transparent background.
- Color: `theme.text.tertiary`, hover: `theme.text.secondary` with `theme.neutral.hover` background.
- Use Heroicons-style SVGs at `w-3.5 h-3.5` (14px).
- Always include `title` attribute for accessibility.
- Use `e.stopPropagation()` when inside clickable rows.

## General Principles

- Inline styles using the theme object are the standard — this keeps components self-contained and avoids CSS class collisions.
- Hover states are handled via `<style>` blocks with class-based selectors and `!important` to override inline styles.
- Transitions: `0.1-0.15s` for color/background changes. Keep it snappy.
- Font sizes stay small and precise: `10-13px` for UI chrome, `14-16px` for content.
- Spacing follows an 8pt-ish grid but isn't rigid — use what looks right.
- Shadows are subtle: `theme.shadow.sm` for elevated elements, `theme.shadow.lg` for floating panels/modals.
- When in doubt, look at how Beamer or AnnounceKit handle the same UI element and aim for that level of polish at minimum.
