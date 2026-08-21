import { useState, FormEvent } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Mail, 
  User, 
  Info,
  KeyRound,
  RotateCcw,
  Check,
  ShieldAlert
} from 'lucide-react';
import { 
  WhitelistEmailConfig, 
  getAllowedEmailList, 
  saveAllowedEmailList, 
  DEFAULT_ALLOWED_EMAILS 
} from '../services/emailWhitelistService';
import { AppUser } from '../types';

interface WhitelistManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser;
}

export default function WhitelistManagerModal({
  isOpen,
  onClose,
  currentUser
}: WhitelistManagerModalProps) {
  const [emails, setEmails] = useState<WhitelistEmailConfig[]>(() => getAllowedEmailList());
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<WhitelistEmailConfig['role']>('Jaksa Fungsional Intelijen');
  const [newUnit, setNewUnit] = useState('Seksi Intelijen Kejaksaan Negeri Tabanan');
  const [newNip, setNewNip] = useState('');
  const [newNote, setNewNote] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleAddEmail = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const trimmedEmail = newEmail.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('Alamat email wajib diisi.');
      return;
    }

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Format email tidak valid.');
      return;
    }

    if (emails.some(item => item.email.toLowerCase() === trimmedEmail)) {
      setError('Email ini sudah terdaftar dalam Whitelist.');
      return;
    }

    const newItem: WhitelistEmailConfig = {
      email: trimmedEmail,
      name: newName.trim() || trimmedEmail.split('@')[0],
      role: newRole,
      unit: newUnit.trim() || 'Seksi Intelijen Kejaksaan Negeri Tabanan',
      nip: newNip.trim() || '19900101 201501 1 001',
      note: newNote.trim() || 'Ditambahkan oleh Administrator',
      isActive: true,
    };

    const updated = [newItem, ...emails];
    setEmails(updated);
    saveAllowedEmailList(updated);

    // Reset inputs
    setNewEmail('');
    setNewName('');
    setNewNip('');
    setNewNote('');
    setSuccessMsg(`Email ${trimmedEmail} berhasil ditambahkan dan diizinkan masuk!`);

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleToggleActive = (email: string) => {
    const updated = emails.map(item => {
      if (item.email === email) {
        return { ...item, isActive: !item.isActive };
      }
      return item;
    });
    setEmails(updated);
    saveAllowedEmailList(updated);
  };

  const handleDelete = (email: string) => {
    if (confirm(`Hapus email "${email}" dari daftar yang diizinkan?`)) {
      const updated = emails.filter(item => item.email !== email);
      setEmails(updated);
      saveAllowedEmailList(updated);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Kembalikan daftar email yang diizinkan ke pengaturan awal?')) {
      setEmails(DEFAULT_ALLOWED_EMAILS);
      saveAllowedEmailList(DEFAULT_ALLOWED_EMAILS);
      setSuccessMsg('Daftar whitelist dikembalikan ke pengaturan bawaan.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#151F33] border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-[#0F172A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Kelola Email SSO yang Diizinkan (Whitelist)
              </h2>
              <p className="text-xs text-slate-400">
                Hanya akun Gmail / Google Workspace yang tercantum di bawah ini yang dapat masuk ke sistem.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 text-sm font-semibold transition"
          >
            ✕ Tutup
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Status Message */}
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Tambah Email Baru */}
          <div className="bg-[#0F172A]/70 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Tambah Email yang Diberi Hak Akses
            </h3>

            <form onSubmit={handleAddEmail} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                    Alamat Email Google / Gmail <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="nama.petugas@gmail.com"
                      className="w-full bg-[#151F33] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                    Nama Petugas / Jaksa
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="I Made Arya, S.H."
                      className="w-full bg-[#151F33] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                    Jabatan / Peran
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Kasi Intelijen">Kasi Intelijen</option>
                    <option value="Jaksa Fungsional Intelijen">Jaksa Fungsional Intelijen</option>
                    <option value="Staf Intelijen">Staf Intelijen</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                    NIP / NRP Petugas
                  </label>
                  <input
                    type="text"
                    value={newNip}
                    onChange={(e) => setNewNip(e.target.value)}
                    placeholder="19890918 201402 1 001"
                    className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                    Catatan Akses
                  </label>
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="e.g. Jaksa Ipolhankam"
                    className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Tambahkan ke Whitelist</span>
                </button>
              </div>
            </form>
          </div>

          {/* Daftar Email Whitelist Aktif */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                Daftar Akun yang Diizinkan ({emails.length})
              </h3>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset ke Pengaturan Default
              </button>
            </div>

            <div className="space-y-2">
              {emails.map((item) => (
                <div
                  key={item.email}
                  className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                    item.isActive
                      ? 'bg-[#0F172A] border-slate-700/80 text-white'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        {item.email}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono border border-slate-700">
                        {item.role}
                      </span>
                      {item.isActive ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5" /> Diizinkan
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/30 flex items-center gap-1">
                          <XCircle className="w-2.5 h-2.5" /> Dinonaktifkan
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                      <span>👤 {item.name}</span>
                      {item.nip && <span className="font-mono">NIP: {item.nip}</span>}
                      {item.note && <span className="text-slate-500 italic">({item.note})</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(item.email)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                        item.isActive
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {item.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.email)}
                      title="Hapus dari daftar"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0F172A] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Pengguna dengan email tidak terdaftar akan otomatis ditolak dan diarahkan ke layar login.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold cursor-pointer"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
}
