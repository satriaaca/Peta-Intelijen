import { Pool } from "pg";

const DEFAULT_POSTGRES_URL =
  "postgresql://neondb_owner:npg_xoCUkTR3GXD5@ep-holy-credit-azj0ora1-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || DEFAULT_POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

/**
 * Inisialisasi Skema Tabel PostgreSQL dan Seed Data Otomatis di Neon
 */
export async function initializeDatabase() {
  const client = await pool.connect();
  try {
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
        classification VARCHAR(30) DEFAULT 'TERBATAS',
        officer_name VARCHAR(255),
        source_confidence VARCHAR(10) DEFAULT 'A1',
        status VARCHAR(50) DEFAULT 'SELESAI',
        gdrive_file_id VARCHAR(255),
        gdrive_file_url TEXT,
        photo_caption TEXT,
        created_at BIGINT,
        updated_at BIGINT
      );
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
        created_at BIGINT,
        updated_at BIGINT
      );
      CREATE INDEX IF NOT EXISTS idx_outreach_triwulan ON outreach_entries(triwulan);
      CREATE INDEX IF NOT EXISTS idx_outreach_waktu ON outreach_entries(waktu DESC);
    `);

    // Seed intelligence entries if empty
    const checkIntel = await client.query(`SELECT COUNT(*) FROM intelligence_entries`);
    if (parseInt(checkIntel.rows[0].count, 10) === 0) {
      console.log("[PostgreSQL] Seeding initial intelligence entries...");
      const seedEntries = [
        {
          id: "din-101",
          no: "REG-01/D.IN.1/TAB/2026",
          section: "D.IN.1",
          sektor_symbol: "PO",
          keterangan: "Politik",
          narrative:
            "Bahwa pada hari Selasa, tanggal 17 Februari 2026, Tim Intelijen Kejaksaan Negeri Tabanan telah melaksanakan pemantauan dan pengumpulan bahan keterangan terkait tahapan persiapan verifikasi administrasi pengurus partai politik tingkat Kabupaten Tabanan bertempat di Kantor KPUD Kabupaten Tabanan, Jl. Bypass Ir. Soekarno. Berdasarkan hasil koordinasi dengan Komisioner KPU, proses berjalan kondusif tanpa adanya potensi ancaman gangguan hambatan tantangan (AGHT), namun tetap dilakukan monitoring intensif menjelang agenda pleno terbuka.",
          date: "2026-02-17",
          reportDate: "2026-02-18",
          location: "Kantor KPUD Tabanan, Jl. Bypass Ir. Soekarno",
          kecamatan: "Tabanan",
          classification: "TERBATAS",
          officerName: "I Putu Arya, S.H. (Jaksa Fungsional Intelijen)",
          sourceConfidence: "A1",
          status: "SELESAI",
        },
        {
          id: "din-102",
          no: "REG-02/D.IN.1/TAB/2026",
          section: "D.IN.1",
          sektor_symbol: "KT",
          keterangan: "Keamanan Teritorial",
          narrative:
            "Bahwa pada hari Kamis, tanggal 12 Februari 2026 sekitar pukul 10.00 WITA, diperoleh informasi terkait adanya ketegangan batas tanah ulayat/adat di wilayah perbatasan Desa Candikuning dengan Desa Batunya Kecamatan Baturiti. Tim Intelijen telah melakukan deteksi dini berkoordinasi dengan Majelis Desa Adat (MDA) Kecamatan Baturiti dan Kapolsek Baturiti guna meredam eskalasi konflik secara musyawarah kekeluargaan demi menjaga kondusivitas keamanan wilayah pariwisata Bedugul.",
          date: "2026-02-12",
          reportDate: "2026-02-13",
          location: "Batas Ulayat Desa Candikuning - Batunya",
          kecamatan: "Baturiti",
          classification: "RAHASIA",
          officerName: "Gede Agus Wirawan, S.H. (Staf Intelijen)",
          sourceConfidence: "B1",
          status: "DALAM_PEMANTAUAN",
        },
        {
          id: "din-103",
          no: "REG-03/D.IN.1/TAB/2026",
          section: "D.IN.1",
          sektor_symbol: "OR",
          keterangan: "Organisasi Masyarakat (Ormas)",
          narrative:
            "Bahwa pada hari Jumat, tanggal 06 Februari 2026, telah dilaksanakan kegiatan koordinasi dan pendataan ulang terhadap ormas dan LSM yang terdaftar di Bakesbangpol Kabupaten Tabanan. Dari total 42 ormas terdaftar, sebanyak 38 ormas berstatus aktif berkegiatan sosial kemasyarakatan dan tertib administrasi, serta tidak ditemukan indikasi terafiliasi dengan paham radikalisme.",
          date: "2026-02-06",
          reportDate: "2026-02-07",
          location: "Kantor Bakesbangpol Tabanan",
          kecamatan: "Tabanan",
          classification: "BIASA",
          officerName: "Kasi Intelijen Kejari Tabanan",
          sourceConfidence: "A1",
          status: "SELESAI",
        },
        {
          id: "din-301",
          no: "REG-01/D.IN.3/TAB/2026",
          section: "D.IN.3",
          sektor_symbol: "PK",
          keterangan: "Pengawasan Aliran Kepercayaan (PAKEM)",
          narrative:
            "Bahwa pada hari Rabu, tanggal 18 Februari 2026, Tim Koordinasi Pengawasan Aliran Kepercayaan dan Keagamaan dalam Masyarakat (PAKEM) Kejari Tabanan menggelar rapat koordinasi bersama Kemenag, FKUB, MDA, dan Polres Tabanan. Pembahasan difokuskan pada pemantauan kegiatan kelompok spiritual di kawasan Penebel agar tetap selaras dengan ketentuan hukum dan tidak menimbulkan keresahan warga sekitar.",
          date: "2026-02-18",
          reportDate: "2026-02-19",
          location: "Aula Kejaksaan Negeri Tabanan",
          kecamatan: "Tabanan",
          classification: "TERBATAS",
          officerName: "Kasi Intelijen Kejari Tabanan",
          sourceConfidence: "A1",
          status: "SELESAI",
        },
        {
          id: "din-401",
          no: "REG-01/D.IN.4/TAB/2026",
          section: "D.IN.4",
          sektor_symbol: "SP",
          keterangan: "Stabilitas Pangan & Inflasi",
          narrative:
            "Bahwa pada hari Senin, tanggal 16 Februari 2026, Satgas Ketahanan Pangan Seksi Intelijen Kejari Tabanan melaksanakan inspeksi pasar bersama Diskoperindag Tabanan di Pasar Tradisional Tabanan dan Pasar Kediri. Berdasarkan hasil pemantauan, pasokan beras medium, beras premium, minyak goreng MinyaKita, dan cabai rawit merah dalam kondisi cukup dengan harga stabil terjangkau.",
          date: "2026-02-16",
          reportDate: "2026-02-17",
          location: "Pasar Umum Tabanan & Pasar Kediri",
          kecamatan: "Kediri",
          classification: "TERBATAS",
          officerName: "I Kadek Satriawan, S.H.",
          sourceConfidence: "A1",
          status: "SELESAI",
        },
        {
          id: "din-501",
          no: "REG-01/D.IN.5/TAB/2026",
          section: "D.IN.5",
          sektor_symbol: "PSD",
          keterangan: "Proyek Strategis Daerah (PSD)",
          narrative:
            "Bahwa pada hari Rabu, tanggal 11 Februari 2026, Tim Pengamanan Pembangunan Strategis (PPS) Intelijen Kejari Tabanan melakukan monitoring lapangan berkala terhadap proyek rehabilitasi saluran irigasi Subak di wilayah Kecamatan Selemadeg Timur. Realisasi fisik mencapai bobot 48% (deviasi positif +2.5%) dengan mutu konstruksi sesuai spesifikasi teknis dinas PUPRPKP.",
          date: "2026-02-11",
          reportDate: "2026-02-12",
          location: "Saluran Irigasi Subak Selemadeg Timur",
          kecamatan: "Selemadeg Timur",
          classification: "TERBATAS",
          officerName: "I Putu Arya, S.H.",
          sourceConfidence: "A1",
          status: "SELESAI",
        },
        {
          id: "din-601",
          no: "REG-01/D.IN.6/TAB/2026",
          section: "D.IN.6",
          sektor_symbol: "CP",
          keterangan: "Cyber Patrol",
          narrative:
            "Bahwa pada hari Minggu, tanggal 15 Februari 2026, Tim Cyber Patrol Intelijen Kejari Tabanan melakukan monitoring terhadap narasi provokatif di platform TikTok dan Facebook grup komunitas lokal Tabanan. Ditemukan 2 konten disinformasi terkait seleksi CASN/PPPK yang langsung dikoordinasikan dengan Diskominfo untuk penerbitan klarifikasi resmi (anti-hoaks).",
          date: "2026-02-15",
          reportDate: "2026-02-16",
          location: "Media Sosial Siber Ruang Virtual",
          kecamatan: "Tabanan",
          classification: "TERBATAS",
          officerName: "Gede Agus Wirawan, S.H.",
          sourceConfidence: "A1",
          status: "SELESAI",
        },
      ];

      for (const e of seedEntries) {
        await client.query(
          `INSERT INTO intelligence_entries (
            id, no_register, section_id, sektor_symbol, keterangan, narrative, 
            event_date, report_date, location, kecamatan, classification, 
            officer_name, source_confidence, status, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          ON CONFLICT (id) DO NOTHING`,
          [
            e.id,
            e.no,
            e.section,
            e.sektor_symbol,
            e.keterangan,
            e.narrative,
            e.date,
            e.reportDate,
            e.location,
            e.kecamatan,
            e.classification,
            e.officerName,
            e.sourceConfidence,
            e.status,
            Date.now(),
            Date.now(),
          ]
        );
      }
    }

    // Seed outreach entries if empty
    const checkOutreach = await client.query(`SELECT COUNT(*) FROM outreach_entries`);
    if (parseInt(checkOutreach.rows[0].count, 10) === 0) {
      console.log("[PostgreSQL] Seeding initial outreach entries (JMS & Penkum)...");
      const seedOutreach = [
        {
          id: "outreach-101",
          no: "JMS/01/TRI-I/2026",
          triwulan: 1,
          jenis_kegiatan: "Jaksa Masuk Sekolah (JMS)",
          tema_kegiatan:
            "Kenali Hukum, Jauhi Hukuman: Pencegahan Bullying & Bahaya Narkoba di Kalangan Pelajar",
          waktu: "2026-01-22",
          tempat: "Aula SMAN 1 Tabanan",
          kecamatan: "Tabanan",
          jumlah_peserta: 185,
          target_peserta: 150,
          narasumber: "I Putu Arya, S.H. & Tim Penerangan Hukum",
          materi_pokok: "UU ITE, UU Perlindungan Anak, dan Bahaya Narkotika",
          gdrive_file_url: "https://drive.google.com/thumbnail?id=1SAMPLE_GDRIVE_FILE_ID_JMS&sz=w1200",
          photo_caption: "Penyampaian materi hukum dan sesi tanya jawab bersama 185 siswa SMAN 1 Tabanan",
          latitude: -8.5372,
          longitude: 115.1245,
          status: "TERLAKSANA",
        },
        {
          id: "outreach-102",
          no: "PENKUM/01/TRI-I/2026",
          triwulan: 1,
          jenis_kegiatan: "Penyuluhan Hukum",
          tema_kegiatan:
            "Pengawalan Akuntabilitas Pengelolaan Dana Desa & Pencegahan Korupsi bagi Perbekel",
          waktu: "2026-02-05",
          tempat: "Gedung Pertemuan Kantor Camat Baturiti",
          kecamatan: "Baturiti",
          jumlah_peserta: 94,
          target_peserta: 80,
          narasumber: "Kasi Intelijen & Jaksa Penyidik Tipikor",
          materi_pokok: "Mitigasi Risiko Hukum Pengadaan Barang dan Jasa di Desa",
          gdrive_file_url: "https://drive.google.com/thumbnail?id=1SAMPLE_GDRIVE_FILE_ID_PENKUM&sz=w1200",
          photo_caption: "Sosialisasi mitigasi risiko hukum bersama 12 Perbekel & Bendahara Desa se-Baturiti",
          latitude: -8.3245,
          longitude: 115.1834,
          status: "TERLAKSANA",
        },
        {
          id: "outreach-103",
          no: "JMEN/01/TRI-I/2026",
          triwulan: 1,
          jenis_kegiatan: "Jaksa Menyapa",
          tema_kegiatan:
            "Dialog Interaktif: Peran Intelijen Kejaksaan dalam Menjaga Ketenteraman Masyarakat",
          waktu: "2026-02-19",
          tempat: "Studio RSPD 97.9 FM Tabanan",
          kecamatan: "Tabanan",
          jumlah_peserta: 320,
          target_peserta: 200,
          narasumber: "Kasi Intelijen Kejari Tabanan",
          materi_pokok: "Pemberitahuan Saluran Pengaduan Posko Pemilu dan Dumas Intelijen",
          gdrive_file_url: "https://drive.google.com/thumbnail?id=1SAMPLE_GDRIVE_FILE_ID_JMEN&sz=w1200",
          photo_caption: "Siaran langsung dialog interaktif program Jaksa Menyapa di Studio Radio Pemkab Tabanan FM",
          latitude: -8.5412,
          longitude: 115.1189,
          status: "TERLAKSANA",
        },
      ];

      for (const o of seedOutreach) {
        await client.query(
          `INSERT INTO outreach_entries (
            id, no_kegiatan, triwulan, jenis_kegiatan, tema_kegiatan, waktu, 
            tempat, kecamatan, jumlah_peserta, target_peserta, narasumber, 
            materi_pokok, latitude, longitude, status, gdrive_file_url, photo_caption,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
          ON CONFLICT (id) DO NOTHING`,
          [
            o.id,
            o.no,
            o.triwulan,
            o.jenis_kegiatan,
            o.tema_kegiatan,
            o.waktu,
            o.tempat,
            o.kecamatan,
            o.jumlah_peserta,
            o.target_peserta,
            o.narasumber,
            o.materi_pokok,
            o.latitude,
            o.longitude,
            o.status,
            o.gdrive_file_url,
            o.photo_caption,
            Date.now(),
            Date.now(),
          ]
        );
      }
    }

    console.log("[PostgreSQL] Database schemas & initial records ready.");
  } catch (err: any) {
    console.error("[PostgreSQL] Database init error:", err.message);
  } finally {
    client.release();
  }
}
