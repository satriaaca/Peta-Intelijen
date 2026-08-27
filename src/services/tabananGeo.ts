/**
 * Database Geografis & Geocoding Cerdas Kabupaten Tabanan, Bali
 * Menyediakan pemetaan akurat seluruh Desa/Kelurahan, Kecamatan, dan Landmark Strategis
 * untuk Laporan Intelijen Yustisial & Penerangan Hukum Kejaksaan Negeri Tabanan.
 */

export interface TabananGeoPoint {
  name: string; // Nama Desa / Tempat / Landmark
  kecamatan: string; // Kecamatan
  lat: number;
  lng: number;
  type: 'desa' | 'kelurahan' | 'kantor' | 'fasilitas' | 'wisata' | 'kecamatan';
  aliases?: string[];
  description?: string;
}

export const TABANAN_GEO_DATABASE: TabananGeoPoint[] = [
  // ==========================================
  // KECAMATAN TABANAN (KOTA)
  // ==========================================
  {
    name: 'Dajan Peken',
    kecamatan: 'Tabanan',
    lat: -8.5368,
    lng: 115.1228,
    type: 'kelurahan',
    aliases: ['dajan peken', 'kelurahan dajan peken', 'dajanpeken', 'pusat kota tabanan'],
    description: 'Kelurahan Dajan Peken, Pusat Kota Tabanan',
  },
  {
    name: 'Dauh Peken',
    kecamatan: 'Tabanan',
    lat: -8.5397,
    lng: 115.1192,
    type: 'kelurahan',
    aliases: ['dauh peken', 'kelurahan dauh peken', 'dauhpeken', 'pasar dauh pala'],
    description: 'Kelurahan Dauh Peken, Tabanan',
  },
  {
    name: 'Delod Peken',
    kecamatan: 'Tabanan',
    lat: -8.5442,
    lng: 115.1251,
    type: 'kelurahan',
    aliases: ['delod peken', 'kelurahan delod peken', 'delodpeken'],
    description: 'Kelurahan Delod Peken, Tabanan',
  },
  {
    name: 'Denbantas',
    kecamatan: 'Tabanan',
    lat: -8.5186,
    lng: 115.1325,
    type: 'desa',
    aliases: ['denbantas', 'desa denbantas', 'den bantas'],
    description: 'Desa Denbantas, Tabanan',
  },
  {
    name: 'Subamia',
    kecamatan: 'Tabanan',
    lat: -8.5147,
    lng: 115.1165,
    type: 'desa',
    aliases: ['subamia', 'desa subamia'],
    description: 'Desa Subamia, Tabanan',
  },
  {
    name: 'Bongan',
    kecamatan: 'Tabanan',
    lat: -8.5583,
    lng: 115.1287,
    type: 'desa',
    aliases: ['bongan', 'desa bongan', 'bongan pala'],
    description: 'Desa Bongan, Tabanan',
  },
  {
    name: 'Sudimara',
    kecamatan: 'Tabanan',
    lat: -8.5772,
    lng: 115.1084,
    type: 'desa',
    aliases: ['sudimara', 'desa sudimara', 'pantai sudimara', 'yehembang'],
    description: 'Desa Sudimara (Pesisir Selatan Tabanan)',
  },
  {
    name: 'Tunjuk',
    kecamatan: 'Tabanan',
    lat: -8.4895,
    lng: 115.1352,
    type: 'desa',
    aliases: ['tunjuk', 'desa tunjuk'],
    description: 'Desa Tunjuk, Tabanan',
  },
  {
    name: 'Buahan',
    kecamatan: 'Tabanan',
    lat: -8.5283,
    lng: 115.1462,
    type: 'desa',
    aliases: ['buahan', 'desa buahan tabanan'],
    description: 'Desa Buahan, Tabanan',
  },
  {
    name: 'Wanasari',
    kecamatan: 'Tabanan',
    lat: -8.4975,
    lng: 115.1121,
    type: 'desa',
    aliases: ['wanasari', 'desa wanasari'],
    description: 'Desa Wanasari, Tabanan',
  },
  {
    name: 'Gubug',
    kecamatan: 'Tabanan',
    lat: -8.5542,
    lng: 115.1158,
    type: 'desa',
    aliases: ['gubug', 'desa gubug'],
    description: 'Desa Gubug, Tabanan',
  },
  {
    name: 'Sesandan',
    kecamatan: 'Tabanan',
    lat: -8.5021,
    lng: 115.1054,
    type: 'desa',
    aliases: ['sesandan', 'desa sesandan'],
    description: 'Desa Sesandan, Tabanan',
  },

  // ==========================================
  // KANTOR & INSTANSI STRATEGIS DI TABANAN
  // ==========================================
  {
    name: 'Kejaksaan Negeri Tabanan',
    kecamatan: 'Tabanan',
    lat: -8.5385,
    lng: 115.1232,
    type: 'kantor',
    aliases: ['kejari tabanan', 'kejaksaan negeri tabanan', 'kantor kejari', 'aula kejari tabanan', 'posko intelijen'],
    description: 'Kantor Kejaksaan Negeri Tabanan, Jl. Pulau Batam No. 8',
  },
  {
    name: 'Kantor Bupati Tabanan',
    kecamatan: 'Tabanan',
    lat: -8.5372,
    lng: 115.1245,
    type: 'kantor',
    aliases: ['kantor bupati', 'bupati tabanan', 'setda tabanan', 'gedung mariana'],
    description: 'Pusat Pemerintahan Kabupaten Tabanan',
  },
  {
    name: 'Kantor KPUD Kabupaten Tabanan',
    kecamatan: 'Tabanan',
    lat: -8.5412,
    lng: 115.1284,
    type: 'kantor',
    aliases: ['kpud tabanan', 'kpu tabanan', 'kantor kpud', 'bypass ir soekarno kpu'],
    description: 'Kantor Komisi Pemilihan Umum Tabanan, Bypass Ir. Soekarno',
  },
  {
    name: 'Kantor Bawaslu Tabanan',
    kecamatan: 'Tabanan',
    lat: -8.5391,
    lng: 115.1265,
    type: 'kantor',
    aliases: ['bawaslu tabanan', 'kantor bawaslu'],
    description: 'Kantor Bawaslu Kabupaten Tabanan',
  },
  {
    name: 'Polres Tabanan',
    kecamatan: 'Tabanan',
    lat: -8.5398,
    lng: 115.1215,
    type: 'kantor',
    aliases: ['polres tabanan', 'kepolisian resor tabanan', 'mapolres tabanan'],
    description: 'Mapolres Tabanan, Jl. Pahlawan',
  },
  {
    name: 'Kodim 1619 Tabanan',
    kecamatan: 'Tabanan',
    lat: -8.5365,
    lng: 115.1252,
    type: 'kantor',
    aliases: ['kodim 1619', 'kodim tabanan', 'makodim 1619'],
    description: 'Makodim 1619/Tabanan',
  },
  {
    name: 'Pengadilan Negeri Tabanan',
    kecamatan: 'Tabanan',
    lat: -8.5392,
    lng: 115.1248,
    type: 'kantor',
    aliases: ['pn tabanan', 'pengadilan negeri tabanan', 'gedung pn'],
    description: 'Pengadilan Negeri Tabanan',
  },
  {
    name: 'RSUD Tabanan',
    kecamatan: 'Tabanan',
    lat: -8.5348,
    lng: 115.1278,
    type: 'fasilitas',
    aliases: ['rsud tabanan', 'rumah sakit tabanan', 'rs tabanan'],
    description: 'RSUD Kabupaten Tabanan',
  },
  {
    name: 'Kantor Bakesbangpol Tabanan',
    kecamatan: 'Tabanan',
    lat: -8.5368,
    lng: 115.1228,
    type: 'kantor',
    aliases: ['bakesbangpol tabanan', 'kesbangpol tabanan', 'bakesbangpol'],
    description: 'Kantor Bakesbangpol Kabupaten Tabanan',
  },
  {
    name: 'Pasar Dauh Pala Tabanan',
    kecamatan: 'Tabanan',
    lat: -8.5423,
    lng: 115.1189,
    type: 'fasilitas',
    aliases: ['pasar dauh pala', 'pasar tabanan', 'pasar tradisional tabanan'],
    description: 'Pasar Dauh Pala, Pusat Perdagangan Kota Tabanan',
  },

  // ==========================================
  // KECAMATAN KEDIRI
  // ==========================================
  {
    name: 'Kediri',
    kecamatan: 'Kediri',
    lat: -8.5721,
    lng: 115.1438,
    type: 'desa',
    aliases: ['kediri', 'desa kediri', 'pusat kediri', 'pasar kediri'],
    description: 'Desa Kediri & Pusat Keramaian Kediri',
  },
  {
    name: 'Banjar Anyar',
    kecamatan: 'Kediri',
    lat: -8.5492,
    lng: 115.1389,
    type: 'desa',
    aliases: ['banjar anyar', 'desa banjar anyar', 'banjaranyar', 'abian tuwung'],
    description: 'Desa Banjar Anyar, Kediri',
  },
  {
    name: 'Nyitdah',
    kecamatan: 'Kediri',
    lat: -8.5832,
    lng: 115.1421,
    type: 'desa',
    aliases: ['nyitdah', 'desa nyitdah', 'rsud nyitdah', 'rumah sakit nyitdah'],
    description: 'Desa Nyitdah & RSUD Nyitdah Tabanan',
  },
  {
    name: 'Beraban (Tanah Lot)',
    kecamatan: 'Kediri',
    lat: -8.6212,
    lng: 115.0868,
    type: 'wisata',
    aliases: ['tanah lot', 'beraban', 'desa beraban', 'dtw tanah lot', 'pura tanah lot'],
    description: 'Kawasan Wisata Internasional DTW Tanah Lot, Desa Beraban',
  },
  {
    name: 'Pandak Gede',
    kecamatan: 'Kediri',
    lat: -8.5915,
    lng: 115.1147,
    type: 'desa',
    aliases: ['pandak gede', 'desa pandak gede'],
    description: 'Desa Pandak Gede, Kediri',
  },
  {
    name: 'Pandak Bandung',
    kecamatan: 'Kediri',
    lat: -8.5862,
    lng: 115.1215,
    type: 'desa',
    aliases: ['pandak bandung', 'desa pandak bandung'],
    description: 'Desa Pandak Bandung, Kediri',
  },
  {
    name: 'Pejaten',
    kecamatan: 'Kediri',
    lat: -8.5742,
    lng: 115.1298,
    type: 'desa',
    aliases: ['pejaten', 'desa pejaten', 'sentra genteng pejaten'],
    description: 'Desa Pejaten, Sentra Kerajinan Genteng & Keramik',
  },
  {
    name: 'Abiantuwung',
    kecamatan: 'Kediri',
    lat: -8.5634,
    lng: 115.1678,
    type: 'desa',
    aliases: ['abiantuwung', 'desa abiantuwung', 'abian tuwung'],
    description: 'Desa Abiantuwung (Jalur Utama Tabanan-Denpasar)',
  },
  {
    name: 'Belalang',
    kecamatan: 'Kediri',
    lat: -8.6015,
    lng: 115.1034,
    type: 'desa',
    aliases: ['belalang', 'desa belalang'],
    description: 'Desa Belalang, Kediri',
  },
  {
    name: 'Pangkung Tibah',
    kecamatan: 'Kediri',
    lat: -8.6074,
    lng: 115.0921,
    type: 'desa',
    aliases: ['pangkung tibah', 'desa pangkung tibah', 'pantai pangkung tibah'],
    description: 'Desa Pangkung Tibah (Kawasan Pesisir Kediri)',
  },
  {
    name: 'Buwit',
    kecamatan: 'Kediri',
    lat: -8.5873,
    lng: 115.1582,
    type: 'desa',
    aliases: ['buwit', 'desa buwit'],
    description: 'Desa Buwit, Kediri',
  },
  {
    name: 'Kaba-kaba',
    kecamatan: 'Kediri',
    lat: -8.5794,
    lng: 115.1741,
    type: 'desa',
    aliases: ['kaba kaba', 'desa kaba-kaba', 'kabakaba', 'puri kaba kaba'],
    description: 'Desa Kaba-Kaba, Kediri',
  },
  {
    name: 'Bengkel',
    kecamatan: 'Kediri',
    lat: -8.5932,
    lng: 115.1358,
    type: 'desa',
    aliases: ['bengkel', 'desa bengkel kediri'],
    description: 'Desa Bengkel, Kediri',
  },
  {
    name: 'Cepaka',
    kecamatan: 'Kediri',
    lat: -8.5948,
    lng: 115.1795,
    type: 'desa',
    aliases: ['cepaka', 'desa cepaka'],
    description: 'Desa Cepaka (Perbatasan Tabanan-Badung)',
  },

  // ==========================================
  // KECAMATAN BATURITI
  // ==========================================
  {
    name: 'Baturiti',
    kecamatan: 'Baturiti',
    lat: -8.3245,
    lng: 115.1834,
    type: 'desa',
    aliases: ['baturiti', 'desa baturiti', 'pusat baturiti', 'pasar baturiti'],
    description: 'Desa & Ibukota Kecamatan Baturiti',
  },
  {
    name: 'Candikuning (Bedugul)',
    kecamatan: 'Baturiti',
    lat: -8.2753,
    lng: 115.1632,
    type: 'wisata',
    aliases: ['bedugul', 'candikuning', 'desa candikuning', 'danau beratan', 'pura ulun danu beratan', 'kebun raya bedugul'],
    description: 'Kawasan Wisata Bedugul & Danau Beratan, Desa Candikuning',
  },
  {
    name: 'Batunya',
    kecamatan: 'Baturiti',
    lat: -8.3012,
    lng: 115.1745,
    type: 'desa',
    aliases: ['batunya', 'desa batunya', 'pasar batunya'],
    description: 'Desa Batunya, Baturiti',
  },
  {
    name: 'Perean',
    kecamatan: 'Baturiti',
    lat: -8.3752,
    lng: 115.1923,
    type: 'desa',
    aliases: ['perean', 'desa perean'],
    description: 'Desa Perean, Baturiti',
  },
  {
    name: 'Perean Kangin',
    kecamatan: 'Baturiti',
    lat: -8.3684,
    lng: 115.2012,
    type: 'desa',
    aliases: ['perean kangin', 'desa perean kangin'],
    description: 'Desa Perean Kangin, Baturiti',
  },
  {
    name: 'Perean Tengah',
    kecamatan: 'Baturiti',
    lat: -8.3715,
    lng: 115.1956,
    type: 'desa',
    aliases: ['perean tengah', 'desa perean tengah'],
    description: 'Desa Perean Tengah, Baturiti',
  },
  {
    name: 'Luwus',
    kecamatan: 'Baturiti',
    lat: -8.3982,
    lng: 115.1912,
    type: 'desa',
    aliases: ['luwus', 'desa luwus'],
    description: 'Desa Luwus, Baturiti',
  },
  {
    name: 'Mekarsari',
    kecamatan: 'Baturiti',
    lat: -8.3541,
    lng: 115.1823,
    type: 'desa',
    aliases: ['mekarsari', 'desa mekarsari baturiti'],
    description: 'Desa Mekarsari, Baturiti',
  },
  {
    name: 'Angseri',
    kecamatan: 'Baturiti',
    lat: -8.3582,
    lng: 115.1524,
    type: 'wisata',
    aliases: ['angseri', 'desa angseri', 'air panas angseri', 'pemandian angseri'],
    description: 'Desa Angseri & Wisata Air Panas Alami',
  },
  {
    name: 'Bangli Baturiti',
    kecamatan: 'Baturiti',
    lat: -8.3412,
    lng: 115.1645,
    type: 'desa',
    aliases: ['bangli baturiti', 'desa bangli'],
    description: 'Desa Bangli, Baturiti',
  },
  {
    name: 'Antapan',
    kecamatan: 'Baturiti',
    lat: -8.3341,
    lng: 115.1978,
    type: 'desa',
    aliases: ['antapan', 'desa antapan'],
    description: 'Desa Antapan, Baturiti',
  },

  // ==========================================
  // KECAMATAN PENEBEL
  // ==========================================
  {
    name: 'Penebel',
    kecamatan: 'Penebel',
    lat: -8.4357,
    lng: 115.1384,
    type: 'desa',
    aliases: ['penebel', 'desa penebel', 'pusat penebel', 'pasar penebel'],
    description: 'Desa & Pusat Kecamatan Penebel',
  },
  {
    name: 'Jatiluwih',
    kecamatan: 'Penebel',
    lat: -8.3698,
    lng: 115.1315,
    type: 'wisata',
    aliases: ['jatiluwih', 'desa jatiluwih', 'terrace jatiluwih', 'unesco jatiluwih', 'sawah jatiluwih'],
    description: 'Kawasan Warisan Budaya Dunia UNESCO Jatiluwih',
  },
  {
    name: 'Wongaya Gede (Pura Batukaru)',
    kecamatan: 'Penebel',
    lat: -8.3712,
    lng: 115.0975,
    type: 'wisata',
    aliases: ['wongaya gede', 'desa wongaya gede', 'pura batukaru', 'batukaru', 'gunung batukaru'],
    description: 'Desa Wongaya Gede & Kawasan Suci Pura Luhur Batukaru',
  },
  {
    name: 'Riang Gede',
    kecamatan: 'Penebel',
    lat: -8.4592,
    lng: 115.1482,
    type: 'desa',
    aliases: ['riang gede', 'desa riang gede'],
    description: 'Desa Riang Gede, Penebel',
  },
  {
    name: 'Babahan',
    kecamatan: 'Penebel',
    lat: -8.4123,
    lng: 115.1492,
    type: 'desa',
    aliases: ['babahan', 'desa babahan'],
    description: 'Desa Babahan, Penebel',
  },
  {
    name: 'Mengesta',
    kecamatan: 'Penebel',
    lat: -8.3942,
    lng: 115.1215,
    type: 'desa',
    aliases: ['mengesta', 'desa mengesta'],
    description: 'Desa Mengesta, Penebel',
  },
  {
    name: 'Biaung',
    kecamatan: 'Penebel',
    lat: -8.4082,
    lng: 115.1124,
    type: 'desa',
    aliases: ['biaung', 'desa biaung'],
    description: 'Desa Biaung, Penebel',
  },
  {
    name: 'Senganan',
    kecamatan: 'Penebel',
    lat: -8.3845,
    lng: 115.1462,
    type: 'desa',
    aliases: ['senganan', 'desa senganan'],
    description: 'Desa Senganan, Penebel',
  },
  {
    name: 'Buruan',
    kecamatan: 'Penebel',
    lat: -8.4489,
    lng: 115.1412,
    type: 'desa',
    aliases: ['buruan', 'desa buruan penebel'],
    description: 'Desa Buruan, Penebel',
  },
  {
    name: 'Tajen',
    kecamatan: 'Penebel',
    lat: -8.4285,
    lng: 115.1623,
    type: 'desa',
    aliases: ['tajen', 'desa tajen'],
    description: 'Desa Tajen, Penebel',
  },
  {
    name: 'Jegu',
    kecamatan: 'Penebel',
    lat: -8.4672,
    lng: 115.1352,
    type: 'desa',
    aliases: ['jegu', 'desa jegu'],
    description: 'Desa Jegu, Penebel',
  },
  {
    name: 'Pitra',
    kecamatan: 'Penebel',
    lat: -8.4512,
    lng: 115.1582,
    type: 'desa',
    aliases: ['pitra', 'desa pitra'],
    description: 'Desa Pitra, Penebel',
  },
  {
    name: 'Penatahan',
    kecamatan: 'Penebel',
    lat: -8.4795,
    lng: 115.1294,
    type: 'wisata',
    aliases: ['penatahan', 'desa penatahan', 'air panas penatahan', 'hot spring penatahan'],
    description: 'Desa Penatahan & Pemandian Air Panas Alami',
  },
  {
    name: 'Tengkudak',
    kecamatan: 'Penebel',
    lat: -8.4192,
    lng: 115.1284,
    type: 'desa',
    aliases: ['tengkudak', 'desa tengkudak'],
    description: 'Desa Tengkudak, Penebel',
  },

  // ==========================================
  // KECAMATAN MARGA
  // ==========================================
  {
    name: 'Marga',
    kecamatan: 'Marga',
    lat: -8.4891,
    lng: 115.1764,
    type: 'desa',
    aliases: ['marga', 'desa marga', 'pusat marga', 'candi margarana', 'tpn margarana'],
    description: 'Desa Marga & Monumen Nasional Taman Pujaan Bangsa Margarana',
  },
  {
    name: 'Kukuh (Alas Kedaton)',
    kecamatan: 'Marga',
    lat: -8.5123,
    lng: 115.1645,
    type: 'wisata',
    aliases: ['alas kedaton', 'kukuh', 'desa kukuh marga', 'hutan monyet alas kedaton'],
    description: 'Desa Kukuh & Hutan Wisata Alas Kedaton',
  },
  {
    name: 'Marga Dajan Puri',
    kecamatan: 'Marga',
    lat: -8.4823,
    lng: 115.1782,
    type: 'desa',
    aliases: ['marga dajan puri', 'desa marga dajan puri'],
    description: 'Desa Marga Dajan Puri, Marga',
  },
  {
    name: 'Marga Dauh Puri',
    kecamatan: 'Marga',
    lat: -8.4856,
    lng: 115.1721,
    type: 'desa',
    aliases: ['marga dauh puri', 'desa marga dauh puri'],
    description: 'Desa Marga Dauh Puri, Marga',
  },
  {
    name: 'Geluntung',
    kecamatan: 'Marga',
    lat: -8.4521,
    lng: 115.1892,
    type: 'desa',
    aliases: ['geluntung', 'desa geluntung'],
    description: 'Desa Geluntung, Marga',
  },
  {
    name: 'Cau Belayu',
    kecamatan: 'Marga',
    lat: -8.4712,
    lng: 115.2034,
    type: 'desa',
    aliases: ['cau belayu', 'desa cau belayu', 'caubelayu'],
    description: 'Desa Cau Belayu, Marga',
  },
  {
    name: 'Selanbawak',
    kecamatan: 'Marga',
    lat: -8.5021,
    lng: 115.1789,
    type: 'desa',
    aliases: ['selanbawak', 'desa selanbawak'],
    description: 'Desa Selanbawak, Marga',
  },
  {
    name: 'Petiga',
    kecamatan: 'Marga',
    lat: -8.4682,
    lng: 115.1921,
    type: 'desa',
    aliases: ['petiga', 'desa petiga', 'sentra tanaman hias petiga'],
    description: 'Desa Petiga, Sentra Agrowisata & Tanaman Hias',
  },
  {
    name: 'Payangan Marga',
    kecamatan: 'Marga',
    lat: -8.4412,
    lng: 115.1852,
    type: 'desa',
    aliases: ['payangan marga', 'desa payangan'],
    description: 'Desa Payangan, Marga',
  },
  {
    name: 'Baru',
    kecamatan: 'Marga',
    lat: -8.4321,
    lng: 115.1974,
    type: 'desa',
    aliases: ['baru', 'desa baru marga'],
    description: 'Desa Baru, Marga',
  },
  {
    name: 'Tua',
    kecamatan: 'Marga',
    lat: -8.4215,
    lng: 115.1945,
    type: 'desa',
    aliases: ['tua', 'desa tua marga'],
    description: 'Desa Tua, Marga',
  },
  {
    name: 'Tegaljadi',
    kecamatan: 'Marga',
    lat: -8.4984,
    lng: 115.1865,
    type: 'desa',
    aliases: ['tegaljadi', 'desa tegaljadi'],
    description: 'Desa Tegaljadi, Marga',
  },
  {
    name: 'Batannyuh',
    kecamatan: 'Marga',
    lat: -8.5184,
    lng: 115.1812,
    type: 'desa',
    aliases: ['batannyuh', 'desa batannyuh'],
    description: 'Desa Batannyuh, Marga',
  },

  // ==========================================
  // KECAMATAN KERAMBITAN
  // ==========================================
  {
    name: 'Kerambitan',
    kecamatan: 'Kerambitan',
    lat: -8.5441,
    lng: 115.0862,
    type: 'desa',
    aliases: ['kerambitan', 'desa kerambitan', 'puri kerambitan', 'pasar kerambitan'],
    description: 'Desa Kerambitan & Kawasan Puri Seni Kerambitan',
  },
  {
    name: 'Tibubiu',
    kecamatan: 'Kerambitan',
    lat: -8.5723,
    lng: 115.0682,
    type: 'desa',
    aliases: ['tibubiu', 'desa tibubiu', 'pantai pasut tibubiu'],
    description: 'Desa Tibubiu, Kerambitan',
  },
  {
    name: 'Pasut (Pantai Pasut)',
    kecamatan: 'Kerambitan',
    lat: -8.5794,
    lng: 115.0592,
    type: 'wisata',
    aliases: ['pantai pasut', 'pasut', 'pesisir pasut'],
    description: 'Kawasan Wisata Pesisir Pantai Pasut, Kerambitan',
  },
  {
    name: 'Kelating',
    kecamatan: 'Kerambitan',
    lat: -8.5845,
    lng: 115.0745,
    type: 'desa',
    aliases: ['kelating', 'desa kelating', 'pantai kelating'],
    description: 'Desa Kelating & Pantai Kelating',
  },
  {
    name: 'Samsam',
    kecamatan: 'Kerambitan',
    lat: -8.5284,
    lng: 115.1021,
    type: 'desa',
    aliases: ['samsam', 'desa samsam', 'tanjakan samsam', 'jalur utama samsam'],
    description: 'Desa Samsam (Jalur Logistik Nasional Denpasar-Gilimanuk)',
  },
  {
    name: 'Meliling',
    kecamatan: 'Kerambitan',
    lat: -8.5215,
    lng: 115.0912,
    type: 'desa',
    aliases: ['meliling', 'desa meliling'],
    description: 'Desa Meliling, Kerambitan',
  },
  {
    name: 'Sembung Gede',
    kecamatan: 'Kerambitan',
    lat: -8.5142,
    lng: 115.0792,
    type: 'desa',
    aliases: ['sembung gede', 'desa sembung gede'],
    description: 'Desa Sembung Gede, Kerambitan',
  },
  {
    name: 'Penarukan',
    kecamatan: 'Kerambitan',
    lat: -8.5521,
    lng: 115.0915,
    type: 'desa',
    aliases: ['penarukan', 'desa penarukan kerambitan'],
    description: 'Desa Penarukan, Kerambitan',
  },
  {
    name: 'Belumbang',
    kecamatan: 'Kerambitan',
    lat: -8.5612,
    lng: 115.0845,
    type: 'desa',
    aliases: ['belumbang', 'desa belumbang'],
    description: 'Desa Belumbang, Kerambitan',
  },
  {
    name: 'Timpag',
    kecamatan: 'Kerambitan',
    lat: -8.5082,
    lng: 115.0984,
    type: 'desa',
    aliases: ['timpag', 'desa timpag'],
    description: 'Desa Timpag, Kerambitan',
  },

  // ==========================================
  // KECAMATAN SELEMADEG (PUSAT/BAJERA)
  // ==========================================
  {
    name: 'Bajera (Selemadeg)',
    kecamatan: 'Selemadeg',
    lat: -8.4983,
    lng: 115.0451,
    type: 'desa',
    aliases: ['bajera', 'desa bajera', 'selemadeg', 'pasar bajera', 'pusat selemadeg'],
    description: 'Desa Bajera, Pusat Pemerintahan Kecamatan Selemadeg',
  },
  {
    name: 'Antap',
    kecamatan: 'Selemadeg',
    lat: -8.5215,
    lng: 115.0345,
    type: 'desa',
    aliases: ['antap', 'desa antap', 'pantai antap'],
    description: 'Desa Antap, Selemadeg',
  },
  {
    name: 'Berembeng',
    kecamatan: 'Selemadeg',
    lat: -8.5042,
    lng: 115.0512,
    type: 'desa',
    aliases: ['berembeng', 'desa berembeng'],
    description: 'Desa Berembeng, Selemadeg',
  },
  {
    name: 'Serampingan',
    kecamatan: 'Selemadeg',
    lat: -8.4892,
    lng: 115.0384,
    type: 'desa',
    aliases: ['serampingan', 'desa serampingan'],
    description: 'Desa Serampingan, Selemadeg',
  },
  {
    name: 'Wanagiri Selemadeg',
    kecamatan: 'Selemadeg',
    lat: -8.4712,
    lng: 115.0492,
    type: 'desa',
    aliases: ['wanagiri selemadeg', 'desa wanagiri'],
    description: 'Desa Wanagiri, Selemadeg',
  },
  {
    name: 'Manikyang',
    kecamatan: 'Selemadeg',
    lat: -8.4582,
    lng: 115.0592,
    type: 'desa',
    aliases: ['manikyang', 'desa manikyang'],
    description: 'Desa Manikyang, Selemadeg',
  },
  {
    name: 'Pupuan Sawah',
    kecamatan: 'Selemadeg',
    lat: -8.4682,
    lng: 115.0382,
    type: 'desa',
    aliases: ['pupuan sawah', 'desa pupuan sawah'],
    description: 'Desa Pupuan Sawah, Selemadeg',
  },

  // ==========================================
  // KECAMATAN SELEMADEG TIMUR
  // ==========================================
  {
    name: 'Megati',
    kecamatan: 'Selemadeg Timur',
    lat: -8.5451,
    lng: 115.0612,
    type: 'desa',
    aliases: ['megati', 'desa megati', 'pusat selemadeg timur'],
    description: 'Desa Megati, Selemadeg Timur',
  },
  {
    name: 'Gadungan',
    kecamatan: 'Selemadeg Timur',
    lat: -8.5312,
    lng: 115.0542,
    type: 'desa',
    aliases: ['gadungan', 'desa gadungan'],
    description: 'Desa Gadungan, Selemadeg Timur',
  },
  {
    name: 'Gadung Sari',
    kecamatan: 'Selemadeg Timur',
    lat: -8.5245,
    lng: 115.0645,
    type: 'desa',
    aliases: ['gadung sari', 'desa gadung sari', 'gadungsari'],
    description: 'Desa Gadung Sari, Selemadeg Timur',
  },
  {
    name: 'Bantas',
    kecamatan: 'Selemadeg Timur',
    lat: -8.5523,
    lng: 115.0684,
    type: 'desa',
    aliases: ['bantas', 'desa bantas'],
    description: 'Desa Bantas, Selemadeg Timur',
  },
  {
    name: 'Mambang',
    kecamatan: 'Selemadeg Timur',
    lat: -8.5382,
    lng: 115.0745,
    type: 'desa',
    aliases: ['mambang', 'desa mambang'],
    description: 'Desa Mambang, Selemadeg Timur',
  },
  {
    name: 'Tegal Mengkeb',
    kecamatan: 'Selemadeg Timur',
    lat: -8.5712,
    lng: 115.0582,
    type: 'desa',
    aliases: ['tegal mengkeb', 'desa tegal mengkeb', 'tegalmengkeb'],
    description: 'Desa Tegal Mengkeb, Selemadeg Timur',
  },
  {
    name: 'Tangguntiti',
    kecamatan: 'Selemadeg Timur',
    lat: -8.5634,
    lng: 115.0694,
    type: 'desa',
    aliases: ['tangguntiti', 'desa tangguntiti'],
    description: 'Desa Tangguntiti, Selemadeg Timur',
  },
  {
    name: 'Dalang',
    kecamatan: 'Selemadeg Timur',
    lat: -8.5082,
    lng: 115.0615,
    type: 'desa',
    aliases: ['dalang', 'desa dalang'],
    description: 'Desa Dalang, Selemadeg Timur',
  },
  {
    name: 'Gunung Salak',
    kecamatan: 'Selemadeg Timur',
    lat: -8.4892,
    lng: 115.0712,
    type: 'desa',
    aliases: ['gunung salak', 'desa gunung salak'],
    description: 'Desa Gunung Salak, Selemadeg Timur',
  },

  // ==========================================
  // KECAMATAN SELEMADEG BARAT
  // ==========================================
  {
    name: 'Surabrata (Selemadeg Barat)',
    kecamatan: 'Selemadeg Barat',
    lat: -8.4552,
    lng: 114.9812,
    type: 'desa',
    aliases: ['surabrata', 'desa surabrata', 'pusat selemadeg barat', 'pasar surabrata'],
    description: 'Desa Surabrata, Pusat Kecamatan Selemadeg Barat',
  },
  {
    name: 'Lalanglinggah (Pantai Balian)',
    kecamatan: 'Selemadeg Barat',
    lat: -8.4712,
    lng: 114.9652,
    type: 'wisata',
    aliases: ['lalanglinggah', 'desa lalanglinggah', 'pantai balian', 'balian beach', 'surfer balian'],
    description: 'Desa Lalanglinggah & Wisata Selancar Pantai Balian',
  },
  {
    name: 'Selabih',
    kecamatan: 'Selemadeg Barat',
    lat: -8.4612,
    lng: 114.9382,
    type: 'desa',
    aliases: ['selabih', 'desa selabih', 'pantai selabih', 'perbatasan jembrana'],
    description: 'Desa Selabih (Gerbang Barat Kabupaten Tabanan)',
  },
  {
    name: 'Antosari',
    kecamatan: 'Selemadeg Barat',
    lat: -8.4892,
    lng: 115.0124,
    type: 'desa',
    aliases: ['antosari', 'desa antosari', 'simpang antosari'],
    description: 'Desa Antosari, Selemadeg Barat',
  },
  {
    name: 'Angkah',
    kecamatan: 'Selemadeg Barat',
    lat: -8.4412,
    lng: 115.0182,
    type: 'desa',
    aliases: ['angkah', 'desa angkah'],
    description: 'Desa Angkah, Selemadeg Barat',
  },
  {
    name: 'Lumbung',
    kecamatan: 'Selemadeg Barat',
    lat: -8.4312,
    lng: 115.0084,
    type: 'desa',
    aliases: ['lumbung', 'desa lumbung'],
    description: 'Desa Lumbung, Selemadeg Barat',
  },
  {
    name: 'Mundeh',
    kecamatan: 'Selemadeg Barat',
    lat: -8.4215,
    lng: 114.9845,
    type: 'desa',
    aliases: ['mundeh', 'desa mundeh'],
    description: 'Desa Mundeh, Selemadeg Barat',
  },
  {
    name: 'Mundeh Kangin',
    kecamatan: 'Selemadeg Barat',
    lat: -8.4182,
    lng: 114.9982,
    type: 'desa',
    aliases: ['mundeh kangin', 'desa mundeh kangin'],
    description: 'Desa Mundeh Kangin, Selemadeg Barat',
  },
  {
    name: 'Mundeh Kauh',
    kecamatan: 'Selemadeg Barat',
    lat: -8.4284,
    lng: 114.9712,
    type: 'desa',
    aliases: ['mundeh kauh', 'desa mundeh kauh'],
    description: 'Desa Mundeh Kauh, Selemadeg Barat',
  },
  {
    name: 'Tiing Gading',
    kecamatan: 'Selemadeg Barat',
    lat: -8.4784,
    lng: 115.0284,
    type: 'desa',
    aliases: ['tiing gading', 'desa tiing gading', 'tiying gading'],
    description: 'Desa Tiing Gading, Selemadeg Barat',
  },

  // ==========================================
  // KECAMATAN PUPUAN
  // ==========================================
  {
    name: 'Pupuan',
    kecamatan: 'Pupuan',
    lat: -8.3562,
    lng: 115.0215,
    type: 'desa',
    aliases: ['pupuan', 'desa pupuan', 'pusat pupuan', 'pasar pupuan'],
    description: 'Desa & Pusat Kecamatan Pupuan, Kawasan Perkebunan Kopi',
  },
  {
    name: 'Pujungan',
    kecamatan: 'Pupuan',
    lat: -8.3341,
    lng: 115.0384,
    type: 'desa',
    aliases: ['pujungan', 'desa pujungan', 'air terjun pujungan', 'air terjun bidadari'],
    description: 'Desa Pujungan & Wisata Air Terjun',
  },
  {
    name: 'Belimbing',
    kecamatan: 'Pupuan',
    lat: -8.3845,
    lng: 115.0492,
    type: 'wisata',
    aliases: ['belimbing', 'desa belimbing', 'terasering belimbing', 'sawah belimbing'],
    description: 'Desa Belimbing & Wisata Panorama Terasering',
  },
  {
    name: 'Sanda',
    kecamatan: 'Pupuan',
    lat: -8.3712,
    lng: 115.0384,
    type: 'desa',
    aliases: ['sanda', 'desa sanda'],
    description: 'Desa Sanda, Pupuan',
  },
  {
    name: 'Bantiran',
    kecamatan: 'Pupuan',
    lat: -8.3182,
    lng: 115.0124,
    type: 'desa',
    aliases: ['bantiran', 'desa bantiran', 'perbatasan buleleng'],
    description: 'Desa Bantiran (Jalur Tabanan-Buleleng)',
  },
  {
    name: 'Batungsel',
    kecamatan: 'Pupuan',
    lat: -8.3482,
    lng: 115.0412,
    type: 'desa',
    aliases: ['batungsel', 'desa batungsel'],
    description: 'Desa Batungsel, Pupuan',
  },
  {
    name: 'Padangan',
    kecamatan: 'Pupuan',
    lat: -8.3612,
    lng: 115.0112,
    type: 'desa',
    aliases: ['padangan', 'desa padangan'],
    description: 'Desa Padangan, Pupuan',
  },
  {
    name: 'Sai',
    kecamatan: 'Pupuan',
    lat: -8.3912,
    lng: 115.0245,
    type: 'desa',
    aliases: ['sai', 'desa sai pupuan'],
    description: 'Desa Sai, Pupuan',
  },
  {
    name: 'Jelijih Punggang',
    kecamatan: 'Pupuan',
    lat: -8.3684,
    lng: 115.0315,
    type: 'desa',
    aliases: ['jelijih punggang', 'desa jelijih punggang', 'jelijih'],
    description: 'Desa Jelijih Punggang, Pupuan',
  },
  {
    name: 'Kebon Padangan',
    kecamatan: 'Pupuan',
    lat: -8.3582,
    lng: 114.9984,
    type: 'desa',
    aliases: ['kebon padangan', 'desa kebon padangan'],
    description: 'Desa Kebon Padangan, Pupuan',
  },
];

/**
 * Quick Popular Location Chips for instant one-click selection
 */
export const POPULAR_TABANAN_LOCATIONS = [
  'Dajan Peken',
  'Dauh Peken',
  'Delod Peken',
  'Kejaksaan Negeri Tabanan',
  'Kantor KPUD Tabanan',
  'Kediri',
  'Nyitdah (RSUD)',
  'Beraban (Tanah Lot)',
  'Candikuning (Bedugul)',
  'Jatiluwih',
  'Penebel',
  'Marga (Margarana)',
  'Kerambitan',
  'Bajera (Selemadeg)',
  'Surabrata',
  'Pupuan',
];

/**
 * Normalizes search text by trimming, lowercasing, and removing common prefixes
 */
function cleanSearchQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/^(desa|kelurahan|kecamatan|kantor|posko|pasar|pantai|banjar|br\.|jl\.|jalan|gedung|aula|kompleks)\s+/gi, '')
    .trim();
}

/**
 * Cari lokasi di database lokal Tabanan berdasarkan input ketikan pengguna
 * Mendukung pencarian instan nama desa, singkatan, kelurahan, dan alias.
 */
export function searchTabananLocations(query: string): TabananGeoPoint[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();
  const cleaned = cleanSearchQuery(query);

  const directMatches: TabananGeoPoint[] = [];
  const partialMatches: TabananGeoPoint[] = [];

  for (const point of TABANAN_GEO_DATABASE) {
    const nameLower = point.name.toLowerCase();
    const kecLower = point.kecamatan.toLowerCase();
    
    // 1. Exact or startsWith name match
    if (nameLower === q || nameLower === cleaned) {
      directMatches.unshift(point);
      continue;
    }
    if (nameLower.startsWith(q) || nameLower.startsWith(cleaned)) {
      directMatches.push(point);
      continue;
    }

    // 2. Alias match
    if (point.aliases && point.aliases.some((a) => a === q || a === cleaned || a.startsWith(q) || a.startsWith(cleaned))) {
      directMatches.push(point);
      continue;
    }

    // 3. Partial substring match in name, aliases, or description
    if (
      nameLower.includes(q) || 
      nameLower.includes(cleaned) ||
      kecLower.includes(q) ||
      (point.aliases && point.aliases.some((a) => a.includes(q) || a.includes(cleaned))) ||
      (point.description && point.description.toLowerCase().includes(q))
    ) {
      partialMatches.push(point);
    }
  }

  return [...directMatches, ...partialMatches].slice(0, 8);
}

/**
 * Deteksi otomatis koordinat & kecamatan dari teks bebas (misal: "Dajan Peken", "Desa Dajan Peken, Jl. Melati", "Kantor KPUD Tabanan")
 */
export function autoDetectTabananLocation(text: string): TabananGeoPoint | null {
  if (!text || text.trim().length === 0) return null;
  const raw = text.trim();
  const q = raw.toLowerCase();
  const cleaned = cleanSearchQuery(raw);

  // 1. Direct match with exact name
  const exact = TABANAN_GEO_DATABASE.find(
    (p) => p.name.toLowerCase() === q || p.name.toLowerCase() === cleaned
  );
  if (exact) return exact;

  // 2. Direct match with aliases
  const aliasMatch = TABANAN_GEO_DATABASE.find(
    (p) => p.aliases && p.aliases.some((a) => a === q || a === cleaned)
  );
  if (aliasMatch) return aliasMatch;

  // 3. Tokenized words match: check if the text contains any of our known village names
  // Sort database by name length descending so specific names take precedence
  const sorted = [...TABANAN_GEO_DATABASE].sort((a, b) => b.name.length - a.name.length);
  for (const point of sorted) {
    const pointClean = point.name.toLowerCase().replace(/^(desa|kelurahan|kecamatan)\s+/i, '');
    if (q.includes(pointClean) || (point.aliases && point.aliases.some((a) => q.includes(a)))) {
      return point;
    }
  }

  return null;
}

/**
 * Geocoder Online OSM Nominatim Fallback jika lokasi spesifik tidak ditemukan di database statis
 */
export async function geocodeLocationOnline(
  query: string, 
  fallbackKecamatan?: string
): Promise<{ lat: number; lng: number; displayName: string } | null> {
  if (!query || query.trim().length < 2) return null;

  try {
    const searchQuery = `${query.trim()}, Tabanan, Bali, Indonesia`;
    const encoded = encodeURIComponent(searchQuery);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&addressdetails=1&limit=1&viewbox=114.90,-8.20,115.25,-8.70&bounded=0`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'KejariTabanan-PetaIntelijen/1.0',
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        const lat = parseFloat(first.lat);
        const lon = parseFloat(first.lon);
        if (!isNaN(lat) && !isNaN(lon)) {
          return {
            lat,
            lng: lon,
            displayName: first.display_name,
          };
        }
      }
    }
  } catch (err) {
    console.warn('[Geocoding] Online lookup skipped or failed, fallback to local DB:', err);
  }

  // Fallback to local DB search
  const localMatch = autoDetectTabananLocation(query);
  if (localMatch) {
    return {
      lat: localMatch.lat,
      lng: localMatch.lng,
      displayName: `${localMatch.name}, Kec. ${localMatch.kecamatan}, Tabanan`,
    };
  }

  // Default coordinate for kecamatan
  if (fallbackKecamatan) {
    const kecPoint = TABANAN_GEO_DATABASE.find((p) => p.kecamatan.toLowerCase() === fallbackKecamatan.toLowerCase());
    if (kecPoint) {
      return {
        lat: kecPoint.lat,
        lng: kecPoint.lng,
        displayName: `Kec. ${fallbackKecamatan}, Tabanan`,
      };
    }
  }

  return null;
}
