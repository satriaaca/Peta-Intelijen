// Daftar Email Whitelist Resmi yang diizinkan masuk ke Sistem Intelijen Kejari Tabanan
export interface WhitelistEmailConfig {
  email: string;
  name: string;
  role: 'Kasi Intelijen' | 'Jaksa Fungsional Intelijen' | 'Staf Intelijen' | 'Administrator';
  unit: string;
  nip?: string;
  note?: string;
  isActive: boolean;
}

// Daftar email resmi yang secara ketat diizinkan (Hanya 2 akun ini, email lain diblokir)
export const DEFAULT_ALLOWED_EMAILS: WhitelistEmailConfig[] = [
  {
    email: 'hijau.kn.tabanan@gmail.com',
    name: 'Kasi Intelijen Kejari Tabanan',
    role: 'Kasi Intelijen',
    unit: 'Seksi Intelijen Kejaksaan Negeri Tabanan',
    nip: '19820514 200703 1 002',
    note: 'Akun Pejabat Kasi Intelijen',
    isActive: true,
  },
  {
    email: 'ikadek.satriawan@gmail.com',
    name: 'I Kadek Satriawan, S.H. (Administrator)',
    role: 'Administrator',
    unit: 'Administrator Sistem Intelijen Kejaksaan Negeri Tabanan',
    nip: '19820514 200703 1 001',
    note: 'Akun Administrator Sistem',
    isActive: true,
  }
];

// Storage key for whitelist (version 2 for strict migration)
const WHITELIST_STORAGE_KEY = 'auth:email_whitelist_v2';

/**
 * Mendapatkan daftar semua email yang diizinkan
 */
export function getAllowedEmailList(): WhitelistEmailConfig[] {
  try {
    const stored = localStorage.getItem(WHITELIST_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load allowed email list:', err);
  }
  return DEFAULT_ALLOWED_EMAILS;
}

/**
 * Menyimpan daftar email whitelist baru
 */
export function saveAllowedEmailList(list: WhitelistEmailConfig[]): void {
  try {
    localStorage.setItem(WHITELIST_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save allowed email list:', err);
  }
}

/**
 * Normalisasi email untuk perbandingan
 */
function normalizeEmailStr(email: string): string {
  let e = email.trim().toLowerCase();
  if (e.endsWith('@gmail')) {
    e = e + '.com';
  }
  return e;
}

/**
 * Memeriksa apakah suatu email terdaftar dan aktif di Whitelist (Strict Enforce)
 */
export function verifyEmailWhitelist(email: string): { 
  allowed: boolean; 
  config?: WhitelistEmailConfig;
  reason?: string;
} {
  const normalizedEmail = normalizeEmailStr(email);
  const list = getAllowedEmailList();

  const match = list.find(item => normalizeEmailStr(item.email) === normalizedEmail);

  if (!match) {
    return {
      allowed: false,
      reason: `AKSES DITOLAK: Email "${email}" tidak memiliki hak akses. Hanya akun Kasi Intelijen dan Administrator yang diizinkan masuk ke sistem.`
    };
  }

  if (!match.isActive) {
    return {
      allowed: false,
      reason: `AKSES DITOLAK: Akun "${email}" sedang dinonaktifkan.`
    };
  }

  return {
    allowed: true,
    config: match
  };
}
