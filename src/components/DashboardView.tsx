import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  TrendingUp, 
  HardHat, 
  Cpu, 
  BookOpen, 
  MapPin, 
  Plus, 
  Scale, 
  Calendar,
  Eye,
  FileText,
  RefreshCw,
  CheckCircle2,
  Database,
  ArrowRight
} from 'lucide-react';
import { IntelligenceEntry, OutreachEntry, CaseStatEntry, SectionId, JampidumPerkara } from '../types';
import { SECTIONS_CONFIG, TABANAN_KECAMATAN } from '../services/seedData';
import { fetchJampidumCases, aggregateJampidumCasesToStats, SATKER_TABANAN } from '../services/jampidumService';
import { ActiveTab } from './Sidebar';

interface DashboardViewProps {
  entries: IntelligenceEntry[];
  outreachEntries: OutreachEntry[];
  caseStats: CaseStatEntry[];
  onNavigateToForm: (sectionId?: SectionId) => void;
  onNavigateToTab: (tab: ActiveTab) => void;
  onViewEntryDetail: (entry: IntelligenceEntry) => void;
  onSaveCaseStat?: (stat: CaseStatEntry) => Promise<void>;
}

export default function DashboardView({
  entries,
  outreachEntries,
  caseStats,
  onNavigateToForm,
  onNavigateToTab,
  onViewEntryDetail,
  onSaveCaseStat,
}: DashboardViewProps) {
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('Semua');
  const [jampidumCases, setJampidumCases] = useState<JampidumPerkara[]>([]);
  const [isSyncingJampidum, setIsSyncingJampidum] = useState<boolean>(false);
  const [jampidumError, setJampidumError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Auto-fetch JAMPIDUM data on mount to ensure live case statistics work out of the box
  useEffect(() => {
    let isMounted = true;
    async function loadLiveJampidum() {
      try {
        setIsSyncingJampidum(true);
        const result = await fetchJampidumCases(2026, SATKER_TABANAN);
        if (isMounted) {
          setJampidumCases(result.data);
          setLastSyncTime(new Date(result.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
          
          // Auto-persist aggregated case stats to database if provided
          if (onSaveCaseStat && result.data.length > 0) {
            const aggregated = aggregateJampidumCasesToStats(result.data, 2026);
            for (const stat of aggregated) {
              await onSaveCaseStat(stat);
            }
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn('Dashboard live JAMPIDUM fetch:', err.message);
          setJampidumError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsSyncingJampidum(false);
        }
      }
    }

    loadLiveJampidum();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleManualSyncJampidum = async () => {
    setIsSyncingJampidum(true);
    setJampidumError(null);
    try {
      const result = await fetchJampidumCases(2026, SATKER_TABANAN);
      setJampidumCases(result.data);
      setLastSyncTime(new Date(result.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      if (onSaveCaseStat && result.data.length > 0) {
        const aggregated = aggregateJampidumCasesToStats(result.data, 2026);
        for (const stat of aggregated) {
          await onSaveCaseStat(stat);
        }
      }
    } catch (err: any) {
      setJampidumError(err.message || 'Gagal memuat API JAMPIDUM');
    } finally {
      setIsSyncingJampidum(false);
    }
  };

  // Section Counts from database entries
  const sectionCounts = SECTIONS_CONFIG.reduce((acc, sec) => {
    if (sec.id === 'D.IN.7') {
      acc[sec.id] = outreachEntries.length;
    } else {
      acc[sec.id] = entries.filter((e) => e.section === sec.id).length;
    }
    return acc;
  }, {} as Record<SectionId, number>);

  // Compute Case Stats for 2026 (prefer live aggregated or database)
  const currentStats = caseStats.filter((s) => s.year === 2026);
  const totalLid = currentStats.reduce((sum, s) => sum + s.stages.lid_spdp, 0);
  const totalDik = currentStats.reduce((sum, s) => sum + s.stages.dik_kejaksaan + s.stages.dik_kepolisian, 0);
  const totalTut = currentStats.reduce((sum, s) => sum + s.stages.tut, 0);
  const totalCasesAll = jampidumCases.length > 0 ? jampidumCases.length : (totalLid + totalDik + totalTut);

  // Compute Kecamatan Data
  const kecamatanData = TABANAN_KECAMATAN.map((kec) => {
    const dInCount = entries.filter((e) => e.kecamatan.toLowerCase().includes(kec.toLowerCase())).length;
    const penkumCount = outreachEntries.filter((o) => o.kecamatan.toLowerCase().includes(kec.toLowerCase())).length;
    return {
      name: kec,
      dInCount,
      penkumCount,
      total: dInCount + penkumCount,
    };
  });

  const filteredEntries = selectedKecamatan === 'Semua'
    ? entries
    : entries.filter((e) => e.kecamatan.toLowerCase().includes(selectedKecamatan.toLowerCase()));

  const getSectionIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'HardHat': return <HardHat className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner: Clean & Minimalist */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SISTEM AKTIF 2026
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              Neon PostgreSQL Connected
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Papan Peta & Situasi Intelijen Terpadu
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Kejaksaan Negeri Tabanan — Monitoring 6 Sektor D.IN, Penerangan Hukum D.IN.7, dan Sinkronisasi Perkara JAMPIDUM RI.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => onNavigateToForm('D.IN.1')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Input Laporan D.IN</span>
          </button>

          <button
            onClick={handleManualSyncJampidum}
            disabled={isSyncingJampidum}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            title="Sinkronisasi data perkara langsung dari API JAMPIDUM"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isSyncingJampidum ? 'animate-spin' : ''}`} />
            <span>{isSyncingJampidum ? 'Menghubungkan...' : 'Sinkron JAMPIDUM'}</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics: 4 Clean, High-Contrast Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Laporan D.IN 1-6 */}
        <div 
          onClick={() => onNavigateToTab('data-table')}
          className="bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-amber-400 transition-colors">
              Laporan Intelijen (D.IN)
            </span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">{entries.length}</span>
            <span className="text-xs text-amber-400 font-semibold">Laporan</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Formulasi 5W+1H Sektor 1–6 (Database)
          </p>
        </div>

        {/* Card 2: Penkum & JMS D.IN.7 */}
        <div 
          onClick={() => onNavigateToTab('outreach-form')}
          className="bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-sky-400 transition-colors">
              Penkum & JMS (D.IN.7)
            </span>
            <BookOpen className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">{outreachEntries.length}</span>
            <span className="text-xs text-sky-400 font-semibold">Kegiatan</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {outreachEntries.reduce((s, o) => s + (o.jumlah_peserta || 0), 0)} peserta terjangkau
          </p>
        </div>

        {/* Card 3: Live JAMPIDUM Case Stats */}
        <div 
          onClick={() => onNavigateToTab('case-stats')}
          className="bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
              Perkara JAMPIDUM (2026)
            </span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">{totalCasesAll}</span>
            <span className="text-xs text-emerald-400 font-semibold">Perkara Terdaftar</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {jampidumCases.length > 0 ? `Live API (${lastSyncTime || 'Terkini'})` : 'Tahapan Yustisial'}
          </p>
        </div>

        {/* Card 4: Territorial Monitoring */}
        <div 
          onClick={() => onNavigateToTab('outreach-form')}
          className="bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-purple-400 transition-colors">
              Wilayah Pengawasan
            </span>
            <MapPin className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-400 font-mono">10</span>
            <span className="text-xs text-slate-300 font-semibold">Kecamatan Aktif</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Situasi Teritorial Aman Kondusif
          </p>
        </div>
      </div>

      {/* 3. Live Case Statistics (JAMPIDUM & Judicial Stages Matrix) */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Statistik Penanganan Perkara & Live JAMPIDUM (Tahun 2026)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Data perkara pidana terintegrasi otomatis dari API JAMPIDUM Kejaksaan RI (Satker 22.08 Tabanan)
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateToTab('case-stats')}
              className="text-xs px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Detail & Live Explorer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Case Table / Breakdown */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0B1120] text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-800">
                <th className="py-3 px-4">Kategori Perkara</th>
                <th className="py-3 px-4 text-center">SPDP / Lid</th>
                <th className="py-3 px-4 text-center">Dik Kejaksaan (Tahap I)</th>
                <th className="py-3 px-4 text-center">Dik Kepolisian (Tahap II)</th>
                <th className="py-3 px-4 text-center">Penuntutan & Sidang</th>
                <th className="py-3 px-4 text-center">Total Tahapan</th>
                <th className="py-3 px-4">Catatan Perkembangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-[#111827]">
              {currentStats.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">
                    Memuat data statistik perkara dari database & JAMPIDUM...
                  </td>
                </tr>
              ) : (
                currentStats.map((stat) => {
                  const total =
                    stat.stages.lid_spdp +
                    stat.stages.dik_kejaksaan +
                    stat.stages.dik_kepolisian +
                    stat.stages.tut;
                  return (
                    <tr key={stat.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {stat.category}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-300">
                        {stat.stages.lid_spdp}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-300">
                        {stat.stages.dik_kejaksaan}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-300">
                        {stat.stages.dik_kepolisian}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400">
                        {stat.stages.tut}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-400 bg-slate-900/60">
                        {total}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-xs max-w-sm truncate">
                        {stat.notes || 'Data terintegrasi JAMPIDUM'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. 6 Core Intelligence Sections (D.IN.1 s/d D.IN.6) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              6 Sektor Laporan Intelijen Yustisial
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Klik tombol untuk menginput formulir 5W+1H
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS_CONFIG.filter((s) => s.id !== 'D.IN.7').map((sec) => {
            const count = sectionCounts[sec.id] || 0;
            const latestEntry = entries.find((e) => e.section === sec.id);

            return (
              <div
                key={sec.id}
                className="bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-900 text-amber-400 border border-slate-800">
                        {getSectionIcon(sec.iconName)}
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20">
                          {sec.code}
                        </span>
                        <span className="text-xs font-semibold text-slate-300 ml-2">
                          {sec.shortName}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-800">
                      {count} Laporan
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {sec.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {sec.description}
                  </p>

                  {/* Latest Entry Snippet if exists */}
                  {latestEntry && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-mono text-amber-400">{latestEntry.no}</span>
                        <span className="font-mono">{latestEntry.date}</span>
                      </div>
                      <p className="text-slate-300 line-clamp-2 italic">
                        "{latestEntry.narrative}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                    {sec.defaultKeterangan.slice(0, 2).join(', ')}
                  </span>
                  <button
                    onClick={() => onNavigateToForm(sec.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Input</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Two Columns: Territorial & Recent Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Territorial (5 cols) */}
        <div className="lg:col-span-5 bg-[#111827] border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Peta Teritorial Tabanan
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">10 Kecamatan</span>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {kecamatanData.map((kec) => (
              <div
                key={kec.name}
                onClick={() => setSelectedKecamatan(selectedKecamatan === kec.name ? 'Semua' : kec.name)}
                className={`p-3 rounded-xl border transition-colors cursor-pointer flex items-center justify-between ${
                  selectedKecamatan === kec.name
                    ? 'bg-amber-500/10 border-amber-500/60'
                    : 'bg-[#0B1120] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs text-slate-200">
                    {kec.name}
                    {selectedKecamatan === kec.name && (
                      <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-bold font-mono ml-2">
                        FILTER
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-3">
                    <span>Laporan: <b className="text-slate-300 font-mono">{kec.dInCount}</b></span>
                    <span>Penkum: <b className="text-slate-300 font-mono">{kec.penkumCount}</b></span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                  {kec.total} Aktif
                </span>
              </div>
            ))}
          </div>

          {selectedKecamatan !== 'Semua' && (
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Filter: <b className="text-amber-400">{selectedKecamatan}</b></span>
              <button
                onClick={() => setSelectedKecamatan('Semua')}
                className="text-amber-400 hover:underline font-semibold cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Recent Intelligence Feed (7 cols) */}
        <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Laporan Terkini (5W+1H)
              </h3>
            </div>
            <button
              onClick={() => onNavigateToTab('data-table')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              Lihat Semua Master Data →
            </button>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Belum ada data laporan untuk filter terpilih.
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl bg-[#0B1120] border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {entry.section}
                      </span>
                      <span className="text-xs font-bold text-slate-200 font-mono">
                        {entry.no}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {entry.keterangan}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {entry.date}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {entry.classification || 'TERBATAS'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {entry.narrative}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {entry.location} ({entry.kecamatan})
                    </span>
                    <button
                      onClick={() => onViewEntryDetail(entry)}
                      className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Detail 5W+1H
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
