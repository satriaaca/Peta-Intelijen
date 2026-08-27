import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  ShieldAlert, 
  MapPin, 
  Calendar, 
  Search, 
  Filter, 
  Eye, 
  Layers, 
  Maximize2, 
  Minimize2,
  X, 
  Plus, 
  Navigation,
  Sparkles,
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Compass, 
  Printer, 
  Globe, 
  Landmark, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Tag,
  Upload,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { IntelligenceEntry, SectionId } from '../types';
import { SECTIONS_CONFIG, TABANAN_KECAMATAN } from '../services/seedData';
import { TABANAN_GEO_DATABASE, searchTabananLocations, TabananGeoPoint } from '../services/tabananGeo';
import { 
  createOfficialSymbolIcon, 
  TABANAN_STRATEGIC_74_LANDMARKS, 
  StrategicLandmarkPoint,
  getSubsectorSymbolsInKecamatan,
  getSymbolSvgPath
} from '../services/mapSymbolRenderer';
import { 
  OFFICIAL_SECTOR_SYMBOLS, 
  OfficialSubsectorSymbol, 
  findSubsectorSymbol 
} from '../services/officialDinData';
import IntelligenceMapPrintModal from './IntelligenceMapPrintModal';

interface IntelligenceMapViewProps {
  entries: IntelligenceEntry[];
  onNavigateToForm?: (sectionId?: SectionId) => void;
  onViewDetail: (entry: IntelligenceEntry) => void;
  onSaveEntry?: (entry: IntelligenceEntry) => Promise<void>;
  onImportEntries?: (entries: IntelligenceEntry[]) => Promise<void>;
  onOpenCatalogModal?: () => void;
  onAddNewEntry?: (loc?: string, lat?: number, lng?: number) => void;
}

type BaseMapStyle = 'voyager' | 'satellite' | 'dark' | 'topo';

// Centroids for 10 Kecamatan in Tabanan for smooth FlyTo
const KECAMATAN_CENTROIDS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'Tabanan': { lat: -8.5398, lng: 115.1265, zoom: 13 },
  'Kediri': { lat: -8.5750, lng: 115.1220, zoom: 13 },
  'Baturiti': { lat: -8.2815, lng: 115.1652, zoom: 13 },
  'Penebel': { lat: -8.3688, lng: 115.1245, zoom: 13 },
  'Marga': { lat: -8.4552, lng: 115.1782, zoom: 13 },
  'Pupuan': { lat: -8.3540, lng: 115.0125, zoom: 13 },
  'Kerambitan': { lat: -8.5520, lng: 115.0780, zoom: 13 },
  'Selemadeg': { lat: -8.5025, lng: 115.0245, zoom: 13 },
  'Selemadeg Barat': { lat: -8.4820, lng: 114.9650, zoom: 13 },
  'Selemadeg Timur': { lat: -8.5350, lng: 115.0620, zoom: 13 },
  'Semua': { lat: -8.4450, lng: 115.0850, zoom: 11 }
};

export default function IntelligenceMapView({
  entries,
  onNavigateToForm,
  onViewDetail,
  onSaveEntry,
  onImportEntries
}: IntelligenceMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const landmarkMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const searchMarkerRef = useRef<L.CircleMarker | null>(null);

  // Layout & View Modes
  const [isExpandedFullWidth, setIsExpandedFullWidth] = useState<boolean>(false);
  const [isFilterOnlyFullscreen, setIsFilterOnlyFullscreen] = useState<boolean>(false);
  const [baseMapStyle, setBaseMapStyle] = useState<BaseMapStyle>('voyager');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showSymbolCatalogBar, setShowSymbolCatalogBar] = useState<boolean>(false);
  const [includeStrategicLandmarks, setIncludeStrategicLandmarks] = useState<boolean>(true);

  // CSV Import State
  const [showCsvModal, setShowCsvModal] = useState<boolean>(false);
  const [csvText, setCsvText] = useState<string>('');
  const [csvError, setCsvError] = useState<string | null>(null);
  const [csvSuccessMessage, setCsvSuccessMessage] = useState<string | null>(null);

  // Filters State
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('Semua');
  const [selectedSymbolBadge, setSelectedSymbolBadge] = useState<string>('ALL');
  const [selectedClassification, setSelectedClassification] = useState<string>('ALL');
  const [symbolSearchQuery, setSymbolSearchQuery] = useState<string>('');

  // Location Search State
  const [searchLocationQuery, setSearchLocationQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<TabananGeoPoint[]>([]);
  const [activeSearchedPoint, setActiveSearchedPoint] = useState<TabananGeoPoint | null>(null);

  // Selected entry or landmark for side inspection panel
  const [activeEntry, setActiveEntry] = useState<IntelligenceEntry | null>(null);
  const [activeLandmark, setActiveLandmark] = useState<StrategicLandmarkPoint | null>(null);

  // Auto geocode helper for CSV
  const resolveCoordinatesForLocation = (location: string, kecamatan: string): { lat: number; lng: number } => {
    // Try finding specific location in tabanan geo db
    const foundPoint = TABANAN_GEO_DATABASE.find(
      p => p.name.toLowerCase().includes(location.toLowerCase()) || 
           location.toLowerCase().includes(p.name.toLowerCase())
    );
    if (foundPoint) {
      return { lat: foundPoint.lat, lng: foundPoint.lng };
    }
    // Try centroid of kecamatan
    const kecKey = Object.keys(KECAMATAN_CENTROIDS).find(
      k => k.toLowerCase() === kecamatan.toLowerCase() || location.toLowerCase().includes(k.toLowerCase())
    );
    if (kecKey && KECAMATAN_CENTROIDS[kecKey]) {
      return { lat: KECAMATAN_CENTROIDS[kecKey].lat, lng: KECAMATAN_CENTROIDS[kecKey].lng };
    }
    // Default to Tabanan Central
    return { lat: -8.5385, lng: 115.1232 };
  };

  const handleProcessCsvImport = async () => {
    setCsvError(null);
    setCsvSuccessMessage(null);
    if (!csvText.trim()) {
      setCsvError('Silakan pilih file CSV atau tempelkan data teks CSV.');
      return;
    }

    try {
      const lines = csvText.trim().split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length <= 1) {
        setCsvError('Data CSV harus memiliki baris header dan minimal satu baris data.');
        return;
      }

      const header = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
      const newEntries: IntelligenceEntry[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values: string[] = [];
        let inQuote = false;
        let curr = '';
        for (const char of lines[i]) {
          if (char === '"' || char === "'") {
            inQuote = !inQuote;
          } else if (char === ',' && !inQuote) {
            values.push(curr.trim().replace(/^["']|["']$/g, ''));
            curr = '';
          } else {
            curr += char;
          }
        }
        values.push(curr.trim().replace(/^["']|["']$/g, ''));

        const getCol = (name: string): string => {
          const idx = header.indexOf(name.toLowerCase());
          return idx !== -1 && values[idx] ? values[idx] : '';
        };

        const sectionVal = (getCol('section') || 'D.IN.2').toUpperCase() as SectionId;
        const locationVal = getCol('location') || getCol('lokasi') || 'Tabanan';
        const kecamatanVal = getCol('kecamatan') || 'Tabanan';

        let lat = parseFloat(getCol('latitude') || getCol('lat') || '0');
        let lng = parseFloat(getCol('longitude') || getCol('lng') || '0');

        if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
          const resolved = resolveCoordinatesForLocation(locationVal, kecamatanVal);
          lat = resolved.lat;
          lng = resolved.lng;
        }

        const entry: IntelligenceEntry = {
          id: `din-csv-${Date.now()}-${i}`,
          no: getCol('no') || getCol('nomor') || `REG-${String(i).padStart(2, '0')}/${sectionVal}/TAB/2026`,
          section: sectionVal,
          sektor_symbol: getCol('sektor_symbol') || getCol('symbol') || 'PEMILU',
          keterangan: getCol('keterangan') || getCol('judul') || 'Laporan Sektor Intelijen',
          narrative: getCol('narrative') || getCol('narasi') || getCol('uraian') || 'Bahwa telah dilaksanakan pemantauan intelijen...',
          date: getCol('date') || getCol('tanggal') || new Date().toISOString().slice(0, 10),
          location: locationVal,
          kecamatan: kecamatanVal,
          latitude: lat,
          longitude: lng,
          classification: (getCol('classification') || getCol('klasifikasi') || 'TERBATAS').toUpperCase() as any,
          officerName: getCol('officername') || getCol('petugas') || 'Satgas Intelijen Tabanan',
          createdAt: Date.now(),
          updatedAt: Date.now()
        };

        newEntries.push(entry);
      }

      if (onImportEntries) {
        await onImportEntries(newEntries);
      } else if (onSaveEntry) {
        for (const e of newEntries) {
          await onSaveEntry(e);
        }
      }

      setCsvSuccessMessage(`Berhasil mengimpor ${newEntries.length} data peta intelijen dengan auto-geocoding koordinat.`);
      setTimeout(() => {
        setShowCsvModal(false);
        setCsvText('');
        setCsvSuccessMessage(null);
      }, 1500);
    } catch (err: any) {
      setCsvError(`Gagal memproses data CSV: ${err?.message || 'Format tidak valid'}`);
    }
  };

  const handleDownloadCsvTemplate = () => {
    const template = `no,section,sektor_symbol,keterangan,narrative,date,location,kecamatan,latitude,longitude,classification,officerName
REG-01/D.IN.2/2026,D.IN.2,PEMILU,"Partai Politik & Pilkada Tabanan","Bahwa pada hari ini telah dilakukan pemantauan situasi politik di wilayah Kediri...",2026-03-10,"Kediri","Kediri",-8.5750,115.1220,TERBATAS,"I Putu Arya, S.H."
REG-02/D.IN.3/2026,D.IN.3,PAKEM,"Rakor Kerukunan Umat & Aliran Kepercayaan","Bahwa telah diselenggarakan rakor pengawasan aliran kepercayaan di Baturiti...",2026-03-11,"Candikuning","Baturiti",-8.2750,115.1620,TERBATAS,"I Wayan Sujana, S.H."
REG-03/D.IN.4/2026,D.IN.4,MAFIA_TANAH,"Pengawasan Sengketa Lahan Pertanian Subak","Bahwa diperoleh informasi adanya sengketa hak milik tanah sawah lestari di Penebel...",2026-03-12,"Penebel","Penebel",-8.3688,115.1245,RAHASIA,"Tim Intelijen Kejari"
REG-04/D.IN.5/2026,D.IN.5,INFRASTRUKTUR,"Pengamanan Proyek Pembangunan Jembatan & Irigasi","Bahwa Tim PPS telah melakukan peninjauan progres fisik pembangunan infrastruktur...",2026-03-13,"Bajera","Selemadeg",-8.5025,115.0245,BIASA,"Kasi Intelijen"`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_peta_din_tabanan.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        setCsvText(content);
      }
    };
    reader.readAsText(file);
  };

  // Coordinates helper with deterministic spread for entries without manual lat/lng
  const getCoordinates = (entry: IntelligenceEntry): [number, number] => {
    if (entry.latitude && entry.longitude) {
      return [entry.latitude, entry.longitude];
    }
    const kecPoint = TABANAN_GEO_DATABASE.find(
      (p) => p.kecamatan.toLowerCase() === entry.kecamatan.toLowerCase() && p.type === 'desa'
    ) || TABANAN_GEO_DATABASE[0];

    const hash = (entry.id || entry.no).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const jitterLat = ((hash % 11) - 5) * 0.0035;
    const jitterLng = (((hash >> 2) % 11) - 5) * 0.0035;
    return [kecPoint.lat + jitterLat, kecPoint.lng + jitterLng];
  };

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (selectedSection !== 'ALL' && entry.section !== selectedSection) return false;
      if (selectedKecamatan !== 'Semua' && !entry.kecamatan.toLowerCase().includes(selectedKecamatan.toLowerCase())) return false;
      if (selectedClassification !== 'ALL' && entry.classification !== selectedClassification) return false;
      if (selectedSymbolBadge !== 'ALL') {
        const sym = findSubsectorSymbol(entry.sektor_symbol || entry.keterangan || entry.section || '');
        if (!sym || sym.badgeCode !== selectedSymbolBadge) return false;
      }
      return true;
    });
  }, [entries, selectedSection, selectedKecamatan, selectedClassification, selectedSymbolBadge]);

  // Filtered Strategic Landmarks
  const filteredLandmarks = useMemo(() => {
    if (!includeStrategicLandmarks) return [];
    return TABANAN_STRATEGIC_74_LANDMARKS.filter((lm) => {
      if (selectedKecamatan !== 'Semua' && lm.kecamatan.toLowerCase() !== selectedKecamatan.toLowerCase()) return false;
      const sym = findSubsectorSymbol(lm.symbolBadgeCode);
      if (selectedSection !== 'ALL' && sym?.sectionCode !== selectedSection) return false;
      if (selectedSymbolBadge !== 'ALL' && sym?.badgeCode !== selectedSymbolBadge) return false;
      return true;
    });
  }, [includeStrategicLandmarks, selectedKecamatan, selectedSection, selectedSymbolBadge]);

  // Dynamic 74 Symbols computed for the current selected Kecamatan
  const kecamatanActiveSymbols = useMemo(() => {
    return getSubsectorSymbolsInKecamatan(selectedKecamatan, entries);
  }, [selectedKecamatan, entries]);

  // All 74 symbols flattened list for catalog filter
  const all74SymbolsList = useMemo(() => {
    const list: OfficialSubsectorSymbol[] = [];
    Object.values(OFFICIAL_SECTOR_SYMBOLS).forEach((secList) => {
      list.push(...secList);
    });
    if (symbolSearchQuery.trim()) {
      const q = symbolSearchQuery.toLowerCase();
      return list.filter(
        (s) => s.name.toLowerCase().includes(q) || s.badgeCode.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [symbolSearchQuery]);

  // Handle Tile Layer Change
  const updateTileLayer = (style: BaseMapStyle) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    let url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let attribution = '&copy; CARTO &copy; OpenStreetMap';

    if (style === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    } else if (style === 'dark') {
      url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; CARTO &copy; OpenStreetMap';
    } else if (style === 'topo') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = 'Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap';
    }

    const layer = L.tileLayer(url, {
      attribution,
      subdomains: style === 'topo' ? 'abc' : 'abcd',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = layer;
    setBaseMapStyle(style);
  };

  // Fly to Kecamatan centroid
  const handleSelectKecamatan = (kecName: string) => {
    setSelectedKecamatan(kecName);
    const map = mapInstanceRef.current;
    if (map) {
      const target = KECAMATAN_CENTROIDS[kecName] || KECAMATAN_CENTROIDS['Semua'];
      map.flyTo([target.lat, target.lng], target.zoom, { duration: 1.2 });
    }
  };

  // Handle location search typing
  const handleSearchChange = (query: string) => {
    setSearchLocationQuery(query);
    if (query.trim().length > 1) {
      const results = searchTabananLocations(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Fly to location when a search result is clicked
  const handleSelectLocation = (point: TabananGeoPoint) => {
    setActiveSearchedPoint(point);
    setSearchLocationQuery(point.name);
    setSearchResults([]);

    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([point.lat, point.lng], 14, { duration: 1.2 });

      if (searchMarkerRef.current) {
        searchMarkerRef.current.remove();
      }
      const marker = L.circleMarker([point.lat, point.lng], {
        radius: 22,
        color: '#F59E0B',
        fillColor: '#F59E0B',
        fillOpacity: 0.25,
        weight: 2,
        dashArray: '4, 4',
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #1e293b; padding: 4px;">
          <strong style="color: #0f172a; font-size: 13px;">📍 ${point.name}</strong><br/>
          <span style="color: #64748b;">Kecamatan ${point.kecamatan}</span><br/>
          <div style="margin-top: 4px; font-size: 11px; color: #475569;">${point.description || ''}</div>
        </div>
      `).openPopup();

      searchMarkerRef.current = marker;
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-8.4450, 115.0850], // Centered in Tabanan Regency
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Default Base Tile Layer (CartoDB Voyager)
      const layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO &copy; OpenStreetMap',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = layer;

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;

      const landmarkGroup = L.layerGroup().addTo(map);
      landmarkMarkersLayerRef.current = landmarkGroup;

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        landmarkMarkersLayerRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, []);

  // Invalidate map size on expand toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [isExpandedFullWidth]);

  // Render Markers (Intelligence Entries + Strategic 74 Landmarks)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    const landmarkGroup = landmarkMarkersLayerRef.current;
    if (!map || !markersGroup || !landmarkGroup) return;

    markersGroup.clearLayers();
    landmarkGroup.clearLayers();

    const bounds: L.LatLngExpression[] = [];

    // 1. Render Intelligence Entries Markers with 74 Symbols
    filteredEntries.forEach((entry) => {
      const [lat, lng] = getCoordinates(entry);
      bounds.push([lat, lng]);

      const sym = findSubsectorSymbol(entry.sektor_symbol || entry.keterangan || entry.section || '');
      const themeColor = sym?.themeColor || '#F59E0B';
      const isSelected = activeEntry?.id === entry.id;

      const customIcon = createOfficialSymbolIcon(
        entry.sektor_symbol || entry.keterangan || entry.section,
        {
          classification: entry.classification || 'TERBATAS',
          isSelected,
        }
      );

      const marker = L.marker([lat, lng], { icon: customIcon });

      const isRahasia = entry.classification === 'RAHASIA';
      const isTerbatas = entry.classification === 'TERBATAS';

      // Rich Interactive Popup Content
      const popupHtml = `
        <div style="font-family: sans-serif; font-size: 12px; color: #1e293b; min-width: 250px; max-width: 290px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 6px;">
            <span style="font-family: monospace; font-weight: bold; color: ${themeColor}; font-size: 11px; background: #0f172a; padding: 2px 6px; border-radius: 4px;">
              ${sym ? `${sym.sectionCode} #${sym.no}` : entry.section} • ${entry.no}
            </span>
            <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; ${
              isRahasia ? 'background: #fee2e2; color: #991b1b;' : isTerbatas ? 'background: #fef3c7; color: #92400e;' : 'background: #dcfce7; color: #166534;'
            }">
              ${entry.classification || 'TERBATAS'}
            </span>
          </div>

          <div style="font-weight: bold; color: #0f172a; font-size: 13px; line-height: 1.3; margin-bottom: 3px;">
            ${sym?.name || entry.keterangan}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            📍 <b>${entry.location}</b> (${entry.kecamatan})
          </div>

          <div style="font-size: 11px; color: #334155; line-height: 1.4; background: #f8fafc; padding: 6px 8px; border-radius: 6px; margin-bottom: 8px; border: 1px solid #e2e8f0;">
            "${(entry.narrative || entry.keterangan || '').slice(0, 130)}..."
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 4px;">
            <span>📅 ${entry.date}</span>
            <span style="font-weight: bold; color: #0284c7;">Petugas: ${entry.officerName ? entry.officerName.split(' ')[0] : 'Satgas'}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        setActiveEntry(entry);
        setActiveLandmark(null);
      });

      markersGroup.addLayer(marker);
    });

    // 2. Render Strategic 74 Landmarks Markers
    filteredLandmarks.forEach((lm) => {
      bounds.push([lm.lat, lm.lng]);
      const sym = findSubsectorSymbol(lm.symbolBadgeCode);
      const isSelected = activeLandmark?.id === lm.id;

      const landmarkIcon = createOfficialSymbolIcon(lm.symbolBadgeCode, {
        isStrategicLandmark: true,
        isSelected,
      });

      const marker = L.marker([lm.lat, lm.lng], { icon: landmarkIcon });

      const popupHtml = `
        <div style="font-family: sans-serif; font-size: 12px; color: #1e293b; min-width: 250px; max-width: 290px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 6px;">
            <span style="font-family: monospace; font-weight: bold; color: #0284C7; font-size: 11px; background: #0f172a; padding: 2px 6px; border-radius: 4px;">
              ${sym ? `${sym.sectionCode} #${sym.no}` : 'OBVIT'} • LANDMARK
            </span>
            <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: #e0f2fe; color: #0369a1;">
              ${lm.importance}
            </span>
          </div>

          <div style="font-weight: bold; color: #0f172a; font-size: 13px; line-height: 1.3; margin-bottom: 3px;">
            ${lm.name}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            📍 Kecamatan ${lm.kecamatan} • <span style="color: #0284c7; font-weight: 600;">${sym?.name || lm.category}</span>
          </div>

          <div style="font-size: 11px; color: #334155; line-height: 1.4; background: #f0f9ff; padding: 6px 8px; border-radius: 6px; margin-bottom: 6px; border: 1px solid #bae6fd;">
            ${lm.description}
          </div>

          <div style="font-size: 10px; color: #94a3b8; font-mono;">
            Koordinat: ${lm.lat.toFixed(4)}, ${lm.lng.toFixed(4)}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        setActiveLandmark(lm);
        setActiveEntry(null);
      });

      landmarkGroup.addLayer(marker);
    });

    // Auto fit bounds if user is viewing all and markers exist
    if (bounds.length > 0 && selectedKecamatan === 'Semua' && !activeSearchedPoint && selectedSymbolBadge === 'ALL') {
      try {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      } catch (e) {
        // ignore
      }
    }
  }, [filteredEntries, filteredLandmarks, activeEntry, activeLandmark, selectedKecamatan, activeSearchedPoint, selectedSymbolBadge]);

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Header Toolbar & Quick Stats */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              SISTEM GIS INTELIJEN YUSTISIAL (D.IN.1)
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              74 SIMBOL KEP-135/2019
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {filteredEntries.length} Laporan • {filteredLandmarks.length} Objek Vital
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Peta Geospasial Situasi Intelijen Tabanan</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Integrasi visualisasi 74 simbol intelijen Kejaksaan RI, pemantauan wilayah per-kecamatan, objek vital strategis, dan pencetakan peta resmi yustisial.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* CSV Import Button */}
          <button
            type="button"
            onClick={() => setShowCsvModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:border-emerald-400"
            title="Import data titik peta intelijen dari file CSV dengan auto-geocoding lokasi (Kediri, Baturiti, dll)"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Import CSV</span>
          </button>

          {/* Full Screen Filter-Only Mode */}
          <button
            type="button"
            onClick={() => setIsFilterOnlyFullscreen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 border border-sky-500/40 text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:border-sky-400"
            title="Buka peta layar penuh bersih dengan hanya filter terapung"
          >
            <Maximize2 className="w-4 h-4 text-sky-400" />
            <span>Layar Penuh (Filter Saja)</span>
          </button>

          {/* Print Map Button */}
          <button
            type="button"
            onClick={() => setShowPrintModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:border-amber-400"
            title="Cetak format peta resmi KEP-135 untuk laporan pimpinan"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Peta</span>
          </button>

          {/* Toggle 74 Symbol Catalog Drawer */}
          <button
            type="button"
            onClick={() => setShowSymbolCatalogBar(!showSymbolCatalogBar)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              showSymbolCatalogBar
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Katalog 74 Simbol {showSymbolCatalogBar ? <ChevronUp className="w-3.5 h-3.5 inline" /> : <ChevronDown className="w-3.5 h-3.5 inline" />}</span>
          </button>

          {/* Input New Entry Button */}
          <button
            type="button"
            onClick={() => onNavigateToForm('D.IN.1')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Input Laporan D.IN</span>
          </button>
        </div>
      </div>

      {/* 2. Collapsible 74 Symbols Filter & Catalog Bar */}
      {showSymbolCatalogBar && (
        <div className="bg-[#111827] border border-amber-500/30 rounded-2xl p-4 shadow-2xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Filter & Jelajah 74 Simbol Intelijen (Lampiran IV KEP-135/A/JA/05/2019)
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {selectedSymbolBadge !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setSelectedSymbolBadge('ALL')}
                  className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold hover:bg-red-500/30 transition-colors"
                >
                  Reset Filter Simbol (Aktif: {selectedSymbolBadge})
                </button>
              )}
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={symbolSearchQuery}
                  onChange={(e) => setSymbolSearchQuery(e.target.value)}
                  placeholder="Cari simbol: pariwisata, agraria, pakem..."
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Symbol Chips Grid */}
          <div className="max-h-52 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {all74SymbolsList.map((sym) => {
              const isSelected = selectedSymbolBadge === sym.badgeCode;
              return (
                <button
                  key={sym.id}
                  type="button"
                  onClick={() => setSelectedSymbolBadge(isSelected ? 'ALL' : sym.badgeCode)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold shadow-lg'
                      : 'bg-[#0B1120] border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div
                    className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center border font-mono font-black text-[10px]"
                    style={{
                      borderColor: sym.themeColor,
                      backgroundColor: `${sym.themeColor}20`,
                      color: isSelected ? '#0f172a' : sym.themeColor,
                    }}
                  >
                    {sym.sectionCode.replace('D.IN.', '')}.{sym.no}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold truncate leading-tight">{sym.name}</div>
                    <div className={`text-[9px] font-mono truncate ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                      {sym.sectionCode} • {sym.badgeCode}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. 10 Kecamatan Quick Selector Bar & Symbol Presence */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            Pilih Wilayah Kecamatan (Fokus Peta):
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {selectedKecamatan === 'Semua' ? '10 Kecamatan Terpeta' : `Kecamatan ${selectedKecamatan}`}
          </span>
        </div>

        {/* Kecamatan Buttons Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => handleSelectKecamatan('Semua')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedKecamatan === 'Semua'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-[#0B1120] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            <span>Seluruh Tabanan</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-900 text-amber-400">
              {entries.length + TABANAN_STRATEGIC_74_LANDMARKS.length}
            </span>
          </button>

          {TABANAN_KECAMATAN.map((kec) => {
            const isSelected = selectedKecamatan.toLowerCase() === kec.toLowerCase();
            const countEntries = entries.filter((e) => e.kecamatan.toLowerCase().includes(kec.toLowerCase())).length;
            const countLandmarks = TABANAN_STRATEGIC_74_LANDMARKS.filter((l) => l.kecamatan.toLowerCase() === kec.toLowerCase()).length;
            const total = countEntries + countLandmarks;

            return (
              <button
                key={kec}
                type="button"
                onClick={() => handleSelectKecamatan(kec)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md'
                    : 'bg-[#0B1120] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <MapPin className={`w-3 h-3 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{kec}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-900 text-slate-300'}`}>
                  {total}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic 74 Symbols in Selected Kecamatan HUD */}
        <div className="pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              Simbol Aktif di {selectedKecamatan === 'Semua' ? 'Tabanan' : kecKecamatan(selectedKecamatan)}:
            </span>

            {kecamatanActiveSymbols.length === 0 ? (
              <span className="text-slate-500 text-xs italic">Belum ada simbol yang dipetakan</span>
            ) : (
              kecamatanActiveSymbols.slice(0, 8).map(({ symbol, count }) => {
                const isFiltered = selectedSymbolBadge === symbol.badgeCode;
                return (
                  <button
                    key={symbol.id}
                    type="button"
                    onClick={() => setSelectedSymbolBadge(isFiltered ? 'ALL' : symbol.badgeCode)}
                    className={`px-2 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isFiltered
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow'
                        : 'bg-[#0B1120] border-slate-700 text-slate-200 hover:border-amber-500/60'
                    }`}
                    title={`${symbol.name} (${symbol.sectionCode}) - Klik untuk filter`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: symbol.themeColor }}
                    />
                    <span className="font-mono text-[10px] font-bold">
                      {symbol.sectionCode.replace('D.IN.', '')}.{symbol.no}
                    </span>
                    <span className="truncate max-w-[120px]">{symbol.name}</span>
                    <span className="font-mono text-[10px] opacity-75 font-bold">({count})</span>
                  </button>
                );
              })
            )}

            {kecamatanActiveSymbols.length > 8 && (
              <span className="text-[11px] font-mono text-slate-400">
                +{kecamatanActiveSymbols.length - 8} simbol lainnya
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-300">
              <input
                type="checkbox"
                checked={includeStrategicLandmarks}
                onChange={(e) => setIncludeStrategicLandmarks(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500"
              />
              <span>Tampilkan 74 Objek Vital & Landmark</span>
            </label>
          </div>
        </div>
      </div>

      {/* 4. Filter & Search Controls Bar */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Section Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Sektor:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="bg-[#0B1120] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">Semua Sektor D.IN (1–6)</option>
              {SECTIONS_CONFIG.filter((s) => s.id !== 'D.IN.7').map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.shortName}
                </option>
              ))}
            </select>
          </div>

          {/* Classification Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Klasifikasi:</span>
            <select
              value={selectedClassification}
              onChange={(e) => setSelectedClassification(e.target.value)}
              className="bg-[#0B1120] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">Semua Klasifikasi</option>
              <option value="RAHASIA">RAHASIA</option>
              <option value="TERBATAS">TERBATAS</option>
              <option value="BIASA">BIASA</option>
            </select>
          </div>

          {/* Active Symbol Filter Indicator if any */}
          {selectedSymbolBadge !== 'ALL' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs">
              <span className="font-bold">Simbol: {selectedSymbolBadge}</span>
              <button
                type="button"
                onClick={() => setSelectedSymbolBadge('ALL')}
                className="hover:text-white ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Location Search Bar in Filter Row */}
        <div className="w-full sm:w-80 relative">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-amber-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchLocationQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari desa/lokasi: Dajan Peken, Candikuning..."
              className="w-full bg-[#0B1120] border border-slate-700 hover:border-slate-600 focus:border-amber-500 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
            />
            {searchLocationQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchLocationQuery('');
                  setSearchResults([]);
                  setActiveSearchedPoint(null);
                  if (searchMarkerRef.current) {
                    searchMarkerRef.current.remove();
                    searchMarkerRef.current = null;
                  }
                }}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute z-50 mt-1.5 w-full bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-800">
              <div className="p-2 text-[11px] font-bold text-amber-400 bg-slate-900 flex items-center justify-between">
                <span>Hasil Pencarian Wilayah ({searchResults.length})</span>
                <span className="text-[10px] text-slate-400 font-normal">Klik untuk lompat</span>
              </div>
              <div className="max-h-56 overflow-y-auto">
                {searchResults.map((point, idx) => (
                  <button
                    key={`${point.name}-${idx}`}
                    type="button"
                    onClick={() => handleSelectLocation(point)}
                    className="w-full px-3 py-2 text-left hover:bg-amber-500/10 flex items-center justify-between gap-2 transition-colors cursor-pointer group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {point.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Kecamatan {point.kecamatan} • <span className="text-slate-500 italic">{point.type}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {point.lat.toFixed(3)}, {point.lng.toFixed(3)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. MAIN MAP CANVAS & INTERACTIVE INSPECTION PANEL */}
      <div className={`grid gap-5 transition-all ${isExpandedFullWidth ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
        
        {/* Map Container Area */}
        <div className={`${isExpandedFullWidth ? 'col-span-1' : 'lg:col-span-8'} bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col`}>
          
          {/* Map Top Status & Control Bar */}
          <div className="px-4 py-2.5 bg-[#0B1120] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-bold text-white">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>Peta Intelijen Geospasial</span>
                <span className="font-mono text-amber-400 text-[11px]">[{selectedKecamatan}]</span>
              </span>

              {/* Base Map Switcher */}
              <div className="hidden sm:inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
                <button
                  type="button"
                  onClick={() => updateTileLayer('voyager')}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    baseMapStyle === 'voyager' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Jalan
                </button>
                <button
                  type="button"
                  onClick={() => updateTileLayer('satellite')}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    baseMapStyle === 'satellite' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Satelit
                </button>
                <button
                  type="button"
                  onClick={() => updateTileLayer('dark')}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    baseMapStyle === 'dark' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Taktis Gelap
                </button>
                <button
                  type="button"
                  onClick={() => updateTileLayer('topo')}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    baseMapStyle === 'topo' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Topografi
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelectKecamatan('Semua')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
                title="Reset zoom ke seluruh Kabupaten Tabanan"
              >
                Fokus Seluruh Tabanan
              </button>

              {/* Fullscreen / Full-Width Expand Toggle */}
              <button
                type="button"
                onClick={() => setIsExpandedFullWidth(!isExpandedFullWidth)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title={isExpandedFullWidth ? 'Kembalikan Tampilan Split Panel' : 'Perluas Peta (Layar Penuh / Lebar)'}
              >
                {isExpandedFullWidth ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Leaflet Map Stage Container (High & Spacious) */}
          <div 
            ref={mapContainerRef} 
            className={`w-full z-10 transition-all ${
              isExpandedFullWidth ? 'h-[780px] lg:h-[840px]' : 'h-[640px] sm:h-[700px] lg:h-[760px]'
            }`}
            style={{ background: '#0B1120' }}
          />

          {/* Map Footer Info / Legend Summary */}
          <div className="p-3 bg-[#0B1120] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
              <span className="font-bold text-slate-400">Klasifikasi Pin:</span>
              <span className="flex items-center gap-1.5 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-sm" /> RAHASIA
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-sm" /> TERBATAS
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block shadow-sm" /> OBVIT / LANDMARK
              </span>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Menampilkan {filteredEntries.length} Laporan D.IN & {filteredLandmarks.length} Objek Vital
            </div>
          </div>
        </div>

        {/* Side Panel: Selected Entry Inspection or Active Feed (4 cols on lg, or collapsible drawer when expanded) */}
        <div className={`${isExpandedFullWidth ? 'col-span-1' : 'lg:col-span-4'} flex flex-col gap-4`}>
          {activeEntry ? (
            <div className="bg-[#111827] border border-amber-500/50 rounded-2xl p-5 shadow-2xl flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      {activeEntry.section}
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-200">
                      {activeEntry.no}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveEntry(null)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {/* Symbol Badge Highlight */}
                  {(() => {
                    const sym = findSubsectorSymbol(activeEntry.sektor_symbol || activeEntry.keterangan || activeEntry.section || '');
                    return (
                      <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800 flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl border flex items-center justify-center font-mono font-black text-xs shrink-0"
                          style={{
                            borderColor: sym?.themeColor || '#F59E0B',
                            backgroundColor: `${sym?.themeColor || '#F59E0B'}15`,
                            color: sym?.themeColor || '#F59E0B',
                          }}
                        >
                          {sym ? `${sym.sectionCode.replace('D.IN.', '')}.${sym.no}` : activeEntry.section.replace('D.IN.', '')}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">
                            {sym?.name || activeEntry.keterangan}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {sym?.category || activeEntry.section} • {sym?.badgeCode || activeEntry.sektor_symbol || '-'}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Klasifikasi Keamanan:</span>
                      <span
                        className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded border ${
                          activeEntry.classification === 'RAHASIA'
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : activeEntry.classification === 'TERBATAS'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {activeEntry.classification || 'TERBATAS'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Lokasi / Desa:</span>
                      <span className="font-semibold text-amber-400 text-right">{activeEntry.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Kecamatan:</span>
                      <span className="font-semibold">{activeEntry.kecamatan}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Tanggal:</span>
                      <span className="font-mono">{activeEntry.date}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Petugas Intelijen:</span>
                      <span className="font-semibold">{activeEntry.officerName || 'Satgas Intelijen'}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Uraian Fakta 5W+1H</span>
                    <div className="mt-1 p-3 rounded-xl bg-[#0B1120] border border-slate-800 text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto italic">
                      "{activeEntry.narrative}"
                    </div>
                  </div>

                  {activeEntry.photoUrl && (
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">Dokumentasi Lapangan</span>
                      <img 
                        src={activeEntry.photoUrl} 
                        alt="Dokumentasi" 
                        referrerPolicy="no-referrer"
                        className="mt-1 w-full h-32 object-cover rounded-xl border border-slate-800"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onViewDetail(activeEntry)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Buka Formulasi Lengkap (5W+1H)</span>
                </button>
              </div>
            </div>
          ) : activeLandmark ? (
            <div className="bg-[#111827] border border-sky-500/50 rounded-2xl p-5 shadow-2xl flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                      OBVITNAS / OBVITDA
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-200">
                      {activeLandmark.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveLandmark(null)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {/* Symbol Badge Highlight */}
                  {(() => {
                    const sym = findSubsectorSymbol(activeLandmark.symbolBadgeCode);
                    return (
                      <div className="p-3 rounded-xl bg-[#0B1120] border border-sky-500/30 flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl border flex items-center justify-center font-mono font-black text-xs shrink-0"
                          style={{
                            borderColor: sym?.themeColor || '#0284C7',
                            backgroundColor: `${sym?.themeColor || '#0284C7'}20`,
                            color: sym?.themeColor || '#0284C7',
                          }}
                        >
                          {sym ? `${sym.sectionCode.replace('D.IN.', '')}.${sym.no}` : 'OBVIT'}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">
                            {sym?.name || activeLandmark.name}
                          </div>
                          <div className="text-[10px] font-mono text-sky-400">
                            {sym?.sectionCode} • {sym?.badgeCode}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div>
                    <h3 className="text-sm font-bold text-white">{activeLandmark.name}</h3>
                    <p className="text-xs text-sky-400 mt-0.5">{activeLandmark.keterangan}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Kecamatan:</span>
                      <span className="font-semibold">{activeLandmark.kecamatan}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Tingkat Kepentingan:</span>
                      <span className="font-bold text-sky-400">{activeLandmark.importance}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Koordinat:</span>
                      <span className="font-mono text-amber-400">
                        {activeLandmark.lat.toFixed(4)}, {activeLandmark.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Deskripsi Pemantauan</span>
                    <div className="mt-1 p-3 rounded-xl bg-[#0B1120] border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      {activeLandmark.description}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => onNavigateToForm('D.IN.1')}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Buat Laporan Terkait Titik Ini</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Titik Pantau Terpilih ({selectedKecamatan})
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{filteredEntries.length} Laporan</span>
                </div>

                <div className="mt-3 space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
                  {filteredEntries.length === 0 && filteredLandmarks.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 text-xs">
                      Tidak ada titik pantau yang sesuai dengan kriteria filter.
                    </div>
                  ) : (
                    <>
                      {filteredEntries.map((entry) => {
                        const sym = findSubsectorSymbol(entry.sektor_symbol || entry.keterangan || entry.section || '');
                        return (
                          <div
                            key={entry.id}
                            onClick={() => {
                              setActiveEntry(entry);
                              setActiveLandmark(null);
                              const coords = getCoordinates(entry);
                              if (mapInstanceRef.current) {
                                mapInstanceRef.current.flyTo(coords, 14, { duration: 1.0 });
                              }
                            }}
                            className="p-3 rounded-xl bg-[#0B1120] border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/40 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                {sym ? `${sym.sectionCode} #${sym.no}` : entry.section}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">{entry.date}</span>
                            </div>
                            <div className="text-xs font-bold text-slate-200 group-hover:text-amber-300 truncate">
                              {sym?.name || entry.keterangan}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 truncate">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{entry.location} ({entry.kecamatan})</span>
                            </div>
                          </div>
                        );
                      })}

                      {filteredLandmarks.map((lm) => {
                        const sym = findSubsectorSymbol(lm.symbolBadgeCode);
                        return (
                          <div
                            key={lm.id}
                            onClick={() => {
                              setActiveLandmark(lm);
                              setActiveEntry(null);
                              if (mapInstanceRef.current) {
                                mapInstanceRef.current.flyTo([lm.lat, lm.lng], 14, { duration: 1.0 });
                              }
                            }}
                            className="p-3 rounded-xl bg-[#071322] border border-sky-500/30 hover:border-sky-400 hover:bg-slate-800/50 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-[11px] font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                                {sym ? `${sym.sectionCode} #${sym.no}` : 'OBVIT'}
                              </span>
                              <span className="text-[10px] font-mono text-sky-300 font-semibold">{lm.importance}</span>
                            </div>
                            <div className="text-xs font-bold text-slate-200 group-hover:text-sky-300 truncate">
                              {lm.name}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 truncate">
                              <Landmark className="w-3 h-3 text-sky-400" />
                              <span>Kecamatan {lm.kecamatan}</span>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Official Map Print Dialog Modal */}
      {showPrintModal && (
        <IntelligenceMapPrintModal
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          entries={entries}
          selectedKecamatan={selectedKecamatan}
          onSelectKecamatan={handleSelectKecamatan}
          selectedSectorFilter={selectedSection}
          includeStrategicLandmarks={includeStrategicLandmarks}
        />
      )}

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-emerald-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Import Titik Peta Intelijen dari CSV (D.IN.2 – D.IN.6)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Otomatis mengambil koordinat Latitude/Longitude dari nama lokasi atau kecamatan (cth: Kediri, Baturiti, Bajera)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCsvModal(false);
                  setCsvError(null);
                  setCsvSuccessMessage(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Template download & file input */}
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#0B1120] border border-slate-800">
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-white">Gunakan Template Resmi CSV:</span>
                <p className="text-[11px] text-slate-400">Format kolom yang telah disesuaikan dengan struktur D.IN Kejaksaan</p>
              </div>
              <button
                type="button"
                onClick={handleDownloadCsvTemplate}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Format CSV</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Pilih File CSV atau Drag & Drop:
              </label>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/20 file:text-emerald-400 hover:file:bg-emerald-500/30 file:cursor-pointer cursor-pointer border border-slate-700 rounded-xl p-1 bg-[#0B1120]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Atau Tempel / Review Isi Teks CSV:
              </label>
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="no,section,sektor_symbol,keterangan,narrative,date,location,kecamatan,latitude,longitude,classification,officerName..."
                rows={6}
                className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {csvError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{csvError}</span>
              </div>
            )}

            {csvSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{csvSuccessMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowCsvModal(false);
                  setCsvError(null);
                  setCsvSuccessMessage(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleProcessCsvImport}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Proses & Masukkan ke Peta</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Filter-Only Overlay Mode */}
      {isFilterOnlyFullscreen && (
        <div className="fixed inset-0 z-50 w-screen h-screen bg-slate-950 flex flex-col">
          {/* Floating Top Filter Bar */}
          <div className="absolute top-4 left-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-xs text-white uppercase tracking-wider hidden sm:inline">
                Peta Intelijen Kejari Tabanan (Mode Layar Penuh)
              </span>
            </div>

            {/* Filter Bar Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Kecamatan */}
              <select
                value={selectedKecamatan}
                onChange={(e) => handleSelectKecamatan(e.target.value)}
                className="bg-[#0B1120] border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-semibold"
              >
                <option value="Semua">Semua Kecamatan (10)</option>
                {TABANAN_KECAMATAN.map((k) => (
                  <option key={k} value={k}>
                    Kecamatan {k}
                  </option>
                ))}
              </select>

              {/* Sektor D.IN.2 - D.IN.6 */}
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="bg-[#0B1120] border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-semibold"
              >
                <option value="ALL">Semua Sektor (D.IN.2–D.IN.6)</option>
                {SECTIONS_CONFIG.filter((s) => s.id !== 'D.IN.7').map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.shortName}
                  </option>
                ))}
              </select>

              {/* Klasifikasi */}
              <select
                value={selectedClassification}
                onChange={(e) => setSelectedClassification(e.target.value)}
                className="bg-[#0B1120] border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-semibold"
              >
                <option value="ALL">Semua Klasifikasi</option>
                <option value="RAHASIA">RAHASIA</option>
                <option value="TERBATAS">TERBATAS</option>
                <option value="BIASA">BIASA</option>
              </select>

              {/* Base Map Switcher */}
              <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => updateTileLayer('voyager')}
                  className={`px-2 py-0.5 rounded font-semibold ${baseMapStyle === 'voyager' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  Jalan
                </button>
                <button
                  type="button"
                  onClick={() => updateTileLayer('satellite')}
                  className={`px-2 py-0.5 rounded font-semibold ${baseMapStyle === 'satellite' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  Satelit
                </button>
              </div>

              {/* Print Button */}
              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak</span>
              </button>

              {/* Close / Exit Fullscreen Button */}
              <button
                type="button"
                onClick={() => setIsFilterOnlyFullscreen(false)}
                className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Keluar Layar Penuh</span>
              </button>
            </div>
          </div>

          {/* Full viewport Leaflet map */}
          <div className="w-full h-full flex-1" ref={(node) => {
            if (node && mapInstanceRef.current) {
              setTimeout(() => {
                mapInstanceRef.current?.invalidateSize();
              }, 100);
            }
          }} />
        </div>
      )}
    </div>
  );
}

function kecKecamatan(k: string): string {
  return k.startsWith('Kecamatan') ? k : `Kecamatan ${k}`;
}
