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

// Daftar email bawaan (Default Whitelist)
export const DEFAULT_ALLOWED_EMAILS: WhitelistEmailConfig[] = [
  {
    email: 'ikadek.satriawan@gmail.com',
    name: 'I Kadek Satriawan, S.H.',
    role: 'Kasi Intelijen',
    unit: 'Seksi Intelijen Kejaksaan Negeri Tabanan',
    nip: '19820514 200703 1 002',
    note: 'Akun Utama Administrator / Kasi Intelijen',
    isActive: true,
  },
  {
    email: 'kasiintel.kejaritabanan@gmail.com',
    name: 'Kasi Intelijen Kejari Tabanan',
    role: 'Kasi Intelijen',
    unit: 'Seksi Intelijen Kejaksaan Negeri Tabanan',
    nip: '19820514 200703 1 002',
    note: 'Email Dinas Seksi Intelijen Tabanan',
    isActive: true,
  },
  {
    email: 'intelijen.kejaritabanan@gmail.com',
    name: 'Operator Peta Intelijen',
    role: 'Staf Intelijen',
    unit: 'Operator Papan Peta Intelijen (PPI)',
    nip: '19950312 201901 1 003',
    note: 'Akun Operator Data Lapangan',
    isActive: true,
  },
  {
    email: 'kejaritabanan@gmail.com',
    name: 'Admin Utama Kejaksaan Negeri Tabanan',
    role: 'Administrator',
    unit: 'Kejaksaan Negeri Tabanan',
    nip: '19800101 200501 1 001',
    note: 'Akun Resmi Kejari Tabanan',
    isActive: true,
  }
];

// Storage key for whitelist
const WHITELIST_STORAGE_KEY = 'auth:email_whitelist';

/**
 * Mendapatkan daftar semua email yang diizinkan (dari storage lokal / default)
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
 * Memeriksa apakah suatu email terdaftar dan aktif di Whitelist
 */
export function verifyEmailWhitelist(email: string): { 
  allowed: boolean; 
  config?: WhitelistEmailConfig;
  reason?: string;
} {
  const normalizedEmail = email.trim().toLowerCase();
  const list = getAllowedEmailList();

  const match = list.find(item => item.email.trim().toLowerCase() === normalizedEmail);

  if (!match) {
    return {
      allowed: false,
      reason: `Email "${normalizedEmail}" belum terdaftar dalam daftar izin akses (Whitelist) Seksi Intelijen Kejari Tabanan.`
    };
  }

  if (!match.isActive) {
    return {
      allowed: false,
      reason: `Akses untuk email "${normalizedEmail}" sedang dinonaktifkan oleh Administrator.`
    };
  }

  return {
    allowed: true,
    config: match
  };
}
