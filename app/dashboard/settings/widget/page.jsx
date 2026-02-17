"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import theme from "../../../../constants/theme";

export default function WidgetSettingsPage() {
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [primaryColor, setPrimaryColor] = useState(theme.brand.accent);
  const [position, setPosition] = useState("bottom-right");
  const [showBranding, setShowBranding] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedProjectId = localStorage.getItem("currentProjectId");
    if (savedProjectId) {
      setCurrentProjectId(savedProjectId);
    }
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
      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("Failed to save settings");
      console.error("Error saving widget settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyEmbed = () => {
    const embedCode = `<script src="https://cdn.releasedock.co/widget.js" data-project="${project?.apiKey || 'YOUR_API_KEY'}" async></script>`;
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!currentProjectId) {
    return (
      <div className="text-center py-12">
        <p style={{ color: theme.text.tertiary }}>Please select a project to configure widget settings</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p style={{ color: theme.text.tertiary }}>Loading project...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text.primary }}>Widget Settings</h1>
      <p className="mb-8" style={{ color: theme.text.secondary }}>
        Customize the appearance and behavior of your changelog widget
      </p>

      <div className="space-y-6">
        {/* Widget Theming Section */}
        <div className="rounded-lg p-6" style={{ backgroundColor: theme.neutral.white, border: `1px solid ${theme.neutral.border}` }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }}>Appearance</h2>

          <div className="space-y-6">
            {/* Primary Color Picker */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>Primary Color</label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-16 h-10 rounded cursor-pointer"
                  style={{ border: `1px solid ${theme.neutral.border}`, backgroundColor: theme.neutral.bg }}
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder={theme.brand.accent}
                  className="flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.neutral.bg,
                    border: `1px solid ${theme.neutral.border}`,
                    color: theme.text.primary,
                    focusRingColor: theme.brand.primary,
                  }}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: theme.text.tertiary }}>
                This color will be used for buttons and accents in the widget
              </p>
            </div>

            {/* Position Toggle */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>Widget Position</label>
              <div className="flex space-x-3">
                {["bottom-right", "bottom-left"].map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setPosition(pos)}
                    className="flex-1 px-4 py-3 rounded-lg transition-colors"
                    style={{
                      backgroundColor: position === pos ? theme.brand.primary : theme.neutral.bg,
                      border: `1px solid ${position === pos ? theme.brand.primary : theme.neutral.border}`,
                      color: position === pos ? theme.text.inverse : theme.text.secondary,
                    }}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d={pos === "bottom-right" ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
                      </svg>
                      <span>{pos === "bottom-right" ? "Bottom Right" : "Bottom Left"}</span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs mt-1" style={{ color: theme.text.tertiary }}>
                Choose where the widget launcher button appears on your site
              </p>
            </div>

            {/* Branding Toggle */}
            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="block text-sm font-medium" style={{ color: theme.text.secondary }}>Show ReleaseDock Branding</span>
                  <span className="text-xs mt-1" style={{ color: theme.text.tertiary }}>
                    Display "Powered by ReleaseDock" in the widget footer
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showBranding}
                    onChange={(e) => setShowBranding(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:rounded-full after:h-5 after:w-5 after:transition-all"
                    style={{
                      backgroundColor: showBranding ? theme.brand.primary : theme.neutral.subtle,
                      afterBackgroundColor: theme.neutral.white,
                    }}
                  ></div>
                </div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${theme.neutral.border}` }}>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: isSaving ? theme.neutral.bg : theme.brand.primary,
                  color: isSaving ? theme.text.tertiary : theme.text.inverse,
                  cursor: isSaving ? "not-allowed" : "pointer",
                }}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              {saveMessage && (
                <span className="text-sm" style={{
                  color: saveMessage.includes("success") ? theme.status.success : theme.status.error,
                }}>
                  {saveMessage}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Embed Code Section */}
        <div className="rounded-lg p-6" style={{ backgroundColor: theme.neutral.white, border: `1px solid ${theme.neutral.border}` }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }}>Embed Code</h2>
          <p className="text-sm mb-4" style={{ color: theme.text.secondary }}>
            Add this snippet to your website's HTML, just before the closing{" "}
            <code style={{ color: theme.brand.primary }}>&lt;/body&gt;</code> tag
          </p>

          <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: theme.neutral.bg, border: `1px solid ${theme.neutral.border}` }}>
            <code className="text-sm break-all font-mono" style={{ color: theme.text.secondary }}>
              {`<script src="https://cdn.releasedock.co/widget.js" data-project="${project.apiKey}" async></script>`}
            </code>
          </div>

          <button
            onClick={handleCopyEmbed}
            className="w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            style={{ backgroundColor: theme.neutral.bg, color: theme.text.secondary, border: `1px solid ${theme.neutral.border}` }}
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" style={{ color: theme.status.success }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{ color: theme.status.success }}>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy to Clipboard</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
