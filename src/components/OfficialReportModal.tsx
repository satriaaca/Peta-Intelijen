import { useState } from 'react';
import { 
  X, 
  Printer, 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  Maximize2, 
  FileText,
  Calendar,
  MapPin,
  Scale
} from 'lucide-react';
import { IntelligenceEntry, OutreachEntry, CaseStatEntry } from '../types';
import { SECTIONS_CONFIG } from '../services/seedData';

interface OfficialReportModalProps {
  entries: IntelligenceEntry[];
  outreachEntries: OutreachEntry[];
  caseStats: CaseStatEntry[];
  onClose: () => void;
}

export default function OfficialReportModal({
  entries,
  outreachEntries,
  caseStats,
  onClose,
}: OfficialReportModalProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'slide' | 'full'>('slide');

  // Slides configuration
  // Slide 0: Executive Overview & Kop Surat
  // Slide 1: D.IN.1 Ipolhankam
  // Slide 2: D.IN.3 Sosbudkem & D.IN.4 Ekokeu
  // Slide 3: D.IN.5 PPS & D.IN.6 TI/Prodintel
  // Slide 4: D.IN.7 Penkum & JMS (Triwulan I-IV)
  // Slide 5: Statistik Penanganan Perkara (2024-2026)

  const slides = [
    { id: 'cover', title: 'Ringkasan Eksekutif Peta Intelijen' },
    { id: 'din1', title: 'Sektor D.IN.1 — Ideologi, Politik & Kamtibmas' },
    { id: 'din3-4', title: 'Sektor D.IN.3 (Sosbud) & D.IN.4 (Ekokeu)' },
    { id: 'din5-6', title: 'Sektor D.IN.5 (PPS) & D.IN.6 (TI / Prodintel)' },
    { id: 'din7', title: 'Sektor D.IN.7 — Penerangan & Penyuluhan Hukum' },
    { id: 'stats', title: 'Statistik Penanganan Perkara Khusus' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const din1Entries = entries.filter((e) => e.section === 'D.IN.1');
  const din3Entries = entries.filter((e) => e.section === 'D.IN.3');
  const din4Entries = entries.filter((e) => e.section === 'D.IN.4');
  const din5Entries = entries.filter((e) => e.section === 'D.IN.5');
  const din6Entries = entries.filter((e) => e.section === 'D.IN.6');

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/95 backdrop-blur-md flex flex-col justify-between text-slate-100 overflow-y-auto">
      {/* Top Slide Control Bar */}
      <header className="px-6 py-3.5 bg-[#1E293B] border-b border-slate-800 flex items-center justify-between sticky top-0 z-20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            <Presentation className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
              FORMAT PAPAN PETA INTELIJEN (PENGGANTI PPT)
            </div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              {slides[currentSlideIndex].title} ({currentSlideIndex + 1}/{slides.length})
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Slide Navigation */}
          <div className="flex items-center gap-1 bg-[#0F172A] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
              disabled={currentSlideIndex === 0}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-slate-300">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>
            <button
              onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
              disabled={currentSlideIndex === slides.length - 1}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Cetak Laporan</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Slide Canvas Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full bg-[#1E293B] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative min-h-[580px] flex flex-col justify-between">
          {/* Official Kop Surat Header */}
          <div className="border-b-2 border-amber-500/40 pb-4 mb-6 text-center relative">
            <div className="text-[11px] font-bold tracking-widest text-amber-400 uppercase font-mono">
              KEJAKSAAN REPUBLIK INDONESIA
            </div>
            <div className="text-xs font-bold tracking-wider text-slate-300 uppercase mt-0.5">
              KEJAKSAAN TINGGI BALI — KEJAKSAAN NEGERI TABANAN
            </div>
            <div className="text-base sm:text-lg font-extrabold text-white uppercase tracking-tight mt-1">
              PAPAN PETA INTELIJEN YUSTISIAL (PPI)
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Wilayah Hukum Kabupaten Tabanan • Triwulan I Tahun 2026 • Formulasi 5W+1H (SIADIBIBAM)
            </div>
          </div>

          {/* Slide Content Dynamic */}
          <div className="flex-1">
            {/* SLIDE 0: Overview */}
            {currentSlideIndex === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
                    <div className="text-xs font-semibold text-slate-400 uppercase">Total Laporan D.IN</div>
                    <div className="text-3xl font-bold text-amber-400 font-mono mt-1">{entries.length}</div>
                    <div className="text-[11px] text-slate-400 mt-2">Terbagi dalam 5 sektor intelijen aktif</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
                    <div className="text-xs font-semibold text-slate-400 uppercase">Giat Penkum & JMS</div>
                    <div className="text-3xl font-bold text-sky-400 font-mono mt-1">{outreachEntries.length}</div>
                    <div className="text-[11px] text-slate-400 mt-2">
                      Total {outreachEntries.reduce((s, o) => s + (o.jumlah_peserta || 0), 0)} peserta teredukasi
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
                    <div className="text-xs font-semibold text-slate-400 uppercase">Status Wilayah</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">KONDUSIF</div>
                    <div className="text-[11px] text-slate-400 mt-2">10 Kecamatan dalam pemantauan rutin</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0F172A]/70 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Ringkasan Ancaman, Gangguan, Hambatan & Tantangan (AGHT)
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed list-disc list-inside">
                    <li>
                      <b>Bidang Ipolhankam (D.IN.1):</b> Tahapan verifikasi KPUD berjalan aman; pemantauan berkala tapal batas ulayat di Baturiti secara musyawarah.
                    </li>
                    <li>
                      <b>Bidang Sosbudmas (D.IN.3):</b> Pengawasan aliran kepercayaan masyarakat (PAKEM) kondusif dan kerukunan antarumat beragama terjaga.
                    </li>
                    <li>
                      <b>Bidang Ekokeu (D.IN.4):</b> Satgas Pangan memonitor kelancaran pasokan beras dan pupuk subsidi di Tabanan.
                    </li>
                    <li>
                      <b>Bidang PPS (D.IN.5):</b> Pengawalan Proyek Strategis Gedung RSUD Nyitdah Tahap II dengan deviasi positif (+2,1%).
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* SLIDE 1: D.IN.1 */}
            {currentSlideIndex === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-amber-400 uppercase">
                    D.IN.1 — Ideologi, Politik, Pertahanan & Keamanan ({din1Entries.length} Laporan)
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">Seksi Ipolhankam</span>
                </div>

                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {din1Entries.map((e) => (
                    <div key={e.id} className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-bold text-amber-400">{e.no}</span>
                        <span className="text-slate-400 font-mono">{e.date} • {e.location}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {e.narrative}
                      </p>
                      <div className="mt-2.5 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Keterangan: <b className="text-slate-300">{e.keterangan}</b></span>
                        <span>Klasifikasi: <b className="text-amber-400 font-mono">{e.classification || 'TERBATAS'}</b></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SLIDE 2: D.IN.3 & D.IN.4 */}
            {currentSlideIndex === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* D.IN.3 */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-sky-400 uppercase border-b border-slate-800 pb-1">
                    D.IN.3 — Sosial, Budaya & Kemasyarakatan
                  </h3>
                  <div className="space-y-2 max-h-[340px] overflow-y-auto">
                    {din3Entries.map((e) => (
                      <div key={e.id} className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 text-xs">
                        <div className="font-mono text-sky-400 font-bold text-[11px] mb-1">{e.no}</div>
                        <p className="text-slate-300 line-clamp-4 leading-relaxed">{e.narrative}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* D.IN.4 */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-amber-400 uppercase border-b border-slate-800 pb-1">
                    D.IN.4 — Ekonomi & Keuangan
                  </h3>
                  <div className="space-y-2 max-h-[340px] overflow-y-auto">
                    {din4Entries.map((e) => (
                      <div key={e.id} className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 text-xs">
                        <div className="font-mono text-amber-400 font-bold text-[11px] mb-1">{e.no}</div>
                        <p className="text-slate-300 line-clamp-4 leading-relaxed">{e.narrative}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 3: D.IN.5 & D.IN.6 */}
            {currentSlideIndex === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* D.IN.5 */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase border-b border-slate-800 pb-1">
                    D.IN.5 — Pengamanan Pembangunan Strategis (PPS)
                  </h3>
                  <div className="space-y-2 max-h-[340px] overflow-y-auto">
                    {din5Entries.map((e) => (
                      <div key={e.id} className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 text-xs">
                        <div className="font-mono text-indigo-400 font-bold text-[11px] mb-1">{e.no}</div>
                        <p className="text-slate-300 line-clamp-4 leading-relaxed">{e.narrative}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* D.IN.6 */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-violet-400 uppercase border-b border-slate-800 pb-1">
                    D.IN.6 — TI & Produksi Intelijen
                  </h3>
                  <div className="space-y-2 max-h-[340px] overflow-y-auto">
                    {din6Entries.map((e) => (
                      <div key={e.id} className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 text-xs">
                        <div className="font-mono text-violet-400 font-bold text-[11px] mb-1">{e.no}</div>
                        <p className="text-slate-300 line-clamp-4 leading-relaxed">{e.narrative}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 4: D.IN.7 */}
            {currentSlideIndex === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-amber-400 uppercase">
                    D.IN.7 — Penerangan & Penyuluhan Hukum (Triwulan I–IV)
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">Total {outreachEntries.length} Kegiatan</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto">
                  {outreachEntries.map((o) => (
                    <div key={o.id} className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-amber-400 font-bold">TW {['I', 'II', 'III', 'IV'][o.triwulan - 1]} • {o.no}</span>
                        <span className="text-slate-400">{o.waktu}</span>
                      </div>
                      <div className="font-bold text-white">{o.tema_kegiatan}</div>
                      <div className="text-slate-400 text-[11px]">
                        Lokasi: {o.tempat} ({o.kecamatan}) | Peserta: <b className="text-amber-300">{o.jumlah_peserta} Orang</b>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SLIDE 5: Case Stats */}
            {currentSlideIndex === 5 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-amber-400 uppercase">
                  Rekapitulasi Penanganan Perkara Khusus & Menonjol
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-[#0F172A] text-slate-300 font-bold">
                        <th className="py-2.5 px-3">Tahun & Kategori</th>
                        <th className="py-2.5 px-3 text-center">Lid / SPDP</th>
                        <th className="py-2.5 px-3 text-center">Dik Kejaksaan</th>
                        <th className="py-2.5 px-3 text-center">Dik Polisi</th>
                        <th className="py-2.5 px-3 text-center">Penuntutan</th>
                        <th className="py-2.5 px-3 text-center">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {caseStats.filter((s) => s.year === 2026 || s.year === 2025).map((stat) => (
                        <tr key={stat.id} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-semibold text-slate-200">
                            [{stat.year}] {stat.category}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-300">{stat.stages.lid_spdp}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-emerald-400">{stat.stages.dik_kejaksaan}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-sky-400">{stat.stages.dik_kepolisian}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-indigo-400">{stat.stages.tut}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-400">
                            {stat.stages.lid_spdp + stat.stages.dik_kejaksaan + stat.stages.dik_kepolisian + stat.stages.tut}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Slide Footer */}
          <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>KEJAKSAAN NEGERI TABANAN — SEKSI INTELIJEN</span>
            <span>SLIDE {currentSlideIndex + 1} DARI {slides.length}</span>
          </div>
        </div>
      </main>

      {/* Bottom Thumbnail Strip */}
      <footer className="px-6 py-3.5 bg-[#1E293B] border-t border-slate-800 flex items-center justify-center gap-2 overflow-x-auto">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              currentSlideIndex === idx
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-[#0F172A] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {idx + 1}. {s.title.split('—')[0]}
          </button>
        ))}
      </footer>
    </div>
  );
}
