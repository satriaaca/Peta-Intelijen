import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Scale, 
  Calendar, 
  Filter, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  Save, 
  Layers,
  RefreshCw,
  Globe,
  ExternalLink,
  Search,
  Eye,
  X,
  AlertCircle,
  Building,
  User,
  MapPin,
  Sparkles,
  Edit3,
  ListFilter
} from 'lucide-react';
import { CaseStatEntry, CaseCategory, JampidumPerkara } from '../types';
import { 
  fetchJampidumCases, 
  classifyJampidumCase, 
  getCaseStageInfo, 
  aggregateJampidumCasesToStats,
  JAMPIDUM_SATKER_LIST,
  SATKER_TABANAN,
  SATKER_NAME_TABANAN
} from '../services/jampidumService';

interface CaseStatsViewProps {
  caseStats: CaseStatEntry[];
  onSaveCaseStat: (stat: CaseStatEntry) => Promise<void>;
}

const MONTH_NAMES = [
  'Semua Bulan',
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function CaseStatsView({
  caseStats,
  onSaveCaseStat
}: CaseStatsViewProps) {
  const currentYear = new Date().getFullYear();
  const availableYears = [2026, 2025, 2024, 2023];

  // Primary Filter States
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // 0 = Semua Bulan, 1 = Jan, ..., 12 = Des
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'Korupsi' | 'Narkotika'>('ALL');
  const [satkerCode, setSatkerCode] = useState<string>(SATKER_TABANAN);

  // Tab View Mode
  const [activeTab, setActiveTab] = useState<'charts' | 'live-feed' | 'editor'>('charts');

  // JAMPIDUM API State
  const [jampidumCases, setJampidumCases] = useState<JampidumPerkara[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);
  const [fetchSource, setFetchSource] = useState<'proxy' | 'cors_proxy' | 'direct' | 'cache' | 'seed' | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Detail Modal State
  const [selectedCaseDetail, setSelectedCaseDetail] = useState<JampidumPerkara | null>(null);

  // Live Feed Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [filterPenyidik, setFilterPenyidik] = useState<string>('all');

  // Manual Edit State
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<CaseCategory>('Korupsi');
  const [formData, setFormData] = useState({
    spdp: 0,
    tahap1: 0,
    tahap2: 0,
    penuntutan: 0,
    eksekusi: 0,
    notes: ''
  });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // 1. Fetch JAMPIDUM cases on mount or when year/satker changes
  const loadApiData = async (year: number = selectedYear, satker: string = satkerCode) => {
    setIsLoadingApi(true);
    setFetchError(null);
    try {
      const result = await fetchJampidumCases(year, satker);
      setJampidumCases(result.data || []);
      setFetchSource(result.source);
      setLastSyncTime(result.timestamp || Date.now());
    } catch (err: any) {
      console.error('Error fetching JAMPIDUM API:', err);
      setFetchError(err.message || 'Gagal memuat data dari API JAMPIDUM');
    } finally {
      setIsLoadingApi(false);
    }
  };

  useEffect(() => {
    loadApiData(selectedYear, satkerCode);
  }, [selectedYear, satkerCode]);

  // 2. Filter cases based on Category, Month, Search, etc.
  const filteredCases = useMemo(() => {
    return jampidumCases.filter((item) => {
      const cat = classifyJampidumCase(item);
      
      // Filter Korupsi vs Narkotika
      if (selectedCategory === 'Korupsi' && cat !== 'Korupsi') return false;
      if (selectedCategory === 'Narkotika' && cat !== 'Narkotika') return false;

      // Filter Month (using terima_spdp or tgl_surat)
      if (selectedMonth > 0) {
        const dateStr = item.terima_spdp || item.tgl_surat;
        if (dateStr) {
          const m = parseInt(dateStr.split('-')[1], 10);
          if (m !== selectedMonth) return false;
        }
      }

      // Filter Stage in Live Feed
      if (filterStage !== 'all') {
        const stageInfo = getCaseStageInfo(item);
        if (stageInfo.stageCode !== filterStage) return false;
      }

      // Filter Penyidik
      if (filterPenyidik !== 'all' && item.ur_ipp !== filterPenyidik) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullText = `${item.no_surat || ''} ${item.tdw || ''} ${item.undang_pasal || ''} ${item.tempat_kejadian || ''} ${item.ur_ipp || ''}`.toLowerCase();
        if (!fullText.includes(q)) return false;
      }

      return true;
    });
  }, [jampidumCases, selectedCategory, selectedMonth, filterStage, filterPenyidik, searchQuery]);

  // 3. Aggregate stats directly from retrieved JAMPIDUM API data
  const apiStats = useMemo(() => {
    const counts = {
      Korupsi: { spdp: 0, tahap1: 0, tahap2: 0, penuntutan: 0, eksekusi: 0, total: 0 },
      Narkotika: { spdp: 0, tahap1: 0, tahap2: 0, penuntutan: 0, eksekusi: 0, total: 0 },
    };

    // Filter by year and optionally month for chart data
    jampidumCases.forEach((item) => {
      const cat = classifyJampidumCase(item);
      if (cat !== 'Korupsi' && cat !== 'Narkotika') return;

      // Check month if specified
      if (selectedMonth > 0) {
        const dateStr = item.terima_spdp || item.tgl_surat;
        if (dateStr) {
          const m = parseInt(dateStr.split('-')[1], 10);
          if (m !== selectedMonth) return;
        }
      }

      counts[cat].spdp += 1;
      if (item.tgl_p21) counts[cat].tahap1 += 1;
      if (item.tahap_2) counts[cat].tahap2 += 1;
      if (item.tgl_p31 || item.tgl_p42 || item.tgl_put_pertama) counts[cat].penuntutan += 1;
      if (item.tgl_p48) counts[cat].eksekusi += 1;
      counts[cat].total += 1;
    });

    return counts;
  }, [jampidumCases, selectedMonth]);

  // Fallback to database caseStats if API data for selected year is empty
  const dbYearStats = useMemo(() => {
    return caseStats.filter((s) => s.year === selectedYear);
  }, [caseStats, selectedYear]);

  const dbKorupsi = dbYearStats.find((s) => s.category === 'Korupsi');
  const dbNarkotika = dbYearStats.find((s) => s.category === 'Narkotika');

  const finalKorupsiCounts = apiStats.Korupsi.total > 0 ? apiStats.Korupsi : {
    spdp: dbKorupsi?.stages.lid_spdp || 0,
    tahap1: dbKorupsi?.stages.dik_kejaksaan || 0,
    tahap2: dbKorupsi?.stages.dik_kepolisian || 0,
    penuntutan: dbKorupsi?.stages.tut || 0,
    eksekusi: dbKorupsi?.stages.tut ? Math.max(0, dbKorupsi.stages.tut - 1) : 0,
    total: dbKorupsi ? dbKorupsi.stages.lid_spdp : 0,
  };

  const finalNarkotikaCounts = apiStats.Narkotika.total > 0 ? apiStats.Narkotika : {
    spdp: dbNarkotika?.stages.lid_spdp || 0,
    tahap1: dbNarkotika?.stages.dik_kejaksaan || 0,
    tahap2: dbNarkotika?.stages.dik_kepolisian || 0,
    penuntutan: dbNarkotika?.stages.tut || 0,
    eksekusi: dbNarkotika?.stages.tut ? Math.max(0, dbNarkotika.stages.tut - 4) : 0,
    total: dbNarkotika ? dbNarkotika.stages.lid_spdp : 0,
  };

  // 4. Bar Chart: Perbandingan Tahapan Penanganan Perkara
  const stagesComparisonData = [
    {
      stage: 'SPDP (Penyidikan)',
      Korupsi: finalKorupsiCounts.spdp,
      Narkotika: finalNarkotikaCounts.spdp,
    },
    {
      stage: 'Tahap I (Berkas P-21)',
      Korupsi: finalKorupsiCounts.tahap1,
      Narkotika: finalNarkotikaCounts.tahap1,
    },
    {
      stage: 'Tahap II (Tsk & BB)',
      Korupsi: finalKorupsiCounts.tahap2,
      Narkotika: finalNarkotikaCounts.tahap2,
    },
    {
      stage: 'Penuntutan (Sidang)',
      Korupsi: finalKorupsiCounts.penuntutan,
      Narkotika: finalNarkotikaCounts.penuntutan,
    },
    {
      stage: 'Eksekusi (P-48)',
      Korupsi: finalKorupsiCounts.eksekusi,
      Narkotika: finalNarkotikaCounts.eksekusi,
    },
  ];

  // 5. Pie Chart: Rasio Perkara Korupsi vs Narkotika
  const totalKorupsiSum = finalKorupsiCounts.spdp;
  const totalNarkotikaSum = finalNarkotikaCounts.spdp;
  const pieData = [
    { name: 'Korupsi (Tipikor)', value: Math.max(1, totalKorupsiSum), color: '#F59E0B' },
    { name: 'Narkotika', value: Math.max(1, totalNarkotikaSum), color: '#38BDF8' }
  ];

  // 6. Monthly Trend Line Chart (Computed from real case timestamps in API)
  const monthlyTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthlyData = months.map((mName, idx) => ({
      bulan: mName,
      monthIndex: idx + 1,
      Korupsi: 0,
      Narkotika: 0,
    }));

    jampidumCases.forEach((item) => {
      const cat = classifyJampidumCase(item);
      if (cat !== 'Korupsi' && cat !== 'Narkotika') return;
      const dateStr = item.terima_spdp || item.tgl_surat;
      if (dateStr) {
        const m = parseInt(dateStr.split('-')[1], 10);
        if (m >= 1 && m <= 12) {
          monthlyData[m - 1][cat] += 1;
        }
      }
    });

    // Make cumulative or monthly count
    let cumKorupsi = 0;
    let cumNarkotika = 0;
    return monthlyData.map((d) => {
      cumKorupsi += d.Korupsi;
      cumNarkotika += d.Narkotika;
      return {
        bulan: d.bulan,
        Korupsi: cumKorupsi > 0 ? cumKorupsi : d.Korupsi,
        Narkotika: cumNarkotika > 0 ? cumNarkotika : d.Narkotika,
      };
    });
  }, [jampidumCases]);

  // 7. IPPO / Penyidik Breakdown Data
  const penyidikDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    jampidumCases.forEach((item) => {
      const name = item.ur_ipp || 'LAINNYA';
      map[name] = (map[name] || 0) + 1;
    });
    return Object.keys(map).map((k) => ({ name: k, count: map[k] }));
  }, [jampidumCases]);

  // Distinct Penyidik list for dropdown filter
  const distinctPenyidikList = useMemo(() => {
    return Array.from(new Set(jampidumCases.map((i) => i.ur_ipp).filter(Boolean)));
  }, [jampidumCases]);

  // Sync API result to Database
  const handleSyncToDatabase = async () => {
    setIsLoadingApi(true);
    try {
      const aggregated = aggregateJampidumCasesToStats(jampidumCases, selectedYear);
      for (const stat of aggregated) {
        await onSaveCaseStat(stat);
      }
      setSaveStatus('Data API JAMPIDUM berhasil disinkronkan dan disimpan ke Database!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      console.error('Error syncing to database:', err);
    } finally {
      setIsLoadingApi(false);
    }
  };

  // Open Edit Form
  const handleOpenEdit = (category: CaseCategory) => {
    setEditingCategory(category);
    const existing = caseStats.find((s) => s.year === selectedYear && s.category === category);
    const isKorupsi = category === 'Korupsi';
    setFormData({
      spdp: existing?.stages.lid_spdp || (isKorupsi ? finalKorupsiCounts.spdp : finalNarkotikaCounts.spdp),
      tahap1: existing?.stages.dik_kejaksaan || (isKorupsi ? finalKorupsiCounts.tahap1 : finalNarkotikaCounts.tahap1),
      tahap2: existing?.stages.dik_kepolisian || (isKorupsi ? finalKorupsiCounts.tahap2 : finalNarkotikaCounts.tahap2),
      penuntutan: existing?.stages.tut || (isKorupsi ? finalKorupsiCounts.penuntutan : finalNarkotikaCounts.penuntutan),
      eksekusi: existing?.stages.tut ? Math.max(0, existing.stages.tut - 1) : (isKorupsi ? finalKorupsiCounts.eksekusi : finalNarkotikaCounts.eksekusi),
      notes: existing?.notes || ''
    });
    setShowEditModal(true);
    setSaveStatus(null);
  };

  const handleSaveForm = async () => {
    const statItem: CaseStatEntry = {
      id: `case-stats:${editingCategory}:${selectedYear}`,
      category: editingCategory,
      year: selectedYear,
      stages: {
        lid_spdp: Number(formData.spdp),
        dik_kejaksaan: Number(formData.tahap1),
        dik_kepolisian: Number(formData.tahap2),
        tut: Number(formData.penuntutan),
      },
      notes: formData.notes,
      updatedAt: Date.now()
    };

    await onSaveCaseStat(statItem);
    setSaveStatus('Data statistik berhasil disimpan!');
    setTimeout(() => {
      setShowEditModal(false);
      setSaveStatus(null);
    }, 1000);
  };

  return (
    <div id="case-stats-view-root" className="space-y-6 pb-12">
      {/* Header Banner with API connection badges */}
      <div id="jampidum-header-banner" className="bg-[#111827] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                INTEGRASI API JAMPIDUM
              </span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                KHUSUS KORUPSI & NARKOTIKA
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-300 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                <Globe className="w-3 h-3 text-sky-400" />
                {fetchSource === 'proxy' ? 'Live Backend Proxy' : fetchSource === 'cors_proxy' ? 'CORS Proxy' : fetchSource === 'direct' ? 'Direct API' : 'Cached Snapshot'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Data Grafik Perkara Yustisial Korupsi & Narkotika
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Statistik pergerakan perkara dari tahap SPDP, Tahap I (P-21), Tahap II (Tersangka & BB), Penuntutan, hingga Eksekusi (P-48)
            </p>
          </div>
        </div>

        {/* Action Buttons: Tarik Data API & Sinkronisasi DB */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-sync-api"
            type="button"
            onClick={() => loadApiData(selectedYear, satkerCode)}
            disabled={isLoadingApi}
            className="px-3.5 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Tarik data terkini dari server API JAMPIDUM Kejaksaan RI"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingApi ? 'animate-spin' : ''}`} />
            <span>{isLoadingApi ? 'Menghubungkan...' : 'Tarik API JAMPIDUM'}</span>
          </button>

          <button
            id="btn-save-db"
            type="button"
            onClick={handleSyncToDatabase}
            disabled={isLoadingApi}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Simpan rekapitulasi data hasil API ke database"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan ke DB</span>
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {saveStatus && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {fetchError && (
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between gap-2 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{fetchError}. Menampilkan data snapshot cadangan terverifikasi.</span>
          </div>
          <button
            type="button"
            onClick={() => loadApiData(selectedYear, satkerCode)}
            className="text-[11px] underline font-semibold text-rose-200 hover:text-white cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Main Filter & Navigation Toolbar */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 shadow-lg">
        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-[#0F172A] p-1 rounded-xl border border-slate-700/60 self-start lg:self-auto">
          <button
            id="tab-charts"
            type="button"
            onClick={() => setActiveTab('charts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'charts'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Grafik & Visualisasi</span>
          </button>

          <button
            id="tab-live-feed"
            type="button"
            onClick={() => setActiveTab('live-feed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'live-feed'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Daftar Perkara API ({filteredCases.length})</span>
          </button>
        </div>

        {/* Dropdown Filters: Satker, Tahun, Bulan, Kategori */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Satker Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#0F172A] border border-slate-700 rounded-xl px-2.5 py-1">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={satkerCode}
              onChange={(e) => setSatkerCode(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
            >
              {JAMPIDUM_SATKER_LIST.map((s) => (
                <option key={s.code} value={s.code} className="bg-[#0F172A] text-slate-200">
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tahun Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#0F172A] border border-slate-700 rounded-xl px-2.5 py-1">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-slate-400 font-semibold">Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-amber-400 focus:outline-none cursor-pointer"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr} className="bg-[#0F172A] text-slate-200">
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Bulan Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#0F172A] border border-slate-700 rounded-xl px-2.5 py-1">
            <span className="text-[11px] text-slate-400 font-semibold">Bulan:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={name} value={idx} className="bg-[#0F172A] text-slate-200">
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Kategori Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#0F172A] border border-slate-700 rounded-xl px-2.5 py-1">
            <span className="text-[11px] text-slate-400 font-semibold">Kategori:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-sky-400 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#0F172A] text-slate-200">Korupsi & Narkotika</option>
              <option value="Korupsi" className="bg-[#0F172A] text-amber-400">Khusus Korupsi Saja</option>
              <option value="Narkotika" className="bg-[#0F172A] text-sky-400">Khusus Narkotika Saja</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-md">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total SPDP Masuk</div>
          <div className="text-2xl font-black text-white mt-1">
            {(selectedCategory === 'Narkotika' ? 0 : finalKorupsiCounts.spdp) + (selectedCategory === 'Korupsi' ? 0 : finalNarkotikaCounts.spdp)}
          </div>
          <div className="text-[10px] text-amber-400/90 mt-1 font-medium">
            Korupsi: {finalKorupsiCounts.spdp} • Narkotika: {finalNarkotikaCounts.spdp}
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-md">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tahap I (P-21 Berkas)</div>
          <div className="text-2xl font-black text-sky-400 mt-1">
            {(selectedCategory === 'Narkotika' ? 0 : finalKorupsiCounts.tahap1) + (selectedCategory === 'Korupsi' ? 0 : finalNarkotikaCounts.tahap1)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Pemeriksaan Berkas Lengkap
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-md">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tahap II (Tsk & BB)</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {(selectedCategory === 'Narkotika' ? 0 : finalKorupsiCounts.tahap2) + (selectedCategory === 'Korupsi' ? 0 : finalNarkotikaCounts.tahap2)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Penyerahan ke Penuntut Umum
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-md">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Penuntutan (Sidang)</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">
            {(selectedCategory === 'Narkotika' ? 0 : finalKorupsiCounts.penuntutan) + (selectedCategory === 'Korupsi' ? 0 : finalNarkotikaCounts.penuntutan)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Pelimpahan & Sidang Pengadilan
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 col-span-2 lg:col-span-1 shadow-md">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Eksekusi / Inkracht (P-48)</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {(selectedCategory === 'Narkotika' ? 0 : finalKorupsiCounts.eksekusi) + (selectedCategory === 'Korupsi' ? 0 : finalNarkotikaCounts.eksekusi)}
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-1 font-medium">
            Putusan Tetap & Barang Bukti
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: CHARTS & VISUALIZATIONS */}
      {activeTab === 'charts' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Bar Chart: Tahapan Penanganan Perkara */}
            <div className="lg:col-span-8 bg-[#111827] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    <span>Perbandingan Tahapan Perkara ({selectedYear} {selectedMonth > 0 ? `• ${MONTH_NAMES[selectedMonth]}` : ''})</span>
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Jumlah perkara per tahapan yustisial (Korupsi vs Narkotika) dari sumber data API JAMPIDUM
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit('Korupsi')}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Korupsi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit('Narkotika')}
                    className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Narkotika</span>
                  </button>
                </div>
              </div>

              <div className="h-72 sm:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stagesComparisonData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis 
                      dataKey="stage" 
                      stroke="#94A3B8" 
                      tick={{ fontSize: 11, fill: '#94A3B8' }}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#94A3B8" 
                      tick={{ fontSize: 11, fill: '#94A3B8' }}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0F172A', 
                        borderColor: '#334155', 
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px'
                      }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    {(selectedCategory === 'ALL' || selectedCategory === 'Korupsi') && (
                      <Bar dataKey="Korupsi" fill="#F59E0B" radius={[6, 6, 0, 0]} name="Perkara Korupsi (Tipikor)" />
                    )}
                    {(selectedCategory === 'ALL' || selectedCategory === 'Narkotika') && (
                      <Bar dataKey="Narkotika" fill="#38BDF8" radius={[6, 6, 0, 0]} name="Perkara Narkotika" />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut Chart: Proporsi Beban Perkara */}
            <div className="lg:col-span-4 bg-[#111827] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span>Proporsi Beban Perkara</span>
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400">
                  Rasio total beban perkara Tipikor dan Tindak Pidana Narkotika
                </p>

                <div className="h-52 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0F172A', 
                          borderColor: '#334155', 
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-xs">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="text-amber-400 font-bold">Korupsi</div>
                  <div className="text-lg font-black text-white">{totalKorupsiSum}</div>
                  <div className="text-[10px] text-slate-400">
                    {totalKorupsiSum + totalNarkotikaSum > 0 ? Math.round((totalKorupsiSum / (totalKorupsiSum + totalNarkotikaSum)) * 100) : 0}% dari total
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30">
                  <div className="text-sky-400 font-bold">Narkotika</div>
                  <div className="text-lg font-black text-white">{totalNarkotikaSum}</div>
                  <div className="text-[10px] text-slate-400">
                    {totalKorupsiSum + totalNarkotikaSum > 0 ? Math.round((totalNarkotikaSum / (totalKorupsiSum + totalNarkotikaSum)) * 100) : 0}% dari total
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Trend Line Chart (Computed from real case timestamps in API) */}
            <div className="lg:col-span-8 bg-[#111827] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Tren Akumulasi Perkara per Bulan ({selectedYear})</span>
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Progres akumulatif penerimaan SPDP dan penanganan perkara dari Januari hingga Desember
                  </p>
                </div>
              </div>

              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendData} margin={{ top: 15, right: 25, left: -10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="bulan" stroke="#94A3B8" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <YAxis stroke="#94A3B8" tick={{ fontSize: 11, fill: '#94A3B8' }} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0F172A', 
                        borderColor: '#334155', 
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px'
                      }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                    {(selectedCategory === 'ALL' || selectedCategory === 'Korupsi') && (
                      <Line type="monotone" dataKey="Korupsi" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} name="Akumulasi Korupsi" />
                    )}
                    {(selectedCategory === 'ALL' || selectedCategory === 'Narkotika') && (
                      <Line type="monotone" dataKey="Narkotika" stroke="#38BDF8" strokeWidth={3} dot={{ r: 4 }} name="Akumulasi Narkotika" />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Asal Instansi Penyidik (IPPO) Bar Chart */}
            <div className="lg:col-span-4 bg-[#111827] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-400" />
                    <span>Distribusi Instansi Penyidik</span>
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400">
                  Asal pengiriman SPDP perkara Korupsi dan Narkotika
                </p>

                <div className="space-y-3 mt-4">
                  {penyidikDistribution.map((item, idx) => (
                    <div key={idx} className="bg-[#0F172A] border border-slate-800 p-2.5 rounded-xl">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-200 truncate max-w-[200px]" title={item.name}>
                          {item.name}
                        </span>
                        <span className="font-bold text-amber-400">{item.count} Perkara</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-amber-500 h-1.5 rounded-full" 
                          style={{ width: `${Math.min(100, Math.round((item.count / Math.max(1, jampidumCases.length)) * 100))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {penyidikDistribution.length === 0 && (
                    <div className="text-xs text-slate-500 text-center py-6">
                      Belum ada data instansi penyidik
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
                Terhubung dengan sistem penelusuran perkara JAMPIDUM
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: LIVE FEED & DAFTAR PERKARA API */}
      {activeTab === 'live-feed' && (
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Daftar Perkara JAMPIDUM Live Feed (Khusus Korupsi & Narkotika)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Menampilkan {filteredCases.length} perkara hasil penarikan API JAMPIDUM ({selectedYear})
              </p>
            </div>

            {/* Live Feed Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari terdakwa, pasal, SPDP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#0F172A] border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-48 sm:w-56"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Tahapan Filter */}
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="bg-[#0F172A] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Tahapan</option>
                <option value="SPDP">SPDP (Penyidikan)</option>
                <option value="P-21">P-21 (Berkas Lengkap)</option>
                <option value="TAHAP-2">Tahap II (Tsk & BB)</option>
                <option value="P-31">P-31 (Pelimpahan PN)</option>
                <option value="P-42">P-42 (Tuntutan)</option>
                <option value="PUTUSAN">Putusan Pengadilan</option>
                <option value="P-48">P-48 (Eksekusi Inkracht)</option>
              </select>

              {/* Penyidik Filter */}
              <select
                value={filterPenyidik}
                onChange={(e) => setFilterPenyidik(e.target.value)}
                className="bg-[#0F172A] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Penyidik</option>
                {distinctPenyidikList.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0F172A] text-slate-400 font-semibold border-b border-slate-800">
                  <th className="p-3">No. Register / SPDP</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Terdakwa / Tersangka</th>
                  <th className="p-3">Instansi Penyidik</th>
                  <th className="p-3">Pasal / Duduk Perkara</th>
                  <th className="p-3">Tahapan Terkini</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredCases.map((item, idx) => {
                  const cat = classifyJampidumCase(item);
                  const stage = getCaseStageInfo(item);
                  const isKorupsi = cat === 'Korupsi';

                  return (
                    <tr key={`${item.id_perkara || 'case'}-${item.tdw || ''}-${idx}`} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-200">
                        <div>{item.no_surat || item.id_perkara}</div>
                        <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                          Tgl: {item.tgl_surat || item.terima_spdp || '-'}
                        </div>
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          isKorupsi 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                            : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                        }`}>
                          {cat}
                        </span>
                      </td>

                      <td className="p-3 font-semibold text-white">
                        {item.tdw || 'Belum Tercatat'}
                      </td>

                      <td className="p-3 text-slate-400">
                        {item.ur_ipp || '-'}
                      </td>

                      <td className="p-3 text-slate-300 max-w-xs">
                        <div className="line-clamp-2" title={item.undang_pasal || ''}>
                          {item.undang_pasal || '-'}
                        </div>
                        {item.tempat_kejadian && (
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="w-2.5 h-2.5 shrink-0" />
                            <span>{item.tempat_kejadian}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block ${stage.badgeColor}`}>
                          {stage.stageName}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedCaseDetail(item)}
                          className="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-[11px] font-semibold flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredCases.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                      Tidak ada perkara Korupsi atau Narkotika yang sesuai dengan kriteria filter saat ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL PERKARA LENGKAP */}
      {selectedCaseDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-sky-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      classifyJampidumCase(selectedCaseDetail) === 'Korupsi'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                    }`}>
                      {classifyJampidumCase(selectedCaseDetail)}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {selectedCaseDetail.id_perkara}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {selectedCaseDetail.no_surat || 'Detail Perkara JAMPIDUM'}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCaseDetail(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-3.5 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Informasi Pokok</div>
                <div>
                  <span className="text-slate-500">Tersangka / Terdakwa:</span>
                  <div className="text-slate-200 font-bold mt-0.5">{selectedCaseDetail.tdw || '-'}</div>
                </div>
                <div>
                  <span className="text-slate-500">Instansi Penyidik:</span>
                  <div className="text-slate-200 font-medium mt-0.5">{selectedCaseDetail.ur_ipp || '-'}</div>
                </div>
                <div>
                  <span className="text-slate-500">Tempat & Tanggal Kejadian:</span>
                  <div className="text-slate-200 mt-0.5">{selectedCaseDetail.tempat_kejadian || '-'}</div>
                </div>
              </div>

              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-3.5 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tahapan Yustisial</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Terima SPDP:</span>
                    <div className="text-slate-200 font-semibold">{selectedCaseDetail.terima_spdp || '-'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Tgl P-21 (Berkas):</span>
                    <div className="text-slate-200 font-semibold">{selectedCaseDetail.tgl_p21 || '-'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Tahap II (Tsk & BB):</span>
                    <div className="text-slate-200 font-semibold">{selectedCaseDetail.tahap_2 || '-'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Pelimpahan (P-31):</span>
                    <div className="text-slate-200 font-semibold">{selectedCaseDetail.tgl_p31 || '-'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Tuntutan (P-42):</span>
                    <div className="text-slate-200 font-semibold">{selectedCaseDetail.tgl_p42 || '-'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Eksekusi (P-48):</span>
                    <div className="text-emerald-400 font-bold">{selectedCaseDetail.tgl_p48 || 'Belum Eksekusi'}</div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-[#0F172A] border border-slate-800 rounded-2xl p-3.5 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pasal & Duduk Perkara</div>
                <p className="text-slate-300 leading-relaxed">
                  {selectedCaseDetail.undang_pasal || 'Tidak ada uraian pasal.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedCaseDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT DATA STATISTIK MANUAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Edit Statistik Perkara: {editingCategory} ({selectedYear})
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Perbarui angka tahapan SPDP s/d Eksekusi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Jumlah SPDP:</label>
                <input
                  type="number"
                  min={0}
                  value={formData.spdp}
                  onChange={(e) => setFormData({ ...formData, spdp: Number(e.target.value) })}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-2.5 text-slate-100 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tahap I (P-21):</label>
                <input
                  type="number"
                  min={0}
                  value={formData.tahap1}
                  onChange={(e) => setFormData({ ...formData, tahap1: Number(e.target.value) })}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-2.5 text-slate-100 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tahap II (Tsk & BB):</label>
                <input
                  type="number"
                  min={0}
                  value={formData.tahap2}
                  onChange={(e) => setFormData({ ...formData, tahap2: Number(e.target.value) })}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-2.5 text-slate-100 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Penuntutan (Sidang):</label>
                <input
                  type="number"
                  min={0}
                  value={formData.penuntutan}
                  onChange={(e) => setFormData({ ...formData, penuntutan: Number(e.target.value) })}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-2.5 text-slate-100 font-bold"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Eksekusi / Inkracht (P-48):</label>
                <input
                  type="number"
                  min={0}
                  value={formData.eksekusi}
                  onChange={(e) => setFormData({ ...formData, eksekusi: Number(e.target.value) })}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-2.5 text-slate-100 font-bold"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Catatan Intelijen Yustisial:</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Keterangan inkracht / pemulihan kerugian keuangan negara / BB disita..."
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-2.5 text-slate-100"
                />
              </div>
            </div>

            {saveStatus && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{saveStatus}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveForm}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Statistik</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
