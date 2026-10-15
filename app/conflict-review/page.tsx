'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  ArrowRight, 
  ShieldAlert, 
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Layers,
  Check,
  RotateCcw
} from 'lucide-react';

export default function DocumentConflictReviewPage() {
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [selectedConflict, setSelectedConflict] = useState<any>(null);
  const [resolutionStatus, setResolutionStatus] = useState<Record<string, string>>({});
  const [resolutionNote, setResolutionNote] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    fetch('/api/conflicts')
      .then((res) => res.json())
      .then((d) => {
        setConflicts(d.conflicts || []);
        if (d.conflicts?.length > 0) {
          setSelectedConflict(d.conflicts[0]);
        }
      });
  }, []);

  const handleResolve = async (conflictId: string, resolution: string) => {
    try {
      const res = await fetch('/api/conflicts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conflictId, resolution, notes: resolutionNote, resolvedBy: 'Dr. Ananya Roy' }),
      });
      const data = await res.json();
      if (data.success) {
        setResolutionStatus((prev) => ({ ...prev, [conflictId]: resolution }));
        setSavedMessage(`Conflict successfully marked as "${resolution.replace(/_/g, ' ')}"`);
        setTimeout(() => setSavedMessage(''), 3500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-label-caps font-mono uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Human-In-The-Loop Governance
            </span>
            <span className="text-mono-citation font-mono text-on-surface-variant">
              Tenant: Kalyani Botanicals
            </span>
          </div>
          <h1 className="text-display-lg font-bold text-on-surface tracking-tight">
            Document Conflict Review
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-2xl mt-1">
            Reconcile contradictions between document versions. System never assumes newest is authoritative without verified approval status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-body-sm font-semibold flex items-center gap-1.5 font-mono">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>2 Flagged Contradictions</span>
          </span>
        </div>
      </div>

      {savedMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-body-sm text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Main Conflict Review Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Left Column: Conflict List */}
        <div className="flex flex-col gap-3">
          <h2 className="text-headline-sm font-semibold text-on-surface">
            Pending Conflicts Queue
          </h2>

          <div className="flex flex-col gap-2.5">
            {conflicts.map((conf) => {
              const isSelected = selectedConflict?.id === conf.id;
              const resolvedState = resolutionStatus[conf.id];

              return (
                <div
                  key={conf.id}
                  onClick={() => setSelectedConflict(conf)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer shadow-xs flex flex-col gap-2 ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/20 bg-surface-container-lowest'
                      : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-mono-citation font-mono uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold border border-rose-200">
                      {conf.conflictType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-mono-citation font-mono text-on-surface-variant">
                      Severity: <strong className="text-rose-700 uppercase">{conf.severity}</strong>
                    </span>
                  </div>

                  <h3 className="text-body-md font-semibold text-on-surface line-clamp-1">
                    {conf.documentA.title} vs {conf.documentB.version}
                  </h3>

                  <p className="text-body-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                    {conf.description}
                  </p>

                  <div className="pt-2 border-t border-outline-variant flex items-center justify-between text-mono-citation font-mono">
                    <span className="text-on-surface-variant">Status:</span>
                    {resolvedState ? (
                      <span className="text-emerald-700 font-bold uppercase">{resolvedState.replace(/_/g, ' ')}</span>
                    ) : (
                      <span className="text-amber-700 font-semibold uppercase">Pending Human Review</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2-Columns: Side-by-Side Deep Inspection Pane */}
        {selectedConflict && (
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="p-space-lg bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <div>
                  <span className="text-label-caps font-mono uppercase text-rose-700 font-bold">
                    Contradiction Analysis
                  </span>
                  <h3 className="text-headline-lg font-semibold text-on-surface mt-0.5">
                    {selectedConflict.description}
                  </h3>
                </div>
                <ShieldAlert className="w-6 h-6 text-rose-600" />
              </div>

              {/* Side-by-Side Document Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Document A */}
                <div className="p-4 bg-surface-bright border-2 border-emerald-600/30 rounded-lg flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 font-mono text-mono-citation font-bold bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
                      Document A ({selectedConflict.documentA.version})
                    </span>
                    <span className="text-xs font-mono text-emerald-700 font-semibold">
                      {selectedConflict.documentA.approvalStatus}
                    </span>
                  </div>

                  <h4 className="text-body-sm font-semibold text-on-surface">
                    {selectedConflict.documentA.title}
                  </h4>
                  <div className="text-mono-citation font-mono text-on-surface-variant">
                    Effective: {selectedConflict.documentA.effectiveDate} • Tag: [{selectedConflict.documentA.citationRef}]
                  </div>

                  <div className="p-3 bg-surface-container-lowest rounded border border-outline-variant font-mono text-xs text-on-surface leading-relaxed border-l-4 border-l-emerald-600">
                    "{selectedConflict.documentA.snippet}"
                  </div>
                </div>

                {/* Document B */}
                <div className="p-4 bg-surface-bright border-2 border-rose-600/30 rounded-lg flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 font-mono text-mono-citation font-bold bg-rose-50 text-rose-800 rounded border border-rose-200">
                      Document B ({selectedConflict.documentB.version})
                    </span>
                    <span className="text-xs font-mono text-rose-700 font-semibold">
                      {selectedConflict.documentB.approvalStatus}
                    </span>
                  </div>

                  <h4 className="text-body-sm font-semibold text-on-surface">
                    {selectedConflict.documentB.title}
                  </h4>
                  <div className="text-mono-citation font-mono text-on-surface-variant">
                    Effective: {selectedConflict.documentB.effectiveDate} • Tag: [{selectedConflict.documentB.citationRef}]
                  </div>

                  <div className="p-3 bg-surface-container-lowest rounded border border-outline-variant font-mono text-xs text-on-surface leading-relaxed border-l-4 border-l-rose-600">
                    "{selectedConflict.documentB.snippet}"
                  </div>
                </div>
              </div>

              {/* Recommendation Note */}
              <div className="p-3.5 bg-primary-fixed/15 border border-primary/20 rounded-lg flex items-start gap-2.5 text-body-sm text-on-surface">
                <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-primary">Governance Recommendation:</strong>{' '}
                  {selectedConflict.recommendation}
                </div>
              </div>

              {/* Decision and Sign-off Actions */}
              <div className="pt-4 border-t border-outline-variant flex flex-col gap-3">
                <span className="text-label-caps font-mono uppercase text-on-surface-variant">
                  Human Sign-Off Actions
                </span>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => handleResolve(selectedConflict.id, 'resolved_keep_a')}
                    className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-on-primary rounded text-body-sm font-semibold transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Affirm Document A as Authoritative</span>
                  </button>

                  <button
                    onClick={() => handleResolve(selectedConflict.id, 'resolved_coexist')}
                    className="flex items-center gap-2 px-3.5 py-2 bg-primary hover:bg-primary-container text-on-primary rounded text-body-sm font-semibold transition-colors"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Condition Usage (Coexist with Caution)</span>
                  </button>

                  <button
                    onClick={() => handleResolve(selectedConflict.id, 'resolved_keep_b')}
                    className="flex items-center gap-2 px-3.5 py-2 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant rounded text-body-sm font-semibold text-on-surface transition-colors"
                  >
                    <span>Supersede with Document B</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
