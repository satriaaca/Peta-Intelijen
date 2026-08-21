import { IntelligenceEntry, OutreachEntry, CaseStatEntry, SectionId, AppUser } from '../types';
import { INITIAL_ENTRIES, INITIAL_OUTREACH, INITIAL_CASE_STATS } from './seedData';

// Storage Key Contract:
// entries:{section}:{id}
// case-stats:{category}:{year}
// outreach:{triwulan}:{id}
// auth:session

// Fallback in-memory/IndexedDB cache if window.storage is not available in development
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

// Low-level safe get
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

// Low-level safe set
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

// Low-level safe delete
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

// Low-level safe list
export async function storageList(prefix: string = ''): Promise<string[]> {
  const api = getStorageAPI();
  if (api) {
    try {
      const res = await api.list({ prefix, shared: false });
      if (res && Array.isArray(res.keys)) {
        return res.keys;
      }
      if (res && Array.isArray(res)) {
        return res;
      }
    } catch {
      // Fallback below
    }
  }
  return Array.from(inMemoryFallbackStore.keys()).filter((k) => k.startsWith(prefix));
}

// Initialize seed data if storage is empty
let isInitialized = false;

export async function initializeStorage(): Promise<void> {
  if (isInitialized) return;
  
  const initializedFlag = await storageGet('app:initialized');
  if (!initializedFlag) {
    // Populate Initial Intelligence entries
    for (const entry of INITIAL_ENTRIES) {
      const key = `entries:${entry.section}:${entry.id}`;
      await storageSet(key, JSON.stringify(entry));
    }
    
    // Populate Initial Outreach entries
    for (const outreach of INITIAL_OUTREACH) {
      const key = `outreach:${outreach.triwulan}:${outreach.id}`;
      await storageSet(key, JSON.stringify(outreach));
    }

    // Populate Initial Case stats
    for (const stat of INITIAL_CASE_STATS) {
      const key = `case-stats:${stat.category}:${stat.year}`;
      await storageSet(key, JSON.stringify(stat));
    }

    await storageSet('app:initialized', 'true');
  }
  isInitialized = true;
}

// High-level API for Intelligence Narrative Entries
export async function getIntelligenceEntries(sectionFilter?: SectionId): Promise<IntelligenceEntry[]> {
  await initializeStorage();
  const prefix = sectionFilter ? `entries:${sectionFilter}:` : 'entries:';
  const keys = await storageList(prefix);
  
  const entries: IntelligenceEntry[] = [];
  for (const key of keys) {
    if (key.startsWith('entries:')) {
      const val = await storageGet(key);
      if (val) {
        try {
          const parsed = JSON.parse(val) as IntelligenceEntry;
          if (!sectionFilter || parsed.section === sectionFilter) {
            entries.push(parsed);
          }
        } catch {
          // ignore corrupted
        }
      }
    }
  }

  // Sort by date descending
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function saveIntelligenceEntry(entry: IntelligenceEntry): Promise<void> {
  await initializeStorage();
  const key = `entries:${entry.section}:${entry.id}`;
  await storageSet(key, JSON.stringify(entry));
}

export async function deleteIntelligenceEntry(id: string, section: SectionId): Promise<void> {
  const key = `entries:${section}:${id}`;
  await storageDelete(key);
}

// High-level API for Outreach / Penkum Entries
export async function getOutreachEntries(triwulanFilter?: number): Promise<OutreachEntry[]> {
  await initializeStorage();
  const prefix = triwulanFilter ? `outreach:${triwulanFilter}:` : 'outreach:';
  const keys = await storageList(prefix);
  
  const entries: OutreachEntry[] = [];
  for (const key of keys) {
    if (key.startsWith('outreach:')) {
      const val = await storageGet(key);
      if (val) {
        try {
          const parsed = JSON.parse(val) as OutreachEntry;
          if (!triwulanFilter || parsed.triwulan === triwulanFilter) {
            entries.push(parsed);
          }
        } catch {
          // ignore
        }
      }
    }
  }

  return entries.sort((a, b) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime());
}

export async function saveOutreachEntry(entry: OutreachEntry): Promise<void> {
  await initializeStorage();
  const key = `outreach:${entry.triwulan}:${entry.id}`;
  await storageSet(key, JSON.stringify(entry));
}

export async function deleteOutreachEntry(id: string, triwulan: number): Promise<void> {
  const key = `outreach:${triwulan}:${id}`;
  await storageDelete(key);
}

// High-level API for Case Statistics
export async function getCaseStats(): Promise<CaseStatEntry[]> {
  await initializeStorage();
  const keys = await storageList('case-stats:');
  const stats: CaseStatEntry[] = [];

  for (const key of keys) {
    if (key.startsWith('case-stats:')) {
      const val = await storageGet(key);
      if (val) {
        try {
          const parsed = JSON.parse(val) as CaseStatEntry;
          stats.push(parsed);
        } catch {
          // ignore
        }
      }
    }
  }

  return stats.sort((a, b) => b.year - a.year || a.category.localeCompare(b.category));
}

export async function saveCaseStat(stat: CaseStatEntry): Promise<void> {
  await initializeStorage();
  const key = `case-stats:${stat.category}:${stat.year}`;
  await storageSet(key, JSON.stringify(stat));
}

// User Session
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

// Reset data to defaults
export async function resetDatabaseToDefault(): Promise<void> {
  const allKeys = await storageList('');
  for (const key of allKeys) {
    await storageDelete(key);
  }
  isInitialized = false;
  await initializeStorage();
}
