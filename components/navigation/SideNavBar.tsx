'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Library, 
  PenTool, 
  SearchCode, 
  Activity, 
  AlertTriangle,
  Upload,
  RefreshCw,
  UserCheck
} from 'lucide-react';

interface SideNavBarProps {
  onOpenUpload?: () => void;
  activeWorkspaceName?: string;
  conflictCount?: number;
}

export function SideNavBar({ onOpenUpload, activeWorkspaceName = 'Kalyani Botanicals', conflictCount = 2 }: SideNavBarProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Overview', icon: LayoutDashboard },
    { href: '/brand-workspace', label: 'Brand Workspace', icon: BookOpen },
    { href: '/knowledge-library', label: 'Knowledge Library', icon: Library },
    { href: '/content-studio', label: 'Content Studio', icon: PenTool },
    { href: '/retrieval-inspector', label: 'Retrieval Inspector', icon: SearchCode },
    { href: '/evaluation-dashboard', label: 'Evaluation Dashboard', icon: Activity },
    { href: '/conflict-review', label: 'Conflict Review', icon: AlertTriangle, badge: conflictCount },
  ];

  return (
    <aside className="h-screen w-64 flex flex-col fixed left-0 top-0 border-r border-outline-variant bg-surface-container-low justify-between p-space-md z-40 select-none">
      <div className="flex flex-col gap-space-md">
        {/* Brand & Workspace Header */}
        <div className="flex items-center gap-space-sm px-space-xs py-space-xs">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
            <span className="font-bold text-sm tracking-wider">BM</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-headline-md font-semibold text-primary tracking-tight">BrandMemory</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-body-sm text-on-surface-variant truncate font-medium">{activeWorkspaceName}</span>
            </div>
          </div>
        </div>

        {/* Quick CTA */}
        <button
          onClick={onOpenUpload}
          className="w-full flex items-center justify-center gap-space-xs py-space-sm px-space-md bg-surface-container-lowest border border-outline-variant rounded-lg text-primary hover:bg-surface-container-high transition-all text-body-sm font-semibold shadow-xs hover:border-primary-container"
        >
          <Upload className="w-4 h-4 text-primary" />
          <span>+ Ingest Document</span>
        </button>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 mt-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-space-md py-space-sm rounded-lg transition-all text-body-md ${
                  isActive
                    ? 'bg-secondary-container text-primary font-semibold shadow-xs translate-x-0.5'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-1.5 py-0.5 rounded text-mono-citation font-mono bg-rose-100 text-rose-700 font-semibold border border-rose-200">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* SideNav Footer */}
      <div className="flex flex-col gap-2 pt-space-sm border-t border-outline-variant">
        <div className="flex items-center justify-between px-space-sm py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-mono-citation">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-on-surface-variant font-mono">Index Status (99.4%)</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>

        <div className="flex items-center gap-space-sm px-space-sm py-1.5">
          <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant border border-outline-variant">
            <UserCheck className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-body-sm font-semibold text-on-surface">Dr. Ananya Roy</span>
            <span className="text-label-caps text-on-surface-variant font-mono">Lead Brand Scientist</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
