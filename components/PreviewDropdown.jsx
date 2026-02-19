"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import theme from "../constants/theme";

const PREVIEW_TYPES = [
  {
    id: "widget",
    label: "Widget",
    desc: "Slide-out panel",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    id: "popup",
    label: "Popup",
    desc: "Centered modal",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18" />
      </svg>
    ),
  },
  {
    id: "banner",
    label: "Top Bar",
    desc: "Top notification bar",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v1.5A2.25 2.25 0 0118 9.75H6A2.25 2.25 0 013.75 7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 15.75h16.5M3.75 19.5h16.5M3.75 12h16.5" />
      </svg>
    ),
  },
  {
    id: "snippet",
    label: "Snippet",
    desc: "Corner card",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    id: "fullpage",
    label: "Full Page",
    desc: "Hosted page (new tab)",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    ),
  },
];

export default function PreviewDropdown({ onSelect, hostedPageUrl }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });

  const updatePos = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePos();
    const handleClick = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, updatePos]);

  const handleSelect = (type) => {
    setOpen(false);
    if (type === "fullpage" && hostedPageUrl) {
      window.open(hostedPageUrl, "_blank");
    } else {
      onSelect(type);
    }
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        title="Preview"
        className="row-action-btn flex items-center justify-center rounded-md transition-colors"
        style={{
          width: 28,
          height: 28,
          backgroundColor: "transparent",
          color: theme.text.tertiary,
          border: "none",
          cursor: "pointer",
        }}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {open && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: "fixed",
            top: pos.top,
            right: pos.right,
            width: 200,
            backgroundColor: theme.neutral.white,
            border: `1px solid ${theme.neutral.border}`,
            borderRadius: theme.radius.md,
            boxShadow: theme.shadow.lg,
            zIndex: 9999,
            overflow: "hidden",
            padding: "4px 0",
          }}
        >
          <div
            style={{
              padding: "6px 12px 4px",
              fontSize: "10px",
              fontWeight: 600,
              color: theme.text.tertiary,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Preview as
          </div>
          {PREVIEW_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={(e) => { e.stopPropagation(); handleSelect(type.id); }}
              className="preview-dropdown-item"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                padding: "8px 12px",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                textAlign: "left",
                transition: "background-color 0.1s",
              }}
            >
              <span style={{ color: theme.text.muted, flexShrink: 0 }}>{type.icon}</span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 500, color: theme.text.primary }}>{type.label}</div>
                <div style={{ fontSize: "10px", color: theme.text.tertiary }}>{type.desc}</div>
              </div>
              {type.id === "fullpage" && (
                <svg
                  style={{ marginLeft: "auto", color: theme.text.tertiary, flexShrink: 0 }}
                  width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              )}
            </button>
          ))}
          <style>{`
            .preview-dropdown-item:hover {
              background-color: ${theme.neutral.hover} !important;
            }
          `}</style>
        </div>,
        document.body
      )}
    </>
  );
}
