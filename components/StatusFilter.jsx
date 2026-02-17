"use client";

import theme from "../constants/theme";

export default function StatusFilter({ currentStatus, onStatusChange }) {
  const statuses = [
    { value: "all", label: "All" },
    { value: "draft", label: "Drafts" },
    { value: "published", label: "Published" },
  ];

  return (
    <div className="flex space-x-2" style={{ borderBottom: `1px solid ${theme.neutral.border}` }}>
      {statuses.map((status) => (
        <button
          key={status.value}
          onClick={() => onStatusChange(status.value)}
          className="px-4 py-2 font-medium transition-colors relative"
          style={{
            color: currentStatus === status.value ? theme.text.primary : theme.text.tertiary,
          }}
        >
          {status.label}
          {currentStatus === status.value && (
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{ backgroundColor: theme.brand.primary }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
