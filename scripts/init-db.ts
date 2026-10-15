import { loadEnvConfig } from '@next/env';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local, .env, etc.
loadEnvConfig(process.cwd());

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not defined in environment.');
    process.exit(1);
  }

  const isRemote =
    connectionString.includes('supabase.co') ||
    connectionString.includes('neon.tech') ||
    process.env.NODE_ENV === 'production';

  console.log('Connecting to PostgreSQL database...');
  const pool = new Pool({
    connectionString,
    ssl: isRemote ? { rejectUnauthorized: false } : undefined,
  });

  try {
    const client = await pool.connect();
    console.log('Successfully connected to database.');

    const schemaPath = path.join(process.cwd(), 'lib', 'db', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('Executing schema definition from lib/db/schema.sql...');
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(sql);
      console.log('Schema tables, extensions, and indices initialized successfully.');

      console.log('Seeding initial workspaces and documents...');
      await client.query(`
        INSERT INTO workspaces (id, name, slug, description, industry, logo_initials) VALUES
        ('ws-kalyani-botanicals', 'Kalyani Botanicals', 'kalyani-botanicals', 'Ayurvedic Clinical Formulations & Skin Science', 'Ayurvedic Clinical Formulations & Skin Science', 'KB'),
        ('ws-vedic-wellness', 'Vedic Wellness Labs', 'vedic-wellness', 'Nutraceuticals & Dietary Adaptogens', 'Nutraceuticals & Dietary Adaptogens', 'VW'),
        ('ws-aurora-derma', 'Aurora Derma Technologies', 'aurora-derma', 'Biotech Dermaceuticals', 'Biotech Dermaceuticals', 'AD')
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO documents (id, workspace_id, title, filename, file_type, file_size_bytes, status, approval_tier, current_version, category, summary) VALUES
        ('doc-bakuchiol-clinical-2023', 'ws-kalyani-botanicals', 'Bakuchiol Clinical Monograph v2.1', 'KB_Bakuchiol_Clinical_Monograph_v2.1.pdf', 'pdf', 2516582, 'approved', 'AYUSH Certified & Double-Blind Trial', 'v2.1', 'Clinical Trial', '8-week double blind clinical trial testing 1% Bakuchiol vs 0.5% Retinol in periorbital wrinkle reduction and epidermal safety.'),
        ('doc-kumkumadi-dosing', 'ws-kalyani-botanicals', 'Kumkumadi Oil Traditional Pharmacopeia', 'Kumkumadi_Tailam_Ayurvedic_Pharmacopeia.docx', 'docx', 1887436, 'approved', 'Classical Ayurvedic Formulary', 'v1.4', 'Pharmacopeia', 'Traditional Ayurvedic formulation protocols, Kashmiri saffron extraction ratios, and epidermal spectrophotometry metrics.'),
        ('doc-centella-monograph', 'ws-kalyani-botanicals', 'Gotu Kola (Centella Asiatica) Bioactive Study', 'Centella_Asiatica_Collagen_Assay.pdf', 'pdf', 3250585, 'approved', 'In-Vitro Peer Reviewed', 'v1.0', 'Ingredient Science', 'Measurement of Asiaticoside and Madecassoside on Type I pro-collagen mRNA expression and barrier restoration.')
        ON CONFLICT (id) DO NOTHING;
      `);
      console.log('Default workspaces and documents seeded.');
    }

    client.release();
    await pool.end();
    console.log('Database initialization complete!');
  } catch (err: any) {
    console.error('Database migration failed:', err.message);
    process.exit(1);
  }
}

main();
