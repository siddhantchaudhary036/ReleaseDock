import Link from "next/link";
import theme from "../constants/theme";

const footerSections = [
  {
    title: "Products",
    links: [
      { label: "Changelog", href: "/products/changelog" },
      { label: "Feedback & Surveys", href: "/products/feedback" },
      { label: "Onboarding Tooltips", href: "/products/onboarding" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "/resources/help" },
      { label: "Developer Docs", href: "/resources/docs" },
      { label: "Blog", href: "/resources/blog" },
      { label: "About Us", href: "/resources/about" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
      { label: "What's New", href: "/whats-new" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Use", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: `1px solid ${theme.neutral.border}`,
        backgroundColor: theme.neutral.bg,
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "64px 24px 32px",
        }}
      >
        {/* Top section: logo + link columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr repeat(4, 1fr)",
            gap: 40,
          }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }}>
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
            <p style={{ fontSize: 14, lineHeight: 1.6, color: theme.text.tertiary, maxWidth: 240, margin: 0 }}>
              Beautiful changelogs your users will actually read. Write, publish, and embed in minutes.
            </p>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: theme.text.primary,
                  marginBottom: 16,
                  letterSpacing: "0.02em",
                }}
              >
                {section.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      fontSize: 14,
                      color: theme.text.tertiary,
                      textDecoration: "none",
                      transition: "color 0.15s",
                    }}
                    className="footer-link"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            backgroundColor: theme.neutral.border,
            margin: "40px 0 24px",
          }}
        />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <p style={{ fontSize: 13, color: theme.text.tertiary, margin: 0 }}>
            © {new Date().getFullYear()} ReleaseDock. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/terms" style={{ fontSize: 13, color: theme.text.tertiary, textDecoration: "none" }} className="footer-link">
              Terms
            </Link>
            <Link href="/privacy" style={{ fontSize: 13, color: theme.text.tertiary, textDecoration: "none" }} className="footer-link">
              Privacy
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: ${theme.text.primary} !important;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
