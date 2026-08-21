import { useState } from 'react';
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
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Users
} from 'lucide-react';
import { AppUser } from '../types';

export type ActiveTab = 'dashboard' | 'entry-form' | 'outreach-form' | 'case-stats' | 'charts' | 'data-table' | 'official-board';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: AppUser | null;
  onLogout: () => void;
  onResetData: () => void;
  onOpenWhitelistModal?: () => void;
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
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const navGroups = [
    {
      group: 'PETA & LAPORAN YUSTISIAL',
      items: [
        { 
          id: 'dashboard' as ActiveTab, 
          label: 'Ringkasan & Peta', 
          icon: LayoutDashboard,
          badge: totalEntriesCount > 0 ? String(totalEntriesCount) : undefined
        },
        { 
          id: 'entry-form' as ActiveTab, 
          label: 'Form Laporan D.IN (1–6)', 
          icon: FileEdit 
        },
      ]
    },
    {
      group: 'PENERANGAN HUKUM & YUSTISIAL',
      items: [
        { 
          id: 'outreach-form' as ActiveTab, 
          label: 'Penkum & JMS (D.IN.7)', 
          icon: Megaphone,
          badge: totalOutreachCount > 0 ? String(totalOutreachCount) : undefined
        },
        { 
          id: 'case-stats' as ActiveTab, 
          label: 'Statistik Perkara & JAMPIDUM', 
          icon: Scale,
          live: true
        },
      ]
    },
    {
      group: 'ANALISIS & LAPORAN',
      items: [
        { 
          id: 'charts' as ActiveTab, 
          label: 'Grafik & Tren', 
          icon: BarChart3 
        },
        { 
          id: 'data-table' as ActiveTab, 
          label: 'Data Tabel Terpadu', 
          icon: Table2 
        },
        { 
          id: 'official-board' as ActiveTab, 
          label: 'Papan Slide / Cetak', 
          icon: Presentation,
          highlight: true
        },
      ]
    }
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

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0B1120] border-r border-slate-800/80 text-slate-200 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand & Emblem Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-[#0F172A]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 shrink-0">
              <Shield className="w-6 h-6 text-slate-950" />
            </div>
            
            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <div className="text-[10px] font-bold tracking-wider text-amber-400 uppercase truncate">
                  SATYA ADHI WICAKSANA
                </div>
                <div className="text-xs font-bold text-white truncate">
                  Peta Intelijen Kejari Tabanan
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!isCollapsed ? (
                <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {group.group}
                </div>
              ) : (
                <div className="h-px bg-slate-800 my-3 mx-2" />
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-slate-200'}`} />

                    {!isCollapsed && (
                      <span className="truncate flex-1 text-left">
                        {item.label}
                      </span>
                    )}

                    {!isCollapsed && item.live && (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold flex items-center gap-1 ${
                        isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        API
                      </span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {!isCollapsed && item.highlight && !isActive && (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Account / Footer Actions */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0F172A]/80">
          {!isCollapsed && currentUser ? (
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 mb-2">
              <div className="flex items-center gap-2.5">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full border border-amber-500/50 object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-200 truncate flex items-center gap-1.5">
                    <span className="truncate">{currentUser.name}</span>
                    {currentUser.email && (
                      <span className="px-1 py-0.2 rounded bg-blue-500/10 text-blue-400 text-[8px] font-mono border border-blue-500/30 shrink-0">
                        SSO
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-amber-400 font-mono truncate">
                    {currentUser.email || currentUser.role}
                  </div>
                </div>
              </div>

              {/* Admin / Whitelist Manage Button */}
              {onOpenWhitelistModal && (
                <button
                  type="button"
                  onClick={onOpenWhitelistModal}
                  className="mt-2 w-full py-1.5 px-2 bg-slate-800/80 hover:bg-slate-800 text-amber-400 border border-slate-700/80 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Izin Email SSO (Whitelist)</span>
                </button>
              )}
            </div>
          ) : null}

          <div className={`flex items-center gap-1.5 ${isCollapsed ? 'flex-col justify-center' : 'justify-between'}`}>
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              title="Reset Database ke Data Standar"
              className={`p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer ${
                isCollapsed ? 'w-10 h-10' : 'flex-1 gap-2 text-xs font-semibold'
              }`}
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Reset Data</span>}
            </button>

            <button
              type="button"
              onClick={onLogout}
              title="Keluar / Ganti Petugas"
              className={`p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer ${
                isCollapsed ? 'w-10 h-10' : 'flex-1 gap-2 text-xs font-semibold'
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
