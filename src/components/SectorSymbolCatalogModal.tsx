import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Shield, 
  Info, 
  Check, 
  Filter, 
  BookOpen, 
  Scale, 
  FileText,
  Copy
} from 'lucide-react';
import { OFFICIAL_SECTOR_SYMBOLS, OfficialSubsectorSymbol } from '../services/officialDinData';
import SectorSymbolBadge from './SectorSymbolBadge';

interface SectorSymbolCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbol?: (symbol: OfficialSubsectorSymbol) => void;
  selectedSectionCode?: string;
}

export default function SectorSymbolCatalogModal({
  isOpen,
  onClose,
  onSelectSymbol,
  selectedSectionCode = 'ALL'
}: SectorSymbolCatalogModalProps) {
  const [activeFilter, setActiveFilter] = useState<string>(selectedSectionCode || 'ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const sectionTabs = [
    { id: 'ALL', label: 'Semua Simbol (74)', code: 'ALL' },
    { id: 'D.IN.2', label: 'D.IN.2 Ipolhankam & Cekal PORA', code: 'D.IN.2' },
    { id: 'D.IN.3', label: 'D.IN.3 Sosbud & Kemasyarakatan', code: 'D.IN.3' },
    { id: 'D.IN.4', label: 'D.IN.4 Ekonomi & Keuangan', code: 'D.IN.4' },
    { id: 'D.IN.5', label: 'D.IN.5 Pengamanan Pembangunan Strategis', code: 'D.IN.5' },
    { id: 'D.IN.6', label: 'D.IN.6 TI & Produksi Intelijen', code: 'D.IN.6' },
  ];

  // Flatten symbols
  const allSymbols: OfficialSubsectorSymbol[] = Object.values(OFFICIAL_SECTOR_SYMBOLS).flat();

  const filteredSymbols = allSymbols.filter((sym) => {
    const matchesFilter = activeFilter === 'ALL' || sym.sectionCode === activeFilter;
    const matchesQuery = 
      sym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sym.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sym.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sym.badgeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sym.sectionCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const handleCopySymbol = (sym: OfficialSubsectorSymbol) => {
    navigator.clipboard.writeText(`${sym.sectionCode} - ${sym.name}`);
    setCopiedId(sym.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#0B1120] border border-slate-700/80 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-start justify-between bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  KEP-135/A/JA/05/2019
                </span>
                <span className="text-xs text-slate-400">Lampiran IV Standar Kejaksaan RI</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                Katalog Simbol Sektor Intelijen Yustisial
              </h2>
              <p className="text-xs text-slate-400">
                Visualisasi vektor presisi untuk pengisian Kolom 2 Data Peta (D.IN.1 s/d D.IN.6)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Search */}
        <div className="p-4 border-b border-slate-800 bg-[#0F172A]/70 flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {sectionTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari simbol (e.g. SIKAP, Pancasila, Jalan)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Symbols Grid Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Menampilkan <b>{filteredSymbols.length}</b> simbol sektor resmi</span>
            <span className="italic">* Klik simbol untuk memilih atau menyalin referensi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredSymbols.map((sym) => (
              <div
                key={sym.id}
                onClick={() => {
                  if (onSelectSymbol) {
                    onSelectSymbol(sym);
                    onClose();
                  } else {
                    handleCopySymbol(sym);
                  }
                }}
                className="group p-3.5 rounded-2xl bg-[#0F172A]/80 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <SectorSymbolBadge symbolCodeOrName={sym.badgeCode} size="lg" />
                    
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 block">
                        {sym.sectionCode} No. {sym.no}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {sym.category}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                    {sym.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {sym.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="font-mono text-slate-500">KODE: {sym.badgeCode}</span>
                  <div className="flex items-center gap-1 text-amber-400 group-hover:underline">
                    {copiedId === sym.id ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                        <Check className="w-3 h-3" /> Tersalin
                      </span>
                    ) : onSelectSymbol ? (
                      <span>Pilih Simbol Ini →</span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy className="w-3 h-3" /> Salin Teks
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400" />
            <span>Format Resmi Sesuai Keputusan Jaksa Agung RI Nomor KEP-135/A/JA/05/2019</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer transition-colors"
          >
            Tutup Katalog
          </button>
        </div>

      </div>
    </div>
  );
}
