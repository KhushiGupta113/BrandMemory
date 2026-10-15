'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Users, 
  AlertOctagon, 
  Plus, 
  CheckCircle, 
  Info,
  Check,
  FileCheck
} from 'lucide-react';

export default function BrandWorkspacePage() {
  const [activeTab, setActiveTab] = useState<'voice' | 'claims' | 'prohibited' | 'audiences'>('claims');
  const [data, setData] = useState<any>(null);
  const [newClaim, setNewClaim] = useState('');
  const [newCitation, setNewCitation] = useState('KB-REF-05');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/brand-rules')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error(err));
  }, []);

  const handleAddClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClaim.trim()) return;

    if (data) {
      const updatedClaims = [
        ...data.approvedClaims,
        {
          citationRef: newCitation,
          keywords: newClaim.toLowerCase().split(' ').slice(0, 4),
          statement: newClaim,
          study: 'User Added Certified Clinical Protocol',
        },
      ];
      setData({ ...data, approvedClaims: updatedClaims });
      setNewClaim('');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-label-caps font-mono uppercase tracking-wider text-primary bg-primary-fixed px-2 py-0.5 rounded-full border border-outline-variant">
              Brand Governance & Voice
            </span>
            <span className="text-mono-citation font-mono text-on-surface-variant">
              Tenant: Kalyani Botanicals
            </span>
          </div>
          <h1 className="text-display-lg font-bold text-on-surface tracking-tight">
            Brand Workspace
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-2xl mt-1">
            Configure approved voice parameters, validated claims repository, target audience personas, and prohibited marketing declarations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-body-sm font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AYUSH Compliance Active</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant pb-px">
        <button
          onClick={() => setActiveTab('claims')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 text-body-sm font-semibold transition-all ${
            activeTab === 'claims'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Approved Claims ({data?.approvedClaims?.length || 4})</span>
        </button>

        <button
          onClick={() => setActiveTab('prohibited')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 text-body-sm font-semibold transition-all ${
            activeTab === 'prohibited'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Prohibited Phrases ({data?.prohibitedPhrases?.length || 5})</span>
        </button>

        <button
          onClick={() => setActiveTab('voice')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 text-body-sm font-semibold transition-all ${
            activeTab === 'voice'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Brand Voice Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('audiences')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 text-body-sm font-semibold transition-all ${
            activeTab === 'audiences'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Target Audiences ({data?.targetAudiences?.length || 2})</span>
        </button>
      </div>

      {/* Tab 1: Approved Claims */}
      {activeTab === 'claims' && (
        <div className="flex flex-col gap-6">
          {/* Add Claim Form */}
          <form onSubmit={handleAddClaim} className="p-4 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-body-sm font-semibold text-on-surface flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Register New Approved Claim
              </span>
              {savedSuccess && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Claim Saved to Provenance Registry
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Citation Code (e.g. KB-REF-05)"
                value={newCitation}
                onChange={(e) => setNewCitation(e.target.value)}
                className="px-3 py-1.5 font-mono text-mono-code bg-surface-bright border border-outline-variant rounded text-on-surface"
              />
              <input
                type="text"
                placeholder="Enter clinical benefit statement with exact dosage..."
                value={newClaim}
                onChange={(e) => setNewClaim(e.target.value)}
                className="md:col-span-2 px-3 py-1.5 text-body-sm bg-surface-bright border border-outline-variant rounded text-on-surface"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-primary text-on-primary rounded text-body-sm font-semibold hover:bg-primary-container transition-colors"
              >
                + Register Claim
              </button>
            </div>
          </form>

          {/* Claims List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.approvedClaims?.map((claim: any, idx: number) => (
              <div key={idx} className="p-4 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-mono-citation font-semibold px-2 py-0.5 rounded bg-primary-fixed text-primary border border-primary-fixed-dim">
                    {claim.citationRef}
                  </span>
                  <span className="text-mono-citation text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    Peer Verified
                  </span>
                </div>
                <p className="text-body-md text-on-surface font-medium leading-relaxed">
                  "{claim.statement}"
                </p>
                <div className="pt-2 border-t border-outline-variant flex items-center justify-between text-body-sm text-on-surface-variant">
                  <span className="font-mono text-xs">{claim.study}</span>
                  <div className="flex gap-1">
                    {claim.keywords?.map((kw: string, ki: number) => (
                      <span key={ki} className="text-xs bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface-variant font-mono">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Prohibited Phrases */}
      {activeTab === 'prohibited' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-body-sm text-rose-800 flex items-start gap-2.5">
            <Info className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Statutory Enforcement:</strong> Any generated marketing copy that contains phrases flagged below will be intercepted, failed in validation, and flagged for human review.
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {data?.prohibitedPhrases?.map((p: any, idx: number) => (
              <div key={idx} className="p-4 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-body-md font-bold text-rose-700 line-through">
                      "{p.phrase}"
                    </span>
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-xs font-mono font-semibold rounded">
                      Critical Violation
                    </span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    {p.explanation}
                  </p>
                </div>
                <span className="text-label-caps font-mono text-rose-600 font-semibold uppercase">
                  Zero Tolerance
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Brand Voice Rules */}
      {activeTab === 'voice' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.brandVoice?.attributes?.map((attr: any, idx: number) => (
            <div key={idx} className="p-5 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-label-caps font-mono uppercase tracking-wider text-primary">
                  Voice Pillar 0{idx + 1}
                </span>
                <span className="px-2 py-0.5 text-xs font-mono bg-surface-container-high rounded text-on-surface-variant">
                  Weight: {attr.weight}
                </span>
              </div>
              <h3 className="text-headline-md font-semibold text-on-surface">
                {attr.name}
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                {attr.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Target Audiences */}
      {activeTab === 'audiences' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.targetAudiences?.map((aud: any, idx: number) => (
            <div key={idx} className="p-5 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-headline-md font-semibold text-on-surface">
                  {aud.name}
                </h3>
                <span className="font-mono text-xs text-primary bg-primary-fixed px-2 py-0.5 rounded border border-outline-variant">
                  Age {aud.age}
                </span>
              </div>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                {aud.focus}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
