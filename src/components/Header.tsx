import { useState, useEffect } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  FileEdit, 
  Megaphone, 
  Scale, 
  BarChart3, 
  Table2, 
  Presentation, 
  LogOut, 
  Clock, 
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { AppUser } from '../types';

export type ActiveTab = 'dashboard' | 'entry-form' | 'outreach-form' | 'case-stats' | 'charts' | 'data-table' | 'official-board';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: AppUser | null;
  onLogout: () => void;
  onResetData: () => void;
  selectedSectionForForm?: string;
  setSelectedSectionForForm?: (sec: any) => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onResetData,
}: HeaderProps) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

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
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'Asia/Makassar',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Ringkasan & Peta', icon: LayoutDashboard },
    { id: 'entry-form', label: 'Form Laporan D.IN (1–6)', icon: FileEdit },
    { id: 'outreach-form', label: 'Penkum & JMS (D.IN.7)', icon: Megaphone },
    { id: 'case-stats', label: 'Statistik Perkara', icon: Scale },
    { id: 'charts', label: 'Grafik & Tren', icon: BarChart3 },
    { id: 'data-table', label: 'Data Tabel Terpadu', icon: Table2 },
    { id: 'official-board', label: 'Papan Intelijen (Slide/Cetak)', icon: Presentation },
  ];

  return (
    <header className="bg-[#0F172A] border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-xl backdrop-blur">
      {/* Top Bar with Official Emblem and Badges */}
      <div className="px-4 sm:px-6 py-2.5 bg-[#151F33]/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Emblem and Official Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 font-bold">
            <Shield className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider text-amber-400 uppercase">
                SATYA ADHI WICAKSANA
              </span>
              <span className="text-[10px] bg-slate-800/80 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                KEJAKSAAN AGUNG R.I.
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
              Papan Peta Intelijen — Kejaksaan Negeri Tabanan
            </h1>
          </div>
        </div>

        {/* Right: Security Classification, Time & User Profile */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* Classification Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            RAHASIA / TERBATAS
          </div>

          {/* Time Display */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{dateStr}</span>
            <span className="text-slate-200 font-bold ml-1">{timeStr}</span>
          </div>

          {/* User Profile & Logout */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-200">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-amber-400 font-mono">
                  {currentUser.role}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                title="Reset Database ke Data Awal"
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onLogout}
                title="Keluar / Ganti Petugas"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="px-4 sm:px-6 flex items-center overflow-x-auto no-scrollbar gap-1 border-t border-slate-800/60 bg-[#0F172A]/95">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Confirmation Modal for Data Reset */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-5 max-w-sm w-full text-slate-100 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm">Kembalikan Data Awal?</h3>
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Tindakan ini akan mengatur ulang data Laporan D.IN, data kegiatan Penkum, dan statistik perkara ke data bawaan resmi Kejari Tabanan.
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onResetData();
                  setShowConfirmReset(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow transition-all"
              >
                Ya, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
