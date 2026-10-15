# BrandMemory — Editorial Provenance Platform

BrandMemory is a multi-tenant SaaS platform that enables enterprises to generate reliable, verified AI marketing content grounded directly in their proprietary brand documents, clinical research, and regulatory disclosures.

---

## Architecture & Technology Stack

- **Frontend Framework:** Next.js 14 (App Router) with TypeScript
- **Styling & Aesthetics:** Tailwind CSS configured with the **Editorial Provenance** design system tokens
- **Typography:** Plus Jakarta Sans (headlines and body copy) & JetBrains Mono (citations, claim IDs, metrics)
- **Database Engine:** PostgreSQL with `pgvector` extension and PostgreSQL Full-Text Search (`tsvector`)
- **Retrieval Engine:** Hybrid Search combining dense vector cosine similarity with BM25/FTS keyword scoring via **Reciprocal Rank Fusion (RRF)** ($k=60$)
- **Brand Governance:** Automated prohibited marketing claim detection (AYUSH Rule 170 compliance), prompt injection defenses, and document version conflict resolution

---

## 7 Core Application Routes

| Route | View Name | Purpose |
|---|---|---|
| [`/`](file:///c:/Users/Khushi/Downloads/BrandMemory/app/page.tsx) | **Overview Dashboard** | Workspaces, document ingestion velocity, campaign activity, retrieval quality, recent outputs, multi-tenant indicator. |
| [`/brand-workspace`](file:///c:/Users/Khushi/Downloads/BrandMemory/app/brand-workspace/page.tsx) | **Brand Workspace** | Brand voice guidelines, target audience personas, approved claims library with citation references, prohibited phrases. |
| [`/knowledge-library`](file:///c:/Users/Khushi/Downloads/BrandMemory/app/knowledge-library/page.tsx) | **Knowledge Library** | Multi-format file ingestion (PDF, DOCX, TXT, MD), document versioning, approval status, AYUSH metadata, chunk inspector. |
| [`/content-studio`](file:///c:/Users/Khushi/Downloads/BrandMemory/app/content-studio/page.tsx) | **Content Studio** | Grounded marketing content generator with clickable citations, evidence inspector side drawer, and claim-support verification. |
| [`/retrieval-inspector`](file:///c:/Users/Khushi/Downloads/BrandMemory/app/retrieval-inspector/page.tsx) | **Retrieval Inspector** | 3-column diagnostic matrix comparing Keyword (BM25), Dense Vector (Cosine), and Hybrid RRF with execution latency. |
| [`/evaluation-dashboard`](file:///c:/Users/Khushi/Downloads/BrandMemory/app/evaluation-dashboard/page.tsx) | **Evaluation Dashboard** | Quantitative evaluation tracking Recall@1, Recall@3, Recall@5, MRR, citation correctness, and live benchmark sweeps. |
| [`/conflict-review`](file:///c:/Users/Khushi/Downloads/BrandMemory/app/conflict-review/page.tsx) | **Document Conflict Review** | Side-by-side reconciliation of contradictory document versions with snippet highlighting and human-in-the-loop review actions. |

---

## API Endpoints

- `GET /api/workspaces` — Lists available multi-tenant workspaces and tenant context.
- `GET, POST /api/documents` — Lists documents and ingests multi-format files with section-aware chunking and injection sanitization.
- `POST /api/retrieval` — Runs keyword, dense vector, or hybrid RRF retrieval queries with latency timings.
- `POST /api/generate` — Generates grounded marketing content linked to verified citations with brand integrity validation.
- `GET /api/brand-rules` — Returns brand voice pillars, target audiences, approved claims, and prohibited phrases.
- `GET, POST /api/conflicts` — Returns flagged contradictory document versions and records human sign-off resolutions.
- `GET, POST /api/evaluation` — Returns empirical benchmark results and executes live test runs on golden datasets.

---

## Database Schema & Migrations

The database schema is defined in [`lib/db/schema.sql`](file:///c:/Users/Khushi/Downloads/BrandMemory/lib/db/schema.sql) and migration file [`lib/db/migrations/001_initial_schema.sql`](file:///c:/Users/Khushi/Downloads/BrandMemory/lib/db/migrations/001_initial_schema.sql):

- `workspaces`: Multi-tenant workspace isolation.
- `documents` & `document_versions`: Version-controlled document files with approval tiers.
- `document_chunks`: Section-aware chunks with `tsv` (FTS `tsvector`) and `embedding` (`vector(1536)`).
- `document_conflicts`: Tracked contradictions between document versions for human review.
- `brand_rules`: Configurable brand voice attributes and prohibited claims.
- `generated_contents`: Generated drafts with citation links and groundedness scores.
- `evaluation_runs` & `evaluation_queries`: Golden evaluation dataset with measured Recall and MRR metrics.

---

## Implementation Progress Checklist

### Stage 1: Frontend Architecture
- [x] All 7 screens implemented as real, navigable Next.js App Router routes
- [x] Editorial Provenance visual system with `#FBFBFA` canvas, white card surfaces, charcoal typography, and restrained indigo accents
- [x] Reusable persistent sidebar (`SideNavBar`) and header (`TopNavBar`)
- [x] Multi-tenant workspace switcher supporting *Kalyani Botanicals*, *Vedic Wellness Labs*, and *Aurora Derma*
- [x] Interactive document upload modal supporting PDF, DOCX, TXT, and Markdown files

### Stage 2: Backend and Data Layer
- [x] PostgreSQL schema with `pgvector` and PostgreSQL full-text search (`tsvector` with GIN index)
- [x] Database migration files in `lib/db/migrations/`
- [x] Multi-tenant isolation helper enforcing workspace authorization on all operations
- [x] Environment variable configuration template (`.env.example`)
- [x] Secure server-only API boundaries (secrets never exposed to browser)

### Stage 3: Document Ingestion and RAG
- [x] Multi-format parser with text sanitization and prompt injection defense
- [x] Section-aware chunker preserving document version, approval tier, and page numbers
- [x] Vector embedding generator (normalized 1536-dimensional embeddings with OpenAI API integration and deterministic fallback)
- [x] Reciprocal Rank Fusion (RRF) algorithm combining keyword search and dense vector search
- [x] Grounded generation engine with clickable citation tags (`[KB-REF-01]`, etc.)
- [x] Fallback for insufficient evidence ("Insufficient evidence in approved brand documents")

### Stage 4: Brand Integrity and Conflict Review
- [x] Brand validator checking for prohibited marketing hype (AYUSH Rule 170 compliance)
- [x] Claim matching against approved clinical trial registry
- [x] Document version contradiction detector routing ambiguous discrepancies to human review
- [x] Human review workflow supporting "Affirm Document A", "Condition Usage", and "Supersede"

### Stage 5: Evaluation and Testing
- [x] Repeatable golden evaluation dataset with questions, reference passages, and golden chunk IDs
- [x] Quantitative metrics computation: Recall@1, Recall@3, Recall@5, MRR, Citation Correctness, and Latency
- [x] Comparative benchmark across keyword, vector, and hybrid RRF strategies
- [x] Automated unit test suite passing 100% of tests (`npm test`)

### Stage 6: Build and Quality Assurance
- [x] Next.js production build (`npm run build`) passing with 0 errors
- [x] Full static page generation across all 7 routes and 7 API endpoints
- [x] Documentation and progress checklist complete

---

## Running the Application Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```

3. **Run automated test suite:**
   ```bash
   npm test
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the live platform.
