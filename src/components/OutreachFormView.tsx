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
  GraduationCap, 
  Sparkles, 
  Link as LinkIcon,
  Navigation,
  Compass,
  Layers
} from 'lucide-react';
import { OutreachEntry, OutreachCategory } from '../types';
import { TABANAN_KECAMATAN, TABANAN_COORDINATES } from '../services/seedData';
import OutreachMapView from './OutreachMapView';

interface OutreachFormViewProps {
  outreachEntries: OutreachEntry[];
  onSaveOutreach: (entry: OutreachEntry) => Promise<void>;
  onDeleteOutreach: (id: string, triwulan: number) => Promise<void>;
}

export default function OutreachFormView({
  outreachEntries,
  onSaveOutreach,
  onDeleteOutreach,
}: OutreachFormViewProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'form' | 'gallery'>('map');
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
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoCaption, setPhotoCaption] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(-8.5385);
  const [longitude, setLongitude] = useState<number>(115.1232);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewPhotoModal, setPreviewPhotoModal] = useState<{ url: string; caption?: string; title: string } | null>(null);

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
    setPhotoUrl(entry.photoUrl || '');
    setPhotoCaption(entry.photoCaption || '');
    
    if (entry.latitude && entry.longitude) {
      setLatitude(entry.latitude);
      setLongitude(entry.longitude);
    } else {
      const coords = TABANAN_COORDINATES[entry.kecamatan] || { lat: -8.5385, lng: 115.1232 };
      setLatitude(coords.lat);
      setLongitude(coords.lng);
    }

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
    setNarasumber('Tim Penkum Kejari Tabanan');
    setMateriPokok('');
    setStatus('TERLAKSANA');
    setPhotoUrl('');
    setPhotoCaption('');
    setLatitude(-8.5385);
    setLongitude(115.1232);
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
    if (!temaKegiatan.trim()) {
      alert('Tema kegiatan wajib diisi');
      return;
    }
    if (!tempat.trim()) {
      alert('Tempat pelaksanaan kegiatan wajib diisi');
      return;
    }

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
      photoUrl: photoUrl || undefined,
      photoCaption: photoCaption.trim() || undefined,
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

  // Entries that have photos
  const entriesWithPhotos = outreachEntries.filter((o) => !!o.photoUrl);

  // Compute stats per triwulan
  const triwulanStats = [1, 2, 3, 4].map((tw) => {
    const items = outreachEntries.filter((o) => o.triwulan === tw);
    const totalParticipants = items.reduce((s, i) => s + (i.jumlah_peserta || 0), 0);
    return {
      triwulan: tw,
      count: items.length,
      participants: totalParticipants,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Navigation Tabs */}
      <div className="bg-[#151F33] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/30">
              D.IN.7
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Penerangan Hukum & Jaksa Masuk Sekolah (JMS)
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Visualisasi peta sebaran lokasi kegiatan yang telah dilaksanakan, dokumentasi foto, dan registrasi Triwulan I–IV
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-[#0B1120] p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'map'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Peta Sebaran Lokasi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'form'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Formulir & Data Giat</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'gallery'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Galeri Foto ({entriesWithPhotos.length})</span>
          </button>
        </div>
      </div>

      {/* Quarter Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {triwulanStats.map((stat) => (
          <div
            key={stat.triwulan}
            onClick={() => setSelectedTriwulanFilter(stat.triwulan as any)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-md ${
              selectedTriwulanFilter === stat.triwulan
                ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/40'
                : 'bg-[#151F33] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-400">
                TRIWULAN {['I', 'II', 'III', 'IV'][stat.triwulan - 1]}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg font-mono">
                {stat.count} Giat
              </span>
            </div>
            <div className="text-xl font-bold text-white mt-2.5 font-mono">
              {stat.participants.toLocaleString()}
              <span className="text-xs text-slate-400 font-sans font-normal ml-1">Peserta</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Target tahunan {['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Okt-Des'][stat.triwulan - 1]}
            </div>
          </div>
        ))}
      </div>

      {/* TAB 1: PETA SEBARAN LOKASI (LEAFLET MAP VIEW) */}
      {activeTab === 'map' && (
        <OutreachMapView
          outreachEntries={outreachEntries}
          onSelectEdit={(entry) => handleStartEdit(entry)}
          onOpenPhotoLightbox={(url, caption) => {
            const entry = outreachEntries.find((e) => e.photoUrl === url);
            setPreviewPhotoModal({
              url,
              caption,
              title: entry?.tema_kegiatan || 'Dokumentasi Kegiatan Penkum & JMS',
            });
          }}
        />
      )}

      {/* TAB 2: FORMULIR INPUT & DAFTAR DATA */}
      {activeTab === 'form' && (
        <div className="space-y-6">
          {/* Main Outreach Form */}
          <div className="bg-[#151F33] border border-slate-800 rounded-2xl p-6 shadow-xl">
            {saveSuccess && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Data kegiatan Penerangan / Penyuluhan Hukum D.IN.7 berhasil disimpan!
              </div>
            )}

            <div className="border-b border-slate-800 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  {editingId ? 'Edit Data Kegiatan Penerangan / JMS' : 'Registrasi Kegiatan Baru (D.IN.7)'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Isi formulir lengkap termasuk lokasi titik koordinat peta dan foto dokumentasi kegiatan
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
                    onChange={(e) => setJenisKegiatan(e.target.value as any)}
                    className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Jaksa Masuk Sekolah (JMS)">🎓 Jaksa Masuk Sekolah (JMS)</option>
                    <option value="Jaksa Menyapa">🎙️ Jaksa Menyapa (Radio / Dialog)</option>
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

              {/* Row 3: Waktu, Tempat, Kecamatan, Peserta */}
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
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Tempat / Lokasi Spesifik
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={tempat}
                      onChange={(e) => setTempat(e.target.value)}
                      placeholder="e.g. Aula SMAN 1 Tabanan / Balai Desa"
                      className="w-full bg-[#0B1120] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Jumlah Peserta Hadir
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      value={jumlahPeserta}
                      onChange={(e) => setJumlahPeserta(Number(e.target.value))}
                      placeholder="100"
                      className="w-full bg-[#0B1120] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Narasumber & Materi Pokok */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    placeholder="e.g. UU ITE, Pencegahan Bullying, Bahaya Narkotika"
                    className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Row 5: Titik Koordinat Peta (Latitude & Longitude) */}
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

              {/* Row 6: Foto Dokumentasi Kegiatan */}
              <div className="pt-3 border-t border-slate-800">
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    Foto Dokumentasi Kegiatan (Unggah File atau Masukkan URL)
                  </span>
                  {photoUrl && (
                    <span className="text-[10px] text-emerald-400 font-normal">
                      ✓ Foto kegiatan terlampir
                    </span>
                  )}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Upload button & URL input */}
                  <div className="sm:col-span-8 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer bg-[#0B1120] hover:bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-300 flex items-center gap-2 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>{photoUrl ? 'Ganti Berkas Foto' : 'Unggah Foto dari Komputer'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>

                      <span className="text-xs text-slate-500">atau</span>

                      <div className="flex-1 min-w-[200px] relative">
                        <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={photoUrl.startsWith('data:') ? '' : photoUrl}
                          onChange={(e) => setPhotoUrl(e.target.value)}
                          placeholder="Masukkan tautan URL foto langsung (https://...)"
                          className="w-full bg-[#0B1120] border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200"
                        />
                      </div>
                    </div>

                    <input
                      type="text"
                      value={photoCaption}
                      onChange={(e) => setPhotoCaption(e.target.value)}
                      placeholder="Keterangan / Caption foto (misal: Sesi tanya jawab bersama siswa kelas IX)"
                      className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                    />
                  </div>

                  {/* Preview Thumbnail */}
                  <div className="sm:col-span-4 flex items-center justify-center p-2 rounded-xl bg-[#0B1120] border border-slate-800 min-h-[90px]">
                    {photoUrl ? (
                      <div className="relative w-full h-24 rounded-lg overflow-hidden group">
                        <img
                          src={photoUrl}
                          alt="Dokumentasi Preview"
                          className="w-full h-full object-cover rounded-lg cursor-pointer"
                          onClick={() => setPreviewPhotoModal({
                            url: photoUrl,
                            caption: photoCaption,
                            title: temaKegiatan || 'Preview Dokumentasi',
                          })}
                        />
                        <button
                          type="button"
                          onClick={() => setPhotoUrl('')}
                          className="absolute top-1 right-1 p-1 rounded-md bg-rose-900/90 hover:bg-rose-800 text-rose-200 cursor-pointer shadow-md"
                          title="Hapus Foto"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-slate-500 text-[11px] p-2">
                        Belum ada foto dokumentasi dipilih
                      </div>
                    )}
                  </div>
                </div>
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
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
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
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
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
                filteredEntries.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#0B1120]/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
                  >
                    {/* Thumbnail if available */}
                    {item.photoUrl && (
                      <div
                        onClick={() => setPreviewPhotoModal({
                          url: item.photoUrl!,
                          caption: item.photoCaption,
                          title: item.tema_kegiatan,
                        })}
                        className="w-full md:w-36 h-24 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0 cursor-pointer group relative"
                      >
                        <img
                          src={item.photoUrl}
                          alt={item.tema_kegiatan}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold gap-1">
                          <Eye className="w-3.5 h-3.5" /> Lihat Foto
                        </div>
                      </div>
                    )}

                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                          TRIWULAN {['I', 'II', 'III', 'IV'][item.triwulan - 1]}
                        </span>
                        <span className="text-xs font-bold text-slate-200 font-mono">
                          {item.no}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                          {item.jenis_kegiatan}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          item.status === 'TERLAKSANA'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white leading-snug">
                        {item.tema_kegiatan}
                      </h4>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1 text-slate-300 font-mono">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {item.waktu}
                        </span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          {item.tempat} ({item.kecamatan})
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-amber-300 font-mono">
                          <Users className="w-3 h-3" />
                          {item.jumlah_peserta} Peserta
                        </span>
                        {item.narasumber && (
                          <span className="hidden sm:inline">
                            Narsum: <b className="text-slate-200">{item.narasumber}</b>
                          </span>
                        )}
                      </div>

                      {item.photoCaption && (
                        <p className="text-[11px] text-slate-400 italic pt-1">
                          "{item.photoCaption}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('map');
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        title="Tampilkan di Peta"
                      >
                        <MapIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Peta</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        title="Edit Kegiatan"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Hapus kegiatan ${item.no}?`)) {
                            onDeleteOutreach(item.id, item.triwulan);
                          }
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        title="Hapus Kegiatan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GALERI FOTO KEGIATAN */}
      {activeTab === 'gallery' && (
        <div className="bg-[#151F33] border border-slate-800 rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                Galeri Foto Dokumentasi Lapangan Penerangan Hukum & JMS
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Koleksi dokumentasi visual kegiatan jaksa masuk sekolah dan penyuluhan hukum di seluruh kecamatan
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
              {entriesWithPhotos.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden shadow-lg group hover:border-amber-500/50 transition-all flex flex-col"
                >
                  <div
                    onClick={() => setPreviewPhotoModal({
                      url: item.photoUrl!,
                      caption: item.photoCaption,
                      title: item.tema_kegiatan,
                    })}
                    className="relative w-full h-52 overflow-hidden bg-slate-900 cursor-pointer"
                  >
                    <img
                      src={item.photoUrl}
                      alt={item.tema_kegiatan}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-amber-400 border border-amber-500/30">
                        {item.jenis_kegiatan}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-[11px] font-mono text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {item.tempat}, Kec. {item.kecamatan}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                        {item.tema_kegiatan}
                      </h4>
                      {item.photoCaption && (
                        <p className="text-[11px] text-slate-300 italic mt-1.5 line-clamp-2">
                          "{item.photoCaption}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono text-slate-300">🗓️ {item.waktu}</span>
                      <span className="font-bold text-amber-400 font-mono">👥 {item.jumlah_peserta} Peserta</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {previewPhotoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151F33] border border-slate-700 rounded-2xl p-5 max-w-3xl w-full text-slate-100 shadow-2xl relative">
            <div className="flex justify-between items-center mb-3">
              <div className="min-w-0 pr-4">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block font-mono">
                  DOKUMENTASI FOTO KEGIATAN PENKUM & JMS
                </span>
                <h3 className="text-sm font-bold text-white truncate mt-0.5">
                  {previewPhotoModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPhotoModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0B1120]">
              <img
                src={previewPhotoModal.url}
                alt={previewPhotoModal.title}
                className="w-full max-h-[70vh] object-contain"
              />
            </div>

            {previewPhotoModal.caption && (
              <p className="text-xs text-slate-300 mt-3 italic bg-[#0B1120] p-3 rounded-xl border border-slate-800">
                "{previewPhotoModal.caption}"
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
