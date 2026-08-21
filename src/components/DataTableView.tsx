import { useState, useMemo } from 'react';
import { 
  Table2, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Eye, 
  Trash2, 
  Edit3, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  ArrowUpDown,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { IntelligenceEntry, SectionId } from '../types';
import { SECTIONS_CONFIG, TABANAN_KECAMATAN } from '../services/seedData';

interface DataTableViewProps {
  entries: IntelligenceEntry[];
  onViewDetail: (entry: IntelligenceEntry) => void;
  onEditEntry: (entry: IntelligenceEntry) => void;
  onDeleteEntry: (id: string, section: SectionId) => Promise<void>;
  onOpenReportModal: () => void;
}

export default function DataTableView({
  entries,
  onViewDetail,
  onEditEntry,
  onDeleteEntry,
  onOpenReportModal,
}: DataTableViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [selectedKeterangan, setSelectedKeterangan] = useState<string>('ALL');
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('ALL');
  const [selectedClassification, setSelectedClassification] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortField, setSortField] = useState<'date' | 'no' | 'section'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Extract all unique keterangan labels across entries
  const allKeteranganList = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => {
      if (e.keterangan) set.add(e.keterangan);
    });
    return Array.from(set);
  }, [entries]);

  // Filtered & Sorted Entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Search
      const matchesSearch =
        searchTerm === '' ||
        entry.no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.narrative.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.officerName && entry.officerName.toLowerCase().includes(searchTerm.toLowerCase()));

      // Section
      const matchesSection = selectedSection === 'ALL' || entry.section === selectedSection;

      // Keterangan / Category
      const matchesKeterangan = selectedKeterangan === 'ALL' || entry.keterangan === selectedKeterangan;

      // Kecamatan
      const matchesKecamatan = selectedKecamatan === 'ALL' || entry.kecamatan.toLowerCase().includes(selectedKecamatan.toLowerCase());

      // Classification
      const matchesClassification = selectedClassification === 'ALL' || entry.classification === selectedClassification;

      // Date Range
      let matchesDate = true;
      if (startDate && new Date(entry.date) < new Date(startDate)) matchesDate = false;
      if (endDate && new Date(entry.date) > new Date(endDate)) matchesDate = false;

      return matchesSearch && matchesSection && matchesKeterangan && matchesKecamatan && matchesClassification && matchesDate;
    }).sort((a, b) => {
      if (sortField === 'date') {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }
      if (sortField === 'no') {
        return sortOrder === 'asc' ? a.no.localeCompare(b.no) : b.no.localeCompare(a.no);
      }
      if (sortField === 'section') {
        return sortOrder === 'asc' ? a.section.localeCompare(b.section) : b.section.localeCompare(a.section);
      }
      return 0;
    });
  }, [
    entries,
    searchTerm,
    selectedSection,
    selectedKeterangan,
    selectedKecamatan,
    selectedClassification,
    startDate,
    endDate,
    sortField,
    sortOrder,
  ]);

  const handleExportCSV = () => {
    const headers = ['Nomor Register', 'Seksi', 'Sektor Symbol', 'Keterangan', 'Tanggal', 'Kecamatan', 'Lokasi', 'Klasifikasi', 'Status', 'Petugas', 'Narasi 5W+1H'];
    const rows = filteredEntries.map((e) => [
      `"${e.no}"`,
      `"${e.section}"`,
      `"${e.sektor_symbol}"`,
      `"${e.keterangan}"`,
      `"${e.date}"`,
      `"${e.kecamatan}"`,
      `"${e.location.replace(/"/g, '""')}"`,
      `"${e.classification || 'TERBATAS'}"`,
      `"${e.status || 'SELESAI'}"`,
      `"${(e.officerName || '').replace(/"/g, '""')}"`,
      `"${e.narrative.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Papan_Peta_Intelijen_Kejari_Tabanan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSection('ALL');
    setSelectedKeterangan('ALL');
    setSelectedKecamatan('ALL');
    setSelectedClassification('ALL');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Action Header */}
      <div className="bg-[#1E293B] border border-slate-700/70 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Table2 className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Master Data Tabel Papan Peta Intelijen
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Rekapitulasi seluruh laporan narasi 5W+1H (D.IN.1 s/d D.IN.6) dengan filter komprehensif, pencarian teks, dan opsi ekspor.
          </p>
        </div>

        {/* Export & Presentation Mode Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all"
          >
            <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Format Resmi Papan Peta</span>
          </button>
        </div>
      </div>

      {/* Filter Control Box */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            Filter & Pencarian Laporan
          </span>
          <button
            onClick={handleResetFilters}
            className="text-xs text-amber-400 hover:underline cursor-pointer font-semibold"
          >
            Reset Semua Filter
          </button>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Search Query */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Pencarian Kata Kunci
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari register, narasi, lokasi, petugas..."
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* 2. Section Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Seksi Laporan
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">Semua Seksi (D.IN.1–6)</option>
              {SECTIONS_CONFIG.filter((s) => s.id !== 'D.IN.7').map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.shortName}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Keterangan Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Keterangan / Kategori
            </label>
            <select
              value={selectedKeterangan}
              onChange={(e) => setSelectedKeterangan(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">Semua Keterangan</option>
              {allKeteranganList.map((kat) => (
                <option key={kat} value={kat}>
                  {kat}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Kecamatan Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Kecamatan
            </label>
            <select
              value={selectedKecamatan}
              onChange={(e) => setSelectedKecamatan(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">Semua Kecamatan</option>
              {TABANAN_KECAMATAN.map((kec) => (
                <option key={kec} value={kec}>
                  {kec}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Classification Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Klasifikasi
            </label>
            <select
              value={selectedClassification}
              onChange={(e) => setSelectedClassification(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-400 font-semibold focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">Semua Klasifikasi</option>
              <option value="TERBATAS">TERBATAS</option>
              <option value="RAHASIA">RAHASIA</option>
              <option value="BIASA">BIASA</option>
            </select>
          </div>
        </div>

        {/* Date Range Row */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Rentang Tanggal:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-[#0F172A] border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono"
            />
            <span className="text-slate-500">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-[#0F172A] border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono"
            />
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>
              Menampilkan <b className="text-amber-400 font-mono">{filteredEntries.length}</b> dari {entries.length} data
            </span>
          </div>
        </div>
      </div>

      {/* Main Master Table */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0F172A] text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                <th
                  onClick={() => {
                    setSortField('no');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-3.5 cursor-pointer hover:text-amber-400 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>No. Register</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => {
                    setSortField('section');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-3 cursor-pointer hover:text-amber-400 text-center w-24"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Seksi</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Keterangan / Sektor</th>
                <th
                  onClick={() => {
                    setSortField('date');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-3 cursor-pointer hover:text-amber-400 w-28 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Tanggal</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 w-40">Lokasi / Kecamatan</th>
                <th className="py-3 px-3.5 min-w-[320px]">Uraian Fakta Narasi Kronologis (5W+1H)</th>
                <th className="py-3 px-3 text-center w-24">Klasifikasi</th>
                <th className="py-3 px-3 text-center w-24">Status</th>
                <th className="py-3 px-3 text-right w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-[#1E293B]/40">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                    Tidak ditemukan data laporan intelijen yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-800/60 transition-colors">
                    {/* No Register */}
                    <td className="py-3 px-3.5 font-mono font-bold text-white whitespace-nowrap">
                      {entry.no}
                    </td>

                    {/* Section */}
                    <td className="py-3 px-3 text-center">
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {entry.section}
                      </span>
                    </td>

                    {/* Keterangan */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold font-mono px-1 py-0.5 rounded bg-slate-800 text-slate-300">
                          {entry.sektor_symbol}
                        </span>
                        <span className="text-xs text-slate-200 font-medium truncate max-w-[140px]" title={entry.keterangan}>
                          {entry.keterangan}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 font-mono text-slate-300 whitespace-nowrap">
                      {entry.date}
                    </td>

                    {/* Location */}
                    <td className="py-3 px-3 text-slate-300">
                      <div className="font-medium text-xs truncate max-w-[150px]" title={entry.location}>
                        {entry.location}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Kec. {entry.kecamatan}
                      </div>
                    </td>

                    {/* Narrative 5W+1H */}
                    <td className="py-3 px-3.5 text-slate-300 leading-relaxed text-xs">
                      <p className="line-clamp-2" title={entry.narrative}>
                        {entry.narrative}
                      </p>
                    </td>

                    {/* Classification */}
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {entry.classification || 'TERBATAS'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                        {entry.status || 'SELESAI'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewDetail(entry)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                          title="Lihat Detail 5W+1H"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditEntry(entry)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400"
                          title="Edit Laporan"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus laporan ${entry.no}?`)) {
                              onDeleteEntry(entry.id, entry.section);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400"
                          title="Hapus Laporan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
