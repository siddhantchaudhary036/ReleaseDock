"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import theme from "../constants/theme";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Changelogs",
      href: "/dashboard/changelogs",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      name: "Widget",
      href: "/dashboard/widget",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      ),
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const isActive = (href) => {
    if (href === "/dashboard/changelogs") {
      return pathname === href || pathname.startsWith("/dashboard/changelogs/");
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className="w-[220px] flex flex-col"
      style={{
        backgroundColor: theme.neutral.white,
        borderRight: `1px solid ${theme.neutral.border}`,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "16px 16px 12px" }}>
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
          style={{ textDecoration: "none" }}
        >
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ backgroundColor: theme.brand.primary }}
          >
            <span style={{ color: theme.text.inverse, fontWeight: 700, fontSize: 14 }}>R</span>
          </div>
          <span style={{ color: theme.text.primary, fontWeight: 600, fontSize: 15 }}>
            ReleaseDock
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="sidebar-nav-item flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors"
                style={{
                  backgroundColor: active ? theme.brand.primaryLight : "transparent",
                  color: active ? theme.brand.primary : theme.text.muted,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: active ? 500 : 400,
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User section at bottom */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: `1px solid ${theme.neutral.border}`,
        }}
      >
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: { width: 28, height: 28 },
            },
          }}
        />
      </div>

      <style>{`
        .sidebar-nav-item:hover {
          background-color: ${theme.neutral.hover} !important;
        }
      `}</style>
    </aside>
  );
}
