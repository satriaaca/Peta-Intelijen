import { useState, ChangeEvent, FormEvent } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Save, 
  RotateCcw, 
  Trash2, 
  Edit3, 
  Upload, 
  X, 
  CheckCircle2, 
  Eye, 
  BookOpen, 
  Map as MapIcon, 
  Image as ImageIcon, 
  Sparkles, 
  Link as LinkIcon,
  Navigation,
  BarChart3,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
  Layers,
  AlertCircle
} from 'lucide-react';
import { OutreachEntry, OutreachCategory, MediaPhoto, AnnualTargetEntry } from '../types';
import { TABANAN_KECAMATAN, TABANAN_COORDINATES } from '../services/seedData';
import OutreachMapView from './OutreachMapView';
import OutreachTargetChart from './OutreachTargetChart';

interface OutreachFormViewProps {
  outreachEntries: OutreachEntry[];
  onSaveOutreach: (entry: OutreachEntry) => Promise<void>;
  onDeleteOutreach: (id: string, triwulan: number) => Promise<void>;
  annualTargets?: AnnualTargetEntry[];
  onSaveAnnualTarget?: (target: AnnualTargetEntry) => Promise<void>;
  onDeleteAnnualTarget?: (id: string) => Promise<void>;
}

export default function OutreachFormView({
  outreachEntries,
  onSaveOutreach,
  onDeleteOutreach,
  annualTargets = [],
  onSaveAnnualTarget,
  onDeleteAnnualTarget,
}: OutreachFormViewProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'analytics' | 'form' | 'gallery'>('map');
  const [selectedTriwulanFilter, setSelectedTriwulanFilter] = useState<number | 'ALL'>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [triwulan, setTriwulan] = useState<1 | 2 | 3 | 4>(1);
  const [jenisKegiatan, setJenisKegiatan] = useState<OutreachCategory>('Jaksa Masuk Sekolah (JMS)');
  const [no, setNo] = useState(`JMS/01/TRI-I/${new Date().getFullYear()}`);
  const [temaKegiatan, setTemaKegiatan] = useState('');
  const [waktu, setWaktu] = useState(new Date().toISOString().split('T')[0]);
  const [tempat, setTempat] = useState('');
  const [kecamatan, setKecamatan] = useState('Tabanan');
  const [jumlahPeserta, setJumlahPeserta] = useState<number>(100);
  const [targetPeserta, setTargetPeserta] = useState<number>(100);
  const [narasumber, setNarasumber] = useState('Tim Penkum Kejari Tabanan');
  const [materiPokok, setMateriPokok] = useState('');
  const [status, setStatus] = useState<'TERLAKSANA' | 'TERJADWAL' | 'DITUNDA'>('TERLAKSANA');
  
  // Multi-Photo State (1 to 5 photos)
  const [photos, setPhotos] = useState<MediaPhoto[]>([]);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [inputCaption, setInputCaption] = useState<string>('');
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [latitude, setLatitude] = useState<number>(-8.5385);
  const [longitude, setLongitude] = useState<number>(115.1232);

  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Multi-photo Lightbox Modal State
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    photos: MediaPhoto[];
    currentIndex: number;
    title: string;
  } | null>(null);

  // When kecamatan changes in form, auto-update coordinates if user hasn't typed custom ones
  const handleKecamatanChange = (selectedKec: string) => {
    setKecamatan(selectedKec);
    const coords = TABANAN_COORDINATES[selectedKec];
    if (coords) {
      setLatitude(coords.lat);
      setLongitude(coords.lng);
    }
  };

  const handleStartEdit = (entry: OutreachEntry) => {
    setEditingId(entry.id);
    setTriwulan(entry.triwulan);
    setJenisKegiatan(entry.jenis_kegiatan);
    setNo(entry.no);
    setTemaKegiatan(entry.tema_kegiatan);
    setWaktu(entry.waktu);
    setTempat(entry.tempat);
    setKecamatan(entry.kecamatan);
    setJumlahPeserta(entry.jumlah_peserta);
    setTargetPeserta(entry.target_peserta || entry.jumlah_peserta);
    setNarasumber(entry.narasumber || '');
    setMateriPokok(entry.materi_pokok || '');
    setStatus(entry.status);
    
    // Populate photos array
    if (entry.photos && entry.photos.length > 0) {
      setPhotos(entry.photos);
    } else if (entry.photoUrl) {
      setPhotos([
        {
          id: `photo-edit-${Date.now()}`,
          url: entry.photoUrl,
          caption: entry.photoCaption || '',
        }
      ]);
    } else {
      setPhotos([]);
    }
    
    if (entry.latitude && entry.longitude) {
      setLatitude(entry.latitude);
      setLongitude(entry.longitude);
    } else {
      const coords = TABANAN_COORDINATES[entry.kecamatan] || { lat: -8.5385, lng: 115.1232 };
      setLatitude(coords.lat);
      setLongitude(coords.lng);
    }

    setPhotoError(null);
    setActiveTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setEditingId(null);
    setTriwulan(1);
    setJenisKegiatan('Jaksa Masuk Sekolah (JMS)');
    setNo(`JMS/${String(outreachEntries.length + 1).padStart(2, '0')}/TRI-I/${new Date().getFullYear()}`);
    setTemaKegiatan('');
    setWaktu(new Date().toISOString().split('T')[0]);
    setTempat('');
    setKecamatan('Tabanan');
    setJumlahPeserta(100);
    setTargetPeserta(100);
    setNarasumber('Tim Intelijen & Penkum Kejari Tabanan');
    setMateriPokok('');
    setStatus('TERLAKSANA');
    setPhotos([]);
    setInputUrl('');
    setInputCaption('');
    setPhotoError(null);
    setLatitude(-8.5385);
    setLongitude(115.1232);
  };

  const handleJenisKegiatanChange = (newJenis: OutreachCategory) => {
    setJenisKegiatan(newJenis);
    if (!editingId) {
      let prefix = 'JMS';
      if (newJenis === 'Jaksa Menyapa') prefix = 'JMEN';
      else if (newJenis === 'Pakem') prefix = 'PAKEM';
      else if (newJenis === 'Kampanye Anti Korupsi') prefix = 'ANTI-KORUPSI';
      else if (newJenis === 'Penyuluhan Hukum') prefix = 'LUHKUM';
      else if (newJenis === 'Penerangan Hukum') prefix = 'PENKUM';
      
      const twRoman = ['I', 'II', 'III', 'IV'][triwulan - 1];
      setNo(`${prefix}/${String(outreachEntries.length + 1).padStart(2, '0')}/TRI-${twRoman}/${new Date().getFullYear()}`);
    }
  };

  // Handle Multi-file Upload (up to 5 total photos)
  const handleMultipleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setPhotoError(null);
    const availableSlots = 5 - photos.length;
    if (availableSlots <= 0) {
      setPhotoError('Maksimal 5 foto telah tercapai. Hapus foto terlebih dahulu untuk mengganti.');
      return;
    }

    const filesToProcess: File[] = (Array.from(files) as unknown as File[]).slice(0, availableSlots);
    if (files.length > availableSlots) {
      setPhotoError(`Hanya ${availableSlots} foto yang ditambahkan (maksimal 5 foto per kegiatan).`);
    }

    filesToProcess.forEach((file: File, idx: number) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const newPhoto: MediaPhoto = {
            id: `photo-${Date.now()}-${idx}`,
            url: uploadEvent.target.result as string,
            caption: inputCaption ? `${inputCaption} (${photos.length + idx + 1})` : `Dokumentasi ${file.name.replace(/\.[^/.]+$/, "")}`,
          };
          setPhotos((prev) => {
            if (prev.length >= 5) return prev;
            return [...prev, newPhoto];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  // Add Photo via URL
  const handleAddPhotoByUrl = () => {
    if (!inputUrl.trim()) return;
    if (photos.length >= 5) {
      setPhotoError('Maksimal 5 foto telah tercapai.');
      return;
    }

    const newPhoto: MediaPhoto = {
      id: `photo-url-${Date.now()}`,
      url: inputUrl.trim(),
      caption: inputCaption.trim() || undefined,
    };

    setPhotos([...photos, newPhoto]);
    setInputUrl('');
    setInputCaption('');
    setPhotoError(null);
  };

  // Remove Photo from state
  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoError(null);
  };

  // Update single photo caption
  const handleUpdateCaption = (index: number, newCaption: string) => {
    setPhotos(photos.map((p, i) => i === index ? { ...p, caption: newCaption } : p));
  };

  // Make photo the primary cover (index 0)
  const handleSetPrimaryPhoto = (index: number) => {
    if (index === 0) return;
    const selected = photos[index];
    const rest = photos.filter((_, i) => i !== index);
    setPhotos([selected, ...rest]);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!temaKegiatan.trim()) {
      alert('Tema kegiatan wajib diisi');
      return;
    }
    if (!tempat.trim()) {
      alert('Tempat pelaksanaan kegiatan wajib diisi');
      return;
    }

    // Validation: minimal 1 foto, maksimal 5 foto
    if (photos.length === 0) {
      setPhotoError('Wajib melampirkan minimal 1 foto dokumentasi kegiatan (maksimal 5 foto).');
      return;
    }
    if (photos.length > 5) {
      setPhotoError('Jumlah foto melebihi batas maksimal 5 foto.');
      return;
    }

    const primaryPhoto = photos[0];

    const entryToSave: OutreachEntry = {
      id: editingId || `outreach-${Date.now()}`,
      no: no.trim() || `OUTREACH-${Date.now()}`,
      triwulan,
      jenis_kegiatan: jenisKegiatan,
      tema_kegiatan: temaKegiatan.trim(),
      waktu,
      tempat: tempat.trim(),
      kecamatan,
      jumlah_peserta: Number(jumlahPeserta) || 0,
      target_peserta: Number(targetPeserta) || 0,
      narasumber: narasumber.trim() || undefined,
      materi_pokok: materiPokok.trim() || undefined,
      status,
      photoUrl: primaryPhoto?.url,
      photoCaption: primaryPhoto?.caption,
      photos: photos.length > 0 ? photos : undefined,
      latitude: Number(latitude) || TABANAN_COORDINATES[kecamatan]?.lat,
      longitude: Number(longitude) || TABANAN_COORDINATES[kecamatan]?.lng,
      createdAt: editingId ? (outreachEntries.find((o) => o.id === editingId)?.createdAt || Date.now()) : Date.now(),
      updatedAt: Date.now(),
    };

    await onSaveOutreach(entryToSave);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    handleResetForm();
  };

  const filteredEntries = selectedTriwulanFilter === 'ALL'
    ? outreachEntries
    : outreachEntries.filter((o) => o.triwulan === selectedTriwulanFilter);

  // Entries that have photos (either photos array or legacy photoUrl)
  const entriesWithPhotos = outreachEntries.filter((o) => (o.photos && o.photos.length > 0) || !!o.photoUrl);

  // Compute stats per triwulan
  const triwulanStats = [1, 2, 3, 4].map((tw) => {
    const items = outreachEntries.filter((o) => o.triwulan === tw);
    const totalParticipants = items.reduce((s, i) => s + (i.jumlah_peserta || 0), 0);
    const totalTarget = items.reduce((s, i) => s + (i.target_peserta || i.jumlah_peserta || 0), 0);
    const percentage = totalTarget > 0 ? Math.round((totalParticipants / totalTarget) * 100) : 0;
    return {
      triwulan: tw,
      count: items.length,
      participants: totalParticipants,
      target: totalTarget,
      percentage,
    };
  });

  // Open Lightbox with multiple photos
  const openEntryLightbox = (entry: OutreachEntry, startIdx = 0) => {
    let entryPhotos: MediaPhoto[] = [];
    if (entry.photos && entry.photos.length > 0) {
      entryPhotos = entry.photos;
    } else if (entry.photoUrl) {
      entryPhotos = [{ id: '1', url: entry.photoUrl, caption: entry.photoCaption }];
    }

    if (entryPhotos.length > 0) {
      setLightboxState({
        isOpen: true,
        photos: entryPhotos,
        currentIndex: startIdx,
        title: entry.tema_kegiatan,
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Navigation Tabs */}
      <div className="bg-[#151F33] border border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 sm:gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/30">
              D.IN.7
            </span>
            <h2 className="text-sm sm:text-lg font-bold text-white tracking-tight">
              Penerangan Hukum & Jaksa Masuk Sekolah (JMS)
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Analisis target vs capaian, peta sebaran kegiatan interaktif, formulir registrasi multi-foto (1-5 foto), dan galeri dokumentasi
          </p>
        </div>

        {/* Mode Switcher Tabs - Symmetrical Responsive Grid for Mobile */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 bg-[#0B1120] p-1.5 rounded-xl border border-slate-800 w-full lg:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`px-2.5 sm:px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all ${
              activeTab === 'map'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Peta Sebaran</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-2.5 sm:px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all ${
              activeTab === 'analytics'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Target vs Capaian</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`px-2.5 sm:px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all ${
              activeTab === 'form'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Formulir & Data</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`px-2.5 sm:px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all ${
              activeTab === 'gallery'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Galeri ({entriesWithPhotos.length})</span>
          </button>
        </div>
      </div>

      {/* Quarter Summary Cards with Capaian % */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        {triwulanStats.map((stat) => (
          <div
            key={stat.triwulan}
            onClick={() => setSelectedTriwulanFilter(stat.triwulan as any)}
            className={`p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer shadow-md ${
              selectedTriwulanFilter === stat.triwulan
                ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/40'
                : 'bg-[#151F33] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1">
              <span className="font-mono text-[11px] sm:text-xs font-bold text-amber-400">
                TRIWULAN {['I', 'II', 'III', 'IV'][stat.triwulan - 1]}
              </span>
              <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-lg font-mono font-bold whitespace-nowrap ${
                stat.percentage >= 100 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
              }`}>
                {stat.percentage}% Capaian
              </span>
            </div>
            <div className="text-base sm:text-xl font-bold text-white mt-2 font-mono">
              {stat.participants.toLocaleString()}
              <span className="text-[10px] sm:text-xs text-slate-400 font-sans font-normal ml-1">/ {stat.target.toLocaleString()}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${stat.percentage >= 100 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                style={{ width: `${Math.min(stat.percentage, 100)}%` }}
              />
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
              <span>{['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Okt-Des'][stat.triwulan - 1]}</span>
              <span className="text-slate-300 font-mono font-semibold">{stat.count} Giat</span>
            </div>
          </div>
        ))}
      </div>

      {/* TAB 1: PETA SEBARAN LOKASI (LEAFLET MAP VIEW) */}
      {activeTab === 'map' && (
        <OutreachMapView
          outreachEntries={outreachEntries}
          onSelectEdit={(entry) => handleStartEdit(entry)}
          onOpenPhotoLightbox={(photoUrl, caption) => {
            const entry = outreachEntries.find((e) => e.photoUrl === photoUrl || e.photos?.some((p) => p.url === photoUrl));
            if (entry) {
              openEntryLightbox(entry);
            } else {
              setLightboxState({
                isOpen: true,
                photos: [{ id: '1', url: photoUrl, caption }],
                currentIndex: 0,
                title: 'Dokumentasi Penerangan Hukum & JMS',
              });
            }
          }}
        />
      )}

      {/* TAB 2: ANALITIK TARGET VS CAPAIAN GRAFIK */}
      {activeTab === 'analytics' && (
        <OutreachTargetChart
          outreachEntries={outreachEntries}
          annualTargets={annualTargets}
          onSaveAnnualTarget={onSaveAnnualTarget}
          onDeleteAnnualTarget={onDeleteAnnualTarget}
        />
      )}


      {/* TAB 3: FORMULIR INPUT & DAFTAR DATA */}
      {activeTab === 'form' && (
        <div className="space-y-6">
          {/* Main Outreach Form */}
          <div className="bg-[#151F33] border border-slate-800 rounded-2xl p-6 shadow-xl">
            {saveSuccess && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Data kegiatan Penerangan / Penyuluhan Hukum D.IN.7 dan foto dokumentasi berhasil disimpan!
              </div>
            )}

            <div className="border-b border-slate-800 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  {editingId ? 'Edit Data Kegiatan Penerangan / JMS' : 'Registrasi Kegiatan Baru (D.IN.7)'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Lengkapi data kegiatan, target vs realisasi peserta, titik koordinat peta, dan lampirkan 1 s/d 5 foto dokumentasi
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

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Row 1: Triwulan, Jenis Kegiatan, No Register, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Triwulan Pelaksanaan
                  </label>
                  <select
                    value={triwulan}
                    onChange={(e) => setTriwulan(Number(e.target.value) as any)}
                    className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                  >
                    <option value={1}>Triwulan I (Januari – Maret)</option>
                    <option value={2}>Triwulan II (April – Juni)</option>
                    <option value={3}>Triwulan III (Juli – September)</option>
                    <option value={4}>Triwulan IV (Oktober – Desember)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Jenis Kegiatan
                  </label>
                  <select
                    value={jenisKegiatan}
                    onChange={(e) => handleJenisKegiatanChange(e.target.value as any)}
                    className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Jaksa Masuk Sekolah (JMS)">🎓 Jaksa Masuk Sekolah (JMS)</option>
                    <option value="Jaksa Menyapa">🎙️ Jaksa Menyapa</option>
                    <option value="Pakem">🕊️ Pakem (Pengawasan Aliran Kepercayaan)</option>
                    <option value="Kampanye Anti Korupsi">🛡️ Kampanye Anti Korupsi</option>
                    <option value="Penyuluhan Hukum">⚖️ Penyuluhan Hukum (Luhkum)</option>
                    <option value="Penerangan Hukum">🏛️ Penerangan Hukum (Penkum)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    No. Registrasi Kegiatan
                  </label>
                  <input
                    type="text"
                    value={no}
                    onChange={(e) => setNo(e.target.value)}
                    placeholder="JMS/01/TRI-I/2026"
                    className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Status Pelaksanaan
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="TERLAKSANA">🟢 TERLAKSANA</option>
                    <option value="TERJADWAL">🟡 TERJADWAL</option>
                    <option value="DITUNDA">🔴 DITUNDA</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Tema Kegiatan */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Tema / Judul Kegiatan Penyuluhan & Penerangan Hukum
                </label>
                <input
                  type="text"
                  value={temaKegiatan}
                  onChange={(e) => setTemaKegiatan(e.target.value)}
                  placeholder="e.g. Kenali Hukum Jauhi Hukuman: Pencegahan Bullying & Bahaya Narkoba di Kalangan Pelajar"
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Row 3: Target Peserta vs Realisasi Hadir, Waktu, Tempat, Kecamatan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Waktu Pelaksanaan
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="date"
                      value={waktu}
                      onChange={(e) => setWaktu(e.target.value)}
                      className="w-full bg-[#0B1120] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Kecamatan Wilayah
                  </label>
                  <select
                    value={kecamatan}
                    onChange={(e) => handleKecamatanChange(e.target.value)}
                    className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    {TABANAN_KECAMATAN.map((kec) => (
                      <option key={kec} value={kec}>
                        Kecamatan {kec}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Target Peserta</span>
                    <span className="text-[10px] text-slate-400 font-mono">Direncanakan</span>
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      value={targetPeserta}
                      onChange={(e) => setTargetPeserta(Number(e.target.value))}
                      placeholder="100"
                      className="w-full bg-[#0B1120] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Realisasi Peserta</span>
                    {targetPeserta > 0 && (
                      <span className="text-[10px] font-mono font-bold text-amber-400">
                        {Math.round((jumlahPeserta / targetPeserta) * 100)}% Capaian
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-amber-400 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      value={jumlahPeserta}
                      onChange={(e) => setJumlahPeserta(Number(e.target.value))}
                      placeholder="100"
                      className="w-full bg-[#0B1120] border border-amber-500/50 rounded-xl pl-9 pr-3 py-2 text-xs text-amber-300 focus:outline-none focus:border-amber-500 font-mono font-bold"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Tempat, Narasumber, Materi Pokok */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Tempat / Lokasi Spesifik
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={tempat}
                      onChange={(e) => setTempat(e.target.value)}
                      placeholder="e.g. Aula SMAN 1 Tabanan"
                      className="w-full bg-[#0B1120] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Narasumber / Tim Pelaksana
                  </label>
                  <input
                    type="text"
                    value={narasumber}
                    onChange={(e) => setNarasumber(e.target.value)}
                    placeholder="e.g. I Putu Arya, S.H. & Tim Penerangan Hukum"
                    className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Materi Pokok Penyuluhan
                  </label>
                  <input
                    type="text"
                    value={materiPokok}
                    onChange={(e) => setMateriPokok(e.target.value)}
                    placeholder="e.g. UU ITE, Bahaya Narkotika & Judol"
                    className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Row 5: Titik Koordinat Peta */}
              <div className="p-3.5 rounded-xl bg-[#0B1120] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-slate-300 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-amber-400" />
                    Titik Koordinat Peta (Latitude & Longitude)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const coords = TABANAN_COORDINATES[kecamatan] || { lat: -8.5385, lng: 115.1232 };
                      setLatitude(coords.lat);
                      setLongitude(coords.lng);
                    }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    Reset ke Koordinat Pusat Kec. {kecamatan}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Latitude:</span>
                    <input
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(parseFloat(e.target.value))}
                      className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Longitude:</span>
                    <input
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(parseFloat(e.target.value))}
                      className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Row 6: Multi-Photo Documentation (Minimal 1, Maksimal 5 Foto) */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold uppercase text-slate-200 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Dokumentasi Foto Kegiatan Lapangan</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      photos.length >= 1 && photos.length <= 5 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {photos.length}/5 Foto (Min 1, Maks 5)
                    </span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Foto pertama otomatis dijadikan foto sampul / tampilan utama
                  </span>
                </div>

                {photoError && (
                  <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{photoError}</span>
                  </div>
                )}

                {/* Photo Upload & Add via URL controls - Responsive on Mobile */}
                <div className="p-3 sm:p-4 rounded-xl bg-[#0B1120] border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <label className={`cursor-pointer bg-[#151F33] hover:bg-slate-800 border rounded-xl px-3.5 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shrink-0 ${
                      photos.length >= 5 ? 'opacity-50 pointer-events-none border-slate-800 text-slate-500' : 'border-amber-500/40 text-amber-300 hover:border-amber-500'
                    }`}>
                      <Upload className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Unggah File Foto {photos.length > 0 ? `(${5 - photos.length} slot tersisa)` : '(1-5 Foto)'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={photos.length >= 5}
                        onChange={handleMultipleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <span className="text-[11px] text-slate-500 text-center sm:text-left shrink-0">atau tautan:</span>

                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="relative flex-1 min-w-0">
                        <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={inputUrl}
                          onChange={(e) => setInputUrl(e.target.value)}
                          placeholder="URL Foto / Google Drive..."
                          disabled={photos.length >= 5}
                          className="w-full bg-[#151F33] border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 focus:border-amber-500 truncate"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddPhotoByUrl}
                        disabled={!inputUrl.trim() || photos.length >= 5}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-400" />
                        <span>Tambah</span>
                      </button>
                    </div>
                  </div>

                  {/* Optional Default Caption Input */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <input
                      type="text"
                      value={inputCaption}
                      onChange={(e) => setInputCaption(e.target.value)}
                      placeholder="Keterangan foto default (misal: Sesi penyampaian materi hukum)"
                      className="w-full bg-[#151F33] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Multi-photo Thumbnails List */}
                {photos.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-slate-800 rounded-xl text-slate-500 text-xs space-y-1">
                    <ImageIcon className="w-6 h-6 mx-auto text-slate-600 mb-1" />
                    <p className="font-semibold text-slate-400">Belum ada foto dokumentasi yang dilampirkan</p>
                    <p className="text-[11px]">Silakan unggah atau tambahkan minimal 1 foto (maksimal 5 foto per kegiatan)</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
                    {photos.map((photo, index) => (
                      <div 
                        key={photo.id || index} 
                        className={`p-2 rounded-xl bg-[#0B1120] border transition-all relative flex flex-col justify-between ${
                          index === 0 ? 'border-amber-500/60 ring-1 ring-amber-500/30' : 'border-slate-800'
                        }`}
                      >
                        {/* Thumbnail Image */}
                        <div className="relative w-full h-24 sm:h-28 rounded-lg overflow-hidden bg-slate-900 group">
                          <img
                            src={photo.url}
                            alt={`Dokumentasi ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Badge Index */}
                          <div className="absolute top-1 left-1 max-w-[80%]">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md font-mono truncate flex items-center gap-1 ${
                              index === 0 
                                ? 'bg-amber-500 text-slate-950' 
                                : 'bg-black/75 text-slate-200'
                            }`}>
                              {index === 0 && <Star className="w-2.5 h-2.5 fill-slate-950 shrink-0" />}
                              <span>{index === 0 ? 'Sampul' : `#${index + 1}`}</span>
                            </span>
                          </div>

                          {/* Action Overlay */}
                          <div className="absolute top-1 right-1 flex items-center gap-1">
                            {index !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryPhoto(index)}
                                className="p-1 rounded bg-black/70 hover:bg-amber-500 hover:text-slate-950 text-slate-200 cursor-pointer shadow-md"
                                title="Jadikan foto utama / sampul"
                              >
                                <Star className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(index)}
                              className="p-1 rounded bg-rose-950/90 hover:bg-rose-800 text-rose-200 cursor-pointer shadow-md"
                              title="Hapus foto ini"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Editable Caption Input for this specific photo */}
                        <div className="mt-1.5">
                          <input
                            type="text"
                            value={photo.caption || ''}
                            onChange={(e) => handleUpdateCaption(index, e.target.value)}
                            placeholder={`Caption foto ${index + 1}...`}
                            className="w-full bg-[#151F33] border border-slate-700/80 rounded-lg px-2 py-1 text-[10px] sm:text-[11px] text-slate-200 focus:border-amber-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Bersihkan Form</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>{editingId ? 'Simpan Perubahan Giat' : 'Simpan Kegiatan Penkum D.IN.7'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Outreach Activities Table/Cards */}
          <div className="bg-[#151F33] border border-slate-800 rounded-2xl p-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  Daftar Kegiatan Penkum & JMS Terdaftar ({filteredEntries.length} Kegiatan)
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Daftar rekapitulasi giat penyuluhan, penerangan, dan JMS se-Kabupaten Tabanan
                </p>
              </div>

              <div className="flex items-center gap-1 bg-[#0B1120] p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setSelectedTriwulanFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    selectedTriwulanFilter === 'ALL'
                      ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Semua
                </button>
                {[1, 2, 3, 4].map((tw) => (
                  <button
                    key={tw}
                    onClick={() => setSelectedTriwulanFilter(tw as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      selectedTriwulanFilter === tw
                        ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    TW {['I', 'II', 'III', 'IV'][tw - 1]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredEntries.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Belum ada kegiatan yang terdaftar untuk filter Triwulan ini.
                </div>
              ) : (
                filteredEntries.map((item) => {
                  const entryPhotos = (item.photos && item.photos.length > 0) 
                    ? item.photos 
                    : (item.photoUrl ? [{ id: '1', url: item.photoUrl, caption: item.photoCaption }] : []);
                  const targetNum = item.target_peserta || item.jumlah_peserta || 0;
                  const capaianPct = targetNum > 0 ? Math.round((item.jumlah_peserta / targetNum) * 100) : 0;

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 sm:p-4 rounded-xl bg-[#0B1120]/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-start justify-between gap-3 sm:gap-4"
                    >
                      {/* Thumbnail with Multi-Photo Indicator */}
                      {entryPhotos.length > 0 && (
                        <div
                          onClick={() => openEntryLightbox(item)}
                          className="w-full md:w-36 h-36 md:h-24 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0 cursor-pointer group relative"
                        >
                          <img
                            src={entryPhotos[0].url}
                            alt={item.tema_kegiatan}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold gap-1">
                            <Eye className="w-3.5 h-3.5" /> Lihat {entryPhotos.length} Foto
                          </div>
                          {entryPhotos.length > 1 && (
                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-amber-400 border border-amber-500/40">
                              +{entryPhotos.length - 1} Foto
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="font-mono text-[10px] sm:text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/30">
                            TRIWULAN {['I', 'II', 'III', 'IV'][item.triwulan - 1]}
                          </span>
                          <span className="text-[11px] sm:text-xs font-bold text-slate-200 font-mono">
                            {item.no}
                          </span>
                          <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                            {item.jenis_kegiatan}
                          </span>
                          <span className={`text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            item.status === 'TERLAKSANA'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {item.status}
                          </span>
                          <span className={`text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                            capaianPct >= 100 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {capaianPct}% Target
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                          {item.tema_kegiatan}
                        </h4>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-400 pt-0.5">
                          <span className="flex items-center gap-1 text-slate-300 font-mono">
                            <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                            {item.waktu}
                          </span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                            {item.tempat} ({item.kecamatan})
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-amber-300 font-mono">
                            <Users className="w-3 h-3 shrink-0" />
                            {item.jumlah_peserta} / {targetNum} Peserta
                          </span>
                          {item.narasumber && (
                            <span className="hidden sm:inline">
                              Narsum: <b className="text-slate-200">{item.narasumber}</b>
                            </span>
                          )}
                        </div>

                        {entryPhotos.length > 0 && entryPhotos[0].caption && (
                          <p className="text-[11px] text-slate-400 italic pt-0.5">
                            "{entryPhotos[0].caption}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2 shrink-0 pt-2.5 md:pt-0 border-t md:border-t-0 border-slate-800 w-full md:w-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('map');
                          }}
                          className="flex-1 md:flex-none px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          title="Tampilkan di Peta"
                        >
                          <MapIcon className="w-3.5 h-3.5" />
                          <span>Peta</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="flex-1 md:flex-none px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                          title="Edit Kegiatan"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus kegiatan ${item.no}?`)) {
                              onDeleteOutreach(item.id, item.triwulan);
                            }
                          }}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                          title="Hapus Kegiatan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GALERI FOTO KEGIATAN MULTI-PHOTO */}
      {activeTab === 'gallery' && (
        <div className="bg-[#151F33] border border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                Galeri Foto Dokumentasi Lapangan Penerangan Hukum & JMS
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Koleksi dokumentasi visual lengkap (1 hingga 5 foto per giat) dari setiap kegiatan penyuluhan hukum di Tabanan
              </p>
            </div>
            <button
              onClick={() => setActiveTab('form')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Tambah Foto Baru</span>
            </button>
          </div>

          {entriesWithPhotos.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              Belum ada foto dokumentasi yang diunggah. Tambahkan foto melalui tab Formulir.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {entriesWithPhotos.map((item) => {
                const photosList = (item.photos && item.photos.length > 0)
                  ? item.photos
                  : (item.photoUrl ? [{ id: '1', url: item.photoUrl, caption: item.photoCaption }] : []);
                const coverPhoto = photosList[0];

                return (
                  <div
                    key={item.id}
                    className="bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden shadow-lg group hover:border-amber-500/50 transition-all flex flex-col justify-between"
                  >
                    {/* Cover Photo */}
                    <div
                      onClick={() => openEntryLightbox(item, 0)}
                      className="relative w-full h-52 overflow-hidden bg-slate-900 cursor-pointer"
                    >
                      <img
                        src={coverPhoto?.url}
                        alt={item.tema_kegiatan}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-amber-400 border border-amber-500/30">
                          {item.jenis_kegiatan}
                        </span>
                        {photosList.length > 1 && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950">
                            {photosList.length} Foto
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="text-[11px] font-mono text-slate-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          {item.tempat}, Kec. {item.kecamatan}
                        </div>
                      </div>
                    </div>

                    {/* Filmstrip thumbnails if multiple photos exist */}
                    {photosList.length > 1 && (
                      <div className="px-3 pt-2.5 flex items-center gap-1.5 overflow-x-auto">
                        {photosList.map((p, pIdx) => (
                          <div
                            key={p.id || pIdx}
                            onClick={() => openEntryLightbox(item, pIdx)}
                            className="w-12 h-10 rounded-md overflow-hidden border border-slate-800 shrink-0 cursor-pointer hover:border-amber-400 transition-colors"
                          >
                            <img src={p.url} alt={`Thumb ${pIdx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                          {item.tema_kegiatan}
                        </h4>
                        {coverPhoto?.caption && (
                          <p className="text-[11px] text-slate-300 italic mt-1.5 line-clamp-2">
                            "{coverPhoto.caption}"
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-mono text-slate-300">🗓️ {item.waktu}</span>
                        <span className="font-bold text-amber-400 font-mono">👥 {item.jumlah_peserta} Peserta</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Multi-Photo Lightbox Modal */}
      {lightboxState && lightboxState.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151F33] border border-slate-700 rounded-2xl p-5 max-w-4xl w-full text-slate-100 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-3">
              <div className="min-w-0 pr-4">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block font-mono">
                  DOKUMENTASI FOTO KEGIATAN PENKUM & JMS ({lightboxState.currentIndex + 1} / {lightboxState.photos.length})
                </span>
                <h3 className="text-sm font-bold text-white truncate mt-0.5">
                  {lightboxState.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxState(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Active Photo Container */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#0B1120] flex items-center justify-center min-h-[300px]">
              <img
                src={lightboxState.photos[lightboxState.currentIndex]?.url}
                alt={lightboxState.title}
                className="w-full max-h-[65vh] object-contain"
              />

              {/* Prev / Next Navigation Arrows */}
              {lightboxState.photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setLightboxState({
                      ...lightboxState,
                      currentIndex: (lightboxState.currentIndex - 1 + lightboxState.photos.length) % lightboxState.photos.length,
                    })}
                    className="absolute left-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white cursor-pointer transition-colors shadow-lg"
                    title="Foto Sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightboxState({
                      ...lightboxState,
                      currentIndex: (lightboxState.currentIndex + 1) % lightboxState.photos.length,
                    })}
                    className="absolute right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white cursor-pointer transition-colors shadow-lg"
                    title="Foto Selanjutnya"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Photo Caption */}
            {lightboxState.photos[lightboxState.currentIndex]?.caption && (
              <p className="text-xs text-slate-300 mt-3 italic bg-[#0B1120] p-3 rounded-xl border border-slate-800">
                "{lightboxState.photos[lightboxState.currentIndex].caption}"
              </p>
            )}

            {/* Filmstrip selector in modal */}
            {lightboxState.photos.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                {lightboxState.photos.map((photo, pIdx) => (
                  <div
                    key={photo.id || pIdx}
                    onClick={() => setLightboxState({ ...lightboxState, currentIndex: pIdx })}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 cursor-pointer shrink-0 transition-all ${
                      lightboxState.currentIndex === pIdx 
                        ? 'border-amber-500 ring-2 ring-amber-500/40 scale-105' 
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={photo.url} alt={`Thumbnail ${pIdx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
