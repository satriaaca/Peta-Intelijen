import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { 
  FileText, 
  Plus, 
  Save, 
  RotateCcw, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Upload, 
  X, 
  Info,
  Shield,
  Eye
} from 'lucide-react';
import { IntelligenceEntry, SectionId, AppUser } from '../types';
import { SECTIONS_CONFIG, TABANAN_KECAMATAN } from '../services/seedData';

interface EntryFormViewProps {
  currentSection: SectionId;
  onSectionChange: (sectionId: SectionId) => void;
  entries: IntelligenceEntry[];
  onSaveEntry: (entry: IntelligenceEntry) => Promise<void>;
  onDeleteEntry: (id: string, section: SectionId) => Promise<void>;
  currentUser: AppUser | null;
  onViewDetail: (entry: IntelligenceEntry) => void;
}

export default function EntryFormView({
  currentSection,
  onSectionChange,
  entries,
  onSaveEntry,
  onDeleteEntry,
  currentUser,
  onViewDetail,
}: EntryFormViewProps) {
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [no, setNo] = useState('');
  const [sektorSymbol, setSektorSymbol] = useState('PO');
  const [keterangan, setKeterangan] = useState('Politik');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [kecamatan, setKecamatan] = useState('Tabanan');
  const [narrative, setNarrative] = useState('');
  const [classification, setClassification] = useState<'RAHASIA' | 'TERBATAS' | 'BIASA'>('TERBATAS');
  const [sourceConfidence, setSourceConfidence] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1'>('A1');
  const [officerName, setOfficerName] = useState(currentUser ? currentUser.name : 'I Putu Arya, S.H.');
  const [status, setStatus] = useState<'SELESAI' | 'DALAM_PEMANTAUAN' | 'TINDAK_LANJUT'>('SELESAI');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoCaption, setPhotoCaption] = useState<string>('');

  // 5W+1H Guided Builder modal/toggle
  const [showHelper5W1H, setShowHelper5W1H] = useState(false);
  const [helperWho, setHelperWho] = useState('');
  const [helperWhat, setHelperWhat] = useState('');
  const [helperWhere, setHelperWhere] = useState('');
  const [helperWhen, setHelperWhen] = useState('');
  const [helperWhy, setHelperWhy] = useState('');
  const [helperHow, setHelperHow] = useState('');

  // UI state
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentSectionMeta = SECTIONS_CONFIG.find((s) => s.id === currentSection) || SECTIONS_CONFIG[0];
  const sectionEntries = entries.filter((e) => e.section === currentSection);

  // Auto generate register number
  useEffect(() => {
    if (!editingId) {
      const year = new Date().getFullYear();
      const nextSeq = String(sectionEntries.length + 1).padStart(2, '0');
      setNo(`REG-${nextSeq}/${currentSection}/TAB/${year}`);
      if (currentSectionMeta.defaultKeterangan.length > 0) {
        setKeterangan(currentSectionMeta.defaultKeterangan[0]);
      }
    }
  }, [currentSection, sectionEntries.length, editingId]);

  // Load entry into form for editing
  const handleStartEdit = (entry: IntelligenceEntry) => {
    setEditingId(entry.id);
    setNo(entry.no);
    setSektorSymbol(entry.sektor_symbol);
    setKeterangan(entry.keterangan);
    setDate(entry.date);
    setReportDate(entry.reportDate || entry.date);
    setLocation(entry.location);
    setKecamatan(entry.kecamatan);
    setNarrative(entry.narrative);
    setClassification(entry.classification || 'TERBATAS');
    setSourceConfidence(entry.sourceConfidence || 'A1');
    setOfficerName(entry.officerName || (currentUser ? currentUser.name : ''));
    setStatus(entry.status || 'SELESAI');
    setPhotoUrl(entry.photoUrl || '');
    setPhotoCaption(entry.photoCaption || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setEditingId(null);
    const year = new Date().getFullYear();
    const nextSeq = String(sectionEntries.length + 1).padStart(2, '0');
    setNo(`REG-${nextSeq}/${currentSection}/TAB/${year}`);
    setSektorSymbol(currentSectionMeta.id === 'D.IN.1' ? 'PO' : 'AG');
    setKeterangan(currentSectionMeta.defaultKeterangan[0] || 'Umum');
    setDate(new Date().toISOString().split('T')[0]);
    setReportDate(new Date().toISOString().split('T')[0]);
    setLocation('');
    setKecamatan('Tabanan');
    setNarrative('');
    setClassification('TERBATAS');
    setSourceConfidence('A1');
    setOfficerName(currentUser ? currentUser.name : 'I Putu Arya, S.H.');
    setStatus('SELESAI');
    setPhotoUrl('');
    setPhotoCaption('');
  };

  const handleInsertTemplate = () => {
    const today = new Date(date);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const dayName = days[today.getDay()];
    const dateFormatted = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    const templateText = `Bahwa pada hari ${dayName}, tanggal ${dateFormatted} sekitar pukul 09.30 WITA, Tim Intelijen Kejaksaan Negeri Tabanan telah melaksanakan pemantauan dan pengumpulan bahan keterangan terkait [peristiwa/kegiatan] yang bertempat di ${location || '[lokasi kejadian]'}, Kecamatan ${kecamatan}, Kabupaten Tabanan. Dari hasil monitoring lapangan, diperoleh informasi bahwa [uraian kronologis 5W+1H]. Situasi keamanan terpantau kondusif dan tetap dalam pengawasan intelijen yustisial.`;
    setNarrative(templateText);
  };

  const handleApplyHelper5W1H = () => {
    const today = new Date(date);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const dayName = days[today.getDay()];
    const dateFormatted = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    const generated = `Bahwa pada hari ${dayName}, tanggal ${dateFormatted} (${helperWhen || 'waktu pemantauan'}), bertempat di ${helperWhere || location || 'wilayah hukum Tabanan'}, telah dilakukan pemantauan terhadap ${helperWho || 'subjek/sasaran'}. Peristiwa/kegiatan yang terjadi adalah ${helperWhat || 'perihal kejadian'}. Adapun latar belakang/tujuan hal tersebut terjadi yakni ${helperWhy || 'penyebab'}. Perkembangan situasi dan penanganan yang dilakukan yaitu ${helperHow || 'kondisi lapangan dan tindakan'}.`;
    
    setNarrative(generated);
    setShowHelper5W1H(false);
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotoUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!narrative.trim()) {
      alert('Narasi kronologis 5W+1H wajib diisi');
      return;
    }
    if (!location.trim()) {
      alert('Lokasi / Tempat kejadian wajib diisi');
      return;
    }

    const entryToSave: IntelligenceEntry = {
      id: editingId || `din-${Date.now()}`,
      no: no.trim() || `REG-${Date.now()}/${currentSection}`,
      section: currentSection,
      sektor_symbol: sektorSymbol.toUpperCase(),
      keterangan,
      narrative: narrative.trim(),
      date,
      reportDate,
      location: location.trim(),
      kecamatan,
      classification,
      sourceConfidence,
      officerName: officerName.trim(),
      status,
      photoUrl: photoUrl || undefined,
      photoCaption: photoCaption.trim() || undefined,
      createdAt: editingId ? (entries.find((e) => e.id === editingId)?.createdAt || Date.now()) : Date.now(),
      updatedAt: Date.now(),
    };

    await onSaveEntry(entryToSave);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    handleResetForm();
  };

  const filteredSectionEntries = sectionEntries.filter(
    (e) =>
      e.no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.narrative.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.keterangan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Section Switcher Tabs */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Pilih Seksi Laporan Intelijen
          </span>
          <span className="text-[11px] text-amber-400 font-mono font-semibold">
            Seksi Terpilih: {currentSectionMeta.code} ({currentSectionMeta.shortName})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {SECTIONS_CONFIG.filter((s) => s.id !== 'D.IN.7').map((sec) => {
            const isSelected = currentSection === sec.id;
            const count = entries.filter((e) => e.section === sec.id).length;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  onSectionChange(sec.id);
                  handleResetForm();
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/40 text-white'
                    : 'bg-[#0F172A]/70 border-slate-700/60 text-slate-300 hover:bg-slate-800/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {sec.code}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
                    {count}
                  </span>
                </div>
                <div className="text-xs font-bold mt-1.5 truncate text-slate-100">
                  {sec.shortName}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {sec.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Intake Form Container */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-xl relative">
        {saveSuccess && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-semibold flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Laporan Intelijen berhasil disimpan dan diperbarui ke dalam sistem Papan Peta Intelijen!
          </div>
        )}

        {/* Form Official Header */}
        <div className="border-b border-slate-800 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/30">
                {currentSectionMeta.code}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Formulir Intake Laporan: {currentSectionMeta.name}
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Format Penulisan Narasi Kronologis 5W+1H (SIADIBIBAM) — Bidang Intelijen Kejari Tabanan
            </p>
          </div>

          {editingId && (
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/40">
                MODE EDITING
              </span>
              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
              >
                Batal Edit
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Row 1: Nomor Register, Sektor Symbol, Keterangan & Klasifikasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                No. Register Laporan
              </label>
              <input
                type="text"
                value={no}
                onChange={(e) => setNo(e.target.value)}
                placeholder="REG-01/D.IN.1/TAB/2026"
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Kode Sektor / Simbol
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sektorSymbol}
                  onChange={(e) => setSektorSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g. PO, IP, AG"
                  maxLength={4}
                  className="w-20 bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-center text-amber-400 font-bold uppercase focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <div className="flex-1 text-[11px] text-slate-400 flex items-center leading-tight">
                  Tag simbol sektor pada papan peta
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Keterangan / Kategori
              </label>
              <select
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                {currentSectionMeta.defaultKeterangan.map((kat) => (
                  <option key={kat} value={kat}>
                    {kat}
                  </option>
                ))}
                <option value="Lainnya">Lainnya / Khusus</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Klasifikasi Dokumen
              </label>
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value as any)}
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                <option value="TERBATAS">TERBATAS</option>
                <option value="RAHASIA">RAHASIA</option>
                <option value="BIASA">BIASA</option>
              </select>
            </div>
          </div>

          {/* Row 2: Tanggal Peristiwa, Tempat Kejadian, Kecamatan, Petugas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Tanggal Peristiwa
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Kecamatan (Kab. Tabanan)
              </label>
              <select
                value={kecamatan}
                onChange={(e) => setKecamatan(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                {TABANAN_KECAMATAN.map((kec) => (
                  <option key={kec} value={kec}>
                    Kecamatan {kec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Tempat / Lokasi Spesifik
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kantor KPUD / Desa Candikuning"
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Petugas Fungsional / Pelapor
              </label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                placeholder="Nama Petugas Intelijen"
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Row 3: Narrative Text (5W+1H / "Bahwa pada hari...") */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-bold uppercase text-slate-300">
                Uraian Fakta / Narasi Kronologis 5W+1H (SIADIBIBAM)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInsertTemplate}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 flex items-center gap-1.5 font-semibold cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Sisipkan Pola "Bahwa pada hari..."
                </button>
                <button
                  type="button"
                  onClick={() => setShowHelper5W1H(true)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-semibold cursor-pointer transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                  Panduan Isian 5W+1H
                </button>
              </div>
            </div>

            <textarea
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              rows={6}
              placeholder="Bahwa pada hari [Hari], tanggal [Tanggal], bertempat di [Lokasi], telah dilakukan pemantauan terhadap... (Format 5W+1H: Siapa, Apa, Dimana, Kapan, Mengapa, Bagaimana)"
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-3.5 text-xs leading-relaxed text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-sans"
              required
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">
                Karakter: {narrative.length} | Kata: {narrative.split(/\s+/).filter(Boolean).length}
              </span>
              <span className="italic text-slate-400">
                *Wajib memuat rincian Siapa, Apa, Dimana, Kapan, Mengapa, dan Bagaimana
              </span>
            </div>
          </div>

          {/* Row 4: Status Penanganan, Tingkat Kepercayaan Sumber & Foto Dokumentasi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Status Perkembangan
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="SELESAI">SELESAI (Kondusif)</option>
                <option value="DALAM_PEMANTAUAN">DALAM PEMANTAUAN (Monitoring Aktif)</option>
                <option value="TINDAK_LANJUT">TINDAK LANJUT (Perlu Tindakan Operasi)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Kepercayaan Sumber Informasi
              </label>
              <select
                value={sourceConfidence}
                onChange={(e) => setSourceConfidence(e.target.value as any)}
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="A1">A1 (Dapat Dipercaya Sepenuhnya & Terkonfirmasi)</option>
                <option value="A2">A2 (Sumber Terpercaya, Perlu Konfirmasi Lanjutan)</option>
                <option value="B1">B1 (Sumber Cukup Terpercaya, Fakta Teruji)</option>
                <option value="B2">B2 (Sumber Cukup Terpercaya, Fakta Belum Teruji)</option>
                <option value="C1">C1 (Informasi Awal dari Masyarakat / Media)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Foto Dokumentasi Lapangan (Google Drive / Berkas)
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={photoUrl.startsWith('data:') ? '' : photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Tautan Google Drive (drive.google.com/...) atau URL Foto"
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer bg-[#0F172A] hover:bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 flex items-center justify-center gap-1.5 truncate transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate">{photoUrl ? 'Ganti Berkas / Foto' : 'Unggah File Lokal'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="p-1.5 rounded-xl bg-rose-950 text-rose-400 border border-rose-800 hover:bg-rose-900 cursor-pointer"
                      title="Hapus Foto"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              {photoUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={photoUrl}
                    referrerPolicy="no-referrer"
                    alt="Preview"
                    className="w-10 h-10 object-cover rounded-lg border border-slate-700"
                  />
                  <input
                    type="text"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder="Keterangan foto dokumentasi"
                    className="flex-1 bg-[#0F172A] border border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Bersihkan Formulir</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>{editingId ? 'Simpan Perubahan Laporan' : 'Simpan Laporan Intelijen'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Entries Table for This Section */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Daftar Laporan Terdaftar — {currentSectionMeta.code} ({sectionEntries.length} Data)
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Kelola, perbarui atau cetak laporan yustisial untuk seksi ini
            </p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari register, lokasi, narasi..."
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {filteredSectionEntries.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            Belum ada laporan data intelijen untuk seksi {currentSectionMeta.code}.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSectionEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-xl bg-[#0F172A]/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-start justify-between gap-3"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {entry.no}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {entry.keterangan}
                    </span>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {entry.classification || 'TERBATAS'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1 ml-auto md:ml-0">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {entry.date}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {entry.narrative}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {entry.location} ({entry.kecamatan})
                    </span>
                    {entry.officerName && (
                      <span>Petugas: <b className="text-slate-200">{entry.officerName}</b></span>
                    )}
                    <span>Status: <b className="text-emerald-400">{entry.status}</b></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <button
                    onClick={() => onViewDetail(entry)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Lihat Detail 5W+1H"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Detail</span>
                  </button>
                  <button
                    onClick={() => handleStartEdit(entry)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Edit Laporan"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Yakin ingin menghapus laporan ${entry.no}?`)) {
                        onDeleteEntry(entry.id, entry.section);
                      }
                    }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Hapus Laporan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5W+1H / SIADIBIBAM Modal Helper */}
      {showHelper5W1H && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 max-w-lg w-full text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Panduan Formulir SIADIBIBAM (5W+1H)</h3>
              </div>
              <button
                onClick={() => setShowHelper5W1H(false)}
                className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Isi parameter di bawah ini untuk mengompilasi narasi intelijen standar Kejaksaan RI:
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-amber-400 font-bold mb-1">
                  1. SIAPA (Who / Subjek / Sasaran):
                </label>
                <input
                  type="text"
                  value={helperWho}
                  onChange={(e) => setHelperWho(e.target.value)}
                  placeholder="e.g. Komisioner KPUD Tabanan, Pengurus Ormas, Kelompok Tani"
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">
                  2. APA (What / Pokok Peristiwa / Fakta):
                </label>
                <input
                  type="text"
                  value={helperWhat}
                  onChange={(e) => setHelperWhat(e.target.value)}
                  placeholder="e.g. Verifikasi berkas parpol, kenaikan harga beras, sengketa tapal batas"
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">
                  3. DIMANA (Where / Tempat Kejadian):
                </label>
                <input
                  type="text"
                  value={helperWhere}
                  onChange={(e) => setHelperWhere(e.target.value)}
                  placeholder="e.g. Kantor KPUD Tabanan, Jl. Bypass Ir. Soekarno"
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">
                  4. KAPAN (When / Waktu Kejadian / Jam):
                </label>
                <input
                  type="text"
                  value={helperWhen}
                  onChange={(e) => setHelperWhen(e.target.value)}
                  placeholder="e.g. Pukul 09.30 WITA s/d 11.45 WITA"
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">
                  5. MENGAPA (Why / Latar Belakang / Motif):
                </label>
                <input
                  type="text"
                  value={helperWhy}
                  onChange={(e) => setHelperWhy(e.target.value)}
                  placeholder="e.g. Memastikan kepatuhan regulasi dan mencegah potensi sengketa hukum"
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">
                  6. BAGAIMANA (How / Tindakan & Dampak Lapangan):
                </label>
                <input
                  type="text"
                  value={helperHow}
                  onChange={(e) => setHelperHow(e.target.value)}
                  placeholder="e.g. Kegiatan berjalan tertib dan kondusif, tetap dilakukan pemantauan berkala"
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowHelper5W1H(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApplyHelper5W1H}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs text-slate-950 font-bold cursor-pointer transition-all shadow-md shadow-amber-500/20"
              >
                Terapkan ke Narasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
