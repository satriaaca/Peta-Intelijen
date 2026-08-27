import React, { useState } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  MapPin,
  UserCheck, 
  BarChart3, 
  CreditCard,
  LogOut, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Users,
  Sun,
  Moon
} from 'lucide-react';
import { AppUser } from '../types';
import { useTheme } from '../context/ThemeContext';

export type ActiveTab = 
  | 'dashboard' 
  | 'map'
  | 'pora'
  | 'case-stats' 
  | 'tik-cards'
  | 'entry-form' 
  | 'symbol-catalog';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: AppUser | null;
  onLogout: () => void;
  onResetData: () => void;
  onOpenWhitelistModal?: () => void;
  onOpenSymbolCatalog?: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  totalEntriesCount?: number;
  totalOutreachCount?: number;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onResetData,
  onOpenWhitelistModal,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  totalEntriesCount = 0,
  totalOutreachCount = 0
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const [showConfirmReset, setShowConfirmReset] = useState(false);


  // 5 Menu Utama sesuai alur user
  const navItems = [
    { 
      id: 'dashboard' as ActiveTab, 
      label: 'Dashboard',
      sublabel: 'Statistik & Tabel D.IN.1',
      icon: LayoutDashboard,
      badge: totalEntriesCount > 0 ? String(totalEntriesCount) : undefined
    },
    { 
      id: 'map' as ActiveTab, 
      label: 'Peta Intelijen', 
      sublabel: 'D.IN.2–D.IN.6, CSV & Cetak',
      icon: MapPin 
    },
    { 
      id: 'pora' as ActiveTab, 
      label: 'PORA', 
      sublabel: 'Data Orang Asing & PDF',
      icon: UserCheck,
      live: true
    },
    { 
      id: 'case-stats' as ActiveTab, 
      label: 'Data Grafik (Jampidum)', 
      sublabel: 'Korupsi & Narkotika',
      icon: BarChart3 
    },
    { 
      id: 'tik-cards' as ActiveTab, 
      label: 'KARTU TIK', 
      sublabel: 'D.IN.12–D.IN.16 & CSV',
      icon: CreditCard 
    },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Persistent Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 h-screen flex flex-col justify-between overflow-hidden select-none bg-[#0B1120] border-r border-slate-800/90 text-slate-200 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand & Header */}
        <div className="h-16 px-3 flex items-center justify-between border-b border-slate-800/80 bg-[#0F172A] shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20 shrink-0">
              <Shield className="w-5 h-5 text-slate-950" />
            </div>
            
            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <div className="text-[10px] font-bold tracking-wider text-amber-400 uppercase truncate">
                  KEJAKSAAN RI
                </div>
                <div className="text-xs font-bold text-white truncate">
                  Intelijen Kejari Tabanan
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* 5 Clean Navigation Menus */}
        <div className="flex-1 flex flex-col justify-start gap-2 px-2.5 py-4 overflow-y-auto">
          <div className="px-2 text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
            {!isCollapsed ? 'MENU UTAMA INTELIJEN' : 'MENU'}
          </div>

          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                title={isCollapsed ? `${item.label} — ${item.sublabel}` : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${
                  isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-slate-300 border border-slate-800'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                {!isCollapsed && (
                  <div className="min-w-0 flex-1 text-left">
                    <div className={`text-xs truncate ${isActive ? 'text-slate-950 font-bold' : 'text-slate-100 font-semibold'}`}>
                      {item.label}
                    </div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-slate-900/80 font-medium' : 'text-slate-400 font-normal'}`}>
                      {item.sublabel}
                    </div>
                  </div>
                )}

                {!isCollapsed && item.live && (
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold flex items-center gap-0.5 ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                  }`}>
                    WNA
                  </span>
                )}

                {!isCollapsed && item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none ${
                    isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-amber-400 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Compact Footer (User Info & Reset/Logout) */}
        <div className="p-2.5 border-t border-slate-800/80 bg-[#0F172A]/90 shrink-0">
          {!isCollapsed && currentUser ? (
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0) : 'P'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-200 truncate leading-none">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-amber-400/90 font-mono truncate mt-0.5">
                    {currentUser.role}
                  </div>
                </div>
              </div>

              {onOpenWhitelistModal && (
                <button
                  type="button"
                  onClick={onOpenWhitelistModal}
                  title="Kelola Whitelist SSO"
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition"
                >
                  <Users className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : null}

          <div className={`flex items-center gap-1.5 ${isCollapsed ? 'flex-col justify-center' : 'justify-between'}`}>
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Beralih ke Mode Gelap' : 'Beralih ke Mode Terang'}
              className={`p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer ${
                isCollapsed ? 'w-9 h-9' : 'flex-1 gap-1.5 text-xs font-semibold'
              }`}
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  {!isCollapsed && <span>Mode Terang</span>}
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-amber-400 shrink-0" />
                  {!isCollapsed && <span>Mode Gelap</span>}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              title="Reset Database ke Data Standar"
              className={`p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer ${
                isCollapsed ? 'w-9 h-9' : 'flex-1 gap-1.5 text-xs font-semibold'
              }`}
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Reset</span>}
            </button>

            <button
              type="button"
              onClick={onLogout}
              title="Keluar Akun"
              className={`p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer ${
                isCollapsed ? 'w-9 h-9' : 'flex-1 gap-1.5 text-xs font-semibold'
              }`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Keluar</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Confirmation Modal for Data Reset */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-5 max-w-sm w-full text-slate-100 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm">Kembalikan Data Bawaan?</h3>
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Tindakan ini akan mengatur ulang data Laporan D.IN, kegiatan Penkum, dan statistik perkara ke data bawaan resmi Kejari Tabanan.
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetData();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Ya, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

