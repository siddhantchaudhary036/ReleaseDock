"use client";

import { useState, useEffect, use } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ChangelogEditor from "../../../../components/ChangelogEditor";
import CoverImageUpload from "../../../../components/CoverImageUpload";
import { serializeBlocks } from "../../../../lib/blocknote";
import theme from "../../../../constants/theme";

export default function EditChangelogPage({ params }) {
  const router = useRouter();
  const { id: changelogId } = use(params);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState([]);
  const [selectedLabelIds, setSelectedLabelIds] = useState([]);
  const [coverImageId, setCoverImageId] = useState(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [scheduledTime, setScheduledTime] = useState("");
  const [confirmUnpublish, setConfirmUnpublish] = useState(false);

  const updateChangelog = useMutation(api.changelogs.updateChangelog);
  const publishChangelog = useMutation(api.changelogs.publishChangelog);
  const cancelSchedule = useMutation(api.changelogs.cancelScheduledPublish);
  const unpublishChangelog = useMutation(api.changelogs.unpublishChangelog);

  useEffect(() => {
    const savedProjectId = localStorage.getItem("currentProjectId");
    if (savedProjectId) setCurrentProjectId(savedProjectId);
  }, []);

  const currentChangelog = useQuery(
    api.changelogs.getChangelogById,
    changelogId ? { changelogId } : "skip"
  );

  const labels = useQuery(
    api.labels.getLabelsByProject,
    currentProjectId ? { projectId: currentProjectId } : "skip"
  );

  useEffect(() => {
    if (currentChangelog && !isLoaded) {
      setTitle(currentChangelog.title || "");
      setContent(currentChangelog.content || []);
      setSelectedLabelIds(currentChangelog.labelIds || []);
      setCoverImageId(currentChangelog.coverImageId || undefined);
      setCurrentProjectId(currentChangelog.projectId);
      if (currentChangelog.scheduledPublishTime) {
        const d = new Date(currentChangelog.scheduledPublishTime);
        setScheduledTime(d.toISOString().slice(0, 16));
      }
      setIsLoaded(true);
    }
  }, [currentChangelog, isLoaded]);

  const handleSave = async (shouldPublish = false) => {
    if (!title.trim()) { alert("Please enter a title"); return; }
    setIsSaving(true);
    try {
      await updateChangelog({
        changelogId,
        title: title.trim(),
        content,
        labelIds: selectedLabelIds,
        coverImageId,
      });
      if (shouldPublish && currentChangelog?.status !== "published") {
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

  const handleCancelSchedule = async () => {
    setIsSaving(true);
    try {
      await cancelSchedule({ changelogId });
      setScheduledTime("");
    } catch (error) {
      console.error("Error canceling schedule:", error);
      alert("Failed to cancel schedule.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnpublish = async () => {
    if (!confirmUnpublish) {
      setConfirmUnpublish(true);
      return;
    }
    setIsSaving(true);
    try {
      await unpublishChangelog({ changelogId });
      setConfirmUnpublish(false);
    } catch (error) {
      console.error("Error unpublishing changelog:", error);
      alert("Failed to unpublish. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleLabel = (labelId) => {
    setSelectedLabelIds((prev) =>
      prev.includes(labelId) ? prev.filter((id) => id !== labelId) : [...prev, labelId]
    );
  };

  if (!currentChangelog) {
    return (
      <div className="text-center py-16">
        <div className="inline-block w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.neutral.border, borderTopColor: "transparent" }} />
      </div>
    );
  }

  const isPublished = currentChangelog.status === "published";
  const isScheduledStatus = currentChangelog.status === "scheduled";
  const isScheduled = scheduledTime && new Date(scheduledTime).getTime() > Date.now();

  const minDateTime = (() => {
    const d = new Date(Date.now() + 60000);
    d.setSeconds(0, 0);
    return d.toISOString().slice(0, 16);
  })();

  const dateStr = isPublished && currentChangelog.publishDate
    ? new Date(currentChangelog.publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : isScheduledStatus && currentChangelog.scheduledPublishTime
    ? new Date(currentChangelog.scheduledPublishTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : new Date(currentChangelog.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Top bar */}
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
          <span className="text-xs" style={{ color: theme.text.tertiary }}>Edit</span>
          <span className="text-xs" style={{ color: theme.text.tertiary }}>·</span>
          <span className="text-xs" style={{ color: theme.text.tertiary }}>{dateStr}</span>
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium"
            style={{
              backgroundColor: isPublished ? theme.status.successLight : isScheduledStatus ? theme.status.infoLight : theme.status.warningLight,
              color: isPublished ? theme.status.success : isScheduledStatus ? theme.status.info : theme.status.warning,
            }}
          >
            <span
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: isPublished ? theme.status.success : isScheduledStatus ? theme.status.info : theme.status.warning }}
            />
            {isPublished ? "Live" : isScheduledStatus ? "Scheduled" : "Draft"}
          </span>
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
            {isSaving ? "Saving…" : "Save"}
          </button>
          {isScheduledStatus && (
            <button
              onClick={handleCancelSchedule}
              disabled={isSaving}
              className="editor-btn-secondary px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: theme.neutral.white,
                color: theme.status.error,
                border: `1px solid ${theme.neutral.border}`,
                cursor: isSaving ? "not-allowed" : "pointer",
              }}
            >
              Cancel schedule
            </button>
          )}
          {isPublished && (
            <button
              onClick={handleUnpublish}
              onBlur={() => setConfirmUnpublish(false)}
              disabled={isSaving}
              className="editor-btn-secondary px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: confirmUnpublish ? theme.status.errorLight : theme.neutral.white,
                color: theme.status.error,
                border: `1px solid ${confirmUnpublish ? theme.status.error : theme.neutral.border}`,
                cursor: isSaving ? "not-allowed" : "pointer",
              }}
            >
              {isSaving ? "Unpublishing…" : confirmUnpublish ? "Confirm unpublish?" : "Unpublish"}
            </button>
          )}
          {!isPublished && (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Cover image */}
      <CoverImageUpload
        coverImageId={coverImageId}
        onCoverImageChange={setCoverImageId}
      />

      {/* Title — large, Notion-style */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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

      {/* Meta row: labels */}
      <div
        className="flex items-center gap-2 mt-3 mb-6 pb-5"
        style={{ borderBottom: `1px solid ${theme.neutral.borderLight}` }}
      >
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
          <span className="text-[11px]" style={{ color: theme.text.tertiary }}>
            No labels configured
          </span>
        )}
      </div>

      {/* Editor */}
      <ChangelogEditor
        initialContent={content}
        onChange={(blocks) => setContent(serializeBlocks(blocks))}
      />

      {/* Hint */}
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
        .schedule-input:focus {
          border-color: ${theme.brand.primary} !important;
          width: auto !important;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
