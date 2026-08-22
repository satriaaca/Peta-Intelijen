import { JampidumPerkara, CaseCategory, CaseStatEntry } from '../types';

export const SATKER_TABANAN = '22.08';
export const SATKER_NAME_TABANAN = 'Kejaksaan Negeri Tabanan';

export const JAMPIDUM_SATKER_LIST = [
  { code: '22.08', name: 'Kejaksaan Negeri Tabanan (22.08)' },
  { code: '22.00', name: 'Kejaksaan Tinggi Bali (22.00)' },
];

/**
 * Fallback verified live case snapshot for Kejaksaan Negeri Tabanan (2026)
 */
const DEFAULT_TABANAN_2026_CASES: JampidumPerkara[] = [
  {
    id_perkara: "22080020260119696da4e13262e",
    no_surat: "SPDP/03/RES.1.8./I/2026/SATRESKRIM",
    tgl_surat: "2026-01-17",
    ur_ipp: "POLRES TABANAN",
    undang_pasal: "tindak pidana Pencurian, sebagaimana dimaksud dalam Pasal 477 Ayat (1)Ke g KUHP",
    tgl_kejadian_perkara: "04-00-15-01-2026",
    tempat_kejadian: "Di depan bedeng areal proyek Villa, Jln. Raya Pantai Nyanyi, Beraban, Kediri, Tabanan",
    terima_spdp: "2026-01-19",
    spdp_kembali: null,
    tdw: "YOHANES NDARA BALI ;MATIUS MUDA KONDO",
    no_berkas: "BP/05/II/RES.1.8/2026/RESKRIM",
    tgl_p21: "2026-03-11",
    tahap_2: "2026-03-12",
    tgl_p31: "2026-03-26",
    tgl_p42: "2026-06-04",
    tgl_put_pertama: "2026-06-11",
    tgl_p48: null
  },
  {
    id_perkara: "22080020260119696da7b021959",
    no_surat: "SPDP/01 /1/RES. 1.11./2026/Unit Reskrim",
    tgl_surat: "2026-01-14",
    ur_ipp: "POLSEK KEDIRI",
    undang_pasal: "Tindak Pidana Penipuan atau penggelapan, Pasal 492 UU No. 1 Tahun 2023 KUHP",
    tgl_kejadian_perkara: "14-00-21-11-2025",
    tempat_kejadian: "Br. Jadi Babakan, Ds. Banjar Anyar, Kec. Kediri, Kab. Tabanan",
    terima_spdp: "2026-01-19",
    spdp_kembali: null,
    tdw: "DIKI DWI JANUARI",
    no_berkas: "BP/01/II/RES.1.11./2026/Unit Reskrim",
    tgl_p21: "2026-02-26",
    tahap_2: "2026-03-05",
    tgl_p31: "2026-03-11",
    tgl_p42: "2026-04-21",
    tgl_put_pertama: "2026-05-19",
    tgl_p48: "2026-05-26"
  },
  {
    id_perkara: "220800202601126964a77d9a324",
    no_surat: "SPDP/02/I/RES.4.2./2026/Satresnarkoba",
    tgl_surat: "2026-01-12",
    ur_ipp: "POLRES TABANAN",
    undang_pasal: "Pasal 609 ayat (1) Huruf a UU No 1 Tahun 2023 jo UU Narkotika No 35 Tahun 2009",
    tgl_kejadian_perkara: "13-35-12-01-2026",
    tempat_kejadian: "Jalan Rajawali no. 23, Banjar Malmundeh, Pandak Bandung, Kediri, Tabanan",
    terima_spdp: "2026-01-12",
    spdp_kembali: null,
    tdw: "WULANDARI SAFITRI alias WULAN ;I MADE DODI GUNAWAN",
    no_berkas: "BP/02/I/2026/Sat Res Narkoba",
    tgl_p21: "2026-03-09",
    tahap_2: "2026-03-12",
    tgl_p31: "2026-03-25",
    tgl_p42: "2026-03-12",
    tgl_put_pertama: "2026-05-11",
    tgl_p48: null
  },
  {
    id_perkara: "22080020260108695f45a186fa3",
    no_surat: "SPDP/01/I/RES.4.2/2026/Satresnarkoba",
    tgl_surat: "2026-01-08",
    ur_ipp: "POLRES TABANAN",
    undang_pasal: "Pasal 609 ayat (2) huruf a, UU Nomor 1 Tahun 2023 KUHP / Narkotika",
    tgl_kejadian_perkara: "15-00-03-01-2026",
    tempat_kejadian: "Jl. Jepun 1, Perum Cendana Asri, Br. Tegal Belodan, Dauh Peken, Tabanan",
    terima_spdp: "2026-01-08",
    spdp_kembali: null,
    tdw: "KADEK BUDIARSANA ;MADE KUSUMA PUTRA",
    no_berkas: "BP/01/I/2026/Sat Res Narkoba",
    tgl_p21: "2026-03-11",
    tahap_2: "2026-03-26",
    tgl_p31: "2026-03-31",
    tgl_p42: "2026-06-08",
    tgl_put_pertama: "2026-06-29",
    tgl_p48: null
  },
  {
    id_perkara: "220800202601136965bb0467699",
    no_surat: "B/SPDP/02/I/RES.1.24./2026/SATRESKRIM",
    tgl_surat: "2026-01-13",
    ur_ipp: "POLRES TABANAN",
    undang_pasal: "Tindak Pidana Persetubuhan Terhadap Anak / Cabul Terhadap Anak Pasal 473 Ayat (2) KUHP",
    tgl_kejadian_perkara: "02-00-13-12-2025",
    tempat_kejadian: "Br. Riang Gede, Ds. Riang, Kec/Kab. Tabanan",
    terima_spdp: "2026-01-13",
    spdp_kembali: null,
    tdw: "IDA BAGUS ALIT ANTARA",
    no_berkas: "BP/17/IV/RES.1.24./2026/Satreskrim",
    tgl_p21: "2026-04-20",
    tahap_2: "2026-04-30",
    tgl_p31: "2026-05-11",
    tgl_p42: null,
    tgl_put_pertama: null,
    tgl_p48: null
  },
  {
    id_perkara: "22080020260108695f4d416c767",
    no_surat: "SPDP/57/RES.1.8/XII/2025/SATRESKRIM",
    tgl_surat: "2025-12-25",
    ur_ipp: "POLRES TABANAN",
    undang_pasal: "Pasal 363 Ayat (1) ke-3 KUHP",
    tgl_kejadian_perkara: "05-20-25-12-2025",
    tempat_kejadian: "Warung Lamongsari 2 di Ir. Soekarno, Br. Dauh Pala, Dauh Peken, Tabanan",
    terima_spdp: "2026-01-05",
    spdp_kembali: null,
    tdw: "YUSUP",
    no_berkas: "BP/02/I/RES.1.8/2026/RESKRIM",
    tgl_p21: "2026-01-20",
    tahap_2: "2026-02-24",
    tgl_p31: "2026-03-03",
    tgl_p42: "2026-05-04",
    tgl_put_pertama: "2026-05-18",
    tgl_p48: null
  }
];

/**
 * Fetch case data from JAMPIDUM API via backend proxy, with multi-level fallbacks (CORS proxies, direct, cache, seed).
 */
export async function fetchJampidumCases(
  year: number = 2026,
  satker: string = SATKER_TABANAN
): Promise<{ data: JampidumPerkara[]; source: 'proxy' | 'cors_proxy' | 'direct' | 'cache' | 'seed'; timestamp: number }> {
  const cacheKey = `jampidum_cases_${satker}_${year}`;
  const cacheTimestampKey = `jampidum_last_sync_${satker}_${year}`;
  const directTargetUrl = `https://jampidum.kejaksaan.go.id/web/api/perkara/info/${year}/${satker}?_=${Date.now()}`;

  // 1. Try internal backend proxy endpoint first (/api/jampidum-perkara)
  try {
    const timestamp = Date.now();
    const res = await fetch(`/api/jampidum-perkara?year=${year}&satker=${satker}&_=${timestamp}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json && Array.isArray(json.data) && json.data.length > 0) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(json.data));
          localStorage.setItem(cacheTimestampKey, timestamp.toString());
        } catch {}
        return { data: json.data, source: 'proxy', timestamp };
      }
    }
  } catch (proxyErr) {
    console.warn('Backend proxy fetch failed:', proxyErr);
  }

  // 2. Try AllOrigins CORS proxy fallback
  try {
    const corsUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(directTargetUrl)}`;
    const corsRes = await fetch(corsUrl);
    if (corsRes.ok) {
      const corsJson = await corsRes.json();
      if (corsJson && Array.isArray(corsJson.data) && corsJson.data.length > 0) {
        const timestamp = Date.now();
        try {
          localStorage.setItem(cacheKey, JSON.stringify(corsJson.data));
          localStorage.setItem(cacheTimestampKey, timestamp.toString());
        } catch {}
        return { data: corsJson.data, source: 'cors_proxy', timestamp };
      }
    }
  } catch (corsErr) {
    console.warn('AllOrigins CORS proxy fetch failed:', corsErr);
  }

  // 3. Direct external fetch fallback
  try {
    const directRes = await fetch(directTargetUrl);
    if (directRes.ok) {
      const directJson = await directRes.json();
      if (directJson && Array.isArray(directJson.data) && directJson.data.length > 0) {
        const timestamp = Date.now();
        try {
          localStorage.setItem(cacheKey, JSON.stringify(directJson.data));
          localStorage.setItem(cacheTimestampKey, timestamp.toString());
        } catch {}
        return { data: directJson.data, source: 'direct', timestamp };
      }
    }
  } catch (directErr) {
    console.warn('Direct fetch failed:', directErr);
  }

  // 4. Fallback to localStorage cache
  try {
    const cachedStr = localStorage.getItem(cacheKey);
    const cachedTs = parseInt(localStorage.getItem(cacheTimestampKey) || '0', 10);
    if (cachedStr) {
      const cachedData = JSON.parse(cachedStr);
      if (Array.isArray(cachedData) && cachedData.length > 0) {
        return { data: cachedData, source: 'cache', timestamp: cachedTs || Date.now() };
      }
    }
  } catch {}

  // 5. High-fidelity default verified seed
  return {
    data: DEFAULT_TABANAN_2026_CASES,
    source: 'seed',
    timestamp: Date.now(),
  };
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
