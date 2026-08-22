import { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Award, 
  Target, 
  CheckCircle2, 
  Layers, 
  Calendar, 
  Sparkles, 
  ArrowUpRight, 
  PieChart as PieIcon, 
  BarChart3,
  Edit3,
  BookOpen
} from 'lucide-react';
import { OutreachEntry, AnnualTargetEntry, OutreachCategory } from '../types';
import AnnualTargetManager from './AnnualTargetManager';

interface OutreachTargetChartProps {
  outreachEntries: OutreachEntry[];
  annualTargets?: AnnualTargetEntry[];
  onSaveAnnualTarget?: (target: AnnualTargetEntry) => Promise<void>;
  onDeleteAnnualTarget?: (id: string) => Promise<void>;
}

export default function OutreachTargetChart({ 
  outreachEntries,
  annualTargets = [],
  onSaveAnnualTarget,
  onDeleteAnnualTarget
}: OutreachTargetChartProps) {
  const [activeMainTab, setActiveMainTab] = useState<'annual' | 'participants'>('annual');
  const [viewMode, setViewMode] = useState<'quarter' | 'category' | 'kecamatan'>('quarter');
  const [selectedTriwulan, setSelectedTriwulan] = useState<number | 'ALL'>('ALL');

  // Filter entries if triwulan filter is selected
  const filteredEntries = useMemo(() => {
    if (selectedTriwulan === 'ALL') return outreachEntries;
    return outreachEntries.filter((e) => e.triwulan === selectedTriwulan);
  }, [outreachEntries, selectedTriwulan]);

  // Overall Statistics
  const overallStats = useMemo(() => {
    const totalTarget = filteredEntries.reduce((sum, e) => sum + (e.target_peserta || e.jumlah_peserta || 0), 0);
    const totalActual = filteredEntries.reduce((sum, e) => sum + (e.jumlah_peserta || 0), 0);
    const percentage = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;

    const totalTargetGiat = filteredEntries.length; // Baseline target giat
    const totalTerlaksana = filteredEntries.filter((e) => e.status === 'TERLAKSANA').length;
    const percentageGiat = totalTargetGiat > 0 ? (totalTerlaksana / totalTargetGiat) * 100 : 0;

    return {
      totalTarget,
      totalActual,
      percentage: Number(percentage.toFixed(1)),
      totalTargetGiat,
      totalTerlaksana,
      percentageGiat: Number(percentageGiat.toFixed(1)),
    };
  }, [filteredEntries]);

  // Data per Triwulan (TW I s/d TW IV)
  const quarterData = useMemo(() => {
    return [1, 2, 3, 4].map((tw) => {
      const entriesInTw = outreachEntries.filter((e) => e.triwulan === tw);
      const target = entriesInTw.reduce((sum, e) => sum + (e.target_peserta || e.jumlah_peserta || 0), 0);
      const actual = entriesInTw.reduce((sum, e) => sum + (e.jumlah_peserta || 0), 0);
      const percentage = target > 0 ? (actual / target) * 100 : 0;
      const count = entriesInTw.length;

      return {
        name: `Triwulan ${['I', 'II', 'III', 'IV'][tw - 1]}`,
        shortName: `TW ${['I', 'II', 'III', 'IV'][tw - 1]}`,
        target,
        actual,
        percentage: Number(percentage.toFixed(1)),
        count,
      };
    });
  }, [outreachEntries]);

  // Data per Jenis Kegiatan / Program (JMS, Jaksa Menyapa, Pakem, Kampanye Anti Korupsi)
  const categoryData = useMemo(() => {
    const categories: OutreachCategory[] = [
      'Jaksa Masuk Sekolah (JMS)',
      'Jaksa Menyapa',
      'Pakem',
      'Kampanye Anti Korupsi',
      'Penyuluhan Hukum',
      'Penerangan Hukum',
    ];

    return categories.map((cat) => {
      const entriesInCat = filteredEntries.filter((e) => e.jenis_kegiatan === cat);
      const target = entriesInCat.reduce((sum, e) => sum + (e.target_peserta || e.jumlah_peserta || 0), 0);
      const actual = entriesInCat.reduce((sum, e) => sum + (e.jumlah_peserta || 0), 0);
      const percentage = target > 0 ? (actual / target) * 100 : 0;

      let shortLabel = 'JMS';
      if (cat === 'Jaksa Menyapa') shortLabel = 'J. Menyapa';
      else if (cat === 'Pakem') shortLabel = 'Pakem';
      else if (cat === 'Kampanye Anti Korupsi') shortLabel = 'Anti Korupsi';
      else if (cat === 'Penyuluhan Hukum') shortLabel = 'Luhkum';
      else if (cat === 'Penerangan Hukum') shortLabel = 'Penkum';

      return {
        name: cat,
        shortName: shortLabel,
        target,
        actual,
        percentage: Number(percentage.toFixed(1)),
        count: entriesInCat.length,
      };
    });
  }, [filteredEntries]);

  // Data per Kecamatan (Top Active)
  const kecamatanData = useMemo(() => {
    const map = new Map<string, { target: number; actual: number; count: number }>();

    filteredEntries.forEach((e) => {
      const current = map.get(e.kecamatan) || { target: 0, actual: 0, count: 0 };
      current.target += (e.target_peserta || e.jumlah_peserta || 0);
      current.actual += (e.jumlah_peserta || 0);
      current.count += 1;
      map.set(e.kecamatan, current);
    });

    return Array.from(map.entries()).map(([kec, data]) => {
      const percentage = data.target > 0 ? (data.actual / data.target) * 100 : 0;
      return {
        name: `Kec. ${kec}`,
        shortName: kec,
        target: data.target,
        actual: data.actual,
        percentage: Number(percentage.toFixed(1)),
        count: data.count,
      };
    }).sort((a, b) => b.actual - a.actual);
  }, [filteredEntries]);

  const activeChartData = viewMode === 'quarter' ? quarterData : viewMode === 'category' ? categoryData : kecamatanData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0B1120] border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[200px]">
          <div className="font-bold text-white border-b border-slate-800 pb-1 flex items-center justify-between">
            <span>{data.name || label}</span>
            <span className="font-mono text-amber-400 font-bold">{data.percentage}%</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Realisasi Kehadiran:
            </span>
            <span className="font-mono font-bold text-white">{data.actual?.toLocaleString()} orang</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              Target Peserta:
            </span>
            <span className="font-mono">{data.target?.toLocaleString()} orang</span>
          </div>
          {data.count !== undefined && (
            <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Jumlah Kegiatan:</span>
              <span className="font-mono font-semibold text-slate-200">{data.count} Giat</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Primary View Switcher */}
      <div className="bg-[#0B1120] p-1.5 sm:p-2 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
          <button
            type="button"
            onClick={() => setActiveMainTab('annual')}
            className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 text-center ${
              activeMainTab === 'annual'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Target className="w-4 h-4 shrink-0" />
            <span className="leading-tight">Target & Realisasi Tahunan (JMS, Jaksa Menyapa, PAKEM, Anti Korupsi)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('participants')}
            className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 text-center ${
              activeMainTab === 'participants'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="leading-tight">Target vs Capaian Peserta (Per Triwulan / Giat)</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: ANNUAL TARGET & REALIZATION MANAGER (WITH EDIT & CUSTOM VALUES) */}
      {activeMainTab === 'annual' && onSaveAnnualTarget && (
        <AnnualTargetManager
          annualTargets={annualTargets}
          onSaveTarget={onSaveAnnualTarget}
          onDeleteTarget={onDeleteAnnualTarget}
          selectedYear={2026}
        />
      )}

      {/* VIEW 2: PARTICIPANTS TARGET VS ACTUAL BREAKDOWN */}
      {activeMainTab === 'participants' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Persentase Capaian Total */}
            <div className="bg-[#151F33] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Persentase Capaian
                </span>
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-white">
                  {overallStats.percentage}%
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  overallStats.percentage >= 100 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {overallStats.percentage >= 100 ? 'Melampaui Target' : 'Di Bawah Target'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Rasio realisasi kehadiran peserta terhadap target seluruh agenda
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${overallStats.percentage >= 100 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  style={{ width: `${Math.min(overallStats.percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Card 2: Realisasi Peserta */}
            <div className="bg-[#151F33] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Realisasi Peserta
                </span>
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold font-mono text-emerald-400">
                  {overallStats.totalActual.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-sans">Orang</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Total audiens yang hadir dan teredukasi hukum di lapangan
              </p>
            </div>

            {/* Card 3: Target Peserta */}
            <div className="bg-[#151F33] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Target Peserta
                </span>
                <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  <Target className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold font-mono text-slate-200">
                  {overallStats.totalTarget.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-sans">Orang</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Batas minimal proyeksi target rencana operasional
              </p>
            </div>

            {/* Card 4: Keterlaksanaan Giat */}
            <div className="bg-[#151F33] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Kegiatan Terlaksana
                </span>
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-amber-400">
                  {overallStats.totalTerlaksana}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  / {overallStats.totalTargetGiat} Giat
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Tingkat eksekusi agenda ({overallStats.percentageGiat}%)
              </p>
            </div>
          </div>

          {/* Chart Section Container */}
          <div className="bg-[#151F33] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
            {/* Chart Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  Grafik Perbandingan Target vs Realisasi Peserta (D.IN.7)
                </h3>
                <p className="text-xs text-slate-400">
                  Visualisasi batang komparatif target audiens (abu-abu) vs capaian aktual di lapangan (kuning keemasan)
                </p>
              </div>

              {/* View Mode Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-[#0B1120] border border-slate-800 rounded-xl p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('quarter')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      viewMode === 'quarter'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Per Triwulan
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('category')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      viewMode === 'category'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Per Program
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('kecamatan')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      viewMode === 'kecamatan'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Per Kecamatan
                  </button>
                </div>

                {/* Optional Triwulan Filter for Category/Kecamatan Mode */}
                {viewMode !== 'quarter' && (
                  <select
                    value={selectedTriwulan}
                    onChange={(e) => setSelectedTriwulan(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                    className="bg-[#0B1120] border border-slate-800 text-xs font-bold text-amber-400 px-3 py-1.5 rounded-xl focus:outline-none"
                  >
                    <option value="ALL">Semua Triwulan</option>
                    <option value={1}>Triwulan I</option>
                    <option value={2}>Triwulan II</option>
                    <option value={3}>Triwulan III</option>
                    <option value={4}>Triwulan IV</option>
                  </select>
                )}
              </div>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-72 sm:h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activeChartData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                  barGap={8}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="shortName" 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    wrapperStyle={{ paddingBottom: 15, fontSize: 12 }}
                    formatter={(value) => {
                      return <span className="text-slate-300 text-xs font-medium">{value === 'target' ? 'Target Peserta' : 'Realisasi Capaian'}</span>;
                    }}
                  />
                  <Bar 
                    dataKey="target" 
                    name="target" 
                    fill="#475569" 
                    radius={[6, 6, 0, 0]} 
                    maxBarSize={45}
                  />
                  <Bar 
                    dataKey="actual" 
                    name="actual" 
                    fill="#f59e0b" 
                    radius={[6, 6, 0, 0]} 
                    maxBarSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Breakdown Percentage Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
              {activeChartData.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#0B1120] border border-slate-800/80 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 truncate pr-2">
                      {item.name}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      item.percentage >= 100 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {item.percentage}%
                    </span>
                  </div>

                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Realisasi:</span>
                      <span className="font-bold text-amber-400">{item.actual?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Target:</span>
                      <span className="text-slate-300">{item.target?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.percentage >= 100 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
