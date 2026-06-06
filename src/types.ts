export enum UserRole {
  ADMIN = 'ADMIN',
  ANGGOTA = 'ANGGOTA',
  SEKRETARIS = 'SEKRETARIS',
  KETUA = 'KETUA',
  BENDAHARA = 'BENDAHARA',
}

export enum Agama {
  ISLAM = 'Islam',
  KRISTEN = 'Kristen',
  BUDHA = 'Budha',
  HINDU = 'Hindu',
  KONGHUCU = 'Konghucu',
  KEPERCAYAAN = 'Kepercayaan',
}

export enum JenisKelamin {
  LAKI_LAKI = 'Laki-Laki',
  PEREMPUAN = 'Perempuan',
}

export interface Member {
  id: string; // unique ID
  nama: string; // Mohammad Muslih, S.H., M.M.
  tempatLahir: string;
  tanggalLahir: string;
  institusiPensiun: string;
  jenisKelamin: JenisKelamin;
  agama: Agama;
  keahlian: string;
  noTelp: string;
  email: string;
  alamat: string;
  password?: string;
  role?: UserRole; // User role setting for dynamic logins
  isApproved: boolean;
  noAnggota?: string; // e.g. 999000011
  noRekening?: string; // 10-digit, e.g. 999000011
}

export interface OrgConfig {
  logoText: string;
  logoUrl?: string;
  namaSekretariat: string;
  alamatSekretariat: string;
  noIjinPendirian: string;
  noTelp: string;
  email: string;
  noRekeningIppiBaris1?: string;
  noRekeningIppiBaris2?: string;
}

export interface VisitorLog {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  action: 'LOGIN' | 'LOGOUT';
  timestamp: string;
}

export enum TransaksiKategori {
  MASUK = 'Uang Masuk',
  KELUAR = 'Uang Keluar',
}

export enum SumberDana {
  IURAN = 'Iuran Anggota',
  NOTA_MASUK = 'Nota Dana Masuk',
  DANA_DPP = 'Dana DPP',
  DANA_DPW = 'Penerimaan dari DPW',
  SPJ = 'SPJ',
  OPERASIONAL = 'Operasional',
  LAINNYA = 'Lainnya',
}

export interface FinancialTransaction {
  id: string;
  no: number;
  tanggal: string;
  kategori: TransaksiKategori;
  sumberTujuan: SumberDana;
  deskripsi: string;
  noRekening: string; // nomor rekening & bank & pemilik
  jumlahMasuk: number;
  jumlahKeluar: number;
  saldoAkhir: number;
  memberId?: string; // link to member if iuran
}

export interface HomepageContent {
  heroTitle: string;
  heroSub: string;
  heroText: string;
  visiMisi: string;
  mengapaBergabung: string[];
  kegiatan?: ActivityPhoto[];
  strukturList?: StructureItem[];
  aboutItems?: AboutItem[];
  programList?: ProgramItem[];
  beritaList?: BeritaItem[];
  jurnalList?: JurnalItem[];
  fokusList?: FokusKontribusi[];
  umkmList?: UmkmProduct[];
}

export interface UmkmProduct {
  id: string;
  namaProduk: string;
  namaPenjual: string;
  deskripsi: string;
  harga: number | string;
  imageUrl?: string;
  videoUrl?: string;
  linkBeli?: string;
  whatsappPenjual?: string;
  kategori?: string;
  urutan?: number;
  isBeranda?: boolean;
}

export interface FokusKontribusi {
  id: string;
  judul: string;
  deskripsi: string;
  urutan: number;
  fileName?: string;
  fileType?: string;
  fileData?: string;
  linkFacebook?: string;
  linkInstagram?: string;
  linkYoutube?: string;
  imageUrl?: string;
}

export interface AboutItem {
  id: string;
  judul: string;
  deskripsi: string;
  urutan: number;
}

export interface ProgramItem {
  id: string;
  judul: string;
  kategori: string;
  deskripsi: string;
  isHighlighted?: boolean;
  urutan: number;
  fileName?: string;
  fileType?: string;
  fileData?: string; // base64 encoded document
  linkFacebook?: string;
  linkInstagram?: string;
  linkYoutube?: string;
  imageUrl?: string;
}

export interface BeritaItem {
  id: string;
  judul: string;
  tanggal: string;
  kutipan: string;
  penulis: string;
  fileName?: string;
  fileType?: string;
  fileData?: string;
  linkFacebook?: string;
  linkInstagram?: string;
  linkYoutube?: string;
  imageUrl?: string;
}

export interface JurnalItem {
  id: string;
  judul: string;
  tanggalPublikasi: string;
  subjek: string;
  abstrak: string;
  fileName?: string;
  fileType?: string;
  fileData?: string;
  linkFacebook?: string;
  linkInstagram?: string;
  linkYoutube?: string;
  imageUrl?: string;
}

export interface ActivityPhoto {
  id: string;
  imageUrl: string; // Base64 or Unsplash URL
  videoUrl?: string; // YouTube or direct video URL (optional)
  isVideo?: boolean; // flag to distinguish video
  judul: string;
  deskripsi?: string;
  tanggal?: string;
  fullOverview?: string;
  fileName?: string;
  fileType?: string;
  fileData?: string;
  linkFacebook?: string;
  linkInstagram?: string;
  linkYoutube?: string;
  isBest?: boolean;
  urutan?: number;
}

export interface StructureItem {
  id: string;
  nama: string;
  jabatan: string; // e.g. Ketua Umum, Sekretaris Jenderal, Bendahara Umum, dll.
  photoUrl?: string; // photo base64/url
  urutan: number; // custom sorting
}

export interface BalanceSheetData {
  piutangAnggota: number;
  uangMukaPanjar: number;
  lainLainAktivaLancar: number;
  lainLainAktivaLancarKet: string;
  
  peralatanKantor: number;
  akumulasiPenyusutan: number; // usually entered as positive and subtracted
  lainLainAktivaTetap: number;
  lainLainAktivaTetapKet: string;

  hutangOperasional: number;
  kewajibanLainnya: number;
  lainLainLiabilitas: number;
  lainLainLiabilitasKet: string;

  modalCadangan: number;
  surplusDefisit: number;
  lainLainEkuitas: number;
  lainLainEkuitasKet: string;
}

