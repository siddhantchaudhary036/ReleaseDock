"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import theme from "../constants/theme";

export default function ProjectSwitcher({ currentProjectId, onProjectChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState(null);

  const user = useQuery(api.users.currentUser);
  const workspaces = useQuery(
    api.workspaces.getWorkspaceByOwner,
    user ? { ownerId: user._id } : "skip"
  );
  const projects = useQuery(
    api.projects.getProjectsByWorkspace,
    workspaceId ? { workspaceId } : "skip"
  );
  const currentProject = useQuery(
    api.projects.getProjectById,
    currentProjectId ? { projectId: currentProjectId } : "skip"
  );

  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !workspaceId) {
      setWorkspaceId(workspaces[0]._id);
    }
  }, [workspaces, workspaceId]);

  const handleProjectSelect = (projectId) => {
    onProjectChange(projectId);
    setIsOpen(false);
  };

  if (!projects || projects.length === 0) {
    return (
      <div style={{ padding: "12px 16px", backgroundColor: theme.neutral.bg, borderRadius: theme.radius.md }}>
        <p style={{ fontSize: "14px", color: theme.text.tertiary }}>No projects available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-lg flex items-center justify-between transition-colors"
        style={{ backgroundColor: theme.neutral.bg, border: `1px solid ${theme.neutral.border}` }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: theme.brand.primary }}>
            <span style={{ color: theme.text.inverse, fontWeight: 500, fontSize: "14px" }}>
              {currentProject?.name?.charAt(0) || "P"}
            </span>
          </div>
          <div className="text-left">
            <p style={{ fontSize: "14px", fontWeight: 500, color: theme.text.primary }}>
              {currentProject?.name || "Select Project"}
            </p>
            <p style={{ fontSize: "12px", color: theme.text.tertiary }}>
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          style={{ color: theme.text.tertiary }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div
            className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg z-20 overflow-hidden"
            style={{ backgroundColor: theme.neutral.white, border: `1px solid ${theme.neutral.border}` }}
          >
            <div className="py-1">
              {projects.map((project) => (
                <button
                  key={project._id}
                  onClick={() => handleProjectSelect(project._id)}
                  className="w-full px-4 py-2 text-left transition-colors"
                  style={{
                    backgroundColor: currentProjectId === project._id ? theme.neutral.bg : "transparent",
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: theme.brand.primary }}>
                      <span style={{ color: theme.text.inverse, fontWeight: 500, fontSize: "12px" }}>
                        {project.name.charAt(0)}
                      </span>
                    </div>
                    <span style={{ fontSize: "14px", color: theme.text.primary }}>{project.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
