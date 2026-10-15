'use client';

import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  const [approvalTier, setApprovalTier] = useState('AYUSH Certified');
  const [category, setCategory] = useState('Clinical Trial');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setContent(event.target?.result as string || '');
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filename || !content) {
      setError('Please provide a filename and content or upload a document file.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content, approvalTier, category }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to ingest document');

      setResult(data);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Ingestion failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl max-w-xl w-full p-6">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            <h3 className="text-headline-md font-semibold text-on-surface">Ingest Brand Document</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <X className="w-5 h-5" />
          </button>
        </div>

        {result ? (
          <div className="py-6 flex flex-col items-center text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-3" />
            <h4 className="text-headline-sm font-semibold text-on-surface mb-1">Document Successfully Ingested</h4>
            <p className="text-body-sm text-on-surface-variant mb-4">
              "{result.document.title}" was parsed into <span className="font-semibold text-primary">{result.chunksCreated} verified chunks</span> with section-level embeddings.
            </p>
            {result.warnings?.length > 0 && (
              <div className="w-full text-left bg-amber-50 border border-amber-200 rounded p-3 mb-4 text-body-sm text-amber-800">
                <span className="font-semibold">Security Inspection:</span>
                {result.warnings.map((w: string, i: number) => (
                  <p key={i} className="text-xs mt-1">• {w}</p>
                ))}
              </div>
            )}
            <button
              onClick={() => { setResult(null); onClose(); }}
              className="px-4 py-2 bg-primary text-on-primary rounded text-body-sm font-medium hover:bg-primary-container"
            >
              Done & Return to Library
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded text-body-sm text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-body-sm font-medium text-on-surface mb-1">Upload File (PDF, DOCX, TXT, MD)</label>
              <input
                type="file"
                accept=".txt,.md,.markdown,.pdf,.docx"
                onChange={handleFileUpload}
                className="w-full text-body-sm text-on-surface file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-body-sm file:font-medium file:bg-surface-container-high file:text-primary hover:file:bg-surface-container-highest cursor-pointer border border-outline-variant rounded p-1"
              />
            </div>

            <div>
              <label className="block text-body-sm font-medium text-on-surface mb-1">Document Title / Filename</label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="e.g. Ashwagandha_Stress_Clinical_Study.md"
                className="w-full px-3 py-1.5 bg-surface-bright border border-outline-variant rounded text-body-sm text-on-surface focus:outline-none focus:border-primary-container"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-body-sm font-medium text-on-surface mb-1">Approval Tier</label>
                <select
                  value={approvalTier}
                  onChange={(e) => setApprovalTier(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface-bright border border-outline-variant rounded text-body-sm text-on-surface"
                >
                  <option value="AYUSH Certified">AYUSH Certified</option>
                  <option value="Double-Blind Peer Reviewed">Double-Blind Peer Reviewed</option>
                  <option value="Internal Pharmacopeia">Internal Pharmacopeia</option>
                  <option value="Pending Committee Review">Pending Committee Review</option>
                </select>
              </div>

              <div>
                <label className="block text-body-sm font-medium text-on-surface mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface-bright border border-outline-variant rounded text-body-sm text-on-surface"
                >
                  <option value="Clinical Trial">Clinical Trial</option>
                  <option value="Pharmacopeia">Pharmacopeia</option>
                  <option value="Ingredient Science">Ingredient Science</option>
                  <option value="Compliance & Legal">Compliance & Legal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-body-sm font-medium text-on-surface mb-1">Raw Content / Text Preview</label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste Markdown or document text if uploading manually..."
                className="w-full p-2.5 font-mono text-mono-code bg-surface-bright border border-outline-variant rounded text-on-surface focus:outline-none focus:border-primary-container"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-body-sm font-medium text-on-surface-variant hover:bg-surface-container-high rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-primary hover:bg-primary-container text-on-primary rounded text-body-sm font-semibold transition-colors disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Ingest & Generate Embeddings</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
