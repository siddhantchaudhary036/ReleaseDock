import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import theme from "../constants/theme";

/* ─── Inline icon components (no external dep) ─── */

function IconEdit({ size = 24 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={theme.brand.primary} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zM19.5 12.75V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V6.75A2.25 2.25 0 015.25 4.5h5.25" />
    </svg>
  );
}

function IconWidget({ size = 24 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={theme.brand.primary} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  );
}

function IconGlobe({ size = 24 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={theme.brand.primary} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.264.26-2.466.733-3.559" />
    </svg>
  );
}

function IconLabel({ size = 24 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={theme.brand.primary} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  );
}

function IconDraft({ size = 24 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={theme.brand.primary} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function IconCode({ size = 24 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={theme.brand.primary} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  );
}

/* ─── Feature card ─── */

function FeatureCard({ icon, title, description }) {
  return (
    <div
      style={{
        padding: "32px",
        borderRadius: theme.radius.lg,
        border: `1px solid ${theme.neutral.border}`,
        backgroundColor: theme.neutral.surface,
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
      }}
      className="feature-card"
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: theme.radius.md,
          backgroundColor: theme.brand.primaryLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: 600,
          color: theme.text.primary,
          marginBottom: "8px",
          lineHeight: 1.4,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "15px",
          lineHeight: 1.6,
          color: theme.text.secondary,
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
}

/* ─── Step card for "How it works" ─── */

function StepCard({ number, title, description, isLast }) {
  return (
    <div style={{ textAlign: "center", flex: 1, padding: "0 16px", position: "relative", minWidth: 220 }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: theme.radius.full,
          backgroundColor: theme.brand.primary,
          color: theme.text.inverse,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          fontWeight: 700,
          margin: "0 auto 16px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {number}
      </div>
      <h3
        style={{
          fontSize: "17px",
          fontWeight: 600,
          color: theme.text.primary,
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "15px",
          lineHeight: 1.6,
          color: theme.text.secondary,
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
}

/* ─── Page ─── */

export default function Home() {
  return (
    <div
      style={{
        backgroundColor: theme.neutral.white,
        color: theme.text.primary,
        minHeight: "100vh",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      }}
    >
      {/* ── Navbar ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme.neutral.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: theme.radius.md,
                backgroundColor: theme.brand.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: theme.text.inverse, fontWeight: 700, fontSize: 16 }}>R</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: 18, color: theme.text.primary }}>
              ReleaseDock
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  style={{
                    padding: "8px 20px",
                    borderRadius: theme.radius.full,
                    border: `1px solid ${theme.neutral.border}`,
                    backgroundColor: "transparent",
                    color: theme.text.primary,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "background-color 0.15s",
                  }}
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  style={{
                    padding: "8px 20px",
                    borderRadius: theme.radius.full,
                    border: "none",
                    backgroundColor: theme.brand.primary,
                    color: theme.text.inverse,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "background-color 0.15s",
                  }}
                >
                  Get started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                style={{
                  padding: "8px 20px",
                  borderRadius: theme.radius.full,
                  border: "none",
                  backgroundColor: theme.brand.primary,
                  color: theme.text.inverse,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "96px 24px 80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "6px 16px",
            borderRadius: theme.radius.full,
            backgroundColor: theme.brand.primaryLight,
            color: theme.brand.primary,
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 24,
            letterSpacing: "0.02em",
          }}
        >
          Changelog management, simplified
        </div>

        <h1
          style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 700,
            lineHeight: 1.15,
            color: theme.text.primary,
            maxWidth: 720,
            margin: "0 auto 24px",
            letterSpacing: "-0.025em",
          }}
        >
          Keep your users in the loop
        </h1>

        <p
          style={{
            fontSize: "clamp(17px, 2vw, 20px)",
            lineHeight: 1.6,
            color: theme.text.secondary,
            maxWidth: 560,
            margin: "0 auto 40px",
          }}
        >
          Write beautiful changelogs, publish them instantly, and embed a
          widget on your site — all from one place.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <SignedOut>
            <SignUpButton mode="modal">
              <button
                style={{
                  padding: "14px 32px",
                  borderRadius: theme.radius.full,
                  border: "none",
                  backgroundColor: theme.brand.primary,
                  color: theme.text.inverse,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background-color 0.15s",
                }}
              >
                Start for free
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              style={{
                padding: "14px 32px",
                borderRadius: theme.radius.full,
                backgroundColor: theme.brand.primary,
                color: theme.text.inverse,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* ── Editor preview (visual anchor) ── */}
      <section
        style={{
          maxWidth: 880,
          margin: "0 auto 96px",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            borderRadius: theme.radius.xl,
            border: `1px solid ${theme.neutral.border}`,
            boxShadow: theme.shadow.lg,
            overflow: "hidden",
            backgroundColor: theme.neutral.bg,
          }}
        >
          {/* Fake browser chrome */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: `1px solid ${theme.neutral.border}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: theme.neutral.white,
            }}
          >
            <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: theme.decorative.red }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: theme.decorative.yellow }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: theme.decorative.teal }} />
            <div
              style={{
                flex: 1,
                marginLeft: 12,
                height: 28,
                borderRadius: theme.radius.sm,
                backgroundColor: theme.neutral.bg,
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                fontSize: 13,
                color: theme.text.tertiary,
              }}
            >
              app.releasedock.co/dashboard/changelogs
            </div>
          </div>

          {/* Mock editor content */}
          <div style={{ padding: "32px 40px", minHeight: 260 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: theme.text.primary,
                    marginBottom: 4,
                  }}
                >
                  v2.4.0 — Dark mode support
                </div>
                <div style={{ fontSize: 13, color: theme.text.tertiary }}>
                  Published · Feb 14, 2026
                </div>
              </div>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: theme.radius.full,
                  backgroundColor: theme.status.successLight,
                  color: theme.status.success,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Published
              </span>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <span style={{ padding: "4px 10px", borderRadius: theme.radius.full, backgroundColor: theme.brand.primaryMuted, color: theme.brand.primary, fontSize: 12, fontWeight: 500 }}>Feature</span>
              <span style={{ padding: "4px 10px", borderRadius: theme.radius.full, backgroundColor: theme.status.warningLight, color: theme.decorative.orange, fontSize: 12, fontWeight: 500 }}>UI</span>
            </div>

            <div style={{ fontSize: 15, lineHeight: 1.7, color: theme.text.secondary }}>
              <p style={{ margin: "0 0 12px" }}>
                We've added full dark mode support across the entire application. Your eyes will thank you during those late-night deploys.
              </p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>System preference detection</li>
                <li>Manual toggle in settings</li>
                <li>Persisted across sessions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 24px 96px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 36px)",
              fontWeight: 700,
              color: theme.text.primary,
              marginBottom: 12,
              letterSpacing: "-0.02em",
            }}
          >
            Everything you need, nothing you don't
          </h2>
          <p
            style={{
              fontSize: 17,
              color: theme.text.secondary,
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            A focused set of tools to write, organize, and ship changelogs to your users.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          <FeatureCard
            icon={<IconEdit />}
            title="Rich text editor"
            description="Write changelogs with a block-based editor. Headings, lists, images, inline formatting — all with slash commands and drag-and-drop."
          />
          <FeatureCard
            icon={<IconWidget />}
            title="Embeddable widget"
            description="Drop a single script tag on your site and your users see a 'What's New' panel. Customizable colors, position, and branding."
          />
          <FeatureCard
            icon={<IconGlobe />}
            title="Public changelog page"
            description="Every workspace gets a dedicated public URL. Share your full changelog history with anyone — no login required."
          />
          <FeatureCard
            icon={<IconLabel />}
            title="Labels & categories"
            description="Tag changelogs with color-coded labels like Feature, Bugfix, or Improvement so readers can scan at a glance."
          />
          <FeatureCard
            icon={<IconDraft />}
            title="Draft & publish workflow"
            description="Save work-in-progress as drafts. Preview, polish, then publish when you're ready. Edit published entries anytime."
          />
          <FeatureCard
            icon={<IconCode />}
            title="One-line embed code"
            description="Integrate the widget with a single script tag. Shadow DOM isolation means zero style conflicts with your site."
          />
        </div>
      </section>

      {/* ── Widget preview ── */}
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 24px 96px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
          className="widget-preview-grid"
        >
          {/* Left: description */}
          <div>
            <div
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: theme.radius.full,
                backgroundColor: theme.brand.primaryLight,
                color: theme.brand.primary,
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 16,
                letterSpacing: "0.02em",
              }}
            >
              Widget
            </div>
            <h2
              style={{
                fontSize: "clamp(24px, 3vw, 32px)",
                fontWeight: 700,
                color: theme.text.primary,
                marginBottom: 16,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              A changelog feed, right inside your app
            </h2>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: theme.text.secondary,
                marginBottom: 24,
              }}
            >
              Your users get a floating "What's New" panel without leaving your
              site. It tracks what they've already read and highlights new
              updates with an unread badge.
            </p>
            <div
              style={{
                backgroundColor: theme.neutral.bg,
                borderRadius: theme.radius.md,
                padding: "16px 20px",
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 13,
                color: theme.text.secondary,
                border: `1px solid ${theme.neutral.border}`,
                overflowX: "auto",
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: theme.text.tertiary }}>&lt;</span>
              <span style={{ color: theme.brand.primary }}>script</span>
              {" "}
              <span style={{ color: theme.decorative.orange }}>src</span>
              <span style={{ color: theme.text.tertiary }}>=</span>
              <span style={{ color: theme.decorative.green }}>"…/widget.js"</span>
              <br />
              {"  "}
              <span style={{ color: theme.decorative.orange }}>data-project</span>
              <span style={{ color: theme.text.tertiary }}>=</span>
              <span style={{ color: theme.decorative.green }}>"YOUR_API_KEY"</span>
              {" "}
              <span style={{ color: theme.decorative.orange }}>async</span>
              <span style={{ color: theme.text.tertiary }}>&gt;&lt;/</span>
              <span style={{ color: theme.brand.primary }}>script</span>
              <span style={{ color: theme.text.tertiary }}>&gt;</span>
            </div>
          </div>

          {/* Right: widget mockup */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative" }}>
              {/* Widget panel */}
              <div
                style={{
                  width: 340,
                  borderRadius: theme.radius.lg,
                  border: `1px solid ${theme.neutral.border}`,
                  boxShadow: theme.shadow.lg,
                  overflow: "hidden",
                  backgroundColor: theme.neutral.white,
                }}
              >
                {/* Widget header */}
                <div
                  style={{
                    padding: "14px 20px",
                    borderBottom: `1px solid ${theme.neutral.border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 600, color: theme.text.primary }}>
                    What's New
                  </span>
                  <span style={{ fontSize: 18, color: theme.text.tertiary, cursor: "default" }}>×</span>
                </div>

                {/* Widget entries */}
                <div style={{ padding: "16px" }}>
                  {[
                    { title: "Dark mode support", label: "Feature", labelColor: theme.brand.primary, labelBg: theme.brand.primaryMuted, date: "Feb 14" },
                    { title: "Faster page loads", label: "Improvement", labelColor: theme.decorative.purple, labelBg: theme.decorative.purpleLight, date: "Feb 10" },
                    { title: "Bug fix: export CSV", label: "Bugfix", labelColor: theme.status.error, labelBg: theme.status.errorLight, date: "Feb 7" },
                  ].map((entry, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "12px 0",
                        borderBottom: i < 2 ? `1px solid ${theme.neutral.borderLight}` : "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: theme.text.primary }}>{entry.title}</span>
                        <span style={{ fontSize: 12, color: theme.text.tertiary }}>{entry.date}</span>
                      </div>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: theme.radius.full,
                          backgroundColor: entry.labelBg,
                          color: entry.labelColor,
                          fontSize: 11,
                          fontWeight: 500,
                        }}
                      >
                        {entry.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating launcher button */}
              <div
                style={{
                  position: "absolute",
                  bottom: -24,
                  right: 0,
                  width: 52,
                  height: 52,
                  borderRadius: theme.radius.full,
                  backgroundColor: theme.brand.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)",
                }}
              >
                <svg width={22} height={22} fill="none" viewBox="0 0 24 24" stroke={theme.text.inverse} strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {/* Unread badge */}
                <div
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    width: 20,
                    height: 20,
                    borderRadius: theme.radius.full,
                    backgroundColor: theme.status.error,
                    color: theme.text.inverse,
                    fontSize: 11,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px solid ${theme.neutral.white}`,
                  }}
                >
                  3
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        style={{
          backgroundColor: theme.neutral.bg,
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 36px)",
                fontWeight: 700,
                color: theme.text.primary,
                marginBottom: 12,
                letterSpacing: "-0.02em",
              }}
            >
              Up and running in minutes
            </h2>
            <p
              style={{
                fontSize: 17,
                color: theme.text.secondary,
                maxWidth: 440,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Three steps from sign-up to a live changelog on your site.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 32,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <StepCard
              number="1"
              title="Create your workspace"
              description="Pick a name and slug. Your public changelog page is live instantly."
            />
            <StepCard
              number="2"
              title="Write a changelog"
              description="Use the rich editor to craft your update. Add labels, save as draft, or publish right away."
            />
            <StepCard
              number="3"
              title="Embed the widget"
              description="Copy the one-line script tag into your site. Your users see updates the moment you publish."
            />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "96px 24px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(28px, 3.5vw, 36px)",
            fontWeight: 700,
            color: theme.text.primary,
            marginBottom: 16,
            letterSpacing: "-0.02em",
          }}
        >
          Ready to ship your first changelog?
        </h2>
        <p
          style={{
            fontSize: 17,
            color: theme.text.secondary,
            maxWidth: 440,
            margin: "0 auto 32px",
            lineHeight: 1.6,
          }}
        >
          Set up your workspace in under two minutes. No credit card required.
        </p>
        <SignedOut>
          <SignUpButton mode="modal">
            <button
              style={{
                padding: "14px 36px",
                borderRadius: theme.radius.full,
                border: "none",
                backgroundColor: theme.brand.primary,
                color: theme.text.inverse,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Get started for free
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <Link
            href="/dashboard"
            style={{
              padding: "14px 36px",
              borderRadius: theme.radius.full,
              backgroundColor: theme.brand.primary,
              color: theme.text.inverse,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Go to Dashboard
          </Link>
        </SignedIn>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: `1px solid ${theme.neutral.border}`,
          padding: "32px 24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 14, color: theme.text.tertiary, margin: 0 }}>
          © {new Date().getFullYear()} ReleaseDock. All rights reserved.
        </p>
      </footer>

      {/* Hover style for feature cards + responsive */}
      <style>{`
        .feature-card:hover {
          box-shadow: ${theme.shadow.lg};
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .widget-preview-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}
