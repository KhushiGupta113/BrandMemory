'use client';

import React, { useState } from 'react';
import { Search, Bell, HelpCircle, Sliders, ChevronDown, Check, Building2 } from 'lucide-react';

interface TopNavBarProps {
  onSearchChange?: (term: string) => void;
  activeWorkspaceId?: string;
  onSelectWorkspace?: (wsId: string) => void;
}

const WORKSPACES = [
  { id: 'ws-kalyani-botanicals', name: 'Kalyani Botanicals', tier: 'Clinical Formulations (Demo)' },
  { id: 'ws-vedic-wellness', name: 'Vedic Wellness Labs', tier: 'Nutraceuticals' },
  { id: 'ws-aurora-derma', name: 'Aurora Derma Technologies', tier: 'Biotech Dermaceuticals' },
];

export function TopNavBar({ onSearchChange, activeWorkspaceId = 'ws-kalyani-botanicals', onSelectWorkspace }: TopNavBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const activeWs = WORKSPACES.find((w) => w.id === activeWorkspaceId) || WORKSPACES[0];

  return (
    <header className="h-16 w-full flex items-center justify-between px-space-lg bg-surface-container-lowest border-b border-outline-variant shadow-xs z-30">
      {/* Left: Search & Model Badge */}
      <div className="flex items-center gap-space-md w-1/2">
        <div className="relative w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-outline" />
          <input
            type="text"
            placeholder="Search claims, clinical trials, guidelines..."
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-9 pr-12 py-1.5 bg-surface-bright border border-outline-variant rounded-lg text-body-sm text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
          />
          <kbd className="absolute right-2.5 top-2 px-1.5 py-0.5 text-label-caps font-mono bg-surface-container-high text-on-surface-variant rounded border border-outline-variant">
            ⌘K
          </kbd>
        </div>

        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded bg-surface-bright border border-outline-variant text-mono-citation">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-on-surface-variant font-mono">Production Index • Synced 4m ago</span>
        </div>
      </div>

      {/* Right: Workspace Switcher & Actions */}
      <div className="flex items-center gap-space-md">
        {/* Multi-Tenant Workspace Selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface-bright hover:bg-surface-container-high border border-outline-variant rounded-lg text-body-sm text-on-surface transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">{activeWs.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg py-1 z-50">
              <div className="px-3 py-1.5 border-b border-outline-variant text-label-caps font-mono text-on-surface-variant uppercase">
                Switch Tenant Workspace
              </div>
              {WORKSPACES.map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    onSelectWorkspace?.(w.id);
                    setDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-surface-container-low transition-colors"
                >
                  <div>
                    <div className="text-body-sm font-semibold text-on-surface">{w.name}</div>
                    <div className="text-mono-citation font-mono text-on-surface-variant">{w.tier}</div>
                  </div>
                  {w.id === activeWorkspaceId && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 border-l border-outline-variant pl-space-md text-on-surface-variant">
          <button className="p-1.5 rounded hover:bg-surface-container-high transition-colors" title="Notifications">
            <Bell className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-surface-container-high transition-colors" title="Documentation">
            <HelpCircle className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-surface-container-high transition-colors" title="Settings">
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
