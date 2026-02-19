/**
 * Public Changelog Page
 * 
 * Server component that displays all published changelogs for a workspace
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import { notFound } from "next/navigation";
import ChangelogRenderer from "@/components/ChangelogRenderer";
import ReactionBar from "@/components/ReactionBar";

async function fetchChangelogData(slug) {
  const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  if (!convexSiteUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_SITE_URL is not configured");
  }
  const url = `${convexSiteUrl}/api/changelog-page/${slug}`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Failed to fetch changelog data: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching changelog data:", error);
    throw error;
  }
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// NOTE: This is a server component, so we inline the theme values
// rather than importing theme (which works fine in server components too).
import theme from "@/constants/theme";

export default async function PublicChangelogPage({ params }) {
  const { slug } = await params;
  const data = await fetchChangelogData(slug);
  if (!data) notFound();

  const { workspace, entries } = data;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: theme.neutral.white, color: theme.text.primary }}>
      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${theme.neutral.border}`,
        backgroundColor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ maxWidth: "896px", margin: "0 auto", padding: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 600, color: theme.text.primary }}>
            {workspace.name}
          </h1>
          <p style={{ fontSize: "14px", color: theme.text.tertiary, marginTop: "4px" }}>Product Updates</p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "896px", margin: "0 auto", padding: "48px 24px" }}>
        {entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: theme.neutral.bg,
              marginBottom: "16px",
            }}>
              <svg style={{ width: 32, height: 32, color: theme.text.tertiary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 500, color: theme.text.primary, marginBottom: "8px" }}>
              No updates yet
            </h2>
            <p style={{ color: theme.text.secondary }}>Check back soon for product updates.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            {entries.map((entry, index) => (
              <article
                key={index}
                style={{
                  backgroundColor: theme.neutral.white,
                  borderRadius: theme.radius.lg,
                  border: `1px solid ${theme.neutral.border}`,
                  overflow: "hidden",
                }}
              >
                {entry.coverImageUrl && (
                  <img
                    src={entry.coverImageUrl}
                    alt=""
                    style={{
                      width: "100%",
                      height: "280px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                )}
                <div style={{ padding: "32px" }}>
                <div style={{ marginBottom: "24px" }}>
                  <h2 style={{ fontSize: "24px", fontWeight: 600, color: theme.text.primary, marginBottom: "12px" }}>
                    {entry.title}
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "14px" }}>
                    <time style={{ color: theme.text.tertiary }}>{formatDate(entry.publishDate)}</time>
                    {entry.categories && entry.categories.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {entry.categories.map((cat, catIndex) => (
                          <span
                            key={catIndex}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "2px 10px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: 500,
                              backgroundColor: `${cat.color}12`,
                              color: cat.color,
                              border: `1px solid ${cat.color}25`,
                            }}
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    )}
                    {entry.labels && entry.labels.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {entry.labels.map((label, labelIndex) => (
                          <span
                            key={labelIndex}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "2px 10px",
                              borderRadius: theme.radius.full,
                              fontSize: "12px",
                              fontWeight: 500,
                              backgroundColor: `${label.color}20`,
                              color: label.color,
                              border: `1px solid ${label.color}`,
                            }}
                          >
                            {label.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="prose max-w-none">
                  <ChangelogRenderer content={entry.content} />
                </div>
                {entry._id && <ReactionBar changelogId={entry._id} />}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${theme.neutral.border}`, marginTop: "64px" }}>
        <div style={{ maxWidth: "896px", margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "14px", color: theme.text.tertiary }}>
            <p>
              Powered by{" "}
              <a href="https://releasedock.co" style={{ color: theme.text.secondary, textDecoration: "none" }} target="_blank" rel="noopener noreferrer">
                ReleaseDock
              </a>
            </p>
            {workspace.websiteUrl && (
              <a href={workspace.websiteUrl} style={{ color: theme.text.secondary, textDecoration: "none" }} target="_blank" rel="noopener noreferrer">
                Visit {workspace.name} →
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const data = await fetchChangelogData(slug);
    if (!data) return { title: "Changelog Not Found" };
    return {
      title: `${data.workspace.name} - Changelog`,
      description: `Product updates and changelog for ${data.workspace.name}`,
    };
  } catch (error) {
    return { title: "Changelog" };
  }
}
