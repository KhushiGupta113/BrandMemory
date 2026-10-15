'use client';

import React, { useState, useEffect } from 'react';
import { 
  SearchCode, 
  Search, 
  Layers, 
  Zap, 
  ArrowRight, 
  Sliders, 
  CheckCircle,
  FileText,
  Clock,
  Loader2
} from 'lucide-react';

export default function RetrievalInspectorPage() {
  const [query, setQuery] = useState('clinical trial Bakuchiol wrinkle reduction non-inferior to retinol');
  const [rrfK, setRrfK] = useState(60);
  const [topK, setTopK] = useState(5);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const executeSearch = async (qText?: string) => {
    const activeQuery = qText || query;
    if (!activeQuery.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/retrieval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: activeQuery, k: topK, rrfK }),
      });
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, []);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-label-caps font-mono uppercase tracking-wider text-primary bg-primary-fixed px-2 py-0.5 rounded-full border border-outline-variant">
              Information Retrieval Diagnostics
            </span>
            <span className="text-mono-citation font-mono text-on-surface-variant">
              Tenant: Kalyani Botanicals
            </span>
          </div>
          <h1 className="text-display-lg font-bold text-on-surface tracking-tight">
            Retrieval Inspector
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-2xl mt-1">
            Compare BM25 full-text keyword retrieval, dense vector cosine similarity, and hybrid Reciprocal Rank Fusion (RRF) side-by-side.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-mono-citation font-mono text-on-surface-variant bg-surface-container-high px-3 py-1.5 rounded border border-outline-variant">
            Total Pipeline: {data?.totalLatencyMs || 38.4} ms
          </span>
        </div>
      </div>

      {/* Query Bar & Controls */}
      <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <SearchCode className="w-5 h-5 text-primary" />
          <span className="text-body-sm font-semibold text-on-surface">Test Retrieval Query</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-outline absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search phrase or scientific question..."
              className="w-full pl-9 pr-3 py-2 text-body-md bg-surface-bright border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary-container"
            />
          </div>

          <button
            onClick={() => executeSearch()}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-body-sm font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            <span>Run Pipeline</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-outline-variant text-body-sm text-on-surface-variant">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono">RRF Constant (k):</span>
              <input
                type="number"
                value={rrfK}
                onChange={(e) => setRrfK(Number(e.target.value))}
                className="w-16 px-2 py-0.5 text-xs font-mono bg-surface-bright border border-outline-variant rounded"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono">Top-K:</span>
              <select
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="px-2 py-0.5 text-xs font-mono bg-surface-bright border border-outline-variant rounded"
              >
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                const q = 'Kumkumadi Saffron melanin index spectrophotometry';
                setQuery(q);
                executeSearch(q);
              }}
              className="text-xs font-mono text-primary hover:underline bg-surface-container-high px-2 py-0.5 rounded"
            >
              Preset: Melanin Index
            </button>
            <button
              onClick={() => {
                const q = 'Gotu Kola Centella Asiatica collagen synthesis';
                setQuery(q);
                executeSearch(q);
              }}
              className="text-xs font-mono text-primary hover:underline bg-surface-container-high px-2 py-0.5 rounded"
            >
              Preset: Collagen Bioassay
            </button>
          </div>
        </div>
      </div>

      {/* 3-Column Comparative Retrieval Matrix */}
      {data?.comparison && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
          {/* Column 1: Keyword BM25 Search */}
          <div className="flex flex-col gap-3">
            <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center justify-between shadow-xs">
              <div>
                <span className="text-label-caps font-mono uppercase text-on-surface-variant">Strategy 1</span>
                <h3 className="text-headline-sm font-semibold text-on-surface">Keyword (BM25 / FTS)</h3>
              </div>
              <div className="flex items-center gap-1 font-mono text-mono-citation text-on-surface-variant bg-surface-bright px-2 py-1 rounded border border-outline-variant">
                <Clock className="w-3 h-3 text-primary" />
                <span>{data.comparison.keyword.latencyMs} ms</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {data.comparison.keyword.results.map((item: any, i: number) => (
                <div key={i} className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center font-mono text-xs font-bold text-on-surface">
                      #{item.rank}
                    </span>
                    <span className="font-mono text-mono-citation text-primary bg-primary-fixed px-1.5 py-0.5 rounded">
                      {item.chunk?.citationRef || 'KB-REF'}
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant">
                      TF score: {item.score}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-on-surface line-clamp-1">
                    {item.chunk?.sectionTitle}
                  </div>
                  <p className="text-xs font-mono text-on-surface-variant leading-relaxed line-clamp-3">
                    {item.chunk?.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Dense Vector Search */}
          <div className="flex flex-col gap-3">
            <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center justify-between shadow-xs">
              <div>
                <span className="text-label-caps font-mono uppercase text-on-surface-variant">Strategy 2</span>
                <h3 className="text-headline-sm font-semibold text-on-surface">Dense Vector (Cosine)</h3>
              </div>
              <div className="flex items-center gap-1 font-mono text-mono-citation text-on-surface-variant bg-surface-bright px-2 py-1 rounded border border-outline-variant">
                <Clock className="w-3 h-3 text-primary" />
                <span>{data.comparison.denseVector.latencyMs} ms</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {data.comparison.denseVector.results.map((item: any, i: number) => (
                <div key={i} className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center font-mono text-xs font-bold text-on-surface">
                      #{item.rank}
                    </span>
                    <span className="font-mono text-mono-citation text-primary bg-primary-fixed px-1.5 py-0.5 rounded">
                      {item.chunk?.citationRef || 'KB-REF'}
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant">
                      cos: {item.score}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-on-surface line-clamp-1">
                    {item.chunk?.sectionTitle}
                  </div>
                  <p className="text-xs font-mono text-on-surface-variant leading-relaxed line-clamp-3">
                    {item.chunk?.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Hybrid RRF Search */}
          <div className="flex flex-col gap-3">
            <div className="p-3 bg-surface-container-lowest border-2 border-primary/30 rounded-lg flex items-center justify-between shadow-xs bg-primary-fixed/10">
              <div>
                <span className="text-label-caps font-mono uppercase text-primary font-bold">Recommended</span>
                <h3 className="text-headline-sm font-semibold text-primary">Hybrid RRF Fusion</h3>
              </div>
              <div className="flex items-center gap-1 font-mono text-mono-citation text-primary bg-surface-container-lowest px-2 py-1 rounded border border-primary/20">
                <Clock className="w-3 h-3 text-primary" />
                <span>{data.comparison.hybridRRF.latencyMs} ms</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {data.comparison.hybridRRF.results.map((item: any, i: number) => (
                <div key={i} className="p-3 bg-surface-container-lowest border border-primary/20 rounded-lg shadow-xs flex flex-col gap-2 ring-1 ring-primary/5">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-mono text-xs font-bold">
                      #{i + 1}
                    </span>
                    <span className="font-mono text-mono-citation text-primary bg-primary-fixed px-1.5 py-0.5 rounded font-bold">
                      {item.chunk?.citationRef || 'KB-REF'}
                    </span>
                    <span className="font-mono text-xs font-semibold text-primary">
                      RRF: {item.rrfScore?.toFixed(4)}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-on-surface line-clamp-1">
                    {item.chunk?.sectionTitle}
                  </div>
                  <p className="text-xs font-mono text-on-surface-variant leading-relaxed line-clamp-3">
                    {item.chunk?.content}
                  </p>
                  <div className="pt-1 border-t border-outline-variant flex justify-between text-mono-citation font-mono text-on-surface-variant">
                    <span>KW Rank: {item.keywordRank ? `#${item.keywordRank}` : 'None'}</span>
                    <span>Vector Rank: {item.vectorRank ? `#${item.vectorRank}` : 'None'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
