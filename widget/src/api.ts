export interface ChangelogLabel {
  name: string;
  color: string;
}

export interface ChangelogCategory {
  name: string;
  color: string;
}

export interface ChangelogEntry {
  _id: string;
  title: string;
  content: any; // BlockNote JSON
  publishDate: number;
  coverImageUrl: string | null;
  labels: ChangelogLabel[];
  categories?: ChangelogCategory[];
}

export interface WidgetSettings {
  primaryColor: string;
  position: 'bottom-right' | 'bottom-left';
  showBranding: boolean;
}

export interface ChangelogsResponse {
  entries: ChangelogEntry[];
  widgetSettings: WidgetSettings;
}

export interface ReactionCounts {
  [emoji: string]: number;
}

export interface ReactionsResponse {
  counts: ReactionCounts;
  userReactions: string[];
}

const CONVEX_SITE_URL: string = import.meta.env.VITE_CONVEX_SITE_URL;

export async function fetchChangelogs(apiKey: string): Promise<ChangelogsResponse> {
  const response = await fetch(
    `${CONVEX_SITE_URL}/api/changelogs?key=${encodeURIComponent(apiKey)}`
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid API key');
    }
    throw new Error(`Failed to fetch changelogs: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchReactions(changelogId: string, fingerprint: string): Promise<ReactionsResponse> {
  const response = await fetch(
    `${CONVEX_SITE_URL}/api/reactions/${encodeURIComponent(changelogId)}?fp=${encodeURIComponent(fingerprint)}`
  );
  if (!response.ok) {
    return { counts: {}, userReactions: [] };
  }
  return response.json();
}

export async function toggleReaction(changelogId: string, emoji: string, fingerprint: string): Promise<{ action: string }> {
  const response = await fetch(`${CONVEX_SITE_URL}/api/reactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ changelogId, emoji, fingerprint }),
  });
  if (!response.ok) {
    throw new Error('Failed to toggle reaction');
  }
  return response.json();
}
