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

export default function PreviewModal({ isOpen, onClose, changelog }) {
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
        </div>
      </div>

      <style>{`
        .preview-type-btn:hover {
          border-color: ${theme.brand.primary} !important;
          background-color: ${theme.brand.primaryLight} !important;
        }
      `}</style>
    </>
  );
}
