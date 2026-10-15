import { Pool } from 'pg';

let pool: Pool | null = null;
let isConnectedCache: boolean | null = null;

export function getDbPool(): Pool | null {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres')) {
    if (!pool) {
      const isRemote =
        process.env.NODE_ENV === 'production' ||
        process.env.DATABASE_URL.includes('supabase.co') ||
        process.env.DATABASE_URL.includes('neon.tech');

      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: isRemote ? { rejectUnauthorized: false } : undefined,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 3000,
      });

      pool.on('error', (err) => {
        console.warn('Unexpected error on idle database client', err);
        isConnectedCache = false;
      });
    }
    return pool;
  }
  return null;
}

export async function isDbConnected(): Promise<boolean> {
  const p = getDbPool();
  if (!p) return false;
  if (isConnectedCache !== null) return isConnectedCache;

  try {
    const res = await p.query('SELECT 1');
    isConnectedCache = res.rowCount !== null && res.rowCount > 0;
    return isConnectedCache;
  } catch (err: any) {
    console.warn('Database connection check failed, using fallback in-memory store:', err?.message || err);
    isConnectedCache = false;
    return false;
  }
}

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const p = getDbPool();
  if (p) {
    try {
      const res = await p.query(text, params);
      return res.rows;
    } catch (err: any) {
      console.warn('Database query failed:', err?.message || err);
    }
  }
  return [];
}

/**
 * Persist uploaded document to PostgreSQL database
 */
export async function insertDocumentDb(doc: {
  id: string;
  workspaceId: string;
  title: string;
  filename: string;
  fileType: string;
  fileSizeBytes?: number;
  status: string;
  approvalTier: string;
  currentVersion: string;
  category: string;
  summary: string;
}) {
  const text = `
    INSERT INTO documents (
      id, workspace_id, title, filename, file_type, file_size_bytes, 
      status, approval_tier, current_version, category, summary, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      status = EXCLUDED.status,
      summary = EXCLUDED.summary,
      updated_at = CURRENT_TIMESTAMP
  `;
  await query(text, [
    doc.id,
    doc.workspaceId,
    doc.title,
    doc.filename,
    doc.fileType,
    doc.fileSizeBytes || 0,
    doc.status,
    doc.approvalTier,
    doc.currentVersion,
    doc.category,
    doc.summary,
  ]);
}

/**
 * Fetch documents for workspace from PostgreSQL
 */
export async function getDocumentsDb(workspaceId: string) {
  const text = `
    SELECT 
      id, workspace_id as "workspaceId", title, filename, 
      file_type as "fileType", file_size_bytes as "fileSizeBytes", 
      status, approval_tier as "approvalTier", current_version as "currentVersion", 
      category, summary, updated_at as "updatedAt"
    FROM documents 
    WHERE workspace_id = $1 
    ORDER BY created_at DESC
  `;
  return query(text, [workspaceId]);
}

/**
 * Persist chunk with pgvector embedding
 */
export async function insertDocumentChunkDb(chunk: {
  id: string;
  documentId: string;
  versionId?: string;
  workspaceId: string;
  chunkIndex?: number;
  sectionTitle?: string;
  pageNumber?: number;
  citationRef?: string;
  content: string;
  tokenCount?: number;
  embedding: number[];
}) {
  const embeddingString = `[${chunk.embedding.join(',')}]`;
  const text = `
    INSERT INTO document_chunks (
      id, document_id, version_id, workspace_id, chunk_index, 
      section_title, page_number, citation_ref, content, token_count, embedding
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::vector)
    ON CONFLICT (id) DO UPDATE SET
      content = EXCLUDED.content,
      embedding = EXCLUDED.embedding
  `;
  await query(text, [
    chunk.id,
    chunk.documentId,
    chunk.versionId || `ver-${chunk.documentId}-1`,
    chunk.workspaceId,
    chunk.chunkIndex || 0,
    chunk.sectionTitle || 'General Section',
    chunk.pageNumber || 1,
    chunk.citationRef || `REF-${chunk.id.slice(-4)}`,
    chunk.content,
    chunk.tokenCount || 0,
    embeddingString,
  ]);
}

/**
 * Execute vector cosine search directly in PostgreSQL with pgvector
 */
export async function searchDenseDb(
  workspaceId: string,
  queryEmbedding: number[],
  limit = 5
) {
  const embeddingString = `[${queryEmbedding.join(',')}]`;
  const text = `
    SELECT 
      id, document_id as "documentId", workspace_id as "workspaceId",
      citation_ref as "citationRef", section_title as "sectionTitle",
      page_number as "pageNumber", content, token_count as "tokenCount",
      1 - (embedding <=> $2::vector) as score
    FROM document_chunks
    WHERE workspace_id = $1
    ORDER BY embedding <=> $2::vector ASC
    LIMIT $3
  `;
  return query(text, [workspaceId, embeddingString, limit]);
}
