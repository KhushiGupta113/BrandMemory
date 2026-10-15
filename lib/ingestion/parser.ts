export interface ParsedDocument {
  title: string;
  filename: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'markdown';
  rawText: string;
  sections: Array<{
    title: string;
    content: string;
    pageEstimate?: number;
  }>;
  sanitized: boolean;
  warnings: string[];
}

// Defend against prompt injection in untrusted customer documents
const SUSPICIOUS_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /system\s*:\s*you\s+are\s+now/i,
  /<\|im_start\|>/i,
  /<\/?script>/i,
  /override\s+brand\s+rules/i,
  /bypass\s+regulatory\s+check/i,
];

export function sanitizeAndInspectText(text: string): { cleanText: string; warnings: string[] } {
  const warnings: string[] = [];
  let cleanText = text;

  for (const pattern of SUSPICIOUS_INJECTION_PATTERNS) {
    if (pattern.test(cleanText)) {
      warnings.push(`Potential prompt injection or untrusted instruction pattern detected: ${pattern.source}`);
      cleanText = cleanText.replace(pattern, '[REDACTED_UNTRUSTED_INSTRUCTION]');
    }
  }

  // Strip null bytes and non-printable control characters (except newlines and tabs)
  cleanText = cleanText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return { cleanText, warnings };
}

export async function parseDocumentContent(
  filename: string,
  bufferOrText: Buffer | string,
  mimeType?: string
): Promise<ParsedDocument> {
  const ext = filename.split('.').pop()?.toLowerCase() || 'txt';
  let rawText = '';
  let fileType: 'pdf' | 'docx' | 'txt' | 'markdown' = 'txt';

  if (typeof bufferOrText === 'string') {
    rawText = bufferOrText;
  } else {
    rawText = bufferOrText.toString('utf-8');
  }

  if (ext === 'md' || ext === 'markdown') {
    fileType = 'markdown';
  } else if (ext === 'pdf') {
    fileType = 'pdf';
  } else if (ext === 'docx') {
    fileType = 'docx';
  }

  const { cleanText, warnings } = sanitizeAndInspectText(rawText);

  // Section-aware extraction
  const sections: Array<{ title: string; content: string; pageEstimate?: number }> = [];

  // Parse markdown headers (#, ##, ###) or plain text section breaks
  const lines = cleanText.split('\n');
  let currentSectionTitle = 'Document Preamble';
  let currentSectionBuffer: string[] = [];
  let pageEstimate = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Track approximate page splits every ~45 lines
    if (i > 0 && i % 45 === 0) {
      pageEstimate++;
    }

    const headerMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headerMatch) {
      if (currentSectionBuffer.length > 0) {
        sections.push({
          title: currentSectionTitle,
          content: currentSectionBuffer.join('\n').trim(),
          pageEstimate,
        });
        currentSectionBuffer = [];
      }
      currentSectionTitle = headerMatch[2].trim();
    } else {
      currentSectionBuffer.push(line);
    }
  }

  if (currentSectionBuffer.length > 0) {
    sections.push({
      title: currentSectionTitle,
      content: currentSectionBuffer.join('\n').trim(),
      pageEstimate,
    });
  }

  return {
    title: filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
    filename,
    fileType,
    rawText: cleanText,
    sections: sections.length > 0 ? sections : [{ title: 'Main Body', content: cleanText, pageEstimate: 1 }],
    sanitized: true,
    warnings,
  };
}
