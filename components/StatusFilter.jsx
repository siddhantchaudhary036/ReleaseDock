"use client";

import theme from "../constants/theme";

export default function StatusFilter({ currentStatus, onStatusChange, counts = {} }) {
  const statuses = [
    { value: "all", label: "All", count: counts.all },
    { value: "draft", label: "Draft", count: counts.draft },
    { value: "scheduled", label: "Scheduled", count: counts.scheduled },
    { value: "published", label: "Published", count: counts.published },
  ];

  return (
    <div className="flex items-center gap-1">
      {statuses.map((status) => {
        const active = currentStatus === status.value;
        return (
          <button
            key={status.value}
            onClick={() => onStatusChange(status.value)}
            className="status-filter-btn flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              backgroundColor: active ? theme.brand.primaryLight : "transparent",
              color: active ? theme.brand.primary : theme.text.muted,
              border: "none",
              cursor: "pointer",
            }}
          >
            {status.value === "draft" && (
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: active ? theme.status.warning : theme.text.tertiary }}
              />
            )}
            {status.value === "scheduled" && (
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: active ? theme.status.info : theme.text.tertiary }}
              />
            )}
            {status.value === "published" && (
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: active ? theme.status.success : theme.text.tertiary }}
              />
            )}
            {status.label}
            {status.count !== undefined && (
              <span
                className="ml-0.5 text-[10px] tabular-nums"
                style={{ color: active ? theme.brand.primary : theme.text.tertiary, opacity: 0.7 }}
              >
                {status.count}
              </span>
            )}
          </button>
        );
      })}

      <style>{`
        .status-filter-btn:hover {
          background-color: ${theme.neutral.hover} !important;
        }
      `}</style>
    </div>
  );
}
