"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import theme from "../constants/theme";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Changelogs",
      href: "/dashboard/changelogs",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: "Widget Settings",
      href: "/dashboard/settings/widget",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      name: "API Keys",
      href: "/dashboard/settings/api-keys",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
    },
    {
      name: "Labels",
      href: "/dashboard/settings/labels",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
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
    <aside className="w-64 flex flex-col" style={{ backgroundColor: theme.neutral.white, borderRight: `1px solid ${theme.neutral.border}` }}>
      {/* Logo */}
      <div style={{ padding: "24px", borderBottom: `1px solid ${theme.neutral.border}` }}>
        <Link href="/dashboard" className="flex items-center space-x-2" style={{ textDecoration: "none" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.brand.primary }}>
            <span style={{ color: theme.text.inverse, fontWeight: 700, fontSize: "18px" }}>R</span>
          </div>
          <span style={{ color: theme.text.primary, fontWeight: 600, fontSize: "18px" }}>ReleaseDock</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: isActive(item.href) ? theme.neutral.bg : "transparent",
              color: isActive(item.href) ? theme.text.primary : theme.text.secondary,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
