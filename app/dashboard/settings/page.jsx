"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import theme from "../../../constants/theme";

const tabs = [
  { id: "project", label: "Project" },
  { id: "widget", label: "Widget" },
  { id: "api-keys", label: "API Keys" },
  { id: "labels", label: "Labels" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("widget");
  const [currentProjectId, setCurrentProjectId] = useState(null);

  const [primaryColor, setPrimaryColor] = useState(theme.brand.accent);
  const [position, setPosition] = useState("bottom-right");
  const [showBranding, setShowBranding] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedProjectId = localStorage.getItem("currentProjectId");
    if (savedProjectId) setCurrentProjectId(savedProjectId);
  }, []);

  const project = useQuery(
    api.projects.getProjectById,
    currentProjectId ? { projectId: currentProjectId } : "skip"
  );
  const updateWidgetSettings = useMutation(api.projects.updateWidgetSettings);

  useEffect(() => {
    if (project?.widgetSettings) {
      setPrimaryColor(project.widgetSettings.primaryColor);
      setPosition(project.widgetSettings.position);
      setShowBranding(project.widgetSettings.showBranding);
    }
  }, [project]);

  const handleSave = async () => {
    if (!currentProjectId) return;
    setIsSaving(true);
    setSaveMessage("");
    try {
      await updateWidgetSettings({
        projectId: currentProjectId,
        widgetSettings: { primaryColor, position, showBranding },
      });
      setSaveMessage("Saved");
      setTimeout(() => setSaveMessage(""), 2000);
    } catch (error) {
      setSaveMessage("Failed to save");
      console.error("Error saving widget settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyEmbed = () => {
    const embedCode = `<script src="https://cdn.releasedock.co/widget.js" data-project="${project?.apiKey || "YOUR_API_KEY"}" async></script>`;
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      {activeTab === "widget" && (
        <WidgetTab
          currentProjectId={currentProjectId}
          project={project}
          primaryColor={primaryColor}
          setPrimaryColor={setPrimaryColor}
          position={position}
          setPosition={setPosition}
          showBranding={showBranding}
          setShowBranding={setShowBranding}
          isSaving={isSaving}
          saveMessage={saveMessage}
          handleSave={handleSave}
          copied={copied}
          handleCopyEmbed={handleCopyEmbed}
        />
      )}
      {activeTab === "api-keys" && <PlaceholderTab title="API Keys" description="API key management coming soon." />}
      {activeTab === "labels" && <PlaceholderTab title="Labels" description="Label management coming soon." />}

      <style>{`
        .settings-tab:hover {
          color: ${theme.text.primary} !important;
        }
      `}</style>
    </div>
  );
}


/* ── Widget Tab ─────────────────────────────── */
function WidgetTab({
  currentProjectId, project, primaryColor, setPrimaryColor,
  position, setPosition, showBranding, setShowBranding,
  isSaving, saveMessage, handleSave, copied, handleCopyEmbed,
}) {
  if (!currentProjectId) {
    return <p className="text-sm py-12 text-center" style={{ color: theme.text.tertiary }}>Select a project first.</p>;
  }
  if (!project) {
    return <p className="text-sm py-12 text-center" style={{ color: theme.text.tertiary }}>Loading…</p>;
  }

  return (
    <div className="max-w-xl space-y-5">
      {/* Appearance */}
      <Card title="Appearance">
        <Field label="Primary color" hint="Used for buttons and accents.">
          <div className="flex items-center gap-2.5">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-8 h-8 rounded-md cursor-pointer border-0 p-0"
              style={{ backgroundColor: "transparent" }}
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-md text-sm focus:outline-none"
              style={{
                backgroundColor: theme.neutral.bg,
                border: `1px solid ${theme.neutral.border}`,
                color: theme.text.primary,
              }}
            />
          </div>
        </Field>

        <Field label="Position" hint="Where the launcher appears on your site.">
          <div className="flex gap-2">
            {["bottom-right", "bottom-left"].map((pos) => (
              <button
                key={pos}
                onClick={() => setPosition(pos)}
                className="flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all"
                style={{
                  backgroundColor: position === pos ? theme.brand.primary : theme.neutral.white,
                  border: `1px solid ${position === pos ? theme.brand.primary : theme.neutral.border}`,
                  color: position === pos ? theme.text.inverse : theme.text.secondary,
                  cursor: "pointer",
                }}
              >
                {pos === "bottom-right" ? "Bottom right" : "Bottom left"}
              </button>
            ))}
          </div>
        </Field>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: theme.text.primary }}>Show branding</p>
            <p className="text-xs mt-0.5" style={{ color: theme.text.tertiary }}>
              "Powered by ReleaseDock" in the widget.
            </p>
          </div>
          <button
            role="switch"
            aria-checked={showBranding}
            onClick={() => setShowBranding(!showBranding)}
            className="relative w-9 h-5 rounded-full transition-colors flex-shrink-0"
            style={{
              backgroundColor: showBranding ? theme.brand.primary : theme.neutral.subtle,
              border: "none",
              cursor: "pointer",
            }}
          >
            <span
              className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform"
              style={{
                backgroundColor: theme.neutral.white,
                transform: showBranding ? "translateX(16px)" : "translateX(0)",
                boxShadow: theme.shadow.sm,
              }}
            />
          </button>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: isSaving ? theme.neutral.muted : theme.brand.primary,
              color: isSaving ? theme.text.tertiary : theme.text.inverse,
              border: "none",
              cursor: isSaving ? "not-allowed" : "pointer",
            }}
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
          {saveMessage && (
            <span className="text-xs" style={{ color: saveMessage === "Saved" ? theme.status.success : theme.status.error }}>
              {saveMessage}
            </span>
          )}
        </div>
      </Card>

      {/* Embed Code */}
      <Card title="Embed code">
        <p className="text-xs" style={{ color: theme.text.tertiary }}>
          Add before the closing <code style={{ color: theme.brand.primary }}>&lt;/body&gt;</code> tag.
        </p>
        <div
          className="rounded-md p-3 font-mono text-xs break-all"
          style={{
            backgroundColor: theme.neutral.bg,
            border: `1px solid ${theme.neutral.border}`,
            color: theme.text.secondary,
          }}
        >
          {`<script src="https://cdn.releasedock.co/widget.js" data-project="${project.apiKey}" async></script>`}
        </div>
        <button
          onClick={handleCopyEmbed}
          className="w-full px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
          style={{
            backgroundColor: theme.neutral.bg,
            color: theme.text.secondary,
            border: `1px solid ${theme.neutral.border}`,
            cursor: "pointer",
          }}
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" style={{ color: theme.status.success }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span style={{ color: theme.status.success }}>Copied</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
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

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: theme.text.secondary }}>
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] mt-1" style={{ color: theme.text.tertiary }}>{hint}</p>}
    </div>
  );
}
