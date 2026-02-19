"use client";

import { useState, useRef, useEffect } from "react";
import theme from "../constants/theme";

export default function PublishDropdown({
  onPublishNow,
  onSchedule,
  onCancelSchedule,
  onEditSchedule,
  isSaving,
  isScheduled,
  scheduledTime,
}) {
  const [open, setOpen] = useState(false);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setShowSchedulePicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const minDateTime = (() => {
    const d = new Date(Date.now() + 60000);
    d.setSeconds(0, 0);
    return d.toISOString().slice(0, 16);
  })();

  const handleScheduleConfirm = () => {
    if (!scheduleDate) return;
    const ts = new Date(scheduleDate).getTime();
    if (ts <= Date.now()) return;
    onSchedule(ts);
    setOpen(false);
    setShowSchedulePicker(false);
    setScheduleDate("");
  };

  const handlePublishNow = () => {
    onPublishNow();
    setOpen(false);
  };

  const formattedSchedule = scheduledTime
    ? new Date(scheduledTime).toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit",
      })
    : null;

  // If already scheduled, show a different button with info
  if (isScheduled) {
    return (
      <div ref={dropdownRef} style={{ position: "relative" }}>
        <button
          onClick={() => setOpen((v) => !v)}
          disabled={isSaving}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: 500,
            border: "none",
            borderRadius: theme.radius.sm,
            backgroundColor: theme.status.info,
            color: theme.text.inverse,
            cursor: isSaving ? "not-allowed" : "pointer",
            opacity: isSaving ? 0.5 : 1,
          }}
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Scheduled
          <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {open && (
          <div style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 4px)",
            width: "280px",
            backgroundColor: theme.neutral.white,
            borderRadius: theme.radius.md,
            boxShadow: theme.shadow.lg,
            border: `1px solid ${theme.neutral.border}`,
            zIndex: 50,
            overflow: "hidden",
          }}>
            {/* Schedule info */}
            <div style={{
              padding: "12px 14px",
              borderBottom: `1px solid ${theme.neutral.border}`,
              backgroundColor: theme.status.infoLight,
            }}>
              <div style={{ fontSize: "11px", fontWeight: 500, color: theme.status.info, marginBottom: "2px" }}>
                Scheduled for
              </div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: theme.text.primary }}>
                {formattedSchedule}
              </div>
            </div>

            {/* Edit schedule */}
            {!showSchedulePicker ? (
              <div style={{ padding: "4px" }}>
                <DropdownItem
                  icon={<EditIcon />}
                  label="Edit schedule"
                  onClick={() => {
                    // Pre-fill with current scheduled time
                    if (scheduledTime) {
                      const d = new Date(scheduledTime);
                      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                      setScheduleDate(d.toISOString().slice(0, 16));
                    }
                    setShowSchedulePicker(true);
                  }}
                />
                <DropdownItem
                  icon={<PublishIcon />}
                  label="Publish now instead"
                  onClick={handlePublishNow}
                />
                <DropdownItem
                  icon={<CancelIcon />}
                  label="Remove schedule"
                  onClick={() => { onCancelSchedule(); setOpen(false); }}
                  danger
                />
              </div>
            ) : (
              <div style={{ padding: "12px 14px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: theme.text.muted, marginBottom: "6px" }}>
                  New date & time
                </label>
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={minDateTime}
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    fontSize: "12px",
                    border: `1px solid ${theme.neutral.border}`,
                    borderRadius: theme.radius.sm,
                    backgroundColor: theme.neutral.white,
                    color: theme.text.primary,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                  <button
                    onClick={() => setShowSchedulePicker(false)}
                    style={{
                      flex: 1, padding: "6px", fontSize: "12px", fontWeight: 500,
                      border: `1px solid ${theme.neutral.border}`, borderRadius: theme.radius.sm,
                      backgroundColor: theme.neutral.white, color: theme.text.muted, cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!scheduleDate) return;
                      const ts = new Date(scheduleDate).getTime();
                      if (ts <= Date.now()) return;
                      onEditSchedule(ts);
                      setOpen(false);
                      setShowSchedulePicker(false);
                    }}
                    disabled={!scheduleDate || new Date(scheduleDate).getTime() <= Date.now()}
                    style={{
                      flex: 1, padding: "6px", fontSize: "12px", fontWeight: 500,
                      border: "none", borderRadius: theme.radius.sm,
                      backgroundColor: theme.status.info, color: theme.text.inverse,
                      cursor: !scheduleDate || new Date(scheduleDate).getTime() <= Date.now() ? "not-allowed" : "pointer",
                      opacity: !scheduleDate || new Date(scheduleDate).getTime() <= Date.now() ? 0.5 : 1,
                    }}
                  >
                    Update
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Default: draft / unpublished state
  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isSaving}
        className="editor-btn-primary"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          fontSize: "12px",
          fontWeight: 500,
          border: "none",
          borderRadius: theme.radius.sm,
          backgroundColor: theme.brand.primary,
          color: theme.text.inverse,
          cursor: isSaving ? "not-allowed" : "pointer",
          opacity: isSaving ? 0.5 : 1,
        }}
      >
        Publish
        <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute",
          right: 0,
          top: "calc(100% + 4px)",
          width: "240px",
          backgroundColor: theme.neutral.white,
          borderRadius: theme.radius.md,
          boxShadow: theme.shadow.lg,
          border: `1px solid ${theme.neutral.border}`,
          zIndex: 50,
          overflow: "hidden",
        }}>
          {!showSchedulePicker ? (
            <div style={{ padding: "4px" }}>
              <DropdownItem
                icon={<PublishIcon />}
                label="Publish now"
                onClick={handlePublishNow}
              />
              <DropdownItem
                icon={<ScheduleIcon />}
                label="Schedule for later"
                onClick={() => setShowSchedulePicker(true)}
                hasArrow
              />
            </div>
          ) : (
            <div style={{ padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                <button
                  onClick={() => setShowSchedulePicker(false)}
                  style={{
                    background: "none", border: "none", padding: "2px", cursor: "pointer",
                    color: theme.text.tertiary, display: "flex",
                  }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <span style={{ fontSize: "12px", fontWeight: 600, color: theme.text.primary }}>
                  Schedule publish
                </span>
              </div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: theme.text.muted, marginBottom: "6px" }}>
                Date & time
              </label>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                min={minDateTime}
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  fontSize: "12px",
                  border: `1px solid ${theme.neutral.border}`,
                  borderRadius: theme.radius.sm,
                  backgroundColor: theme.neutral.white,
                  color: theme.text.primary,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={handleScheduleConfirm}
                disabled={!scheduleDate || new Date(scheduleDate).getTime() <= Date.now()}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "7px",
                  fontSize: "12px",
                  fontWeight: 500,
                  border: "none",
                  borderRadius: theme.radius.sm,
                  backgroundColor: theme.status.info,
                  color: theme.text.inverse,
                  cursor: !scheduleDate || new Date(scheduleDate).getTime() <= Date.now() ? "not-allowed" : "pointer",
                  opacity: !scheduleDate || new Date(scheduleDate).getTime() <= Date.now() ? 0.5 : 1,
                }}
              >
                Schedule
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Small sub-components ── */

function DropdownItem({ icon, label, onClick, hasArrow, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
        padding: "8px 10px",
        fontSize: "13px",
        fontWeight: 400,
        color: danger ? theme.status.error : theme.text.primary,
        backgroundColor: "transparent",
        border: "none",
        borderRadius: theme.radius.sm,
        cursor: "pointer",
        textAlign: "left",
        transition: "background-color 0.1s",
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = danger ? theme.status.errorLight : theme.neutral.hover}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
    >
      <span style={{ display: "flex", flexShrink: 0, color: danger ? theme.status.error : theme.text.tertiary }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {hasArrow && (
        <svg width="12" height="12" fill="none" stroke={theme.text.tertiary} viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      )}
    </button>
  );
}

function PublishIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

function ScheduleIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
    </svg>
  );
}

function CancelIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
