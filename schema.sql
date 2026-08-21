-- =========================================================================
-- SKEMA DATABASE POSTGRESQL (NEON TECH / CLOUD POSTGRES)
-- APLIKASI PAPAN PETA INTELIJEN YUSTISIAL (SIADIBIBAM)
-- KEJAKSAAN NEGERI TABANAN - SEKSI INTELIJEN
-- =========================================================================

-- Enable UUID extension jika diperlukan
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. TABEL PENGGUNA & WHITELIST PETUGAS (app_users / email_whitelist)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS email_whitelist (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Kasi Intelijen', 'Jaksa Fungsional Intelijen', 'Staf Intelijen', 'Administrator')),
    unit VARCHAR(255) NOT NULL DEFAULT 'Seksi Intelijen Kejaksaan Negeri Tabanan',
    nip VARCHAR(50),
    note TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data Awal Whitelist Resmi
INSERT INTO email_whitelist (email, name, role, unit, nip, note, is_active)
VALUES 
('hijau.kn.tabanan@gmail.com', 'Kasi Intelijen Kejari Tabanan', 'Kasi Intelijen', 'Seksi Intelijen Kejaksaan Negeri Tabanan', '19820514 200703 1 002', 'Akun Pejabat Kasi Intelijen', true),
('ikadek.satriawan@gmail.com', 'I Kadek Satriawan, S.H.', 'Administrator', 'Administrator Sistem Intelijen Kejari Tabanan', '19820514 200703 1 001', 'Akun Administrator Sistem', true)
ON CONFLICT (email) DO UPDATE 
SET role = EXCLUDED.role, name = EXCLUDED.name, is_active = EXCLUDED.is_active;

-- -------------------------------------------------------------------------
-- 2. TABEL LAPORAN DATA INTELIJEN YUSTISIAL 5W+1H (intelligence_entries)
-- Mencakup Sektor D.IN.1 s/d D.IN.7 (Ipolhankam, Sosbudkem, Ekokeu, PPS, TI, Penkum)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS intelligence_entries (
    id VARCHAR(100) PRIMARY KEY,
    no_register VARCHAR(150) NOT NULL, -- e.g. "REG-01/D.IN.1/TAB/2026"
    section_id VARCHAR(20) NOT NULL CHECK (section_id IN ('D.IN.1', 'D.IN.3', 'D.IN.4', 'D.IN.5', 'D.IN.6', 'D.IN.7')),
    sektor_symbol VARCHAR(20) NOT NULL, -- PO, KT, OR, PK, SP, PS, CP, dll
    keterangan VARCHAR(255) NOT NULL, -- Kategori spesifik
    narrative TEXT NOT NULL, -- Narasi Formulasi 5W+1H
    event_date DATE NOT NULL, -- Tanggal peristiwa/kejadian
    report_date DATE, -- Tanggal laporan intelijen
    location TEXT NOT NULL, -- Lokasi spesifik
    kecamatan VARCHAR(100) NOT NULL, -- Kecamatan di Kab. Tabanan
    classification VARCHAR(30) DEFAULT 'TERBATAS' CHECK (classification IN ('RAHASIA', 'TERBATAS', 'BIASA')),
    officer_name VARCHAR(255), -- Nama Jaksa / Petugas Pelapor
    source_confidence VARCHAR(10) DEFAULT 'A1' CHECK (source_confidence IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1')),
    status VARCHAR(50) DEFAULT 'SELESAI' CHECK (status IN ('SELESAI', 'DALAM_PEMANTAUAN', 'TINDAK_LANJUT')),
    
    -- Penyimpanan Media & Google Drive
    gdrive_file_id VARCHAR(255), -- Google Drive File ID unik (misal: 1a2b3c4d...)
    gdrive_file_url TEXT, -- Link view / embed Google Drive
    photo_caption TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_intel_section ON intelligence_entries(section_id);
CREATE INDEX IF NOT EXISTS idx_intel_kecamatan ON intelligence_entries(kecamatan);
CREATE INDEX IF NOT EXISTS idx_intel_date ON intelligence_entries(event_date DESC);

-- -------------------------------------------------------------------------
-- 3. TABEL KEGIATAN PENYULUHAN & PENERANGAN HUKUM (outreach_entries)
-- Termasuk Jaksa Masuk Sekolah (JMS), Jaksa Menyapa, Penyuluhan Hukum, Penerangan Hukum
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS outreach_entries (
    id VARCHAR(100) PRIMARY KEY,
    no_kegiatan VARCHAR(150) NOT NULL, -- e.g. "JMS/01/TRI-I/2026"
    triwulan SMALLINT NOT NULL CHECK (triwulan IN (1, 2, 3, 4)),
    jenis_kegiatan VARCHAR(100) NOT NULL CHECK (jenis_kegiatan IN (
        'Penyuluhan Hukum', 
        'Penerangan Hukum', 
        'Jaksa Masuk Sekolah (JMS)', 
        'Jaksa Menyapa'
    )),
    tema_kegiatan TEXT NOT NULL,
    waktu DATE NOT NULL,
    tempat VARCHAR(255) NOT NULL, -- e.g. "SMAN 1 Tabanan"
    kecamatan VARCHAR(100) NOT NULL,
    jumlah_peserta INTEGER DEFAULT 0,
    target_peserta INTEGER DEFAULT 0,
    narasumber VARCHAR(255),
    materi_pokok TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status VARCHAR(50) DEFAULT 'TERLAKSANA' CHECK (status IN ('TERLAKSANA', 'TERJADWAL', 'DITUNDA')),
    
    -- Penyimpanan Dokumentasi Foto & Google Drive
    gdrive_file_id VARCHAR(255), -- Google Drive ID file dokumentasi
    gdrive_file_url TEXT, -- Google Drive direct link / view link
    photo_caption TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_outreach_triwulan ON outreach_entries(triwulan);
CREATE INDEX IF NOT EXISTS idx_outreach_jenis ON outreach_entries(jenis_kegiatan);
CREATE INDEX IF NOT EXISTS idx_outreach_kecamatan ON outreach_entries(kecamatan);
CREATE INDEX IF NOT EXISTS idx_outreach_waktu ON outreach_entries(waktu DESC);

-- -------------------------------------------------------------------------
-- 4. TABEL STATISTIK TAHAPAN PENANGANAN PERKARA (case_statistics)
-- (Lid/SPDP, Dik Kejaksaan, Dik Kepolisian, Penuntutan & Eksekusi)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS case_statistics (
    id VARCHAR(100) PRIMARY KEY, -- format: 'case-stats:Korupsi:2026'
    category VARCHAR(100) NOT NULL CHECK (category IN (
        'Korupsi', 
        'Narkotika', 
        'Terorisme', 
        'Perkara Menarik Perhatian Masyarakat'
    )),
    year INTEGER NOT NULL,
    lid_spdp INTEGER NOT NULL DEFAULT 0, -- Tahap Penyelidikan / SPDP Masuk
    dik_kejaksaan INTEGER NOT NULL DEFAULT 0, -- Tahap Penyidikan Kejaksaan / Tahap I
    dik_kepolisian INTEGER NOT NULL DEFAULT 0, -- Tahap Penyidikan Kepolisian / Tahap II
    tut INTEGER NOT NULL DEFAULT 0, -- Tahap Penuntutan & Eksekusi
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_case_cat_year UNIQUE (category, year)
);

CREATE INDEX IF NOT EXISTS idx_case_stats_year ON case_statistics(year DESC);

-- -------------------------------------------------------------------------
-- 5. TABEL LOG AUDIT & AKTIVITAS AKSES INTELIJEN (audit_logs)
-- Untuk kepatuhan keamanan dokumen yustisial intelijen
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    user_role VARCHAR(50),
    action_type VARCHAR(100) NOT NULL, -- LOGIN, CREATE_ENTRY, UPDATE_ENTRY, EXPORT_PDF, dll
    target_table VARCHAR(100),
    target_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_email);

-- =========================================================================
-- CONTOH DATA SEED (DATA DUMMY AWAL RESMI)
-- =========================================================================

INSERT INTO outreach_entries (
    id, no_kegiatan, triwulan, jenis_kegiatan, tema_kegiatan, waktu, tempat, kecamatan, 
    jumlah_peserta, target_peserta, narasumber, materi_pokok, 
    gdrive_file_url, photo_caption, latitude, longitude, status
) VALUES 
(
    'outreach-101', 'JMS/01/TRI-I/2026', 1, 'Jaksa Masuk Sekolah (JMS)', 
    'Kenali Hukum, Jauhi Hukuman: Pencegahan Bullying & Bahaya Narkoba di Kalangan Pelajar', 
    '2026-01-22', 'Aula SMAN 1 Tabanan', 'Tabanan', 185, 150, 
    'I Putu Arya, S.H. & Tim Penerangan Hukum', 
    'UU ITE, UU Perlindungan Anak, dan Bahaya Narkotika', 
    'https://drive.google.com/uc?export=view&id=1SAMPLE_GDRIVE_FILE_ID_JMS', 
    'Penyampaian materi hukum dan sesi tanya jawab bersama 185 siswa SMAN 1 Tabanan', 
    -8.5372, 115.1245, 'TERLAKSANA'
),
(
    'outreach-102', 'PENKUM/01/TRI-I/2026', 1, 'Penyuluhan Hukum', 
    'Pengawalan Akuntabilitas Pengelolaan Dana Desa & Pencegahan Korupsi bagi Perbekel', 
    '2026-02-05', 'Gedung Pertemuan Kantor Camat Baturiti', 'Baturiti', 94, 80, 
    'Kasi Intelijen & Jaksa Penyidik Tipikor', 
    'Mitigasi Risiko Hukum Pengadaan Barang dan Jasa di Desa', 
    'https://drive.google.com/uc?export=view&id=1SAMPLE_GDRIVE_FILE_ID_PENKUM', 
    'Sosialisasi mitigasi risiko hukum bersama 12 Perbekel & Bendahara Desa se-Baturiti', 
    -8.3245, 115.1834, 'TERLAKSANA'
),
(
    'outreach-103', 'JMEN/01/TRI-I/2026', 1, 'Jaksa Menyapa', 
    'Dialog Interaktif: Peran Intelijen Kejaksaan dalam Menjaga Ketenteraman Masyarakat', 
    '2026-02-19', 'Studio RSPD 97.9 FM Tabanan', 'Tabanan', 320, 200, 
    'Kasi Intelijen Kejari Tabanan', 
    'Pemberitahuan Saluran Pengaduan Posko Pemilu dan Dumas Intelijen', 
    'https://drive.google.com/uc?export=view&id=1SAMPLE_GDRIVE_FILE_ID_JMEN', 
    'Siaran langsung dialog interaktif program Jaksa Menyapa di Studio Radio Pemkab Tabanan FM', 
    -8.5412, 115.1189, 'TERLAKSANA'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO case_statistics (id, category, year, lid_spdp, dik_kejaksaan, dik_kepolisian, tut, notes) VALUES
('case-stats:Korupsi:2026', 'Korupsi', 2026, 4, 2, 1, 2, 'Perkara dugaan penyelewengan dana LPD & APBDes'),
('case-stats:Narkotika:2026', 'Narkotika', 2026, 18, 0, 16, 14, 'Didominasi peredaran sabu & ganja sintetis lintas jalur Gilimanuk-Denpasar'),
('case-stats:Terorisme:2026', 'Terorisme', 2026, 0, 0, 0, 0, 'Nihil perkara aktif (kondusif)'),
('case-stats:Perkara Menarik Perhatian Masyarakat:2026', 'Perkara Menarik Perhatian Masyarakat', 2026, 6, 1, 5, 4, 'Kasus tindak pidana pencurian pratima & sengketa tanah waris adat')
ON CONFLICT (id) DO NOTHING;
