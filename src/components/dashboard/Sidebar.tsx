"use client";

import { Briefcase, ChevronDown, Home, LineChart, PanelLeftClose } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "home", icon: Home },
  { href: "/portfolio", label: "portfolio", icon: Briefcase },
  { href: "/market", label: "market", icon: LineChart },
];

type SidebarProps = {
  userName?: string;
  userEmail?: string;
};

export default function Sidebar({userName = "Sophie Bennett", userEmail = "sophie.bennett@gmail.com"}: SidebarProps) {
  const pathname = usePathname();

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <aside className="flex w-52 shrink-0 flex-col border-r border-card-border bg-card">
      <button
        type="button"
        className="flex cursor-pointer items-center gap-3 border-b border-card-border px-4 py-4 text-left hover:bg-card"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-primary">
            {userName}
          </p>
          <p className="truncate text-xs text-secondary">{userEmail}</p>
        </div>
        <ChevronDown size={16} className="shrink-0 text-secondary" />
      </button>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-accent/15 font-medium text-accent"
                  : "text-secondary hover:bg-card hover:text-primary"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Doesn't actually collapse the sidebar yet — visual only for now. */}
      <button
        type="button"
        className="flex cursor-pointer items-center gap-2 border-t border-card-border px-4 py-4 text-sm text-secondary transition-colors hover:text-primary"
      >
        <PanelLeftClose size={16} />
        collapse
      </button>
    </aside>
  );
}
