import { ParsedDocument } from './parser';

export interface DocumentChunkRecord {
  id: string;
  documentId: string;
  versionId: string;
  workspaceId: string;
  chunkIndex: number;
  sectionTitle: string;
  pageNumber: number;
  citationRef: string;
  content: string;
  tokenCount: number;
  metadata: {
    filename: string;
    approvalTier: string;
    version: string;
    effectiveDate: string;
  };
}

export function chunkParsedDocument(
  parsed: ParsedDocument,
  documentId: string,
  versionId: string,
  workspaceId: string,
  approvalTier: string = 'AYUSH Certified',
  version: string = 'v1.0'
): DocumentChunkRecord[] {
  const chunks: DocumentChunkRecord[] = [];
  let chunkGlobalIndex = 1;

  for (const sec of parsed.sections) {
    const paragraphs = sec.content.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

    let currentChunkText = '';
    let currentTokens = 0;

    for (const p of paragraphs) {
      const estimatedWords = p.split(/\s+/).length;
      const estimatedTokens = Math.ceil(estimatedWords * 1.3);

      if (currentTokens + estimatedTokens > 350 && currentChunkText.length > 0) {
        const citationNum = String(chunkGlobalIndex).padStart(2, '0');
        chunks.push({
          id: `chk-${documentId}-${chunkGlobalIndex}`,
          documentId,
          versionId,
          workspaceId,
          chunkIndex: chunkGlobalIndex,
          sectionTitle: sec.title,
          pageNumber: sec.pageEstimate || 1,
          citationRef: `KB-REF-${citationNum}`,
          content: currentChunkText.trim(),
          tokenCount: currentTokens,
          metadata: {
            filename: parsed.filename,
            approvalTier,
            version,
            effectiveDate: new Date().toISOString().split('T')[0],
          },
        });

        chunkGlobalIndex++;
        currentChunkText = p;
        currentTokens = estimatedTokens;
      } else {
        currentChunkText += (currentChunkText ? '\n\n' : '') + p;
        currentTokens += estimatedTokens;
      }
    }

    if (currentChunkText.trim().length > 0) {
      const citationNum = String(chunkGlobalIndex).padStart(2, '0');
      chunks.push({
        id: `chk-${documentId}-${chunkGlobalIndex}`,
        documentId,
        versionId,
        workspaceId,
        chunkIndex: chunkGlobalIndex,
        sectionTitle: sec.title,
        pageNumber: sec.pageEstimate || 1,
        citationRef: `KB-REF-${citationNum}`,
        content: currentChunkText.trim(),
        tokenCount: currentTokens,
        metadata: {
          filename: parsed.filename,
          approvalTier,
          version,
          effectiveDate: new Date().toISOString().split('T')[0],
        },
      });
      chunkGlobalIndex++;
    }
  }

  return chunks;
}
