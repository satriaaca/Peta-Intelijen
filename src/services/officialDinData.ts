// Definition of Official Intelligence Sectors and Symbols
// Based on Lampiran IV Keputusan Jaksa Agung RI Nomor KEP-135/A/JA/05/2019

export interface OfficialSubsectorSymbol {
  id: string; // e.g. 'DIN2-01'
  no: number;
  sectionCode: 'D.IN.2' | 'D.IN.3' | 'D.IN.4' | 'D.IN.5' | 'D.IN.6';
  name: string;
  category: string;
  badgeCode: string; // Short code
  themeColor: string; // e.g. '#10B981'
  iconType: string;
  description: string;
}

export interface OfficialSectionConfig {
  id: 'D.IN.1' | 'D.IN.2' | 'D.IN.3' | 'D.IN.4' | 'D.IN.5' | 'D.IN.6' | 'D.IN.7' | 'D.IN.8' | 'D.IN.9' | 'D.IN.10' | 'D.IN.11' | 'D.IN.12' | 'D.IN.13' | 'D.IN.14' | 'D.IN.15' | 'D.IN.16';
  code: string;
  name: string;
  shortName: string;
  legalTitle: string;
  description: string;
  subsectors?: OfficialSubsectorSymbol[];
}

export const OFFICIAL_SECTOR_SYMBOLS: Record<string, OfficialSubsectorSymbol[]> = {
  'D.IN.2': [
    { id: 'DIN2-01', no: 1, sectionCode: 'D.IN.2', name: 'Pengamanan Pancasila', category: 'Ideologi', badgeCode: 'PANCASILA', themeColor: '#F59E0B', iconType: 'pancasila', description: 'Pengamanan falsafah dan ideologi negara Pancasila dari rongrongan ideologi bertentangan.' },
    { id: 'DIN2-02', no: 2, sectionCode: 'D.IN.2', name: 'Persatuan dan Kesatuan Bangsa', category: 'Ideologi', badgeCode: 'PERSATUAN', themeColor: '#EF4444', iconType: 'flag_indonesia', description: 'Pemeliharaan integrasi nasional, wawasan kebangsaan, dan pencegahan disintegrasi.' },
    { id: 'DIN2-03', no: 3, sectionCode: 'D.IN.2', name: 'Gerakan Separatis', category: 'Pertahanan Keamanan', badgeCode: 'SEPARATIS', themeColor: '#DC2626', iconType: 'separatis', description: 'Deteksi dini dan penggalangan terhadap potensi gerakan separatisme bersenjata maupun politik.' },
    { id: 'DIN2-04', no: 4, sectionCode: 'D.IN.2', name: 'Penyelenggaraan Pemerintahan', category: 'Politik', badgeCode: 'PEMERINTAHAN', themeColor: '#3B82F6', iconType: 'governance', description: 'Stabilitas penyelenggaraan birokrasi, netralitas ASN, dan kelancaran pemerintahan daerah.' },
    { id: 'DIN2-05', no: 5, sectionCode: 'D.IN.2', name: 'Partai Politik, Pemilu, Pilkada', category: 'Politik', badgeCode: 'PEMILU', themeColor: '#8B5CF6', iconType: 'ballot', description: 'Pemantauan dinamika partai politik, tahapan pemilihan umum, Pilkada serentak, dan sengketa politik.' },
    { id: 'DIN2-06', no: 6, sectionCode: 'D.IN.2', name: 'Gerakan Terorisme & Radikalisme', category: 'Pertahanan Keamanan', badgeCode: 'TERORISME', themeColor: '#B91C1C', iconType: 'terrorism', description: 'Deteksi dan pencegahan sel-sel terorisme, paham radikal, intoleransi, dan ekstrimisme kekerasan.' },
    { id: 'DIN2-08', no: 8, sectionCode: 'D.IN.2', name: 'Pengawasan Wilayah Teritorial', category: 'Pertahanan Keamanan', badgeCode: 'TERITORIAL', themeColor: '#10B981', iconType: 'territory', description: 'Pemantauan tapal batas, keamanan wilayah teritorial hukum darat, pesisir, dan perairan.' },
    { id: 'DIN2-09', no: 9, sectionCode: 'D.IN.2', name: 'Kejahatan Siber', category: 'Keamanan Siber', badgeCode: 'SIBER', themeColor: '#06B6D4', iconType: 'cyber_crime', description: 'Pengawasan serangan siber, peretasan data instansi, pencurian identitas digital, dan judi online.' },
    { id: 'DIN2-10', no: 10, sectionCode: 'D.IN.2', name: 'Cekal (Cegah Tangkal)', category: 'Cekal PORA', badgeCode: 'CEKAL', themeColor: '#F97316', iconType: 'cekal', description: 'Administrasi pencegahan ke luar negeri dan penangkalan masuk bagi subjek hukum perkara.' },
    { id: 'DIN2-11', no: 11, sectionCode: 'D.IN.2', name: 'Pengawasan Orang Asing (POA)', category: 'Cekal PORA', badgeCode: 'POA', themeColor: '#14B8A6', iconType: 'foreigner', description: 'Pemantauan pergerakan, izin tinggal, penyalahgunaan visa, dan pelanggaran hukum warga negara asing.' },
    { id: 'DIN2-12', no: 12, sectionCode: 'D.IN.2', name: 'Pengamanan Sumber Daya Organisasi Kejaksaan', category: 'Pengamanan Internal', badgeCode: 'PAM_SDO', themeColor: '#059669', iconType: 'adhyaksa_shield', description: 'Pengamanan personel, materiil, dokumen, dan instalasi kantor Kejaksaan RI (PAM SDO).' },
    { id: 'DIN2-13', no: 13, sectionCode: 'D.IN.2', name: 'Pengamanan Penanganan Perkara', category: 'Pengamanan Yustisial', badgeCode: 'PAM_PERKARA', themeColor: '#D97706', iconType: 'justice_gavel', description: 'Pengamanan jaksa penuntut umum, saksi/korban, persidangan berisiko tinggi, dan barang bukti.' },
  ],
  'D.IN.3': [
    { id: 'DIN3-01', no: 1, sectionCode: 'D.IN.3', name: 'Pengawasan Peredaran Barang Cetakan Dalam Negeri', category: 'Barang Cetakan', badgeCode: 'CETAKAN_DN', themeColor: '#0284C7', iconType: 'book_print', description: 'Pengawasan buku, majalah, pamflet berpotensi merusak moral bangsa atau memuat ajaran terlarang.' },
    { id: 'DIN3-02', no: 2, sectionCode: 'D.IN.3', name: 'Pengawasan Peredaran Import Barang Cetakan', category: 'Barang Cetakan', badgeCode: 'CETAKAN_LN', themeColor: '#2563EB', iconType: 'import_book', description: 'Pengawasan masuknya literatur luar negeri yang mengancam kedaulatan dan Pancasila.' },
    { id: 'DIN3-03', no: 3, sectionCode: 'D.IN.3', name: 'Pengawasan Sistem Perbukuan', category: 'Pendidikan', badgeCode: 'PERBUKUAN', themeColor: '#4F46E5', iconType: 'library', description: 'Evaluasi konten buku pelajaran dan referensi nasional dari penyusupan konten menyimpang.' },
    { id: 'DIN3-04', no: 4, sectionCode: 'D.IN.3', name: 'Pengawasan Media Komunikasi', category: 'Media Komunikasi', badgeCode: 'MEDIA_KOM', themeColor: '#7C3AED', iconType: 'broadcast', description: 'Pemantauan siaran televisi, radio, publikasi pers, dan media transmisi informasi publik.' },
    { id: 'DIN3-05', no: 5, sectionCode: 'D.IN.3', name: 'Pengawasan Aliran Kepercayaan & Keagamaan (PAKEM)', category: 'PAKEM', badgeCode: 'PAKEM', themeColor: '#D97706', iconType: 'religion_harmony', description: 'Koordinasi Tim PAKEM dalam membina aliran kepercayaan yang menyimpang agar kembali ke koridor hukum.' },
    { id: 'DIN3-06', no: 6, sectionCode: 'D.IN.3', name: 'Pencegahan Penodaan & Penistaan Agama', category: 'Agama', badgeCode: 'PENODAAN_AGAMA', themeColor: '#DC2626', iconType: 'mosque_temple', description: 'Pencegahan penodaan atau penghinaan terhadap simbol serta ajaran agama yang diakui di Indonesia.' },
    { id: 'DIN3-07', no: 7, sectionCode: 'D.IN.3', name: 'Ketahanan Budaya', category: 'Kebudayaan', badgeCode: 'BUDAYA', themeColor: '#E11D48', iconType: 'culture_heritage', description: 'Pelestarian adat istiadat luhur Nusantara dan kearifan lokal (Tri Hita Karana / Desa Adat).' },
    { id: 'DIN3-08', no: 8, sectionCode: 'D.IN.3', name: 'Pemberdayaan Masyarakat Desa', category: 'Sosial', badgeCode: 'DESA', themeColor: '#16A34A', iconType: 'village', description: 'Pendampingan hukum masyarakat pedesaan, tata kelola keuangan desa, dan Subak.' },
    { id: 'DIN3-09', no: 9, sectionCode: 'D.IN.3', name: 'Pengawasan Organisasi Masyarakat & LSM', category: 'Ormas', badgeCode: 'ORMAS_LSM', themeColor: '#EA580C', iconType: 'ngo_group', description: 'Monitoring legalitas, sumber dana, kepengurusan, dan aktivitas ormas maupun LSM lokal/asing.' },
    { id: 'DIN3-10', no: 10, sectionCode: 'D.IN.3', name: 'Pencegahan Konflik Sosial', category: 'Sosial', badgeCode: 'KONFLIK_SOSIAL', themeColor: '#C026D3', iconType: 'peace_hand', description: 'Sistem peringatan dini (early warning system) peredaman gesekan antar kelompok warga.' },
    { id: 'DIN3-11', no: 11, sectionCode: 'D.IN.3', name: 'Ketertiban dan Ketentraman Umum (Trantibum)', category: 'Trantibum', badgeCode: 'TRANTIBUM', themeColor: '#059669', iconType: 'public_order', description: 'Pemeliharaan kenyamanan ruang publik, pencegahan premanisme, dan ketertiban sipil.' },
    { id: 'DIN3-12', no: 12, sectionCode: 'D.IN.3', name: 'Pembinaan Masyarakat Taat Hukum (Binmatkum)', category: 'Binmatkum', badgeCode: 'BINMATKUM', themeColor: '#0D9488', iconType: 'law_abiding', description: 'Edukasi kesadaran hukum masyarakat agar patuh terhadap peraturan perundang-undangan.' },
  ],
  'D.IN.4': [
    { id: 'DIN4-01', no: 1, sectionCode: 'D.IN.4', name: 'Lembaga Keuangan', category: 'Perbankan', badgeCode: 'LEMBAGA_KEU', themeColor: '#2563EB', iconType: 'bank', description: 'Pengawasan bank daerah, LPD (Lembaga Perkreditan Desa), koperasi simpan pinjam, dan fintech.' },
    { id: 'DIN4-02', no: 2, sectionCode: 'D.IN.4', name: 'Keuangan Negara', category: 'Keuangan Negara', badgeCode: 'KEU_NEGARA', themeColor: '#059669', iconType: 'coins_vault', description: 'Pencegahan kebocoran APBD, penyelewengan dana hibah, bansos, dan perbendaharaan daerah.' },
    { id: 'DIN4-03', no: 3, sectionCode: 'D.IN.4', name: 'Moneter', category: 'Moneter', badgeCode: 'MONETER', themeColor: '#0D9488', iconType: 'chart_growth', description: 'Pemantauan stabilitas nilai tukar, suku bunga, dan penanggulangan peredaran uang palsu.' },
    { id: 'DIN4-04', no: 4, sectionCode: 'D.IN.4', name: 'Penelusuran Aset (Asset Tracing)', category: 'Aset Recovery', badgeCode: 'ASET_TRACING', themeColor: '#D97706', iconType: 'asset_recovery', description: 'Pelacakan aset hasil kejahatan korupsi dan tindak pidana pencucian uang (TPPU).' },
    { id: 'DIN4-05', no: 5, sectionCode: 'D.IN.4', name: 'Investasi / Penanaman Modal', category: 'Investasi', badgeCode: 'INVESTASI', themeColor: '#10B981', iconType: 'invest_plant', description: 'Pengawalan iklim investasi PMA/PMDN dan pencegahan skema investasi bodong/ilegal.' },
    { id: 'DIN4-06', no: 6, sectionCode: 'D.IN.4', name: 'Perpajakan', category: 'Fiskal', badgeCode: 'PAJAK', themeColor: '#DC2626', iconType: 'tax_stamp', description: 'Pengawasan kepatuhan pajak daerah, PBB-P2, BPHTB, dan penindakan faktur pajak fiktif.' },
    { id: 'DIN4-07', no: 7, sectionCode: 'D.IN.4', name: 'Kepabeanan', category: 'Bea Cukai', badgeCode: 'PABEAN', themeColor: '#0284C7', iconType: 'cargo_ship', description: 'Pengawasan arus barang ekspor/impor melalui pelabuhan dan bandara dari penyelundupan.' },
    { id: 'DIN4-08', no: 8, sectionCode: 'D.IN.4', name: 'Cukai', category: 'Bea Cukai', badgeCode: 'CUKAI', themeColor: '#9333EA', iconType: 'excise_stamp', description: 'Pemberantasan rokok ilegal tanpa pita cukai dan minuman beralkohol ilegal (MMEA).' },
    { id: 'DIN4-09', no: 9, sectionCode: 'D.IN.4', name: 'Perdagangan', category: 'Perekonomian', badgeCode: 'PERDAGANGAN', themeColor: '#EA580C', iconType: 'trade_scale', description: 'Stabilitas rantai pasok pangan pokok, pencegahan penimbunan beras/minyak goreng.' },
    { id: 'DIN4-10', no: 10, sectionCode: 'D.IN.4', name: 'Perindustrian', category: 'Perekonomian', badgeCode: 'INDUSTRI', themeColor: '#475569', iconType: 'factory_gear', description: 'Pengawasan standarisasi SNI, industri pengolahan hasil bumi, dan limbah industri pabrik.' },
    { id: 'DIN4-11', no: 11, sectionCode: 'D.IN.4', name: 'Ketenagakerjaan', category: 'Ketenagakerjaan', badgeCode: 'NAKER', themeColor: '#3B82F6', iconType: 'workers', description: 'Pemantauan UMK Tabanan, kepatuhan BPJS Ketenagakerjaan, dan perselisihan hubungan industrial.' },
    { id: 'DIN4-12', no: 12, sectionCode: 'D.IN.4', name: 'Perkebunan', category: 'Agraris', badgeCode: 'PERKEBUNAN', themeColor: '#16A34A', iconType: 'plantation', description: 'Pengawasan komoditas kopi Robusta Pupuan, kakao, cengkeh, dan peremajaan tanaman.' },
    { id: 'DIN4-13', no: 13, sectionCode: 'D.IN.4', name: 'Kehutanan', category: 'Sumber Daya Alam', badgeCode: 'KEHUTANAN', themeColor: '#15803D', iconType: 'forest', description: 'Pencegahan pembalakan liar (illegal logging) dan perambahan kawasan hutan lindung Batukaru.' },
    { id: 'DIN4-14', no: 14, sectionCode: 'D.IN.4', name: 'Lingkungan Hidup', category: 'Lingkungan', badgeCode: 'LINGKUNGAN', themeColor: '#10B981', iconType: 'eco_globe', description: 'Penegakan hukum pencemaran Daerah Aliran Sungai (DAS), Danau Beratan, dan sampah TPA.' },
    { id: 'DIN4-15', no: 15, sectionCode: 'D.IN.4', name: 'Perikanan', category: 'Maritim', badgeCode: 'PERIKANAN', themeColor: '#0284C7', iconType: 'fish', description: 'Pengawasan nelayan pantai selatan Yeh Gangga/Kelating, bantuan kapal, dan budidaya ikan.' },
    { id: 'DIN4-16', no: 16, sectionCode: 'D.IN.4', name: 'Agraria / Tata Ruang (Mafia Tanah)', category: 'Agraria', badgeCode: 'AGRARIA_MAFIA', themeColor: '#B45309', iconType: 'land_cert', description: 'Pemberantasan sindikat mafia tanah, penyerobotan sempadan pantai/jurang, dan sertifikasi PTSL.' },
  ],
  'D.IN.5': [
    { id: 'DIN5-01', no: 1, sectionCode: 'D.IN.5', name: 'Infrastruktur Jalan', category: 'Transportasi', badgeCode: 'PPS_JALAN', themeColor: '#475569', iconType: 'road_bridge', description: 'Pengamanan proyek jalan Bypass, pelebaran jalan nasional Denpasar-Gilimanuk, jalan kabupaten.' },
    { id: 'DIN5-02', no: 2, sectionCode: 'D.IN.5', name: 'Infrastruktur Perkeretaapian', category: 'Transportasi', badgeCode: 'PPS_KERETA', themeColor: '#2563EB', iconType: 'train_rail', description: 'Pengamanan jalur transportasi rel strategis dan depo transit regional.' },
    { id: 'DIN5-03', no: 3, sectionCode: 'D.IN.5', name: 'Infrastruktur Kebandarudaraan', category: 'Transportasi', badgeCode: 'PPS_BANDARA', themeColor: '#0284C7', iconType: 'airport', description: 'Pengamanan area bandar udara dan fasilitas navigasi penerbangan udara.' },
    { id: 'DIN5-04', no: 4, sectionCode: 'D.IN.5', name: 'Infrastruktur Telekomunikasi', category: 'Konektivitas', badgeCode: 'PPS_TELEKOM', themeColor: '#7C3AED', iconType: 'telecom_tower', description: 'Pengamanan menara BTS, kabel fiber optik bawah laut, dan pusat data telekomunikasi.' },
    { id: 'DIN5-05', no: 5, sectionCode: 'D.IN.5', name: 'Infrastruktur Kepelabuhanan', category: 'Maritim', badgeCode: 'PPS_PELABUHAN', themeColor: '#0D9488', iconType: 'harbor_crane', description: 'Pengamanan dermaga nelayan, terminal logistik laut, dan fasilitas tambat kapal.' },
    { id: 'DIN5-06', no: 6, sectionCode: 'D.IN.5', name: 'Smelter & Pengolahan Mineral', category: 'Industri', badgeCode: 'PPS_SMELTER', themeColor: '#EA580C', iconType: 'smelter', description: 'Pengamanan pabrik pemurnian logam/mineral hilirisasi nasional.' },
    { id: 'DIN5-07', no: 7, sectionCode: 'D.IN.5', name: 'Infrastruktur Pengolahan Air (SPAM)', category: 'Utilitas', badgeCode: 'PPS_SPAM', themeColor: '#0284C7', iconType: 'water_tap', description: 'Pengamanan SPAM Regional Tabanan, intake air baku Danau Beratan, dan jaringan PDAM.' },
    { id: 'DIN5-08', no: 8, sectionCode: 'D.IN.5', name: 'Tanggul & Pengendalian Banjir', category: 'Sumber Daya Air', badgeCode: 'PPS_TANGGUL', themeColor: '#0369A1', iconType: 'levee', description: 'Pengamanan proyek retaining wall, tanggul penahan ombak pantai, dan bronjong sungai.' },
    { id: 'DIN5-09', no: 9, sectionCode: 'D.IN.5', name: 'Bendungan & Waduk', category: 'Sumber Daya Air', badgeCode: 'PPS_BENDUNGAN', themeColor: '#0284C7', iconType: 'dam', description: 'Pengamanan proyek Bendungan Telaga Waja/Sidan dan embung pertanian subak.' },
    { id: 'DIN5-10', no: 10, sectionCode: 'D.IN.5', name: 'Pertanian & Irigasi Subak', category: 'Pangan', badgeCode: 'PPS_PERTANIAN', themeColor: '#16A34A', iconType: 'agriculture', description: 'Pengawalan lumbung pangan Tabanan, revitalisasi jaringan irigasi tersier Subak Jatiluwih.' },
    { id: 'DIN5-11', no: 11, sectionCode: 'D.IN.5', name: 'Kelautan & Pesisir', category: 'Maritim', badgeCode: 'PPS_KELAUTAN', themeColor: '#0891B2', iconType: 'ocean_ship', description: 'Pengamanan konservasi pesisir pantai barat, terumbu karang, dan zona tangkap maritim.' },
    { id: 'DIN5-12', no: 12, sectionCode: 'D.IN.5', name: 'Ketenagalistrikan (PLN)', category: 'Energi', badgeCode: 'PPS_LISTRIK', themeColor: '#EAB308', iconType: 'electric_bolt', description: 'Pengamanan gardu induk PLN, transmisi SUTT/SUTET Bali Cross, dan keandalan pasokan.' },
    { id: 'DIN5-13', no: 13, sectionCode: 'D.IN.5', name: 'Energi Terbarukan / Alternatif', category: 'Energi', badgeCode: 'PPS_EBT', themeColor: '#10B981', iconType: 'renewable_energy', description: 'Pengamanan PLTS Atap, Pembangkit Listrik Tenaga Mikrohidro (PLTMH) Jatiluwih, biomassa.' },
    { id: 'DIN5-14', no: 14, sectionCode: 'D.IN.5', name: 'Minyak & Gas Bumi (Migas)', category: 'Energi', badgeCode: 'PPS_MIGAS', themeColor: '#F97316', iconType: 'oil_rig', description: 'Pengawasan distribusi BBM bersubsidi Pertalite/Solar dan pangkalan gas elpiji 3 kg.' },
    { id: 'DIN5-15', no: 15, sectionCode: 'D.IN.5', name: 'Ilmu Pengetahuan & Teknologi', category: 'IPTEK', badgeCode: 'PPS_IPTEK', themeColor: '#6366F1', iconType: 'science_lab', description: 'Pengamanan laboratorium riset botani Kebun Raya Eka Karya Bedugul dan fasilitas riset.' },
    { id: 'DIN5-16', no: 16, sectionCode: 'D.IN.5', name: 'Perumahan & Pemukiman', category: 'Properti', badgeCode: 'PPS_PERUMAHAN', themeColor: '#EC4899', iconType: 'housing', description: 'Pengamanan perumahan MBR (Masyarakat Berpenghasilan Rendah) dan penertiban PSU.' },
    { id: 'DIN5-17', no: 17, sectionCode: 'D.IN.5', name: 'Pariwisata & Destinasi Super Prioritas', category: 'Pariwisata', badgeCode: 'PPS_PARIWISATA', themeColor: '#F59E0B', iconType: 'tourism_temple', description: 'Pengamanan DTW Tanah Lot, Ulun Danu Beratan Bedugul, Jatiluwih WBD UNESCO.' },
    { id: 'DIN5-18', no: 18, sectionCode: 'D.IN.5', name: 'Kawasan Industri Prioritas / KEK', category: 'Kawasan Khusus', badgeCode: 'PPS_KEK', themeColor: '#8B5CF6', iconType: 'industry_park', description: 'Pengamanan sentra pengolahan kakao/kopi dan kawasan agrowisata terpadu Tabanan.' },
    { id: 'DIN5-19', no: 19, sectionCode: 'D.IN.5', name: 'Pos Lintas Batas Negara & Sarana Penunjang', category: 'Perbatasan', badgeCode: 'PPS_PLBN', themeColor: '#059669', iconType: 'border_gate', description: 'Pengamanan pos pantau jalur lintas kabupaten dan simpul logistik gerbang Gilimanuk-Denpasar.' },
    { id: 'DIN5-20', no: 20, sectionCode: 'D.IN.5', name: 'Sektor Strategis Lainnya', category: 'Lainnya', badgeCode: 'PPS_LAINNYA', themeColor: '#64748B', iconType: 'strategic_misc', description: 'Pengamanan proyek strategis prioritas bupati/gubernur atau arahan pimpinan Kejaksaan RI.' },
  ],
  'D.IN.6': [
    { id: 'DIN6-01', no: 1, sectionCode: 'D.IN.6', name: 'Produksi Intelijen', category: 'Produksi', badgeCode: 'PRODINTEL', themeColor: '#3B82F6', iconType: 'report_prod', description: 'Penyusunan Laporan Informasi Harian (Lapinhar), Telaahan Intelijen, Petunjuk Operasi, LII.' },
    { id: 'DIN6-02', no: 2, sectionCode: 'D.IN.6', name: 'Pemantauan (Surveillance)', category: 'Operasional', badgeCode: 'SURVEILLANCE', themeColor: '#0284C7', iconType: 'cctv_eye', description: 'Operasi pengintaian fisik, pemantauan pergerakan target sasaran, dan observasi lapangan.' },
    { id: 'DIN6-03', no: 3, sectionCode: 'D.IN.6', name: 'Intelijen Sinyal (SIGINT)', category: 'Sinyal Sandi', badgeCode: 'SIGINT', themeColor: '#8B5CF6', iconType: 'signals', description: 'Penyadapan frekuensi radio, pelacakan sinyal telekomunikasi, dan intersept resmi perizinan.' },
    { id: 'DIN6-04', no: 4, sectionCode: 'D.IN.6', name: 'Intelijen Siber (CYBINT)', category: 'Siber', badgeCode: 'CYBINT', themeColor: '#06B6D4', iconType: 'cyber_ops', description: 'Patroli siber media sosial (OSINT), profiling akun anonim penyebar hoaks/ujaran kebencian.' },
    { id: 'DIN6-05', no: 5, sectionCode: 'D.IN.6', name: 'Klandestine (Clandestine Operations)', category: 'Penyusupan', badgeCode: 'CLANDESTINE', themeColor: '#1E293B', iconType: 'clandestine', description: 'Operasi penyamaran tertutup (undercover), penyusupan agen, dan penggalangan informasi rahasia.' },
    { id: 'DIN6-06', no: 6, sectionCode: 'D.IN.6', name: 'Digital Forensik', category: 'Forensik', badgeCode: 'FORENSIK_DIGITAL', themeColor: '#EC4899', iconType: 'digital_forensics', description: 'Ekstraksi bukti digital handphone/laptop, analisis metadata, pemulihan log pesan terhapus.' },
    { id: 'DIN6-07', no: 7, sectionCode: 'D.IN.6', name: 'Transmisi Berita Sandi', category: 'Kripto', badgeCode: 'SANDI_KRIPTO', themeColor: '#10B981', iconType: 'crypto_key', description: 'Pengiriman kawat berita rahasia terenkripsi antar kantor Kejaksaan Agung/Kejati/Kejari.' },
    { id: 'DIN6-08', no: 8, sectionCode: 'D.IN.6', name: 'Kontra Penginderaan (Counter Surveillance)', category: 'Pengamanan', badgeCode: 'KONTRA_INTEL', themeColor: '#B91C1C', iconType: 'counter_spy', description: 'Penyisiran alat sadap (bug sweeping) di ruang rapat pimpinan dan pembersihan ancaman spionase.' },
    { id: 'DIN6-09', no: 9, sectionCode: 'D.IN.6', name: 'Audit & Pengujian Sistem Keamanan Informasi', category: 'Keamanan TI', badgeCode: 'AUDIT_TI', themeColor: '#F59E0B', iconType: 'security_audit', description: 'Penetration testing server Kejaksaan, evaluasi celah keamanan aplikasi, audit ISO 27001.' },
    { id: 'DIN6-10', no: 10, sectionCode: 'D.IN.6', name: 'Pengamanan Sinyal', category: 'Sinyal Sandi', badgeCode: 'PAM_SINYAL', themeColor: '#3B82F6', iconType: 'signal_jamming', description: 'Penggunaan jammer pelindung sinyal saat sidang krusial dan pengamanan kanal komunikasi tim.' },
    { id: 'DIN6-11', no: 11, sectionCode: 'D.IN.6', name: 'Pengembangan SDM & Sandi', category: 'SDM Intelijen', badgeCode: 'SDM_SANDI', themeColor: '#059669', iconType: 'sdm_training', description: 'Pelatihan teknis sandiman, peningkatan keahlian intelijen sinyal dan sertifikasi kriptografi.' },
    { id: 'DIN6-12', no: 12, sectionCode: 'D.IN.6', name: 'Pengembangan SDM Intelijen Lainnya', category: 'SDM Intelijen', badgeCode: 'SDM_INTEL', themeColor: '#0D9488', iconType: 'intelligence_academy', description: 'Pendidikan pembentukan intelijen yustisial (Diklat Intelijen), briefing agen, dan psikotes.' },
    { id: 'DIN6-13', no: 13, sectionCode: 'D.IN.6', name: 'Pengembangan Teknologi', category: 'Inovasi TI', badgeCode: 'DEV_TECH', themeColor: '#6366F1', iconType: 'tech_gears', description: 'Penerapan teknologi kecerdasan buatan (AI), analitik big data intelijen, dan sensor spasial.' },
    { id: 'DIN6-14', no: 14, sectionCode: 'D.IN.6', name: 'Pengembangan Prosedur & Aplikasi', category: 'Aplikasi', badgeCode: 'APP_PROC', themeColor: '#8B5CF6', iconType: 'app_system', description: 'Modernisasi SOP administrasi intelijen elektronik, digitalisasi buku register D.IN.1 s/d D.IN.16.' },
  ],
};

export const OFFICIAL_ADMIN_DOCUMENTS = [
  { code: 'D.IN.1', title: 'Data Peta (Buku Register Peta 5W+1H)', category: 'PETA' },
  { code: 'D.IN.2', title: 'Peta & Simbol Sektor Ideologi, Politik, Pertahanan & Keamanan', category: 'SEKTOR' },
  { code: 'D.IN.3', title: 'Peta & Simbol Sektor Sosial, Budaya & Kemasyarakatan', category: 'SEKTOR' },
  { code: 'D.IN.4', title: 'Peta & Simbol Sektor Ekonomi dan Keuangan', category: 'SEKTOR' },
  { code: 'D.IN.5', title: 'Peta & Simbol Sektor Pengamanan Pembangunan Strategis', category: 'SEKTOR' },
  { code: 'D.IN.6', title: 'Peta & Simbol Sektor Teknologi Informasi & Produksi Intelijen', category: 'SEKTOR' },
  { code: 'D.IN.7', title: 'Data Pelaksanaan Kegiatan Penerangan Hukum & Penyuluhan Hukum', category: 'PENKUM' },
  { code: 'D.IN.8', title: 'Data Foto Dokumentasi Kegiatan Penerangan Hukum & Penyuluhan Hukum', category: 'PENKUM' },
  { code: 'D.IN.9', title: 'Data Grafik Batang Kegiatan Penerangan Hukum & Penyuluhan Hukum', category: 'PENKUM' },
  { code: 'D.IN.10', title: 'Formulir Data Orang Asing (WNA)', category: 'CEKAL_PORA' },
  { code: 'D.IN.11', title: 'Data Grafik Perkara (Korupsi, Narkotika, Terorisme, Menarik Perhatian)', category: 'GRAFIK' },
  { code: 'D.IN.12', title: 'Kartu TIK Biodata', category: 'TIK' },
  { code: 'D.IN.13', title: 'Kartu TIK Barang Cetakan', category: 'TIK' },
  { code: 'D.IN.14', title: 'Kartu TIK Organisasi', category: 'TIK' },
  { code: 'D.IN.15', title: 'Kartu TIK Tersangka / Terdakwa / Terpidana', category: 'TIK' },
  { code: 'D.IN.16', title: 'Kartu TIK Pengawasan Media Komunikasi', category: 'TIK' },
];

export function findSubsectorSymbol(badgeCodeOrName: string): OfficialSubsectorSymbol | undefined {
  const query = badgeCodeOrName.toLowerCase();
  for (const list of Object.values(OFFICIAL_SECTOR_SYMBOLS)) {
    const found = list.find(
      (s) => s.badgeCode.toLowerCase() === query || 
             s.name.toLowerCase() === query || 
             s.id.toLowerCase() === query ||
             s.iconType.toLowerCase() === query
    );
    if (found) return found;
  }
  return undefined;
}
