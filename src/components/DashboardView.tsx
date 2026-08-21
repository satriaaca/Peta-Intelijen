import { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  TrendingUp, 
  HardHat, 
  Cpu, 
  BookOpen, 
  MapPin, 
  ArrowUpRight, 
  Plus, 
  Scale, 
  Calendar,
  Eye,
  FileText,
  Radio,
  ChevronRight
} from 'lucide-react';
import { IntelligenceEntry, OutreachEntry, CaseStatEntry, SectionId } from '../types';
import { SECTIONS_CONFIG, TABANAN_KECAMATAN } from '../services/seedData';
import { ActiveTab } from './Sidebar';

interface DashboardViewProps {
  entries: IntelligenceEntry[];
  outreachEntries: OutreachEntry[];
  caseStats: CaseStatEntry[];
  onNavigateToForm: (sectionId?: SectionId) => void;
  onNavigateToTab: (tab: ActiveTab) => void;
  onViewEntryDetail: (entry: IntelligenceEntry) => void;
}

export default function DashboardView({
  entries,
  outreachEntries,
  caseStats,
  onNavigateToForm,
  onNavigateToTab,
  onViewEntryDetail,
}: DashboardViewProps) {
  const [selectedKecamatanFilter, setSelectedKecamatanFilter] = useState<string>('Semua');

  // Compute counts per section
  const sectionCounts = SECTIONS_CONFIG.reduce((acc, sec) => {
    if (sec.id === 'D.IN.7') {
      acc[sec.id] = outreachEntries.length;
    } else {
      acc[sec.id] = entries.filter((e) => e.section === sec.id).length;
    }
    return acc;
  }, {} as Record<SectionId, number>);

  // Compute total cases for latest year (2026)
  const stats2026 = caseStats.filter((s) => s.year === 2026);
  const totalLid2026 = stats2026.reduce((sum, s) => sum + s.stages.lid_spdp, 0);
  const totalDik2026 = stats2026.reduce((sum, s) => sum + s.stages.dik_kejaksaan + s.stages.dik_kepolisian, 0);
  const totalTut2026 = stats2026.reduce((sum, s) => sum + s.stages.tut, 0);

  // Compute kecamatan entry statistics
  const kecamatanData = TABANAN_KECAMATAN.map((kec) => {
    const dInCount = entries.filter((e) => e.kecamatan.toLowerCase().includes(kec.toLowerCase())).length;
    const penkumCount = outreachEntries.filter((o) => o.kecamatan.toLowerCase().includes(kec.toLowerCase())).length;
    const total = dInCount + penkumCount;
    let status: 'AMAN' | 'WASPADA' | 'RAWAN' = 'AMAN';
    if (total >= 3) status = 'WASPADA';
    return {
      name: kec,
      dInCount,
      penkumCount,
      total,
      status,
    };
  });

  const getSectionIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />;
      case 'HardHat':
        return <HardHat className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const filteredEntries = selectedKecamatanFilter === 'Semua'
    ? entries
    : entries.filter((e) => e.kecamatan.toLowerCase().includes(selectedKecamatanFilter.toLowerCase()));

  return (
    <div className="space-y-6 pb-8">
      {/* Sleek Top Overview Card */}
      <div className="bg-[#151F33] border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              <Radio className="w-3 h-3 animate-pulse" />
              STATUS YUSTISIAL: AKTIF (2026)
            </span>
            <span className="text-xs text-slate-400">
              Wilayah Hukum Kejari Tabanan
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Papan Peta & Situasi Intelijen Terpadu
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Monitoring 6 sektor strategis D.IN (1–6), kegiatan penerangan hukum (D.IN.7), dan penanganan perkara yustisial.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => onNavigateToForm('D.IN.1')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Input Laporan D.IN</span>
          </button>
          <button
            onClick={() => onNavigateToTab('case-stats')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Statistik Perkara</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total D.IN Reports */}
        <div 
          onClick={() => onNavigateToTab('data-table')}
          className="bg-[#151F33] border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-sm cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-amber-400 transition-colors">
              Laporan D.IN (1–6)
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
              {entries.length}
            </span>
            <span className="text-xs text-amber-400 font-semibold">
              Laporan
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Formulasi 5W+1H (SIADIBIBAM)
          </p>
        </div>

        {/* Card 2: Legal Outreach & JMS */}
        <div 
          onClick={() => onNavigateToTab('outreach-form')}
          className="bg-[#151F33] border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-sm cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-sky-400 transition-colors">
              Penkum & JMS (D.IN.7)
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
              {outreachEntries.length}
            </span>
            <span className="text-xs text-sky-400 font-semibold">
              Kegiatan
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {outreachEntries.reduce((sum, o) => sum + (o.jumlah_peserta || 0), 0)} peserta terjangkau
          </p>
        </div>

        {/* Card 3: Case Tracking (2026) */}
        <div 
          onClick={() => onNavigateToTab('case-stats')}
          className="bg-[#151F33] border border-slate-800/90 hover:border-amber-500/40 rounded-2xl p-5 transition-all shadow-sm cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-amber-400 transition-colors">
                Perkara & JAMPIDUM
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-amber-500/10 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-all">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
              {totalLid2026 + totalDik2026 + totalTut2026}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              Tahap (2026)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>SPDP: <b className="text-slate-200 font-mono">{totalLid2026}</b></span>
            <span>Dik: <b className="text-slate-200 font-mono">{totalDik2026}</b></span>
            <span>Tut: <b className="text-slate-200 font-mono">{totalTut2026}</b></span>
          </div>
        </div>

        {/* Card 4: Territorial Status */}
        <div className="bg-[#151F33] border border-slate-800/90 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Kondusivitas Wilayah
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">
              KONDUSIF
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            10 Kecamatan dalam pengawasan aktif
          </p>
        </div>
      </div>

      {/* 6 Core Sections Overview Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            6 Sektor Laporan Papan Peta Intelijen
          </h3>
          <span className="text-xs text-slate-400">
            Klik kartu untuk mengisi atau melihat laporan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS_CONFIG.map((sec) => {
            const count = sectionCounts[sec.id] || 0;
            const latestEntry = entries.find((e) => e.section === sec.id);

            return (
              <div
                key={sec.id}
                className="bg-[#151F33] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[#0B1120] border border-slate-800 text-amber-400">
                        {getSectionIcon(sec.iconName)}
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded-md border border-amber-500/30">
                          {sec.code}
                        </span>
                        <span className="text-xs font-semibold text-slate-300 ml-2">
                          {sec.shortName}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-[#0B1120] text-slate-200 px-2.5 py-0.5 rounded-lg border border-slate-800">
                      {count} Laporan
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug mt-1.5">
                    {sec.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {sec.description}
                  </p>

                  {/* Latest Entry Snippet */}
                  {latestEntry && (
                    <div className="mt-3.5 p-3 rounded-xl bg-[#0B1120]/80 border border-slate-800/80">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-mono text-amber-400 font-semibold">{latestEntry.no}</span>
                        <span className="font-mono">{latestEntry.date}</span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2 italic">
                        "{latestEntry.narrative}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Kategori: {sec.defaultKeterangan.slice(0, 2).join(', ')}...
                  </span>
                  <div className="flex items-center gap-1.5">
                    {sec.id === 'D.IN.7' ? (
                      <button
                        onClick={() => onNavigateToTab('outreach-form')}
                        className="text-xs px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-300 hover:bg-sky-500/25 border border-sky-500/30 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Input D.IN.7
                      </button>
                    ) : (
                      <button
                        onClick={() => onNavigateToForm(sec.id)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Input Laporan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Territorial Distribution & Recent Intelligence Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Territorial Status Tabanan */}
        <div className="lg:col-span-5 bg-[#151F33] border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              Peta Teritorial Wilayah Tabanan
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">10 Kecamatan</span>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            Distribusi laporan intelijen dan kegiatan penyuluhan hukum di seluruh wilayah hukum Kabupaten Tabanan:
          </p>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {kecamatanData.map((kec) => (
              <div
                key={kec.name}
                onClick={() => setSelectedKecamatanFilter(selectedKecamatanFilter === kec.name ? 'Semua' : kec.name)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedKecamatanFilter === kec.name
                    ? 'bg-amber-500/10 border-amber-500/80 ring-1 ring-amber-500/40'
                    : 'bg-[#0B1120]/70 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs text-slate-200 flex items-center gap-2">
                    {kec.name}
                    {selectedKecamatanFilter === kec.name && (
                      <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-bold font-mono">
                        TERPILIH
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-3">
                    <span>Laporan D.IN: <b className="text-slate-300 font-mono">{kec.dInCount}</b></span>
                    <span>Penkum: <b className="text-slate-300 font-mono">{kec.penkumCount}</b></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {kec.total} Aktif
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {kec.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Filter saat ini: <b className="text-amber-400">{selectedKecamatanFilter}</b></span>
            {selectedKecamatanFilter !== 'Semua' && (
              <button
                onClick={() => setSelectedKecamatanFilter('Semua')}
                className="text-amber-400 hover:underline cursor-pointer font-semibold"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Right Column (7 cols): Recent 5W+1H Intelligence Narrative Feed */}
        <div className="lg:col-span-7 bg-[#151F33] border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Feed Laporan Intelijen Terkini (5W+1H)
            </h3>
            <button
              onClick={() => onNavigateToTab('data-table')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              Lihat Master Data →
            </button>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Tidak ada laporan untuk filter kecamatan terpilih.
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3.5 rounded-xl bg-[#0B1120]/80 border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        {entry.section}
                      </span>
                      <span className="text-xs font-bold text-slate-200 font-mono">
                        {entry.no}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {entry.keterangan}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {entry.date}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {entry.classification || 'TERBATAS'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                    {entry.narrative}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {entry.location} ({entry.kecamatan})
                      </span>
                      {entry.officerName && (
                        <span className="hidden sm:inline text-slate-400">
                          • {entry.officerName}
                        </span>
                      )}
                    </div>
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

      {/* Case Statistics Quick Matrix Summary */}
      <div className="bg-[#151F33] border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              Statistik Penanganan Perkara Khusus & Menonjol (Tahun 2026)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rekapitulasi tahapan Lid/SPDP, Dik Kejaksaan, Dik Kepolisian, dan Penuntutan (Tut)
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('case-stats')}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-auto transition-colors"
          >
            Buka Editor Statistik Perkara →
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0B1120] text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3.5">Kategori Perkara</th>
                <th className="py-3 px-3.5 text-center">Lid / SPDP</th>
                <th className="py-3 px-3.5 text-center">Dik Kejaksaan (Tahap I)</th>
                <th className="py-3 px-3.5 text-center">Dik Kepolisian (Tahap II)</th>
                <th className="py-3 px-3.5 text-center">Penuntutan (Tut)</th>
                <th className="py-3 px-3.5 text-center">Total Tahapan</th>
                <th className="py-3 px-3.5">Catatan Perkembangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-[#151F33]/40">
              {stats2026.map((stat) => {
                const total =
                  stat.stages.lid_spdp +
                  stat.stages.dik_kejaksaan +
                  stat.stages.dik_kepolisian +
                  stat.stages.tut;
                return (
                  <tr key={stat.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3.5 font-semibold text-slate-200">
                      {stat.category}
                    </td>
                    <td className="py-3 px-3.5 text-center font-mono font-bold text-slate-300">
                      {stat.stages.lid_spdp}
                    </td>
                    <td className="py-3 px-3.5 text-center font-mono font-bold text-slate-300">
                      {stat.stages.dik_kejaksaan}
                    </td>
                    <td className="py-3 px-3.5 text-center font-mono font-bold text-slate-300">
                      {stat.stages.dik_kepolisian}
                    </td>
                    <td className="py-3 px-3.5 text-center font-mono font-bold text-emerald-400">
                      {stat.stages.tut}
                    </td>
                    <td className="py-3 px-3.5 text-center font-mono font-bold text-amber-400 bg-[#0B1120]/50">
                      {total}
                    </td>
                    <td className="py-3 px-3.5 text-slate-400 text-[11px] max-w-xs truncate">
                      {stat.notes || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
