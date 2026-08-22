import { JampidumPerkara, CaseCategory, CaseStatEntry } from '../types';

export const SATKER_TABANAN = '22.08';
export const SATKER_NAME_TABANAN = 'Kejaksaan Negeri Tabanan';

export const JAMPIDUM_SATKER_LIST = [
  { code: '22.08', name: 'Kejaksaan Negeri Tabanan (22.08)' },
  { code: '22.00', name: 'Kejaksaan Tinggi Bali (22.00)' },
];

/**
 * Fetch case data from JAMPIDUM API via backend proxy, with fallback to direct call and local cache.
 */
export async function fetchJampidumCases(
  year: number = 2026,
  satker: string = SATKER_TABANAN
): Promise<{ data: JampidumPerkara[]; source: 'proxy' | 'direct' | 'cache'; timestamp: number }> {
  const cacheKey = `jampidum_cases_${satker}_${year}`;
  const cacheTimestampKey = `jampidum_last_sync_${satker}_${year}`;

  // 1. Try internal proxy endpoint first
  try {
    const timestamp = Date.now();
    const res = await fetch(`/api/jampidum-perkara?year=${year}&satker=${satker}&_=${timestamp}`);
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data)) {
        localStorage.setItem(cacheKey, JSON.stringify(json.data));
        localStorage.setItem(cacheTimestampKey, timestamp.toString());
        return { data: json.data, source: 'proxy', timestamp };
      }
    }
  } catch (proxyErr) {
    console.warn('Proxy fetch failed, attempting direct fetch fallback:', proxyErr);
  }

  // 2. Direct external fetch fallback
  try {
    const directUrl = `https://jampidum.kejaksaan.go.id/web/api/perkara/info/${year}/${satker}?_=${Date.now()}`;
    const directRes = await fetch(directUrl);
    if (directRes.ok) {
      const directJson = await directRes.json();
      if (directJson && Array.isArray(directJson.data)) {
        const timestamp = Date.now();
        localStorage.setItem(cacheKey, JSON.stringify(directJson.data));
        localStorage.setItem(cacheTimestampKey, timestamp.toString());
        return { data: directJson.data, source: 'direct', timestamp };
      }
    }
  } catch (directErr) {
    console.warn('Direct fetch failed, checking local cache:', directErr);
  }

  // 3. Fallback to localStorage cache
  const cachedStr = localStorage.getItem(cacheKey);
  const cachedTs = parseInt(localStorage.getItem(cacheTimestampKey) || '0', 10);
  if (cachedStr) {
    try {
      const cachedData = JSON.parse(cachedStr);
      if (Array.isArray(cachedData)) {
        return { data: cachedData, source: 'cache', timestamp: cachedTs };
      }
    } catch {
      // ignore parse error
    }
  }

  throw new Error(`Tidak dapat memuat data JAMPIDUM untuk satker ${satker} tahun ${year}. Pastikan koneksi internet aktif.`);
}

/**
 * Categorize a JAMPIDUM case into one of the 4 intelligence judicial case categories.
 */
export function classifyJampidumCase(item: JampidumPerkara): CaseCategory {
  const text = `${item.undang_pasal || ''} ${item.no_surat || ''} ${item.ur_ipp || ''}`.toLowerCase();

  // Narkotika
  if (
    text.includes('narkotika') ||
    text.includes('narkoba') ||
    text.includes('35 tahun 2009') ||
    text.includes('psikotropika') ||
    text.includes('pasal 609') ||
    text.includes('pasal 111') ||
    text.includes('pasal 112') ||
    text.includes('pasal 114') ||
    text.includes('pasal 127') ||
    text.includes('satresnarkoba') ||
    text.includes('sat res narkoba')
  ) {
    return 'Narkotika';
  }

  // Korupsi / Tipikor
  if (
    text.includes('korupsi') ||
    text.includes('tipikor') ||
    text.includes('31 tahun 1999') ||
    text.includes('20 tahun 2001') ||
    text.includes('keuangan negara') ||
    text.includes('suap') ||
    text.includes('gratifikasi') ||
    text.includes('pungli') ||
    text.includes('tindak pidana korupsi')
  ) {
    return 'Korupsi';
  }

  // Terorisme
  if (
    text.includes('terorisme') ||
    text.includes('teror') ||
    text.includes('5 tahun 2018') ||
    text.includes('densus') ||
    text.includes('radikalisme')
  ) {
    return 'Terorisme';
  }

  // Default: Perkara Menarik Perhatian Masyarakat (Oharda, Kamnegtibum, Cabul Anak, dll)
  return 'Perkara Menarik Perhatian Masyarakat';
}

/**
 * Returns formatted stage information for a case.
 */
export function getCaseStageInfo(item: JampidumPerkara): {
  stageName: string;
  stageCode: 'SPDP' | 'P-21' | 'TAHAP-2' | 'P-31' | 'P-42' | 'PUTUSAN' | 'P-48';
  badgeColor: string;
  isCompleted: boolean;
  activeStageIndex: number;
} {
  if (item.tgl_p48) {
    return {
      stageName: 'Eksekusi (P-48)',
      stageCode: 'P-48',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      isCompleted: true,
      activeStageIndex: 6,
    };
  }
  if (item.tgl_put_pertama) {
    return {
      stageName: 'Putusan Pengadilan',
      stageCode: 'PUTUSAN',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      isCompleted: false,
      activeStageIndex: 5,
    };
  }
  if (item.tgl_p42) {
    return {
      stageName: 'Surat Tuntutan (P-42)',
      stageCode: 'P-42',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      isCompleted: false,
      activeStageIndex: 4,
    };
  }
  if (item.tgl_p31) {
    return {
      stageName: 'Pelimpahan PN (P-31)',
      stageCode: 'P-31',
      badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
      isCompleted: false,
      activeStageIndex: 3,
    };
  }
  if (item.tahap_2) {
    return {
      stageName: 'Tahap II (Tersangka & BB)',
      stageCode: 'TAHAP-2',
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      isCompleted: false,
      activeStageIndex: 2,
    };
  }
  if (item.tgl_p21) {
    return {
      stageName: 'Berkas Lengkap (P-21)',
      stageCode: 'P-21',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      isCompleted: false,
      activeStageIndex: 1,
    };
  }
  return {
    stageName: 'SPDP Diterima (Lid / Pratut)',
    stageCode: 'SPDP',
    badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    isCompleted: false,
    activeStageIndex: 0,
  };
}

/**
 * Aggregate array of JAMPIDUM cases into CaseStatEntry array for the specified year.
 */
export function aggregateJampidumCasesToStats(
  cases: JampidumPerkara[],
  year: number
): CaseStatEntry[] {
  const categories: CaseCategory[] = [
    'Korupsi',
    'Narkotika',
    'Terorisme',
    'Perkara Menarik Perhatian Masyarakat',
  ];

  const stageCounts: Record<CaseCategory, {
    lid_spdp: number;
    dik_kejaksaan: number;
    dik_kepolisian: number;
    tut: number;
    samples: string[];
  }> = {
    Korupsi: { lid_spdp: 0, dik_kejaksaan: 0, dik_kepolisian: 0, tut: 0, samples: [] },
    Narkotika: { lid_spdp: 0, dik_kejaksaan: 0, dik_kepolisian: 0, tut: 0, samples: [] },
    Terorisme: { lid_spdp: 0, dik_kejaksaan: 0, dik_kepolisian: 0, tut: 0, samples: [] },
    'Perkara Menarik Perhatian Masyarakat': { lid_spdp: 0, dik_kejaksaan: 0, dik_kepolisian: 0, tut: 0, samples: [] },
  };

  cases.forEach((item) => {
    const cat = classifyJampidumCase(item);
    
    // SPDP / Penyelidikan tahap awal
    stageCounts[cat].lid_spdp += 1;

    // P-21 / Berkas Lengkap (Tahap I / Penyidikan)
    if (item.tgl_p21) {
      stageCounts[cat].dik_kejaksaan += 1;
    }

    // Tahap 2 (Penyerahan tersangka & BB dari penyidik kepolisian)
    if (item.tahap_2) {
      stageCounts[cat].dik_kepolisian += 1;
    }

    // Penuntutan / Sidang / Eksekusi (P-31, P-42, Putusan, P-48)
    if (item.tgl_p31 || item.tgl_p42 || item.tgl_put_pertama || item.tgl_p48) {
      stageCounts[cat].tut += 1;
    }

    // Sample notes
    if (stageCounts[cat].samples.length < 3 && item.tdw) {
      stageCounts[cat].samples.push(`${item.tdw} (${item.ur_ipp})`);
    }
  });

  return categories.map((cat) => {
    const counts = stageCounts[cat];
    const notes = counts.samples.length > 0 
      ? `Data terintegrasi JAMPIDUM (${counts.lid_spdp} perkara terdaftar). Sampel: ${counts.samples.join('; ')}.` 
      : `Tidak ada perkara ${cat} yang tercatat pada tahun ${year}.`;

    return {
      id: `case-stats:${cat}:${year}`,
      category: cat,
      year,
      stages: {
        lid_spdp: counts.lid_spdp,
        dik_kejaksaan: counts.dik_kejaksaan,
        dik_kepolisian: counts.dik_kepolisian,
        tut: counts.tut,
      },
      notes,
      updatedAt: Date.now(),
    };
  });
}
