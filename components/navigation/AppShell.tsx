'use client';

import React, { useState } from 'react';
import { SideNavBar } from './SideNavBar';
import { TopNavBar } from './TopNavBar';
import { UploadModal } from '../shared/UploadModal';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('ws-kalyani-botanicals');
  const [searchQuery, setSearchQuery] = useState('');

  const workspaceNames: Record<string, string> = {
    'ws-kalyani-botanicals': 'Kalyani Botanicals',
    'ws-vedic-wellness': 'Vedic Wellness Labs',
    'ws-aurora-derma': 'Aurora Derma Tech',
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Side Navigation Bar */}
      <SideNavBar
        onOpenUpload={() => setIsUploadOpen(true)}
        activeWorkspaceName={workspaceNames[activeWorkspaceId]}
        conflictCount={2}
      />

      {/* Main App Content Area */}
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        <TopNavBar
          activeWorkspaceId={activeWorkspaceId}
          onSelectWorkspace={setActiveWorkspaceId}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 overflow-y-auto bg-background p-space-lg">
          {children}
        </main>
      </div>

      {/* Shared Document Ingestion Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => {
          // Trigger optional refresh
        }}
      />
    </div>
  );
}
