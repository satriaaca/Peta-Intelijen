import { useState, useEffect } from 'react';
import { 
  Menu, 
  Clock, 
  Presentation, 
  Plus, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { SectionId } from '../types';

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
          title: 'Ringkasan & Peta Intelijen',
          subtitle: 'Pemetaan Situasi Wilayah & Matriks Ancaman',
        };
      case 'entry-form':
        return {
          title: 'Input & Manajemen Laporan D.IN (1–6)',
          subtitle: 'Formulir Standar Intelijen Berdasarkan Prinsip 5W+1H',
        };
      case 'outreach-form':
        return {
          title: 'Penerangan Hukum & JMS (D.IN.7)',
          subtitle: 'Pelaksanaan Program Edukasi & Sosialisasi Hukum Masyarakat',
        };
      case 'case-stats':
        return {
          title: 'Statistik Perkara & Integrasi JAMPIDUM',
          subtitle: 'Siklus Perkara Yustisial & Data Real-Time Kejaksaan RI',
        };
      case 'charts':
        return {
          title: 'Grafik Visual & Tren Analitik',
          subtitle: 'Komposisi Bidang, Sebaran Wilayah, dan Progres Penanganan',
        };
      case 'data-table':
        return {
          title: 'Data Tabel Terpadu Intelijen',
          subtitle: 'Katalog Pencarian, Filter Wilayah, dan Ekspor Rekap',
        };
      case 'official-board':
        return {
          title: 'Papan Intelijen (Slide Presentasi)',
          subtitle: 'Mode Tampilan Paparan Resmi untuk Pimpinan',
        };
      default:
        return {
          title: 'Sistem Informasi Intelijen',
          subtitle: 'Kejaksaan Negeri Tabanan',
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
