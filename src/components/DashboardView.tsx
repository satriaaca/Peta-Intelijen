import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Users, 
  TrendingUp, 
  HardHat, 
  Cpu, 
  BookOpen, 
  MapPin, 
  Plus, 
  Calendar,
  Eye,
  FileText,
  Search,
  Filter,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Radio,
  School,
  Building,
  Scale,
  Map as MapIcon,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { IntelligenceEntry, OutreachEntry, CaseStatEntry, SectionId, AppUser, OutreachCategory } from '../types';
import { SECTIONS_CONFIG, TABANAN_KECAMATAN } from '../services/seedData';
import { TABANAN_GEO_DATABASE } from '../services/tabananGeo';
import { OFFICIAL_SECTOR_SYMBOLS } from '../services/officialDinData';
import { ActiveTab } from './Sidebar';
import SectorSymbolBadge from './SectorSymbolBadge';

interface DashboardViewProps {
  entries: IntelligenceEntry[];
  outreachEntries: OutreachEntry[];
  caseStats: CaseStatEntry[];
  currentUser?: AppUser | null;
  onSaveEntry?: (entry: IntelligenceEntry) => Promise<void>;
  onDeleteEntry: (id: string, section: SectionId) => Promise<void>;
  onSaveOutreach?: (entry: OutreachEntry) => Promise<void>;
  onNavigateToTab: (tab: ActiveTab) => void;
  onNavigateToForm?: (sectionId?: SectionId) => void;
  onViewEntryDetail: (entry: IntelligenceEntry) => void;
  onSaveCaseStat?: (stat: CaseStatEntry) => Promise<void>;
}

export default function DashboardView({
  entries,
  outreachEntries,
  caseStats: _caseStats,
  currentUser,
  onSaveEntry,
  onDeleteEntry,
  onSaveOutreach,
  onNavigateToTab,
  onNavigateToForm,
  onViewEntryDetail,
  onSaveCaseStat,
}: DashboardViewProps) {
  // Filter state for D.IN.1 Table
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>('ALL');
  const [selectedKecamatanFilter, setSelectedKecamatanFilter] = useState<string>('Semua');
  const [selectedClassificationFilter, setSelectedClassificationFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state for CRUD
  const [showEntryModal, setShowEntryModal] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<IntelligenceEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<IntelligenceEntry | null>(null);

  // Outreach quick add modal
  const [showOutreachModal, setShowOutreachModal] = useState<boolean>(false);

  // Form states for D.IN.1 Entry Modal
  const [formSection, setFormSection] = useState<SectionId>('D.IN.2');
  const [formNo, setFormNo] = useState<string>('');
  const [formSektorSymbol, setFormSektorSymbol] = useState<string>('PEMILU');
  const [formKeterangan, setFormKeterangan] = useState<string>('Partai Politik, Pemilu, Pilkada');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [formLocation, setFormLocation] = useState<string>('');
  const [formKecamatan, setFormKecamatan] = useState<string>('Tabanan');
  const [formLat, setFormLat] = useState<number>(-8.5385);
  const [formLng, setFormLng] = useState<number>(115.1232);
  const [formNarrative, setFormNarrative] = useState<string>('');
  const [formClassification, setFormClassification] = useState<'RAHASIA' | 'TERBATAS' | 'BIASA'>('TERBATAS');
  const [formOfficer, setFormOfficer] = useState<string>(currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'I Putu Arya, S.H.');
  const [formStatus, setFormStatus] = useState<'SELESAI' | 'DALAM_PEMANTAUAN' | 'TINDAK_LANJUT'>('DALAM_PEMANTAUAN');
  const [formPhotoUrl, setFormPhotoUrl] = useState<string>('');
  const [formPhotoCaption, setFormPhotoCaption] = useState<string>('');

  // Form states for Outreach Modal
  const [outreachJenis, setOutreachJenis] = useState<OutreachCategory>('Jaksa Masuk Sekolah (JMS)');
  const [outreachTema, setOutreachTema] = useState<string>('');
  const [outreachWaktu, setOutreachWaktu] = useState<string>(new Date().toISOString().slice(0, 10));
  const [outreachTempat, setOutreachTempat] = useState<string>('');
  const [outreachKecamatan, setOutreachKecamatan] = useState<string>('Tabanan');
  const [outreachPeserta, setOutreachPeserta] = useState<number>(100);
  const [outreachTarget, setOutreachTarget] = useState<number>(100);
  const [outreachNarasumber, setOutreachNarasumber] = useState<string>(currentUser?.name || 'Tim Penerangan Hukum');
  const [outreachMateri, setOutreachMateri] = useState<string>('Pencegahan Narkotika & Kenakalan Remaja');

  // =========================================================================
  // 1. STATISTIK: PENERANGAN DAN PENYULUHAN HUKUM (PENKUM & LUHKUM)
  // =========================================================================
  const totalOutreachKegiatan = outreachEntries.length;
  const totalPesertaRealisasi = outreachEntries.reduce((sum, item) => sum + (item.jumlah_peserta || 0), 0);
  const totalTargetPeserta = outreachEntries.reduce((sum, item) => sum + (item.target_peserta || 100), 0);
  const outreachPercentage = totalTargetPeserta > 0 ? Math.min(100, Math.round((totalPesertaRealisasi / totalTargetPeserta) * 100)) : 100;

  const countJMS = outreachEntries.filter(i => i.jenis_kegiatan.includes('JMS') || i.jenis_kegiatan.includes('Sekolah')).length;
  const countJaksaMenyapa = outreachEntries.filter(i => i.jenis_kegiatan === 'Jaksa Menyapa').length;
  const countPakem = outreachEntries.filter(i => i.jenis_kegiatan === 'Pakem').length;
  const countAntiKorupsi = outreachEntries.filter(i => i.jenis_kegiatan === 'Kampanye Anti Korupsi').length;
  const countPenyuluhan = outreachEntries.filter(i => i.jenis_kegiatan === 'Penyuluhan Hukum').length;
  const countPenerangan = outreachEntries.filter(i => i.jenis_kegiatan === 'Penerangan Hukum').length;

  // =========================================================================
  // 2. STATISTIK: JUMLAH D.IN.2 SAMPAI D.IN.6
  // =========================================================================
  const countDIN2 = entries.filter(e => e.section === 'D.IN.2').length;
  const countDIN3 = entries.filter(e => e.section === 'D.IN.3').length;
  const countDIN4 = entries.filter(e => e.section === 'D.IN.4').length;
  const countDIN5 = entries.filter(e => e.section === 'D.IN.5').length;
  const countDIN6 = entries.filter(e => e.section === 'D.IN.6').length;
  const totalDIN2to6 = countDIN2 + countDIN3 + countDIN4 + countDIN5 + countDIN6;

  const sectorCards = [
    {
      id: 'D.IN.2',
      code: 'D.IN.2',
      title: 'Ipolhankam & Cekal',
      desc: 'Ideologi, Politik, Ormas & Cegah Tangkal',
      count: countDIN2,
      color: 'emerald',
      bgClass: 'from-emerald-950/40 to-slate-900/80 border-emerald-500/30 hover:border-emerald-500/60',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      icon: ShieldAlert,
    },
    {
      id: 'D.IN.3',
      code: 'D.IN.3',
      title: 'Sosbudkem & Pakem',
      desc: 'Barang Cetakan, Media Komunikasi & PAKEM',
      count: countDIN3,
      color: 'sky',
      bgClass: 'from-sky-950/40 to-slate-900/80 border-sky-500/30 hover:border-sky-500/60',
      badgeClass: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
      icon: Users,
    },
    {
      id: 'D.IN.4',
      code: 'D.IN.4',
      title: 'Ekokeu & Mafia Tanah',
      desc: 'Keuangan, Investasi, Pangan & Aset',
      count: countDIN4,
      color: 'amber',
      bgClass: 'from-amber-950/40 to-slate-900/80 border-amber-500/30 hover:border-amber-500/60',
      badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      icon: TrendingUp,
    },
    {
      id: 'D.IN.5',
      code: 'D.IN.5',
      title: 'PPS / Proyek Strategis',
      desc: 'Infrastruktur, DTW Wisata, SPAM & Bendungan',
      count: countDIN5,
      color: 'indigo',
      bgClass: 'from-indigo-950/40 to-slate-900/80 border-indigo-500/30 hover:border-indigo-500/60',
      badgeClass: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
      icon: HardHat,
    },
    {
      id: 'D.IN.6',
      code: 'D.IN.6',
      title: 'TI & Produksi Intelijen',
      desc: 'Patroli Siber, Lapinhar/LII, Sandi & Forensik',
      count: countDIN6,
      color: 'violet',
      bgClass: 'from-violet-950/40 to-slate-900/80 border-violet-500/30 hover:border-violet-500/60',
      badgeClass: 'bg-violet-500/20 text-violet-400 border-violet-500/40',
      icon: Cpu,
    },
  ];

  // =========================================================================
  // 3. TABEL D.IN.1 (FILTERING & SEARCHING)
  // =========================================================================
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Sektor filter
      if (selectedSectionFilter !== 'ALL' && entry.section !== selectedSectionFilter) {
        return false;
      }
      // Kecamatan filter
      if (selectedKecamatanFilter !== 'Semua' && entry.kecamatan !== selectedKecamatanFilter) {
        return false;
      }
      // Klasifikasi filter
      if (selectedClassificationFilter !== 'ALL' && entry.classification !== selectedClassificationFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchNo = entry.no.toLowerCase().includes(q);
        const matchKet = entry.keterangan.toLowerCase().includes(q);
        const matchNar = entry.narrative.toLowerCase().includes(q);
        const matchLoc = entry.location.toLowerCase().includes(q);
        const matchKec = entry.kecamatan.toLowerCase().includes(q);
        const matchOff = (entry.officerName || '').toLowerCase().includes(q);
        if (!matchNo && !matchKet && !matchNar && !matchLoc && !matchKec && !matchOff) {
          return false;
        }
      }
      return true;
    });
  }, [entries, selectedSectionFilter, selectedKecamatanFilter, selectedClassificationFilter, searchQuery]);

  // Helper when user selects a Tabanan location in Form to auto-set Lat/Lng & Kecamatan
  const handleLocationChange = (locationName: string) => {
    setFormLocation(locationName);
    const matchedPoint = TABANAN_GEO_DATABASE.find(
      (p) => p.name.toLowerCase() === locationName.toLowerCase()
    );
    if (matchedPoint) {
      setFormLat(matchedPoint.lat);
      setFormLng(matchedPoint.lng);
      setFormKecamatan(matchedPoint.kecamatan);
    }
  };

  const handleKecamatanChange = (kec: string) => {
    setFormKecamatan(kec);
    const matchedPoint = TABANAN_GEO_DATABASE.find(
      (p) => p.kecamatan.toLowerCase() === kec.toLowerCase()
    );
    if (matchedPoint) {
      setFormLat(matchedPoint.lat);
      setFormLng(matchedPoint.lng);
    }
  };

  // Open Create Form
  const handleOpenCreateEntry = () => {
    setEditingEntry(null);
    const nextReg = `REG-${String(entries.length + 1).padStart(2, '0')}/${formSection}/TAB/2026`;
    setFormNo(nextReg);
    setFormSection('D.IN.2');
    setFormSektorSymbol('PEMILU');
    setFormKeterangan('Partai Politik, Pemilu, Pilkada');
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormLocation('Dajan Peken, Tabanan');
    setFormKecamatan('Tabanan');
    setFormLat(-8.5368);
    setFormLng(115.1228);
    setFormNarrative('Bahwa pada hari ..., tanggal ..., Tim Intelijen Kejaksaan Negeri Tabanan telah melaksanakan pemantauan dan pengumpulan bahan keterangan terkait ...');
    setFormClassification('TERBATAS');
    setFormOfficer(currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'I Putu Arya, S.H.');
    setFormStatus('DALAM_PEMANTAUAN');
    setFormPhotoUrl('');
    setFormPhotoCaption('');
    setShowEntryModal(true);
  };

  // Open Edit Form
  const handleOpenEditEntry = (entry: IntelligenceEntry) => {
    setEditingEntry(entry);
    setFormNo(entry.no);
    setFormSection(entry.section);
    setFormSektorSymbol(entry.sektor_symbol || 'PEMILU');
    setFormKeterangan(entry.keterangan);
    setFormDate(entry.date);
    setFormLocation(entry.location);
    setFormKecamatan(entry.kecamatan);
    setFormLat(entry.latitude || -8.5385);
    setFormLng(entry.longitude || 115.1232);
    setFormNarrative(entry.narrative);
    setFormClassification(entry.classification || 'TERBATAS');
    setFormOfficer(entry.officerName || 'I Putu Arya, S.H.');
    setFormStatus(entry.status || 'DALAM_PEMANTAUAN');
    setFormPhotoUrl(entry.photoUrl || '');
    setFormPhotoCaption(entry.photoCaption || '');
    setShowEntryModal(true);
  };

  // Save Entry Form
  const handleSubmitEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNarrative.trim() || !formLocation.trim()) return;

    const entryData: IntelligenceEntry = {
      id: editingEntry ? editingEntry.id : `din-${Date.now()}`,
      no: formNo || `REG-01/${formSection}/TAB/2026`,
      section: formSection,
      sektor_symbol: formSektorSymbol,
      keterangan: formKeterangan,
      narrative: formNarrative,
      date: formDate,
      reportDate: formDate,
      location: formLocation,
      kecamatan: formKecamatan,
      latitude: formLat,
      longitude: formLng,
      classification: formClassification,
      officerName: formOfficer,
      status: formStatus,
      photoUrl: formPhotoUrl.trim() || undefined,
      photoCaption: formPhotoCaption.trim() || undefined,
      createdAt: editingEntry ? editingEntry.createdAt : Date.now(),
      updatedAt: Date.now(),
    };

    await onSaveEntry(entryData);
    setShowEntryModal(false);
  };

  // Delete Entry Action
  const handleConfirmDeleteEntry = async () => {
    if (!entryToDelete) return;
    await onDeleteEntry(entryToDelete.id, entryToDelete.section);
    setEntryToDelete(null);
  };

  // Save Outreach Action
  const handleSaveOutreachActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outreachTema || !onSaveOutreach) return;

    const newOutreach: OutreachEntry = {
      id: `outreach-${Date.now()}`,
      no: `PENKUM/${String(outreachEntries.length + 1).padStart(2, '0')}/TRI-${Math.ceil((new Date(outreachWaktu).getMonth() + 1) / 3)}/2026`,
      triwulan: Math.ceil((new Date(outreachWaktu).getMonth() + 1) / 3) as 1 | 2 | 3 | 4,
      jenis_kegiatan: outreachJenis,
      tema_kegiatan: outreachTema,
      waktu: outreachWaktu,
      tempat: outreachTempat || 'Kabupaten Tabanan',
      kecamatan: outreachKecamatan,
      jumlah_peserta: Number(outreachPeserta) || 0,
      target_peserta: Number(outreachTarget) || 100,
      narasumber: outreachNarasumber,
      materi_pokok: outreachMateri,
      status: 'TERLAKSANA',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await onSaveOutreach(newOutreach);
    setShowOutreachModal(false);
    setOutreachTema('');
    setOutreachTempat('');
  };

  return (
    <div className="space-y-6 pb-8">
      {/* ========================================================================= */}
      {/* 1. SECTION STATISTIK: PENERANGAN DAN PENYULUHAN HUKUM                     */}
      {/* ========================================================================= */}
      <div className="bg-[#0B1120] border border-slate-800/90 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  1. Kegiatan Penerangan & Penyuluhan Hukum
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  D.IN.7 s/d D.IN.9
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Realisasi Binmatkum, Jaksa Masuk Sekolah (JMS), Jaksa Menyapa & Edukasi Hukum Kejari Tabanan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowOutreachModal(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/20 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kegiatan</span>
            </button>
          </div>
        </div>

        {/* Outreach Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* Main Card: Total Kegiatan & Peserta */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Kegiatan Dilaksanakan</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-500/20 text-teal-300">
                2026 Aktif
              </span>
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-white font-mono tracking-tight">
                {totalOutreachKegiatan} <span className="text-sm font-sans font-normal text-slate-400">Kegiatan</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                <span>Total <strong>{totalPesertaRealisasi.toLocaleString('id-ID')}</strong> peserta terjangkau</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="space-y-1 pt-1 border-t border-slate-800/80">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Capaian Peserta ({outreachPercentage}%)</span>
                <span className="font-mono">{totalPesertaRealisasi} / {totalTargetPeserta}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-500 transition-all duration-500 rounded-full" 
                  style={{ width: `${outreachPercentage}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Breakdown Mini Cards */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                <School className="w-3.5 h-3.5 text-teal-400" />
                <span>JMS (Sekolah)</span>
              </div>
              <div className="text-xl font-bold font-mono text-white my-1">{countJMS} <span className="text-xs font-normal text-slate-400">Giat</span></div>
              <span className="text-[10px] text-slate-400">Pelajar Tabanan</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>Jaksa Menyapa</span>
              </div>
              <div className="text-xl font-bold font-mono text-white my-1">{countJaksaMenyapa} <span className="text-xs font-normal text-slate-400">Giat</span></div>
              <span className="text-[10px] text-slate-400">Dialog Radio & Media</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>Pakem (Aliran)</span>
              </div>
              <div className="text-xl font-bold font-mono text-white my-1">{countPakem} <span className="text-xs font-normal text-slate-400">Giat</span></div>
              <span className="text-[10px] text-slate-400">Rakor Kerukunan</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                <Scale className="w-3.5 h-3.5 text-rose-400" />
                <span>Anti Korupsi</span>
              </div>
              <div className="text-xl font-bold font-mono text-white my-1">{countAntiKorupsi} <span className="text-xs font-normal text-slate-400">Giat</span></div>
              <span className="text-[10px] text-slate-400">Sosialisasi APBD/Dana Desa</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Penyuluhan</span>
              </div>
              <div className="text-xl font-bold font-mono text-white my-1">{countPenyuluhan} <span className="text-xs font-normal text-slate-400">Giat</span></div>
              <span className="text-[10px] text-slate-400">Desa & Masyarakat</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                <Building className="w-3.5 h-3.5 text-indigo-400" />
                <span>Penerangan</span>
              </div>
              <div className="text-xl font-bold font-mono text-white my-1">{countPenerangan} <span className="text-xs font-normal text-slate-400">Giat</span></div>
              <span className="text-[10px] text-slate-400">Instansi & ASN Pemkab</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SECTION STATISTIK: JUMLAH D.IN.2 SAMPAI D.IN.6                          */}
      {/* ========================================================================= */}
      <div className="bg-[#0B1120] border border-slate-800/90 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                2. Jumlah Laporan Sektor Intelijen (D.IN.2 s/d D.IN.6)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Total: {totalDIN2to6} Laporan
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Klik salah satu kartu di bawah ini untuk memfilter tabel D.IN.1 secara instan
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateToTab('map')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
            >
              <MapIcon className="w-4 h-4 text-amber-400" />
              <span>Buka Peta Spasial</span>
            </button>
          </div>
        </div>

        {/* 5 Sector Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4">
          {sectorCards.map((card) => {
            const Icon = card.icon;
            const isSelected = selectedSectionFilter === card.id;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelectedSectionFilter(isSelected ? 'ALL' : card.id)}
                className={`bg-gradient-to-b ${card.bgClass} p-4 rounded-xl border text-left cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between h-36 ${
                  isSelected ? 'ring-2 ring-amber-400 shadow-lg shadow-amber-500/10' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border ${card.badgeClass}`}>
                    {card.code}
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-900/60 text-slate-300 border border-slate-800">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="my-1">
                  <div className="text-2xl font-black font-mono text-white">
                    {card.count}
                  </div>
                  <div className="text-xs font-bold text-slate-200 truncate mt-0.5">
                    {card.title}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 truncate">
                  {card.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION TABEL D.IN.1 (PAPAN PETA / SITUASI INTELIJEN TERPADU DENGAN CRUD) */}
      {/* ========================================================================= */}
      <div className="bg-[#0B1120] border border-slate-800/90 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white">
                3. Tabel Situasi Intelijen Terpadu (D.IN.1)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {filteredEntries.length} Data
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Daftar register laporan intelijen yustisial D.IN.1 lengkap dengan formulasi 5W+1H dan fitur CRUD (Tambah, Edit, Hapus, Detail)
            </p>
          </div>

          {/* Action: Add New Entry */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenCreateEntry}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Laporan D.IN.1</span>
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 pb-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari register, narasi 5W+1H, petugas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/80"
            />
          </div>

          {/* Filter Sektor */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5">
            <Filter className="w-4 h-4 text-amber-400 shrink-0" />
            <select
              value={selectedSectionFilter}
              onChange={(e) => setSelectedSectionFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 w-full focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">Semua Sektor (D.IN.2 - D.IN.6)</option>
              <option value="D.IN.2" className="bg-slate-900">D.IN.2 — Ipolhankam & Cekal</option>
              <option value="D.IN.3" className="bg-slate-900">D.IN.3 — Sosbudkem & Pakem</option>
              <option value="D.IN.4" className="bg-slate-900">D.IN.4 — Ekokeu & Mafia Tanah</option>
              <option value="D.IN.5" className="bg-slate-900">D.IN.5 — PPS / Pembangunan Strategis</option>
              <option value="D.IN.6" className="bg-slate-900">D.IN.6 — TI & Produksi Intelijen</option>
            </select>
          </div>

          {/* Filter Kecamatan */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5">
            <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
            <select
              value={selectedKecamatanFilter}
              onChange={(e) => setSelectedKecamatanFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 w-full focus:outline-none cursor-pointer"
            >
              <option value="Semua" className="bg-slate-900">Semua 10 Kecamatan</option>
              {TABANAN_KECAMATAN.map((kec) => (
                <option key={kec} value={kec} className="bg-slate-900">Kec. {kec}</option>
              ))}
            </select>
          </div>

          {/* Filter Klasifikasi */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <select
              value={selectedClassificationFilter}
              onChange={(e) => setSelectedClassificationFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 w-full focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">Semua Klasifikasi</option>
              <option value="RAHASIA" className="bg-slate-900">RAHASIA</option>
              <option value="TERBATAS" className="bg-slate-900">TERBATAS</option>
              <option value="BIASA" className="bg-slate-900">BIASA</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0F172A] text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-3.5 py-3 w-12 text-center">No</th>
                <th className="px-3 py-3 w-36">Register & Tgl</th>
                <th className="px-3 py-3 w-40">Sektor & Simbol</th>
                <th className="px-3 py-3 w-44">Keterangan / Masalah</th>
                <th className="px-4 py-3 min-w-[280px]">Narasi 5W+1H Peristiwa</th>
                <th className="px-3 py-3 w-36">Lokasi & Kec</th>
                <th className="px-3 py-3 w-24 text-center">Klasifikasi</th>
                <th className="px-3 py-3 w-32">Petugas</th>
                <th className="px-3 py-3 w-28 text-center">Aksi (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-500">
                    <AlertTriangle className="w-8 h-8 text-amber-500/40 mx-auto mb-2" />
                    <p className="font-semibold text-xs text-slate-400">Tidak ada data laporan intelijen yang sesuai filter.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSectionFilter('ALL');
                        setSelectedKecamatanFilter('Semua');
                        setSelectedClassificationFilter('ALL');
                        setSearchQuery('');
                      }}
                      className="mt-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs"
                    >
                      Reset Filter
                    </button>
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry, index) => {
                  return (
                    <tr 
                      key={entry.id}
                      className="hover:bg-slate-900/60 transition-colors"
                    >
                      {/* No Urut */}
                      <td className="px-3.5 py-3 text-center font-mono text-slate-500">
                        {index + 1}
                      </td>

                      {/* Register & Tanggal */}
                      <td className="px-3 py-3">
                        <div className="font-mono font-bold text-slate-200 text-[11px] truncate">
                          {entry.no}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{entry.date}</span>
                        </div>
                      </td>

                      {/* Sektor & Simbol Badge */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <SectorSymbolBadge
                            symbolCodeOrName={entry.sektor_symbol || entry.section}
                            keterangan={entry.keterangan}
                            size="sm"
                          />
                          <span className="font-mono font-bold text-[11px] text-amber-400">
                            {entry.section}
                          </span>
                        </div>
                      </td>

                      {/* Keterangan */}
                      <td className="px-3 py-3 font-medium text-slate-200 text-xs">
                        {entry.keterangan}
                      </td>

                      {/* Narasi 5W+1H */}
                      <td className="px-4 py-3 text-xs text-slate-300 leading-relaxed">
                        <p className="line-clamp-2">
                          {entry.narrative}
                        </p>
                      </td>

                      {/* Lokasi & Kecamatan */}
                      <td className="px-3 py-3 text-xs">
                        <div className="font-semibold text-slate-200 truncate">
                          {entry.location}
                        </div>
                        <div className="text-[10px] text-sky-400 mt-0.5">
                          Kec. {entry.kecamatan}
                        </div>
                        {entry.latitude && entry.longitude && (
                          <span className="text-[9px] font-mono text-slate-400">
                            {entry.latitude.toFixed(4)}, {entry.longitude.toFixed(4)}
                          </span>
                        )}
                      </td>

                      {/* Klasifikasi */}
                      <td className="px-3 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          entry.classification === 'RAHASIA'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : entry.classification === 'TERBATAS'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-700/60 text-slate-300 border border-slate-600'
                        }`}>
                          {entry.classification || 'TERBATAS'}
                        </span>
                      </td>

                      {/* Petugas */}
                      <td className="px-3 py-3 text-[11px] text-slate-300 truncate">
                        {entry.officerName || 'Petugas Intelijen'}
                      </td>

                      {/* Aksi CRUD */}
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Read / Detail */}
                          <button
                            type="button"
                            onClick={() => onViewEntryDetail(entry)}
                            title="Lihat Detail 5W+1H"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Update / Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditEntry(entry)}
                            title="Edit Laporan"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setEntryToDelete(entry)}
                            title="Hapus Laporan"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/80 text-rose-400 hover:text-rose-300 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH / EDIT LAPORAN D.IN.1 (CRUD FORM)                           */}
      {/* ========================================================================= */}
      {showEntryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-3xl p-6 shadow-2xl text-slate-100 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {editingEntry ? 'Edit Laporan Situasi Intelijen (D.IN.1)' : 'Tambah Laporan Baru (D.IN.1 / Sektor D.IN.2–6)'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Formulir Standar Keputusan Jaksa Agung RI Nomor KEP-135/A/JA/05/2019
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEntryModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEntry} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Section Sektor */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sektor Intelijen <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formSection}
                    onChange={(e) => {
                      const sId = e.target.value as SectionId;
                      setFormSection(sId);
                      const secMeta = SECTIONS_CONFIG.find(s => s.id === sId);
                      if (secMeta && secMeta.defaultKeterangan.length > 0) {
                        setFormKeterangan(secMeta.defaultKeterangan[0]);
                      }
                    }}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    required
                  >
                    <option value="D.IN.2">D.IN.2 — Ipolhankam & Cekal</option>
                    <option value="D.IN.3">D.IN.3 — Sosbudkem & Pakem</option>
                    <option value="D.IN.4">D.IN.4 — Ekokeu & Mafia Tanah</option>
                    <option value="D.IN.5">D.IN.5 — PPS / Proyek Strategis</option>
                    <option value="D.IN.6">D.IN.6 — TI & Produksi Intelijen</option>
                  </select>
                </div>

                {/* Subsektor Symbol */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kode Simbol Resmi <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formSektorSymbol}
                    onChange={(e) => setFormSektorSymbol(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  >
                    {(OFFICIAL_SECTOR_SYMBOLS[formSection] || []).map(sym => (
                      <option key={sym.id} value={sym.badgeCode}>
                        #{sym.no} — {sym.name} ({sym.badgeCode})
                      </option>
                    ))}
                    {/* Fallback default */}
                    <option value="UMUM">UMUM — Situasi Umum</option>
                  </select>
                </div>

                {/* Nomor Register */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nomor Register Laporan <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formNo}
                    onChange={(e) => setFormNo(e.target.value)}
                    placeholder="REG-01/D.IN.2/TAB/2026"
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Keterangan / Masalah */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kategori Masalah / Peristiwa <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formKeterangan}
                    onChange={(e) => setFormKeterangan(e.target.value)}
                    placeholder="Contoh: Partai Politik, Pengawasan Pangan, Mafia Tanah"
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                {/* Tanggal */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tanggal Peristiwa <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Lokasi & Auto-Geocoding Tabanan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pilih Lokasi / Desa di Tabanan (Auto-Koordinat)
                  </label>
                  <select
                    value={formLocation}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- Pilih atau ketik manual --</option>
                    {TABANAN_GEO_DATABASE.slice(0, 40).map((pt) => (
                      <option key={pt.name} value={`${pt.name}, ${pt.kecamatan}`}>
                        {pt.name} (Kec. {pt.kecamatan})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kecamatan Tabanan <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formKecamatan}
                    onChange={(e) => handleKecamatanChange(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    required
                  >
                    {TABANAN_KECAMATAN.map((kec) => (
                      <option key={kec} value={kec}>Kec. {kec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Koordinat Geospasial (Lat, Lng)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.0001"
                      value={formLat}
                      onChange={(e) => setFormLat(parseFloat(e.target.value))}
                      placeholder="Lat"
                      className="w-1/2 bg-[#0F172A] border border-slate-700 rounded-xl px-2 py-2 text-[11px] font-mono text-slate-100"
                    />
                    <input
                      type="number"
                      step="0.0001"
                      value={formLng}
                      onChange={(e) => setFormLng(parseFloat(e.target.value))}
                      placeholder="Lng"
                      className="w-1/2 bg-[#0F172A] border border-slate-700 rounded-xl px-2 py-2 text-[11px] font-mono text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Narasi 5W+1H */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Uraian Peristiwa Intelijen 5W+1H <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formNarrative}
                  onChange={(e) => setFormNarrative(e.target.value)}
                  placeholder="Bahwa pada hari ..., tanggal ..., Tim Intelijen Kejari Tabanan telah melaksanakan..."
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-3 text-xs text-slate-100 leading-relaxed focus:outline-none focus:border-amber-500 font-sans"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Klasifikasi */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Klasifikasi Keamanan
                  </label>
                  <select
                    value={formClassification}
                    onChange={(e) => setFormClassification(e.target.value as any)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="TERBATAS">TERBATAS</option>
                    <option value="RAHASIA">RAHASIA</option>
                    <option value="BIASA">BIASA</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Status Pemantauan
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="DALAM_PEMANTAUAN">DALAM PEMANTAUAN</option>
                    <option value="SELESAI">SELESAI</option>
                    <option value="TINDAK_LANJUT">TINDAK LANJUT</option>
                  </select>
                </div>

                {/* Petugas */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Petugas Intelijen
                  </label>
                  <input
                    type="text"
                    value={formOfficer}
                    onChange={(e) => setFormOfficer(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Foto Dokumentasi */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  URL Foto Dokumentasi Lapangan (Opsional)
                </label>
                <input
                  type="text"
                  value={formPhotoUrl}
                  onChange={(e) => setFormPhotoUrl(e.target.value)}
                  placeholder="https://... atau URL Google Drive"
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEntryModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  {editingEntry ? 'Perbarui Laporan D.IN.1' : 'Simpan Laporan D.IN.1'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: KONFIRMASI HAPUS ENTRY                                             */}
      {/* ========================================================================= */}
      {entryToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-5 max-w-md w-full text-slate-100 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm">Konfirmasi Hapus Laporan</h3>
            </div>
            <p className="text-xs text-slate-300 mb-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus laporan register <strong className="text-white">{entryToDelete.no}</strong> ({entryToDelete.keterangan})?
            </p>
            <p className="text-[11px] text-slate-400 mb-4 italic">
              Tindakan ini tidak dapat dibatalkan. Data akan dihapus permanen dari sistem registrasi.
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setEntryToDelete(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteEntry}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/20 cursor-pointer"
              >
                Ya, Hapus Laporan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH KEGIATAN PENKUM / LUHKUM                                    */}
      {/* ========================================================================= */}
      {showOutreachModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl text-slate-100 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Tambah Kegiatan Penerangan / Penyuluhan Hukum
                  </h3>
                  <p className="text-xs text-slate-400">
                    Formulir Registrasi Kegiatan D.IN.7 s/d D.IN.9 Kejari Tabanan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOutreachModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOutreachActivity} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Jenis Kegiatan <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={outreachJenis}
                    onChange={(e) => setOutreachJenis(e.target.value as any)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                    required
                  >
                    <option value="Jaksa Masuk Sekolah (JMS)">Jaksa Masuk Sekolah (JMS)</option>
                    <option value="Jaksa Menyapa">Jaksa Menyapa (Radio/Media)</option>
                    <option value="Penyuluhan Hukum">Penyuluhan Hukum (Dana Desa)</option>
                    <option value="Penerangan Hukum">Penerangan Hukum (Instansi)</option>
                    <option value="Pakem">Pakem (Pengawasan Aliran)</option>
                    <option value="Kampanye Anti Korupsi">Kampanye Anti Korupsi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tanggal Pelaksanaan <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={outreachWaktu}
                    onChange={(e) => setOutreachWaktu(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tema Kegiatan <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={outreachTema}
                  onChange={(e) => setOutreachTema(e.target.value)}
                  placeholder="Contoh: Kenali Hukum Jauhi Hukuman: Bahaya Judi Online dan Narkotika"
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tempat / Lokasi <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={outreachTempat}
                    onChange={(e) => setOutreachTempat(e.target.value)}
                    placeholder="Contoh: Aula SMAN 1 Tabanan"
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kecamatan <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={outreachKecamatan}
                    onChange={(e) => setOutreachKecamatan(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  >
                    {TABANAN_KECAMATAN.map((kec) => (
                      <option key={kec} value={kec}>Kec. {kec}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Jumlah Peserta Hadir (Realisasi)
                  </label>
                  <input
                    type="number"
                    value={outreachPeserta}
                    onChange={(e) => setOutreachPeserta(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Peserta
                  </label>
                  <input
                    type="number"
                    value={outreachTarget}
                    onChange={(e) => setOutreachTarget(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowOutreachModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg"
                >
                  Simpan Kegiatan Penkum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
