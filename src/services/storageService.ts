import { IntelligenceEntry, OutreachEntry, CaseStatEntry, SectionId, AppUser } from '../types';
import { INITIAL_ENTRIES, INITIAL_OUTREACH, INITIAL_CASE_STATS } from './seedData';
import { formatGoogleDriveImageUrl } from '../utils/gdrive';

// In-memory fallback
const inMemoryFallbackStore = new Map<string, string>();

interface WindowStorageAPI {
  get: (key: string, options?: { shared?: boolean }) => Promise<{ value: string } | null | string | undefined>;
  set: (key: string, value: string, options?: { shared?: boolean }) => Promise<void>;
  delete: (key: string, options?: { shared?: boolean }) => Promise<void>;
  list: (options?: { prefix?: string; shared?: boolean }) => Promise<{ keys?: string[]; [key: string]: any }>;
}

function getStorageAPI(): WindowStorageAPI | null {
  if (typeof window !== 'undefined' && (window as any).storage && typeof (window as any).storage.get === 'function') {
    return (window as any).storage as WindowStorageAPI;
  }
  return null;
}

export async function storageGet(key: string): Promise<string | null> {
  const api = getStorageAPI();
  if (api) {
    try {
      const res = await api.get(key, { shared: false });
      if (!res) return null;
      if (typeof res === 'string') return res;
      if (typeof res === 'object' && 'value' in res) return res.value;
      return null;
    } catch {
      return inMemoryFallbackStore.get(key) || null;
    }
  }
  return inMemoryFallbackStore.get(key) || null;
}

export async function storageSet(key: string, value: string): Promise<void> {
  inMemoryFallbackStore.set(key, value);
  const api = getStorageAPI();
  if (api) {
    try {
      await api.set(key, value, { shared: false });
    } catch {
      // Memory fallback holds the data
    }
  }
}

export async function storageDelete(key: string): Promise<void> {
  inMemoryFallbackStore.delete(key);
  const api = getStorageAPI();
  if (api) {
    try {
      await api.delete(key, { shared: false });
    } catch {
      // Handled in memory
    }
  }
}

// -------------------------------------------------------------
// 1. INTELLIGENCE ENTRIES (POSTGRESQL DB WITH API)
// -------------------------------------------------------------

export async function getIntelligenceEntries(sectionFilter?: SectionId): Promise<IntelligenceEntry[]> {
  try {
    const url = sectionFilter 
      ? `/api/intelligence?section=${encodeURIComponent(sectionFilter)}`
      : '/api/intelligence';
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        // Normalize Google Drive images
        return data.map((item: IntelligenceEntry) => ({
          ...item,
          photoUrl: item.photoUrl ? formatGoogleDriveImageUrl(item.photoUrl) : undefined,
        }));
      }
    }
  } catch (err) {
    console.warn('[PostgreSQL] Failed to fetch intelligence entries from backend API, using local fallback:', err);
  }

  // Fallback to initial seed if API is unreachable
  let list = INITIAL_ENTRIES;
  if (sectionFilter) {
    list = list.filter((e) => e.section === sectionFilter);
  }
  return list;
}

export async function saveIntelligenceEntry(entry: IntelligenceEntry): Promise<void> {
  // Normalize Google Drive URL before saving
  const formattedEntry: IntelligenceEntry = {
    ...entry,
    photoUrl: entry.photoUrl ? formatGoogleDriveImageUrl(entry.photoUrl) : undefined,
  };

  try {
    const res = await fetch('/api/intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedEntry),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error || 'Gagal menyimpan ke PostgreSQL');
    }
  } catch (err: any) {
    console.error('[PostgreSQL] Save error:', err);
    // Cache locally as safety
    const key = `entries:${entry.section}:${entry.id}`;
    await storageSet(key, JSON.stringify(formattedEntry));
  }
}

export async function deleteIntelligenceEntry(id: string, section: SectionId): Promise<void> {
  try {
    const res = await fetch(`/api/intelligence/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Gagal menghapus data dari PostgreSQL');
    }
  } catch (err: any) {
    console.error('[PostgreSQL] Delete error:', err);
    const key = `entries:${section}:${id}`;
    await storageDelete(key);
  }
}

// -------------------------------------------------------------
// 2. OUTREACH / JMS / PENKUM ENTRIES (POSTGRESQL DB WITH API)
// -------------------------------------------------------------

export async function getOutreachEntries(triwulanFilter?: number): Promise<OutreachEntry[]> {
  try {
    const url = triwulanFilter
      ? `/api/outreach?triwulan=${encodeURIComponent(triwulanFilter)}`
      : '/api/outreach';
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map((item: OutreachEntry) => ({
          ...item,
          photoUrl: item.photoUrl ? formatGoogleDriveImageUrl(item.photoUrl) : undefined,
        }));
      }
    }
  } catch (err) {
    console.warn('[PostgreSQL] Failed to fetch outreach entries from backend API, using local fallback:', err);
  }

  // Fallback to initial seed if API is unreachable
  let list = INITIAL_OUTREACH;
  if (triwulanFilter) {
    list = list.filter((e) => e.triwulan === triwulanFilter);
  }
  return list;
}

export async function saveOutreachEntry(entry: OutreachEntry): Promise<void> {
  // Normalize Google Drive URL before saving
  const formattedEntry: OutreachEntry = {
    ...entry,
    photoUrl: entry.photoUrl ? formatGoogleDriveImageUrl(entry.photoUrl) : undefined,
  };

  try {
    const res = await fetch('/api/outreach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedEntry),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error || 'Gagal menyimpan ke PostgreSQL');
    }
  } catch (err: any) {
    console.error('[PostgreSQL] Save outreach error:', err);
    const key = `outreach:${entry.triwulan}:${entry.id}`;
    await storageSet(key, JSON.stringify(formattedEntry));
  }
}

export async function deleteOutreachEntry(id: string, triwulan: number): Promise<void> {
  try {
    const res = await fetch(`/api/outreach/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Gagal menghapus data dari PostgreSQL');
    }
  } catch (err: any) {
    console.error('[PostgreSQL] Delete outreach error:', err);
    const key = `outreach:${triwulan}:${id}`;
    await storageDelete(key);
  }
}

// -------------------------------------------------------------
// 3. CASE STATS (LOADED VIA JAMPIDUM API)
// -------------------------------------------------------------

export async function getCaseStats(): Promise<CaseStatEntry[]> {
  const cached = await storageGet('case-stats:cached');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return INITIAL_CASE_STATS;
}

export async function saveCaseStat(stat: CaseStatEntry): Promise<void> {
  const key = `case-stats:${stat.category}:${stat.year}`;
  await storageSet(key, JSON.stringify(stat));
}

// -------------------------------------------------------------
// 4. USER AUTH SESSION
// -------------------------------------------------------------

export async function getAppSession(): Promise<AppUser | null> {
  const val = await storageGet('auth:session');
  if (val) {
    try {
      return JSON.parse(val) as AppUser;
    } catch {
      return null;
    }
  }
  return null;
}

export async function saveAppSession(user: AppUser | null): Promise<void> {
  if (!user) {
    await storageDelete('auth:session');
  } else {
    await storageSet('auth:session', JSON.stringify(user));
  }
}

// -------------------------------------------------------------
// 5. DATABASE RESET
// -------------------------------------------------------------

export async function resetDatabaseToDefault(): Promise<void> {
  try {
    await fetch('/api/db/reset', { method: 'POST' });
  } catch (err) {
    console.error('Reset database failed:', err);
  }
}
