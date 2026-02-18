"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Sidebar from "../../components/Sidebar";
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

  return (
    <div className="flex h-screen" style={{ backgroundColor: theme.neutral.bg }}>
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

