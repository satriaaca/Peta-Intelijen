export type SectionId = 'D.IN.1' | 'D.IN.3' | 'D.IN.4' | 'D.IN.5' | 'D.IN.6' | 'D.IN.7';

export interface SectionMeta {
  id: SectionId;
  code: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
  iconName: string;
  defaultKeterangan: string[];
}

export interface IntelligenceEntry {
  id: string;
  no: string; // Nomor register / urut, e.g. "REG-01/D.IN.1/2026"
  section: SectionId;
  sektor_symbol: string; // Icon or category code (e.g. 'PO' = Politik, 'AG' = Agraria, 'MO' = Moneter, 'PS' = PPS)
  keterangan: string; // Short category label, e.g. "Politik", "Moneter", "Pengawasan Wilayah Teritorial", "Ideologi", "Ormas"
  narrative: string; // Long 5W+1H text starting with "Bahwa pada hari..."
  date: string; // YYYY-MM-DD
  reportDate?: string; // YYYY-MM-DD
  location: string; // Specific location / village
  kecamatan: string; // Kecamatan di Kab. Tabanan
  classification?: 'RAHASIA' | 'TERBATAS' | 'BIASA';
  officerName?: string; // Petugas Intelijen
  photoUrl?: string; // Base64 or image URL
  photoCaption?: string;
  sourceConfidence?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  status?: 'SELESAI' | 'DALAM_PEMANTAUAN' | 'TINDAK_LANJUT';
  createdAt: number;
  updatedAt: number;
}

export type OutreachCategory = 'Penyuluhan Hukum' | 'Penerangan Hukum' | 'Jaksa Masuk Sekolah (JMS)' | 'Jaksa Menyapa';

export interface OutreachEntry {
  id: string;
  no: string;
  triwulan: 1 | 2 | 3 | 4;
  jenis_kegiatan: OutreachCategory;
  tema_kegiatan: string;
  waktu: string; // YYYY-MM-DD
  tempat: string; // e.g. "SMAN 1 Tabanan", "Balai Desa Baturiti"
  kecamatan: string;
  jumlah_peserta: number;
  target_peserta?: number;
  narasumber?: string;
  materi_pokok?: string;
  photoUrl?: string;
  photoCaption?: string;
  latitude?: number;
  longitude?: number;
  status: 'TERLAKSANA' | 'TERJADWAL' | 'DITUNDA';
  createdAt: number;
  updatedAt: number;
}

export type CaseCategory = 'Korupsi' | 'Narkotika' | 'Terorisme' | 'Perkara Menarik Perhatian Masyarakat';

export interface CaseStageCounts {
  lid_spdp: number; // Penyelidikan / SPDP
  dik_kejaksaan: number; // Penyidikan Kejaksaan / Tahap I
  dik_kepolisian: number; // Penyidikan Kepolisian / Tahap II
  tut: number; // Penuntutan & Eksekusi
}

export interface CaseStatEntry {
  id: string; // format: case-stats:{category}:{year}
  category: CaseCategory;
  year: number;
  stages: CaseStageCounts;
  notes?: string;
  updatedAt: number;
}

export interface KecamatanInfo {
  name: string;
  code: string;
  totalEntries: number;
  outreachCount: number;
  alertLevel: 'AMAN' | 'WASPADA' | 'RAWAN';
}

export interface AppUser {
  username: string;
  name: string;
  nip: string;
  role: 'Kasi Intelijen' | 'Jaksa Fungsional Intelijen' | 'Staf Intelijen' | 'Administrator';
  unit: string;
  email?: string;
  photoURL?: string;
  uid?: string;
  isLoggedIn: boolean;
}

export interface JampidumPerkara {
  id_perkara: string;
  no_surat: string; // Nomor SPDP
  tgl_surat: string; // Tanggal surat SPDP
  ur_ipp: string; // Unit Penyidik, misal: POLRES TABANAN, POLSEK KEDIRI, POLSEK SELEMADEG, POLDA BALI
  undang_pasal: string; // Pasal yang disangkakan/didakwakan
  tgl_kejadian_perkara: string; // Format kejadian perkara
  tempat_kejadian: string; // TKP
  terima_spdp: string; // Tanggal terima SPDP di Kejaksaan
  spdp_kembali: string | null; // SPDP dikembalikan
  tdw: string; // Nama Tersangka / Terdakwa
  no_berkas: string | null; // Nomor Berkas Perkara
  tgl_p21: string | null; // Tanggal P-21 (Berkas Lengkap)
  tahap_2: string | null; // Tanggal Penyerahan Tersangka & BB (Tahap II)
  tgl_p31: string | null; // Tanggal Surat Pelimpahan Perkara (P-31)
  tgl_p42: string | null; // Tanggal Surat Tuntutan (P-42)
  tgl_put_pertama: string | null; // Tanggal Putusan Pengadilan Pertama
  tgl_p48: string | null; // Tanggal Pelaksanaan Putusan / Eksekusi (P-48)
}

export interface JampidumSatkerOption {
  code: string;
  name: string;
}

