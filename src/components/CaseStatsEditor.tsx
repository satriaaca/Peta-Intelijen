import { useState, useEffect, useMemo } from 'react';
import { 
  Scale, 
  Save, 
  CheckCircle2, 
  Plus, 
  Layers,
  RefreshCw,
  Globe,
  ExternalLink,
  Search,
  Filter,
  Eye,
  X,
  AlertCircle,
  FileText,
  Building,
  User,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';
import { CaseStatEntry, CaseCategory, JampidumPerkara } from '../types';
import { 
  fetchJampidumCases, 
  classifyJampidumCase, 
  getCaseStageInfo, 
  aggregateJampidumCasesToStats,
  JAMPIDUM_SATKER_LIST,
  SATKER_TABANAN
} from '../services/jampidumService';

interface CaseStatsEditorProps {
  caseStats: CaseStatEntry[];
  onSaveCaseStat: (stat: CaseStatEntry) => Promise<void>;
}

export const CASE_CATEGORIES: CaseCategory[] = [
  'Korupsi',
  'Narkotika',
  'Terorisme',
  'Perkara Menarik Perhatian Masyarakat',
];

export default function CaseStatsEditor({
  caseStats,
  onSaveCaseStat,
}: CaseStatsEditorProps) {
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(new Set(caseStats.map((s) => s.year))).sort((a, b) => b - a);
  if (!availableYears.includes(currentYear)) {
    availableYears.unshift(currentYear);
  }

  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0] || currentYear);
  const [newYearInput, setNewYearInput] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'live-feed'>('matrix');

  // JAMPIDUM API state
  const [satkerCode, setSatkerCode] = useState<string>(SATKER_TABANAN);
  const [jampidumCases, setJampidumCases] = useState<JampidumPerkara[]>([]);
  const [isFetchingJampidum, setIsFetchingJampidum] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [fetchSource, setFetchSource] = useState<'proxy' | 'direct' | 'cache' | null>(null);

  // Selected Jampidum case for detail modal
  const [selectedCaseDetail, setSelectedCaseDetail] = useState<JampidumPerkara | null>(null);

  // Explorer filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [filterPenyidik, setFilterPenyidik] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Local form state for all 4 categories for the selected year
  const getStatsForCategoryWithYear = (year: number, cat: CaseCategory) => {
    const found = caseStats.find((s) => s.year === year && s.category === cat);
    if (found) {
      return {
        lid_spdp: found.stages.lid_spdp,
        dik_kejaksaan: found.stages.dik_kejaksaan,
        dik_kepolisian: found.stages.dik_kepolisian,
        tut: found.stages.tut,
        notes: found.notes || '',
      };
    }
    return {
      lid_spdp: 0,
      dik_kejaksaan: 0,
      dik_kepolisian: 0,
      tut: 0,
      notes: '',
    };
  };

  const [localFormData, setLocalFormData] = useState<Record<CaseCategory, {
    lid_spdp: number;
    dik_kejaksaan: number;
    dik_kepolisian: number;
    tut: number;
    notes: string;
  }>>({
    Korupsi: getStatsForCategoryWithYear(selectedYear, 'Korupsi'),
    Narkotika: getStatsForCategoryWithYear(selectedYear, 'Narkotika'),
    Terorisme: getStatsForCategoryWithYear(selectedYear, 'Terorisme'),
    'Perkara Menarik Perhatian Masyarakat': getStatsForCategoryWithYear(selectedYear, 'Perkara Menarik Perhatian Masyarakat'),
  });

  // Handle year change
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setLocalFormData({
      Korupsi: getStatsForCategoryWithYear(year, 'Korupsi'),
      Narkotika: getStatsForCategoryWithYear(year, 'Narkotika'),
      Terorisme: getStatsForCategoryWithYear(year, 'Terorisme'),
      'Perkara Menarik Perhatian Masyarakat': getStatsForCategoryWithYear(year, 'Perkara Menarik Perhatian Masyarakat'),
    });
    // Trigger fetch for that year
    loadJampidumData(year, satkerCode);
  };

  // Fetch JAMPIDUM data
  const loadJampidumData = async (year: number = selectedYear, satker: string = satkerCode) => {
    setIsFetchingJampidum(true);
    setFetchError(null);
    try {
      const result = await fetchJampidumCases(year, satker);
      setJampidumCases(result.data);
      setLastSyncTime(result.timestamp);
      setFetchSource(result.source);
    } catch (err: any) {
      console.error('JAMPIDUM fetch error:', err);
      setFetchError(err.message || 'Gagal memuat data dari JAMPIDUM');
    } finally {
      setIsFetchingJampidum(false);
    }
  };

  // Initial load of JAMPIDUM data on component mount
  useEffect(() => {
    loadJampidumData(selectedYear, satkerCode);
  }, []);

  // Auto-sync JAMPIDUM cases into local form data and persist
  const handleAutoSyncFromJampidum = async () => {
    if (!jampidumCases || jampidumCases.length === 0) {
      alert('Belum ada data JAMPIDUM yang dimuat. Silakan tarik data terlebih dahulu.');
      return;
    }

    const aggregated = aggregateJampidumCasesToStats(jampidumCases, selectedYear);
    
    // Update local state
    const newLocal: any = {};
    for (const stat of aggregated) {
      newLocal[stat.category] = {
        lid_spdp: stat.stages.lid_spdp,
        dik_kejaksaan: stat.stages.dik_kejaksaan,
        dik_kepolisian: stat.stages.dik_kepolisian,
        tut: stat.stages.tut,
        notes: stat.notes || '',
      };
      await onSaveCaseStat(stat);
    }

    setLocalFormData(newLocal);
    setSaveStatus(`Sinkronisasi berhasil! ${jampidumCases.length} perkara JAMPIDUM tahun ${selectedYear} telah dirangkum ke dalam matriks.`);
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleFieldChange = (
    cat: CaseCategory,
    field: 'lid_spdp' | 'dik_kejaksaan' | 'dik_kepolisian' | 'tut' | 'notes',
    value: any
  ) => {
    setLocalFormData((prev) => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        [field]: field === 'notes' ? value : Math.max(0, parseInt(value, 10) || 0),
      },
    }));
  };

  const handleSaveAll = async () => {
    for (const cat of CASE_CATEGORIES) {
      const data = localFormData[cat];
      const entry: CaseStatEntry = {
        id: `case-stats:${cat}:${selectedYear}`,
        category: cat,
        year: selectedYear,
        stages: {
          lid_spdp: data.lid_spdp,
          dik_kejaksaan: data.dik_kejaksaan,
          dik_kepolisian: data.dik_kepolisian,
          tut: data.tut,
        },
        notes: data.notes.trim() || undefined,
        updatedAt: Date.now(),
      };
      await onSaveCaseStat(entry);
    }
    setSaveStatus(`Data statistik perkara tahun ${selectedYear} berhasil disimpan!`);
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handleAddNewYear = () => {
    const parsed = parseInt(newYearInput, 10);
    if (parsed && parsed >= 2000 && parsed <= 2100) {
      if (!availableYears.includes(parsed)) {
        availableYears.push(parsed);
        availableYears.sort((a, b) => b - a);
      }
      handleYearChange(parsed);
      setNewYearInput('');
    } else {
      alert('Masukkan tahun yang valid (misal: 2027)');
    }
  };

  // Grand totals for selected year
  const totalLid = CASE_CATEGORIES.reduce((sum, cat) => sum + (localFormData[cat]?.lid_spdp || 0), 0);
  const totalDikKejaksaan = CASE_CATEGORIES.reduce((sum, cat) => sum + (localFormData[cat]?.dik_kejaksaan || 0), 0);
  const totalDikKepolisian = CASE_CATEGORIES.reduce((sum, cat) => sum + (localFormData[cat]?.dik_kepolisian || 0), 0);
  const totalTut = CASE_CATEGORIES.reduce((sum, cat) => sum + (localFormData[cat]?.tut || 0), 0);
  const grandTotal = totalLid + totalDikKejaksaan + totalDikKepolisian + totalTut;

  // Filtered JAMPIDUM case list
  const penyidikList = useMemo(() => {
    const set = new Set<string>();
    jampidumCases.forEach((c) => {
      if (c.ur_ipp) set.add(c.ur_ipp.trim());
    });
    return Array.from(set).sort();
  }, [jampidumCases]);

  const filteredJampidumCases = useMemo(() => {
    return jampidumCases.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTdw = (item.tdw || '').toLowerCase().includes(q);
        const matchSurat = (item.no_surat || '').toLowerCase().includes(q);
        const matchPasal = (item.undang_pasal || '').toLowerCase().includes(q);
        const matchTkp = (item.tempat_kejadian || '').toLowerCase().includes(q);
        const matchIpp = (item.ur_ipp || '').toLowerCase().includes(q);
        if (!matchTdw && !matchSurat && !matchPasal && !matchTkp && !matchIpp) {
          return false;
        }
      }

      // Stage filter
      if (filterStage !== 'all') {
        const stageInfo = getCaseStageInfo(item);
        if (stageInfo.stageCode !== filterStage) {
          return false;
        }
      }

      // Penyidik filter
      if (filterPenyidik !== 'all') {
        if ((item.ur_ipp || '').trim() !== filterPenyidik) {
          return false;
        }
      }

      // Category filter
      if (filterCategory !== 'all') {
        const cat = classifyJampidumCase(item);
        if (cat !== filterCategory) {
          return false;
        }
      }

      return true;
    });
  }, [jampidumCases, searchQuery, filterStage, filterPenyidik, filterCategory]);

  return (
    <div className="space-y-6 pb-12">
      {/* JAMPIDUM LIVE API CONNECTION BANNER */}
      <div className="bg-[#1E293B] border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Globe className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Integrasi API Perkara JAMPIDUM Kejaksaan RI
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE API ONLINE
              </span>
            </div>

            <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Endpoint:</span>
              <a
                href={`https://jampidum.kejaksaan.go.id/web/api/perkara/info/${selectedYear}/${satkerCode}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-amber-400 hover:underline flex items-center gap-1 bg-[#0F172A] px-2 py-0.5 rounded border border-slate-700 max-w-full truncate"
              >
                <span>https://jampidum.kejaksaan.go.id/web/api/perkara/info/{selectedYear}/{satkerCode}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-3">
              <span>Satker: <strong className="text-slate-200">{satkerCode === '22.08' ? 'Kejari Tabanan (22.08)' : satkerCode}</strong></span>
              <span>•</span>
              <span>Total Diterima: <strong className="text-amber-400 font-mono">{jampidumCases.length} Perkara</strong> ({selectedYear})</span>
              {lastSyncTime && (
                <>
                  <span>•</span>
                  <span>Sinkronisasi Terakhir: <span className="text-slate-300 font-mono">{new Date(lastSyncTime).toLocaleTimeString('id-ID')} WITA</span></span>
                </>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Satker Dropdown */}
            <select
              value={satkerCode}
              onChange={(e) => {
                setSatkerCode(e.target.value);
                loadJampidumData(selectedYear, e.target.value);
              }}
              className="bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-amber-500"
            >
              {JAMPIDUM_SATKER_LIST.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Fetch Button */}
            <button
              type="button"
              onClick={() => loadJampidumData(selectedYear, satkerCode)}
              disabled={isFetchingJampidum}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isFetchingJampidum ? 'animate-spin' : ''}`} />
              <span>{isFetchingJampidum ? 'Memuat JAMPIDUM...' : 'Tarik Data Live'}</span>
            </button>

            {/* 1-Click Auto Sync to Matrix Button */}
            <button
              type="button"
              onClick={handleAutoSyncFromJampidum}
              disabled={isFetchingJampidum || jampidumCases.length === 0}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>Sinkronkan ke Matriks</span>
            </button>
          </div>
        </div>

        {fetchError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{fetchError}</span>
          </div>
        )}
      </div>

      {/* Main View Container Card */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-xl">
        {/* Sub-Tabs Switcher & Year Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          {/* View Toggles */}
          <div className="flex items-center gap-2 bg-[#0F172A] p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveSubTab('matrix')}
              className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                activeSubTab === 'matrix'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Matriks Rekapitulasi (Yustisial)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('live-feed')}
              className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                activeSubTab === 'live-feed'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Eksplorer Perkara JAMPIDUM ({jampidumCases.length})</span>
            </button>
          </div>

          {/* Year Selector & Add Year */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-[#0F172A] p-1 rounded-xl border border-slate-800">
              {availableYears.map((yr) => (
                <button
                  key={yr}
                  onClick={() => handleYearChange(yr)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                    selectedYear === yr
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={newYearInput}
                onChange={(e) => setNewYearInput(e.target.value)}
                placeholder="Thn Baru"
                className="w-20 bg-[#0F172A] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddNewYear}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 cursor-pointer transition-colors"
                title="Tambah Tahun"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {saveStatus && (
          <div className="mt-5 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-semibold flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {saveStatus}
          </div>
        )}

        {/* TAB 1: MATRIX STATS VIEW */}
        {activeSubTab === 'matrix' && (
          <>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#0F172A] text-slate-300 font-bold uppercase">
                    <th className="py-3 px-3.5 rounded-l-lg">Kategori Perkara</th>
                    <th className="py-3 px-3.5 text-center w-32">
                      <div className="text-amber-400 font-mono">Lid / SPDP</div>
                      <div className="text-[10px] text-slate-400 font-normal normal-case">Penyelidikan / SPDP</div>
                    </th>
                    <th className="py-3 px-3.5 text-center w-36">
                      <div className="text-emerald-400 font-mono">Dik Kejaksaan</div>
                      <div className="text-[10px] text-slate-400 font-normal normal-case">Tahap I / Berkas Lengkap</div>
                    </th>
                    <th className="py-3 px-3.5 text-center w-36">
                      <div className="text-sky-400 font-mono">Dik Kepolisian</div>
                      <div className="text-[10px] text-slate-400 font-normal normal-case">Tahap II / BB & Tersangka</div>
                    </th>
                    <th className="py-3 px-3.5 text-center w-32">
                      <div className="text-indigo-400 font-mono">Tut (Penuntutan)</div>
                      <div className="text-[10px] text-slate-400 font-normal normal-case">Sidang / Eksekusi</div>
                    </th>
                    <th className="py-3 px-3.5 text-center w-28 bg-[#0F172A]">
                      <div className="text-slate-200">Total Tahap</div>
                    </th>
                    <th className="py-3 px-3.5 min-w-[200px] rounded-r-lg">Catatan Perkembangan Kasus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {CASE_CATEGORIES.map((cat) => {
                    const data = localFormData[cat];
                    const catTotal = data.lid_spdp + data.dik_kejaksaan + data.dik_kepolisian + data.tut;

                    return (
                      <tr key={cat} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3.5 font-bold text-white">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            {cat}
                          </div>
                        </td>

                        {/* Stage 1: Lid / SPDP */}
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            value={data.lid_spdp}
                            onChange={(e) => handleFieldChange(cat, 'lid_spdp', e.target.value)}
                            className="w-20 mx-auto text-center bg-[#0F172A] border border-slate-700 rounded-lg py-1.5 text-xs font-mono font-bold text-slate-100 focus:outline-none focus:border-amber-500"
                          />
                        </td>

                        {/* Stage 2: Dik Kejaksaan */}
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            value={data.dik_kejaksaan}
                            onChange={(e) => handleFieldChange(cat, 'dik_kejaksaan', e.target.value)}
                            className="w-20 mx-auto text-center bg-[#0F172A] border border-slate-700 rounded-lg py-1.5 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                          />
                        </td>

                        {/* Stage 3: Dik Kepolisian */}
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            value={data.dik_kepolisian}
                            onChange={(e) => handleFieldChange(cat, 'dik_kepolisian', e.target.value)}
                            className="w-20 mx-auto text-center bg-[#0F172A] border border-slate-700 rounded-lg py-1.5 text-xs font-mono font-bold text-sky-400 focus:outline-none focus:border-sky-500"
                          />
                        </td>

                        {/* Stage 4: Tut */}
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            value={data.tut}
                            onChange={(e) => handleFieldChange(cat, 'tut', e.target.value)}
                            className="w-20 mx-auto text-center bg-[#0F172A] border border-slate-700 rounded-lg py-1.5 text-xs font-mono font-bold text-indigo-400 focus:outline-none focus:border-indigo-500"
                          />
                        </td>

                        {/* Total Row */}
                        <td className="py-2.5 px-3 text-center bg-[#0F172A]/70 font-mono font-bold text-amber-400 text-sm">
                          {catTotal}
                        </td>

                        {/* Notes */}
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={data.notes}
                            onChange={(e) => handleFieldChange(cat, 'notes', e.target.value)}
                            placeholder="Uraian ringkas perkara / status inkracht..."
                            className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                          />
                        </td>
                      </tr>
                    );
                  })}

                  {/* Total Aggregate Row */}
                  <tr className="bg-[#0F172A] font-bold border-t-2 border-slate-700 text-slate-200">
                    <td className="py-3 px-3.5 text-amber-400 uppercase">
                      TOTAL TAHAPAN ({selectedYear})
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-amber-400 text-sm">
                      {totalLid}
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-emerald-400 text-sm">
                      {totalDikKejaksaan}
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-sky-400 text-sm">
                      {totalDikKepolisian}
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-indigo-400 text-sm">
                      {totalTut}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-amber-400 bg-amber-500/10 text-base">
                      {grandTotal}
                    </td>
                    <td className="py-3 px-3 text-xs text-slate-400 italic">
                      Akumulasi seluruh perkara tahun {selectedYear}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Save Button */}
            <div className="mt-6 pt-5 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleSaveAll}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
              >
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>Simpan Matriks Statistik Perkara ({selectedYear})</span>
              </button>
            </div>
          </>
        )}

        {/* TAB 2: JAMPIDUM LIVE EXPLORER VIEW */}
        {activeSubTab === 'live-feed' && (
          <div className="mt-6 space-y-4">
            {/* Filter Toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#0F172A] p-4 rounded-xl border border-slate-800">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari Tersangka, No SPDP, Pasal, TKP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Stage Filter */}
              <div>
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">Semua Tahapan Perkara</option>
                  <option value="SPDP">SPDP Masuk (Pratut)</option>
                  <option value="P-21">Berkas Lengkap (P-21)</option>
                  <option value="TAHAP-2">Tahap II (Tersangka & BB)</option>
                  <option value="P-31">Pelimpahan PN (P-31)</option>
                  <option value="P-42">Surat Tuntutan (P-42)</option>
                  <option value="PUTUSAN">Putusan Pengadilan</option>
                  <option value="P-48">Eksekusi Putusan (P-48)</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="Narkotika">Narkotika</option>
                  <option value="Korupsi">Korupsi</option>
                  <option value="Terorisme">Terorisme</option>
                  <option value="Perkara Menarik Perhatian Masyarakat">Perkara Menarik / Tipidum</option>
                </select>
              </div>

              {/* Penyidik Filter */}
              <div>
                <select
                  value={filterPenyidik}
                  onChange={(e) => setFilterPenyidik(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">Semua Instansi Penyidik</option>
                  {penyidikList.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>
                Menampilkan <strong className="text-amber-400 font-mono">{filteredJampidumCases.length}</strong> dari {jampidumCases.length} perkara JAMPIDUM
              </span>
              {filteredJampidumCases.length < jampidumCases.length && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStage('all');
                    setFilterCategory('all');
                    setFilterPenyidik('all');
                  }}
                  className="text-amber-400 hover:underline"
                >
                  Reset Filter
                </button>
              )}
            </div>

            {/* Case List Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0F172A]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#0F172A] text-slate-300 font-bold uppercase">
                    <th className="py-3 px-3.5 w-12 text-center">No</th>
                    <th className="py-3 px-3.5">SPDP & Tanggal</th>
                    <th className="py-3 px-3.5">Instansi Penyidik</th>
                    <th className="py-3 px-3.5">Tersangka / Terdakwa</th>
                    <th className="py-3 px-3.5 min-w-[200px]">Dugaan Tindak Pidana & Pasal</th>
                    <th className="py-3 px-3.5 text-center">Status Tahapan</th>
                    <th className="py-3 px-3.5 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredJampidumCases.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Tidak ada perkara yang sesuai dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredJampidumCases.map((item, idx) => {
                      const stageInfo = getCaseStageInfo(item);
                      const cat = classifyJampidumCase(item);

                      return (
                        <tr key={item.id_perkara || idx} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3.5 text-center font-mono text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3.5">
                            <div className="font-mono font-bold text-amber-400 text-xs">
                              {item.no_surat || '-'}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              <span>Surat: {item.tgl_surat || '-'}</span>
                              <span>•</span>
                              <span>Terima: {item.terima_spdp || '-'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3.5">
                            <span className="font-semibold text-slate-200 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 inline-block text-[11px]">
                              {item.ur_ipp || '-'}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 font-bold text-slate-100 max-w-[180px]">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="truncate">{item.tdw || 'DALAM LIDIK'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3.5 max-w-[260px]">
                            <div className="line-clamp-2 text-slate-300 text-xs" title={item.undang_pasal}>
                              {item.undang_pasal || '-'}
                            </div>
                            <div className="mt-1">
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                {cat}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border inline-block whitespace-nowrap ${stageInfo.badgeColor}`}>
                              {stageInfo.stageName}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => setSelectedCaseDetail(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 mx-auto cursor-pointer transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Detail</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Multi-Year Comparison Cards */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-md">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          Riwayat Akumulasi Perkara Lintas Tahun
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableYears.map((yr) => {
            const yrStats = caseStats.filter((s) => s.year === yr);
            const yrLid = yrStats.reduce((s, i) => s + i.stages.lid_spdp, 0);
            const yrDik = yrStats.reduce((s, i) => s + i.stages.dik_kejaksaan + i.stages.dik_kepolisian, 0);
            const yrTut = yrStats.reduce((s, i) => s + i.stages.tut, 0);
            const yrTotal = yrLid + yrDik + yrTut;

            return (
              <div
                key={yr}
                onClick={() => handleYearChange(yr)}
                className={`p-4 rounded-xl border transition-all cursor-pointer shadow-sm ${
                  selectedYear === yr
                    ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/40'
                    : 'bg-[#0F172A]/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-amber-400">
                    Tahun {yr}
                  </span>
                  <span className="text-xs font-mono font-bold bg-slate-800 px-2.5 py-0.5 rounded-lg text-slate-200 border border-slate-700">
                    {yrTotal} Total Tahap
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3.5 text-center">
                  <div className="p-2.5 rounded-lg bg-[#1E293B] border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium">Lid/SPDP</div>
                    <div className="text-sm font-bold text-slate-200 font-mono mt-0.5">{yrLid}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1E293B] border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium">Penyidikan</div>
                    <div className="text-sm font-bold text-slate-200 font-mono mt-0.5">{yrDik}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1E293B] border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium">Penuntutan</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{yrTut}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: DETAIL PERKARA JAMPIDUM */}
      {selectedCaseDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 max-w-2xl w-full text-slate-100 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    JAMPIDUM RI
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ID: {selectedCaseDetail.id_perkara}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedCaseDetail.no_surat}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCaseDetail(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* General Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-1">
                <div className="text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tersangka / Terdakwa:</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {selectedCaseDetail.tdw || 'DALAM LIDIK'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-1">
                <div className="text-slate-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-sky-400" />
                  <span>Instansi Penyidik:</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {selectedCaseDetail.ur_ipp || '-'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-1">
                <div className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tanggal Terima SPDP:</span>
                </div>
                <div className="text-sm font-mono font-bold text-slate-200">
                  {selectedCaseDetail.terima_spdp || '-'} (Surat: {selectedCaseDetail.tgl_surat || '-'})
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-1">
                <div className="text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>No. Berkas Perkara:</span>
                </div>
                <div className="text-sm font-mono font-bold text-slate-200">
                  {selectedCaseDetail.no_berkas || 'Belum Ada / Masih SPDP'}
                </div>
              </div>
            </div>

            {/* Pasal & Tindak Pidana */}
            <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 space-y-1.5 text-xs">
              <div className="text-amber-400 font-bold uppercase tracking-wider">
                Dugaan Tindak Pidana & Pasal yang Disangkakan
              </div>
              <p className="text-slate-200 leading-relaxed">
                {selectedCaseDetail.undang_pasal || '-'}
              </p>
            </div>

            {/* Tempat Kejadian Perkara */}
            <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 space-y-1.5 text-xs">
              <div className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Tempat & Waktu Kejadian (TKP)</span>
              </div>
              <p className="text-slate-200 leading-relaxed">
                {selectedCaseDetail.tempat_kejadian || '-'}
              </p>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                Waktu Kejadian: {selectedCaseDetail.tgl_kejadian_perkara || '-'}
              </div>
            </div>

            {/* Procedural Stage Timeline */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Alur & Kronologi Tahapan Perkara
              </h4>

              <div className="space-y-2 text-xs">
                {/* 1. SPDP */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0F172A] border border-slate-800">
                  <span className="font-semibold text-slate-300">1. Penerimaan SPDP</span>
                  <span className="font-mono text-amber-400 font-bold">{selectedCaseDetail.terima_spdp || 'Tercatat'}</span>
                </div>

                {/* 2. P-21 */}
                <div className={`flex items-center justify-between p-2.5 rounded-lg border ${selectedCaseDetail.tgl_p21 ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-[#0F172A] border-slate-800 text-slate-500'}`}>
                  <span className="font-semibold">2. Berkas Lengkap (P-21)</span>
                  <span className="font-mono font-bold">{selectedCaseDetail.tgl_p21 || 'Belum Terbit'}</span>
                </div>

                {/* 3. Tahap II */}
                <div className={`flex items-center justify-between p-2.5 rounded-lg border ${selectedCaseDetail.tahap_2 ? 'bg-sky-950/30 border-sky-500/40 text-sky-300' : 'bg-[#0F172A] border-slate-800 text-slate-500'}`}>
                  <span className="font-semibold">3. Penyerahan Tersangka & BB (Tahap II)</span>
                  <span className="font-mono font-bold">{selectedCaseDetail.tahap_2 || 'Belum Tahap II'}</span>
                </div>

                {/* 4. P-31 */}
                <div className={`flex items-center justify-between p-2.5 rounded-lg border ${selectedCaseDetail.tgl_p31 ? 'bg-violet-950/30 border-violet-500/40 text-violet-300' : 'bg-[#0F172A] border-slate-800 text-slate-500'}`}>
                  <span className="font-semibold">4. Pelimpahan Pengadilan Negeri (P-31)</span>
                  <span className="font-mono font-bold">{selectedCaseDetail.tgl_p31 || 'Belum Pelimpahan'}</span>
                </div>

                {/* 5. P-42 */}
                <div className={`flex items-center justify-between p-2.5 rounded-lg border ${selectedCaseDetail.tgl_p42 ? 'bg-indigo-950/30 border-indigo-500/40 text-indigo-300' : 'bg-[#0F172A] border-slate-800 text-slate-500'}`}>
                  <span className="font-semibold">5. Surat Tuntutan (P-42)</span>
                  <span className="font-mono font-bold">{selectedCaseDetail.tgl_p42 || 'Belum Tuntutan'}</span>
                </div>

                {/* 6. Putusan */}
                <div className={`flex items-center justify-between p-2.5 rounded-lg border ${selectedCaseDetail.tgl_put_pertama ? 'bg-teal-950/30 border-teal-500/40 text-teal-300' : 'bg-[#0F172A] border-slate-800 text-slate-500'}`}>
                  <span className="font-semibold">6. Putusan Pengadilan Pertama</span>
                  <span className="font-mono font-bold">{selectedCaseDetail.tgl_put_pertama || 'Belum Putusan'}</span>
                </div>

                {/* 7. P-48 */}
                <div className={`flex items-center justify-between p-2.5 rounded-lg border ${selectedCaseDetail.tgl_p48 ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300' : 'bg-[#0F172A] border-slate-800 text-slate-500'}`}>
                  <span className="font-semibold">7. Pelaksanaan Putusan / Eksekusi (P-48)</span>
                  <span className="font-mono font-bold">{selectedCaseDetail.tgl_p48 || 'Belum Eksekusi'}</span>
                </div>
              </div>
            </div>

            {/* Footer Close */}
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCaseDetail(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
