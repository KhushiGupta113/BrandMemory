import test from 'node:test';
import assert from 'node:assert/strict';
import { generateDeterministicEmbedding, cosineSimilarity } from '../lib/rag/embeddings';
import { reciprocalRankFusion } from '../lib/rag/rrf';
import { searchKeyword, searchDense, searchHybrid } from '../lib/rag/engine';

test('Embedding generation produces normalized 1536-dim vector', () => {
  const vec = generateDeterministicEmbedding('1% Bakuchiol clinical trial');
  assert.equal(vec.length, 1536);

  // Check unit length norm
  let sumSq = 0;
  for (let i = 0; i < vec.length; i++) {
    sumSq += vec[i] * vec[i];
  }
  const norm = Math.sqrt(sumSq);
  assert.ok(Math.abs(norm - 1.0) < 0.01, `Expected norm ~1.0, got ${norm}`);
});

test('Cosine similarity matches identical and semantically close text', () => {
  const vec1 = generateDeterministicEmbedding('Bakuchiol retinol anti-aging wrinkle reduction');
  const vec2 = generateDeterministicEmbedding('Bakuchiol retinol anti-aging wrinkle reduction');
  const vec3 = generateDeterministicEmbedding('Industrial hydraulic pump valve pressure gauge');

  const simIdentical = cosineSimilarity(vec1, vec2);
  const simDistant = cosineSimilarity(vec1, vec3);

  assert.ok(simIdentical > 0.99, 'Identical vectors must have ~1.0 cosine similarity');
  assert.ok(simIdentical > simDistant, 'Semantic text must score higher than irrelevant text');
});

test('Reciprocal Rank Fusion correctly fuses and ranks candidates', () => {
  const kwResults = [
    { id: 'chunk-1', score: 0.9, rank: 1, chunk: { title: 'Doc 1' } },
    { id: 'chunk-2', score: 0.7, rank: 2, chunk: { title: 'Doc 2' } },
  ];

  const vecResults = [
    { id: 'chunk-2', score: 0.95, rank: 1, chunk: { title: 'Doc 2' } },
    { id: 'chunk-3', score: 0.6, rank: 2, chunk: { title: 'Doc 3' } },
  ];

  const fused = reciprocalRankFusion(kwResults, vecResults, 60);

  assert.equal(fused.length, 3);
  assert.equal(fused[0].id, 'chunk-2', 'Fused candidate present in both top ranks should be #1');
  assert.ok(fused[0].rrfScore > fused[1].rrfScore);
});

test('Multi-tenant isolation strictly filters chunks by workspace', async () => {
  const resKalyani = await searchHybrid('Bakuchiol', 'ws-kalyani-botanicals', 5);
  const resIsolated = await searchHybrid('Bakuchiol', 'ws-other-tenant', 5);

  assert.ok(resKalyani.length > 0, 'Kalyani Botanicals should retrieve ground truth chunks');
  assert.equal(resIsolated.length, 0, 'Isolated tenant should NOT receive Kalyani Botanicals chunks');
});
