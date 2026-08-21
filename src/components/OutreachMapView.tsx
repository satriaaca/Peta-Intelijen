import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  GraduationCap, 
  BookOpen, 
  Radio, 
  Scale, 
  MapPin, 
  Calendar, 
  Users, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Layers,
  X,
  Maximize2,
  Filter
} from 'lucide-react';
import { OutreachEntry, OutreachCategory } from '../types';
import { TABANAN_COORDINATES, TABANAN_KECAMATAN } from '../services/seedData';

interface OutreachMapViewProps {
  outreachEntries: OutreachEntry[];
  onSelectEdit?: (entry: OutreachEntry) => void;
  onOpenPhotoLightbox?: (photoUrl: string, caption?: string) => void;
}

export default function OutreachMapView({
  outreachEntries,
  onSelectEdit,
  onOpenPhotoLightbox,
}: OutreachMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedTriwulanFilter, setSelectedTriwulanFilter] = useState<number | 'ALL'>('ALL');
  const [selectedKecamatanFilter, setSelectedKecamatanFilter] = useState<string>('ALL');
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; caption?: string; title: string } | null>(null);

  // Helper to get coordinates for an entry
  const getCoordinates = (entry: OutreachEntry): [number, number] => {
    if (entry.latitude && entry.longitude) {
      return [entry.latitude, entry.longitude];
    }
    const defaultCoord = TABANAN_COORDINATES[entry.kecamatan] || { lat: -8.5385, lng: 115.1232 };
    // Add minor deterministic jitter to prevent exact overlapping markers in same kecamatan
    const hash = entry.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const jitterLat = ((hash % 10) - 5) * 0.003;
    const jitterLng = (((hash >> 2) % 10) - 5) * 0.003;
    return [defaultCoord.lat + jitterLat, defaultCoord.lng + jitterLng];
  };

  // Filter entries
  const filteredEntries = outreachEntries.filter((entry) => {
    if (selectedCategoryFilter !== 'ALL' && entry.jenis_kegiatan !== selectedCategoryFilter) return false;
    if (selectedStatusFilter !== 'ALL' && entry.status !== selectedStatusFilter) return false;
    if (selectedTriwulanFilter !== 'ALL' && entry.triwulan !== selectedTriwulanFilter) return false;
    if (selectedKecamatanFilter !== 'ALL' && entry.kecamatan !== selectedKecamatanFilter) return false;
    return true;
  });

  // Aggregated Stats
  const terlaksanaCount = outreachEntries.filter((e) => e.status === 'TERLAKSANA').length;
  const jmsCount = outreachEntries.filter((e) => e.jenis_kegiatan === 'Jaksa Masuk Sekolah (JMS)').length;
  const penkumCount = outreachEntries.filter((e) => e.jenis_kegiatan.includes('Penerangan') || e.jenis_kegiatan.includes('Penyuluhan')).length;
  const totalPeserta = outreachEntries.reduce((sum, e) => sum + (e.jumlah_peserta || 0), 0);
  const coveredKecamatan = new Set(outreachEntries.map((e) => e.kecamatan)).size;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of Tabanan Regency
      const map = L.map(mapContainerRef.current, {
        center: [-8.4800, 115.1200],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // CartoDB Voyager / Dark Matter tile layer (Clean high-contrast with dark base)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on component unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []);

  // Update Markers when entries or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const bounds: L.LatLngExpression[] = [];

    filteredEntries.forEach((entry) => {
      const [lat, lng] = getCoordinates(entry);
      bounds.push([lat, lng]);

      const isJMS = entry.jenis_kegiatan === 'Jaksa Masuk Sekolah (JMS)';
      const isRadio = entry.jenis_kegiatan === 'Jaksa Menyapa';
      const isExecuted = entry.status === 'TERLAKSANA';

      // Custom marker color and icon HTML
      const badgeBg = isJMS ? '#F59E0B' : isRadio ? '#8B5CF6' : '#0EA5E9';
      const iconSvg = isJMS
        ? `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`
        : isRadio
        ? `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;

      const statusDot = isExecuted
        ? `<span class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full shadow-sm"></span>`
        : `<span class="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-slate-900 rounded-full animate-pulse shadow-sm"></span>`;

      const customIcon = L.divIcon({
        className: 'custom-outreach-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-110">
            <div style="background-color: ${badgeBg};" class="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-black/40 border-2 border-white">
              ${iconSvg}
            </div>
            ${statusDot}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Build Rich HTML Popup
      const photoHtml = entry.photoUrl
        ? `
          <div class="relative w-full h-32 overflow-hidden rounded-t-xl bg-slate-900 cursor-pointer group" onclick="window.__viewOutreachPhoto('${entry.id}')">
            <img src="${entry.photoUrl}" alt="${entry.tema_kegiatan}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            <span class="absolute bottom-2 left-2 text-[10px] text-white font-medium bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md flex items-center gap-1">
              📷 ${entry.photoCaption || 'Foto Dokumentasi Kegiatan'}
            </span>
          </div>
        `
        : `
          <div class="h-2 bg-gradient-to-r from-amber-500 via-sky-500 to-emerald-500 rounded-t-xl"></div>
        `;

      const popupContent = `
        <div class="w-72 sm:w-80 text-slate-100 text-xs">
          ${photoHtml}
          <div class="p-3.5 space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md ${
                isJMS ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              }">
                ${entry.jenis_kegiatan}
              </span>
              <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md ${
                isExecuted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }">
                ${entry.status}
              </span>
            </div>

            <h4 class="font-bold text-white text-xs leading-snug">
              ${entry.tema_kegiatan}
            </h4>

            <div class="space-y-1 text-[11px] text-slate-300 pt-1 border-t border-slate-800">
              <div class="flex items-center gap-1.5">
                <span class="text-amber-400">📍</span>
                <span class="font-medium text-slate-100">${entry.tempat}</span>
                <span class="text-slate-400">(${entry.kecamatan})</span>
              </div>
              <div class="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>🗓️ ${entry.waktu}</span>
                <span class="text-amber-400 font-bold font-mono">👥 ${entry.jumlah_peserta} Peserta</span>
              </div>
              ${entry.narasumber ? `<div class="text-[10px] text-slate-400 truncate">🎤 Narsum: <span class="text-slate-200">${entry.narasumber}</span></div>` : ''}
              ${entry.materi_pokok ? `<div class="text-[10px] text-slate-400 line-clamp-2">📚 Materi: <span class="text-slate-300">${entry.materi_pokok}</span></div>` : ''}
            </div>

            <div class="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span class="font-mono text-[10px] text-slate-400">${entry.no}</span>
              ${entry.photoUrl ? `
                <button onclick="window.__viewOutreachPhoto('${entry.id}')" class="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] cursor-pointer">
                  Lihat Foto
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 320 });
      marker.on('click', () => {
        setActiveEntryId(entry.id);
      });

      markersGroup.addLayer(marker);
    });

    // Fit map to visible bounds if markers exist
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [filteredEntries]);

  // Global window handler for popup button clicks
  useEffect(() => {
    (window as any).__viewOutreachPhoto = (id: string) => {
      const entry = outreachEntries.find((e) => e.id === id);
      if (entry && entry.photoUrl) {
        if (onOpenPhotoLightbox) {
          onOpenPhotoLightbox(entry.photoUrl, entry.photoCaption || entry.tema_kegiatan);
        } else {
          setSelectedPhoto({
            url: entry.photoUrl,
            caption: entry.photoCaption,
            title: entry.tema_kegiatan,
          });
        }
      }
    };
    return () => {
      delete (window as any).__viewOutreachPhoto;
    };
  }, [outreachEntries, onOpenPhotoLightbox]);

  // Focus marker when card is clicked
  const handleFocusEntry = (entry: OutreachEntry) => {
    setActiveEntryId(entry.id);
    const map = mapInstanceRef.current;
    if (!map) return;
    const [lat, lng] = getCoordinates(entry);
    map.flyTo([lat, lng], 14, { duration: 1.2 });
  };

  return (
    <div className="space-y-4">
      {/* Top Statistical Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-[#151F33] border border-slate-800 p-3.5 rounded-2xl shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Kegiatan Terlaksana
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1 flex items-baseline gap-1.5">
            {terlaksanaCount}
            <span className="text-[11px] text-slate-400 font-sans font-normal">/ {outreachEntries.length} Giat</span>
          </div>
        </div>

        <div className="bg-[#151F33] border border-slate-800 p-3.5 rounded-2xl shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            JMS (Sekolah)
          </div>
          <div className="text-xl font-bold text-amber-400 font-mono mt-1">
            {jmsCount} <span className="text-[11px] text-slate-400 font-sans font-normal">Titik</span>
          </div>
        </div>

        <div className="bg-[#151F33] border border-slate-800 p-3.5 rounded-2xl shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            Penkum / Luhkum
          </div>
          <div className="text-xl font-bold text-sky-400 font-mono mt-1">
            {penkumCount} <span className="text-[11px] text-slate-400 font-sans font-normal">Titik</span>
          </div>
        </div>

        <div className="bg-[#151F33] border border-slate-800 p-3.5 rounded-2xl shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            Peserta Dijangkau
          </div>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {totalPeserta.toLocaleString()} <span className="text-[11px] text-slate-400 font-sans font-normal">Orang</span>
          </div>
        </div>

        <div className="bg-[#151F33] border border-slate-800 p-3.5 rounded-2xl shadow-xs col-span-2 sm:col-span-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            Kecamatan Terlayani
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            {coveredKecamatan} <span className="text-[11px] text-slate-400 font-sans font-normal">/ 10 Wilayah</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#151F33] border border-slate-800 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-400 text-[11px] flex items-center gap-1 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            Filter Peta:
          </span>

          {/* Jenis Kegiatan */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-[#0B1120] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Program</option>
            <option value="Jaksa Masuk Sekolah (JMS)">🎓 Jaksa Masuk Sekolah (JMS)</option>
            <option value="Penerangan Hukum">🏛️ Penerangan Hukum (Penkum)</option>
            <option value="Penyuluhan Hukum">⚖️ Penyuluhan Hukum (Luhkum)</option>
            <option value="Jaksa Menyapa">🎙️ Jaksa Menyapa (Radio)</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-[#0B1120] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="TERLAKSANA">🟢 Sudah Terlaksana</option>
            <option value="TERJADWAL">🟡 Terjadwal (Rencana)</option>
          </select>

          {/* Triwulan */}
          <select
            value={selectedTriwulanFilter}
            onChange={(e) => setSelectedTriwulanFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="bg-[#0B1120] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Triwulan (I–IV)</option>
            <option value={1}>Triwulan I</option>
            <option value={2}>Triwulan II</option>
            <option value={3}>Triwulan III</option>
            <option value={4}>Triwulan IV</option>
          </select>

          {/* Kecamatan */}
          <select
            value={selectedKecamatanFilter}
            onChange={(e) => setSelectedKecamatanFilter(e.target.value)}
            className="bg-[#0B1120] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Kecamatan</option>
            {TABANAN_KECAMATAN.map((kec) => (
              <option key={kec} value={kec}>
                Kec. {kec}
              </option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            JMS
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
            Penkum/Luhkum
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
            Jaksa Menyapa
          </span>
        </div>
      </div>

      {/* Interactive Map and Side Location List Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Map Container (8 cols on lg) */}
        <div className="lg:col-span-8 bg-[#151F33] border border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col relative">
          <div className="px-4 py-3 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Peta Sebaran Titik Pelaksanaan JMS & Penkum Kab. Tabanan</span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                {filteredEntries.length} Pin Aktif
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Klik pin lokasi untuk melihat detail & foto dokumentasi
            </div>
          </div>

          <div
            ref={mapContainerRef}
            className="w-full h-[460px] sm:h-[520px] z-10"
          />
        </div>

        {/* Side Cards List of Activities (4 cols on lg) */}
        <div className="lg:col-span-4 bg-[#151F33] border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col h-[580px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Daftar Lokasi Kegiatan ({filteredEntries.length})
            </h4>
            <span className="text-[10px] text-slate-400">Klik untuk zoom</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                Tidak ada titik kegiatan yang sesuai filter.
              </div>
            ) : (
              filteredEntries.map((item) => {
                const isActive = activeEntryId === item.id;
                const isJMS = item.jenis_kegiatan === 'Jaksa Masuk Sekolah (JMS)';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleFocusEntry(item)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/30'
                        : 'bg-[#0B1120]/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        isJMS ? 'bg-amber-500/20 text-amber-300' : 'bg-sky-500/20 text-sky-300'
                      }`}>
                        {item.jenis_kegiatan}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        item.status === 'TERLAKSANA' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <h5 className="font-bold text-white text-xs line-clamp-2 leading-snug mb-1.5">
                      {item.tema_kegiatan}
                    </h5>

                    {/* Thumbnail if present */}
                    {item.photoUrl && (
                      <div className="relative w-full h-24 rounded-lg overflow-hidden mb-2 bg-slate-900 border border-slate-800">
                        <img
                          src={item.photoUrl}
                          referrerPolicy="no-referrer"
                          alt={item.tema_kegiatan}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-1 right-1 bg-black/60 px-1.5 py-0.5 rounded text-[9px] text-white flex items-center gap-1">
                          <Eye className="w-2.5 h-2.5" /> Foto
                        </div>
                      </div>
                    )}

                    <div className="space-y-1 text-[11px] text-slate-300 pt-1 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{item.tempat} ({item.kecamatan})</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>🗓️ {item.waktu}</span>
                        <span className="text-amber-400 font-semibold">👥 {item.jumlah_peserta} Peserta</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151F33] border border-slate-700 rounded-2xl p-5 max-w-2xl w-full text-slate-100 shadow-2xl relative">
            <div className="flex justify-between items-center mb-3">
              <div className="min-w-0 pr-4">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block font-mono">
                  DOKUMENTASI FOTO KEGIATAN PENKUM & JMS
                </span>
                <h3 className="text-xs font-bold text-white truncate mt-0.5">
                  {selectedPhoto.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0B1120]">
              <img
                src={selectedPhoto.url}
                referrerPolicy="no-referrer"
                alt={selectedPhoto.title}
                className="w-full max-h-[65vh] object-contain"
              />
            </div>

            {selectedPhoto.caption && (
              <p className="text-xs text-slate-300 mt-3 italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                "{selectedPhoto.caption}"
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
