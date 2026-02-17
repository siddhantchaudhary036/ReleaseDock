# Requirements Document

## Introduction

ReleaseDock is a SaaS changelog platform that enables software teams to create, manage, and distribute product changelogs. Teams manage changelogs through a dashboard with a Notion-like rich text editor (BlockNote), and distribute them via an embeddable JavaScript widget (Shadow DOM with CSS isolation) and public changelog pages served at custom subdomains (`{slug}.releasedock.co`). The platform is built on Next.js 16 with a Convex backend, Clerk authentication, and Tailwind v4.

## Glossary

- **Dashboard**: The authenticated web application where users manage workspaces, projects, changelogs, and settings
- **Workspace**: A top-level organizational unit representing a team or company, identified by a unique URL slug
- **Project**: A container within a Workspace for changelogs, each with its own API key and widget configuration
- **Changelog_Entry**: A single changelog post with title, rich text content, status, labels, and metadata
- **Label**: A categorization tag (e.g. "New Feature", "Bug Fix") with a name and color, scoped to a Project
- **Onboarding_Flow**: The multi-step setup wizard shown to new users after sign-up
- **Editor**: The BlockNote-based rich text block editor used to compose Changelog_Entry content
- **Widget**: The embeddable JavaScript bundle that renders a changelog feed inside a Shadow DOM container on customer websites
- **Shadow_DOM_Container**: The isolated DOM subtree created by the Widget to prevent CSS conflicts with the host site
- **Launcher_Button**: The floating button rendered by the Widget that opens the changelog feed popup
- **Public_Changelog_Page**: The standalone webpage at `{slug}.releasedock.co` displaying all published changelogs for a Workspace
- **API_Key**: An auto-generated secret string used to authenticate Widget and API requests to a specific Project
- **Slug**: A URL-safe, lowercase, unique identifier used as the subdomain for a Workspace (e.g. `acme` in `acme.releasedock.co`)
- **Convex_HTTP_Action**: A serverless HTTP endpoint in Convex used to serve public API requests
- **Widget_Bundle**: The separate IIFE JavaScript artifact (~40-50KB gzipped) built via Rollup/Vite that powers the Widget

## Requirements

### Requirement 1: Workspace Management

**User Story:** As a user, I want to create and manage a workspace, so that I can organize my team's changelog projects under a single entity.

#### Acceptance Criteria

1. WHEN a user creates a workspace, THE Dashboard SHALL require a workspace name, a unique Slug, and a website URL
2. WHEN a user submits a Slug, THE Dashboard SHALL validate that the Slug is lowercase, URL-safe (only alphanumeric characters and hyphens), and unique across all workspaces
3. IF a user submits a Slug that is already taken, THEN THE Dashboard SHALL display an error message indicating the Slug is unavailable
4. IF a user submits a Slug containing uppercase letters or invalid characters, THEN THE Dashboard SHALL display a validation error describing the allowed format
5. WHEN a workspace is created, THE Dashboard SHALL store the workspace name, Slug, website URL, owner reference, and creation timestamp in the workspaces table

### Requirement 2: Project Management

**User Story:** As a workspace owner, I want to manage projects within my workspace, so that I can organize changelogs for different products or services.

#### Acceptance Criteria

1. WHEN a project is created within a workspace, THE Dashboard SHALL auto-generate a unique API_Key for the project
2. WHEN a project is created, THE Dashboard SHALL store the project name, API_Key, workspace reference, and default widget settings in the projects table
3. THE Dashboard SHALL allow the workspace owner to view and regenerate the API_Key for any project
4. WHEN a project's widget settings are updated, THE Dashboard SHALL persist the theme colors, position, and branding toggle to the projects table

### Requirement 3: Label Management

**User Story:** As a workspace owner, I want to create and manage labels for my projects, so that I can categorize changelog entries consistently.

#### Acceptance Criteria

1. WHEN a user creates a label, THE Dashboard SHALL require a label name and color, and associate the label with the current project
2. THE Dashboard SHALL prevent duplicate label names within the same project
3. WHEN a label is deleted, THE Dashboard SHALL remove the label association from all Changelog_Entry records that reference the deleted label

### Requirement 4: Onboarding Flow

**User Story:** As a new user, I want to be guided through initial setup after sign-up, so that I can quickly start publishing changelogs.

#### Acceptance Criteria

1. WHEN a signed-in user has not completed onboarding, THE Dashboard SHALL redirect the user to the Onboarding_Flow
2. WHEN the user completes Step 1 of the Onboarding_Flow, THE Dashboard SHALL create a Workspace with the provided name, Slug, and website URL
3. WHEN the user completes Step 2 of the Onboarding_Flow, THE Dashboard SHALL auto-create a default Project within the new Workspace and generate an API_Key
4. WHEN the user reaches Step 3 of the Onboarding_Flow, THE Dashboard SHALL present the Editor for creating a first Changelog_Entry or a skip option
5. WHEN the user reaches Step 4 of the Onboarding_Flow, THE Dashboard SHALL display the Widget embed snippet pre-filled with the project's API_Key
6. WHEN the user completes or skips all onboarding steps, THE Dashboard SHALL set the onboardingCompleted flag to true and redirect to the main Dashboard
7. WHILE the onboardingCompleted flag is true, THE Dashboard SHALL skip the Onboarding_Flow and load the main Dashboard directly

### Requirement 5: Dashboard Layout and Navigation

**User Story:** As a workspace owner, I want a sidebar-based dashboard layout, so that I can navigate between changelogs, settings, and projects efficiently.

#### Acceptance Criteria

1. THE Dashboard SHALL display a persistent sidebar navigation with links to changelogs, widget settings, and API key management
2. THE Dashboard SHALL include a project switcher component that allows the user to switch between projects within the current workspace
3. WHEN the user switches projects via the project switcher, THE Dashboard SHALL update all displayed data to reflect the selected project

### Requirement 6: Changelog Management

**User Story:** As a workspace owner, I want to create, edit, and manage changelog entries, so that I can communicate product updates to my users.

#### Acceptance Criteria

1. THE Dashboard SHALL display a list of all Changelog_Entry records for the selected project, showing title, status, publish date, and labels
2. WHEN the user filters the changelog list by status, THE Dashboard SHALL display only Changelog_Entry records matching the selected status (draft or published)
3. WHEN the user creates a new Changelog_Entry, THE Dashboard SHALL open the Editor with an empty document and set the initial status to draft
4. WHEN the user saves a Changelog_Entry, THE Dashboard SHALL persist the title, content as BlockNote JSON, status, labels, and author to the changelogs table
5. WHEN the user publishes a Changelog_Entry, THE Dashboard SHALL set the status to published and record the publish date
6. WHEN the user edits a published Changelog_Entry, THE Dashboard SHALL allow modifications to title, content, and labels while preserving the original publish date

### Requirement 7: Rich Text Editor

**User Story:** As a changelog author, I want a Notion-like block editor, so that I can compose rich, well-formatted changelog content.

#### Acceptance Criteria

1. THE Editor SHALL render a BlockNote block-based editing interface supporting text, heading (h1, h2, h3), bulleted list, and numbered list block types
2. WHEN the user types "/" in the Editor, THE Editor SHALL display a slash command menu listing all available block types
3. THE Editor SHALL provide drag handles on each block to allow reordering blocks via drag-and-drop
4. WHEN the user uploads an image in the Editor, THE Editor SHALL upload the file to Convex file storage and insert an image block with the stored file URL
5. WHEN a Changelog_Entry is saved, THE Editor SHALL serialize the editor state to BlockNote JSON format
6. WHEN a Changelog_Entry is loaded for editing, THE Editor SHALL deserialize the stored BlockNote JSON and render the content in the editor
7. THE Editor SHALL apply a dark theme with clean typography consistent with the ReleaseDock design system

### Requirement 8: Embeddable Widget

**User Story:** As a ReleaseDock customer, I want to embed a changelog widget on my website, so that my users can see product updates without leaving my site.

#### Acceptance Criteria

1. WHEN the Widget_Bundle script tag is loaded on a host page, THE Widget SHALL create a Shadow_DOM_Container to isolate its styles from the host page
2. WHEN the Widget initializes, THE Widget SHALL read the `data-project` attribute from the script tag to identify the target Project
3. WHEN the Widget initializes, THE Widget SHALL fetch published Changelog_Entry records from the Convex_HTTP_Action using the API_Key derived from the `data-project` attribute
4. THE Widget SHALL render a Launcher_Button as a floating element with a configurable position (bottom-right or bottom-left)
5. WHEN the user clicks the Launcher_Button, THE Widget SHALL open a popup displaying the changelog feed with titles, dates, labels, and rendered rich text content
6. THE Widget SHALL track the last visit timestamp in localStorage and display an unread badge count on the Launcher_Button for Changelog_Entry records published after the last visit
7. WHEN a host page element has the `data-releasedock-changelog` attribute, THE Widget SHALL open the changelog popup when that element is clicked
8. THE Widget SHALL expose a `window.ReleaseDock` API object with `open()`, `close()`, and `markAsRead()` methods for programmatic control
9. THE Widget SHALL apply theming (colors, branding) based on the project's widget settings fetched from the API
10. THE Widget_Bundle SHALL be built as a self-contained IIFE bundle via Rollup or Vite, targeting a gzipped size of 40-50KB

### Requirement 9: Public API for Widget

**User Story:** As a system integrator, I want a public API to fetch published changelogs, so that the Widget and external consumers can access changelog data.

#### Acceptance Criteria

1. WHEN a GET request is made to the published changelogs endpoint with a valid API_Key, THE Convex_HTTP_Action SHALL return a JSON array of published Changelog_Entry records for the associated Project, ordered by publish date descending
2. IF a request is made with an invalid or missing API_Key, THEN THE Convex_HTTP_Action SHALL return a 401 Unauthorized response
3. THE Convex_HTTP_Action SHALL include title, content, publish date, and labels in each Changelog_Entry response object
4. THE Convex_HTTP_Action SHALL set appropriate CORS headers to allow cross-origin requests from any domain

### Requirement 10: Public Changelog Page

**User Story:** As a website visitor, I want to view a public changelog page at a workspace's subdomain, so that I can browse all published product updates.

#### Acceptance Criteria

1. WHEN a request is made to `{slug}.releasedock.co`, THE Public_Changelog_Page SHALL resolve the Slug to the corresponding Workspace and display all published Changelog_Entry records
2. THE Public_Changelog_Page SHALL render each Changelog_Entry with its title, publish date, labels, and rich text content
3. THE Public_Changelog_Page SHALL display Changelog_Entry records ordered by publish date descending
4. IF the Slug does not match any Workspace, THEN THE Public_Changelog_Page SHALL return a 404 Not Found response

### Requirement 11: BlockNote JSON Serialization

**User Story:** As a developer, I want changelog content to be reliably serialized and deserialized, so that content is never lost or corrupted between editing and display.

#### Acceptance Criteria

1. WHEN a Changelog_Entry is saved, THE Editor SHALL serialize the block editor state into BlockNote JSON format
2. WHEN a Changelog_Entry is loaded, THE Editor SHALL deserialize the stored BlockNote JSON and reconstruct the original block editor state
3. FOR ALL valid BlockNote JSON documents, serializing then deserializing then serializing again SHALL produce an identical JSON output (round-trip property)
4. THE Public_Changelog_Page SHALL render BlockNote JSON content into read-only HTML without data loss
