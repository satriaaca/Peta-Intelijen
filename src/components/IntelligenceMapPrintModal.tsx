import React, { useState } from 'react';
import { 
  Printer, 
  X, 
  Shield, 
  MapPin, 
  Compass, 
  Calendar, 
  CheckCircle2, 
  Layers, 
  FileText,
  Sliders,
  Filter
} from 'lucide-react';
import { IntelligenceEntry } from '../types';
import { TABANAN_KECAMATAN } from '../services/seedData';
import { TABANAN_STRATEGIC_74_LANDMARKS, StrategicLandmarkPoint } from '../services/mapSymbolRenderer';
import { findSubsectorSymbol, OFFICIAL_SECTOR_SYMBOLS, OfficialSubsectorSymbol } from '../services/officialDinData';

interface IntelligenceMapPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: IntelligenceEntry[];
  selectedKecamatan: string;
  onSelectKecamatan: (kec: string) => void;
  selectedSectorFilter: string;
  includeStrategicLandmarks: boolean;
}

export default function IntelligenceMapPrintModal({
  isOpen,
  onClose,
  entries,
  selectedKecamatan,
  onSelectKecamatan,
  selectedSectorFilter,
  includeStrategicLandmarks,
}: IntelligenceMapPrintModalProps) {
  const [classification, setClassification] = useState<'RAHASIA' | 'TERBATAS' | 'BIASA'>('RAHASIA');
  const [printDetailLevel, setPrintDetailLevel] = useState<'full' | 'summary'>('full');
  const [kasiName] = useState<string>('I GUSTI NGURAH ANOM, S.H., M.H.');
  const [kasiNip] = useState<string>('19820514 200703 1 002 / Jaksa Madya');
  const [petugasName] = useState<string>('TIM SATGAS PETA INTELIJEN');

  if (!isOpen) return null;

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    const matchKec = selectedKecamatan === 'Semua' || entry.kecamatan.toLowerCase().includes(selectedKecamatan.toLowerCase());
    const matchSec = selectedSectorFilter === 'ALL' || entry.section === selectedSectorFilter || entry.sektor_symbol === selectedSectorFilter;
    return matchKec && matchSec;
  });

  // Filter strategic landmarks
  const filteredLandmarks: StrategicLandmarkPoint[] = includeStrategicLandmarks
    ? TABANAN_STRATEGIC_74_LANDMARKS.filter((lm) => {
        const matchKec = selectedKecamatan === 'Semua' || lm.kecamatan.toLowerCase() === selectedKecamatan.toLowerCase();
        const sym = findSubsectorSymbol(lm.symbolBadgeCode);
        const matchSec = selectedSectorFilter === 'ALL' || sym?.sectionCode === selectedSectorFilter || sym?.badgeCode === selectedSectorFilter;
        return matchKec && matchSec;
      })
    : [];

  // Compute active 74 symbols in current view
  const activeSymbolsMap = new Map<string, { symbol: OfficialSubsectorSymbol; count: number; points: string[] }>();

  filteredEntries.forEach((entry) => {
    const sym = findSubsectorSymbol(entry.sektor_symbol || entry.keterangan || entry.section || '');
    if (sym) {
      const existing = activeSymbolsMap.get(sym.badgeCode);
      const ptName = entry.location ? `${entry.location} (${entry.kecamatan})` : entry.kecamatan;
      if (existing) {
        existing.count += 1;
        existing.points.push(ptName);
      } else {
        activeSymbolsMap.set(sym.badgeCode, {
          symbol: sym,
          count: 1,
          points: [ptName],
        });
      }
    }
  });

  filteredLandmarks.forEach((lm) => {
    const sym = findSubsectorSymbol(lm.symbolBadgeCode);
    if (sym) {
      const existing = activeSymbolsMap.get(sym.badgeCode);
      const ptName = `${lm.name} (${lm.kecamatan})`;
      if (existing) {
        existing.count += 1;
        existing.points.push(ptName);
      } else {
        activeSymbolsMap.set(sym.badgeCode, {
          symbol: sym,
          count: 1,
          points: [ptName],
        });
      }
    }
  });

  const activeSymbolsList = Array.from(activeSymbolsMap.values()).sort((a, b) => b.count - a.count);
  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      {/* Container Dialog */}
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl print:max-w-none print:max-h-none print:w-full print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Modal Toolbar (Hidden during browser printing) */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Modul Cetak Peta Intelijen Geospasial D.IN.1</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500 text-slate-950 font-bold">
                  KEP-135/2019
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Format dokumen resmi Kejaksaan Negeri Tabanan untuk laporan pimpinan dan arsip yustisial.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang (Print / PDF)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Print Configuration Controls Bar (Hidden in print) */}
        <div className="bg-slate-900/90 border-b border-slate-800 p-3.5 px-6 flex flex-wrap items-center justify-between gap-4 text-xs print:hidden">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Wilayah:</span>
              <select
                value={selectedKecamatan}
                onChange={(e) => onSelectKecamatan(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="Semua">Seluruh Kabupaten Tabanan (10 Kecamatan)</option>
                {TABANAN_KECAMATAN.map((kec) => (
                  <option key={kec} value={kec}>
                    Kecamatan {kec}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Klasifikasi:</span>
              <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
                {(['RAHASIA', 'TERBATAS', 'BIASA'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setClassification(lvl)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      classification === lvl
                        ? lvl === 'RAHASIA'
                          ? 'bg-red-600 text-white shadow'
                          : lvl === 'TERBATAS'
                          ? 'bg-amber-500 text-slate-950 shadow'
                          : 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Format Tabel:</span>
              <button
                type="button"
                onClick={() => setPrintDetailLevel(printDetailLevel === 'full' ? 'summary' : 'full')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-medium hover:bg-slate-700 transition-colors"
              >
                {printDetailLevel === 'full' ? 'Lengkap (Peta + Legenda + 5W+1H)' : 'Ringkas (Peta + Legenda)'}
              </button>
            </div>
          </div>

          <div className="text-slate-400 text-[11px] font-mono">
            {activeSymbolsList.length} Simbol Aktif • {filteredEntries.length + filteredLandmarks.length} Titik Pantau
          </div>
        </div>

        {/* PRINT DOCUMENT PAPER CANVAS */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-950/40 print:p-0 print:bg-white print:overflow-visible text-slate-200 print:text-black">
          <div className="max-w-4xl mx-auto bg-[#0F172A] border border-slate-800 p-8 rounded-2xl shadow-xl print:shadow-none print:border-none print:p-4 print:bg-white print:text-black print:max-w-none">
            
            {/* 1. Official Kejaksaan Letterhead / KOP RESMI */}
            <div className="border-b-2 border-slate-700 print:border-black pb-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="text-xs font-bold tracking-widest text-amber-400 print:text-black uppercase">
                    KEJAKSAAN REPUBLIK INDONESIA
                  </div>
                  <div className="text-sm font-extrabold tracking-wider text-slate-100 print:text-black uppercase">
                    KEJAKSAAN TINGGI BALI
                  </div>
                  <div className="text-base font-black tracking-wide text-white print:text-black uppercase">
                    KEJAKSAAN NEGERI TABANAN
                  </div>
                  <div className="text-[11px] text-slate-400 print:text-gray-700 mt-0.5">
                    Jl. Pulau Batam No. 8, Tabanan, Bali (82121) • Telepon: (0361) 811050
                  </div>
                </div>

                {/* Stamp / Security Watermark Badge */}
                <div className="shrink-0 text-right">
                  <div
                    className={`inline-block px-3 py-1 border-2 font-mono font-black text-xs uppercase tracking-wider rounded ${
                      classification === 'RAHASIA'
                        ? 'border-red-500 text-red-400 print:border-red-700 print:text-red-700'
                        : classification === 'TERBATAS'
                        ? 'border-amber-500 text-amber-400 print:border-yellow-700 print:text-yellow-700'
                        : 'border-emerald-500 text-emerald-400 print:border-emerald-700 print:text-emerald-700'
                    }`}
                  >
                    {classification}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 print:text-gray-600 mt-1">
                    REG: PETA-D.IN.1/2026/KN.TBN
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Document Title */}
            <div className="text-center mb-6">
              <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-white print:text-black">
                PETA SEBARAN SITUASI GEOSPASIAL INTELIJEN YUSTISIAL
              </h1>
              <div className="text-xs font-bold text-amber-400 print:text-black uppercase mt-1 flex items-center justify-center gap-2">
                <span>WILAYAH: {selectedKecamatan === 'Semua' ? 'SELURUH KABUPATEN TABANAN' : `KECAMATAN ${selectedKecamatan.toUpperCase()}`}</span>
                <span>•</span>
                <span>TAHUN ANGGARAN 2026</span>
              </div>
              <p className="text-[11px] text-slate-400 print:text-gray-600 mt-0.5">
                Berdasarkan Pedoman Petunjuk Teknis Administrasi Intelijen Kejaksaan RI (Lampiran IV KEP-135/A/JA/05/2019)
              </p>
            </div>

            {/* 3. High-Contrast Map Visual Representation & Coordinate Grid */}
            <div className="mb-6 rounded-xl border border-slate-700 print:border-gray-800 bg-[#070D18] print:bg-gray-50 p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs mb-3 pb-2 border-b border-slate-800 print:border-gray-300">
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300 print:text-gray-800">
                  <Compass className="w-4 h-4 text-amber-400 print:text-black" />
                  <span>ORIENTASI: UTARA (GRID UTM ZONA 50S)</span>
                  <span className="text-slate-400">|</span>
                  <span>SKALA: 1:50.000 / GEOSPASIAL WGS 84</span>
                </div>
                <div className="font-mono text-[10px] text-slate-400 print:text-gray-600">
                  LAT: -8.2500 s/d -8.6300 • LNG: 114.9300 s/d 115.2100
                </div>
              </div>

              {/* Graphical Overview Grid with 74 Symbol Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {TABANAN_KECAMATAN.map((kec) => {
                  const isSelected = selectedKecamatan === 'Semua' || selectedKecamatan.toLowerCase() === kec.toLowerCase();
                  const kecEntries = filteredEntries.filter((e) => e.kecamatan.toLowerCase().includes(kec.toLowerCase()));
                  const kecLandmarks = filteredLandmarks.filter((l) => l.kecamatan.toLowerCase() === kec.toLowerCase());
                  const totalInKec = kecEntries.length + kecLandmarks.length;

                  // Distinct symbols in this kec
                  const distinctSymbols: string[] = [];
                  kecEntries.forEach((e) => {
                    const symCode = e.sektor_symbol || e.keterangan || e.section;
                    if (symCode && !distinctSymbols.includes(symCode)) {
                      distinctSymbols.push(symCode);
                    }
                  });
                  kecLandmarks.forEach((l) => {
                    if (l.symbolBadgeCode && !distinctSymbols.includes(l.symbolBadgeCode)) {
                      distinctSymbols.push(l.symbolBadgeCode);
                    }
                  });

                  return (
                    <div
                      key={kec}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'bg-slate-900 print:bg-white border-amber-500/50 print:border-black shadow-sm'
                          : 'bg-slate-950/40 print:bg-gray-100 border-slate-800/80 print:border-gray-300 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-white print:text-black uppercase truncate">{kec}</span>
                        <span className="font-mono text-amber-400 print:text-black font-extrabold text-[10px]">
                          {totalInKec} Titik
                        </span>
                      </div>

                      {/* Micro Symbol Badges */}
                      <div className="flex items-center gap-1 flex-wrap mt-2">
                        {distinctSymbols.slice(0, 4).map((symCode) => {
                          const sym = findSubsectorSymbol(symCode);
                          return (
                            <span
                              key={symCode}
                              className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border print:text-black"
                              style={{
                                backgroundColor: `${sym?.themeColor || '#64748b'}20`,
                                borderColor: sym?.themeColor || '#64748b',
                                color: sym?.themeColor || '#64748b',
                              }}
                              title={sym?.name}
                            >
                              {sym ? `${sym.sectionCode.replace('D.IN.', '')}.${sym.no}` : symCode.slice(0, 4)}
                            </span>
                          );
                        })}
                        {distinctSymbols.length > 4 && (
                          <span className="text-[9px] font-mono text-slate-400 print:text-gray-600">
                            +{distinctSymbols.length - 4}
                          </span>
                        )}
                        {distinctSymbols.length === 0 && (
                          <span className="text-[9px] text-slate-400 print:text-gray-500 italic">
                            Kondusif
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Tabel Legenda 74 Simbol Resmi yang Aktif */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>DAFTAR LEGENDA 74 SIMBOL INTELIJEN TERPETA</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400 print:text-gray-600">
                  {activeSymbolsList.length} Simbol Aktif
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-700 print:border-black">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-900 print:bg-gray-200 text-slate-300 print:text-black font-bold uppercase text-[10px] border-b border-slate-700 print:border-black">
                      <th className="py-2 px-2.5 text-center w-10">No</th>
                      <th className="py-2 px-2.5 text-center w-14">Simbol</th>
                      <th className="py-2 px-3">Kode & Subsektor Resmi</th>
                      <th className="py-2 px-3">Kategori Sektor</th>
                      <th className="py-2 px-3 text-center w-16">Jumlah</th>
                      <th className="py-2 px-3">Sebaran Lokasi / Landmark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-gray-300 bg-slate-950 print:bg-white">
                    {activeSymbolsList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-slate-400 print:text-gray-600">
                          Tidak ada simbol yang cocok dengan filter yang dipilih.
                        </td>
                      </tr>
                    ) : (
                      activeSymbolsList.map((item, idx) => (
                        <tr key={item.symbol.id} className="hover:bg-slate-900/50 print:hover:bg-transparent">
                          <td className="py-2 px-2.5 text-center font-mono text-slate-400 print:text-black">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-2.5 text-center">
                            <div
                              className="w-7 h-7 mx-auto rounded flex items-center justify-center border font-mono font-bold text-[9px]"
                              style={{
                                borderColor: item.symbol.themeColor,
                                backgroundColor: `${item.symbol.themeColor}15`,
                                color: item.symbol.themeColor,
                              }}
                            >
                              {item.symbol.sectionCode.replace('D.IN.', '')}.{item.symbol.no}
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            <div className="font-bold text-white print:text-black">
                              {item.symbol.name}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 print:text-gray-600">
                              Kepja ID: {item.symbol.id} • [{item.symbol.badgeCode}]
                            </div>
                          </td>
                          <td className="py-2 px-3 text-slate-300 print:text-gray-800">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 print:bg-gray-200 border border-slate-700 print:border-gray-400">
                              {item.symbol.sectionCode} ({item.symbol.category})
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-amber-400 print:text-black">
                            {item.count}
                          </td>
                          <td className="py-2 px-3 text-slate-400 print:text-gray-700 text-[10px]">
                            {item.points.slice(0, 3).join(', ')}
                            {item.points.length > 3 && ` (+${item.points.length - 3} lainnya)`}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Tabel Rekapitulasi Data Titik Pantau (5W+1H Yustisial) - jika format Lengkap */}
            {printDetailLevel === 'full' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>REKAPITULASI LAPORAN & TITIK PANTAU INTELIJEN</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 print:text-gray-600">
                    Total {filteredEntries.length + filteredLandmarks.length} Data
                  </span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-700 print:border-black">
                  <table className="w-full text-left text-[10px] border-collapse">
                    <thead>
                      <tr className="bg-slate-900 print:bg-gray-200 text-slate-300 print:text-black font-bold uppercase border-b border-slate-700 print:border-black">
                        <th className="py-2 px-2 text-center w-8">No</th>
                        <th className="py-2 px-2 w-20">No. Reg / Tgl</th>
                        <th className="py-2 px-2 w-24">Simbol & Sektor</th>
                        <th className="py-2 px-2 w-28">Lokasi / Kecamatan</th>
                        <th className="py-2 px-2">Uraian Fakta Ringkas (5W+1H) / Keterangan</th>
                        <th className="py-2 px-2 w-20 text-center">Klasifikasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 print:divide-gray-300 bg-slate-950 print:bg-white">
                      {filteredEntries.map((e, idx) => {
                        const sym = findSubsectorSymbol(e.sektor_symbol || e.keterangan || e.section || '');
                        const coords = e.latitude && e.longitude ? `${e.latitude.toFixed(4)}, ${e.longitude.toFixed(4)}` : 'Tabanan';
                        return (
                          <tr key={e.id} className="hover:bg-slate-900/50 print:hover:bg-transparent">
                            <td className="py-1.5 px-2 text-center font-mono text-slate-400 print:text-black">
                              {idx + 1}
                            </td>
                            <td className="py-1.5 px-2 font-mono">
                              <div className="font-bold text-slate-200 print:text-black">{e.no}</div>
                              <div className="text-[9px] text-slate-400 print:text-gray-600">{e.date}</div>
                            </td>
                            <td className="py-1.5 px-2">
                              <span className="font-bold text-amber-400 print:text-black">
                                {sym ? `${sym.sectionCode} #${sym.no}` : e.section}
                              </span>
                              <div className="text-[9px] text-slate-400 print:text-gray-600 truncate max-w-[90px]">
                                {sym?.name || e.sektor_symbol || e.keterangan || '-'}
                              </div>
                            </td>
                            <td className="py-1.5 px-2">
                              <div className="font-semibold text-slate-200 print:text-black">
                                {e.location ? `${e.location}, ${e.kecamatan}` : e.kecamatan}
                              </div>
                              <div className="text-[8px] font-mono text-slate-400 print:text-gray-500">
                                {coords}
                              </div>
                            </td>
                            <td className="py-1.5 px-2 text-slate-300 print:text-gray-800">
                              <div className="font-medium text-white print:text-black">{e.keterangan}</div>
                              <div className="text-[9px] text-slate-400 print:text-gray-600 line-clamp-2 mt-0.5">
                                {e.narrative || '-'}
                              </div>
                            </td>
                            <td className="py-1.5 px-2 text-center">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold border ${
                                  e.classification === 'RAHASIA'
                                    ? 'bg-red-500/20 text-red-400 border-red-500/40 print:text-red-700'
                                    : e.classification === 'TERBATAS'
                                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 print:text-yellow-700'
                                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 print:text-emerald-700'
                                }`}
                              >
                                {e.classification || 'TERBATAS'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}

                      {/* Strategic Landmarks if included */}
                      {filteredLandmarks.map((lm, idx) => {
                        const sym = findSubsectorSymbol(lm.symbolBadgeCode);
                        return (
                          <tr key={lm.id} className="bg-sky-950/20 print:bg-gray-50">
                            <td className="py-1.5 px-2 text-center font-mono text-sky-400 print:text-black">
                              {filteredEntries.length + idx + 1}
                            </td>
                            <td className="py-1.5 px-2 font-mono">
                              <div className="font-bold text-sky-300 print:text-blue-800">{lm.id}</div>
                              <div className="text-[9px] text-slate-400 print:text-gray-600">OBVITNAS/DA</div>
                            </td>
                            <td className="py-1.5 px-2">
                              <span className="font-bold text-sky-400 print:text-black">
                                {sym ? `${sym.sectionCode} #${sym.no}` : lm.symbolBadgeCode}
                              </span>
                              <div className="text-[9px] text-slate-400 print:text-gray-600 truncate max-w-[90px]">
                                {sym?.name || lm.symbolBadgeCode}
                              </div>
                            </td>
                            <td className="py-1.5 px-2">
                              <div className="font-semibold text-slate-200 print:text-black">
                                {lm.name} ({lm.kecamatan})
                              </div>
                              <div className="text-[8px] font-mono text-slate-400 print:text-gray-500">
                                {lm.lat.toFixed(4)}, {lm.lng.toFixed(4)}
                              </div>
                            </td>
                            <td className="py-1.5 px-2 text-slate-300 print:text-gray-800">
                              <div className="font-medium text-white print:text-black">{lm.keterangan}</div>
                              <div className="text-[9px] text-slate-400 print:text-gray-600 mt-0.5">
                                {lm.description}
                              </div>
                            </td>
                            <td className="py-1.5 px-2 text-center">
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/40 print:text-blue-800">
                                {lm.importance}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. Formal Signature Block / Lembar Pengesahan */}
            <div className="mt-8 pt-4 border-t border-slate-700 print:border-black grid grid-cols-2 gap-8 text-xs text-center">
              <div>
                <div className="text-slate-400 print:text-gray-600 mb-1">Dibuat Oleh:</div>
                <div className="font-bold text-white print:text-black uppercase">
                  PETUGAS PEMETAAN INTELIJEN
                </div>
                <div className="h-16 flex items-center justify-center text-slate-400 print:text-gray-400 italic text-[10px]">
                  (Tanda Tangan & Cap Dinas)
                </div>
                <div className="font-bold text-slate-200 print:text-black underline">
                  {petugasName}
                </div>
                <div className="text-[10px] font-mono text-slate-400 print:text-gray-600">
                  SATKER 22.08 TABANAN
                </div>
              </div>

              <div>
                <div className="text-slate-400 print:text-gray-600 mb-1">
                  Tabanan, {currentDateFormatted}
                </div>
                <div className="font-bold text-white print:text-black uppercase">
                  KEPALA SEKSI INTELIJEN
                </div>
                <div className="h-16 flex items-center justify-center text-slate-400 print:text-gray-400 italic text-[10px]">
                  (Tanda Tangan & Cap Dinas)
                </div>
                <div className="font-bold text-slate-200 print:text-black underline">
                  {kasiName}
                </div>
                <div className="text-[10px] font-mono text-slate-400 print:text-gray-600">
                  NIP. {kasiNip}
                </div>
              </div>
            </div>

            {/* Print Footer Notice */}
            <div className="mt-6 pt-3 border-t border-slate-800 print:border-gray-300 text-[9px] font-mono text-slate-400 print:text-gray-600 flex justify-between items-center">
              <span>Sistem Informasi Papan Peta Intelijen Terpadu (SIPPI) Kejari Tabanan</span>
              <span>Dokumen Negara — Hak Akses Khusus Aparatur Kejaksaan RI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
