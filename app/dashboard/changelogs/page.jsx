"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import StatusFilter from "../../../components/StatusFilter";
import Link from "next/link";
import theme from "../../../constants/theme";

export default function ChangelogsPage() {
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const savedProjectId = localStorage.getItem("currentProjectId");
    if (savedProjectId) {
      setCurrentProjectId(savedProjectId);
    }
  }, []);

  const changelogs = useQuery(
    api.changelogs.getChangelogsByProject,
    currentProjectId
      ? {
          projectId: currentProjectId,
          status: statusFilter === "all" ? undefined : statusFilter,
        }
      : "skip"
  );

  const labels = useQuery(
    api.labels.getLabelsByProject,
    currentProjectId ? { projectId: currentProjectId } : "skip"
  );

  const labelMap = labels?.reduce((acc, label) => {
    acc[label._id] = label;
    return acc;
  }, {}) || {};

  const formatDate = (timestamp) => {
    if (!timestamp) return "No date";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const sortedChangelogs = changelogs
    ? [...changelogs].sort((a, b) => b.updatedAt - a.updatedAt)
    : [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" style={{ color: theme.text.primary }}>Changelogs</h1>
        <Link
          href="/dashboard/changelogs/new"
          className="px-4 py-2 rounded-lg font-medium transition-colors"
          style={{ backgroundColor: theme.brand.primary, color: theme.text.inverse, textDecoration: "none" }}
        >
          New Changelog
        </Link>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <StatusFilter currentStatus={statusFilter} onStatusChange={setStatusFilter} />
      </div>

      {/* Changelog List */}
      {!currentProjectId ? (
        <div className="text-center py-12">
          <p style={{ color: theme.text.tertiary }}>Please select a project to view changelogs</p>
        </div>
      ) : changelogs === undefined ? (
        <div className="text-center py-12">
          <p style={{ color: theme.text.tertiary }}>Loading changelogs...</p>
        </div>
      ) : sortedChangelogs.length === 0 ? (
        <div className="text-center py-12">
          <p style={{ color: theme.text.tertiary }}>
            No {statusFilter !== "all" ? statusFilter : ""} changelogs yet
          </p>
          <Link
            href="/dashboard/changelogs/new"
            className="inline-block mt-4"
            style={{ color: theme.brand.primary }}
          >
            Create your first changelog
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedChangelogs.map((changelog) => (
            <Link
              key={changelog._id}
              href={`/dashboard/changelogs/${changelog._id}`}
              className="block rounded-lg p-4 transition-colors"
              style={{
                backgroundColor: theme.neutral.white,
                border: `1px solid ${theme.neutral.border}`,
                textDecoration: "none",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-2 truncate" style={{ color: theme.text.primary }}>
                    {changelog.title || "Untitled"}
                  </h3>

                  {changelog.labelIds && changelog.labelIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {changelog.labelIds.map((labelId) => {
                        const label = labelMap[labelId];
                        if (!label) return null;
                        return (
                          <span
                            key={labelId}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                            style={{ backgroundColor: `${label.color}20`, color: label.color }}
                          >
                            {label.name}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-sm" style={{ color: theme.text.tertiary }}>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {changelog.status === "published" && changelog.publishDate
                        ? formatDate(changelog.publishDate)
                        : formatDate(changelog.updatedAt)}
                    </span>
                  </div>
                </div>

                <div className="ml-4 flex-shrink-0">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: changelog.status === "published" ? theme.status.successLight : theme.status.warningLight,
                      color: changelog.status === "published" ? theme.status.success : theme.status.warning,
                    }}
                  >
                    {changelog.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
