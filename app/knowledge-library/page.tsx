'use client';

import React, { useState, useEffect } from 'react';
import { 
  Library, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  ChevronRight,
  Layers,
  Sparkles,
  X
} from 'lucide-react';
import { UploadModal } from '@/components/shared/UploadModal';

export default function KnowledgeLibraryPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [chunks, setChunks] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [filterType, setFilterType] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchDocs = () => {
    fetch('/api/documents')
      .then((res) => res.json())
      .then((d) => {
        setDocuments(d.documents || []);
        setChunks(d.chunksPreview || []);
        if (d.documents?.length > 0 && !selectedDoc) {
          setSelectedDoc(d.documents[0]);
        }
      });
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const filteredDocs = documents.filter((d) => {
    if (filterType !== 'all' && d.fileType !== filterType) return false;
    if (searchFilter && !d.title.toLowerCase().includes(searchFilter.toLowerCase()) && !d.filename.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    return true;
  });

  const selectedDocChunks = chunks.filter((c) => selectedDoc && c.documentId === selectedDoc.id);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-label-caps font-mono uppercase tracking-wider text-primary bg-primary-fixed px-2 py-0.5 rounded-full border border-outline-variant">
              Grounded Repository
            </span>
            <span className="text-mono-citation font-mono text-on-surface-variant">
              Tenant: Kalyani Botanicals
            </span>
          </div>
          <h1 className="text-display-lg font-bold text-on-surface tracking-tight">
            Knowledge Library
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-2xl mt-1">
            Manage certified brand documents, clinical monographs, and regulatory filings. Every file is sectioned and indexed with multi-modal embeddings.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-semibold hover:bg-primary-container transition-all shadow-xs"
        >
          <Upload className="w-4 h-4" />
          <span>+ Ingest Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-surface-container-lowest border border-outline-variant rounded-lg">
        <div className="flex items-center gap-2 w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-outline absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter files by name or clinical keywords..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-body-sm bg-surface-bright border border-outline-variant rounded text-on-surface focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-label-caps font-mono text-on-surface-variant uppercase">Format:</span>
          {['all', 'pdf', 'docx', 'markdown'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFilterType(fmt)}
              className={`px-2.5 py-1 text-xs font-mono rounded uppercase transition-colors ${
                filterType === fmt
                  ? 'bg-primary text-on-primary font-semibold'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Document List + Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Document List Table */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-body-sm">
                <thead className="bg-surface-container-low border-b border-outline-variant text-label-caps font-mono text-on-surface-variant uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Document Title</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Approval Tier</th>
                    <th className="py-2.5 px-3">Version</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Chunks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {filteredDocs.map((doc) => {
                    const isSelected = selectedDoc?.id === doc.id;
                    return (
                      <tr
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-secondary-container/60' : 'hover:bg-surface-container-high/40'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-semibold text-on-surface flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary shrink-0" />
                            <span className="truncate max-w-xs">{doc.title}</span>
                          </div>
                          <div className="text-mono-citation font-mono text-on-surface-variant mt-0.5">
                            {doc.filename} • {doc.fileSize}
                          </div>
                        </td>
                        <td className="py-3 px-3 uppercase font-mono text-xs">{doc.fileType}</td>
                        <td className="py-3 px-3">
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-container-high text-on-surface truncate block max-w-[140px]">
                            {doc.approvalTier}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-xs">{doc.currentVersion}</td>
                        <td className="py-3 px-3">
                          {doc.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle className="w-3 h-3" /> Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <AlertCircle className="w-3 h-3" /> In Review
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-primary">
                          {doc.chunkCount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Document Chunk Preview Drawer */}
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <div>
                <span className="text-label-caps font-mono uppercase text-primary">
                  Chunk & Provenance Preview
                </span>
                <h3 className="text-headline-sm font-semibold text-on-surface mt-0.5">
                  {selectedDoc?.title || 'Select a Document'}
                </h3>
              </div>
              <Layers className="w-5 h-5 text-primary" />
            </div>

            {selectedDoc && (
              <>
                <div className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
                  <div><strong>Category:</strong> {selectedDoc.category}</div>
                  <div><strong>Approval:</strong> {selectedDoc.approvalTier}</div>
                  <div><strong>Last Updated:</strong> {selectedDoc.updatedAt}</div>
                  <div className="mt-1 text-xs leading-relaxed italic bg-surface-container-low p-2 rounded border border-outline-variant">
                    {selectedDoc.summary}
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant flex flex-col gap-3">
                  <span className="text-label-caps font-mono uppercase text-on-surface-variant">
                    Section Chunks ({selectedDocChunks.length > 0 ? selectedDocChunks.length : 'Simulated Chunks'})
                  </span>

                  {(selectedDocChunks.length > 0 ? selectedDocChunks : [
                    {
                      citationRef: 'KB-REF-01',
                      sectionTitle: 'Primary Bioactive Analysis',
                      pageNumber: 2,
                      tokenCount: 42,
                      content: selectedDoc.summary,
                    }
                  ]).map((chunk: any, ci: number) => (
                    <div key={ci} className="p-3 bg-surface-bright border border-outline-variant rounded flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-mono-citation font-semibold px-1.5 py-0.5 rounded bg-primary-fixed text-primary">
                          {chunk.citationRef}
                        </span>
                        <span className="text-mono-citation font-mono text-on-surface-variant">
                          p. {chunk.pageNumber} • {chunk.tokenCount} tokens
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-on-surface">
                        {chunk.sectionTitle}
                      </div>
                      <p className="text-body-sm text-on-surface-variant font-mono text-xs leading-relaxed">
                        {chunk.content}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={fetchDocs}
      />
    </div>
  );
}
