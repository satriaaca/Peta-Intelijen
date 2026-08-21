import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Scale, 
  MapPin, 
  BookOpen, 
  Calendar,
  Layers,
  Filter
} from 'lucide-react';
import { CaseStatEntry, OutreachEntry, IntelligenceEntry } from '../types';
import { TABANAN_KECAMATAN } from '../services/seedData';

interface ChartsViewProps {
  caseStats: CaseStatEntry[];
  outreachEntries: OutreachEntry[];
  entries: IntelligenceEntry[];
}

export default function ChartsView({
  caseStats,
  outreachEntries,
  entries,
}: ChartsViewProps) {
  const [selectedCaseCategory, setSelectedCaseCategory] = useState<string>('Semua');
  const [selectedChartMode, setSelectedChartMode] = useState<'stages' | 'categories'>('stages');

  // --- DATA TRANSFORMATION 1: Outreach by Quarter (Target vs Realisasi & Giat Breakdown) ---
  const quarters = [1, 2, 3, 4];
  const outreachQuarterData = quarters.map((tw) => {
    const items = outreachEntries.filter((o) => o.triwulan === tw);
    const totalTarget = items.reduce((s, i) => s + (i.target_peserta || 100), 0);
    const totalRealisasi = items.reduce((s, i) => s + (i.jumlah_peserta || 0), 0);
    const jmsCount = items.filter((i) => i.jenis_kegiatan.includes('JMS') || i.jenis_kegiatan.includes('Sekolah')).length;
    const penkumCount = items.filter((i) => i.jenis_kegiatan === 'Penerangan Hukum').length;
    const luhkumCount = items.filter((i) => i.jenis_kegiatan === 'Penyuluhan Hukum').length;
    const jmenCount = items.filter((i) => i.jenis_kegiatan === 'Jaksa Menyapa').length;

    return {
      triwulan: `TW ${['I', 'II', 'III', 'IV'][tw - 1]}`,
      targetPeserta: totalTarget || 150,
      realisasiPeserta: totalRealisasi,
      giatJMS: jmsCount,
      giatPenkum: penkumCount,
      giatLuhkum: luhkumCount,
      giatJaksaMenyapa: jmenCount,
      totalGiat: items.length,
    };
  });

  // --- DATA TRANSFORMATION 2: Case Trends by Year and Category ---
  const years = Array.from(new Set(caseStats.map((s) => s.year))).sort((a, b) => a - b);
  
  // Aggregate per year by Category
  const caseTrendsByCategory = years.map((yr) => {
    const yrStats = caseStats.filter((s) => s.year === yr);
    const korupsiTotal = yrStats
      .filter((s) => s.category === 'Korupsi')
      .reduce((sum, s) => sum + s.stages.lid_spdp + s.stages.dik_kejaksaan + s.stages.dik_kepolisian + s.stages.tut, 0);
    const narkotikaTotal = yrStats
      .filter((s) => s.category === 'Narkotika')
      .reduce((sum, s) => sum + s.stages.lid_spdp + s.stages.dik_kejaksaan + s.stages.dik_kepolisian + s.stages.tut, 0);
    const terorismeTotal = yrStats
      .filter((s) => s.category === 'Terorisme')
      .reduce((sum, s) => sum + s.stages.lid_spdp + s.stages.dik_kejaksaan + s.stages.dik_kepolisian + s.stages.tut, 0);
    const pmhTotal = yrStats
      .filter((s) => s.category === 'Perkara Menarik Perhatian Masyarakat')
      .reduce((sum, s) => sum + s.stages.lid_spdp + s.stages.dik_kejaksaan + s.stages.dik_kepolisian + s.stages.tut, 0);

    return {
      year: String(yr),
      Korupsi: korupsiTotal,
      Narkotika: narkotikaTotal,
      Terorisme: terorismeTotal,
      'Perkara Menarik': pmhTotal,
      total: korupsiTotal + narkotikaTotal + terorismeTotal + pmhTotal,
    };
  });

  // Aggregate per year by Stage (Filtered or Total)
  const caseTrendsByStage = years.map((yr) => {
    const yrStats = caseStats.filter((s) => s.year === yr && (selectedCaseCategory === 'Semua' || s.category === selectedCaseCategory));
    const lid = yrStats.reduce((sum, s) => sum + s.stages.lid_spdp, 0);
    const dikKejari = yrStats.reduce((sum, s) => sum + s.stages.dik_kejaksaan, 0);
    const dikPolisi = yrStats.reduce((sum, s) => sum + s.stages.dik_kepolisian, 0);
    const tut = yrStats.reduce((sum, s) => sum + s.stages.tut, 0);

    return {
      year: String(yr),
      'Lid / SPDP': lid,
      'Dik Kejaksaan (Tahap I)': dikKejari,
      'Dik Kepolisian (Tahap II)': dikPolisi,
      'Penuntutan (Tut)': tut,
      totalTahapan: lid + dikKejari + dikPolisi + tut,
    };
  });

  // --- DATA TRANSFORMATION 3: Activity by Kecamatan ---
  const kecamatanStats = TABANAN_KECAMATAN.map((kec) => {
    const dInReports = entries.filter((e) => e.kecamatan.toLowerCase().includes(kec.toLowerCase())).length;
    const penkumGiat = outreachEntries.filter((o) => o.kecamatan.toLowerCase().includes(kec.toLowerCase())).length;
    const peserta = outreachEntries
      .filter((o) => o.kecamatan.toLowerCase().includes(kec.toLowerCase()))
      .reduce((s, i) => s + (i.jumlah_peserta || 0), 0);

    return {
      kecamatan: kec,
      laporanDIn: dInReports,
      giatPenkum: penkumGiat,
      pesertaEdukasi: peserta,
      totalAktivitas: dInReports + penkumGiat,
    };
  }).sort((a, b) => b.totalAktivitas - a.totalAktivitas);

  // Section distribution for pie chart
  const sectionColors = ['#f59e0b', '#0ea5e9', '#10b981', '#6366f1', '#8b5cf6', '#ec4899'];
  const sectionPieData = [
    { name: 'D.IN.1 Ipolhankam', value: entries.filter((e) => e.section === 'D.IN.1').length },
    { name: 'D.IN.3 Sosbud', value: entries.filter((e) => e.section === 'D.IN.3').length },
    { name: 'D.IN.4 Ekokeu', value: entries.filter((e) => e.section === 'D.IN.4').length },
    { name: 'D.IN.5 PPS', value: entries.filter((e) => e.section === 'D.IN.5').length },
    { name: 'D.IN.6 TI/Prodintel', value: entries.filter((e) => e.section === 'D.IN.6').length },
    { name: 'D.IN.7 Penkum', value: outreachEntries.length },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <BarChart3 className="w-5 h-5" />
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Pusat Grafik & Analitik Data Intelijen
          </h2>
        </div>
        <p className="text-xs text-slate-300 max-w-2xl">
          Visualisasi tren penanganan perkara, capaian triwulanan penyuluhan hukum (Target vs Penkum vs Luhkum), dan distribusi kewilayahan di Kabupaten Tabanan.
        </p>
      </div>

      {/* CHART 1: Case Trends by Year and Stage/Category */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              Tren Penanganan Perkara Khusus (Tahun 2024 – 2026)
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Grafik komparasi tahapan penyelidikan, penyidikan, dan penuntutan per kategori
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Toggle Mode */}
            <div className="flex items-center gap-1 bg-[#0F172A] p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedChartMode('stages')}
                className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-all ${
                  selectedChartMode === 'stages'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Berdasarkan Tahapan
              </button>
              <button
                onClick={() => setSelectedChartMode('categories')}
                className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-all ${
                  selectedChartMode === 'categories'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Berdasarkan Kategori
              </button>
            </div>

            {/* Filter Category if stage mode */}
            {selectedChartMode === 'stages' && (
              <select
                value={selectedCaseCategory}
                onChange={(e) => setSelectedCaseCategory(e.target.value)}
                className="bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Semua">Semua Kategori Perkara</option>
                <option value="Korupsi">Korupsi</option>
                <option value="Narkotika">Narkotika</option>
                <option value="Terorisme">Terorisme</option>
                <option value="Perkara Menarik Perhatian Masyarakat">Perkara Menarik Perhatian</option>
              </select>
            )}
          </div>
        </div>

        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {selectedChartMode === 'stages' ? (
              <BarChart data={caseTrendsByStage} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Lid / SPDP" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Dik Kejaksaan (Tahap I)" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Dik Kepolisian (Tahap II)" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Penuntutan (Tut)" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={caseTrendsByCategory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Korupsi" fill="#ef4444" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Narkotika" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Terorisme" fill="#64748b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Perkara Menarik" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: Outreach Quarterly & Activity by Kecamatan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 2: Legal Outreach Activity by Quarter */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-md">
          <div className="mb-4 pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Capaian Penerangan & Penyuluhan Hukum (Triwulan I–IV)
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Komparasi Target vs Realisasi Peserta dan Kegiatan Penkum/Luhkum/JMS
            </p>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outreachQuarterData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="triwulan" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="targetPeserta" name="Target Peserta" fill="#475569" radius={[6, 6, 0, 0]} />
                <Bar dataKey="realisasiPeserta" name="Realisasi Peserta" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2.5 text-center text-xs">
            {outreachQuarterData.map((item) => (
              <div key={item.triwulan} className="p-2.5 rounded-xl bg-[#0F172A]/70 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono font-bold">{item.triwulan}</div>
                <div className="font-bold text-amber-400 font-mono text-xs mt-0.5">{item.realisasiPeserta} Org</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{item.totalGiat} Kegiatan</div>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 3: Activity by Kecamatan */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-md">
          <div className="mb-4 pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              Distribusi Kegiatan Intelijen & Penkum per Kecamatan
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              10 Kecamatan di Wilayah Hukum Kejari Tabanan
            </p>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={kecamatanStats.slice(0, 8)}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis dataKey="kecamatan" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                <Bar dataKey="laporanDIn" name="Laporan D.IN" fill="#f59e0b" radius={[0, 6, 6, 0]} />
                <Bar dataKey="giatPenkum" name="Giat Penkum" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Matrix Distribution */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-md">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          Komposisi 6 Sektor Laporan Peta Intelijen (D.IN.1 s/d D.IN.7)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {sectionPieData.map((item, index) => (
            <div
              key={item.name}
              className="p-3.5 rounded-xl bg-[#0F172A]/70 border border-slate-800 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: sectionColors[index % sectionColors.length] }}
                />
                <span className="text-[11px] font-bold text-slate-200 truncate">
                  {item.name}
                </span>
              </div>
              <div className="mt-2.5 text-xl font-bold font-mono text-white">
                {item.value}
                <span className="text-xs text-slate-400 font-sans font-normal ml-1">data</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
