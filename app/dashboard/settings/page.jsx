"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import theme from "../../../constants/theme";

const PRESET_COLORS = [
  "#2563eb", "#7c3aed", "#db2777", "#dc2626",
  "#ea580c", "#d97706", "#16a34a", "#0d9488",
  "#0284c7", "#6366f1", "#64748b", "#78350f",
];

const tabs = [
  { id: "project", label: "Project" },
  { id: "categories", label: "Categories" },
  { id: "labels", label: "Labels" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("project");
  const [currentProjectId, setCurrentProjectId] = useState(null);

  useEffect(() => {
    const savedProjectId = localStorage.getItem("currentProjectId");
    if (savedProjectId) setCurrentProjectId(savedProjectId);
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Settings</h1>
        <p className="text-xs mt-0.5" style={{ color: theme.text.tertiary }}>
          Manage your project configuration
        </p>
      </div>

      {/* Tab bar */}
      <div
        className="flex items-center gap-0.5 mb-6 pb-px"
        style={{ borderBottom: `1px solid ${theme.neutral.border}` }}
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="settings-tab px-3 py-2 text-sm font-medium transition-colors relative"
              style={{
                color: active ? theme.text.primary : theme.text.tertiary,
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              {tab.label}
              {active && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: theme.brand.primary }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "project" && <PlaceholderTab title="Project" description="Project switching coming soon." />}
      {activeTab === "categories" && <CategoriesTab projectId={currentProjectId} />}
      {activeTab === "labels" && <LabelsTab projectId={currentProjectId} />}

      <style>{`
        .settings-tab:hover {
          color: ${theme.text.primary} !important;
        }
      `}</style>
    </div>
  );
}

/* ── Categories Tab ─────────────────────────── */
function CategoriesTab({ projectId }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const categories = useQuery(
    api.categories.getCategoriesByProject,
    projectId ? { projectId } : "skip"
  );
  const createCategory = useMutation(api.categories.createCategory);
  const deleteCategory = useMutation(api.categories.deleteCategory);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !projectId) return;
    setIsCreating(true);
    try {
      await createCategory({ projectId, name: name.trim(), color });
      setName("");
      setColor(PRESET_COLORS[0]);
      setShowForm(false);
    } catch (err) {
      alert(err.message || "Failed to create category");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!confirm("Delete this category? It will be removed from all changelogs.")) return;
    try {
      await deleteCategory({ categoryId });
    } catch (err) {
      alert(err.message || "Failed to delete category");
    }
  };

  if (!projectId) {
    return <PlaceholderTab title="Categories" description="Select a project first." />;
  }

  return (
    <div className="max-w-xl">
      <Card>
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-sm font-semibold" style={{ color: theme.text.primary }}>Categories</h2>
            <p className="text-xs mt-0.5" style={{ color: theme.text.tertiary }}>
              Product areas like "iOS", "API", or "Billing". Categories help organize changelogs by what part of your product changed.
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="settings-add-btn flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors"
              style={{
                backgroundColor: theme.brand.primary,
                color: theme.text.inverse,
                border: "none",
                cursor: "pointer",
              }}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add
            </button>
          )}
        </div>

        {/* Create form */}
        {showForm && (
          <form onSubmit={handleCreate} className="mt-4 p-3 rounded-lg" style={{ backgroundColor: theme.neutral.bg, border: `1px solid ${theme.neutral.border}` }}>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-medium mb-1" style={{ color: theme.text.tertiary }}>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. iOS, API, Billing"
                  autoFocus
                  className="w-full px-2.5 py-1.5 rounded-md text-sm"
                  style={{
                    backgroundColor: theme.neutral.white,
                    border: `1px solid ${theme.neutral.border}`,
                    color: theme.text.primary,
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium mb-1" style={{ color: theme.text.tertiary }}>Color</label>
                <div className="flex gap-1">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="w-5 h-5 rounded-full transition-transform"
                      style={{
                        backgroundColor: c,
                        border: color === c ? `2px solid ${theme.text.primary}` : "2px solid transparent",
                        transform: color === c ? "scale(1.15)" : "scale(1)",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                type="submit"
                disabled={isCreating || !name.trim()}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: theme.brand.primary,
                  color: theme.text.inverse,
                  border: "none",
                  cursor: isCreating ? "not-allowed" : "pointer",
                }}
              >
                {isCreating ? "Creating…" : "Create category"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setName(""); }}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={{
                  backgroundColor: "transparent",
                  color: theme.text.muted,
                  border: `1px solid ${theme.neutral.border}`,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Category list */}
        <div className="mt-4 space-y-1">
          {categories === undefined ? (
            <div className="py-6 text-center">
              <div className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.neutral.border, borderTopColor: "transparent" }} />
            </div>
          ) : categories.length === 0 ? (
            <div className="py-8 text-center rounded-md" style={{ backgroundColor: theme.neutral.bg, border: `1px dashed ${theme.neutral.border}` }}>
              <svg className="w-8 h-8 mx-auto mb-2" style={{ color: theme.text.tertiary, opacity: 0.4 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
              </svg>
              <p className="text-xs" style={{ color: theme.text.tertiary }}>No categories yet</p>
              <p className="text-[11px] mt-0.5" style={{ color: theme.text.tertiary }}>Categories organize changelogs by product area</p>
            </div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat._id}
                className="category-row flex items-center justify-between px-3 py-2 rounded-md transition-colors"
                style={{ border: `1px solid transparent` }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm font-medium" style={{ color: theme.text.primary }}>{cat.name}</span>
                </div>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="category-delete-btn opacity-0 p-1 rounded transition-all"
                  style={{ color: theme.text.tertiary, border: "none", backgroundColor: "transparent", cursor: "pointer" }}
                  title="Delete category"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </Card>

      <style>{`
        .category-row:hover {
          background-color: ${theme.neutral.hover};
          border-color: ${theme.neutral.border} !important;
        }
        .category-row:hover .category-delete-btn {
          opacity: 1;
        }
        .category-delete-btn:hover {
          color: ${theme.status.error} !important;
          background-color: ${theme.status.errorLight} !important;
        }
        .settings-add-btn:hover {
          background-color: ${theme.brand.primaryHover} !important;
        }
      `}</style>
    </div>
  );
}

/* ── Labels Tab ─────────────────────────────── */
function LabelsTab({ projectId }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const labels = useQuery(
    api.labels.getLabelsByProject,
    projectId ? { projectId } : "skip"
  );
  const createLabel = useMutation(api.labels.createLabel);
  const deleteLabel = useMutation(api.labels.deleteLabel);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !projectId) return;
    setIsCreating(true);
    try {
      await createLabel({ projectId, name: name.trim(), color });
      setName("");
      setColor(PRESET_COLORS[0]);
      setShowForm(false);
    } catch (err) {
      alert(err.message || "Failed to create label");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (labelId) => {
    if (!confirm("Delete this label? It will be removed from all changelogs.")) return;
    try {
      await deleteLabel({ labelId });
    } catch (err) {
      alert(err.message || "Failed to delete label");
    }
  };

  if (!projectId) {
    return <PlaceholderTab title="Labels" description="Select a project first." />;
  }

  return (
    <div className="max-w-xl">
      <Card>
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-sm font-semibold" style={{ color: theme.text.primary }}>Labels</h2>
            <p className="text-xs mt-0.5" style={{ color: theme.text.tertiary }}>
              Change types like "Feature", "Bugfix", or "Improvement". Labels describe what kind of change was made.
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="settings-add-btn flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors"
              style={{
                backgroundColor: theme.brand.primary,
                color: theme.text.inverse,
                border: "none",
                cursor: "pointer",
              }}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add
            </button>
          )}
        </div>

        {/* Create form */}
        {showForm && (
          <form onSubmit={handleCreate} className="mt-4 p-3 rounded-lg" style={{ backgroundColor: theme.neutral.bg, border: `1px solid ${theme.neutral.border}` }}>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-medium mb-1" style={{ color: theme.text.tertiary }}>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Feature, Bugfix, Improvement"
                  autoFocus
                  className="w-full px-2.5 py-1.5 rounded-md text-sm"
                  style={{
                    backgroundColor: theme.neutral.white,
                    border: `1px solid ${theme.neutral.border}`,
                    color: theme.text.primary,
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium mb-1" style={{ color: theme.text.tertiary }}>Color</label>
                <div className="flex gap-1">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="w-5 h-5 rounded-full transition-transform"
                      style={{
                        backgroundColor: c,
                        border: color === c ? `2px solid ${theme.text.primary}` : "2px solid transparent",
                        transform: color === c ? "scale(1.15)" : "scale(1)",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                type="submit"
                disabled={isCreating || !name.trim()}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: theme.brand.primary,
                  color: theme.text.inverse,
                  border: "none",
                  cursor: isCreating ? "not-allowed" : "pointer",
                }}
              >
                {isCreating ? "Creating…" : "Create label"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setName(""); }}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={{
                  backgroundColor: "transparent",
                  color: theme.text.muted,
                  border: `1px solid ${theme.neutral.border}`,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Label list */}
        <div className="mt-4 space-y-1">
          {labels === undefined ? (
            <div className="py-6 text-center">
              <div className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.neutral.border, borderTopColor: "transparent" }} />
            </div>
          ) : labels.length === 0 ? (
            <div className="py-8 text-center rounded-md" style={{ backgroundColor: theme.neutral.bg, border: `1px dashed ${theme.neutral.border}` }}>
              <svg className="w-8 h-8 mx-auto mb-2" style={{ color: theme.text.tertiary, opacity: 0.4 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              <p className="text-xs" style={{ color: theme.text.tertiary }}>No labels yet</p>
              <p className="text-[11px] mt-0.5" style={{ color: theme.text.tertiary }}>Labels describe the type of change</p>
            </div>
          ) : (
            labels.map((label) => (
              <div
                key={label._id}
                className="category-row flex items-center justify-between px-3 py-2 rounded-md transition-colors"
                style={{ border: `1px solid transparent` }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: label.color }} />
                  <span className="text-sm font-medium" style={{ color: theme.text.primary }}>{label.name}</span>
                </div>
                <button
                  onClick={() => handleDelete(label._id)}
                  className="category-delete-btn opacity-0 p-1 rounded transition-all"
                  style={{ color: theme.text.tertiary, border: "none", backgroundColor: "transparent", cursor: "pointer" }}
                  title="Delete label"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

/* ── Placeholder Tab ────────────────────────── */
function PlaceholderTab({ title, description }) {
  return (
    <div className="max-w-xl">
      <Card title={title}>
        <div
          className="text-center py-8 rounded-md"
          style={{ backgroundColor: theme.neutral.bg, border: `1px dashed ${theme.neutral.border}` }}
        >
          <p className="text-sm" style={{ color: theme.text.tertiary }}>{description}</p>
        </div>
      </Card>
    </div>
  );
}

/* ── Shared UI ──────────────────────────────── */
function Card({ title, children }) {
  return (
    <div
      className="rounded-lg p-5 space-y-4"
      style={{
        backgroundColor: theme.neutral.white,
        border: `1px solid ${theme.neutral.border}`,
      }}
    >
      {title && (
        <h2 className="text-sm font-semibold" style={{ color: theme.text.primary }}>{title}</h2>
      )}
      {children}
    </div>
  );
}
