"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import theme from "../constants/theme";

/* ─── Chevron icon ─── */
function ChevronDown({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Dropdown wrapper ─── */
function NavDropdown({ label, children, align = "left" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const timeout = useRef(null);

  const handleEnter = () => {
    clearTimeout(timeout.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ position: "relative" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "6px 12px",
          borderRadius: theme.radius.md,
          border: "none",
          backgroundColor: "transparent",
          color: theme.text.secondary,
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          transition: "color 0.15s, background-color 0.15s",
          whiteSpace: "nowrap",
        }}
        className="nav-link"
      >
        {label}
        <span
          style={{
            display: "inline-flex",
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <ChevronDown />
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            ...(align === "right" ? { right: 0 } : { left: 0 }),
            minWidth: 240,
            backgroundColor: theme.neutral.white,
            border: `1px solid ${theme.neutral.border}`,
            borderRadius: theme.radius.lg,
            boxShadow: "0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
            padding: "8px",
            zIndex: 100,
            animation: "dropdownFadeIn 0.15s ease",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Dropdown item ─── */
function DropdownItem({ href, icon, title, description }) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        gap: 12,
        padding: "10px 12px",
        borderRadius: theme.radius.md,
        textDecoration: "none",
        transition: "background-color 0.12s",
      }}
      className="dropdown-item"
    >
      {icon && (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: theme.radius.md,
            backgroundColor: theme.brand.primaryLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          {icon}
        </div>
      )}
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: theme.text.primary, lineHeight: 1.4 }}>
          {title}
        </div>
        {description && (
          <div style={{ fontSize: 13, color: theme.text.tertiary, lineHeight: 1.4, marginTop: 2 }}>
            {description}
          </div>
        )}
      </div>
    </Link>
  );
}

/* ─── Product icons ─── */
function IconChangelog({ size = 18 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={theme.brand.primary} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
    </svg>
  );
}

function IconFeedback({ size = 18 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={theme.brand.primary} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  );
}

function IconTooltip({ size = 18 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={theme.brand.primary} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  );
}

function IconBook({ size = 18 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={theme.brand.primary} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function IconCode({ size = 18 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={theme.brand.primary} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  );
}

function IconBlog({ size = 18 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={theme.brand.primary} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12.75V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V6.75A2.25 2.25 0 015.25 4.5h5.25" />
    </svg>
  );
}

function IconUsers({ size = 18 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={theme.brand.primary} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

/* ─── Mobile menu icon ─── */
function IconMenu({ size = 24 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function IconClose({ size = 24 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

/* ─── Header component ─── */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: scrolled ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.95)",
          backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "blur(8px)",
          WebkitBackdropFilter: scrolled ? "blur(16px) saturate(180%)" : "blur(8px)",
          borderBottom: `1px solid ${scrolled ? theme.neutral.border : "transparent"}`,
          transition: "background-color 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
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
          {/* Logo */}
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

          {/* Desktop nav */}
          <div className="header-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Products dropdown */}
            <NavDropdown label="Products">
              <DropdownItem
                href="/products/changelog"
                icon={<IconChangelog />}
                title="Changelog"
                description="In-app, email & historical changelog"
              />
              <DropdownItem
                href="/products/feedback"
                icon={<IconFeedback />}
                title="Feedback & Surveys"
                description="In-app & email surveys"
              />
              <DropdownItem
                href="/products/onboarding"
                icon={<IconTooltip />}
                title="Onboarding Tooltips"
                description="In-app tooltips for new & old features"
              />
            </NavDropdown>

            {/* Pricing */}
            <Link
              href="/pricing"
              style={{
                padding: "6px 12px",
                borderRadius: theme.radius.md,
                fontSize: 14,
                fontWeight: 500,
                color: theme.text.secondary,
                textDecoration: "none",
                transition: "color 0.15s, background-color 0.15s",
              }}
              className="nav-link"
            >
              Pricing
            </Link>

            {/* Resources dropdown */}
            <NavDropdown label="Resources">
              <DropdownItem
                href="/resources/help"
                icon={<IconBook />}
                title="Help Center"
                description="Guides and support articles"
              />
              <DropdownItem
                href="/resources/docs"
                icon={<IconCode />}
                title="Developer Docs"
                description="API reference and integration guides"
              />
              <DropdownItem
                href="/resources/blog"
                icon={<IconBlog />}
                title="Blog"
                description="Product updates and insights"
              />
              <DropdownItem
                href="/resources/about"
                icon={<IconUsers />}
                title="About Us"
                description="Our story and team"
              />
            </NavDropdown>

            {/* Contact */}
            <Link
              href="/contact"
              style={{
                padding: "6px 12px",
                borderRadius: theme.radius.md,
                fontSize: 14,
                fontWeight: 500,
                color: theme.text.secondary,
                textDecoration: "none",
                transition: "color 0.15s, background-color 0.15s",
              }}
              className="nav-link"
            >
              Contact
            </Link>

            {/* What's New */}
            <Link
              href="/whats-new"
              style={{
                padding: "6px 12px",
                borderRadius: theme.radius.md,
                fontSize: 14,
                fontWeight: 500,
                color: theme.text.secondary,
                textDecoration: "none",
                transition: "color 0.15s, background-color 0.15s",
              }}
              className="nav-link"
            >
              What&apos;s New
            </Link>
          </div>

          {/* Auth buttons (desktop) */}
          <div className="header-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  style={{
                    padding: "8px 18px",
                    borderRadius: theme.radius.full,
                    border: `1px solid ${theme.neutral.border}`,
                    backgroundColor: "transparent",
                    color: theme.text.primary,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "background-color 0.15s, border-color 0.15s",
                  }}
                  className="btn-secondary"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  style={{
                    padding: "8px 18px",
                    borderRadius: theme.radius.full,
                    border: "none",
                    backgroundColor: theme.brand.primary,
                    color: theme.text.inverse,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "background-color 0.15s",
                  }}
                  className="btn-primary"
                >
                  Get started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                style={{
                  padding: "8px 18px",
                  borderRadius: theme.radius.full,
                  backgroundColor: theme.brand.primary,
                  color: theme.text.inverse,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  display: "inline-block",
                  transition: "background-color 0.15s",
                }}
                className="btn-primary"
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>

          {/* Mobile hamburger */}
          <button
            className="header-mobile-toggle"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{
              display: "none",
              padding: 8,
              border: "none",
              backgroundColor: "transparent",
              color: theme.text.primary,
              cursor: "pointer",
            }}
          >
            {mobileOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="header-mobile-menu"
          style={{
            position: "fixed",
            top: 64,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 49,
            backgroundColor: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(12px)",
            padding: "24px",
            overflowY: "auto",
            animation: "dropdownFadeIn 0.2s ease",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: theme.text.tertiary, padding: "8px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Products</div>
            <MobileLink href="/products/changelog" onClick={() => setMobileOpen(false)}>Changelog</MobileLink>
            <MobileLink href="/products/feedback" onClick={() => setMobileOpen(false)}>Feedback & Surveys</MobileLink>
            <MobileLink href="/products/onboarding" onClick={() => setMobileOpen(false)}>Onboarding Tooltips</MobileLink>

            <div style={{ height: 1, backgroundColor: theme.neutral.border, margin: "12px 0" }} />

            <MobileLink href="/pricing" onClick={() => setMobileOpen(false)}>Pricing</MobileLink>

            <div style={{ height: 1, backgroundColor: theme.neutral.border, margin: "12px 0" }} />

            <div style={{ fontSize: 12, fontWeight: 600, color: theme.text.tertiary, padding: "8px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Resources</div>
            <MobileLink href="/resources/help" onClick={() => setMobileOpen(false)}>Help Center</MobileLink>
            <MobileLink href="/resources/docs" onClick={() => setMobileOpen(false)}>Developer Docs</MobileLink>
            <MobileLink href="/resources/blog" onClick={() => setMobileOpen(false)}>Blog</MobileLink>
            <MobileLink href="/resources/about" onClick={() => setMobileOpen(false)}>About Us</MobileLink>

            <div style={{ height: 1, backgroundColor: theme.neutral.border, margin: "12px 0" }} />

            <MobileLink href="/contact" onClick={() => setMobileOpen(false)}>Contact</MobileLink>
            <MobileLink href="/whats-new" onClick={() => setMobileOpen(false)}>What&apos;s New</MobileLink>

            <div style={{ height: 1, backgroundColor: theme.neutral.border, margin: "12px 0" }} />

            <div style={{ display: "flex", gap: 10, paddingTop: 8 }}>
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: theme.radius.md,
                      border: `1px solid ${theme.neutral.border}`,
                      backgroundColor: "transparent",
                      color: theme.text.primary,
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: theme.radius.md,
                      border: "none",
                      backgroundColor: theme.brand.primary,
                      color: theme.text.inverse,
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Get started
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: theme.radius.md,
                    backgroundColor: theme.brand.primary,
                    color: theme.text.inverse,
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  Dashboard
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nav-link:hover {
          color: ${theme.text.primary} !important;
          background-color: ${theme.neutral.hover} !important;
        }
        .dropdown-item:hover {
          background-color: ${theme.neutral.hover} !important;
        }
        .btn-primary:hover {
          background-color: ${theme.brand.primaryHover} !important;
        }
        .btn-secondary:hover {
          background-color: ${theme.neutral.hover} !important;
          border-color: ${theme.neutral.subtle} !important;
        }
        @media (max-width: 860px) {
          .header-desktop-nav { display: none !important; }
          .header-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
}

function MobileLink({ href, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        padding: "10px 8px",
        borderRadius: theme.radius.md,
        fontSize: 15,
        fontWeight: 500,
        color: theme.text.primary,
        textDecoration: "none",
        transition: "background-color 0.12s",
      }}
      className="dropdown-item"
    >
      {children}
    </Link>
  );
}
