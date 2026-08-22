/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { AppUser, IntelligenceEntry, OutreachEntry, CaseStatEntry, SectionId, AnnualTargetEntry } from './types';
import { 
  getIntelligenceEntries, 
  saveIntelligenceEntry, 
  deleteIntelligenceEntry, 
  getOutreachEntries, 
  saveOutreachEntry, 
  deleteOutreachEntry, 
  getCaseStats, 
  saveCaseStat, 
  getAnnualTargets,
  saveAnnualTarget,
  deleteAnnualTarget,
  getAppSession, 
  saveAppSession, 
  resetDatabaseToDefault 
} from './services/storageService';
import { logOutFromFirebase } from './services/firebase';
import LoginGate from './components/LoginGate';
import Sidebar, { ActiveTab } from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardView from './components/DashboardView';
import EntryFormView from './components/EntryFormView';
import OutreachFormView from './components/OutreachFormView';
import CaseStatsEditor from './components/CaseStatsEditor';
import ChartsView from './components/ChartsView';
import DataTableView from './components/DataTableView';
import DetailModal from './components/DetailModal';
import OfficialReportModal from './components/OfficialReportModal';
import WhitelistManagerModal from './components/WhitelistManagerModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedSectionForForm, setSelectedSectionForForm] = useState<SectionId>('D.IN.1');
  
  // Layout state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Data state
  const [entries, setEntries] = useState<IntelligenceEntry[]>([]);
  const [outreachEntries, setOutreachEntries] = useState<OutreachEntry[]>([]);
  const [caseStats, setCaseStats] = useState<CaseStatEntry[]>([]);
  const [annualTargets, setAnnualTargets] = useState<AnnualTargetEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [detailEntry, setDetailEntry] = useState<IntelligenceEntry | null>(null);
  const [showOfficialReport, setShowOfficialReport] = useState<boolean>(false);
  const [showWhitelistModal, setShowWhitelistModal] = useState<boolean>(false);

  // Load all initial data from storageService
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedEntries, fetchedOutreach, fetchedStats, fetchedTargets, sessionUser] = await Promise.all([
        getIntelligenceEntries(),
        getOutreachEntries(),
        getCaseStats(),
        getAnnualTargets(),
        getAppSession(),
      ]);

      setEntries(fetchedEntries);
      setOutreachEntries(fetchedOutreach);
      setCaseStats(fetchedStats);
      setAnnualTargets(fetchedTargets);
      if (sessionUser) {
        setCurrentUser(sessionUser);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Auth handlers
  const handleLogin = async (user: AppUser) => {
    setCurrentUser(user);
    await saveAppSession(user);
  };

  const handleLogout = async () => {
    await logOutFromFirebase();
    setCurrentUser(null);
    await saveAppSession(null);
  };

  // Intelligence entries actions
  const handleSaveEntry = async (entry: IntelligenceEntry) => {
    await saveIntelligenceEntry(entry);
    const updated = await getIntelligenceEntries();
    setEntries(updated);
  };

  const handleDeleteEntry = async (id: string, section: SectionId) => {
    await deleteIntelligenceEntry(id, section);
    const updated = await getIntelligenceEntries();
    setEntries(updated);
  };

  // Outreach entries actions
  const handleSaveOutreach = async (entry: OutreachEntry) => {
    await saveOutreachEntry(entry);
    const updated = await getOutreachEntries();
    setOutreachEntries(updated);
  };

  const handleDeleteOutreach = async (id: string, triwulan: number) => {
    await deleteOutreachEntry(id, triwulan);
    const updated = await getOutreachEntries();
    setOutreachEntries(updated);
  };

  // Case stats actions
  const handleSaveCaseStat = async (stat: CaseStatEntry) => {
    await saveCaseStat(stat);
    const updated = await getCaseStats();
    setCaseStats(updated);
  };

  // Annual Target actions
  const handleSaveAnnualTarget = async (target: AnnualTargetEntry) => {
    await saveAnnualTarget(target);
    const updated = await getAnnualTargets();
    setAnnualTargets(updated);
  };

  const handleDeleteAnnualTarget = async (id: string) => {
    await deleteAnnualTarget(id);
    const updated = await getAnnualTargets();
    setAnnualTargets(updated);
  };

  // Reset database action

  const handleResetData = async () => {
    setLoading(true);
    await resetDatabaseToDefault();
    await loadAllData();
  };

  // Navigation helpers
  const handleNavigateToForm = (sectionId: SectionId = 'D.IN.1') => {
    setSelectedSectionForForm(sectionId);
    setActiveTab('entry-form');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-slate-300 gap-3">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        <div className="text-xs font-mono tracking-wider text-amber-400 uppercase">
          MEMUAT SISTEM PAPAN PETA INTELIJEN...
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginGate onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex selection:bg-amber-500 selection:text-slate-950">
      {/* Persistent Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onResetData={handleResetData}
        onOpenWhitelistModal={() => setShowWhitelistModal(true)}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        totalEntriesCount={entries.length}
        totalOutreachCount={outreachEntries.length}
      />

      {/* Main Content Area (Offset by sidebar width on desktop) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Navbar */}
        <TopNavbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigateToForm={handleNavigateToForm}
          onOpenReportModal={() => setShowOfficialReport(true)}
        />

        {/* Main Content Body */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              entries={entries}
              outreachEntries={outreachEntries}
              caseStats={caseStats}
              onNavigateToForm={handleNavigateToForm}
              onNavigateToTab={setActiveTab}
              onViewEntryDetail={(entry) => setDetailEntry(entry)}
              onSaveCaseStat={handleSaveCaseStat}
            />
          )}

          {activeTab === 'entry-form' && (
            <EntryFormView
              currentSection={selectedSectionForForm}
              onSectionChange={setSelectedSectionForForm}
              entries={entries}
              onSaveEntry={handleSaveEntry}
              onDeleteEntry={handleDeleteEntry}
              currentUser={currentUser}
              onViewDetail={(entry) => setDetailEntry(entry)}
            />
          )}

          {activeTab === 'outreach-form' && (
            <OutreachFormView
              outreachEntries={outreachEntries}
              onSaveOutreach={handleSaveOutreach}
              onDeleteOutreach={handleDeleteOutreach}
              annualTargets={annualTargets}
              onSaveAnnualTarget={handleSaveAnnualTarget}
              onDeleteAnnualTarget={handleDeleteAnnualTarget}
            />
          )}

          {activeTab === 'case-stats' && (
            <CaseStatsEditor
              caseStats={caseStats}
              onSaveCaseStat={handleSaveCaseStat}
            />
          )}

          {activeTab === 'charts' && (
            <ChartsView
              caseStats={caseStats}
              outreachEntries={outreachEntries}
              entries={entries}
              annualTargets={annualTargets}
              onSaveAnnualTarget={handleSaveAnnualTarget}
              onDeleteAnnualTarget={handleDeleteAnnualTarget}
            />
          )}


          {activeTab === 'data-table' && (
            <DataTableView
              entries={entries}
              onViewDetail={(entry) => setDetailEntry(entry)}
              onEditEntry={(entry) => {
                setSelectedSectionForForm(entry.section);
                setActiveTab('entry-form');
              }}
              onDeleteEntry={handleDeleteEntry}
              onOpenReportModal={() => setShowOfficialReport(true)}
            />
          )}

          {activeTab === 'official-board' && (
            <OfficialReportModal
              entries={entries}
              outreachEntries={outreachEntries}
              caseStats={caseStats}
              onClose={() => setActiveTab('dashboard')}
            />
          )}
        </main>

        {/* Bottom Footer */}
        <footer className="py-4 border-t border-slate-800/80 bg-[#0B1120]/60 text-xs text-slate-400 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              © 2026 Kejaksaan Negeri Tabanan — Seksi Intelijen (SATYA ADHI WICAKSANA)
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              SIPPI v2.6 • Formulasi 5W+1H
            </span>
          </div>
        </footer>
      </div>

      {/* Detail 5W+1H Modal */}
      {detailEntry && (
        <DetailModal
          entry={detailEntry}
          onClose={() => setDetailEntry(null)}
        />
      )}

      {/* Official Report Slide / Board Modal */}
      {showOfficialReport && (
        <OfficialReportModal
          entries={entries}
          outreachEntries={outreachEntries}
          caseStats={caseStats}
          onClose={() => setShowOfficialReport(false)}
        />
      )}

      {/* Whitelist Email Manager Modal */}
      {showWhitelistModal && currentUser && (
        <WhitelistManagerModal
          isOpen={showWhitelistModal}
          onClose={() => setShowWhitelistModal(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
