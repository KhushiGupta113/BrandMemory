-- ====================================================================
-- BrandMemory: Full PostgreSQL Schema with pgvector & Full-Text Search
-- Multi-tenant isolation enforced at table level via workspace_id
-- ====================================================================

-- Enable necessary PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Workspaces (Tenants)
CREATE TABLE IF NOT EXISTS workspaces (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(128) UNIQUE NOT NULL,
    description TEXT,
    industry VARCHAR(128) DEFAULT 'Wellness & Clinical Formulations',
    logo_initials VARCHAR(4) DEFAULT 'KB',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users and Workspace Members (Multi-Tenant RBAC)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(512),
    role VARCHAR(32) DEFAULT 'member', -- 'admin', 'scientist', 'editor', 'viewer'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workspace_members (
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(32) DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (workspace_id, user_id)
);

-- 3. Brand Rules & Voice Governance
CREATE TABLE IF NOT EXISTS brand_rules (
    id VARCHAR(64) PRIMARY KEY,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'brand_voice', 'target_audience', 'approved_claim', 'prohibited_phrase', 'regulatory_rule'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(32) DEFAULT 'standard', -- 'strict', 'warning', 'info'
    rule_payload JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(32) DEFAULT 'active', -- 'active', 'draft', 'archived'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_brand_rules_workspace ON brand_rules(workspace_id, category);

-- 4. Documents
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(64) PRIMARY KEY,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(32) NOT NULL, -- 'pdf', 'docx', 'txt', 'markdown'
    file_size_bytes BIGINT DEFAULT 0,
    status VARCHAR(32) DEFAULT 'approved', -- 'approved', 'pending_review', 'conflict_detected', 'deprecated'
    approval_tier VARCHAR(64) DEFAULT 'AYUSH Certified',
    current_version VARCHAR(32) DEFAULT 'v1.0',
    category VARCHAR(64) DEFAULT 'Clinical Trial',
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_documents_workspace ON documents(workspace_id, status);

-- 5. Document Versions
CREATE TABLE IF NOT EXISTS document_versions (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    version_number VARCHAR(32) NOT NULL,
    checksum VARCHAR(128),
    raw_text TEXT NOT NULL,
    approval_status VARCHAR(32) DEFAULT 'approved',
    effective_date DATE DEFAULT CURRENT_DATE,
    created_by VARCHAR(64),
    change_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_doc_versions ON document_versions(workspace_id, document_id);

-- 6. Document Chunks (Section-Aware + pgvector Embeddings + FTS)
CREATE TABLE IF NOT EXISTS document_chunks (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
    version_id VARCHAR(64) REFERENCES document_versions(id) ON DELETE CASCADE NOT NULL,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    chunk_index INT NOT NULL,
    section_title VARCHAR(255),
    page_number INT,
    citation_ref VARCHAR(64), -- e.g., 'KB-REF-04', 'AYUSH-2024-SEC3'
    content TEXT NOT NULL,
    token_count INT DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    -- Full-text search tsvector
    tsv TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', content || ' ' || COALESCE(section_title, ''))) STORED,
    -- Vector embedding (1536 dimensions for standard embedding models)
    embedding VECTOR(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-speed multi-tenant retrieval
CREATE INDEX IF NOT EXISTS idx_chunks_workspace ON document_chunks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_chunks_tsv ON document_chunks USING GIN(tsv);
-- HNSW / IVFFLAT vector index
CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 7. Document Conflicts (Discrepancy Detection & Human-in-the-Loop Review)
CREATE TABLE IF NOT EXISTS document_conflicts (
    id VARCHAR(64) PRIMARY KEY,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    document_a_id VARCHAR(64) REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
    document_b_id VARCHAR(64) REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
    chunk_a_id VARCHAR(64) REFERENCES document_chunks(id),
    chunk_b_id VARCHAR(64) REFERENCES document_chunks(id),
    conflict_type VARCHAR(64) NOT NULL, -- 'dosage_inconsistency', 'contraindication_conflict', 'claim_superceded'
    severity VARCHAR(32) DEFAULT 'high', -- 'critical', 'high', 'moderate', 'low'
    description TEXT NOT NULL,
    snippet_a TEXT NOT NULL,
    snippet_b TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'pending_review', -- 'pending_review', 'resolved_keep_a', 'resolved_keep_b', 'dismissed'
    resolution_notes TEXT,
    resolved_by VARCHAR(64),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_conflicts_workspace ON document_conflicts(workspace_id, status);

-- 8. Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(64) PRIMARY KEY,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    objective TEXT,
    target_audience VARCHAR(128),
    status VARCHAR(32) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Generated Content Studio Records
CREATE TABLE IF NOT EXISTS generated_contents (
    id VARCHAR(64) PRIMARY KEY,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    campaign_id VARCHAR(64) REFERENCES campaigns(id),
    title VARCHAR(255) NOT NULL,
    prompt TEXT NOT NULL,
    generated_text TEXT NOT NULL,
    channel VARCHAR(64) DEFAULT 'E-Commerce PDP',
    groundedness_score NUMERIC(5, 2) DEFAULT 94.50, -- Percentage
    claim_support_status VARCHAR(32) DEFAULT 'verified', -- 'verified', 'flagged_unsupported', 'partial'
    citations JSONB DEFAULT '[]'::jsonb, -- Array of { chunkId, citationRef, excerpt, page, confidence }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_generated_contents_workspace ON generated_contents(workspace_id);

-- 10. Evaluation Datasets & Benchmark Runs
CREATE TABLE IF NOT EXISTS evaluation_queries (
    id VARCHAR(64) PRIMARY KEY,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    query_text TEXT NOT NULL,
    category VARCHAR(64) DEFAULT 'Clinical Efficacy',
    golden_chunk_ids TEXT[] DEFAULT '{}',
    reference_answer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evaluation_runs (
    id VARCHAR(64) PRIMARY KEY,
    workspace_id VARCHAR(64) REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    retrieval_strategy VARCHAR(32) NOT NULL, -- 'keyword', 'dense_vector', 'hybrid_rrf'
    recall_at_1 NUMERIC(5, 4),
    recall_at_3 NUMERIC(5, 4),
    recall_at_5 NUMERIC(5, 4),
    mrr NUMERIC(5, 4),
    citation_correctness NUMERIC(5, 4),
    groundedness NUMERIC(5, 4),
    avg_latency_ms NUMERIC(8, 2),
    total_queries INT DEFAULT 0,
    is_benchmark_demo BOOLEAN DEFAULT FALSE,
    run_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_eval_runs_workspace ON evaluation_runs(workspace_id, retrieval_strategy);
