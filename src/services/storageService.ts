import { IntelligenceEntry, OutreachEntry, CaseStatEntry, SectionId, AppUser, AnnualTargetEntry } from '../types';
import { INITIAL_ENTRIES, INITIAL_OUTREACH, INITIAL_CASE_STATS, INITIAL_ANNUAL_TARGETS } from './seedData';
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
    } catch {
      // fallback to localStorage
    }
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const val = localStorage.getItem(key);
      if (val !== null) return val;
    } catch {
      // ignore
    }
  }
  return inMemoryFallbackStore.get(key) || null;
}

export async function storageSet(key: string, value: string): Promise<void> {
  inMemoryFallbackStore.set(key, value);
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  }
  const api = getStorageAPI();
  if (api) {
    try {
      await api.set(key, value, { shared: false });
    } catch {
      // Handled
    }
  }
}

export async function storageDelete(key: string): Promise<void> {
  inMemoryFallbackStore.delete(key);
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
  const api = getStorageAPI();
  if (api) {
    try {
      await api.delete(key, { shared: false });
    } catch {
      // Handled
    }
  }
}

// -------------------------------------------------------------
// 1. INTELLIGENCE ENTRIES (POSTGRESQL DB WITH RESILIENT LOCAL CACHE)
// -------------------------------------------------------------

export async function getIntelligenceEntries(sectionFilter?: SectionId): Promise<IntelligenceEntry[]> {
  try {
    const url = sectionFilter 
      ? `/api/intelligence?section=${encodeURIComponent(sectionFilter)}`
      : '/api/intelligence';
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map((item: IntelligenceEntry) => ({
          ...item,
          photoUrl: item.photoUrl ? formatGoogleDriveImageUrl(item.photoUrl) : undefined,
        }));
        await storageSet('intel_entries:cached', JSON.stringify(formatted));
        return sectionFilter ? formatted.filter((e) => e.section === sectionFilter) : formatted;
      }
    }
  } catch (err) {
    console.warn('[Storage] API fetch failed for intelligence entries, using cache:', err);
  }

  // Fallback to local storage cache
  const cached = await storageGet('intel_entries:cached');
  if (cached) {
    try {
      const list: IntelligenceEntry[] = JSON.parse(cached);
      if (Array.isArray(list) && list.length > 0) {
        return sectionFilter ? list.filter((e) => e.section === sectionFilter) : list;
      }
    } catch {
      // ignore
    }
  }

  let list = INITIAL_ENTRIES;
  if (sectionFilter) {
    list = list.filter((e) => e.section === sectionFilter);
  }
  return list;
}

export async function saveIntelligenceEntry(entry: IntelligenceEntry): Promise<void> {
  const formattedEntry: IntelligenceEntry = {
    ...entry,
    photoUrl: entry.photoUrl ? formatGoogleDriveImageUrl(entry.photoUrl) : undefined,
  };

  // Update local cache immediately
  try {
    const current = await getIntelligenceEntries();
    const existingIdx = current.findIndex((e) => e.id === entry.id);
    let updated: IntelligenceEntry[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = formattedEntry;
    } else {
      updated = [formattedEntry, ...current];
    }
    await storageSet('intel_entries:cached', JSON.stringify(updated));
  } catch (cacheErr) {
    console.warn('[Storage] Failed to update local intel cache:', cacheErr);
  }

  // Sync to PostgreSQL backend
  try {
    const res = await fetch('/api/intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedEntry),
    });
    if (!res.ok) {
      console.warn('[Storage] Backend sync returned status:', res.status);
    }
  } catch (err: any) {
    console.warn('[Storage] Backend sync error, entry saved in local storage:', err.message);
  }
}

export async function deleteIntelligenceEntry(id: string, section: SectionId): Promise<void> {
  // Remove from local cache immediately
  try {
    const current = await getIntelligenceEntries();
    const updated = current.filter((e) => e.id !== id);
    await storageSet('intel_entries:cached', JSON.stringify(updated));
  } catch (cacheErr) {
    console.warn('[Storage] Failed to remove from local intel cache:', cacheErr);
  }

  // Delete from PostgreSQL backend
  try {
    const res = await fetch(`/api/intelligence/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      console.warn('[Storage] Backend delete returned status:', res.status);
    }
  } catch (err: any) {
    console.warn('[Storage] Backend delete error, entry removed from local storage:', err.message);
  }
}

// -------------------------------------------------------------
// 2. OUTREACH / JMS / PENKUM ENTRIES (POSTGRESQL DB WITH RESILIENT LOCAL CACHE)
// -------------------------------------------------------------

export async function getOutreachEntries(triwulanFilter?: number): Promise<OutreachEntry[]> {
  try {
    const url = triwulanFilter
      ? `/api/outreach?triwulan=${encodeURIComponent(triwulanFilter)}`
      : '/api/outreach';
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map((item: OutreachEntry) => ({
          ...item,
          photoUrl: item.photoUrl ? formatGoogleDriveImageUrl(item.photoUrl) : undefined,
        }));
        await storageSet('outreach_entries:cached', JSON.stringify(formatted));
        return triwulanFilter ? formatted.filter((e) => e.triwulan === triwulanFilter) : formatted;
      }
    }
  } catch (err) {
    console.warn('[Storage] API fetch failed for outreach entries, using cache:', err);
  }

  // Fallback to local storage cache
  const cached = await storageGet('outreach_entries:cached');
  if (cached) {
    try {
      const list: OutreachEntry[] = JSON.parse(cached);
      if (Array.isArray(list) && list.length > 0) {
        return triwulanFilter ? list.filter((e) => e.triwulan === triwulanFilter) : list;
      }
    } catch {
      // ignore
    }
  }

  let list = INITIAL_OUTREACH;
  if (triwulanFilter) {
    list = list.filter((e) => e.triwulan === triwulanFilter);
  }
  return list;
}

export async function saveOutreachEntry(entry: OutreachEntry): Promise<void> {
  const formattedEntry: OutreachEntry = {
    ...entry,
    photoUrl: entry.photoUrl ? formatGoogleDriveImageUrl(entry.photoUrl) : undefined,
  };

  // 1. Update local storage cache immediately so UI updates in real time
  try {
    const current = await getOutreachEntries();
    const existingIdx = current.findIndex((e) => e.id === entry.id);
    let updated: OutreachEntry[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = formattedEntry;
    } else {
      updated = [formattedEntry, ...current];
    }
    await storageSet('outreach_entries:cached', JSON.stringify(updated));
  } catch (cacheErr) {
    console.warn('[Storage] Failed to update local outreach cache:', cacheErr);
  }

  // 2. Sync to PostgreSQL backend
  try {
    const res = await fetch('/api/outreach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedEntry),
    });
    if (!res.ok) {
      console.warn('[Storage] Backend outreach save returned status:', res.status);
    }
  } catch (err: any) {
    console.warn('[Storage] Backend save error, entry stored in local storage:', err.message);
  }
}

export async function deleteOutreachEntry(id: string, _triwulan?: number): Promise<void> {
  // 1. Remove from local storage cache immediately
  try {
    const current = await getOutreachEntries();
    const updated = current.filter((e) => e.id !== id);
    await storageSet('outreach_entries:cached', JSON.stringify(updated));
  } catch (cacheErr) {
    console.warn('[Storage] Failed to delete from local outreach cache:', cacheErr);
  }

  // 2. Delete from PostgreSQL backend
  try {
    const res = await fetch(`/api/outreach/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      // Try fallback delete with body
      await fetch('/api/outreach', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      }).catch(() => {});
    }
  } catch (err: any) {
    console.warn('[Storage] Backend delete error, entry deleted locally:', err.message);
  }
}

// -------------------------------------------------------------
// 3. CASE STATS (POSTGRESQL DB & JAMPIDUM API)
// -------------------------------------------------------------

export async function getCaseStats(yearFilter?: number): Promise<CaseStatEntry[]> {
  try {
    const url = yearFilter ? `/api/case-stats?year=${yearFilter}` : '/api/case-stats';
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        await storageSet('case-stats:cached', JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('[Storage] Failed to fetch case stats from backend API:', err);
  }

  const cached = await storageGet('case-stats:cached');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return yearFilter ? parsed.filter((s: CaseStatEntry) => s.year === yearFilter) : parsed;
      }
    } catch {
      // ignore
    }
  }
  return yearFilter ? INITIAL_CASE_STATS.filter((s) => s.year === yearFilter) : INITIAL_CASE_STATS;
}

export async function saveCaseStat(stat: CaseStatEntry): Promise<void> {
  // Update local cache immediately
  try {
    const current = await getCaseStats();
    const existingIdx = current.findIndex((s) => s.id === stat.id);
    let updated: CaseStatEntry[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = stat;
    } else {
      updated = [...current, stat];
    }
    await storageSet('case-stats:cached', JSON.stringify(updated));
  } catch {
    // ignore
  }

  // Sync to PostgreSQL backend
  try {
    await fetch('/api/case-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stat),
    });
  } catch (err: any) {
    console.warn('[Storage] Save case stats backend error, saved locally:', err.message);
  }
}

// -------------------------------------------------------------
// 3.5. ANNUAL PERFORMANCE TARGETS (POSTGRESQL & LOCAL STORAGE)
// -------------------------------------------------------------

export async function getAnnualTargets(yearFilter?: number): Promise<AnnualTargetEntry[]> {
  try {
    const url = yearFilter ? `/api/annual-targets?year=${yearFilter}` : '/api/annual-targets';
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        await storageSet('annual-targets:cached', JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('[Storage] Failed to fetch annual targets from backend API:', err);
  }

  const cached = await storageGet('annual-targets:cached');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return yearFilter ? parsed.filter((t: AnnualTargetEntry) => t.year === yearFilter) : parsed;
      }
    } catch {
      // ignore
    }
  }
  return yearFilter ? INITIAL_ANNUAL_TARGETS.filter((t) => t.year === yearFilter) : INITIAL_ANNUAL_TARGETS;
}

export async function saveAnnualTarget(target: AnnualTargetEntry): Promise<void> {
  // Update local cache immediately
  try {
    const current = await getAnnualTargets();
    const existingIdx = current.findIndex((t) => t.id === target.id);
    let updated: AnnualTargetEntry[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = target;
    } else {
      updated = [...current, target];
    }
    await storageSet('annual-targets:cached', JSON.stringify(updated));
  } catch {
    // ignore
  }

  // Sync to PostgreSQL backend
  try {
    await fetch('/api/annual-targets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(target),
    });
  } catch (err: any) {
    console.warn('[Storage] Save annual target backend error, saved locally:', err.message);
  }
}

export async function deleteAnnualTarget(id: string): Promise<void> {
  // Remove from local cache immediately
  try {
    const current = await getAnnualTargets();
    const updated = current.filter((t) => t.id !== id);
    await storageSet('annual-targets:cached', JSON.stringify(updated));
  } catch {
    // ignore
  }

  // Delete from PostgreSQL backend
  try {
    await fetch(`/api/annual-targets/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  } catch (err: any) {
    console.warn('[Storage] Delete annual target backend error, deleted locally:', err.message);
  }
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
    await storageDelete('intel_entries:cached');
    await storageDelete('outreach_entries:cached');
    await storageDelete('case-stats:cached');
    await storageDelete('annual-targets:cached');
    await fetch('/api/db/reset', { method: 'POST' });
  } catch (err) {
    console.error('Reset database failed:', err);
  }
}
