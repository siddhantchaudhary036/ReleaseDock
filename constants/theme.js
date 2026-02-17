/**
 * ReleaseDock Design Tokens
 * 
 * Light theme with blue accent. All colors referenced from here
 * so the palette stays consistent across the entire app.
 */

const theme = {
  /* ── Brand ─────────────────────────────────── */
  brand: {
    primary:   "#2563eb",   // blue-600
    primaryHover: "#1d4ed8", // blue-700
    primaryLight: "#eff6ff", // blue-50
    primaryMuted: "#dbeafe", // blue-100
    accent:    "#3b82f6",   // blue-500
  },

  /* ── Neutrals (light theme) ────────────────── */
  neutral: {
    white:     "#ffffff",
    bg:        "#f9fafb",   // gray-50
    surface:   "#ffffff",
    border:    "#e5e7eb",   // gray-200
    borderLight: "#f3f4f6", // gray-100
    divider:   "#e5e7eb",
    muted:     "#f3f4f6",   // gray-100
    subtle:    "#e5e7eb",   // gray-200
    hover:     "#f3f4f6",   // gray-100
  },

  /* ── Text ──────────────────────────────────── */
  text: {
    primary:   "#111827",   // gray-900
    secondary: "#4b5563",   // gray-600
    tertiary:  "#9ca3af",   // gray-400
    inverse:   "#ffffff",
    muted:     "#6b7280",   // gray-500
    placeholder: "#9ca3af", // gray-400
    link:      "#2563eb",   // blue-600
    linkHover: "#1d4ed8",   // blue-700
  },

  /* ── Semantic ──────────────────────────────── */
  status: {
    success:      "#16a34a",
    successLight: "#dcfce7",
    warning:      "#eab308",
    warningLight: "#fef3c7",
    error:        "#dc2626",
    errorLight:   "#fee2e2",
    info:         "#2563eb",
    infoLight:    "#dbeafe",
  },

  /* ── Decorative (for code syntax, badges, etc.) ── */
  decorative: {
    orange:      "#d97706",
    orangeLight: "#fed7aa",
    orangeDark:  "#7c2d12",
    green:       "#16a34a",
    purple:      "#7c3aed",
    purpleLight: "#ede9fe",
    red:         "#f87171",
    yellow:      "#fbbf24",
    yellowDark:  "#713f12",
    teal:        "#34d399",
    brown:       "#78350f",
    brownLight:  "#fef3c7",
    pink:        "#831843",
    pinkLight:   "#fbcfe8",
  },

  /* ── Spacing (8-pt grid) ───────────────────── */
  spacing: {
    xs:  "4px",
    sm:  "8px",
    md:  "16px",
    lg:  "24px",
    xl:  "32px",
    xxl: "48px",
    xxxl:"64px",
  },

  /* ── Radii ─────────────────────────────────── */
  radius: {
    sm:  "6px",
    md:  "8px",
    lg:  "12px",
    xl:  "16px",
    full:"9999px",
  },

  /* ── Shadows ───────────────────────────────── */
  shadow: {
    sm:  "0 1px 2px rgba(0,0,0,0.04)",
    md:  "0 2px 8px rgba(0,0,0,0.06)",
    lg:  "0 4px 16px rgba(0,0,0,0.08)",
  },
};

export default theme;
