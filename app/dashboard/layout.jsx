"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Sidebar from "../../components/Sidebar";
import ProjectSwitcher from "../../components/ProjectSwitcher";
import theme from "../../constants/theme";

export default function DashboardLayout({ children }) {
  const [currentProjectId, setCurrentProjectId] = useState(null);

  const user = useQuery(api.users.currentUser);
  const workspaces = useQuery(
    api.workspaces.getWorkspaceByOwner,
    user ? { ownerId: user._id } : "skip"
  );

  const projects = useQuery(
    api.projects.getProjectsByWorkspace,
    workspaces && workspaces.length > 0 ? { workspaceId: workspaces[0]._id } : "skip"
  );

  useEffect(() => {
    if (projects && projects.length > 0 && !currentProjectId) {
      setCurrentProjectId(projects[0]._id);
    }
  }, [projects, currentProjectId]);

  useEffect(() => {
    if (currentProjectId) {
      localStorage.setItem("currentProjectId", currentProjectId);
    }
  }, [currentProjectId]);

  useEffect(() => {
    const savedProjectId = localStorage.getItem("currentProjectId");
    if (savedProjectId) {
      setCurrentProjectId(savedProjectId);
    }
  }, []);

  const handleProjectChange = (projectId) => {
    setCurrentProjectId(projectId);
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: theme.neutral.bg }}>
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div style={{ backgroundColor: theme.neutral.white, borderBottom: `1px solid ${theme.neutral.border}`, padding: "16px" }}>
          <div className="max-w-7xl mx-auto">
            <ProjectSwitcher
              currentProjectId={currentProjectId}
              onProjectChange={handleProjectChange}
            />
          </div>
        </div>

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
