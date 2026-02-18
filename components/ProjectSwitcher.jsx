"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import theme from "../constants/theme";

export default function ProjectSwitcher({ currentProjectId, onProjectChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState(null);
  const ref = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProjectSelect = (projectId) => {
    onProjectChange(projectId);
    setIsOpen(false);
  };

  if (!projects || projects.length === 0) {
    return (
      <div
        className="px-3 py-1.5 rounded-md"
        style={{ backgroundColor: theme.neutral.bg, fontSize: 13, color: theme.text.tertiary }}
      >
        No projects
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="project-switcher-btn flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-colors"
        style={{
          border: `1px solid ${theme.neutral.border}`,
          backgroundColor: theme.neutral.white,
          cursor: "pointer",
        }}
      >
        <div
          className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: theme.brand.primary }}
        >
          <span style={{ color: theme.text.inverse, fontWeight: 600, fontSize: 10 }}>
            {currentProject?.name?.charAt(0) || "P"}
          </span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: theme.text.primary }}>
          {currentProject?.name || "Select project"}
        </span>
        <svg
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          style={{ color: theme.text.tertiary }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 rounded-lg overflow-hidden z-20"
          style={{
            backgroundColor: theme.neutral.white,
            border: `1px solid ${theme.neutral.border}`,
            boxShadow: theme.shadow.lg,
            minWidth: 200,
          }}
        >
          <div className="py-1">
            {projects.map((project) => (
              <button
                key={project._id}
                onClick={() => handleProjectSelect(project._id)}
                className="project-item w-full px-3 py-2 text-left transition-colors flex items-center gap-2.5"
                style={{
                  backgroundColor: currentProjectId === project._id ? theme.neutral.hover : "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: theme.brand.primary }}
                >
                  <span style={{ color: theme.text.inverse, fontWeight: 600, fontSize: 10 }}>
                    {project.name.charAt(0)}
                  </span>
                </div>
                <span style={{ fontSize: 13, color: theme.text.primary }}>{project.name}</span>
                {currentProjectId === project._id && (
                  <svg className="w-3.5 h-3.5 ml-auto" style={{ color: theme.brand.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .project-switcher-btn:hover {
          background-color: ${theme.neutral.hover} !important;
        }
        .project-item:hover {
          background-color: ${theme.neutral.hover} !important;
        }
      `}</style>
    </div>
  );
}
