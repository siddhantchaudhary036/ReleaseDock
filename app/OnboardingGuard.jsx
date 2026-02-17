"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { api } from "../convex/_generated/api";
import theme from "../constants/theme";

function OnboardingModal() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectId, setProjectId] = useState(null);
  const [projectApiKey, setProjectApiKey] = useState("");

  const [workspaceName, setWorkspaceName] = useState("");
  const [slug, setSlug] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [slugError, setSlugError] = useState("");
  const [formError, setFormError] = useState("");

  const createWorkspace = useMutation(api.workspaces.createWorkspace);
  const createProject = useMutation(api.projects.createProject);
  const completeOnboarding = useMutation(api.onboarding.completeOnboarding);
  const project = useQuery(
    api.projects.getProjectById,
    projectId ? { projectId } : "skip"
  );

  const handleSlugChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSlug(value);
    if (value.length > 0 && value.length < 3) {
      setSlugError("Slug must be at least 3 characters");
    } else if (value.length > 63) {
      setSlugError("Slug must be 63 characters or less");
    } else if (value && !/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(value)) {
      setSlugError("Slug must be lowercase alphanumeric characters or hyphens, and cannot start/end with a hyphen");
    } else {
      setSlugError("");
    }
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!workspaceName || !slug || !websiteUrl) {
      setFormError("All fields are required");
      return;
    }
    if (slugError) return;

    try {
      const newWorkspaceId = await createWorkspace({ name: workspaceName, slug, websiteUrl });
      setCurrentStep(2);
      setTimeout(async () => {
        try {
          const newProjectId = await createProject({ workspaceId: newWorkspaceId, name: "Default Project" });
          setProjectId(newProjectId);
        } catch (error) {
          setFormError(error.message || "Failed to create project");
        }
      }, 1000);
    } catch (error) {
      setFormError(error.message || "Failed to create workspace");
    }
  };

  const handleStep2Continue = () => {
    if (projectId) setCurrentStep(3);
  };

  if (project && !projectApiKey) {
    setProjectApiKey(project.apiKey);
  }

  const handleStep3Skip = () => setCurrentStep(4);
  const handleStep3CreateChangelog = () => {
    router.push(`/dashboard/changelogs/new?projectId=${projectId}`);
  };

  const handleCompleteOnboarding = async () => {
    try {
      await completeOnboarding();
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 16px",
    backgroundColor: theme.neutral.bg,
    border: `1px solid ${theme.neutral.border}`,
    borderRadius: theme.radius.md,
    color: theme.text.primary,
    outline: "none",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Onboarding"
    >
      <div className="w-full max-w-2xl mx-4">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className={`flex items-center ${step < 4 ? "flex-1" : ""}`}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{
                    backgroundColor: step <= currentStep ? theme.brand.primary : theme.neutral.muted,
                    color: step <= currentStep ? theme.text.inverse : theme.text.tertiary,
                  }}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className="h-1 flex-1 mx-2"
                    style={{ backgroundColor: step < currentStep ? theme.brand.primary : theme.neutral.muted }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs" style={{ color: theme.text.tertiary }}>
            <span>Workspace</span>
            <span>Project</span>
            <span>First Entry</span>
            <span>Install</span>
          </div>
        </div>

        {/* Step content */}
        <div className="rounded-lg p-8" style={{ backgroundColor: theme.neutral.white, border: `1px solid ${theme.neutral.border}`, boxShadow: theme.shadow.lg }}>
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-2" style={{ color: theme.text.primary }}>Create your workspace</h2>
              <p className="mb-6" style={{ color: theme.text.secondary }}>Let&apos;s start by setting up your workspace</p>
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>Workspace Name</label>
                  <input type="text" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} placeholder="Acme Inc" style={inputStyle} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>URL Slug</label>
                  <div className="flex items-center">
                    <input type="text" value={slug} onChange={handleSlugChange} placeholder="acme" style={{ ...inputStyle, borderTopRightRadius: 0, borderBottomRightRadius: 0 }} />
                    <span style={{ padding: "8px 16px", backgroundColor: theme.neutral.bg, border: `1px solid ${theme.neutral.border}`, borderLeft: "none", borderTopRightRadius: theme.radius.md, borderBottomRightRadius: theme.radius.md, color: theme.text.tertiary }}>
                      .releasedock.co
                    </span>
                  </div>
                  {slugError && <p className="mt-1 text-sm" style={{ color: theme.status.error }}>{slugError}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>Website URL</label>
                  <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://acme.com" style={inputStyle} />
                </div>
                {formError && <p className="text-sm" style={{ color: theme.status.error }}>{formError}</p>}
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: theme.brand.primary, color: theme.text.inverse }}
                >
                  Continue
                </button>
              </form>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-semibold mb-2" style={{ color: theme.text.primary }}>Setting up your project</h2>
              <p className="mb-6" style={{ color: theme.text.secondary }}>We&apos;re creating your default project...</p>
              <div className="flex flex-col items-center justify-center py-8">
                {!projectId ? (
                  <>
                    <div className="w-16 h-16 border-4 rounded-full animate-spin mb-4" style={{ borderColor: theme.brand.primary, borderTopColor: "transparent" }}></div>
                    <p style={{ color: theme.text.secondary }}>Creating project...</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: theme.status.success }}>
                      <svg className="w-8 h-8" style={{ color: theme.text.inverse }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="font-medium" style={{ color: theme.status.success }}>Project created!</p>
                  </>
                )}
              </div>
              {formError && <p className="text-sm mb-4" style={{ color: theme.status.error }}>{formError}</p>}
              <button
                onClick={handleStep2Continue}
                disabled={!projectId}
                className="w-full px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: projectId ? theme.brand.primary : theme.neutral.muted,
                  color: projectId ? theme.text.inverse : theme.text.tertiary,
                  cursor: projectId ? "pointer" : "not-allowed",
                }}
              >
                Continue
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-semibold mb-2" style={{ color: theme.text.primary }}>Create your first changelog</h2>
              <p className="mb-6" style={{ color: theme.text.secondary }}>Start by creating your first changelog entry, or skip for now</p>
              <div className="space-y-3">
                <button
                  onClick={handleStep3CreateChangelog}
                  className="w-full px-4 py-3 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: theme.brand.primary, color: theme.text.inverse }}
                >
                  Create First Changelog
                </button>
                <button
                  onClick={handleStep3Skip}
                  className="w-full px-4 py-3 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: theme.neutral.bg, color: theme.text.secondary, border: `1px solid ${theme.neutral.border}` }}
                >
                  Skip for Now
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-semibold mb-2" style={{ color: theme.text.primary }}>Install the widget</h2>
              <p className="mb-6" style={{ color: theme.text.secondary }}>Add this snippet to your website to display your changelog</p>
              <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: theme.neutral.bg, border: `1px solid ${theme.neutral.border}` }}>
                <code className="text-sm break-all" style={{ color: theme.text.secondary }}>
                  {`<script src="https://cdn.releasedock.co/widget.js" data-project="${projectApiKey || "YOUR_API_KEY"}" async></script>`}
                </code>
              </div>
              <button
                onClick={() => copyToClipboard(`<script src="https://cdn.releasedock.co/widget.js" data-project="${projectApiKey || "YOUR_API_KEY"}" async></script>`)}
                className="w-full px-4 py-2 rounded-lg font-medium transition-colors mb-4"
                style={{ backgroundColor: theme.neutral.bg, color: theme.text.secondary, border: `1px solid ${theme.neutral.border}` }}
              >
                Copy to Clipboard
              </button>
              <button
                onClick={handleCompleteOnboarding}
                className="w-full px-4 py-2 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: theme.brand.primary, color: theme.text.inverse }}
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingGuard({ children }) {
  const { isSignedIn, isLoaded: isClerkLoaded } = useUser();
  const pathname = usePathname();
  const currentUser = useQuery(api.users.currentUser);

  const isPublicRoute =
    pathname?.startsWith("/sign-in") ||
    pathname?.startsWith("/sign-up") ||
    pathname?.startsWith("/api") ||
    pathname?.startsWith("/changelog") ||
    pathname === "/";

  const showOnboarding =
    isClerkLoaded &&
    isSignedIn &&
    currentUser !== undefined &&
    currentUser !== null &&
    !currentUser.onboardingCompleted &&
    !isPublicRoute;

  return (
    <>
      {showOnboarding && <OnboardingModal />}
      {children}
    </>
  );
}
