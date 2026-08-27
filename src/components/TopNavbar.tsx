import { useState, useEffect } from 'react';
import { 
  Menu, 
  Clock, 
  Presentation, 
  Plus, 
  ExternalLink,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { SectionId } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TopNavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenMobileMenu: () => void;
  onNavigateToForm: (sectionId?: SectionId) => void;
  onOpenReportModal: () => void;
}

export default function TopNavbar({
  activeTab,
  setActiveTab,
  onOpenMobileMenu,
  onNavigateToForm,
  onOpenReportModal,
}: TopNavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');


  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Makassar',
        }) + ' WITA'
      );
      setDateStr(
        now.toLocaleDateString('id-ID', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          timeZone: 'Asia/Makassar',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPageInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Dashboard Intelijen Kejari Tabanan',
          subtitle: 'Statistik Penkum & Luhkum, Sektor D.IN.2–6 & Tabel D.IN.1 (CRUD)',
        };
      case 'map':
        return {
          title: 'Peta Intelijen Geospasial Tabanan',
          subtitle: 'Marker D.IN.2 s/d D.IN.6 (74 Simbol), Input CSV & Cetak Peta',
        };
      case 'pora':
        return {
          title: 'PORA — Pengawasan Orang Asing (D.IN.10)',
          subtitle: 'Biodata WNA, Monitoring Izin Tinggal, Paspor & Hasil PDF Resmi',
        };
      case 'case-stats':
        return {
          title: 'Data Grafik Perkara (Data Jampidum)',
          subtitle: 'Statistik Perkara Korupsi & Narkotika (SPDP s/d Putusan) — Filter Bulan & Tahun',
        };
      case 'tik-cards':
        return {
          title: 'Bank Data & KARTU TIK (D.IN.12 s/d D.IN.16)',
          subtitle: 'Biodata, Catatan Intelijen Kriminal, Terpidana — Opsi Input CSV & Format PDF',
        };
      case 'entry-form':
        return {
          title: 'Formulir Laporan Sektor (D.IN.2 s/d D.IN.6)',
          subtitle: 'Input dan Kelola Laporan Intelijen Sektor Yustisial Tabanan',
        };
      case 'symbol-catalog':
        return {
          title: 'Katalog 74 Simbol Resmi Sektor Intelijen',
          subtitle: 'Standar Keputusan Jaksa Agung RI Nomor KEP-135/A/JA/05/2019',
        };
      default:
        return {
          title: 'SIPPI — Papan Peta Intelijen Kejari Tabanan',
          subtitle: 'Seksi Intelijen Kejaksaan Negeri Tabanan (SATYA ADHI WICAKSANA)',
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <span>SIPPI Tabanan</span>
            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
            <span className="text-amber-400 font-semibold truncate">{pageInfo.title}</span>
          </div>
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
            {pageInfo.title}
          </h1>
        </div>
      </div>

      {/* Right: Badges & Fast Action Buttons */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Classification Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>RAHASIA / TERBATAS</span>
        </div>

        {/* Live WITA Clock */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{dateStr}</span>
          <span className="text-slate-200 font-bold">{timeStr}</span>
        </div>

        {/* Theme Toggle Button (Light/Dark Mode) */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            theme === 'light'
              ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 shadow-sm'
              : 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
          }`}
          title={theme === 'light' ? 'Beralih ke Mode Gelap' : 'Beralih ke Mode Terang'}
        >
          {theme === 'light' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-600 fill-amber-500/20" />
              <span className="hidden sm:inline">Tema Terang</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Tema Gelap</span>
            </>
          )}
        </button>

        {/* Quick Action: New Report */}
        {activeTab !== 'entry-form' && (
          <button
            type="button"
            onClick={() => onNavigateToForm('D.IN.1')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Input Laporan</span>
          </button>
        )}

        {/* Quick Action: Official Slide Modal */}
        <button
          type="button"
          onClick={onOpenReportModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 cursor-pointer transition-all"
        >
          <Presentation className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Papan Slide</span>
        </button>
      </div>
    </header>
  );
}
