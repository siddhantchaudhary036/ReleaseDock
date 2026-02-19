"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ChangelogEditor from "../../../../components/ChangelogEditor";
import CoverImageUpload from "../../../../components/CoverImageUpload";
import AutoSaveIndicator from "../../../../components/AutoSaveIndicator";
import { useAutoSave } from "../../../../hooks/useAutoSave";
import { serializeBlocks } from "../../../../lib/blocknote";
import theme from "../../../../constants/theme";

export default function NewChangelogPage() {
  const router = useRouter();
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState([]);
  const [selectedLabelIds, setSelectedLabelIds] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [coverImageId, setCoverImageId] = useState(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");

  const createChangelog = useMutation(api.changelogs.createChangelog);
  const updateChangelog = useMutation(api.changelogs.updateChangelog);
  const publishChangelog = useMutation(api.changelogs.publishChangelog);

  // Track the draft ID once auto-saved for the first time
  const [draftId, setDraftId] = useState(null);

  // Refs to hold latest state for auto-save
  const titleRef = useRef(title);
  const contentRef = useRef(content);
  const labelIdsRef = useRef(selectedLabelIds);
  const categoryIdsRef = useRef(selectedCategoryIds);
  const coverImageRef = useRef(coverImageId);
  const draftIdRef = useRef(draftId);
  useEffect(() => { titleRef.current = title; }, [title]);
  useEffect(() => { contentRef.current = content; }, [content]);
  useEffect(() => { labelIdsRef.current = selectedLabelIds; }, [selectedLabelIds]);
  useEffect(() => { categoryIdsRef.current = selectedCategoryIds; }, [selectedCategoryIds]);
  useEffect(() => { coverImageRef.current = coverImageId; }, [coverImageId]);
  useEffect(() => { draftIdRef.current = draftId; }, [draftId]);

  const autoSaveFn = useCallback(async () => {
    if (!titleRef.current.trim() || !currentProjectId) return;
    if (draftIdRef.current) {
      // Already created — update
      await updateChangelog({
        changelogId: draftIdRef.current,
        title: titleRef.current.trim(),
        content: contentRef.current,
        labelIds: labelIdsRef.current,
        categoryIds: categoryIdsRef.current,
        coverImageId: coverImageRef.current,
      });
    } else {
      // First save — create draft
      const id = await createChangelog({
        projectId: currentProjectId,
        title: titleRef.current.trim(),
        content: contentRef.current,
        labelIds: labelIdsRef.current,
        categoryIds: categoryIdsRef.current,
        coverImageId: coverImageRef.current,
      });
      setDraftId(id);
      draftIdRef.current = id;
    }
  }, [currentProjectId, createChangelog, updateChangelog]);

  const { autoSaveStatus, triggerAutoSave, flushAutoSave } = useAutoSave(
    autoSaveFn,
    5000,
    !!currentProjectId
  );

  useEffect(() => {
    const savedProjectId = localStorage.getItem("currentProjectId");
    if (savedProjectId) setCurrentProjectId(savedProjectId);
  }, []);

  const labels = useQuery(
    api.labels.getLabelsByProject,
    currentProjectId ? { projectId: currentProjectId } : "skip"
  );

  const categories = useQuery(
    api.categories.getCategoriesByProject,
    currentProjectId ? { projectId: currentProjectId } : "skip"
  );

  const handleSave = async (shouldPublish = false) => {
    if (!currentProjectId) { alert("Please select a project first"); return; }
    if (!title.trim()) { alert("Please enter a title"); return; }
    flushAutoSave();
    setIsSaving(true);
    try {
      let changelogId = draftId;
      if (changelogId) {
        // Draft was already auto-saved — update it
        await updateChangelog({
          changelogId,
          title: title.trim(),
          content,
          labelIds: selectedLabelIds,
          categoryIds: selectedCategoryIds,
          coverImageId,
        });
      } else {
        // No auto-save yet — create fresh
        changelogId = await createChangelog({
          projectId: currentProjectId,
          title: title.trim(),
          content,
          labelIds: selectedLabelIds,
          categoryIds: selectedCategoryIds,
          coverImageId,
        });
      }
      if (shouldPublish) {
        const scheduledPublishTime = scheduledTime
          ? new Date(scheduledTime).getTime()
          : undefined;
        await publishChangelog({ changelogId, scheduledPublishTime });
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
    triggerAutoSave();
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
    triggerAutoSave();
  };

  if (!currentProjectId) {
    return (
      <div className="text-center py-16">
        <p className="text-sm" style={{ color: theme.text.tertiary }}>Select a project to create a changelog</p>
      </div>
    );
  }

  const isScheduled = scheduledTime && new Date(scheduledTime).getTime() > Date.now();

  // Minimum datetime for the picker (now, rounded up to next minute)
  const minDateTime = (() => {
    const d = new Date(Date.now() + 60000);
    d.setSeconds(0, 0);
    return d.toISOString().slice(0, 16);
  })();

  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Sticky top bar */}
      <div
        className="flex items-center justify-between mb-8 pb-4"
        style={{ borderBottom: `1px solid ${theme.neutral.border}` }}
      >
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/changelogs"
            className="p-1 rounded-md transition-colors hover:bg-gray-100"
            style={{ color: theme.text.tertiary, textDecoration: "none" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <span className="text-xs" style={{ color: theme.text.tertiary }}>New changelog</span>
          <span className="text-xs" style={{ color: theme.text.tertiary }}>·</span>
          <span className="text-xs" style={{ color: theme.text.tertiary }}>{today}</span>
          <AutoSaveIndicator status={autoSaveStatus} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="editor-btn-secondary px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
            style={{
              backgroundColor: theme.neutral.white,
              color: theme.text.muted,
              border: `1px solid ${theme.neutral.border}`,
              cursor: isSaving ? "not-allowed" : "pointer",
            }}
          >
            {isSaving ? "Saving…" : "Save draft"}
          </button>
          <div className="flex items-center gap-1.5">
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              min={minDateTime}
              className="schedule-input px-2 py-1.5 rounded-md text-xs"
              style={{
                backgroundColor: theme.neutral.white,
                color: theme.text.muted,
                border: `1px solid ${theme.neutral.border}`,
                outline: "none",
                width: scheduledTime ? "auto" : "32px",
                opacity: scheduledTime ? 1 : 0.6,
              }}
              title="Schedule publish time"
            />
            {scheduledTime && (
              <button
                onClick={() => setScheduledTime("")}
                className="p-1 rounded transition-colors"
                style={{ color: theme.text.tertiary }}
                title="Clear schedule"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="editor-btn-primary px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
            style={{
              backgroundColor: isScheduled ? theme.status.info : theme.brand.primary,
              color: theme.text.inverse,
              border: "none",
              cursor: isSaving ? "not-allowed" : "pointer",
            }}
          >
            {isSaving
              ? isScheduled ? "Scheduling…" : "Publishing…"
              : isScheduled ? "Schedule" : "Publish"}
          </button>
        </div>
      </div>

      {/* Cover image */}
      <CoverImageUpload
        coverImageId={coverImageId}
        onCoverImageChange={(id) => { setCoverImageId(id); triggerAutoSave(); }}
      />

      {/* Title — large, Notion-style */}
      <input
        type="text"
        value={title}
        onChange={(e) => { setTitle(e.target.value); triggerAutoSave(); }}
        placeholder="Untitled"
        className="w-full focus:outline-none"
        style={{
          color: theme.text.primary,
          backgroundColor: "transparent",
          border: "none",
          padding: 0,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}
      />

      {/* Meta row: categories + labels */}
      <div
        className="flex flex-col gap-2.5 mt-3 mb-6 pb-5"
        style={{ borderBottom: `1px solid ${theme.neutral.borderLight}` }}
      >
        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium mr-0.5" style={{ color: theme.text.tertiary }}>
              <svg className="w-3 h-3 inline-block mr-0.5 -mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
              </svg>
              Category
            </span>
            {categories.map((cat) => {
              const selected = selectedCategoryIds.includes(cat._id);
              return (
                <button
                  key={cat._id}
                  onClick={() => toggleCategory(cat._id)}
                  className="category-chip inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-all"
                  style={{
                    backgroundColor: selected ? `${cat.color}12` : "transparent",
                    color: selected ? cat.color : theme.text.tertiary,
                    border: `1px solid ${selected ? `${cat.color}30` : theme.neutral.border}`,
                    cursor: "pointer",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Labels */}
        {labels && labels.length > 0 ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium mr-0.5" style={{ color: theme.text.tertiary }}>Labels</span>
            {labels.map((label) => {
              const selected = selectedLabelIds.includes(label._id);
              return (
                <button
                  key={label._id}
                  onClick={() => toggleLabel(label._id)}
                  className="label-chip inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all"
                  style={{
                    backgroundColor: selected ? `${label.color}15` : "transparent",
                    color: selected ? label.color : theme.text.tertiary,
                    border: `1px solid ${selected ? `${label.color}30` : theme.neutral.border}`,
                    cursor: "pointer",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: label.color }}
                  />
                  {label.name}
                </button>
              );
            })}
          </div>
        ) : (
          !categories?.length && (
            <span className="text-[11px]" style={{ color: theme.text.tertiary }}>
              No labels or categories configured
            </span>
          )
        )}
      </div>

      {/* Editor — borderless, flows naturally */}
      <ChangelogEditor
        initialContent={content}
        onChange={(blocks) => { setContent(serializeBlocks(blocks)); triggerAutoSave(); }}
      />

      {/* Subtle hint */}
      <div className="mt-6 flex items-center gap-1.5" style={{ color: theme.text.tertiary }}>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
        <span className="text-[11px]">Type / for commands</span>
      </div>

      <style>{`
        .editor-btn-primary:hover:not(:disabled) {
          background-color: ${theme.brand.primaryHover} !important;
        }
        .editor-btn-secondary:hover:not(:disabled) {
          background-color: ${theme.neutral.hover} !important;
        }
        .label-chip:hover {
          border-color: ${theme.neutral.subtle} !important;
        }
        .category-chip:hover {
          border-color: ${theme.neutral.subtle} !important;
        }
        .schedule-input:focus {
          border-color: ${theme.brand.primary} !important;
          width: auto !important;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
