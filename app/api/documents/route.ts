import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizedWorkspaceId } from '@/lib/auth/tenant';
import { parseDocumentContent } from '@/lib/ingestion/parser';
import { chunkParsedDocument } from '@/lib/ingestion/chunker';
import { addUploadedChunk, getWorkspaceChunks, SEED_CHUNKS } from '@/lib/rag/engine';
import { generateEmbedding } from '@/lib/rag/embeddings';
import { isDbConnected, insertDocumentDb, getDocumentsDb, insertDocumentChunkDb } from '@/lib/db/client';

// In-memory document registry seeded with Kalyani Botanicals documents
let documentsStore = [
  {
    id: 'doc-bakuchiol-clinical-2023',
    workspaceId: 'ws-kalyani-botanicals',
    title: 'Bakuchiol Clinical Monograph v2.1',
    filename: 'KB_Bakuchiol_Clinical_Monograph_v2.1.pdf',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    status: 'approved',
    approvalTier: 'AYUSH Certified & Double-Blind Trial',
    currentVersion: 'v2.1',
    category: 'Clinical Trial',
    summary: '8-week double blind clinical trial testing 1% Bakuchiol vs 0.5% Retinol in periorbital wrinkle reduction and epidermal safety.',
    chunkCount: 2,
    updatedAt: '2023-11-15',
  },
  {
    id: 'doc-kumkumadi-dosing',
    workspaceId: 'ws-kalyani-botanicals',
    title: 'Kumkumadi Oil Traditional Pharmacopeia',
    filename: 'Kumkumadi_Tailam_Ayurvedic_Pharmacopeia.docx',
    fileType: 'docx',
    fileSize: '1.8 MB',
    status: 'approved',
    approvalTier: 'Classical Ayurvedic Formulary',
    currentVersion: 'v1.4',
    category: 'Pharmacopeia',
    summary: 'Traditional Ayurvedic formulation protocols, Kashmiri saffron extraction ratios, and epidermal spectrophotometry metrics.',
    chunkCount: 2,
    updatedAt: '2023-08-01',
  },
  {
    id: 'doc-centella-monograph',
    workspaceId: 'ws-kalyani-botanicals',
    title: 'Gotu Kola (Centella Asiatica) Bioactive Study',
    filename: 'Centella_Asiatica_Collagen_Assay.pdf',
    fileType: 'pdf',
    fileSize: '3.1 MB',
    status: 'approved',
    approvalTier: 'In-Vitro Peer Reviewed',
    currentVersion: 'v1.0',
    category: 'Ingredient Science',
    summary: 'Measurement of Asiaticoside and Madecassoside on Type I pro-collagen mRNA expression and barrier restoration.',
    chunkCount: 1,
    updatedAt: '2023-09-12',
  },
  {
    id: 'doc-regulatory-guidelines',
    workspaceId: 'ws-kalyani-botanicals',
    title: 'AYUSH Statutory Compliance & Rule 170 Guidelines',
    filename: 'AYUSH_Statutory_Compliance_Rule170.md',
    fileType: 'markdown',
    fileSize: '420 KB',
    status: 'approved',
    approvalTier: 'Regulatory Authority',
    currentVersion: 'v2024',
    category: 'Compliance & Legal',
    summary: 'Permissible marketing boundaries, prohibited curative statements, and clinical substantiation requirements for botanical claims.',
    chunkCount: 1,
    updatedAt: '2024-01-10',
  },
  {
    id: 'doc-bakuchiol-safety-2024',
    workspaceId: 'ws-kalyani-botanicals',
    title: 'Bakuchiol Safety & Photosensitivity Review v3.0 (Draft)',
    filename: 'KB_Bakuchiol_Photosensitivity_Review_Draft.pdf',
    fileType: 'pdf',
    fileSize: '1.2 MB',
    status: 'pending_review',
    approvalTier: 'Internal Lab Draft',
    currentVersion: 'v3.0',
    category: 'Safety & Toxicology',
    summary: 'Preliminary patch tests investigating potential nocturnal preference for 1% Bakuchiol under high UV-A exposure.',
    chunkCount: 1,
    updatedAt: '2024-04-10',
  },
];

export async function GET(req: NextRequest) {
  const workspaceId = req.headers.get('x-workspace-id') || getAuthorizedWorkspaceId();
  let docs: any[] = documentsStore.filter((d) => d.workspaceId === workspaceId);

  const isDb = await isDbConnected();
  if (isDb) {
    try {
      const dbDocs = await getDocumentsDb(workspaceId);
      if (dbDocs && dbDocs.length > 0) {
        docs = dbDocs.map((d: any) => ({
          ...d,
          fileSize: `${((d.fileSizeBytes || 0) / 1024).toFixed(1)} KB`,
          chunkCount: 2,
        }));
      }
    } catch {
      // Graceful fallback to memory store
    }
  }

  const chunks = getWorkspaceChunks(workspaceId);

  return NextResponse.json({
    documents: docs,
    totalDocuments: docs.length,
    totalChunks: chunks.length,
    chunksPreview: chunks.slice(0, 10),
  });
}

export async function POST(req: NextRequest) {
  try {
    const workspaceId = req.headers.get('x-workspace-id') || getAuthorizedWorkspaceId();
    const body = await req.json();
    const { filename, content, approvalTier, category } = body;

    if (!filename || !content) {
      return NextResponse.json({ error: 'Filename and content are required' }, { status: 400 });
    }

    const docId = `doc-user-${Date.now()}`;
    const versionId = `ver-${docId}-1`;

    // 1. Parse & Sanitize text (with prompt injection defense)
    const parsed = await parseDocumentContent(filename, content);

    // 2. Section-aware chunking
    const chunks = chunkParsedDocument(
      parsed,
      docId,
      versionId,
      workspaceId,
      approvalTier || 'Pending Committee Review',
      'v1.0'
    );

    // 3. Generate embeddings & register chunks in active memory
    const chunkEmbeddings: number[][] = [];
    for (const chk of chunks) {
      const embedding = await generateEmbedding(chk.content);
      chunkEmbeddings.push(embedding);
      addUploadedChunk({
        id: chk.id,
        documentId: docId,
        documentTitle: parsed.title,
        workspaceId,
        citationRef: chk.citationRef,
        sectionTitle: chk.sectionTitle,
        pageNumber: chk.pageNumber,
        approvalStatus: approvalTier || 'Pending Committee Review',
        content: chk.content,
        embedding,
        tokenCount: chk.tokenCount,
      });
    }

    const newDoc = {
      id: docId,
      workspaceId,
      title: parsed.title,
      filename,
      fileType: parsed.fileType,
      fileSize: `${(content.length / 1024).toFixed(1)} KB`,
      status: parsed.warnings.length > 0 ? 'flagged_review' : 'approved',
      approvalTier: approvalTier || 'Standard Workspace Upload',
      currentVersion: 'v1.0',
      category: category || 'Brand Material',
      summary: parsed.sections[0]?.content.slice(0, 150) + '...',
      chunkCount: chunks.length,
      updatedAt: new Date().toISOString().split('T')[0],
      warnings: parsed.warnings,
    };

    // Prepend to memory store
    documentsStore.unshift(newDoc);

    // Persist to database if connected
    const isDb = await isDbConnected();
    if (isDb) {
      try {
        await insertDocumentDb({
          id: docId,
          workspaceId,
          title: parsed.title,
          filename,
          fileType: parsed.fileType,
          fileSizeBytes: content.length,
          status: newDoc.status,
          approvalTier: newDoc.approvalTier,
          currentVersion: 'v1.0',
          category: newDoc.category,
          summary: newDoc.summary,
        });

        for (let i = 0; i < chunks.length; i++) {
          const chk = chunks[i];
          await insertDocumentChunkDb({
            id: chk.id,
            documentId: docId,
            versionId,
            workspaceId,
            chunkIndex: i,
            sectionTitle: chk.sectionTitle,
            pageNumber: chk.pageNumber,
            citationRef: chk.citationRef,
            content: chk.content,
            tokenCount: chk.tokenCount,
            embedding: chunkEmbeddings[i],
          });
        }
      } catch (err: any) {
        console.warn('Database persistence failed, retained in memory store:', err?.message || err);
      }
    }

    return NextResponse.json({
      success: true,
      document: newDoc,
      chunksCreated: chunks.length,
      warnings: parsed.warnings,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to ingest document' }, { status: 500 });
  }
}
