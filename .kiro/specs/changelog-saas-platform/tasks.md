# Implementation Plan: ReleaseDock Changelog SaaS Platform

## Overview

Incremental implementation of the ReleaseDock platform, starting with the Convex data layer and validation logic, then building the onboarding flow, dashboard, editor, public API, public page, and finally the embeddable widget. Each task builds on the previous, ensuring no orphaned code.

## Tasks

- [x] 1. Extend Convex schema and implement core validation utilities
  - [x] 1.1 Update `convex/schema.ts` to add workspaces, projects, changelogs, and labels tables with all fields and indexes as defined in the data model
    - Add `onboardingCompleted` field to users table
    - _Requirements: 1.5, 2.2, 6.4, 3.1_
  - [x] 1.2 Create `lib/validation.ts` with slug validation function (regex, length, reserved slugs) and API key generation function (`rd_` prefix + 32 hex chars)
    - _Requirements: 1.2, 2.1_
  - [ ]* 1.3 Write property tests for slug validation
    - **Property 1: Slug validation accepts only valid formats**
    - **Validates: Requirements 1.2**
  - [ ]* 1.4 Write property tests for API key uniqueness
    - **Property 3: API key uniqueness**
    - **Validates: Requirements 2.1**

- [x] 2. Implement workspace and project Convex mutations/queries
  - [x] 2.1 Create `convex/workspaces.ts` with `createWorkspace` mutation (slug uniqueness check, validation), `getWorkspaceBySlug` query, and `getWorkspaceByOwner` query
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [x] 2.2 Create `convex/projects.ts` with `createProject` mutation (auto-generates API key, sets default widget settings), `getProjectsByWorkspace` query, `regenerateApiKey` mutation, and `updateWidgetSettings` mutation
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [ ]* 2.3 Write property tests for workspace creation persistence
    - **Property 2: Workspace creation persists all required fields**
    - **Validates: Requirements 1.5, 4.2**
  - [ ]* 2.4 Write property tests for project creation and API key regeneration
    - **Property 4: Project creation persists all required fields**
    - **Property 5: API key regeneration produces a different key**
    - **Validates: Requirements 2.2, 2.3, 4.3**
  - [ ]* 2.5 Write property test for widget settings round-trip
    - **Property 6: Widget settings round-trip**
    - **Validates: Requirements 2.4**

- [x] 3. Implement label and changelog Convex mutations/queries
  - [x] 3.1 Create `convex/labels.ts` with `createLabel` mutation (duplicate name check), `getLabelsByProject` query, and `deleteLabel` mutation (cascade remove from changelogs)
    - _Requirements: 3.1, 3.2, 3.3_
  - [x] 3.2 Create `convex/changelogs.ts` with `createChangelog` mutation (initial status draft), `updateChangelog` mutation, `publishChangelog` mutation (sets status + publishDate), `getChangelogsByProject` query (with optional status filter), and `getPublishedChangelogsByProject` query (ordered by publishDate desc)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  - [ ]* 3.3 Write property tests for label management
    - **Property 7: Label creation requires name and color**
    - **Property 8: Label name uniqueness per project**
    - **Property 9: Label deletion cascades to changelogs**
    - **Validates: Requirements 3.1, 3.2, 3.3**
  - [ ]* 3.4 Write property tests for changelog management
    - **Property 14: Changelog status filter correctness**
    - **Property 15: Changelog save persists all fields**
    - **Property 16: Publishing sets status and records date**
    - **Property 17: Editing a published changelog preserves publish date**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**

- [x] 4. Checkpoint - Core data layer
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement onboarding flow
  - [x] 5.1 Create `app/onboarding/page.jsx` with multi-step wizard component managing steps 1-4 and onboarding state
    - Step 1: Workspace form (name, slug with live validation, website URL)
    - Step 2: Auto-create default project, show progress
    - Step 3: Editor prompt or skip button
    - Step 4: Embed snippet display with copy-to-clipboard, pre-filled with project API key
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - [x] 5.2 Add onboarding redirect logic in `middleware.ts` — check `onboardingCompleted` flag and redirect unonboarded users to `/onboarding`
    - _Requirements: 4.1, 4.7_
  - [x] 5.3 Create `convex/onboarding.ts` with `completeOnboarding` mutation that sets `onboardingCompleted` to true on the user record
    - _Requirements: 4.6_
  - [ ]* 5.4 Write property tests for onboarding routing and completion
    - **Property 10: Onboarding routing based on completion flag**
    - **Property 11: Embed snippet contains project API key**
    - **Property 12: Onboarding completion sets flag**
    - **Validates: Requirements 4.1, 4.5, 4.6, 4.7**

- [ ] 6. Implement dashboard layout and navigation
  - [x] 6.1 Create `app/dashboard/layout.jsx` with persistent sidebar navigation (links to changelogs, widget settings, API keys, labels) and a project switcher component
    - Create `components/Sidebar.jsx` and `components/ProjectSwitcher.jsx`
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 6.2 Create `app/dashboard/page.jsx` as the dashboard home redirecting to changelogs list
    - _Requirements: 5.1_
  - [ ]* 6.3 Write property test for project switching scoping
    - **Property 13: Project switching scopes changelog data**
    - **Validates: Requirements 5.3**

- [ ] 7. Implement changelog list and management pages
  - [x] 7.1 Create `app/dashboard/changelogs/page.jsx` with changelog list view showing title, status, publish date, and labels, with draft/published filter tabs
    - Create `components/StatusFilter.jsx` for filter tabs
    - _Requirements: 6.1, 6.2_
  - [x] 7.2 Create `app/dashboard/changelogs/new/page.jsx` and `app/dashboard/changelogs/[id]/page.jsx` for creating and editing changelogs, wiring up the BlockNote editor and save/publish actions
    - _Requirements: 6.3, 6.4, 6.5, 6.6_

- [ ] 8. Implement BlockNote rich text editor
  - [x] 8.1 Install `@blocknote/core`, `@blocknote/react`, and `@blocknote/mantine` packages. Create `components/ChangelogEditor.jsx` wrapping BlockNote with dark theme, slash commands, drag handles, and support for text, h1-h3, bulleted list, numbered list block types
    - _Requirements: 7.1, 7.2, 7.3, 7.7_
  - [x] 8.2 Create `convex/storage.ts` with `generateUploadUrl` mutation for Convex file storage. Wire image upload into the BlockNote editor's file upload handler
    - _Requirements: 7.4_
  - [x] 8.3 Implement serialization helpers in `lib/blocknote.ts` — functions to serialize editor state to BlockNote JSON and deserialize BlockNote JSON back to editor state. Create a `components/ChangelogRenderer.jsx` component that renders BlockNote JSON as read-only HTML
    - _Requirements: 7.5, 7.6, 11.1, 11.2, 11.4_
  - [ ]* 8.4 Write property test for BlockNote JSON round-trip
    - **Property 23: BlockNote JSON round-trip**
    - **Validates: Requirements 7.5, 7.6, 11.1, 11.2, 11.3**
  - [ ]* 8.5 Write property test for BlockNote JSON to HTML rendering
    - **Property 24: BlockNote JSON to HTML rendering preserves content**
    - **Validates: Requirements 11.4**

- [x] 9. Checkpoint - Dashboard and editor
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement dashboard settings pages
  - [x] 10.1 Create `app/dashboard/settings/widget/page.jsx` with widget theming form (primary color picker, position toggle, branding toggle) and embed code display with copy button
    - _Requirements: 2.4, 4.5_
  - [ ] 10.2 Create `app/dashboard/settings/api-keys/page.jsx` with API key display (masked) and regenerate button with confirmation dialog
    - _Requirements: 2.3_
  - [ ] 10.3 Create `app/dashboard/settings/labels/page.jsx` with label CRUD interface (create form, list with delete buttons, color picker)
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 11. Implement public API (Convex HTTP actions)
  - [x] 11.1 Create `convex/http.ts` with HTTP action for `GET /api/changelogs` — validates API key, fetches published changelogs for the project ordered by publishDate desc, returns JSON with title, content, publishDate, labels, and widget settings. Set CORS headers for cross-origin access
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  - [x] 11.2 Add HTTP action for `GET /api/changelog-page/:slug` — resolves slug to workspace, returns published changelogs for the public page
    - _Requirements: 10.1_
  - [ ]* 11.3 Write property tests for public API
    - **Property 19: Public API returns published changelogs with required fields, ordered by date descending**
    - **Property 20: Invalid API key returns 401**
    - **Validates: Requirements 9.1, 9.2, 9.3**
  - [ ]* 11.4 Write unit test for CORS headers
    - Test that response includes `Access-Control-Allow-Origin: *` header
    - _Requirements: 9.4_

- [x] 12. Implement public changelog page
  - [x] 12.1 Create `middleware.ts` subdomain extraction logic — detect `{slug}.releasedock.co` pattern and rewrite to internal route `/changelog/[slug]`
    - _Requirements: 10.1_
  - [x] 12.2 Create `app/changelog/[slug]/page.jsx` as a server component that fetches published changelogs via the HTTP action and renders them using `ChangelogRenderer` with title, publishDate, labels, ordered by date descending. Return 404 for unknown slugs
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  - [ ]* 12.3 Write property tests for public page
    - **Property 21: Public page resolves slug and renders all published changelogs**
    - **Property 22: Public page displays changelogs ordered by publish date descending**
    - **Validates: Requirements 10.1, 10.2, 10.3**

- [x] 13. Checkpoint - Public API and page
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Implement embeddable widget
  - [x] 14.1 Set up `widget/` directory with `vite.config.ts` configured for IIFE library build output (`ReleaseDock` global name), `widget/src/index.ts` entry point, and `widget/package.json` with React, ReactDOM, and Vite dependencies
    - _Requirements: 8.10_
  - [x] 14.2 Implement `widget/src/index.ts` — read `data-project` from script tag, create Shadow DOM container on document.body, inject styles, mount React app, set up `window.ReleaseDock` API (`open`, `close`, `markAsRead`), attach click listeners to `[data-releasedock-changelog]` elements
    - _Requirements: 8.1, 8.2, 8.7, 8.8_
  - [x] 14.3 Implement `widget/src/api.ts` for fetching changelogs from the public API using the project key, and `widget/src/storage.ts` for localStorage last-visit tracking
    - _Requirements: 8.3, 8.6_
  - [x] 14.4 Implement `widget/src/Launcher.tsx` (floating button with configurable position and unread badge count) and `widget/src/Feed.tsx` (popup changelog feed rendering titles, dates, labels, and rich text content with theming support)
    - _Requirements: 8.4, 8.5, 8.6, 8.9_
  - [ ]* 14.5 Write property test for unread badge count calculation
    - **Property 18: Unread badge count matches changelogs after last visit**
    - **Validates: Requirements 8.6**
  - [ ]* 14.6 Write unit tests for widget initialization
    - Test Shadow DOM creation, data-project attribute reading, window.ReleaseDock API surface
    - _Requirements: 8.1, 8.2, 8.8_
