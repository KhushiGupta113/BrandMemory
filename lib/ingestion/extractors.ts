/**
 * File content extraction and cleaning helpers
 */

export interface ExtractedDocument {
  text: string;
  metadata: {
    pageCount?: number;
    charCount: number;
    detectedType: string;
  };
}

/**
 * Extracts and cleans text from various file formats
 */
export async function extractTextFromFile(
  filename: string,
  bufferOrText: Buffer | string
): Promise<ExtractedDocument> {
  const ext = filename.split('.').pop()?.toLowerCase() || 'txt';
  const rawText = typeof bufferOrText === 'string' ? bufferOrText : bufferOrText.toString('utf8');

  // Strip non-printable control characters while preserving structure
  const sanitized = rawText
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();

  return {
    text: sanitized,
    metadata: {
      charCount: sanitized.length,
      detectedType: ext,
      pageCount: Math.max(1, Math.ceil(sanitized.length / 2500)), // Approximate ~2500 chars per page
    },
  };
}
