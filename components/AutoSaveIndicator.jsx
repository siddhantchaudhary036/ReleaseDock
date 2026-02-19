"use client";

import theme from "../constants/theme";

/**
 * Subtle auto-save status indicator shown near the title.
 * @param {{ status: "idle"|"saving"|"saved"|"error" }} props
 */
export default function AutoSaveIndicator({ status }) {
  if (status === "idle") return null;

  const config = {
    saving: { text: "Saving…", color: theme.text.tertiary },
    saved: { text: "Saved", color: theme.status.success },
    error: { text: "Save failed", color: theme.status.error },
  };

  const { text, color } = config[status] || config.saved;

  return (
    <span
      className="text-[11px] font-medium transition-opacity duration-300"
      style={{ color, opacity: status === "saved" ? 0.7 : 1 }}
    >
      {text}
    </span>
  );
}
