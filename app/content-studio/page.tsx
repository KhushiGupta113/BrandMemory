'use client';

import React, { useState } from 'react';
import { 
  PenTool, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  ExternalLink, 
  Layers,
  Copy,
  Check,
  Loader2,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export default function ContentStudioPage() {
  const [prompt, setPrompt] = useState('Write an authoritative e-commerce product description for our Bakuchiol Botanical Rejuvenating Night Serum emphasizing its non-inferiority to retinol and safe barrier restoration.');
  const [channel, setChannel] = useState('E-Commerce PDP');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [selectedCitation, setSelectedCitation] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, channel }),
      });
      const data = await res.json();
      setOutput(data);
      if (data.citations?.length > 0) {
        setSelectedCitation(data.citations[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (output?.generatedText) {
      navigator.clipboard.writeText(output.generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-label-caps font-mono uppercase tracking-wider text-primary bg-primary-fixed px-2 py-0.5 rounded-full border border-outline-variant">
              Grounded Content Studio
            </span>
            <span className="text-mono-citation font-mono text-on-surface-variant">
              Tenant: Kalyani Botanicals
            </span>
          </div>
          <h1 className="text-display-lg font-bold text-on-surface tracking-tight">
            Content Studio & Evidence Inspector
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-2xl mt-1">
            Generate marketing copy backed by verifiable brand citations. Every statement links to ground-truth passages with automated claim support detection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm font-mono text-on-surface-variant">
            Engine: Hybrid RRF + Gemini
          </span>
        </div>
      </div>

      {/* Generator Prompt Box */}
      <form onSubmit={handleGenerate} className="p-4 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-body-sm font-semibold text-on-surface">Creative Prompt & Strategy</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant font-medium">Channel:</span>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="text-xs px-2.5 py-1 bg-surface-bright border border-outline-variant rounded text-on-surface font-medium"
            >
              <option value="E-Commerce PDP">E-Commerce PDP</option>
              <option value="Meta Sponsored Ad">Meta Sponsored Ad</option>
              <option value="Email Campaign">Email Campaign</option>
              <option value="Clinical Education Article">Clinical Education Article</option>
            </select>
          </div>
        </div>

        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe target marketing copy, key botanical ingredients, and campaign tone..."
          className="w-full p-3 text-body-md bg-surface-bright border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary-container"
        />

        <div className="flex justify-between items-center pt-2 border-t border-outline-variant">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPrompt('Create copy for Kumkumadi Tailam saffron oil highlighting 18.4% melanin reduction and clarifying safe acne usage.')}
              className="text-xs text-primary hover:underline font-mono bg-surface-container-high px-2 py-0.5 rounded"
            >
              + Example: Kumkumadi Melanin Trial
            </button>
            <button
              type="button"
              onClick={() => setPrompt('Describe our Gotu Kola and Ashwagandha soothing balm for urban skin barrier repair.')}
              className="text-xs text-primary hover:underline font-mono bg-surface-container-high px-2 py-0.5 rounded"
            >
              + Example: Barrier Collagen Synthesis
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-body-sm font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Generate Grounded Copy</span>
          </button>
        </div>
      </form>

      {/* Main Studio View: Output + Evidence Inspector */}
      {output && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
          {/* Generated Copy Pane */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="p-space-lg bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-mono-citation font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    {output.claimSupportStatus === 'verified' ? 'Claims Verified' : 'Review Flagged'}
                  </span>
                  <span className="text-body-sm font-semibold text-on-surface">{output.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant rounded text-xs font-semibold text-on-surface transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Text content with clickable citations */}
              <div className="text-body-lg text-on-surface leading-relaxed whitespace-pre-wrap font-sans">
                {output.generatedText}
              </div>

              {/* Citations bar */}
              <div className="pt-4 border-t border-outline-variant flex flex-wrap items-center gap-2">
                <span className="text-label-caps font-mono uppercase text-on-surface-variant mr-1">
                  Click Citations:
                </span>
                {output.citations?.map((c: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCitation(c)}
                    className={`px-2.5 py-1 rounded font-mono text-mono-citation font-semibold flex items-center gap-1 transition-all ${
                      selectedCitation?.citationRef === c.citationRef
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-primary-fixed text-primary hover:bg-primary-fixed-dim'
                    }`}
                  >
                    <span>[{c.citationRef}]</span>
                    <span className="text-xs truncate max-w-[120px]">{c.documentTitle}</span>
                  </button>
                ))}
              </div>

              {/* Prohibited check warnings */}
              {output.unsupportedWarnings?.length > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-body-sm text-rose-800 flex flex-col gap-1">
                  <div className="font-semibold flex items-center gap-1.5 text-rose-700">
                    <AlertTriangle className="w-4 h-4" /> Brand Governance Warnings
                  </div>
                  {output.unsupportedWarnings.map((w: string, i: number) => (
                    <p key={i} className="text-xs">• {w}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Evidence Inspector Side Drawer */}
          <div className="flex flex-col gap-4">
            <div className="p-space-md bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <h3 className="text-headline-sm font-semibold text-on-surface">Evidence Inspector</h3>
                </div>
                <span className="font-mono text-mono-citation text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {output.groundednessScore}% Grounded
                </span>
              </div>

              {selectedCitation ? (
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="text-label-caps font-mono uppercase text-on-surface-variant">Citation Tag</span>
                    <div className="font-mono text-lg font-bold text-primary mt-0.5">
                      [{selectedCitation.citationRef}]
                    </div>
                  </div>

                  <div>
                    <span className="text-label-caps font-mono uppercase text-on-surface-variant">Source Monograph</span>
                    <div className="text-body-sm font-semibold text-on-surface mt-0.5 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <span>{selectedCitation.documentTitle} (p. {selectedCitation.page})</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-label-caps font-mono uppercase text-on-surface-variant">Verified Claim Excerpt</span>
                    <div className="mt-1 p-2.5 bg-surface-container-high rounded text-xs font-semibold text-on-surface border border-outline-variant">
                      "{selectedCitation.claimExcerpt}"
                    </div>
                  </div>

                  <div>
                    <span className="text-label-caps font-mono uppercase text-on-surface-variant">Ground Truth Evidence</span>
                    <div className="mt-1 p-2.5 bg-surface-bright rounded text-xs font-mono text-on-surface-variant border border-outline-variant leading-relaxed">
                      {selectedCitation.evidenceText}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-outline-variant flex justify-between items-center text-mono-citation font-mono">
                    <span className="text-on-surface-variant">Attribution Confidence:</span>
                    <span className="text-emerald-700 font-semibold">
                      {(selectedCitation.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-body-sm text-on-surface-variant italic">
                  Select a citation tag above to inspect supporting clinical monograph evidence.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
