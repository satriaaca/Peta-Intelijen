import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  FileText, 
  Search, 
  Printer, 
  ShieldAlert, 
  Calendar, 
  MapPin, 
  Globe, 
  Phone, 
  Briefcase, 
  FileCheck, 
  Trash2, 
  Edit3, 
  CheckCircle2,
  AlertTriangle,
  Upload,
  User
} from 'lucide-react';
import { AppUser } from '../types';

export interface ForeignerEntry {
  id: string;
  nomorSurat: string; // e.g. "B-04/L.1.17/D.IN.10/02/2026"
  fullName: string;
  alias: string;
  birthPlaceDate: string; // e.g. "Sydney, 14 Mei 1988"
  nationality: string; // e.g. "Australia"
  gender: 'Laki-laki' | 'Perempuan';
  homeCountryAddress: string;
  indonesiaAddress: string; // Tempat tinggal sementara & contact person/sponsor
  phone: string;
  occupation: string;
  religion: string;
  education: string;
  passportKitasNo: string;
  passportIssueExpiry: string; // e.g. "Canberra, Berlaku s/d 2029"
  stayReason: string;
  stayDuration: string;
  recommendationNoDate: string; // Kemenlu/Kemenkumham/Kemenaker
  notes: string; // Keterangan dan tindak pidana/pengawasan
  photoUrl?: string;
  signOfficer: string;
  signOfficerTitle: string;
  signOfficerNip: string;
  status: 'DALAM_PENGAWASAN' | 'DICEKAL' | 'DEPORTASI' | 'BERKAS_LENGKAP';
  createdAt: number;
}

const INITIAL_FOREIGNERS: ForeignerEntry[] = [
  {
    id: 'for-01',
    nomorSurat: 'B-12/L.1.17/D.IN.10/02/2026',
    fullName: 'David Jonathan Miller',
    alias: 'Dave',
    birthPlaceDate: 'Melbourne, 12 Agustus 1985',
    nationality: 'Australia',
    gender: 'Laki-laki',
    homeCountryAddress: '45 St Kilda Rd, Melbourne VIC 3004, Australia',
    indonesiaAddress: 'Villa Sunset Indah, Banjar Nyanyi, Beraban, Kediri, Tabanan (CP: Made Suardana - 081234567890)',
    phone: '+6281399887766',
    occupation: 'Konsultan Properti Lepas',
    religion: 'Kristen',
    education: 'Bachelor of Commerce, University of Melbourne',
    passportKitasNo: 'PA8847291 / KITAS 2C11AB89',
    passportIssueExpiry: 'Melbourne, Berlaku s/d 12 Des 2028',
    stayReason: 'Investasi dan Pengelolaan Vila Agrowisata',
    stayDuration: '1 Tahun (Perpanjangan ke-2)',
    recommendationNoDate: 'W20.IMI.IMI.1-UM.01.01-1452 Tgl 10 Januari 2026',
    notes: 'Dipantau terkait dugaan penyalahgunaan izin tinggal investasi untuk transaksi jual beli tanah sempadan pantai tanpa badan hukum Indonesia (PT PMA). Berkoordinasi dengan Tim PORA dan Imigrasi Denpasar.',
    signOfficer: 'I Putu Gede Mahendra, S.H., M.H.',
    signOfficerTitle: 'KASI INTELIJEN KEJARI TABANAN',
    signOfficerNip: '19840512 200812 1 002',
    status: 'DALAM_PENGAWASAN',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'for-02',
    nomorSurat: 'B-09/L.1.17/D.IN.10/01/2026',
    fullName: 'Anastasia Ivanova',
    alias: 'Nastya',
    birthPlaceDate: 'Moscow, 23 November 1992',
    nationality: 'Rusia',
    gender: 'Perempuan',
    homeCountryAddress: 'Tverskaya St 18, Moscow, Russia',
    indonesiaAddress: 'Homestay Jatiluwih Eco, Kec. Penebel, Tabanan (Sponsor: CV Bali Harmoni)',
    phone: '+6281987654321',
    occupation: 'Fotografer & Digital Nomad',
    religion: 'Ortodoks',
    education: 'Moscow State University',
    passportKitasNo: '75N092841 / Visa On Arrival B211A',
    passportIssueExpiry: 'Moscow, Berlaku s/d 04 Juli 2027',
    stayReason: 'Wisata dan Pembuatan Konten Lanskap Budaya',
    stayDuration: '60 Hari',
    recommendationNoDate: 'Surat Izin Kemenparekraf No. 441/DP/2026',
    notes: 'Dilakukan profiling terkait aktivitas komersial fotografi tanpa visa kerja di situs warisan dunia UNESCO Jatiluwih.',
    signOfficer: 'I Putu Gede Mahendra, S.H., M.H.',
    signOfficerTitle: 'KASI INTELIJEN KEJARI TABANAN',
    signOfficerNip: '19840512 200812 1 002',
    status: 'BERKAS_LENGKAP',
    createdAt: Date.now() - 86400000 * 20,
  }
];

interface ForeignerFormViewProps {
  currentUser: AppUser | null;
}

export default function ForeignerFormView({ currentUser }: ForeignerFormViewProps) {
  const [foreigners, setForeigners] = useState<ForeignerEntry[]>(INITIAL_FOREIGNERS);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedForPrint, setSelectedForPrint] = useState<ForeignerEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Form State
  const [nomorSurat, setNomorSurat] = useState('');
  const [fullName, setFullName] = useState('');
  const [alias, setAlias] = useState('');
  const [birthPlaceDate, setBirthPlaceDate] = useState('');
  const [nationality, setNationality] = useState('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [homeCountryAddress, setHomeCountryAddress] = useState('');
  const [indonesiaAddress, setIndonesiaAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [religion, setReligion] = useState('');
  const [education, setEducation] = useState('');
  const [passportKitasNo, setPassportKitasNo] = useState('');
  const [passportIssueExpiry, setPassportIssueExpiry] = useState('');
  const [stayReason, setStayReason] = useState('');
  const [stayDuration, setStayDuration] = useState('');
  const [recommendationNoDate, setRecommendationNoDate] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'DALAM_PENGAWASAN' | 'DICEKAL' | 'DEPORTASI' | 'BERKAS_LENGKAP'>('DALAM_PENGAWASAN');

  const handleOpenAddForm = () => {
    const nextNum = foreigners.length + 1;
    const padNum = String(nextNum).padStart(2, '0');
    setNomorSurat(`B-${padNum}/L.1.17/D.IN.10/${new Date().getMonth() + 1}/${new Date().getFullYear()}`);
    setFullName('');
    setAlias('');
    setBirthPlaceDate('');
    setNationality('');
    setGender('Laki-laki');
    setHomeCountryAddress('');
    setIndonesiaAddress('');
    setPhone('');
    setOccupation('');
    setReligion('');
    setEducation('');
    setPassportKitasNo('');
    setPassportIssueExpiry('');
    setStayReason('');
    setStayDuration('');
    setRecommendationNoDate('');
    setNotes('');
    setStatus('DALAM_PENGAWASAN');
    setShowFormModal(true);
  };

  const handleSaveForeigner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !nationality || !passportKitasNo) return;

    const newEntry: ForeignerEntry = {
      id: `for-${Date.now()}`,
      nomorSurat,
      fullName,
      alias: alias || '-',
      birthPlaceDate,
      nationality,
      gender,
      homeCountryAddress,
      indonesiaAddress,
      phone,
      occupation,
      religion,
      education,
      passportKitasNo,
      passportIssueExpiry,
      stayReason,
      stayDuration,
      recommendationNoDate,
      notes,
      signOfficer: currentUser?.name || 'KASI INTELIJEN KEJARI TABANAN',
      signOfficerTitle: 'KASI INTELIJEN / KASUBSI INTELIJEN',
      signOfficerNip: currentUser?.nip || '19840512 200812 1 002',
      status,
      createdAt: Date.now(),
    };

    setForeigners([newEntry, ...foreigners]);
    setShowFormModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus data pengawasan orang asing ini?')) {
      setForeigners(foreigners.filter(f => f.id !== id));
    }
  };

  const filtered = foreigners.filter((f) => {
    const matchesSearch = 
      f.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.passportKitasNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || f.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <UserCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-teal-400 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/30">
                  D.IN.10
                </span>
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">
                  R A H A S I A
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Formulir & Register Data Orang Asing (WNA)
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Pengawasan Orang Asing (POA) & Cekal Wilayah Hukum Kejaksaan Negeri Tabanan (KEP-135/A/JA/05/2019)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenAddForm}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Input Data Orang Asing Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Status Filter */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterStatus === 'ALL' ? 'bg-slate-800 text-teal-400 border border-teal-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua ({foreigners.length})
          </button>
          <button
            onClick={() => setFilterStatus('DALAM_PENGAWASAN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterStatus === 'DALAM_PENGAWASAN' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dalam Pengawasan
          </button>
          <button
            onClick={() => setFilterStatus('DICEKAL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterStatus === 'DICEKAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cekal
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama / paspor / negara..."
            className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Foreigners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-3xl p-5 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                      {item.nomorSurat}
                    </span>
                    <span className="text-[10px] text-rose-400 font-semibold uppercase">RAHASIA</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5">{item.fullName}</h3>
                  <p className="text-xs text-slate-400">
                    Alias: <b className="text-slate-200">{item.alias}</b> • WNA: <b className="text-amber-400">{item.nationality}</b>
                  </p>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                  item.status === 'DALAM_PENGAWASAN'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : item.status === 'DICEKAL'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-2 text-xs bg-[#0F172A] p-3.5 rounded-2xl border border-slate-800/80 mb-3">
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-500 block">No. Paspor / KITAS</span>
                    <span className="font-mono font-bold text-teal-300">{item.passportKitasNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Pekerjaan</span>
                    <span>{item.occupation || '-'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block">Tempat Tinggal di Tabanan</span>
                  <span className="text-slate-200 line-clamp-1">{item.indonesiaAddress}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block">Catatan Intelijen & Perkara</span>
                  <p className="text-slate-300 italic line-clamp-2 leading-relaxed">"{item.notes}"</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Pencatat: {item.signOfficer}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedForPrint(item)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-teal-400" />
                  <span>Cetak D.IN.10</span>
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-xl hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form Input D.IN.10 */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0B1120] border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-teal-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Formulir Data Orang Asing (D.IN.10)</h3>
                  <span className="text-[10px] text-rose-400 font-bold uppercase">Klasifikasi: RAHASIA</span>
                </div>
              </div>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-xl bg-slate-800"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSaveForeigner} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Nomor Surat (D.IN.10)</label>
                  <input
                    type="text"
                    value={nomorSurat}
                    onChange={(e) => setNomorSurat(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Status Pengawasan</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="DALAM_PENGAWASAN">DALAM PENGAWASAN</option>
                    <option value="DICEKAL">DICEKAL (CEGAH TANGKAL)</option>
                    <option value="DEPORTASI">USULAN DEPORTASI</option>
                    <option value="BERKAS_LENGKAP">BERKAS LENGKAP / AMAN</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">1. Nama Lengkap</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Johnathan Doe"
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">2. Nama Lain / Alias</label>
                  <input
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder="e.g. Johnny"
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">3. Tempat/Tgl Lahir</label>
                  <input
                    type="text"
                    value={birthPlaceDate}
                    onChange={(e) => setBirthPlaceDate(e.target.value)}
                    placeholder="e.g. Sydney, 12-05-1988"
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">4. Kewarganegaraan</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="e.g. Australia / Rusia"
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">5. Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={(e: any) => setGender(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">6a. Alamat Negara Asal</label>
                  <textarea
                    rows={2}
                    value={homeCountryAddress}
                    onChange={(e) => setHomeCountryAddress(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">6b. Alamat Sementara & Kontak Person</label>
                  <textarea
                    rows={2}
                    value={indonesiaAddress}
                    onChange={(e) => setIndonesiaAddress(e.target.value)}
                    placeholder="Alamat di Tabanan + Sponsor / Contact Person"
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">7. No. Telepon / HP</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">8. Pekerjaan</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">11. No. Paspor / KITAS</label>
                  <input
                    type="text"
                    value={passportKitasNo}
                    onChange={(e) => setPassportKitasNo(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">16. Keterangan & Masalah / Dugaan Pelanggaran</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Uraian tindak pidana, status visa, atau pengawasan intelijen..."
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg"
                >
                  Simpan Data D.IN.10
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Print Preview Modal for D.IN.10 */}
      {selectedForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-4xl p-6 sm:p-10 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 print:hidden">
              <span className="text-xs font-bold text-slate-500 uppercase">Pratinjau Cetak Standar KEP-135/A/JA/05/2019</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Cetak Sekarang
                </button>
                <button
                  onClick={() => setSelectedForPrint(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Official Header */}
            <div className="text-center relative">
              <div className="flex justify-between items-start">
                <span className="text-xs font-serif font-bold underline">KEJAKSAAN NEGERI TABANAN</span>
                <span className="text-xs font-mono font-bold">D.IN.10</span>
              </div>
              <div className="my-2">
                <span className="text-sm tracking-widest font-black uppercase">R A H A S I A</span>
              </div>
              <h2 className="text-base font-serif font-bold uppercase underline">FORMULIR DATA ORANG ASING</h2>
              <div className="text-xs font-mono mt-1">NOMOR : {selectedForPrint.nomorSurat}</div>
            </div>

            {/* 16 Fields Layout */}
            <div className="grid grid-cols-12 gap-4 text-xs font-serif leading-relaxed">
              <div className="col-span-9 space-y-2">
                <div className="grid grid-cols-12"><span className="col-span-4">1. Nama lengkap</span><span className="col-span-8 font-bold">: {selectedForPrint.fullName}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4">2. Nama lain (Alias)</span><span className="col-span-8">: {selectedForPrint.alias}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4">3. Tempat / Tgl Lahir</span><span className="col-span-8">: {selectedForPrint.birthPlaceDate}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4">4. Kewarganegaraan</span><span className="col-span-8 font-semibold">: {selectedForPrint.nationality}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4">5. Jenis Kelamin</span><span className="col-span-8">: {selectedForPrint.gender}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4">6. Tempat Tinggal</span><span className="col-span-8">: </span></div>
                <div className="grid grid-cols-12 pl-4"><span className="col-span-4">a. Negara Asal</span><span className="col-span-8">: {selectedForPrint.homeCountryAddress}</span></div>
                <div className="grid grid-cols-12 pl-4"><span className="col-span-4">b. Sementara (Indonesia)</span><span className="col-span-8">: {selectedForPrint.indonesiaAddress}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4">7. No. Telp / HP</span><span className="col-span-8">: {selectedForPrint.phone}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4">8. Pekerjaan</span><span className="col-span-8">: {selectedForPrint.occupation}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4">9. Agama</span><span className="col-span-8">: {selectedForPrint.religion || '-'}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4">10. Pendidikan</span><span className="col-span-8">: {selectedForPrint.education || '-'}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4">11. No. Paspor / KITAS</span><span className="col-span-8 font-bold font-mono">: {selectedForPrint.passportKitasNo}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4">12. Penerbit & Masa Berlaku</span><span className="col-span-8">: {selectedForPrint.passportIssueExpiry}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4">13. Alasan Tinggal</span><span className="col-span-8">: {selectedForPrint.stayReason}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4">14. Lama Tinggal</span><span className="col-span-8">: {selectedForPrint.stayDuration}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4">15. Rekomendasi Instansi</span><span className="col-span-8">: {selectedForPrint.recommendationNoDate || '-'}</span></div>
                <div className="grid grid-cols-12"><span className="col-span-4">16. Keterangan / Catatan</span><span className="col-span-8">: {selectedForPrint.notes}</span></div>
              </div>

              {/* Photo 4x6 frame */}
              <div className="col-span-3 flex flex-col items-center justify-start pt-4">
                <div className="w-28 h-36 border-2 border-dashed border-slate-400 flex flex-col items-center justify-center text-[10px] text-slate-500 font-sans p-2 text-center">
                  <User className="w-8 h-8 text-slate-400 mb-1" />
                  <span>Pas Foto</span>
                  <span>Ukuran 4x6</span>
                </div>
              </div>
            </div>

            {/* Signature Block */}
            <div className="pt-8 flex justify-end">
              <div className="text-center font-serif text-xs w-64">
                <p>Tabanan, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="font-bold mt-1 uppercase">{selectedForPrint.signOfficerTitle}</p>
                <div className="h-16"></div>
                <p className="font-bold underline">{selectedForPrint.signOfficer}</p>
                <p className="font-mono text-[11px]">Pangkat/NIP. {selectedForPrint.signOfficerNip}</p>
              </div>
            </div>

            <div className="text-center text-[10px] font-bold tracking-widest text-slate-400 uppercase border-t pt-2">
              R A H A S I A
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
