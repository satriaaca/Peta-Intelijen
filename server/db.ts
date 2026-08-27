import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 8000,
});

let dbInitPromise: Promise<void> | null = null;

/**
 * Inisialisasi Skema Tabel PostgreSQL dan Seed Data Otomatis di Neon (Thread-safe & Serverless-safe)
 */
export async function initializeDatabase() {
  if (dbInitPromise) {
    return dbInitPromise;
  }

  dbInitPromise = (async () => {
    let client;
    try {
      client = await pool.connect();
      console.log("[PostgreSQL] Checking database connection and schemas...");

      // 1. Table email_whitelist
      await client.query(`
        CREATE TABLE IF NOT EXISTS email_whitelist (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL,
          unit VARCHAR(255) NOT NULL DEFAULT 'Seksi Intelijen Kejaksaan Negeri Tabanan',
          nip VARCHAR(50),
          note TEXT,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Whitelist seed
      await client.query(`
        INSERT INTO email_whitelist (email, name, role, unit, nip, note, is_active)
        VALUES 
        ('hijau.kn.tabanan@gmail.com', 'Kasi Intelijen Kejari Tabanan', 'Kasi Intelijen', 'Seksi Intelijen Kejaksaan Negeri Tabanan', '19820514 200703 1 002', 'Akun Pejabat Kasi Intelijen', true),
        ('ikadek.satriawan@gmail.com', 'I Kadek Satriawan, S.H.', 'Administrator', 'Administrator Sistem Intelijen Kejari Tabanan', '19820514 200703 1 001', 'Akun Administrator Sistem', true)
        ON CONFLICT (email) DO UPDATE 
        SET role = EXCLUDED.role, name = EXCLUDED.name, is_active = EXCLUDED.is_active;
      `);

      // 2. Table intelligence_entries (D.IN.1 s/d D.IN.7 5W+1H)
      await client.query(`
        CREATE TABLE IF NOT EXISTS intelligence_entries (
          id VARCHAR(100) PRIMARY KEY,
          no_register VARCHAR(150) NOT NULL,
          section_id VARCHAR(20) NOT NULL,
          sektor_symbol VARCHAR(20) NOT NULL,
          keterangan VARCHAR(255) NOT NULL,
          narrative TEXT NOT NULL,
          event_date DATE NOT NULL,
          report_date DATE,
          location TEXT NOT NULL,
          kecamatan VARCHAR(100) NOT NULL,
          latitude DOUBLE PRECISION,
          longitude DOUBLE PRECISION,
          classification VARCHAR(30) DEFAULT 'TERBATAS',
          officer_name VARCHAR(255),
          source_confidence VARCHAR(10) DEFAULT 'A1',
          status VARCHAR(50) DEFAULT 'SELESAI',
          gdrive_file_id VARCHAR(255),
          gdrive_file_url TEXT,
          photo_caption TEXT,
          photos JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        ALTER TABLE intelligence_entries ADD COLUMN IF NOT EXISTS photos JSONB;
        ALTER TABLE intelligence_entries ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
        ALTER TABLE intelligence_entries ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
        CREATE INDEX IF NOT EXISTS idx_intel_section ON intelligence_entries(section_id);
        CREATE INDEX IF NOT EXISTS idx_intel_date ON intelligence_entries(event_date DESC);
      `);

      // 3. Table outreach_entries (JMS, Penerangan Hukum, Luhkum, Jaksa Menyapa)
      await client.query(`
        CREATE TABLE IF NOT EXISTS outreach_entries (
          id VARCHAR(100) PRIMARY KEY,
          no_kegiatan VARCHAR(150) NOT NULL,
          triwulan SMALLINT NOT NULL,
          jenis_kegiatan VARCHAR(100) NOT NULL,
          tema_kegiatan TEXT NOT NULL,
          waktu DATE NOT NULL,
          tempat VARCHAR(255) NOT NULL,
          kecamatan VARCHAR(100) NOT NULL,
          jumlah_peserta INTEGER DEFAULT 0,
          target_peserta INTEGER DEFAULT 0,
          narasumber VARCHAR(255),
          materi_pokok TEXT,
          latitude DOUBLE PRECISION,
          longitude DOUBLE PRECISION,
          status VARCHAR(50) DEFAULT 'TERLAKSANA',
          gdrive_file_id VARCHAR(255),
          gdrive_file_url TEXT,
          photo_caption TEXT,
          photos JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        ALTER TABLE outreach_entries ADD COLUMN IF NOT EXISTS photos JSONB;
        CREATE INDEX IF NOT EXISTS idx_outreach_triwulan ON outreach_entries(triwulan);
        CREATE INDEX IF NOT EXISTS idx_outreach_waktu ON outreach_entries(waktu DESC);
      `);

      // 4. Table case_statistics (Statistik Perkara Yustisial)
      await client.query(`
        CREATE TABLE IF NOT EXISTS case_statistics (
          id VARCHAR(100) PRIMARY KEY,
          category VARCHAR(100) NOT NULL,
          year INTEGER NOT NULL,
          lid_spdp INTEGER DEFAULT 0,
          dik_kejaksaan INTEGER DEFAULT 0,
          dik_kepolisian INTEGER DEFAULT 0,
          tut INTEGER DEFAULT 0,
          notes TEXT,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_case_stats_year ON case_statistics(year);
        CREATE INDEX IF NOT EXISTS idx_case_stats_cat ON case_statistics(category);
      `);

      // 5. Table annual_targets (Target & Realisasi Kinerja Tahunan Intelijen / Penkum)
      await client.query(`
        CREATE TABLE IF NOT EXISTS annual_targets (
          id VARCHAR(100) PRIMARY KEY,
          program VARCHAR(150) NOT NULL,
          category VARCHAR(100) NOT NULL,
          year INTEGER NOT NULL,
          target_tahunan INTEGER NOT NULL DEFAULT 0,
          realisasi_tahunan INTEGER NOT NULL DEFAULT 0,
          satuan VARCHAR(50) NOT NULL DEFAULT 'Kegiatan',
          keterangan TEXT,
          updated_at BIGINT
        );
        CREATE INDEX IF NOT EXISTS idx_annual_targets_year ON annual_targets(year);
      `);

      console.log("[PostgreSQL] Database connection verified & schema check passed.");
    } catch (err: any) {
      console.error("[PostgreSQL] Database init notice:", err.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  })();

  return dbInitPromise;
}
