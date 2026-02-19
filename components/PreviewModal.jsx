"use client";

import { useState } from "react";
import theme from "../constants/theme";

const PREVIEW_TYPES = [
  {
    id: "widget",
    label: "Widget",
    description: "Slide-out panel from the corner of the page",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    id: "popup",
    label: "Popup",
    description: "Centered modal overlay on the page",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18" />
      </svg>
    ),
  },
  {
    id: "banner",
    label: "Top Bar",
    description: "Notification banner at the top of the page",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v1.5A2.25 2.25 0 0118 9.75H6A2.25 2.25 0 013.75 7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 15.75h16.5M3.75 19.5h16.5M3.75 12h16.5" />
      </svg>
    ),
  },
  {
    id: "snippet",
    label: "Snippet",
    description: "Small card in the corner of the screen",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    id: "fullpage",
    label: "Full Page",
    description: "Dedicated hosted changelog page",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
];

export default function PreviewModal({ isOpen, onClose, changelog, onSelectPreview }) {
  const [activePreview, setActivePreview] = useState("widget");

  if (!isOpen || !changelog) return null;

  const title = changelog.title || "Untitled";
  const date = changelog.publishDate
    ? new Date(changelog.publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: theme.neutral.white,
            borderRadius: theme.radius.lg,
            boxShadow: theme.shadow.lg,
            width: "100%",
            maxWidth: "820px",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 24px",
              borderBottom: `1px solid ${theme.neutral.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div>
              <h2 style={{ fontSize: "15px", fontWeight: 600, color: theme.text.primary, margin: 0 }}>
                Preview: {title}
              </h2>
              <p style={{ fontSize: "12px", color: theme.text.tertiary, margin: "2px 0 0" }}>
                See how this changelog appears to your users
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                color: theme.text.tertiary,
                borderRadius: theme.radius.sm,
                display: "flex",
              }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Type selector */}
          <div
            style={{
              padding: "12px 24px",
              borderBottom: `1px solid ${theme.neutral.border}`,
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              flexShrink: 0,
            }}
          >
            {PREVIEW_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setActivePreview(type.id)}
                className="preview-type-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: theme.radius.md,
                  border: `1.5px solid ${activePreview === type.id ? theme.brand.primary : theme.neutral.border}`,
                  backgroundColor: activePreview === type.id ? theme.brand.primaryLight : theme.neutral.white,
                  color: activePreview === type.id ? theme.brand.primary : theme.text.muted,
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}
              >
                {type.icon}
                {type.label}
              </button>
            ))}
          </div>

          {/* Preview area */}
          <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
            <p style={{ fontSize: "11px", color: theme.text.tertiary, margin: "0 0 12px", textAlign: "center" }}>
              {PREVIEW_TYPES.find((t) => t.id === activePreview)?.description}
            </p>
            <PreviewRenderer type={activePreview} title={title} date={date} changelog={changelog} />
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "14px 24px",
              borderTop: `1px solid ${theme.neutral.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 500,
                border: `1px solid ${theme.neutral.border}`,
                borderRadius: theme.radius.sm,
                backgroundColor: theme.neutral.white,
                color: theme.text.muted,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (activePreview === "fullpage") {
                  onClose();
                  return;
                }
                if (onSelectPreview) onSelectPreview(activePreview);
                onClose();
              }}
              className="select-preview-btn"
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 500,
                border: "none",
                borderRadius: theme.radius.sm,
                backgroundColor: theme.brand.primary,
                color: theme.text.inverse,
                cursor: "pointer",
              }}
            >
              Select & Preview Live
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .preview-type-btn:hover {
          border-color: ${theme.brand.primary} !important;
          background-color: ${theme.brand.primaryLight} !important;
        }
        .select-preview-btn:hover {
          background-color: ${theme.brand.primaryHover} !important;
        }
      `}</style>
    </>
  );
}

function PreviewRenderer({ type, title, date, changelog }) {
  const labels = changelog._labels || [];

  switch (type) {
    case "widget":
      return <WidgetPreview title={title} date={date} labels={labels} />;
    case "popup":
      return <PopupPreview title={title} date={date} labels={labels} />;
    case "banner":
      return <BannerPreview title={title} date={date} labels={labels} />;
    case "snippet":
      return <SnippetPreview title={title} date={date} labels={labels} />;
    case "fullpage":
      return <FullPagePreview title={title} date={date} labels={labels} />;
    default:
      return null;
  }
}

/* ── Fake browser chrome wrapper ─────────────────── */
function BrowserFrame({ children, style }) {
  return (
    <div
      style={{
        border: `1px solid ${theme.neutral.border}`,
        borderRadius: theme.radius.lg,
        overflow: "hidden",
        backgroundColor: "#f0f0f0",
        ...style,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "10px 14px",
          backgroundColor: "#e8e8e8",
          borderBottom: `1px solid ${theme.neutral.border}`,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#febc2e" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#28c840" }} />
        <div
          style={{
            flex: 1,
            marginLeft: 8,
            padding: "4px 12px",
            borderRadius: 6,
            backgroundColor: "#fff",
            fontSize: "11px",
            color: "#999",
            textAlign: "center",
          }}
        >
          yourapp.com
        </div>
      </div>
      {/* Page content */}
      <div style={{ position: "relative", height: 380, backgroundColor: "#fafafa", overflow: "hidden" }}>
        {/* Fake page skeleton */}
        <div style={{ padding: "24px 32px" }}>
          <div style={{ width: "40%", height: 14, borderRadius: 4, backgroundColor: "#e5e5e5", marginBottom: 12 }} />
          <div style={{ width: "70%", height: 10, borderRadius: 4, backgroundColor: "#ececec", marginBottom: 8 }} />
          <div style={{ width: "55%", height: 10, borderRadius: 4, backgroundColor: "#ececec", marginBottom: 8 }} />
          <div style={{ width: "65%", height: 10, borderRadius: 4, backgroundColor: "#ececec", marginBottom: 20 }} />
          <div style={{ width: "45%", height: 10, borderRadius: 4, backgroundColor: "#ececec", marginBottom: 8 }} />
          <div style={{ width: "60%", height: 10, borderRadius: 4, backgroundColor: "#ececec" }} />
        </div>
        {children}
      </div>
    </div>
  );
}

function LabelBadges({ labels, small }) {
  if (!labels?.length) return null;
  return (
    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
      {labels.slice(0, 3).map((label, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            padding: small ? "1px 6px" : "2px 8px",
            borderRadius: 10,
            fontSize: small ? "9px" : "10px",
            fontWeight: 500,
            backgroundColor: `${label.color || theme.brand.primary}20`,
            color: label.color || theme.brand.primary,
          }}
        >
          {label.name}
        </span>
      ))}
    </div>
  );
}

/* ── Widget preview (slide-out panel) ─────────────── */
function WidgetPreview({ title, date, labels }) {
  return (
    <BrowserFrame>
      {/* Launcher button */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          width: 44,
          height: 44,
          borderRadius: "50%",
          backgroundColor: theme.brand.primary,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            backgroundColor: "#ef4444",
            color: "white",
            borderRadius: 10,
            padding: "1px 5px",
            fontSize: "9px",
            fontWeight: 700,
          }}
        >
          1
        </span>
      </div>
      {/* Feed panel */}
      <div
        style={{
          position: "absolute",
          bottom: 68,
          right: 16,
          width: 280,
          backgroundColor: "#1a1a1a",
          borderRadius: 10,
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          overflow: "hidden",
          zIndex: 3,
        }}
      >
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#222" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>What's New</span>
          <span style={{ color: "#666", fontSize: "16px" }}>×</span>
        </div>
        <div style={{ padding: "14px 16px" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#fff", marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: "10px", color: "#888", marginBottom: 8 }}>{date}</div>
          <LabelBadges labels={labels} small />
          <div style={{ marginTop: 10 }}>
            <div style={{ width: "90%", height: 7, borderRadius: 3, backgroundColor: "#333", marginBottom: 5 }} />
            <div style={{ width: "70%", height: 7, borderRadius: 3, backgroundColor: "#333", marginBottom: 5 }} />
            <div style={{ width: "80%", height: 7, borderRadius: 3, backgroundColor: "#333" }} />
          </div>
        </div>
        <div style={{ padding: "8px 16px", borderTop: "1px solid #333", textAlign: "center", fontSize: "9px", color: "#555" }}>
          Powered by <span style={{ color: theme.brand.primary }}>ReleaseDock</span>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* ── Popup preview (centered modal) ───────────────── */
function PopupPreview({ title, date, labels }) {
  return (
    <BrowserFrame>
      {/* Dimmed overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.35)", zIndex: 2 }} />
      {/* Centered popup */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          backgroundColor: "#fff",
          borderRadius: 10,
          boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
          overflow: "hidden",
          zIndex: 3,
        }}
      >
        {/* Accent bar */}
        <div style={{ height: 3, backgroundColor: theme.brand.primary }} />
        <div style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <svg width="14" height="14" fill="none" stroke={theme.brand.primary} viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <span style={{ fontSize: "10px", fontWeight: 600, color: theme.brand.primary, textTransform: "uppercase", letterSpacing: "0.05em" }}>New Update</span>
          </div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: theme.text.primary, marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: "10px", color: theme.text.tertiary, marginBottom: 10 }}>{date}</div>
          <LabelBadges labels={labels} small />
          <div style={{ marginTop: 12 }}>
            <div style={{ width: "95%", height: 8, borderRadius: 3, backgroundColor: "#f0f0f0", marginBottom: 5 }} />
            <div style={{ width: "75%", height: 8, borderRadius: 3, backgroundColor: "#f0f0f0", marginBottom: 5 }} />
            <div style={{ width: "85%", height: 8, borderRadius: 3, backgroundColor: "#f0f0f0" }} />
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <div style={{ flex: 1, padding: "7px 0", borderRadius: 6, backgroundColor: theme.brand.primary, color: "#fff", fontSize: "11px", fontWeight: 500, textAlign: "center" }}>
              Read more
            </div>
            <div style={{ flex: 1, padding: "7px 0", borderRadius: 6, border: `1px solid ${theme.neutral.border}`, color: theme.text.muted, fontSize: "11px", fontWeight: 500, textAlign: "center" }}>
              Dismiss
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* ── Banner / Top Bar preview ─────────────────────── */
function BannerPreview({ title, date, labels }) {
  return (
    <BrowserFrame>
      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.brand.primary,
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          zIndex: 3,
        }}
      >
        <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
        <span style={{ color: "#fff", fontSize: "12px", fontWeight: 500 }}>
          {title}
        </span>
        <span
          style={{
            padding: "3px 10px",
            borderRadius: 4,
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "#fff",
            fontSize: "10px",
            fontWeight: 500,
          }}
        >
          Read more →
        </span>
        <span
          style={{
            position: "absolute",
            right: 14,
            color: "rgba(255,255,255,0.6)",
            fontSize: "16px",
            cursor: "default",
          }}
        >
          ×
        </span>
      </div>
    </BrowserFrame>
  );
}

/* ── Snippet preview (corner card) ────────────────── */
function SnippetPreview({ title, date, labels }) {
  return (
    <BrowserFrame>
      {/* Snippet card */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          width: 240,
          backgroundColor: "#fff",
          borderRadius: 10,
          boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
          overflow: "hidden",
          zIndex: 3,
          border: `1px solid ${theme.neutral.border}`,
        }}
      >
        {/* Accent top */}
        <div style={{ height: 3, backgroundColor: theme.brand.primary }} />
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                backgroundColor: theme.brand.primaryLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="10" height="10" fill="none" stroke={theme.brand.primary} viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <span style={{ fontSize: "9px", fontWeight: 600, color: theme.brand.primary, textTransform: "uppercase", letterSpacing: "0.04em" }}>New Update</span>
            <span style={{ marginLeft: "auto", color: "#ccc", fontSize: "14px" }}>×</span>
          </div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: theme.text.primary, marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: "9px", color: theme.text.tertiary, marginBottom: 8 }}>{date}</div>
          <LabelBadges labels={labels} small />
          <div style={{ marginTop: 10 }}>
            <div style={{ width: "90%", height: 6, borderRadius: 3, backgroundColor: "#f0f0f0", marginBottom: 4 }} />
            <div style={{ width: "70%", height: 6, borderRadius: 3, backgroundColor: "#f0f0f0" }} />
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* ── Full Page preview ────────────────────────────── */
function FullPagePreview({ title, date, labels }) {
  return (
    <div
      style={{
        border: `1px solid ${theme.neutral.border}`,
        borderRadius: theme.radius.lg,
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      {/* Browser bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "10px 14px",
          backgroundColor: "#e8e8e8",
          borderBottom: `1px solid ${theme.neutral.border}`,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#febc2e" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#28c840" }} />
        <div
          style={{
            flex: 1,
            marginLeft: 8,
            padding: "4px 12px",
            borderRadius: 6,
            backgroundColor: "#fff",
            fontSize: "11px",
            color: "#999",
            textAlign: "center",
          }}
        >
          yourapp.com/changelog
        </div>
      </div>
      {/* Page */}
      <div style={{ height: 380, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "20px 32px", borderBottom: `1px solid ${theme.neutral.border}`, backgroundColor: "rgba(255,255,255,0.9)" }}>
          <div style={{ fontSize: "16px", fontWeight: 600, color: theme.text.primary }}>Your Product</div>
          <div style={{ fontSize: "11px", color: theme.text.tertiary, marginTop: 2 }}>Product Updates</div>
        </div>
        {/* Entry */}
        <div style={{ padding: "24px 32px" }}>
          <div
            style={{
              border: `1px solid ${theme.neutral.border}`,
              borderRadius: 10,
              overflow: "hidden",
              backgroundColor: "#fff",
            }}
          >
            {/* Fake cover image */}
            <div style={{ height: 80, background: `linear-gradient(135deg, ${theme.brand.primaryLight}, ${theme.brand.primaryMuted})` }} />
            <div style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: theme.text.primary, marginBottom: 8 }}>{title}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: "10px", color: theme.text.tertiary }}>{date}</span>
                <LabelBadges labels={labels} small />
              </div>
              <div>
                <div style={{ width: "95%", height: 8, borderRadius: 3, backgroundColor: "#f3f4f6", marginBottom: 6 }} />
                <div style={{ width: "80%", height: 8, borderRadius: 3, backgroundColor: "#f3f4f6", marginBottom: 6 }} />
                <div style={{ width: "88%", height: 8, borderRadius: 3, backgroundColor: "#f3f4f6" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
