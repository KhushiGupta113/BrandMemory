'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  CheckCircle2, 
  Layers, 
  AlertTriangle, 
  ArrowUpRight, 
  Sparkles, 
  Search, 
  Activity,
  Calendar,
  ExternalLink
} from 'lucide-react';

export default function OverviewDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-label-caps font-mono uppercase tracking-wider text-primary bg-primary-fixed px-2 py-0.5 rounded-full border border-outline-variant">
              Editorial Provenance
            </span>
            <span className="text-mono-citation font-mono text-on-surface-variant">
              Tenant: Kalyani Botanicals (Demo)
            </span>
          </div>
          <h1 className="text-display-lg font-bold text-on-surface tracking-tight">
            Provenance Overview
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-2xl mt-1">
            Grounded AI marketing context dashboard. Monitor document ingestion velocity, claim verification coverage, and active editorial campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/content-studio"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-semibold hover:bg-primary-container transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Content</span>
          </Link>
          <Link
            href="/knowledge-library"
            className="flex items-center gap-2 px-3.5 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm font-medium text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <FileText className="w-4 h-4 text-on-surface-variant" />
            <span>Library</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-space-md bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-3">
            <span className="text-label-caps font-mono uppercase tracking-wider">Indexed Documents</span>
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-3xl font-bold text-on-surface tracking-tight">14 Files</div>
            <div className="text-body-sm text-on-surface-variant mt-1 flex items-center gap-1.5">
              <span className="text-emerald-600 font-semibold font-mono text-xs">+2 this week</span>
              <span>• 1,842 chunks</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-space-md bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-3">
            <span className="text-label-caps font-mono uppercase tracking-wider">Retrieval Groundedness</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-3xl font-bold text-on-surface tracking-tight">94.8%</div>
            <div className="text-body-sm text-on-surface-variant mt-1 flex items-center gap-1.5">
              <span className="text-emerald-600 font-semibold font-mono text-xs">High Fidelity</span>
              <span>• RRF Hybrid</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-space-md bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-3">
            <span className="text-label-caps font-mono uppercase tracking-wider">Active Campaigns</span>
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-3xl font-bold text-on-surface tracking-tight">4 Channels</div>
            <div className="text-body-sm text-on-surface-variant mt-1 flex items-center gap-1.5">
              <span>PDP, Meta Ads, Email</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-space-md bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col justify-between border-rose-200 bg-rose-50/20">
          <div className="flex items-center justify-between text-on-surface-variant mb-3">
            <span className="text-label-caps font-mono uppercase tracking-wider text-rose-700">Flagged Conflicts</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <div className="text-3xl font-bold text-rose-700 tracking-tight">2 Discrepancies</div>
            <div className="text-body-sm text-rose-600 mt-1 flex items-center gap-1.5">
              <Link href="/conflict-review" className="hover:underline flex items-center gap-1 font-semibold text-xs">
                Requires Human Review <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: Recent Generated Outputs vs Retrieval Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Left Column: Recent Generated Content Stream */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-headline-lg font-semibold text-on-surface">
              Recent Editorial Outputs
            </h2>
            <Link href="/content-studio" className="text-body-sm font-semibold text-primary hover:underline flex items-center gap-1">
              View Content Studio <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {/* Output Card 1 */}
            <div className="p-space-md bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-mono-citation font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    Verified Grounded
                  </span>
                  <span className="text-body-sm font-semibold text-on-surface">Bakuchiol 1% Botanical Rejuvenating Night Serum</span>
                </div>
                <span className="text-mono-citation font-mono text-on-surface-variant">Today • 14:20</span>
              </div>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Formulated with 1.0% pure Ayurvedic Bakuchiol <span className="font-mono text-mono-citation bg-primary-fixed text-primary px-1 rounded">[KB-REF-01]</span>, clinically demonstrated to provide non-inferior fine line reduction compared to 0.5% retinol without retinoid dermatitis. Enriched with wildcrafted Gotu Kola <span className="font-mono text-mono-citation bg-primary-fixed text-primary px-1 rounded">[KB-REF-03]</span> to stimulate Type I pro-collagen mRNA expression.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant text-body-sm text-on-surface-variant">
                <div className="flex items-center gap-3">
                  <span>Channel: <strong className="text-on-surface">E-Commerce PDP</strong></span>
                  <span>Citations: <strong className="text-on-surface">2 Verified</strong></span>
                </div>
                <span className="text-mono-citation font-mono text-emerald-700 font-semibold">98.2% Groundedness</span>
              </div>
            </div>

            {/* Output Card 2 */}
            <div className="p-space-md bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-mono-citation font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    Verified Grounded
                  </span>
                  <span className="text-body-sm font-semibold text-on-surface">Kashmiri Kumkumadi Tailam Radiance Oil</span>
                </div>
                <span className="text-mono-citation font-mono text-on-surface-variant">Yesterday • 11:05</span>
              </div>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Traditional taila paka preparation utilizing Grade-A Kashmiri Saffron <span className="font-mono text-mono-citation bg-primary-fixed text-primary px-1 rounded">[KB-REF-02]</span>. Clinically observed 18.4% reduction in epidermal melanin concentration over 28 consecutive days.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant text-body-sm text-on-surface-variant">
                <div className="flex items-center gap-3">
                  <span>Channel: <strong className="text-on-surface">Meta Sponsored Ad</strong></span>
                  <span>Citations: <strong className="text-on-surface">1 Verified</strong></span>
                </div>
                <span className="text-mono-citation font-mono text-emerald-700 font-semibold">96.0% Groundedness</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ingestion Status & Quick Controls */}
        <div className="flex flex-col gap-4">
          <h2 className="text-headline-lg font-semibold text-on-surface">
            Knowledge Engine Status
          </h2>

          <div className="p-space-md bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between text-body-sm mb-1.5">
                <span className="font-semibold text-on-surface">Vector Embeddings Sync</span>
                <span className="font-mono text-mono-citation text-emerald-600">100% Up-to-Date</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-full"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-body-sm mb-1.5">
                <span className="font-semibold text-on-surface">AYUSH Rule Compliance</span>
                <span className="font-mono text-mono-citation text-primary">Rule 170 Enforced</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full w-[96%]"></div>
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant flex flex-col gap-2">
              <span className="text-label-caps font-mono uppercase text-on-surface-variant">Quick Benchmarks</span>
              <div className="flex justify-between items-center text-body-sm">
                <span className="text-on-surface-variant">Hybrid Recall@5:</span>
                <span className="font-mono font-semibold text-on-surface">1.0000</span>
              </div>
              <div className="flex justify-between items-center text-body-sm">
                <span className="text-on-surface-variant">Mean Reciprocal Rank (MRR):</span>
                <span className="font-mono font-semibold text-on-surface">0.8833</span>
              </div>
              <div className="flex justify-between items-center text-body-sm">
                <span className="text-on-surface-variant">Average Query Latency:</span>
                <span className="font-mono font-semibold text-on-surface">38.4 ms</span>
              </div>
            </div>

            <Link
              href="/retrieval-inspector"
              className="mt-2 w-full py-2 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant rounded text-center text-body-sm font-semibold text-primary transition-colors block"
            >
              Open Retrieval Inspector
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
