export interface RankedItem {
  id: string;
  score: number;
  rank: number;
  chunk: any;
}

export interface FusedResult {
  id: string;
  rrfScore: number;
  keywordRank?: number;
  vectorRank?: number;
  keywordScore?: number;
  vectorScore?: number;
  chunk: any;
}

/**
 * Reciprocal Rank Fusion (RRF)
 * Standard information retrieval fusion algorithm combining ranked lists
 * @param keywordResults Ranked list from BM25 / PostgreSQL full-text search
 * @param vectorResults Ranked list from dense vector cosine similarity
 * @param k Constant smoothing parameter (typically 60)
 */
export function reciprocalRankFusion(
  keywordResults: RankedItem[],
  vectorResults: RankedItem[],
  k: number = 60
): FusedResult[] {
  const scoreMap = new Map<string, FusedResult>();

  // Process Keyword Search Rankings
  keywordResults.forEach((item, index) => {
    const rank = index + 1;
    const rrfContribution = 1 / (k + rank);

    scoreMap.set(item.id, {
      id: item.id,
      rrfScore: rrfContribution,
      keywordRank: rank,
      keywordScore: item.score,
      chunk: item.chunk,
    });
  });

  // Process Dense Vector Rankings
  vectorResults.forEach((item, index) => {
    const rank = index + 1;
    const rrfContribution = 1 / (k + rank);

    const existing = scoreMap.get(item.id);
    if (existing) {
      existing.rrfScore += rrfContribution;
      existing.vectorRank = rank;
      existing.vectorScore = item.score;
    } else {
      scoreMap.set(item.id, {
        id: item.id,
        rrfScore: rrfContribution,
        vectorRank: rank,
        vectorScore: item.score,
        chunk: item.chunk,
      });
    }
  });

  // Sort descending by combined RRF score
  const sorted = Array.from(scoreMap.values()).sort((a, b) => b.rrfScore - a.rrfScore);

  return sorted;
}
