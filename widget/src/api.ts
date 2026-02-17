export interface ChangelogLabel {
  name: string;
  color: string;
}

export interface ChangelogEntry {
  title: string;
  content: any; // BlockNote JSON
  publishDate: number;
  labels: ChangelogLabel[];
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

/**
 * Convex site URL is baked in at build time via Vite's define config.
 * No runtime resolution or fallback needed.
 */
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
