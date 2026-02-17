"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ChangelogEditor from "../../../../components/ChangelogEditor";
import { serializeBlocks } from "../../../../lib/blocknote";
import theme from "../../../../constants/theme";

export default function NewChangelogPage() {
  const router = useRouter();
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState([]);
  const [selectedLabelIds, setSelectedLabelIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const createChangelog = useMutation(api.changelogs.createChangelog);
  const publishChangelog = useMutation(api.changelogs.publishChangelog);

  useEffect(() => {
    const savedProjectId = localStorage.getItem("currentProjectId");
    if (savedProjectId) {
      setCurrentProjectId(savedProjectId);
    }
  }, []);

  const labels = useQuery(
    api.labels.getLabelsByProject,
    currentProjectId ? { projectId: currentProjectId } : "skip"
  );

  const handleSave = async (shouldPublish = false) => {
    if (!currentProjectId) {
      alert("Please select a project first");
      return;
    }
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    setIsSaving(true);
    try {
      const changelogId = await createChangelog({
        projectId: currentProjectId,
        title: title.trim(),
        content: content,
        labelIds: selectedLabelIds,
      });
      if (shouldPublish) {
        await publishChangelog({ changelogId });
      }
      router.push("/dashboard/changelogs");
    } catch (error) {
      console.error("Error saving changelog:", error);
      alert("Failed to save changelog. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleLabel = (labelId) => {
    setSelectedLabelIds((prev) =>
      prev.includes(labelId) ? prev.filter((id) => id !== labelId) : [...prev, labelId]
    );
  };

  if (!currentProjectId) {
    return (
      <div className="text-center py-12">
        <p style={{ color: theme.text.tertiary }}>Please select a project to create a changelog</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/changelogs" className="transition-colors" style={{ color: theme.text.tertiary }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold" style={{ color: theme.text.primary }}>New Changelog</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: theme.neutral.bg, color: theme.text.primary, border: `1px solid ${theme.neutral.border}` }}
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: theme.brand.primary, color: theme.text.inverse }}
          >
            {isSaving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {/* Title Input */}
      <div className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Changelog title..."
          className="w-full px-4 py-3 rounded-lg text-xl font-semibold focus:outline-none"
          style={{
            backgroundColor: theme.neutral.white,
            border: `1px solid ${theme.neutral.border}`,
            color: theme.text.primary,
            "::placeholder": { color: theme.text.placeholder },
          }}
        />
      </div>

      {/* Labels */}
      {labels && labels.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>Labels</label>
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
              <button
                key={label._id}
                onClick={() => toggleLabel(label._id)}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedLabelIds.includes(label._id) ? "ring-2 ring-offset-2" : "opacity-60 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: `${label.color}20`,
                  color: label.color,
                  ringColor: selectedLabelIds.includes(label._id) ? label.color : undefined,
                }}
              >
                {label.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Editor */}
      <ChangelogEditor initialContent={content} onChange={(blocks) => setContent(serializeBlocks(blocks))} />

      {/* Helper Text */}
      <div className="mt-4 text-sm" style={{ color: theme.text.tertiary }}>
        <p>Tip: Use the editor to compose your changelog with rich formatting. Save as draft to continue editing later, or publish to make it live.</p>
      </div>
    </div>
  );
}
