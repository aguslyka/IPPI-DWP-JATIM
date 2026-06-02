import { Member, OrgConfig, FinancialTransaction, VisitorLog, HomepageContent, UserRole, JenisKelamin, Agama, TransaksiKategori, SumberDana } from '../types';

const INITIAL_MEMBERS: Member[] = [
  {
    id: 'admin1',
    nama: 'Dr. H. Sulaiman Ridwan, M.B.A.',
    tempatLahir: 'Yogyakarta',
    tanggalLahir: '1959-04-12',
    institusiPensiun: 'Kementerian Keuangan RI',
    jenisKelamin: JenisKelamin.LAKI_LAKI,
    agama: Agama.ISLAM,
    keahlian: 'Manajemen Keuangan, Audit Publik, Kebijakan Fiskal',
    noTelp: '081122334455',
    email: 'admin.ippi@gmail.com',
    alamat: 'Jl. Malioboro No. 42, Kel. Sosromenduran, Kec. Gedongtengen, Kota Yogyakarta 55271',
    password: 'admin',
    role: UserRole.ADMIN,
    isApproved: true,
    noAnggota: '999000001',
    noRekening: '9990000010'
  },
  {
    id: 'sec1',
    nama: 'Hj. Ratna Sari, S.H., M.Kn.',
    tempatLahir: 'Bandung',
    tanggalLahir: '1962-08-25',
    institusiPensiun: 'Kementerian Hukum dan HAM',
    jenisKelamin: JenisKelamin.PEREMPUAN,
    agama: Agama.ISLAM,
    keahlian: 'Hukum Agraria, Notariat, Tata Kelola Organisasi',
    noTelp: '081223344556',
    email: 'sekretaris.ippi@gmail.com',
    alamat: 'Jl. Dago No. 104, Coblong, Kota Bandung 40135',
    password: 'sekretaris',
    role: UserRole.SEKRETARIS,
    isApproved: true,
    noAnggota: '999000002',
    noRekening: '9990000020'
  },
  {
    id: 'treas1',
    nama: 'Drs. Bambang Wijaya, S.E., Ak.',
    tempatLahir: 'Surabaya',
    tanggalLahir: '1961-11-05',
    institusiPensiun: 'Bank Mandiri (Persero) Tbk',
    jenisKelamin: JenisKelamin.LAKI_LAKI,
    agama: Agama.ISLAM,
    keahlian: 'Akuntansi Komersial, Perbankan, Portofolio Investasi',
    noTelp: '081334455667',
    email: 'bendahara.ippi@gmail.com',
    alamat: 'Jl. Dharmahusada Indah Timur 12, Mulyorejo, Kota Surabaya 60115',
    password: 'bendahara',
    role: UserRole.BENDAHARA,
    isApproved: true,
    noAnggota: '999000003',
    noRekening: '9990000030'
  },
  {
    id: 'chair1',
    nama: 'Prof. Dr. Ir. H. Mohammad Muslih, M.M.',
    tempatLahir: 'Malang',
    tanggalLahir: '1960-06-01',
    institusiPensiun: 'PT Pos Indonesia (Persero)',
    jenisKelamin: JenisKelamin.LAKI_LAKI,
    agama: Agama.ISLAM,
    keahlian: 'Kurir dan ekspedisi, logistik, jasa keuangan, serta properti',
    noTelp: '081234567890',
    email: 'ketua.ippi@gmail.com',
    alamat: 'Jl Pahlawan 24 Madiun RT. 003 RW. 001 Madiun Lor, Kec. Manguharjo Kota Madiun 63122',
    password: 'ketua',
    role: UserRole.KETUA,
    isApproved: true,
    noAnggota: '999000011',
    noRekening: '9990000110'
  },
  {
    id: 'memb1',
    nama: 'Dr. Ir. Anisa Hermawan, M.Sc.',
    tempatLahir: 'Semarang',
    tanggalLahir: '1964-03-14',
    institusiPensiun: 'Kementerian Pekerjaan Umum & Perumahan Rakyat',
    jenisKelamin: JenisKelamin.PEREMPUAN,
    agama: Agama.KRISTEN,
    keahlian: 'Rekayasa Struktur, Perencanaan Wilayah, Manajemen Konstruksi',
    noTelp: '081544332211',
    email: 'anisa.hermawan@gmail.com',
    alamat: 'Perumahan Bukit Sari No. 12, Banyumanik, Kota Semarang 50263',
    password: 'member',
    role: UserRole.ANGGOTA,
    isApproved: true,
    noAnggota: '999000012',
    noRekening: '9990000120'
  },
  {
    id: 'unappr1',
    nama: 'Rahmat Hidayat, S.H.',
    tempatLahir: 'Malang',
    tanggalLahir: '1966-10-18',
    institusiPensiun: 'PT KAI (Persero)',
    jenisKelamin: JenisKelamin.LAKI_LAKI,
    agama: Agama.ISLAM,
    keahlian: 'Hukum Bisnis, Advokasi, Regulasi Transportasi',
    noTelp: '081803100222',
    email: 'rahmat.hidayat@gmail.com',
    alamat: 'Jl. Ijen No. 15, Klojen, Kota Malang 65112',
    password: 'rahmat',
    role: UserRole.ANGGOTA,
    isApproved: false
  }
];

const IPPI_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="90" fill="#FFFFFF" />
  <circle cx="100" cy="100" r="85" fill="none" stroke="#00488B" stroke-width="10" />
  <circle cx="58" cy="75" r="14" fill="#00488B" />
  <path d="M36,118 C36,96 72,96 72,118 L72,126 L36,126 Z" fill="#00488B" />
  <circle cx="142" cy="75" r="14" fill="#00488B" />
  <path d="M128,118 C128,96 164,96 164,118 L164,126 L128,126 Z" fill="#00488B" />
  <circle cx="100" cy="56" r="21" fill="#FFFFFF" />
  <circle cx="100" cy="56" r="18" fill="#00488B" />
  <path d="M62,126 C62,94 138,94 138,126 Z" fill="#FFFFFF" />
  <path d="M66,126 C66,97 134,97 134,126 Z" fill="#00488B" />
  <path d="M26,122 C50,123 75,152 100,131 C125,152 150,123 174,122 C174,136 142,174 100,152 C58,174 26,136 26,122 Z" fill="#FAB209" stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round" />
</svg>`;

const IPPI_LOGO_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(IPPI_LOGO_SVG)}`;

const INITIAL_CONFIG: OrgConfig = {
  logoText: 'IPPI',
  logoUrl: IPPI_LOGO_DATA_URL,
  namaSekretariat: 'Sekretariat DPP IPPI Pusat',
  alamatSekretariat: 'Gedung Graha Profesional, Lantai 4, Jl. Diponegoro No. 84, Menteng, Jakarta Pusat 10310',
  noIjinPendirian: 'AHU-0012411.AH.01.07.Tahun 2024',
  noTelp: '021-3901234',
  email: 'dpp@ippi-pensiunan.or.id'
};

const INITIAL_CONTENT: HomepageContent = {
  heroTitle: 'Masa Pensiun Adalah Babak Baru Pengabdian.',
  heroSub: 'DEDIKASI TANPA BATAS, PENGALAMAN BERHARGA',
  heroText: 'Selamat datang di IPPI. Wadah terhormat bagi para pensiunan profesional Indonesia yang ingin terus berbagi keahlian, bersosialisasi, dan aktif berkontribusi bagi kemajuan bangsa meskipun telah memasuki masa purna bakti.',
  visiMisi: 'Menjadi organisasi pensiunan profesional terdepan yang aktif dalam pemberdayaan masyarakat, kemitraan strategis, serta peningkatan kesejahteraan rohani, jasmani, dan sosial para anggotanya.',
  mengapaBergabung: [
    'Akses ke Jejaring Profesional Nasional lintas keilmuan',
    'Kesempatan berkontribusi aktif sebagai Konsultan / Tenaga Ahli tamu',
    'Partisipasi dalam forum kajian kebijakan dan pengabdian masyarakat',
    'Kegiatan sosial, keagamaan, olahraga ringan, dan wisata bersama'
  ],
  kegiatan: [
    {
      id: 'keg1',
      imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop',
      judul: 'Rapat Kerja Pengurus & Sosialisasi Program Kerja DPP IPPI',
      fullOverview: 'Sinergi antar wilayah dalam membahas program sosial ekonomi lansia.',
      deskripsi: 'Pertemuan pengurus nasional untuk membahas strategi pengabdian masyarakat dan kemitraan regional strategis.',
      tanggal: '2026-05-15'
    },
    {
      id: 'keg2',
      imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&auto=format&fit=crop',
      judul: 'Aksi Sosial & Seminar Pola Hidup Sehat Senior Aktif',
      fullOverview: 'Pemeriksaan kesehatan gratis dan kebugaran lansia.',
      deskripsi: 'Kegiatan pengabdian masyarakat berupa konsultasi kesehatan gratis dan sosialisasi kebugaran jasmani bagi pensiunan.',
      tanggal: '2026-05-24'
    }
  ],
  strukturList: [
    {
      id: 'str1',
      nama: 'Prof. Dr. Ir. H. Mohammad Muslih, S.H., M.M.',
      jabatan: 'Ketua Umum Pappi/IPPI',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&fit=crop&auto=format',
      urutan: 1
    },
    {
      id: 'str2',
      nama: 'Dra. Hj. Siti Aminah, M.Si.',
      jabatan: 'Sekretaris Jenderal',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&fit=crop&auto=format',
      urutan: 2
    },
    {
      id: 'str3',
      nama: 'H. Bambang Widjojanto, S.E., Ak.',
      jabatan: 'Bendahara Umum',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&fit=crop&auto=format',
      urutan: 3
    }
  ],
  aboutItems: [
    {
      id: 'ab1',
      judul: 'Maksud Organisasi',
      deskripsi: 'Ikatan Profesional & Pensiunan Indonesia (IPPI) didirikan atas kegelisahan mulia dari tokoh-tokoh purna tugas kementerian dan eksekutif korporat nasional. Kami berikrar menggalang seluruh keahlian intelektual yang tertidur agar tetap bermanfaat secara sosial dan komersial bagi masyarakat umum.',
      urutan: 1
    },
    {
      id: 'ab2',
      judul: 'Prinsip Aksesibilitas Lansia',
      deskripsi: 'Website IPPI dirancang dengan mengutamakan aksesibilitas tinggi bagi lansia (senior accessibility limits). Desain visual menggunakan rasio kontras 4.5:1, pewarnaan Editorial Estate yang tidak membuat mata lelah, serta kemudahan kendali ukuran font instan di bagian atas web.',
      urutan: 2
    },
    {
      id: 'ab3',
      judul: 'Empati & Kebersamaan',
      deskripsi: 'Mencegah depresi masa pensiun dengan memberikan wadah sosialisasi terpadu bagi para lansia terdidik.',
      urutan: 3
    },
    {
      id: 'ab4',
      judul: 'Kemandirian Finansial',
      deskripsi: 'Membuka peluang kerja sampingan sebagai penilai ahli, narasumber purna, serta penasihat kepolisian.',
      urutan: 4
    },
    {
      id: 'ab5',
      judul: 'Transfer Keilmuan',
      deskripsi: 'Mentransfer intisari teori tak tertulis peninggalan masa kerja puluhan tahun ke generasi muda bangsa.',
      urutan: 5
    }
  ],
  programList: [
    {
      id: 'pr1',
      kategori: 'Bidang Edukasi & Publikasi',
      judul: 'Penerbitan Jurnal Pensiunan Berkala (JPPI)',
      deskripsi: 'Sesuai tradisi keilmuan, IPPI menerbitkan tulisan para senior seputar peningkatan mutu BUMN, efisiensi kurir PT Pos Indonesia, pertukaran devisa keuangan, serta hukum tata negara. Publikasi dicetak secara fisik maupun elektronik.',
      isHighlighted: false,
      urutan: 1
    },
    {
      id: 'pr2',
      kategori: 'Agenda Nasional',
      judul: 'Gathering Nasional & Serah Keahlian Akbar',
      deskripsi: 'Merupakan konferensi tahunan mempertemukan purnabakti profesional dengan asosiasi UMKM pedesaan. Di sini kearifan masa lalu ditransaksikan langsung ke lapangan hijau operasional masa kini.',
      isHighlighted: true,
      urutan: 2
    },
    {
      id: 'pr3',
      kategori: 'Sosial & Welfare',
      judul: 'Jaminan Olahraga Ringan & Medis',
      deskripsi: 'Kesehatan para profesional sangat diagungkan. IPPI menyediakan diskon rontgen, senam pernapasan taichi mingguan gratis, serta iuran kas lunas untuk pengantaran darurat medis anggota terdaftar.',
      isHighlighted: false,
      urutan: 3
    }
  ],
  beritaList: [
    {
      id: 'be1',
      judul: 'Ketauladanan Anggota: Pensiunan PT Pos Bagikan Formula Tata Logistik Ummah',
      tanggal: '2026-05-28',
      kutipan: 'Madiun – Anggota Dewan Pengurus IPPI, Prof. Dr. Ir. H. Mohammad Muslih, M.M., memaparkan gagasan revolusioner integrasi pos logistik pedesaan.',
      penulis: 'Admin IPPI News'
    },
    {
      id: 'be2',
      judul: 'Kemenkumham Resmi Mengesahkan Perpanjangan Lisensi Pengurus IPPI Pusat',
      tanggal: '2026-05-15',
      kutipan: 'Jakarta – Surat keputusan dengan nomor ijin AHU-0012411.AH.01.07 secara resmi didelegasikan kepada Ketua Umum demi memuluskan jalannya program kerja nasional.',
      penulis: 'Humas Hubungan Kelembagaan'
    }
  ],
  jurnalList: [
    {
      id: 'jr1',
      judul: 'Vol 3 No 1 (2026): Jurnal Pensiunan Profesional Indonesia (JPPI)',
      tanggalPublikasi: 'Mei 2026',
      subjek: 'Inovasi Logistik, Kurir Terpadu, Jasa Keuangan Mandiri Bagi Masyarakat',
      abstrak: 'Menelaah pemikiran para pakar senior purna tugas dalam meningkatkan efisiensi rantai pasok daerah terpencil.'
    },
    {
      id: 'jr2',
      judul: 'Vol 2 No 4 (2025): Optimalisasi Peran Dewan Pengawas Keuangan Daerah',
      tanggalPublikasi: 'November 2025',
      subjek: 'Audit Publik Mandiri, Pengawasan Sosial BUMN & BUMD',
      abstrak: 'Kajian mendalam mekanisme transparansi belanja daerah lewat pengawasan langsung kelompok pensiunan akuntan.'
    }
  ],
  fokusList: [
    {
      id: 'fokus1',
      judul: 'Penyaluran Tenaga Ahli (Consultancy)',
      deskripsi: 'Menyalurkan para pensiunan direktur dan manager BUMN/Swasta untuk menjadi pembimbing magang dan penasihat ahli.',
      urutan: 1
    },
    {
      id: 'fokus2',
      judul: 'Sosial & Kesehatan Lansia (Welfare)',
      deskripsi: 'Penyediaan forum srawung, olahraga pagi terkontrol, pemeriksaan darah rutin, dan dana santunan purna bakti mandiri.',
      urutan: 2
    },
    {
      id: 'fokus3',
      judul: 'Penerbitan Jurnal Berkala (Academic)',
      deskripsi: 'Wadah sumbangsih naskah tulisan ilmiah populer di kancah nasional untuk memberikan masukan pembangunan ke pusat.',
      urutan: 3
    }
  ]
};

const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'tx1',
    no: 1,
    tanggal: '2026-05-10',
    kategori: TransaksiKategori.MASUK,
    sumberTujuan: SumberDana.IURAN,
    deskripsi: 'Iuran Wajib Pertama Anggota Prof. Dr. Ir. H. Mohammad Muslih, M.M.',
    noRekening: 'Bank Mandiri - Account 9990000110 a.n. Mohammad Muslih',
    jumlahMasuk: 500000,
    jumlahKeluar: 0,
    saldoAkhir: 500000,
    memberId: 'chair1'
  },
  {
    id: 'tx2',
    no: 2,
    tanggal: '2026-05-12',
    kategori: TransaksiKategori.MASUK,
    sumberTujuan: SumberDana.DANA_DPP,
    deskripsi: 'Dana Subsidi Operasional dari Pengurus Pusat (DPP)',
    noRekening: 'Bank BNI - Account 12345678 a.n. DPP IPPI',
    jumlahMasuk: 10000000,
    jumlahKeluar: 0,
    saldoAkhir: 10500000
  },
  {
    id: 'tx3',
    no: 3,
    tanggal: '2026-05-15',
    kategori: TransaksiKategori.KELUAR,
    sumberTujuan: SumberDana.OPERASIONAL,
    deskripsi: 'Pembelian Kertas Surat, Cetak Banner, dan ATK Sekretariat',
    noRekening: 'Bank Mandiri - Account 99990000 a.n. Toko ATK Sejahtera',
    jumlahMasuk: 0,
    jumlahKeluar: 1250000,
    saldoAkhir: 9250000
  },
  {
    id: 'tx4',
    no: 4,
    tanggal: '2026-05-20',
    kategori: TransaksiKategori.MASUK,
    sumberTujuan: SumberDana.IURAN,
    deskripsi: 'Iuran Tahunan Anggota - Dr. Ir. Anisa Hermawan, M.Sc.',
    noRekening: 'Bank BCA - Account 9990000120 a.n. Anisa Hermawan',
    jumlahMasuk: 500000,
    jumlahKeluar: 0,
    saldoAkhir: 9750000,
    memberId: 'memb1'
  },
  {
    id: 'tx5',
    no: 5,
    tanggal: '2026-05-25',
    kategori: TransaksiKategori.KELUAR,
    sumberTujuan: SumberDana.SPJ,
    deskripsi: 'Pencairan Dana SPJ Pengabdian Logistik Rakyat',
    noRekening: 'Bank Pos - Account 88877766 a.n. Panitia Logistik IPPI',
    jumlahMasuk: 0,
    jumlahKeluar: 3500000,
    saldoAkhir: 6250000
  }
];

const INITIAL_VISITORS: VisitorLog[] = [
  {
    id: 'v1',
    nama: 'Dr. H. Sulaiman Ridwan, M.B.A.',
    email: 'admin.ippi@gmail.com',
    role: UserRole.ADMIN,
    action: 'LOGIN',
    timestamp: '2026-05-29T08:30:00Z'
  },
  {
    id: 'v2',
    nama: 'Drs. Bambang Wijaya, S.E., Ak.',
    email: 'bendahara.ippi@gmail.com',
    role: UserRole.BENDAHARA,
    action: 'LOGIN',
    timestamp: '2026-05-29T10:15:00Z'
  },
  {
    id: 'v3',
    nama: 'Drs. Bambang Wijaya, S.E., Ak.',
    email: 'bendahara.ippi@gmail.com',
    role: UserRole.BENDAHARA,
    action: 'LOGOUT',
    timestamp: '2026-05-29T11:45:00Z'
  },
  {
    id: 'v4',
    nama: 'Prof. Dr. Ir. H. Mohammad Muslih, M.M.',
    email: 'ketua.ippi@gmail.com',
    role: UserRole.KETUA,
    action: 'LOGIN',
    timestamp: '2026-05-30T09:14:00Z'
  }
];

export function getStoredMembers(): Member[] {
  const data = localStorage.getItem('ippi_members');
  if (!data) {
    localStorage.setItem('ippi_members', JSON.stringify(INITIAL_MEMBERS));
    return INITIAL_MEMBERS;
  }
  return JSON.parse(data);
}

export function saveStoredMembers(members: Member[]) {
  localStorage.setItem('ippi_members', JSON.stringify(members));
}

export function getStoredConfig(): OrgConfig {
  const data = localStorage.getItem('ippi_config');
  if (!data) {
    localStorage.setItem('ippi_config', JSON.stringify(INITIAL_CONFIG));
    return INITIAL_CONFIG;
  }
  const parsed = JSON.parse(data);
  if (!parsed.logoUrl) {
    parsed.logoUrl = INITIAL_CONFIG.logoUrl;
    localStorage.setItem('ippi_config', JSON.stringify(parsed));
  }
  return parsed;
}

export function saveStoredConfig(config: OrgConfig) {
  localStorage.setItem('ippi_config', JSON.stringify(config));
}

export function getStoredContent(): HomepageContent {
  const data = localStorage.getItem('ippi_content');
  if (!data) {
    localStorage.setItem('ippi_content', JSON.stringify(INITIAL_CONTENT));
    return INITIAL_CONTENT;
  }
  const parsed = JSON.parse(data);
  let updated = false;
  if (!parsed.kegiatan) {
    parsed.kegiatan = INITIAL_CONTENT.kegiatan || [];
    updated = true;
  }
  if (!parsed.strukturList) {
    parsed.strukturList = INITIAL_CONTENT.strukturList || [];
    updated = true;
  }
  if (!parsed.aboutItems) {
    parsed.aboutItems = INITIAL_CONTENT.aboutItems || [];
    updated = true;
  }
  if (!parsed.programList) {
    parsed.programList = INITIAL_CONTENT.programList || [];
    updated = true;
  }
  if (!parsed.beritaList) {
    parsed.beritaList = INITIAL_CONTENT.beritaList || [];
    updated = true;
  }
  if (!parsed.jurnalList) {
    parsed.jurnalList = INITIAL_CONTENT.jurnalList || [];
    updated = true;
  }
  if (!parsed.fokusList) {
    parsed.fokusList = INITIAL_CONTENT.fokusList || [];
    updated = true;
  }
  if (updated) {
    localStorage.setItem('ippi_content', JSON.stringify(parsed));
  }
  return parsed;
}

export function saveStoredContent(content: HomepageContent) {
  localStorage.setItem('ippi_content', JSON.stringify(content));
}

export function getStoredTransactions(): FinancialTransaction[] {
  const data = localStorage.getItem('ippi_transactions');
  if (!data) {
    localStorage.setItem('ippi_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    return INITIAL_TRANSACTIONS;
  }
  return JSON.parse(data);
}

export function saveStoredTransactions(txs: FinancialTransaction[]) {
  localStorage.setItem('ippi_transactions', JSON.stringify(txs));
}

export function getStoredVisitors(): VisitorLog[] {
  const data = localStorage.getItem('ippi_visitors');
  if (!data) {
    localStorage.setItem('ippi_visitors', JSON.stringify(INITIAL_VISITORS));
    return INITIAL_VISITORS;
  }
  return JSON.parse(data);
}

export function saveStoredVisitors(logs: VisitorLog[]) {
  localStorage.setItem('ippi_visitors', JSON.stringify(logs));
}

export function logVisitorAction(nama: string, email: string, role: UserRole, action: 'LOGIN' | 'LOGOUT') {
  const logs = getStoredVisitors();
  const newLog: VisitorLog = {
    id: `v_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    nama,
    email,
    role,
    action,
    timestamp: new Date().toISOString()
  };
  logs.unshift(newLog); // Put latest on top
  saveStoredVisitors(logs);
}
