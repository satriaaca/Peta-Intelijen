import { 
  X, 
  Calendar, 
  MapPin, 
  FileText, 
  Printer, 
  Scale
} from 'lucide-react';
import { IntelligenceEntry } from '../types';
import { SECTIONS_CONFIG } from '../services/seedData';

interface DetailModalProps {
  entry: IntelligenceEntry | null;
  onClose: () => void;
}

export default function DetailModal({ entry, onClose }: DetailModalProps) {
  if (!entry) return null;

  const sectionMeta = SECTIONS_CONFIG.find((s) => s.id === entry.section) || SECTIONS_CONFIG[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-2xl w-full text-slate-100 shadow-2xl overflow-hidden my-6">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                LEMBAR INFORMASI INTELIJEN YUSTISIAL
              </div>
              <h3 className="text-sm font-bold text-white">
                {entry.no} — {entry.section} ({sectionMeta.shortName})
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-colors"
              title="Cetak Lembar Informasi"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-semibold">Cetak</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0F172A]/80 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                Seksi & Sektor
              </span>
              <span className="font-bold text-white font-mono">
                {entry.section} / {entry.sektor_symbol}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                Keterangan
              </span>
              <span className="font-bold text-amber-400">
                {entry.keterangan}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                Klasifikasi
              </span>
              <span className="font-bold text-sky-400 font-mono">
                {entry.classification || 'TERBATAS'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                Kepercayaan Sumber
              </span>
              <span className="font-bold text-slate-200 font-mono">
                {entry.sourceConfidence || 'A1'}
              </span>
            </div>
          </div>

          {/* Time & Location Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0F172A]/50 border border-slate-800 flex items-start gap-3">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                  Tanggal Kejadian & Pelaporan
                </span>
                <div className="text-white font-medium font-mono">
                  Peristiwa: {entry.date}
                </div>
                {entry.reportDate && (
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Laporan Dibuat: {entry.reportDate}
                  </div>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0F172A]/50 border border-slate-800 flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                  Tempat & Wilayah Hukum
                </span>
                <div className="text-white font-medium">
                  {entry.location}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Kecamatan {entry.kecamatan}, Kab. Tabanan
                </div>
              </div>
            </div>
          </div>

          {/* Full Narrative Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                Uraian Fakta Kronologis (5W+1H / SIADIBIBAM)
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">
                FORMAT RESMI KEJAKSAAN RI
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 text-slate-200 leading-relaxed font-sans text-xs sm:text-sm">
              {entry.narrative}
            </div>
          </div>

          {/* Optional Photo Attachment */}
          {entry.photoUrl && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Lampiran Foto Dokumentasi
              </span>
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0F172A]">
                <img
                  src={entry.photoUrl}
                  referrerPolicy="no-referrer"
                  alt="Dokumentasi Intelijen"
                  className="w-full max-h-64 object-contain"
                />
                {entry.photoCaption && (
                  <div className="p-2 text-center text-xs text-slate-400 bg-[#0F172A]/90 border-t border-slate-800">
                    {entry.photoCaption}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Metadata */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
            <div>
              Petugas: <b className="text-slate-200">{entry.officerName || 'Tim Intelijen Kejari Tabanan'}</b>
            </div>
            <div>
              Status: <b className="text-emerald-400 font-semibold">{entry.status || 'SELESAI'}</b>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action */}
        <div className="px-6 py-3.5 bg-[#0F172A] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors border border-slate-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
