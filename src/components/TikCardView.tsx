import React, { useState } from 'react';
import { 
  CreditCard, 
  User, 
  BookOpen, 
  Users, 
  ShieldAlert, 
  Radio, 
  Plus, 
  Search, 
  Printer, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Trash2,
  Lock,
  Tag,
  Upload,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  X,
  FileCheck
} from 'lucide-react';
import { AppUser } from '../types';

export type TikCategory = 
  | 'D.IN.12' // Biodata
  | 'D.IN.13' // Barang Cetakan
  | 'D.IN.14' // Organisasi
  | 'D.IN.15' // Tersangka/Terdakwa/Terpidana
  | 'D.IN.16'; // Pengawasan Media Komunikasi

export interface TikCardItem {
  id: string;
  code: TikCategory;
  title: string;
  subjectName: string;
  categoryLabel: string;
  nomorRegister: string;
  dateRecorded: string;
  officer: string;
  details: Record<string, string>;
  threatLevel: 'RENDAH' | 'SEDANG' | 'TINGGI';
  status: 'AKTIF' | 'ARSIP' | 'DALAM_PROSES';
  summary: string;
}

const INITIAL_TIK_CARDS: TikCardItem[] = [
  {
    id: 'tik-01',
    code: 'D.IN.12',
    title: 'Kartu TIK Biodata Tokoh Kunci',
    subjectName: 'I Wayan Sudiarta, S.Sos.',
    categoryLabel: 'Biodata Tokoh Masyarakat / Politik',
    nomorRegister: 'TIK-BIO/01/II/2026',
    dateRecorded: '2026-02-15',
    officer: 'I Putu Arya, S.H.',
    threatLevel: 'RENDAH',
    status: 'AKTIF',
    summary: 'Tokoh penggerak aliansi petani subak dan pemerhati agraria di kawasan Tabanan Utara. Memiliki pengaruh signifikan terhadap dinamika kelompok massa.',
    details: {
      'Nama Lengkap': 'I Wayan Sudiarta, S.Sos.',
      'Tempat / Tgl Lahir': 'Tabanan, 18 Juli 1979',
      'Pekerjaan / Jabatan': 'Ketua Forum Komunikasi Subak Lestari Tabanan',
      'Alamat': 'Banjar Dinas Baturiti Kaja, Baturiti, Tabanan',
      'Riwayat Organisasi': 'Mantan Pengurus HKTI Bali, Presidium Warga Adat',
      'Afiliasi Politik': 'Independen / Non-Partai'
    }
  },
  {
    id: 'tik-02',
    code: 'D.IN.13',
    title: 'Kartu TIK Barang Cetakan',
    subjectName: 'Buku Risalah Gerakan Pembebasan Adat Tanah Ulayat',
    categoryLabel: 'Barang Cetakan / Literatur',
    nomorRegister: 'TIK-CET/04/II/2026',
    dateRecorded: '2026-02-10',
    officer: 'Gede Agus Wirawan, S.H.',
    threatLevel: 'SEDANG',
    status: 'DALAM_PROSES',
    summary: 'Peredaran pamflet dan buku saku tanpa ISBN yang memuat narasi provokatif penolakan batas tanah ulayat negara di wilayah Bedugul.',
    details: {
      'Judul Publikasi': 'Risalah Kedaulatan Tanah Adat & Batas Wilayah',
      'Penulis / Penerbit': 'Anonim / Percetakan Mandiri Luar Tabanan',
      'Jumlah Beredar': 'Sekitar 250 eksemplar',
      'Lokasi Penyebaran': 'Pasar Tradisional dan Balai Banjar Baturiti',
      'Analisis Isi': 'Berpotensi memicu sengketa horizontal antar warga desa adat'
    }
  },
  {
    id: 'tik-03',
    code: 'D.IN.14',
    title: 'Kartu TIK Organisasi',
    subjectName: 'Yayasan Harmoni Nusantara Tabanan',
    categoryLabel: 'Organisasi Kemasyarakatan / LSM',
    nomorRegister: 'TIK-ORG/02/I/2026',
    dateRecorded: '2026-01-20',
    officer: 'Kadek Mahendra, S.H.',
    threatLevel: 'RENDAH',
    status: 'AKTIF',
    summary: 'Organisasi sosial kemasyarakatan terdaftar resmi di Bakesbangpol, bergerak dalam bidang bantuan hukum dan pelestarian lingkungan hidup.',
    details: {
      'Nama Resmi': 'Yayasan Harmoni Nusantara Tabanan (YHNT)',
      'Akta Notaris / AHU': 'AHU-0012948.AH.01.04.Tahun 2023',
      'Alamat Kantor': 'Jl. Pahlawan No. 45, Delod Peken, Tabanan',
      'Ketua Umum': 'Dr. I Made Raka Sedana',
      'Sumber Pendanaan': 'Iuran Anggota dan Donasi CSR Legal'
    }
  },
  {
    id: 'tik-04',
    code: 'D.IN.15',
    title: 'Kartu TIK Tersangka / Terpidana',
    subjectName: 'I Ketut Darmawan alias Tut De',
    categoryLabel: 'Tersangka Tindak Pidana Korupsi LPD',
    nomorRegister: 'TIK-TP/03/II/2026',
    dateRecorded: '2026-02-04',
    officer: 'Kadek Mahendra, S.H.',
    threatLevel: 'TINGGI',
    status: 'DALAM_PROSES',
    summary: 'Mantan Pengurus LPD Desa Sunantaya yang telah ditetapkan sebagai Tersangka dalam dugaan tindak pidana korupsi penyalahgunaan dana nasabah LPD.',
    details: {
      'Nama / Alias': 'I Ketut Darmawan alias Tut De',
      'Pasal Disangkakan': 'Pasal 2 ayat (1), Pasal 3 UU Tipikor',
      'Nomor Sprindik': 'PRINT-02/N.1.17/Fd.1/01/2026',
      'Nilai Kerugian Negara': 'Rp 1.450.000.000,- (Hasil Audit BPKP)',
      'Status Penahanan': 'Rutan Kelas IIB Tabanan'
    }
  },
  {
    id: 'tik-05',
    code: 'D.IN.16',
    title: 'Kartu TIK Pengawasan Media Komunikasi',
    subjectName: 'Akun Media Sosial @suara_rakyat_tabanan_berani',
    categoryLabel: 'Pengawasan Siber & Akun Publik',
    nomorRegister: 'TIK-MED/07/II/2026',
    dateRecorded: '2026-02-18',
    officer: 'I Putu Arya, S.H.',
    threatLevel: 'SEDANG',
    status: 'AKTIF',
    summary: 'Akun TikTok & Facebook anonim penyebar narasi disinformasi terkait seleksi PPPK Kabupaten Tabanan dan ujaran kebencian terhadap pejabat daerah.',
    details: {
      'Platform': 'TikTok, Facebook & Telegram Channel',
      'Handle / URL': '@suara_rakyat_tabanan_berani',
      'Jumlah Pengikut': '14.200 Followers',
      'Hasil Patroli Siber': 'Ditemukan 3 video hoaks yang telah di-counter oleh Seksi Intelijen',
      'Tindak Lanjut': 'Profiling IP Address dan pengajuan takedown ke Komdigi'
    }
  }
];

export default function TikCardView({ currentUser }: { currentUser: AppUser | null }) {
  const [cards, setCards] = useState<TikCardItem[]>(INITIAL_TIK_CARDS);
  const [activeCode, setActiveCode] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCardForPrint, setSelectedCardForPrint] = useState<TikCardItem | null>(null);

  // CSV Modal State
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [csvError, setCsvError] = useState<string | null>(null);
  const [csvSuccessMessage, setCsvSuccessMessage] = useState<string | null>(null);

  // New Card Modal State
  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [newCard, setNewCard] = useState<Partial<TikCardItem>>({
    code: 'D.IN.12',
    title: 'Kartu TIK Biodata Tokoh',
    subjectName: '',
    categoryLabel: 'Biodata Tokoh',
    nomorRegister: `TIK-BIO/${Math.floor(Math.random() * 90 + 10)}/II/2026`,
    dateRecorded: new Date().toISOString().split('T')[0],
    officer: currentUser?.name || 'I Putu Arya, S.H.',
    threatLevel: 'SEDANG',
    status: 'AKTIF',
    summary: '',
    details: {
      'Nama Lengkap': '',
      'Alamat': '',
      'Pekerjaan / Jabatan': ''
    }
  });

  const tikTypes = [
    { code: 'ALL', label: 'Semua Kartu TIK' },
    { code: 'D.IN.12', label: 'D.IN.12 Biodata' },
    { code: 'D.IN.13', label: 'D.IN.13 Barang Cetakan' },
    { code: 'D.IN.14', label: 'D.IN.14 Organisasi' },
    { code: 'D.IN.15', label: 'D.IN.15 Tersangka/Terdakwa' },
    { code: 'D.IN.16', label: 'D.IN.16 Pengawasan Media' },
  ];

  const filteredCards = cards.filter((c) => {
    const matchesCode = activeCode === 'ALL' || c.code === activeCode;
    const matchesSearch = 
      c.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nomorRegister.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCode && matchesSearch;
  });

  // Handle Download CSV Template
  const handleDownloadCsvTemplate = () => {
    const csvContent = `code,title,subjectName,categoryLabel,nomorRegister,dateRecorded,officer,threatLevel,status,summary,detail_k1,detail_v1,detail_k2,detail_v2
D.IN.12,Kartu TIK Biodata Tokoh,I Made Sukarja,Tokoh Masyarakat,TIK-BIO/08/II/2026,2026-02-20,I Putu Arya S.H.,SEDANG,AKTIF,Tokoh penggerak desa wisata di Penebel,Alamat,Penebel Tabanan,Pekerjaan,Ketua Pokdarwis
D.IN.13,Kartu TIK Barang Cetakan,Buletin Warga Adat Tabanan,Publikasi Cetak,TIK-CET/09/II/2026,2026-02-18,Gede Agus S.H.,RENDAH,AKTIF,Peredaran buletin bulanan informasi seputar subak dan adat,Penerbit,Sekretariat Bersama Subak,Lokasi Beredar,Tabanan Kota
D.IN.14,Kartu TIK Organisasi,LSM Peduli Alam Lestari Tabanan,Organisasi Masyarakat,TIK-ORG/05/II/2026,2026-02-12,Kadek Mahendra S.H.,RENDAH,AKTIF,Ormas lingkungan hidup terdaftar Bakesbangpol,Akta Notaris,AHU-009812.2024,Ketua,I Wayan Kertayasa
D.IN.15,Kartu TIK Tersangka,I Wayan Budiarta,Tersangka Tipikor Dana Desa,TIK-TP/04/II/2026,2026-02-14,Kasi Intelijen,TINGGI,DALAM_PROSES,Tersangka dugaan penyalahgunaan APBDes 2024,Pasal,Pasal 2 ayat 1 UU Tipikor,Kerugian,Rp 350 Juta
D.IN.16,Kartu TIK Pengawasan Media,Halaman FB Forum Warga Tabanan Kritis,Media Sosial & Siber,TIK-MED/11/II/2026,2026-02-19,I Putu Arya S.H.,SEDANG,AKTIF,Akun grup FB dengan 25k anggota sering memuat kritik kebijakan daerah,Platform,Facebook Group,Pengikut,25.000 Akun`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `template_kartu_tik_kejaksaan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Process CSV Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content || '');
    };
    reader.readAsText(file);
  };

  const handleProcessCsvImport = () => {
    setCsvError(null);
    setCsvSuccessMessage(null);

    if (!csvText.trim()) {
      setCsvError('Mohon masukkan atau unggah teks CSV terlebih dahulu.');
      return;
    }

    try {
      const lines = csvText.trim().split(/\r?\n/);
      if (lines.length < 2) {
        setCsvError('File CSV minimal harus memiliki baris header dan minimal 1 baris data.');
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const newItems: TikCardItem[] = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map((c) => c.trim());
        if (row.length < 5) continue;

        const codeVal = (row[headers.indexOf('code')] || 'D.IN.12').toUpperCase() as TikCategory;
        const validCode: TikCategory = ['D.IN.12', 'D.IN.13', 'D.IN.14', 'D.IN.15', 'D.IN.16'].includes(codeVal)
          ? codeVal
          : 'D.IN.12';

        const subjectName = row[headers.indexOf('subjectname')] || row[2] || 'Subjek Baru';
        const title = row[headers.indexOf('title')] || `Kartu TIK ${validCode}`;
        const categoryLabel = row[headers.indexOf('categorylabel')] || 'Data TIK';
        const nomorRegister = row[headers.indexOf('nomorregister')] || `TIK/${Math.floor(Math.random() * 900 + 100)}/2026`;
        const dateRecorded = row[headers.indexOf('daterecorded')] || new Date().toISOString().split('T')[0];
        const officer = row[headers.indexOf('officer')] || currentUser?.name || 'Petugas Intelijen';
        const threatLevel = (row[headers.indexOf('threatlevel')] || 'SEDANG').toUpperCase() as any;
        const status = (row[headers.indexOf('status')] || 'AKTIF').toUpperCase() as any;
        const summary = row[headers.indexOf('summary')] || 'Catatan profiling intelijen.';

        // Extract key values if any
        const details: Record<string, string> = {};
        const k1 = row[headers.indexOf('detail_k1')];
        const v1 = row[headers.indexOf('detail_v1')];
        if (k1 && v1) details[k1] = v1;

        const k2 = row[headers.indexOf('detail_k2')];
        const v2 = row[headers.indexOf('detail_v2')];
        if (k2 && v2) details[k2] = v2;

        if (Object.keys(details).length === 0) {
          details['Nama / Subjek'] = subjectName;
          details['Tanggal Pencatatan'] = dateRecorded;
        }

        newItems.push({
          id: `tik-csv-${Date.now()}-${i}`,
          code: validCode,
          title,
          subjectName,
          categoryLabel,
          nomorRegister,
          dateRecorded,
          officer,
          threatLevel: ['RENDAH', 'SEDANG', 'TINGGI'].includes(threatLevel) ? threatLevel : 'SEDANG',
          status: ['AKTIF', 'ARSIP', 'DALAM_PROSES'].includes(status) ? status : 'AKTIF',
          summary,
          details
        });
      }

      if (newItems.length === 0) {
        setCsvError('Tidak ada baris data valid yang berhasil dibaca dari CSV.');
        return;
      }

      setCards((prev) => [...newItems, ...prev]);
      setCsvSuccessMessage(`Berhasil mengimpor ${newItems.length} data Kartu TIK baru!`);
      setTimeout(() => {
        setShowCsvModal(false);
        setCsvSuccessMessage(null);
        setCsvText('');
      }, 1200);
    } catch (err: any) {
      setCsvError(`Gagal memproses CSV: ${err.message || 'Format tidak valid'}`);
    }
  };

  const handleSaveNewCard = () => {
    if (!newCard.subjectName || !newCard.summary) {
      alert('Mohon isi nama subjek dan uraian singkat.');
      return;
    }

    const item: TikCardItem = {
      id: `tik-user-${Date.now()}`,
      code: newCard.code || 'D.IN.12',
      title: newCard.title || `Kartu TIK ${newCard.code}`,
      subjectName: newCard.subjectName,
      categoryLabel: newCard.categoryLabel || 'Data Intelijen',
      nomorRegister: newCard.nomorRegister || `TIK/${Math.floor(Math.random() * 900 + 100)}/2026`,
      dateRecorded: newCard.dateRecorded || new Date().toISOString().split('T')[0],
      officer: newCard.officer || currentUser?.name || 'Petugas Intelijen',
      details: newCard.details || {},
      threatLevel: newCard.threatLevel || 'SEDANG',
      status: newCard.status || 'AKTIF',
      summary: newCard.summary
    };

    setCards([item, ...cards]);
    setShowNewCardModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30">
                D.IN.12 s/d D.IN.16
              </span>
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">
                KARTU TIK INTELIJEN YUSTISIAL
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Bank Data & Kartu TIK Intelijen Kejaksaan
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              D.IN.12 (Biodata), D.IN.13 (Barang Cetakan), D.IN.14 (Organisasi), D.IN.15 (Tersangka/Terdakwa), dan D.IN.16 (Media Komunikasi)
            </p>
          </div>
        </div>

        {/* Action Buttons: Import CSV, Template & Tambah Kartu */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowCsvModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Import CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setShowNewCardModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kartu TIK</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {tikTypes.map((t) => (
            <button
              key={t.code}
              onClick={() => setActiveCode(t.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCode === t.code
                  ? 'bg-indigo-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari subjek / nomor register TIK..."
            className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* TIK Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-3xl p-5 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="font-mono text-[10px] font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30">
                    {card.code}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                    {card.nomorRegister}
                  </span>
                </div>

                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                  card.threatLevel === 'TINGGI'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : card.threatLevel === 'SEDANG'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  Atensi: {card.threatLevel}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-tight">
                {card.subjectName}
              </h3>
              <span className="text-xs text-amber-400/90 font-medium block mt-0.5">
                {card.categoryLabel}
              </span>

              <p className="text-xs text-slate-300 mt-2.5 line-clamp-3 leading-relaxed bg-[#0F172A] p-3 rounded-2xl border border-slate-800/80">
                "{card.summary}"
              </p>

              {/* Specific detail key-values */}
              <div className="mt-3 space-y-1 text-[11px] text-slate-400">
                {Object.entries(card.details).slice(0, 3).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between border-b border-slate-800/60 pb-1">
                    <span className="text-slate-500 truncate max-w-[120px]">{key}:</span>
                    <span className="text-slate-200 font-semibold truncate max-w-[160px]">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                Tgl: {card.dateRecorded}
              </span>

              <button
                onClick={() => setSelectedCardForPrint(card)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-indigo-400" />
                <span>Format PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-indigo-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Import Kartu TIK dari File CSV (D.IN.12 – D.IN.16)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Biodata, Barang Cetakan, Organisasi, Tersangka, dan Pengawasan Media
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
                <span className="font-semibold text-white">Template Format CSV:</span>
                <p className="text-[11px] text-slate-400">Unduh format kolom resmi untuk entri D.IN.12 s/d D.IN.16</p>
              </div>
              <button
                type="button"
                onClick={handleDownloadCsvTemplate}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Format CSV</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Pilih File CSV:
              </label>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/20 file:text-indigo-400 hover:file:bg-indigo-500/30 file:cursor-pointer cursor-pointer border border-slate-700 rounded-xl p-1 bg-[#0B1120]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Atau Review Isi Teks CSV:
              </label>
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="code,title,subjectName,categoryLabel,nomorRegister,dateRecorded,officer,threatLevel,status,summary..."
                rows={6}
                className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
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
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Proses & Masukkan ke Bank Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tambah Kartu TIK Baru Modal */}
      {showNewCardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-indigo-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Input Kartu TIK Baru
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Seksi Intelijen Kejaksaan Negeri Tabanan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewCardModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kategori TIK (D.IN):</label>
                <select
                  value={newCard.code}
                  onChange={(e) => {
                    const code = e.target.value as TikCategory;
                    const titles: Record<TikCategory, string> = {
                      'D.IN.12': 'Kartu TIK Biodata Tokoh',
                      'D.IN.13': 'Kartu TIK Barang Cetakan',
                      'D.IN.14': 'Kartu TIK Organisasi',
                      'D.IN.15': 'Kartu TIK Tersangka / Terdakwa',
                      'D.IN.16': 'Kartu TIK Pengawasan Media Komunikasi'
                    };
                    setNewCard({
                      ...newCard,
                      code,
                      title: titles[code]
                    });
                  }}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-2 text-slate-100 font-semibold"
                >
                  <option value="D.IN.12">D.IN.12 - Biodata Tokoh</option>
                  <option value="D.IN.13">D.IN.13 - Barang Cetakan</option>
                  <option value="D.IN.14">D.IN.14 - Organisasi / LSM</option>
                  <option value="D.IN.15">D.IN.15 - Tersangka / Terdakwa</option>
                  <option value="D.IN.16">D.IN.16 - Pengawasan Media</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nomor Register:</label>
                <input
                  type="text"
                  value={newCard.nomorRegister}
                  onChange={(e) => setNewCard({ ...newCard, nomorRegister: e.target.value })}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-2 text-slate-100 font-mono"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Nama Subjek / Judul Cetakan / Akun:</label>
                <input
                  type="text"
                  value={newCard.subjectName}
                  onChange={(e) => setNewCard({ ...newCard, subjectName: e.target.value })}
                  placeholder="Contoh: I Made Suarjana / Buku Risalah / @akun_siber"
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-2 text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tingkat Atensi:</label>
                <select
                  value={newCard.threatLevel}
                  onChange={(e) => setNewCard({ ...newCard, threatLevel: e.target.value as any })}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-2 text-slate-100"
                >
                  <option value="RENDAH">RENDAH</option>
                  <option value="SEDANG">SEDANG</option>
                  <option value="TINGGI">TINGGI</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Petugas Pencatat:</label>
                <input
                  type="text"
                  value={newCard.officer}
                  onChange={(e) => setNewCard({ ...newCard, officer: e.target.value })}
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-2 text-slate-100"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Uraian / Ringkasan Intelijen:</label>
                <textarea
                  rows={3}
                  value={newCard.summary}
                  onChange={(e) => setNewCard({ ...newCard, summary: e.target.value })}
                  placeholder="Uraian latar belakang, aktivitas, potensi AGHT..."
                  className="w-full bg-[#0B1120] border border-slate-700 rounded-xl p-2 text-slate-100"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewCardModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveNewCard}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Simpan Kartu TIK</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Preview for TIK Card in PDF Format */}
      {selectedCardForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 print:hidden">
              <span className="text-xs font-bold text-slate-500 uppercase">Standar Format KEP-135/A/JA/05/2019</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Cetak PDF
                </button>
                <button
                  onClick={() => setSelectedCardForPrint(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Official TIK Card Header */}
            <div className="text-center border-b pb-4">
              <div className="flex justify-between items-start text-xs font-serif font-bold">
                <span>KEJAKSAAN NEGERI TABANAN</span>
                <span className="font-mono">{selectedCardForPrint.code}</span>
              </div>
              <div className="my-1">
                <span className="text-xs tracking-widest font-black uppercase text-rose-700">R A H A S I A</span>
              </div>
              <h2 className="text-base font-serif font-bold uppercase underline">
                {selectedCardForPrint.title.toUpperCase()}
              </h2>
              <div className="text-xs font-mono mt-1">NOMOR REGISTER: {selectedCardForPrint.nomorRegister}</div>
            </div>

            {/* Content Details */}
            <div className="space-y-4 font-serif text-xs leading-relaxed">
              <div className="p-3 bg-slate-50 rounded border">
                <span className="font-bold block text-sm">{selectedCardForPrint.subjectName}</span>
                <span className="text-slate-600 text-xs italic">{selectedCardForPrint.categoryLabel}</span>
              </div>

              <div>
                <span className="font-bold underline block mb-1">I. Uraian Singkat / Latar Belakang Intelijen:</span>
                <p className="text-justify leading-relaxed">{selectedCardForPrint.summary}</p>
              </div>

              <div>
                <span className="font-bold underline block mb-2">II. Rincian Data / Atribut Khusus:</span>
                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <tbody>
                    {Object.entries(selectedCardForPrint.details).map(([k, v]) => (
                      <tr key={k} className="border-b border-slate-300">
                        <td className="p-2 font-bold w-1/3 bg-slate-100 border-r border-slate-300">{k}</td>
                        <td className="p-2">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signature */}
            <div className="pt-6 flex justify-end">
              <div className="text-center font-serif text-xs w-64">
                <p>Tabanan, {selectedCardForPrint.dateRecorded}</p>
                <p className="font-bold mt-1 uppercase">Petugas Pencatat TIK</p>
                <div className="h-14"></div>
                <p className="font-bold underline">{selectedCardForPrint.officer}</p>
                <p className="font-mono text-[10px]">Pangkat / NIP Intelijen</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
