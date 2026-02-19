"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import ChangelogRenderer from "./ChangelogRenderer";
import theme from "../constants/theme";

function useCoverUrl(storageId) {
  return useQuery(api.storage.getStorageUrl, storageId ? { storageId } : "skip");
}

function formatDate(ts) {
  if (!ts) return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return new Date(ts).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function LabelBadges({ labels }) {
  if (!labels?.length) return null;
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {labels.map((label, i) => (
        <span
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 10px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 500,
            backgroundColor: `${label.color}20`,
            color: label.color,
          }}
        >
          {label.name}
        </span>
      ))}
    </div>
  );
}

const DEFAULT_WIDGET_SETTINGS = {
  primaryColor: "#3b82f6",
  position: "bottom-right",
  showBranding: true,
};

export default function LivePreview({ type, changelog, onClose, widgetSettings }) {
  if (!changelog) return null;

  const settings = { ...DEFAULT_WIDGET_SETTINGS, ...widgetSettings };
  const coverUrl = useCoverUrl(changelog.coverImageId);
  const title = changelog.title || "Untitled";
  const date = formatDate(changelog.publishDate || changelog.updatedAt);
  const labels = changelog._labels || [];
  const content = changelog.content;

  switch (type) {
    case "widget":
      return <WidgetLive title={title} date={date} labels={labels} content={content} coverUrl={coverUrl} onClose={onClose} settings={settings} />;
    case "popup":
      return <PopupLive title={title} date={date} labels={labels} content={content} coverUrl={coverUrl} onClose={onClose} settings={settings} />;
    case "banner":
      return <BannerLive title={title} date={date} labels={labels} content={content} coverUrl={coverUrl} onClose={onClose} settings={settings} />;
    case "snippet":
      return <SnippetLive title={title} date={date} labels={labels} content={content} coverUrl={coverUrl} onClose={onClose} settings={settings} />;
    default:
      return null;
  }
}

/* ── Widget: slide-out panel (matches production Feed.tsx) ─── */
function WidgetLive({ title, date, labels, content, coverUrl, onClose, settings }) {
  const isRight = settings.position === "bottom-right";

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.15)", zIndex: 99997 }} />

      {/* Launcher button — matches Launcher.tsx */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          ...(isRight ? { right: 20 } : { left: 20 }),
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: settings.primaryColor,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          cursor: "pointer",
        }}
        onClick={onClose}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span style={{ position: "absolute", top: -5, right: -5, backgroundColor: "#ef4444", color: "white", borderRadius: 12, padding: "2px 6px", fontSize: "12px", fontWeight: "bold", minWidth: 20, textAlign: "center" }}>1</span>
      </div>

      {/* Feed panel — matches production Feed.tsx */}
      <div
        style={{
          position: "fixed",
          bottom: 90,
          ...(isRight ? { right: 20 } : { left: 20 }),
          width: 400,
          maxHeight: 600,
          backgroundColor: "#1a1a1a",
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          zIndex: 99998,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#222" }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#fff" }}>What's New</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: 24, lineHeight: 1, padding: 0 }} aria-label="Close changelog">×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #333" }}>
            {coverUrl && (
              <img src={coverUrl} alt="" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8, marginBottom: 12 }} />
            )}
            <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: "#fff" }}>{title}</h3>
            <p style={{ margin: "0 0 12px", fontSize: 13, color: "#999" }}>{date}</p>
            {labels.length > 0 && (
              <div style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {labels.map((l, i) => (
                  <span key={i} style={{ display: "inline-block", padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 500, backgroundColor: l.color + "20", color: l.color }}>{l.name}</span>
                ))}
              </div>
            )}
            <div style={{ color: "#ccc", fontSize: 14, lineHeight: 1.6 }}>
              <ChangelogRenderer content={content} />
            </div>
          </div>
        </div>
        {settings.showBranding && (
          <div style={{ padding: "12px 20px", borderTop: "1px solid #333", textAlign: "center", fontSize: 12, color: "#666" }}>
            Powered by <span style={{ color: settings.primaryColor }}>ReleaseDock</span>
          </div>
        )}
      </div>

    </>
  );
}

/* ── Popup: centered modal overlay ─────────────────── */
function PopupLive({ title, date, labels, content, coverUrl, onClose, settings }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 99997 }} />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 480,
          maxHeight: "80vh",
          backgroundColor: "#fff",
          borderRadius: 12,
          boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
          zIndex: 99998,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Accent bar */}
        <div style={{ height: 3, backgroundColor: settings.primaryColor, flexShrink: 0 }} />

        {coverUrl && (
          <img src={coverUrl} alt="" style={{ width: "100%", height: 180, objectFit: "cover", flexShrink: 0 }} />
        )}

        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <svg width="16" height="16" fill="none" stroke={settings.primaryColor} viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600, color: settings.primaryColor, textTransform: "uppercase", letterSpacing: "0.05em" }}>New Update</span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: theme.text.primary, margin: "0 0 8px" }}>{title}</h2>
          <p style={{ fontSize: 13, color: theme.text.tertiary, margin: "0 0 14px" }}>{date}</p>
          <LabelBadges labels={labels} />
          <div style={{ marginTop: 16 }}>
            <ChangelogRenderer content={content} />
          </div>
        </div>

        <div style={{ padding: "14px 28px", borderTop: `1px solid ${theme.neutral.border}`, display: "flex", gap: 10, flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px 0", borderRadius: 8, backgroundColor: settings.primaryColor, color: "#fff", border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            Got it
          </button>
          <button onClick={onClose} style={{ flex: 1, padding: "10px 0", borderRadius: 8, backgroundColor: "transparent", color: theme.text.muted, border: `1px solid ${theme.neutral.border}`, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            Dismiss
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Banner: top bar notification ──────────────────── */
function BannerLive({ title, date, labels, content, coverUrl, onClose, settings }) {
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: settings.primaryColor,
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          zIndex: 99998,
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        }}
      >
        <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
        <span style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>{title}</span>
        {labels.length > 0 && (
          <div style={{ display: "flex", gap: 4 }}>
            {labels.slice(0, 2).map((l, i) => (
              <span key={i} style={{ padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 500, backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}>{l.name}</span>
            ))}
          </div>
        )}
        <span style={{ padding: "4px 12px", borderRadius: 6, backgroundColor: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 12, fontWeight: 500, cursor: "default" }}>
          Read more →
        </span>
        <button
          onClick={onClose}
          style={{ position: "absolute", right: 16, background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontSize: 20, cursor: "pointer", padding: 4 }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </>
  );
}

/* ── Snippet: corner card ──────────────────────────── */
function SnippetLive({ title, date, labels, content, coverUrl, onClose, settings }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 99996 }} />
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 340,
          maxHeight: 420,
          backgroundColor: "#fff",
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
          border: `1px solid ${theme.neutral.border}`,
          zIndex: 99998,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Accent bar */}
        <div style={{ height: 3, backgroundColor: settings.primaryColor, flexShrink: 0 }} />

        <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: 5, backgroundColor: settings.primaryColor + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="11" height="11" fill="none" stroke={settings.primaryColor} viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: settings.primaryColor, textTransform: "uppercase", letterSpacing: "0.04em" }}>New Update</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: theme.text.tertiary, cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 0 }} aria-label="Close">×</button>
        </div>

        {coverUrl && (
          <img src={coverUrl} alt="" style={{ width: "100%", height: 120, objectFit: "cover", flexShrink: 0 }} />
        )}

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 18px 18px" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: theme.text.primary, margin: "0 0 4px" }}>{title}</h3>
          <p style={{ fontSize: 12, color: theme.text.tertiary, margin: "0 0 10px" }}>{date}</p>
          <LabelBadges labels={labels} />
          <div style={{ marginTop: 12, fontSize: 13 }}>
            <ChangelogRenderer content={content} />
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Preview badge indicator ───────────────────────── */
function PreviewBadge({ type, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: theme.text.primary,
        color: "#fff",
        padding: "8px 16px",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: 10,
        zIndex: 100000,
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      }}
    >
      <span style={{ opacity: 0.7 }}>Preview:</span> {type}
      <button
        onClick={onClose}
        style={{
          background: "rgba(255,255,255,0.15)",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          padding: "2px 8px",
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 500,
        }}
      >
        Close
      </button>
    </div>
  );
}
