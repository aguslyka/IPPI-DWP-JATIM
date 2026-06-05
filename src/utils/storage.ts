import { Member, OrgConfig, FinancialTransaction, VisitorLog, HomepageContent, UserRole, JenisKelamin, Agama, TransaksiKategori, SumberDana, BalanceSheetData } from '../types';

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
  <circle cx="100" cy="100" r="95" fill="none" stroke="#52718E" stroke-width="2" />
  <circle cx="100" cy="100" r="90" fill="#FFFFFF" stroke="#52718E" stroke-width="1" />
  
  <circle cx="65" cy="85" r="14" fill="none" stroke="#52718E" stroke-width="2.5" />
  <path d="M42,135 C42,112 88,112 88,135" fill="none" stroke="#52718E" stroke-width="2.5" stroke-linecap="round" />
  
  <circle cx="135" cy="85" r="14" fill="none" stroke="#52718E" stroke-width="2.5" />
  <path d="M112,135 C112,112 158,112 158,135" fill="none" stroke="#52718E" stroke-width="2.5" stroke-linecap="round" />
  
  <circle cx="100" cy="73" r="18" fill="#FFFFFF" stroke="#52718E" stroke-width="3.2" />
  <path d="M64,145 C64,106 136,106 136,145 Z" fill="#FFFFFF" />
  <path d="M64,145 C64,106 136,106 136,145" fill="none" stroke="#52718E" stroke-width="3.2" stroke-linecap="round" />
  
  <path d="M25,123 C52,123 75,152 100,132 L100,165 C75,178 50,148 25,145 Z" fill="#FAB209" stroke="#52718E" stroke-width="2.5" stroke-linejoin="round" />
  <path d="M175,123 C148,123 125,152 100,132 L100,165 C125,178 150,148 175,145 Z" fill="#FAB209" stroke="#52718E" stroke-width="2.5" stroke-linejoin="round" />
</svg>`;

const IPPI_LOGO_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(IPPI_LOGO_SVG)}`;

export const INITIAL_NERACA: BalanceSheetData = {
  piutangAnggota: 0,
  uangMukaPanjar: 0,
  lainLainAktivaLancar: 0,
  lainLainAktivaLancarKet: '',
  
  peralatanKantor: 0,
  akumulasiPenyusutan: 0,
  lainLainAktivaTetap: 0,
  lainLainAktivaTetapKet: '',

  hutangOperasional: 0,
  kewajibanLainnya: 0,
  lainLainLiabilitas: 0,
  lainLainLiabilitasKet: '',

  modalCadangan: 0,
  surplusDefisit: 0,
  lainLainEkuitas: 0,
  lainLainEkuitasKet: ''
};

const INITIAL_CONFIG: OrgConfig = {
  logoText: 'IPPI',
  logoUrl: IPPI_LOGO_DATA_URL,
  namaSekretariat: 'Sekretariat DPW IPPI Jawa Timur',
  alamatSekretariat: 'Jl. Krembangan Barat 73-75 Surabaya 60175',
  noIjinPendirian: 'AHU Kemenkum-0010333.AH.01.07.Tahun 2025 (13-01-2026)',
  noTelp: '0821-4566-8301/ 0852-3099-6333/ 0821-4165-6855',
  email: 'ippidpwjatim@gmail.com',
  noRekeningIppiBaris1: 'Pospay Nomor Rekening: 0195873518 a.n. DPW IPPI JAWA TIMUR',
  noRekeningIppiBaris2: 'Bank Mandiri Rek: 1400018889992 a.n. DPW IPPI JATIM'
};

const INITIAL_CONTENT: HomepageContent = {
  heroTitle: 'Masa Pensiun Adalah Babak Baru Pengabdian.',
  heroSub: 'DEDIKASI TANPA BATAS, PENGALAMAN BERHARGA',
  heroText: 'Selamat datang di IPPI. Wadah terhormat bagi para pensiunan profesional Indonesia yang ingin terus berbagi keahlian, bersosialisasi, dan aktif berkontribusi bagi kemajuan bangsa meskipun telah memasuki masa purna bakti.',
  visiMisi: 'Menjadi organisasi pensiunan profesional terdepan yang aktif dalam pemberdayaan masyarakat, kemitraan strategis, peningkatan kesejahteraan rohani, jasmani, sosial dan bisnis bagi para anggotanya.',
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
      nama: 'Mohammad Muslih, S.H., M.M.',
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
  ],
  umkmList: [
    {
      id: 'umkm1',
      namaProduk: 'Batik Tulis Madura Klasik Gentongan',
      namaPenjual: 'Ibu Hj. Aminah (Anggota Senior DPW)',
      deskripsi: 'Batik motif pesisiran klasik yang diproses manual dengan canting tangan dan pewarnaan alami. Sangat halus, prestisius, dan nyaman dipakai untuk seragam kepengurusan maupun forum formal.',
      harga: '350000',
      imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      linkBeli: 'https://shopee.co.id',
      whatsappPenjual: '085230996333',
      kategori: 'Fashion & Batik',
      urutan: 1
    },
    {
      id: 'umkm2',
      namaProduk: 'Minyak Gosok & Aromaterapi Herbal Sereh Merah',
      namaPenjual: 'Bpk. Dr. Bambang (Purna Tugas Medis)',
      deskripsi: 'Minyak gosok hasil sulingan sereh merah organik, cengkih pilihan, dan pala. Sangat berkhasiat melancarkan peredaran darah, meredakan nyeri sendi, masuk angin, dan pegal linu terutama bagi para senior aktif.',
      harga: '45000',
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop',
      videoUrl: '',
      linkBeli: 'https://shopee.co.id',
      whatsappPenjual: '082141656855',
      kategori: 'Kesehatan & Herbal',
      urutan: 2
    },
    {
      id: 'umkm3',
      namaProduk: 'Kopi Bubuk Robusta Premium Dampit',
      namaPenjual: 'Ir. H. Mohammad Muslih (Mantan Ka. Pos Logistik)',
      deskripsi: 'Kopi bubuk robusta murni pilihan dari perkebunan lereng Gunung Semeru Dampit Malang. Profil roasting medium-dark, menghasilkan aroma cokelat alami yang legit, tebal (bold body), dan rendah kadar asam.',
      harga: '60000',
      imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop',
      videoUrl: '',
      linkBeli: 'https://shopee.co.id',
      whatsappPenjual: '082145668301',
      kategori: 'Kuliner & Camilan',
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

import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';

/**
 * Sanitizes object data, recursively removing any undefined properties to meet strict Firestore schema constraints.
 */
export function sanitizeFirestoreData<T>(obj: T): T {
  if (obj === undefined || obj === null) return null as any;
  return JSON.parse(JSON.stringify(obj)) as T;
}

// Callback listener pattern for reactive user interfaces
type StorageUpdateCallback = () => void;
let updateListeners: StorageUpdateCallback[] = [];

export function onStorageUpdate(listener: StorageUpdateCallback): () => void {
  updateListeners.push(listener);
  return () => {
    updateListeners = updateListeners.filter(l => l !== listener);
  };
}

function notifyListeners() {
  updateListeners.forEach(listener => {
    try {
      listener();
    } catch (e) {
      console.error('Error triggering storage listener:', e);
    }
  });
  window.dispatchEvent(new Event('ippi_storage_updated'));
}

let cachedContent: HomepageContent | null = null;
let syncStarted = false;

export function initializeFirestoreSync() {
  if (syncStarted) return;
  syncStarted = true;

  // 1. Members Sync
  onSnapshot(collection(db, 'members'), async (snapshot) => {
    if (snapshot.empty) {
      try {
        const list = getStoredMembers();
        for (const m of list) {
          await setDoc(doc(db, 'members', m.id), m);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'members');
      }
    } else {
      const list: Member[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as Member);
      });
      localStorage.setItem('ippi_members', JSON.stringify(list));
      notifyListeners();
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'members');
  });

  // 2. Config Sync
  onSnapshot(doc(db, 'config', 'main'), async (snapshot) => {
    if (!snapshot.exists()) {
      try {
        const currentConfig = getStoredConfig();
        await setDoc(doc(db, 'config', 'main'), currentConfig);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'config/main');
      }
    } else {
      let config = snapshot.data() as OrgConfig;
      
      // Auto-migrate outdated values from old DPP Pusat or other old placeholders to match newest user edits
      if (
        !config.namaSekretariat ||
        config.namaSekretariat === 'Sekretariat DPP IPPI Pusat' ||
        config.namaSekretariat.includes('Pusat') ||
        (config.alamatSekretariat && config.alamatSekretariat.includes('Diponegoro')) ||
        (config.noIjinPendirian && config.noIjinPendirian.includes('AHU-0012411')) ||
        config.noTelp === '021-3901234' ||
        config.email === 'dpp@ippi-pensiunan.or.id' ||
        (config.noRekeningIppiBaris1 && config.noRekeningIppiBaris1.includes('1023048999'))
      ) {
        config = { ...config, ...INITIAL_CONFIG };
        setDoc(doc(db, 'config', 'main'), config).catch(() => {});
      }

      localStorage.setItem('ippi_config', JSON.stringify(config));
      notifyListeners();
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'config/main');
  });

  // 3. Content Sync (Robust Split Document Architecture)
  const contentDocs = [
    { 
      docId: 'main', 
      field: null, 
      getLocal: (c: HomepageContent) => ({
        heroTitle: c.heroTitle || INITIAL_CONTENT.heroTitle,
        heroSub: c.heroSub || INITIAL_CONTENT.heroSub,
        heroText: c.heroText || INITIAL_CONTENT.heroText,
        visiMisi: c.visiMisi || INITIAL_CONTENT.visiMisi,
        mengapaBergabung: c.mengapaBergabung || INITIAL_CONTENT.mengapaBergabung,
      })
    },
    { 
      docId: 'about_items', 
      field: 'aboutItems' as const, 
      getLocal: (c: HomepageContent) => c.aboutItems || INITIAL_CONTENT.aboutItems || []
    },
    { 
      docId: 'program_kerja', 
      field: 'programList' as const, 
      getLocal: (c: HomepageContent) => c.programList || INITIAL_CONTENT.programList || []
    },
    { 
      docId: 'galeri_kegiatan', 
      field: 'kegiatan' as const, 
      getLocal: (c: HomepageContent) => c.kegiatan || INITIAL_CONTENT.kegiatan || []
    },
    { 
      docId: 'berita', 
      field: 'beritaList' as const, 
      getLocal: (c: HomepageContent) => c.beritaList || INITIAL_CONTENT.beritaList || []
    },
    { 
      docId: 'jurnal_list', 
      field: 'jurnalList' as const, 
      getLocal: (c: HomepageContent) => c.jurnalList || INITIAL_CONTENT.jurnalList || []
    },
    { 
      docId: 'struktur_list', 
      field: 'strukturList' as const, 
      getLocal: (c: HomepageContent) => c.strukturList || INITIAL_CONTENT.strukturList || []
    },
    { 
      docId: 'fokus_kontribusi', 
      field: 'fokusList' as const, 
      getLocal: (c: HomepageContent) => c.fokusList || INITIAL_CONTENT.fokusList || []
    },
    { 
      docId: 'umkm_list', 
      field: 'umkmList' as const, 
      getLocal: (c: HomepageContent) => c.umkmList || INITIAL_CONTENT.umkmList || []
    }
  ];

  contentDocs.forEach(({ docId, field, getLocal }) => {
    onSnapshot(doc(db, 'content', docId), async (snapshot) => {
      if (!snapshot.exists()) {
        try {
          const currentContent = getStoredContent();
          const localVal = getLocal(currentContent);
          const payload = field ? { list: localVal } : localVal;
          await setDoc(doc(db, 'content', docId), payload);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `content/${docId}`);
        }
      } else {
        const data = snapshot.data();
        if (!cachedContent) {
          cachedContent = getStoredContent();
        }

        if (!field) {
          // main info update
          let visiMisiText = data?.visiMisi || INITIAL_CONTENT.visiMisi;
          const oldVisi1 = 'Menjadi organisasi pensiunan profesional terdepan yang aktif dalam pemberdayaan masyarakat, kemitraan strategis, serta peningkatan kesejahteraan rohani, jasmani, dan sosial para anggotanya.';
          const oldVisi2 = 'Menjadi organisasi bagi pensiunan profesional terdepan yang aktif dalam pemberdayaan masyarakat, kemitraan strategis, serta peningkatan kesejahteraan rohani, jasmani, sosial dan bisnis bagi para anggotanya.';
          const oldVisi3 = 'Menjadi organisasi pensiunan profesional terdepan yang aktif dalam pemberdayaan masyarakat, kemitraan strategis, peningkatan kesejahteraan rohani, jasmani dan sosial serta bisnis bagi para anggotanya.';
          const oldVisi4 = 'Menjadi organisasi pensiunan profesional terdepan yang aktif dalam pemberdayaan masyarakat, kemitraan strategis, peningkatan kesejahteraan rohani, jasmani, dan sosial dan bisnis bagi para anggotanya.';
          if (
            !visiMisiText || 
            visiMisiText === oldVisi1 || 
            visiMisiText === oldVisi2 || 
            visiMisiText === oldVisi3 || 
            visiMisiText === oldVisi4 || 
            visiMisiText.includes('dan sosial serta bisnis') || 
            visiMisiText.includes('dan sosial dan bisnis') || 
            visiMisiText.includes('organisasi bagi pensiunan')
          ) {
            visiMisiText = INITIAL_CONTENT.visiMisi;
          }

          cachedContent = {
            ...cachedContent,
            heroTitle: data?.heroTitle || INITIAL_CONTENT.heroTitle,
            heroSub: data?.heroSub || INITIAL_CONTENT.heroSub,
            heroText: data?.heroText || INITIAL_CONTENT.heroText,
            visiMisi: visiMisiText,
            mengapaBergabung: data?.mengapaBergabung || INITIAL_CONTENT.mengapaBergabung,
          };
        } else {
          // list array update
          const list = Array.isArray(data?.list) ? data.list : [];
          cachedContent = {
            ...cachedContent,
            [field]: list
          };
        }

        localStorage.setItem('ippi_content', JSON.stringify(cachedContent));
        notifyListeners();
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `content/${docId}`);
    });
  });

  // 4. Transactions Sync
  onSnapshot(collection(db, 'transactions'), async (snapshot) => {
    if (snapshot.empty) {
      try {
        const list = getStoredTransactions();
        for (const tx of list) {
          await setDoc(doc(db, 'transactions', tx.id), tx);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'transactions');
      }
    } else {
      const list: FinancialTransaction[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as FinancialTransaction);
      });
      list.sort((a, b) => a.no - b.no);
      localStorage.setItem('ippi_transactions', JSON.stringify(list));
      notifyListeners();
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'transactions');
  });

  // 4b. Neraca Sync
  onSnapshot(doc(db, 'config', 'neraca'), async (snapshot) => {
    if (!snapshot.exists()) {
      try {
        const currentNeraca = getStoredNeraca();
        await setDoc(doc(db, 'config', 'neraca'), currentNeraca);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'config/neraca');
      }
    } else {
      const data = snapshot.data() as BalanceSheetData;
      localStorage.setItem('ippi_neraca', JSON.stringify(data));
      notifyListeners();
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'config/neraca');
  });

  // 5. Visitors Sync
  onSnapshot(collection(db, 'visitors'), async (snapshot) => {
    if (snapshot.empty) {
      try {
        const list = getStoredVisitors();
        for (const v of list) {
          await setDoc(doc(db, 'visitors', v.id), v);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'visitors');
      }
    } else {
      const list: VisitorLog[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as VisitorLog);
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      localStorage.setItem('ippi_visitors', JSON.stringify(list));
      notifyListeners();
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'visitors');
  });
}

// Automatically bind listeners on module load after short delay
setTimeout(() => {
  initializeFirestoreSync();
}, 100);

export function getStoredMembers(): Member[] {
  const data = localStorage.getItem('ippi_members');
  if (!data) {
    localStorage.setItem('ippi_members', JSON.stringify(INITIAL_MEMBERS));
    return INITIAL_MEMBERS;
  }
  return JSON.parse(data);
}

export async function saveStoredMembers(members: Member[]): Promise<void> {
  const currentLocal = JSON.parse(localStorage.getItem('ippi_members') || '[]');
  const incomingIds = new Set(members.map(m => m.id));
  const deletedIds = currentLocal.filter((m: any) => m && m.id && !incomingIds.has(m.id)).map((m: any) => m.id);

  localStorage.setItem('ippi_members', JSON.stringify(members));
  
  try {
    const promises: Promise<any>[] = [];
    members.forEach((m) => {
      promises.push(setDoc(doc(db, 'members', m.id), sanitizeFirestoreData(m)));
    });
    deletedIds.forEach((id: string) => {
      promises.push(deleteDoc(doc(db, 'members', id)));
    });
    await Promise.all(promises);
    window.dispatchEvent(new Event('ippi_storage_updated'));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'members_banyak');
  }
}

export function getStoredConfig(): OrgConfig {
  const data = localStorage.getItem('ippi_config');
  if (!data) {
    localStorage.setItem('ippi_config', JSON.stringify(INITIAL_CONFIG));
    return INITIAL_CONFIG;
  }
  const parsed = JSON.parse(data);
  let updated = false;
  if (!parsed.logoUrl) {
    parsed.logoUrl = INITIAL_CONFIG.logoUrl;
    updated = true;
  }

  // Auto-migrate local storage configuration if it holds outdated DPP Pusat or placeholder values
  if (
    !parsed.namaSekretariat ||
    parsed.namaSekretariat === 'Sekretariat DPP IPPI Pusat' ||
    parsed.namaSekretariat.includes('Pusat') ||
    (parsed.alamatSekretariat && parsed.alamatSekretariat.includes('Diponegoro')) ||
    (parsed.noIjinPendirian && parsed.noIjinPendirian.includes('AHU-0012411')) ||
    parsed.noTelp === '021-3901234' ||
    parsed.email === 'dpp@ippi-pensiunan.or.id' ||
    (parsed.noRekeningIppiBaris1 && parsed.noRekeningIppiBaris1.includes('1023048999'))
  ) {
    Object.assign(parsed, INITIAL_CONFIG);
    updated = true;
  }

  if (updated) {
    localStorage.setItem('ippi_config', JSON.stringify(parsed));
  }
  return parsed;
}

export async function saveStoredConfig(config: OrgConfig): Promise<void> {
  localStorage.setItem('ippi_config', JSON.stringify(config));
  try {
    await setDoc(doc(db, 'config', 'main'), sanitizeFirestoreData(config));
    window.dispatchEvent(new Event('ippi_storage_updated'));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'config/main');
  }
}

export function getStoredContent(): HomepageContent {
  if (cachedContent) return cachedContent;
  const data = localStorage.getItem('ippi_content');
  if (!data) {
    localStorage.setItem('ippi_content', JSON.stringify(INITIAL_CONTENT));
    cachedContent = INITIAL_CONTENT;
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
  if (!parsed.umkmList) {
    parsed.umkmList = INITIAL_CONTENT.umkmList || [];
    updated = true;
  }
  
  // Auto-migrate outdated/stale visiMisi text to the requested updated wording
  const oldVisi1 = 'Menjadi organisasi pensiunan profesional terdepan yang aktif dalam pemberdayaan masyarakat, kemitraan strategis, serta peningkatan kesejahteraan rohani, jasmani, dan sosial para anggotanya.';
  const oldVisi2 = 'Menjadi organisasi bagi pensiunan profesional terdepan yang aktif dalam pemberdayaan masyarakat, kemitraan strategis, serta peningkatan kesejahteraan rohani, jasmani, sosial dan bisnis bagi para anggotanya.';
  const oldVisi3 = 'Menjadi organisasi pensiunan profesional terdepan yang aktif dalam pemberdayaan masyarakat, kemitraan strategis, peningkatan kesejahteraan rohani, jasmani dan sosial serta bisnis bagi para anggotanya.';
  const oldVisi4 = 'Menjadi organisasi pensiunan profesional terdepan yang aktif dalam pemberdayaan masyarakat, kemitraan strategis, peningkatan kesejahteraan rohani, jasmani, dan sosial dan bisnis bagi para anggotanya.';
  if (
    !parsed.visiMisi || 
    parsed.visiMisi === oldVisi1 || 
    parsed.visiMisi === oldVisi2 || 
    parsed.visiMisi === oldVisi3 || 
    parsed.visiMisi === oldVisi4 || 
    parsed.visiMisi.includes('dan sosial serta bisnis') || 
    parsed.visiMisi.includes('dan sosial dan bisnis') || 
    parsed.visiMisi.includes('organisasi bagi pensiunan')
  ) {
    parsed.visiMisi = INITIAL_CONTENT.visiMisi;
    updated = true;
  }

  if (updated) {
    localStorage.setItem('ippi_content', JSON.stringify(parsed));
  }
  cachedContent = parsed;
  return parsed;
}

export async function saveStoredContent(content: HomepageContent): Promise<void> {
  cachedContent = content;
  // First update LocalStorage
  localStorage.setItem('ippi_content', JSON.stringify(content));

  try {
    const promises = [
      // 1. Save main info metadata
      setDoc(doc(db, 'content', 'main'), sanitizeFirestoreData({
        heroTitle: content.heroTitle || INITIAL_CONTENT.heroTitle,
        heroSub: content.heroSub || INITIAL_CONTENT.heroSub,
        heroText: content.heroText || INITIAL_CONTENT.heroText,
        visiMisi: content.visiMisi || INITIAL_CONTENT.visiMisi,
        mengapaBergabung: content.mengapaBergabung || INITIAL_CONTENT.mengapaBergabung,
      })),
      // 2. Save individual lists to separate specialized documents for sub-1MB guarantees
      setDoc(doc(db, 'content', 'about_items'), sanitizeFirestoreData({ list: content.aboutItems || [] })),
      setDoc(doc(db, 'content', 'program_kerja'), sanitizeFirestoreData({ list: content.programList || [] })),
      setDoc(doc(db, 'content', 'galeri_kegiatan'), sanitizeFirestoreData({ list: content.kegiatan || [] })),
      setDoc(doc(db, 'content', 'berita'), sanitizeFirestoreData({ list: content.beritaList || [] })),
      setDoc(doc(db, 'content', 'jurnal_list'), sanitizeFirestoreData({ list: content.jurnalList || [] })),
      setDoc(doc(db, 'content', 'struktur_list'), sanitizeFirestoreData({ list: content.strukturList || [] })),
      setDoc(doc(db, 'content', 'fokus_kontribusi'), sanitizeFirestoreData({ list: content.fokusList || [] })),
      setDoc(doc(db, 'content', 'umkm_list'), sanitizeFirestoreData({ list: content.umkmList || [] }))
    ];

    await Promise.all(promises);
    window.dispatchEvent(new Event('ippi_storage_updated'));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'content_all');
  }
}

export function getStoredTransactions(): FinancialTransaction[] {
  const data = localStorage.getItem('ippi_transactions');
  if (!data) {
    localStorage.setItem('ippi_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    return INITIAL_TRANSACTIONS;
  }
  return JSON.parse(data);
}

export async function saveStoredTransactions(txs: FinancialTransaction[]): Promise<void> {
  const currentLocal = JSON.parse(localStorage.getItem('ippi_transactions') || '[]');
  const incomingIds = new Set(txs.map(t => t.id));
  const deletedIds = currentLocal.filter((t: any) => t && t.id && !incomingIds.has(t.id)).map((t: any) => t.id);

  localStorage.setItem('ippi_transactions', JSON.stringify(txs));

  try {
    const batch = writeBatch(db);
    
    // Add or update active transactions
    txs.forEach((tx) => {
      const txRef = doc(db, 'transactions', tx.id);
      batch.set(txRef, sanitizeFirestoreData(tx));
    });

    // Delete removed transactions
    deletedIds.forEach((id: string) => {
      const txRef = doc(db, 'transactions', id);
      batch.delete(txRef);
    });

    await batch.commit();
    window.dispatchEvent(new Event('ippi_storage_updated'));
  } catch (err) {
    console.error('Error in saveStoredTransactions batch process:', err);
    handleFirestoreError(err, OperationType.WRITE, 'transactions_batch');
  }
}

export function getStoredVisitors(): VisitorLog[] {
  const data = localStorage.getItem('ippi_visitors');
  if (!data) {
    localStorage.setItem('ippi_visitors', JSON.stringify(INITIAL_VISITORS));
    return INITIAL_VISITORS;
  }
  return JSON.parse(data);
}

export async function saveStoredVisitors(logs: VisitorLog[]): Promise<void> {
  const currentLocal = JSON.parse(localStorage.getItem('ippi_visitors') || '[]');
  const incomingIds = new Set(logs.map(l => l.id));
  const deletedIds = currentLocal.filter((l: any) => l && l.id && !incomingIds.has(l.id)).map((l: any) => l.id);

  localStorage.setItem('ippi_visitors', JSON.stringify(logs));

  try {
    const promises: Promise<any>[] = [];
    logs.forEach((log) => {
       promises.push(setDoc(doc(db, 'visitors', log.id), sanitizeFirestoreData(log)));
    });
    deletedIds.forEach((id: string) => {
      promises.push(deleteDoc(doc(db, 'visitors', id)));
    });
    await Promise.all(promises);
    window.dispatchEvent(new Event('ippi_storage_updated'));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'visitors_banyak');
  }
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

export function getStoredNeraca(): BalanceSheetData {
  const data = localStorage.getItem('ippi_neraca');
  if (!data) {
    localStorage.setItem('ippi_neraca', JSON.stringify(INITIAL_NERACA));
    return INITIAL_NERACA;
  }
  return JSON.parse(data);
}

export async function saveStoredNeraca(neraca: BalanceSheetData): Promise<void> {
  localStorage.setItem('ippi_neraca', JSON.stringify(neraca));
  try {
    await setDoc(doc(db, 'config', 'neraca'), sanitizeFirestoreData(neraca));
    window.dispatchEvent(new Event('ippi_storage_updated'));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'config/neraca');
  }
}

/**
 * Utility to compress base64 image uploads on client-side
 * to prevent Firestore 1MB limits and LocalStorage 5MB limits.
 */
export function compressImage(file: File, maxWidth = 1000, maxHeight = 1000, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = () => {
        let width = image.width;
        let height = image.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }
        ctx.drawImage(image, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      image.onerror = (err) => {
        reject(err);
      };
      if (readerEvent.target?.result) {
        image.src = readerEvent.target.result as string;
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}



