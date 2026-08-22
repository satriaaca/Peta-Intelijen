import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  Edit3, 
  Plus, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  BarChart3, 
  Save, 
  X, 
  AlertCircle,
  BookOpen,
  Radio,
  Eye,
  ShieldCheck,
  Award
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell
} from 'recharts';
import { AnnualTargetEntry } from '../types';
import { INITIAL_ANNUAL_TARGETS } from '../services/seedData';

interface AnnualTargetManagerProps {
  annualTargets: AnnualTargetEntry[];
  onSaveTarget: (target: AnnualTargetEntry) => Promise<void>;
  onDeleteTarget?: (id: string) => Promise<void>;
  selectedYear?: number;
}

export default function AnnualTargetManager({
  annualTargets,
  onSaveTarget,
  onDeleteTarget,
  selectedYear = 2026,
}: AnnualTargetManagerProps) {
  const [activeYear, setActiveYear] = useState<number>(selectedYear);
  const [editingTarget, setEditingTarget] = useState<AnnualTargetEntry | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form state for editing or creating
  const [formProgram, setFormProgram] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Penkum / JMS');
  const [formYear, setFormYear] = useState<number>(activeYear);
  const [formTarget, setFormTarget] = useState<number>(1);
  const [formRealisasi, setFormRealisasi] = useState<number>(1);
  const [formSatuan, setFormSatuan] = useState<string>('Kegiatan');
  const [formKeterangan, setFormKeterangan] = useState<string>('');

  // Filter targets by selected year
  const filteredTargets = annualTargets.filter((t) => t.year === activeYear);

  // Calculate totals
  const totalTarget = filteredTargets.reduce((sum, t) => sum + (t.targetTahunan || 0), 0);
  const totalRealisasi = filteredTargets.reduce((sum, t) => sum + (t.realisasiTahunan || 0), 0);
  const totalPercentage = totalTarget > 0 ? ((totalRealisasi / totalTarget) * 100).toFixed(1) : '0';

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenEdit = (target: AnnualTargetEntry) => {
    setEditingTarget(target);
    setIsCreatingNew(false);
    setFormProgram(target.program);
    setFormCategory(target.category);
    setFormYear(target.year);
    setFormTarget(target.targetTahunan);
    setFormRealisasi(target.realisasiTahunan);
    setFormSatuan(target.satuan || 'Kegiatan');
    setFormKeterangan(target.keterangan || '');
  };

  const handleOpenCreate = () => {
    setEditingTarget(null);
    setIsCreatingNew(true);
    setFormProgram('');
    setFormCategory('Penkum / JMS');
    setFormYear(activeYear);
    setFormTarget(1);
    setFormRealisasi(0);
    setFormSatuan('Kegiatan');
    setFormKeterangan('');
  };

  const handleCloseModal = () => {
    setEditingTarget(null);
    setIsCreatingNew(false);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProgram.trim()) {
      showNotification('Nama program / kegiatan wajib diisi.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const targetId = editingTarget
        ? editingTarget.id
        : `target-${formProgram.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${formYear}-${Date.now().toString().slice(-4)}`;

      const payload: AnnualTargetEntry = {
        id: targetId,
        program: formProgram.trim(),
        category: formCategory,
        year: Number(formYear),
        targetTahunan: Math.max(0, Number(formTarget)),
        realisasiTahunan: Math.max(0, Number(formRealisasi)),
        satuan: formSatuan.trim() || 'Kegiatan',
        keterangan: formKeterangan.trim(),
        updatedAt: Date.now(),
      };

      await onSaveTarget(payload);
      showNotification(`Target & Realisasi "${payload.program}" berhasil disimpan.`);
      handleCloseModal();
    } catch (err: any) {
      showNotification(err.message || 'Gagal menyimpan target tahunan.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, program: string) => {
    if (!onDeleteTarget) return;
    if (confirm(`Yakin ingin menghapus target program "${program}"?`)) {
      try {
        await onDeleteTarget(id);
        showNotification(`Target program "${program}" telah dihapus.`);
      } catch (err: any) {
        showNotification(err.message || 'Gagal menghapus target.', 'error');
      }
    }
  };

  const handleResetDefaults = async () => {
    if (confirm('Kembalikan Target & Realisasi Tahunan ke pengaturan standar (JMS: 3/5, Jaksa Menyapa: 2/3, PAKEM: 1/3, Kampanye Anti Korupsi: 1/2)?')) {
      try {
        setIsSaving(true);
        for (const initial of INITIAL_ANNUAL_TARGETS) {
          await onSaveTarget({
            ...initial,
            year: activeYear,
            id: `${initial.id.replace('2026', String(activeYear))}`,
            updatedAt: Date.now(),
          });
        }
        showNotification('Target & Realisasi Tahunan berhasil dikembalikan ke standar.');
      } catch (err: any) {
        showNotification(err.message || 'Gagal mereset target.', 'error');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Helper icon for category
  const getProgramIcon = (program: string) => {
    const p = program.toLowerCase();
    if (p.includes('sekolah') || p.includes('jms')) return BookOpen;
    if (p.includes('menyapa') || p.includes('radio') || p.includes('siaran')) return Radio;
    if (p.includes('pakem') || p.includes('kepercayaan')) return Eye;
    if (p.includes('korupsi') || p.includes('integritas')) return ShieldCheck;
    return Award;
  };

  // Chart data
  const chartData = filteredTargets.map((t) => {
    const pct = t.targetTahunan > 0 ? (t.realisasiTahunan / t.targetTahunan) * 100 : 0;
    return {
      name: t.program.length > 20 ? t.program.split('(')[0].trim() : t.program,
      fullName: t.program,
      Target: t.targetTahunan,
      Realisasi: t.realisasiTahunan,
      Persentase: Number(pct.toFixed(1)),
      satuan: t.satuan || 'Kegiatan',
    };
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div 
          className={`p-4 rounded-xl border flex items-center justify-between shadow-lg text-sm transition-all animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'success' 
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' 
              : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
            <span className="font-medium">{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-[#0B1120] p-4 sm:p-5 rounded-2xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="p-1.5 sm:p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Target & Realisasi Kinerja Tahunan
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Tahun {activeYear}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Monitoring komparasi target kuantitatif dan realisasi kegiatan intelijen & penyuluhan hukum yang dapat disesuaikan (editable).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Year selector */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
            {[2026, 2025, 2024].map((yr) => (
              <button
                key={yr}
                onClick={() => setActiveYear(yr)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeYear === yr
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          <button
            onClick={handleResetDefaults}
            disabled={isSaving}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
            title="Kembalikan ke nilai default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Default</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex-1 sm:flex-none justify-center px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Program</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0B1120] border border-slate-800/80 p-4 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Target Tahunan</span>
            <div className="text-2xl font-bold text-white font-mono flex items-baseline gap-1.5">
              {totalTarget}
              <span className="text-xs text-slate-400 font-sans font-normal">Kegiatan</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400">
            <Target className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0B1120] border border-slate-800/80 p-4 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Realisasi</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono flex items-baseline gap-1.5">
              {totalRealisasi}
              <span className="text-xs text-emerald-300 font-sans font-normal">Kegiatan</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 via-[#0B1120] to-[#0B1120] border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-amber-400 uppercase tracking-wider font-semibold">Persentase Rata-Rata</span>
            <div className="text-2xl font-bold text-amber-300 font-mono flex items-baseline gap-1.5">
              {totalPercentage}%
              <span className="text-xs text-emerald-400 font-sans font-semibold">
                (+{Math.max(0, totalRealisasi - totalTarget)} Surplus)
              </span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Program Cards Grid with Edit Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTargets.map((item) => {
          const percentage = item.targetTahunan > 0 ? (item.realisasiTahunan / item.targetTahunan) * 100 : 0;
          const isSurplus = item.realisasiTahunan >= item.targetTahunan;
          const ProgramIcon = getProgramIcon(item.program);

          return (
            <div
              key={item.id}
              className="bg-[#0B1120] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 group relative overflow-hidden"
            >
              {/* Top Accent Line */}
              <div 
                className={`absolute top-0 left-0 right-0 h-1 ${
                  percentage >= 150 ? 'bg-emerald-500' : percentage >= 100 ? 'bg-amber-500' : 'bg-slate-600'
                }`} 
              />

              <div className="space-y-3">
                {/* Header card */}
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 group-hover:border-amber-500/40 transition-colors">
                    <ProgramIcon className="w-4 h-4" />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-colors border border-slate-700/60"
                      title="Ubah Target & Realisasi"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {onDeleteTarget && (
                      <button
                        onClick={() => handleDelete(item.id, item.program)}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500 hover:text-white text-slate-400 transition-colors border border-slate-700/60"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title & Category */}
                <div>
                  <h3 className="font-bold text-white text-sm tracking-tight line-clamp-1 group-hover:text-amber-400 transition-colors">
                    {item.program}
                  </h3>
                  <span className="text-[11px] text-slate-400">{item.category}</span>
                </div>

                {/* Numbers: Target vs Realisasi */}
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Target Tahunan:</span>
                    <span className="font-mono font-bold text-white">
                      {item.targetTahunan} {item.satuan}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Realisasi:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {item.realisasiTahunan} {item.satuan}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percentage >= 150 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-amber-400'
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <span>Capaian</span>
                      <span className={`font-mono font-bold ${isSurplus ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                      percentage >= 100
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {percentage >= 100 ? `Melampaui (+${item.realisasiTahunan - item.targetTahunan})` : 'Sedang Berjalan'}
                  </span>
                </div>
              </div>

              {/* Note / Description */}
              {item.keterangan && (
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-3 pt-2 border-t border-slate-800/80">
                  {item.keterangan}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Visual Chart Comparison */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-sm">
              Grafik Komparasi Target vs Realisasi Tahunan ({activeYear})
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredTargets.length} Program Kerja
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1.5">
                        <p className="font-bold text-white border-b border-slate-800 pb-1">
                          {data.fullName}
                        </p>
                        <div className="flex items-center justify-between text-slate-300 gap-4">
                          <span>Target:</span>
                          <span className="font-mono font-bold text-amber-400">{data.Target} {data.satuan}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300 gap-4">
                          <span>Realisasi:</span>
                          <span className="font-mono font-bold text-emerald-400">{data.Realisasi} {data.satuan}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300 gap-4 pt-1 border-t border-slate-800 font-bold">
                          <span>Persentase:</span>
                          <span className="font-mono text-amber-300">{data.Persentase}%</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 10, fontSize: 12 }} 
                iconType="circle"
              />
              <Bar dataKey="Target" fill="#F59E0B" name="Target Tahunan" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Realisasi" fill="#10B981" name="Realisasi Tahunan" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Edit / Create Modal Dialog */}
      {(editingTarget || isCreatingNew) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {isCreatingNew ? 'Tambah Program Target Tahunan' : 'Ubah Target & Realisasi Kinerja'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isCreatingNew ? 'Daftarkan program kerja baru' : `Edit data untuk ${editingTarget?.program}`}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveForm} className="p-6 space-y-4">
              {/* Program Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Nama Program / Kegiatan <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jaksa Masuk Sekolah (JMS)"
                  value={formProgram}
                  onChange={(e) => setFormProgram(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              {/* Category & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Kategori Bidang
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  >
                    <option value="Penkum / JMS">Penkum / JMS</option>
                    <option value="Pelayanan Publik">Pelayanan Publik</option>
                    <option value="Pengawasan Aliran (PAKEM)">Pengawasan Aliran (PAKEM)</option>
                    <option value="Pencegahan Korupsi">Pencegahan Korupsi</option>
                    <option value="Intelijen Yustisial">Intelijen Yustisial</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Tahun Anggaran
                  </label>
                  <input
                    type="number"
                    min="2020"
                    max="2030"
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Target & Realisasi Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Target Tahunan
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formTarget}
                    onChange={(e) => setFormTarget(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-amber-500/50 focus:border-amber-500 rounded-xl px-3 py-2 text-base font-bold font-mono text-amber-300 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Target rencana tahunan</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Realisasi
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formRealisasi}
                    onChange={(e) => setFormRealisasi(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-emerald-500/50 focus:border-emerald-500 rounded-xl px-3 py-2 text-base font-bold font-mono text-emerald-300 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Capaian riil terlaksana</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Satuan
                  </label>
                  <input
                    type="text"
                    value={formSatuan}
                    onChange={(e) => setFormSatuan(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                    placeholder="Kegiatan"
                  />
                  <span className="text-[10px] text-slate-400">Kegiatan/Giat</span>
                </div>
              </div>

              {/* Real-time calculated preview */}
              <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-400">Kalkulasi Capaian:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {formTarget > 0 ? ((formRealisasi / formTarget) * 100).toFixed(1) : 0}% 
                  {formRealisasi >= formTarget ? ' (Melampaui Target)' : ''}
                </span>
              </div>

              {/* Keterangan / Deskripsi */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Keterangan / Ruang Lingkup
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan pelaksanaan, sasaran wilayah, atau deskripsi singkat..."
                  value={formKeterangan}
                  onChange={(e) => setFormKeterangan(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Target & Realisasi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
