"use client";

import { useState } from "react";
import theme from "../constants/theme";

export default function PublishModal({
  isOpen,
  onClose,
  onPublish,
  isSaving,
  projectName,
  changelogTitle,
}) {
  const [mode, setMode] = useState("now"); // "now" | "schedule"
  const [scheduledTime, setScheduledTime] = useState("");

  if (!isOpen) return null;

  const minDateTime = (() => {
    const d = new Date(Date.now() + 60000);
    d.setSeconds(0, 0);
    return d.toISOString().slice(0, 16);
  })();

  const handleConfirm = () => {
    const time = mode === "schedule" && scheduledTime
      ? new Date(scheduledTime).getTime()
      : undefined;
    onPublish(time);
  };

  const isScheduleValid = mode === "now" || (scheduledTime && new Date(scheduledTime).getTime() > Date.now());

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
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
            maxWidth: "440px",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px 24px 16px",
              borderBottom: `1px solid ${theme.neutral.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 600, color: theme.text.primary, margin: 0 }}>
                Publish changelog
              </h2>
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
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p style={{ fontSize: "13px", color: theme.text.tertiary, margin: "4px 0 0" }}>
              {changelogTitle || "Untitled"}
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: "20px 24px" }}>
            {/* Mode toggle */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "20px",
                padding: "3px",
                backgroundColor: theme.neutral.bg,
                borderRadius: theme.radius.md,
              }}
            >
              {[
                { key: "now", label: "Publish now" },
                { key: "schedule", label: "Schedule" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setMode(opt.key)}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    fontSize: "13px",
                    fontWeight: 500,
                    border: "none",
                    borderRadius: theme.radius.sm,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    backgroundColor: mode === opt.key ? theme.neutral.white : "transparent",
                    color: mode === opt.key ? theme.text.primary : theme.text.tertiary,
                    boxShadow: mode === opt.key ? theme.shadow.sm : "none",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Schedule picker */}
            {mode === "schedule" && (
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: theme.text.muted,
                    marginBottom: "6px",
                  }}
                >
                  Publish date & time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  min={minDateTime}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontSize: "13px",
                    border: `1px solid ${theme.neutral.border}`,
                    borderRadius: theme.radius.sm,
                    backgroundColor: theme.neutral.white,
                    color: theme.text.primary,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}

            {/* Distribution info */}
            <div
              style={{
                backgroundColor: theme.neutral.bg,
                borderRadius: theme.radius.md,
                padding: "14px 16px",
                marginBottom: "4px",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: theme.text.muted,
                  margin: "0 0 10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                Will appear on
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {/* Widget */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: theme.radius.sm,
                      backgroundColor: theme.brand.primaryLight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="14" height="14" fill="none" stroke={theme.brand.primary} viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: theme.text.primary, margin: 0 }}>
                      In-app widget
                    </p>
                    <p style={{ fontSize: "11px", color: theme.text.tertiary, margin: 0 }}>
                      {projectName || "Your project"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "16px 24px",
              borderTop: `1px solid ${theme.neutral.border}`,
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
            }}
          >
            <button
              onClick={onClose}
              disabled={isSaving}
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 500,
                border: `1px solid ${theme.neutral.border}`,
                borderRadius: theme.radius.sm,
                backgroundColor: theme.neutral.white,
                color: theme.text.muted,
                cursor: isSaving ? "not-allowed" : "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSaving || !isScheduleValid}
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 500,
                border: "none",
                borderRadius: theme.radius.sm,
                backgroundColor: mode === "schedule" ? theme.status.info : theme.brand.primary,
                color: theme.text.inverse,
                cursor: isSaving || !isScheduleValid ? "not-allowed" : "pointer",
                opacity: isSaving || !isScheduleValid ? 0.5 : 1,
              }}
            >
              {isSaving
                ? mode === "schedule" ? "Scheduling…" : "Publishing…"
                : mode === "schedule" ? "Schedule publish" : "Publish now"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
