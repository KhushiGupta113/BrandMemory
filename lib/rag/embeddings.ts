export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  const provider = process.env.EMBEDDING_PROVIDER || 'demo';

  if (apiKey && provider === 'openai') {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
          input: text.slice(0, 8000),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.data[0].embedding;
      } else {
        const err = await response.text();
        console.warn(`OpenAI embedding failed (${response.status}): ${err}`);
      }
    } catch (err: any) {
      console.warn('OpenAI embedding network error:', err?.message || err);
      // Fall through to deterministic generator if API fails or is offline
    }
  }

  // Deterministic 1536-dimension normalized embedding fallback
  return generateDeterministicEmbedding(text, 1536);
}

// Generate normalized deterministic pseudo-semantic vector based on n-grams and vocabulary hashing
export function generateDeterministicEmbedding(text: string, dimensions = 1536): number[] {
  const vec = new Float64Array(dimensions);
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 0;
    for (let c = 0; c < word.length; c++) {
      hash = (hash << 5) - hash + word.charCodeAt(c);
      hash |= 0;
    }

    const pos = Math.abs(hash) % dimensions;
    const weight = 1.0 + (word.length > 5 ? 0.5 : 0.0);
    vec[pos] += weight;

    // Bigram semantic dispersion
    if (i > 0) {
      const bigram = `${words[i - 1]}_${word}`;
      let bHash = 0;
      for (let bc = 0; bc < bigram.length; bc++) {
        bHash = (bHash << 5) - bHash + bigram.charCodeAt(bc);
        bHash |= 0;
      }
      const bPos = Math.abs(bHash) % dimensions;
      vec[bPos] += 1.5;
    }
  }

  // L2 normalization (Euclidean norm)
  let sumSq = 0;
  for (let d = 0; d < dimensions; d++) {
    sumSq += vec[d] * vec[d];
  }

  const norm = Math.sqrt(sumSq) || 1.0;
  const result: number[] = new Array(dimensions);
  for (let d = 0; d < dimensions; d++) {
    result[d] = Number((vec[d] / norm).toFixed(6));
  }

  return result;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}
