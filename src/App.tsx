import React, { useState, useEffect } from 'react';
import { Member, UserRole, OrgConfig, HomepageContent } from './types';
import { getStoredConfig, getStoredContent, getStoredMembers, saveStoredMembers, logVisitorAction, saveStoredContent, getStoredTransactions, getStoredNeraca } from './utils/storage';
import RegistrationForm from './components/RegistrationForm';
import LoginModal from './components/LoginModal';
import MemberCard from './components/MemberCard';
import FinancialSheet from './components/FinancialSheet';
import MemberFinanceInfo from './components/MemberFinanceInfo';
import AdminPanel from './components/AdminPanel';
import SecretaryPanel from './components/SecretaryPanel';
import KopSurat from './components/KopSurat';
import LapakUmkm from './components/LapakUmkm';
import LaporanNeraca from './components/LaporanNeraca';

import {
  Menu,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  User,
  LogOut,
  Sparkles,
  BookOpen,
  Volume2,
  Calendar,
  Layers,
  Heart,
  FileCheck,
  ChevronDown,
  Info,
  Sliders,
  Maximize2,
  Minimize2,
  Eye,
  Settings,
  Printer,
  FileText,
  Download,
  X,
  Paperclip,
  Facebook,
  Instagram,
  Youtube,
  Video,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

function getEmbedUrl(url: string | undefined): string {
  if (!url) return '';
  const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return url;
}

export default function App() {
  // Config states (reactive edits from storage)
  const [orgConfig, setOrgConfig] = useState<OrgConfig>(getStoredConfig());
  const [homeContent, setHomeContent] = useState<HomepageContent>(getStoredContent());
  const [txs, setTxs] = useState(() => getStoredTransactions());
  const [neraca, setNeraca] = useState(() => getStoredNeraca());

  // Session states
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [registeredCount, setRegisteredCount] = useState<number>(getStoredMembers().length);

  // Elder accessibility font zoom
  const [fontScale, setFontScale] = useState<'standard' | 'large' | 'xl'>('standard');

  // Multi-screen / tab system
  const [activeTab, setActiveTab] = useState<'HOME' | 'ABOUT' | 'PROGRAM' | 'GALLERY' | 'BLOG' | 'MANAGEMENT' | 'JOURNAL' | 'UMKM'>('HOME');

  // Sliding current indices (sliding 2-3 items window)
  const [aboutSlideIndex, setAboutSlideIndex] = useState(0);
  const [programSlideIndex, setProgramSlideIndex] = useState(0);
  const [gallerySlideIndex, setGallerySlideIndex] = useState(0);
  const [homeKegiatanSlideIndex, setHomeKegiatanSlideIndex] = useState(0);
  const [newsSlideIndex, setNewsSlideIndex] = useState(0);
  const [journalSlideIndex, setJournalSlideIndex] = useState(0);
  const [strukturSlideIndex, setStrukturSlideIndex] = useState(0);

  // Trigger modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [activePreviewDoc, setActivePreviewDoc] = useState<{ name: string; type: string; data: string } | null>(null);

  // Member editing form profile (Akses Anggota) No Telp, Email, Alamat
  const [memberPhone, setMemberPhone] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberAddress, setMemberAddress] = useState('');
  const [isEditProfileSuccess, setIsEditProfileSuccess] = useState(false);

  // Load state
  useEffect(() => {
    // Check if user has active session saved in local storage (demo-only runtime session)
    const sessionUser = sessionStorage.getItem('ippi_active_user');
    const sessionRole = sessionStorage.getItem('ippi_active_role');
    if (sessionUser && sessionRole) {
      const parsed = JSON.parse(sessionUser);
      setCurrentUser(parsed);
      setCurrentRole(sessionRole as UserRole);

      setMemberPhone(parsed.noTelp);
      setMemberEmail(parsed.email);
      setMemberAddress(parsed.alamat);
    }
  }, []);

  // Listen for backend real-time Firestore synchronization push events
  useEffect(() => {
    const handleStorageUpdate = () => {
      setOrgConfig(getStoredConfig());
      setHomeContent(getStoredContent());
      setTxs(getStoredTransactions());
      setNeraca(getStoredNeraca());
      setRegisteredCount(getStoredMembers().length);

      const sessionUser = sessionStorage.getItem('ippi_active_user');
      if (sessionUser) {
        try {
          const parsed = JSON.parse(sessionUser);
          const fresh = getStoredMembers().find(m => m.id === parsed.id);
          if (fresh) {
            setCurrentUser(fresh);
            sessionStorage.setItem('ippi_active_user', JSON.stringify(fresh));
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    window.addEventListener('ippi_storage_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('ippi_storage_updated', handleStorageUpdate);
    };
  }, []);

  useEffect(() => {
    if (orgConfig.logoUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = orgConfig.logoUrl;
    }
    if (orgConfig.logoText) {
      document.title = `${orgConfig.logoText} - Persatuan Pensiunan Indonesia`;
    }
  }, [orgConfig.logoUrl, orgConfig.logoText]);

  // Update profile for Member
  const handleUpdateMemberProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const list = getStoredMembers();
    const updated = list.map((m) => {
      if (m.id === currentUser.id) {
        return {
          ...m,
          noTelp: memberPhone,
          email: memberEmail,
          alamat: memberAddress,
        };
      }
      return m;
    });

    saveStoredMembers(updated);
    
    // Update active session
    const updatedUser = { ...currentUser, noTelp: memberPhone, email: memberEmail, alamat: memberAddress };
    setCurrentUser(updatedUser);
    sessionStorage.setItem('ippi_active_user', JSON.stringify(updatedUser));

    setIsEditProfileSuccess(true);
    setTimeout(() => {
      setIsEditProfileSuccess(false);
    }, 4000);
  };

  const handleLoginSuccess = (member: Member, role: UserRole) => {
    setCurrentUser(member);
    setCurrentRole(role);
    setIsLoginOpen(false);

    setMemberPhone(member.noTelp);
    setMemberEmail(member.email);
    setMemberAddress(member.alamat);

    sessionStorage.setItem('ippi_active_user', JSON.stringify(member));
    sessionStorage.setItem('ippi_active_role', role);
  };

  const handleLogout = () => {
    if (currentUser && currentRole) {
      logVisitorAction(currentUser.nama, currentUser.email, currentRole, 'LOGOUT');
    }
    setCurrentUser(null);
    setCurrentRole(null);
    sessionStorage.clear();
    setActiveTab('HOME');
  };

  // Font size responsive multiplier
  const getFontSizeStyle = () => {
    if (fontScale === 'large') return { fontSize: '115%', lineHeight: '1.6' };
    if (fontScale === 'xl') return { fontSize: '130%', lineHeight: '1.7' };
    return { fontSize: '100%', lineHeight: '1.5' };
  };

  // Predefined events for gallery
  const GALLERY_PRESETS = [
    {
      title: 'Musyawarah Nasional Luar Biasa (Munaslub)',
      desc: 'Pertemuan pengurus DPP IPPI se-Indonesia membahas perumusan Jurnal Logistik Nasional di Balai Kartini.',
      date: '12 April 2026',
      role: 'Kekeluargaan & Akademisi'
    },
    {
      title: 'Sosialisasi Program Pengabdian Desa Binaan',
      desc: 'Membagikan keahlian manajemen kurir dan logistik pedesaan bagi pelaku UMKM di Madiun Lor.',
      date: '02 Mei 2026',
      role: 'Sosial Mandiri'
    },
    {
      title: 'Sesi Senam Sehat & Gathering Senior',
      desc: 'Gathering santai purnabakti profesional di taman wisata asri menjaga kebugaran jasmani dan silaturahmi.',
      date: '10 Mei 2026',
      role: 'Kesehatan Lansia'
    }
  ];

  // Predefined news (Berita)
  const NEWS_PRESETS = [
    {
      title: 'Ketauladanan Anggota: Pensiunan PT Pos Bagikan Formula Tata Logistik Ummah',
      date: '28 Mei 2026',
      excerpt: 'Madiun – Anggota Dewan Pengurus IPPI, Prof. Dr. Ir. H. Mohammad Muslih, M.M., memaparkan gagasan revolusioner integrasi pos logistik pedesaan.',
      author: 'Admin IPPI News'
    },
    {
      title: 'Kemenkumham Resmi Mengesahkan Perpanjangan Lisensi Pengurus IPPI Pusat',
      date: '15 Mei 2026',
      excerpt: 'Jakarta – Surat keputusan dengan nomor ijin AHU-0012411.AH.01.07 secara resmi didelegasikan kepada Ketua Umum demi memuluskan jalannya program kerja nasional.',
      author: 'Humas Hubungan Kelembagaan'
    }
  ];

  // Predefined Journals (Jurnal)
  const JOURNAL_PRESETS = [
    {
      title: 'Vol 3 No 1 (2026): Jurnal Pensiunan Profesional Indonesia (JPPI)',
      pubDate: 'Mei 2026',
      subject: 'Inovasi Logistik, Kurir Terpadu, Jasa Keuangan Mandiri Bagi Masyarakat',
      abstract: 'Menelaah pemikiran para pakar senior purna tugas dalam meningkatkan efisiensi rantai pasok daerah terpencil.'
    },
    {
      title: 'Vol 2 No 4 (2025): Optimalisasi Peran Dewan Pengawas Keuangan Daerah',
      pubDate: 'November 2025',
      subject: 'Audit Publik Mandiri, Pengawasan Sosial BUMN & BUMD',
      abstract: 'Studi komparatif keterlibatan profesional akuntan pensiunan dalam pendampingan tata kelola keuangan pedesaan.'
    }
  ];

  return (
    <div 
      className="min-h-screen bg-[#FDFCF8] text-[#2D2D2D] font-sans flex flex-col selection:bg-[#C5A059] selection:text-white transition-all overflow-x-hidden"
      style={getFontSizeStyle()}
    >
      
      {/* ⚠️ ACCESSIBILITY PANEL AT THE VERY TOP FOR ELDER RECIPIENTS */}
      <div className="bg-[#1B365D] text-white text-xs py-2 px-4 shadow-inner flex flex-wrap items-center justify-between gap-2 border-b border-[#C5A059]/40">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="inline-flex max-sm:hidden w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
          <span className="font-serif italic text-[11px] sm:text-xs">
            Selamat Datang di Portal Ikatan Profesional & Pensiunan Indonesia |           </span>
        </div>

        {/* Font Zoom Controller & Auth Switcher */}
        <div className="flex items-center space-x-4 ml-auto">
          <div className="flex items-center space-x-1 bg-[#254370] rounded-full px-2 py-0.5 border border-white/10 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-300">Aksesibilitas Huruf:</span>
            <button
              onClick={() => setFontScale('standard')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${fontScale === 'standard' ? 'bg-[#C5A059] text-white' : 'text-slate-200 hover:text-white'}`}
              title="Huruf Normal"
            >
              Normal
            </button>
            <button
              onClick={() => setFontScale('large')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${fontScale === 'large' ? 'bg-[#C5A059] text-white' : 'text-slate-200 hover:text-white'}`}
              title="Huruf Lebih Besar"
            >
              Besar (A+)
            </button>
            <button
              onClick={() => setFontScale('xl')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${fontScale === 'xl' ? 'bg-[#C5A059] text-white' : 'text-slate-200 hover:text-white'}`}
              title="Sangat Besar (A++)"
            >
              Lansia (A++)
            </button>
          </div>
        </div>
      </div>

      {/* TOP BRANDING HEADER */}
      <header className="border-b border-[#E5E0D5] bg-[#FDFCF8] sticky top-0 py-4 px-4 sm:px-6 lg:px-10 z-30 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Headline */}
          <div className="flex items-center space-x-4 self-start md:self-center">
            <div className="w-12 h-12 bg-[#1B365D] rounded-full flex items-center justify-center text-white font-serif font-black text-xl border-2 border-[#C5A059] shadow-sm select-none shrink-0 overflow-hidden">
              {orgConfig.logoUrl ? (
                <img src={orgConfig.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                orgConfig.logoText
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-serif font-bold text-[#1B365D] tracking-tight leading-tight uppercase">
                Ikatan Profesional & Pensiunan Indonesia
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#8B7E66] font-bold mt-0.5">
                Dedikasi Tanpa Batas, Pengalaman Berharga
              </span>
            </div>
          </div>

          {/* Top Navbar & Quick Buttons */}
          <nav className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs sm:text-sm font-bold uppercase tracking-wide text-[#5D574F]">
            <button
              onClick={() => { setActiveTab('HOME'); setIsRegisterOpen(false); }}
              className={`py-1.5 px-1 border-b-2 transition-colors cursor-pointer ${activeTab === 'HOME' && !isRegisterOpen ? 'border-[#1B365D] text-[#1B365D]' : 'border-transparent hover:text-[#1B365D]'}`}
            >
              Beranda
            </button>
            <button
              onClick={() => { setActiveTab('ABOUT'); setIsRegisterOpen(false); }}
              className={`py-1.5 px-1 border-b-2 transition-colors cursor-pointer ${activeTab === 'ABOUT' ? 'border-[#1B365D] text-[#1B365D]' : 'border-transparent hover:text-[#1B365D]'}`}
            >
              Tentang Kami
            </button>
            <button
              onClick={() => { setActiveTab('PROGRAM'); setIsRegisterOpen(false); }}
              className={`py-1.5 px-1 border-b-2 transition-colors cursor-pointer ${activeTab === 'PROGRAM' ? 'border-[#1B365D] text-[#1B365D]' : 'border-transparent hover:text-[#1B365D]'}`}
            >
              Program Kerja
            </button>
            <button
              onClick={() => { setActiveTab('GALLERY'); setIsRegisterOpen(false); }}
              className={`py-1.5 px-1 border-b-2 transition-colors cursor-pointer ${activeTab === 'GALLERY' ? 'border-[#1B365D] text-[#1B365D]' : 'border-transparent hover:text-[#1B365D]'}`}
            >
              Galeri Kegiatan
            </button>
            <button
              onClick={() => { setActiveTab('BLOG'); setIsRegisterOpen(false); }}
              className={`py-1.5 px-1 border-b-2 transition-colors cursor-pointer ${activeTab === 'BLOG' ? 'border-[#1B365D] text-[#1B365D]' : 'border-transparent hover:text-[#1B365D]'}`}
            >
              Berita
            </button>
            <button
              onClick={() => { setActiveTab('JOURNAL'); setIsRegisterOpen(false); }}
              className={`py-1.5 px-1 border-b-2 transition-colors cursor-pointer ${activeTab === 'JOURNAL' ? 'border-[#1B365D] text-[#1B365D]' : 'border-transparent hover:text-[#1B365D]'}`}
            >
              Jurnal
            </button>
            <button
              onClick={() => { setActiveTab('UMKM'); setIsRegisterOpen(false); }}
              className={`py-1.5 px-1 border-b-2 transition-colors cursor-pointer ${activeTab === 'UMKM' ? 'border-[#1B365D] text-[#1B365D]' : 'border-transparent hover:text-[#1B365D]'}`}
            >
              Lapak UMKM
            </button>

            {/* IF NOT LOGGED IN: SHOW REGISTER / LOGIN */}
            {!currentUser ? (
              <div className="flex items-center space-x-2 pl-3">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-3.5 py-2 hover:bg-gray-100 rounded-lg text-[#1B365D] transition-colors cursor-pointer"
                >
                  Masuk
                </button>
                <button
                  onClick={() => { setIsRegisterOpen(true); }}
                  className="bg-[#C5A059] text-white px-4 py-2 rounded-full hover:bg-[#B38F4D] transition-colors shadow-sm cursor-pointer"
                >
                  Pendaftaran
                </button>
              </div>
            ) : (
              // If logged in: Portal Quick access tab
              <div className="flex items-center space-x-3 bg-[#F4F1EA] py-1 px-3 rounded-full border border-[#E5E0D5]">
                <button
                  onClick={() => { setActiveTab('MANAGEMENT'); }}
                  className="text-[#1B365D] hover:underline font-bold text-xs"
                >
                  Portal: {currentRole}
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1 text-rose-600 hover:bg-rose-50 rounded-full"
                  title="Keluar Akun"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </nav>

        </div>
      </header>

      {/* ACTIVE USER SESSION BANNER DISPLAY */}
      {currentUser && (
        <section className="bg-emerald-50 border-b border-[#E5E0D5] py-2.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
            <div className="flex items-center space-x-2 text-emerald-950 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>
                Anda sedang login sebagai Terhormat: <strong>{currentUser.nama}</strong> ({currentRole})
              </span>
              {currentUser.noAnggota && (
                <span className="font-mono bg-emerald-100 text-[#1B365D] px-2 py-0.5 rounded font-bold">
                  NIM: {currentUser.noAnggota}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => { setActiveTab('MANAGEMENT'); }}
                className="text-[#1B365D] font-bold hover:underline"
              >
                Akses Ruang Kerja Anda &rarr;
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={handleLogout}
                className="text-rose-600 font-bold hover:underline"
              >
                Keluar Akun (Logout)
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CORE MAIN SECTION */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full">
        
        {/* VIEW 1: REGISTRATION OVERLAY */}
        {isRegisterOpen ? (
          <div className="space-y-6">
            <div className="flex justify-start">
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#1B365D] hover:underline"
              >
                &larr; Batalkan dan Kembali ke Beranda
              </button>
            </div>
            
            <RegistrationForm onSuccess={() => { setIsRegisterOpen(false); setActiveTab('HOME'); }} />
          </div>
        ) : (
          
          /* TAB SYSTEM CONTROLLERS */
          <>
            {activeTab === 'HOME' && (
              <div className="space-y-12">
                {/* HERO BANNER SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[480px]">
                  
                  {/* Left Hero Texts */}
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] bg-[#F4F1EA] py-1 px-3 rounded-full">
                      {homeContent.heroSub}
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#1B365D] font-medium leading-[1.1] tracking-tight">
                      Masa Pensiun Adalah <br />
                      <span className="italic text-[#C5A059] decoration-amber-100">Babak Baru</span> Pengabdian.
                    </h1>
                    <p className="text-lg sm:text-xl text-[#5D574F] leading-relaxed max-w-2xl">
                      {homeContent.heroText}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 pt-4">
                      <button
                        onClick={() => setActiveTab('ABOUT')}
                        className="px-6 py-4 bg-[#1B365D] hover:bg-[#122543] text-white text-base font-bold rounded-xl shadow-lg transition-transform hover:scale-101 cursor-pointer"
                      >
                        Kenali Visi Kami &rarr;
                      </button>
                      <button
                        onClick={() => setIsRegisterOpen(true)}
                        className="px-6 py-4 border-2 border-[#1B365D] hover:bg-[#F4F1EA] text-[#1B365D] text-base font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Gabung Anggota IPPI
                      </button>
                    </div>
                  </div>

                  {/* Right Hero Card: Vision Summary */}
                  <div className="lg:col-span-5 bg-[#F4F1EA] border border-[#E5E0D5] rounded-3xl p-6 sm:p-8 space-y-6 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#1B365D]/5 rounded-bl-full pointer-events-none" />
                    
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#8B7E66] font-bold block mb-1">Visi Organisasi</span>
                      <p className="text-base font-serif italic text-gray-800 leading-relaxed">
                        "{homeContent.visiMisi}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E5E0D5]">
                      <div>
                        <span className="block text-4xl font-serif font-black text-[#1B365D]">
                          {`222${registeredCount}`} Orang
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-[#8B7E66] font-extrabold block mt-1">Pensiunan Terdaftar (Real-Time)</span>
                      </div>
                    </div>

                    {/* Benefit Box */}
                    <div className="bg-[#FDFCF8] border-l-4 border-[#C5A059] p-4 rounded-xl shadow-sm space-y-2">
                      <h4 className="text-xs font-bold text-[#1B365D] uppercase tracking-wide">Mengapa Gabung Kami?</h4>
                      <p className="text-[11px] text-[#5D574F] leading-snug">
                        Terus pupuk sisa energi Anda demi melobi pembangunan bangsa, melatih pemuda, dan membagikan pencerahan kearifan.
                      </p>
                    </div>

                    {/* DPW IPPI Jawa Timur Bank Account Box */}
                    {(orgConfig.noRekeningIppiBaris1 || orgConfig.noRekeningIppiBaris2) && (
                      <div className="bg-[#1B365D]/5 border-l-4 border-[#1B365D] p-4 rounded-xl space-y-1 text-left">
                        <span className="text-[10px] uppercase tracking-widest text-[#1B365D] font-extrabold block">💳 REKENING DPW IPPI JATIM</span>
                        <div className="text-[11px] text-gray-800 leading-normal font-mono font-bold mt-0.5">
                          {orgConfig.noRekeningIppiBaris1 && <p>{orgConfig.noRekeningIppiBaris1}</p>}
                          {orgConfig.noRekeningIppiBaris2 && <p>{orgConfig.noRekeningIppiBaris2}</p>}
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* VISUAL MID-BANNER: Mengapa Bergabung */}
                <div className="bg-[#1B365D] text-white rounded-3xl p-8 lg:p-12 text-left relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-1/4 w-32 h-32 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-3">
                      <span className="text-[#C5A059] text-xs font-bold uppercase tracking-widest">NILAI UTAMA KAMI</span>
                      <h3 className="text-2xl sm:text-3xl font-serif font-medium leading-tight">Dedikasi Tanpa Batas, Pengalaman Berharga</h3>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                        Kami percaya bahwa pensiunan bukanlah akhir kisah, melainkan permulaan babak sumbangsih tanpa tekanan karier.
                      </p>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {homeContent.mengapaBergabung.map((bullet, idx) => (
                        <div key={idx} className="flex items-start space-x-3 bg-white/5 border border-white/10 p-4 rounded-xl">
                          <span className="w-5 h-5 rounded-full bg-[#C5A059] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                          <span className="text-xs text-slate-100 font-medium leading-relaxed">{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* GALERI KEGIATAN BERANDA */}
                <div className="space-y-6 pt-4">
                  <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-3 text-left">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#8B7E66] font-extrabold block">Dokumentasi Aktual</span>
                      <h3 className="text-3xl font-serif text-[#1B365D] font-bold mt-1">Galeri Kegiatan Cabang IPPI</h3>
                    </div>

                    {/* Slide Buttons */}
                    {(homeContent.kegiatan || []).length > 2 && (
                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-[10px] text-[#8B7E66] font-bold font-mono">
                          {homeKegiatanSlideIndex + 1} - {Math.min(homeKegiatanSlideIndex + 2, (homeContent.kegiatan || []).length)} dari {(homeContent.kegiatan || []).length}
                        </span>
                        <button
                          type="button"
                          onClick={() => setHomeKegiatanSlideIndex(prev => Math.max(0, prev - 1))}
                          disabled={homeKegiatanSlideIndex === 0}
                          className="p-1 rounded-full border border-[#E5E0D5] bg-white text-[#1B365D] hover:bg-gray-100 disabled:opacity-30 cursor-pointer shadow-xs"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setHomeKegiatanSlideIndex(prev => Math.min((homeContent.kegiatan || []).length - 2, prev + 1))}
                          disabled={homeKegiatanSlideIndex >= (homeContent.kegiatan || []).length - 2}
                          className="p-1 rounded-full border border-[#E5E0D5] bg-white text-[#1B365D] hover:bg-gray-100 disabled:opacity-30 cursor-pointer shadow-xs"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {homeContent.kegiatan && homeContent.kegiatan.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {(homeContent.kegiatan || []).slice(homeKegiatanSlideIndex, homeKegiatanSlideIndex + 2).map((keg) => (
                        <div key={keg.id} className="bg-white border border-[#E5E0D5] rounded-3xl p-5 text-left space-y-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                          <div className="aspect-video w-full bg-[#1B365D]/5 rounded-2xl overflow-hidden relative border border-[#E5E0D5]">
                            {keg.isVideo ? (
                              <iframe
                                src={getEmbedUrl(keg.videoUrl || keg.imageUrl)}
                                title={keg.judul}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            ) : keg.imageUrl ? (
                              <img src={keg.imageUrl} alt={keg.judul} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 font-serif text-sm">Tidak ada foto kegiatan</div>
                            )}
                            {keg.tanggal && (
                              <span className="absolute bottom-3 left-3 bg-[#1B365D] text-white text-[10px] font-bold font-mono px-3 py-1 rounded-lg shadow-md">
                                {new Date(keg.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-serif font-black text-lg text-[#1B365D] leading-tight tracking-tight">{keg.judul}</h4>
                            {keg.deskripsi && (
                              <p className="text-xs text-[#5D574F] mt-2 leading-relaxed">{keg.deskripsi}</p>
                            )}

                            {/* FILES DOWNLOAD & SOCIAL BUTTONS LINK */}
                            <div className="border-t border-gray-100 pt-3 flex flex-col gap-2 w-full mt-3 text-xs">
                              {keg.fileName && keg.fileData ? (
                                <div className="flex items-center justify-between text-[11px] text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                  <span className="flex items-center gap-1 font-mono truncate max-w-[130px]" title={keg.fileName}>
                                    <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                    {keg.fileName}
                                  </span>
                                  <div className="flex items-center gap-2 shrink-0 font-bold">
                                    {(keg.fileType?.includes('pdf') || keg.fileName.toLowerCase().endsWith('.pdf')) && (
                                      <button
                                        type="button"
                                        onClick={() => setActivePreviewDoc({ name: keg.fileName || '', type: keg.fileType || '', data: keg.fileData || '' })}
                                        className="text-[10px] text-[#1B365D] hover:underline cursor-pointer"
                                      >
                                        Pratinjau
                                      </button>
                                    )}
                                    <a
                                      href={keg.fileData}
                                      download={keg.fileName}
                                      className="text-[10px] text-emerald-700 hover:underline cursor-pointer"
                                    >
                                      Unduh
                                    </a>
                                  </div>
                                </div>
                              ) : null}

                              {(keg.linkFacebook || keg.linkInstagram || keg.linkYoutube) ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-gray-400">Media Kabar:</span>
                                  <div className="flex items-center gap-1.5">
                                    {keg.linkFacebook && (
                                      <a href={keg.linkFacebook} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded text-blue-600" title="Facebook Kegiatan">
                                        <Facebook className="w-3.5 h-3.5" />
                                      </a>
                                    )}
                                    {keg.linkInstagram && (
                                      <a href={keg.linkInstagram} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded text-pink-600" title="Instagram Kegiatan">
                                        <Instagram className="w-3.5 h-3.5" />
                                      </a>
                                    )}
                                    {keg.linkYoutube && (
                                      <a href={keg.linkYoutube} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded text-red-600" title="Video Kegiatan (YouTube)">
                                        <Youtube className="w-3.5 h-3.5" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-[#E5E0D5] bg-[#F4F1EA]/20 rounded-3xl p-12 text-center text-gray-500">
                      <p className="text-sm font-serif">Belum ada foto kegiatan diunggah.</p>
                      <p className="text-[10px] text-[#8B7E66] mt-1">Gunakan akses admin/sekretaris untuk mempublikasikan foto kegiatan terbaru.</p>
                    </div>
                  )}

                  {/* STRUKTUR ORGANISASI CABANG */}
                  <div className="space-y-6 pt-4 text-left">
                    <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-3">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#8B7E66] font-extrabold block">Pimpinan & Pengurus</span>
                        <h3 className="text-3xl font-serif text-[#1B365D] font-bold mt-1">Struktur Organisasi Cabang</h3>
                      </div>

                      {/* Slide Buttons */}
                      {(homeContent.strukturList || []).length > 4 && (
                        <div className="flex items-center space-x-2 shrink-0">
                          <span className="text-[10px] text-[#8B7E66] font-bold font-mono">
                            {strukturSlideIndex + 1} - {Math.min(strukturSlideIndex + 4, (homeContent.strukturList || []).length)} dari {(homeContent.strukturList || []).length}
                          </span>
                          <button
                            type="button"
                            onClick={() => setStrukturSlideIndex(prev => Math.max(0, prev - 1))}
                            disabled={strukturSlideIndex === 0}
                            className="p-1 rounded-full border border-[#E5E0D5] bg-white text-[#1B365D] hover:bg-gray-100 disabled:opacity-30 cursor-pointer shadow-xs"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setStrukturSlideIndex(prev => Math.min((homeContent.strukturList || []).length - 4, prev + 1))}
                            disabled={strukturSlideIndex >= (homeContent.strukturList || []).length - 4}
                            className="p-1 rounded-full border border-[#E5E0D5] bg-white text-[#1B365D] hover:bg-gray-100 disabled:opacity-30 cursor-pointer shadow-xs"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {homeContent.strukturList && homeContent.strukturList.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {(homeContent.strukturList || []).slice(strukturSlideIndex, strukturSlideIndex + 4).map((item) => (
                          <div key={item.id} className="bg-white border border-[#E5E0D5] rounded-3xl p-4 text-center space-y-3 shadow-xs hover:shadow-md transition-all group flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#C5A059] p-0.5 relative shrink-0">
                              {item.photoUrl ? (
                                <img src={item.photoUrl} alt={item.nama} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-full h-full bg-[#1B365D]/5 text-gray-400 rounded-full flex items-center justify-center font-serif text-xs">Foto</div>
                              )}
                            </div>
                            <div className="space-y-1 flex-1 flex flex-col justify-center">
                              <h4 className="font-serif font-bold text-xs sm:text-xs md:text-[13px] text-[#1B365D] leading-snug">{item.nama}</h4>
                              <p className="text-[10px] text-[#C5A059] uppercase font-bold tracking-wider leading-none mt-1">{item.jabatan}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-[#E5E0D5] bg-[#F4F1EA]/20 rounded-3xl p-8 text-center text-gray-500">
                        <p className="text-xs font-serif">Belum ada data struktur organisasi.</p>
                      </div>
                    )}

                    {/* Aesthetic divider line */}
                    <div className="border-t border-[#E5E0D5]/50 pt-4" />
                  </div>
                </div>

                {/* QUICK LATEST PROGRAM SHOWCASE */}

                <div className="space-y-4">
                  <div className="flex items-end justify-between border-b border-[#E5E0D5] pb-3 text-left">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#8B7E66] font-extrabold block">Fokus Kontribusi</span>
                      <h3 className="text-2xl font-serif text-[#1B365D] font-bold mt-1">Draf Pilar Program Kerja Utama</h3>
                    </div>
                    <button onClick={() => setActiveTab('PROGRAM')} className="text-xs font-bold text-[#C5A059] hover:underline">Lihat Semua Program &rarr;</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(homeContent.fokusList || []).sort((a,b) => (a.urutan || 0) - (b.urutan || 0)).map((item, index) => (
                      <div key={item.id} className="bg-white border border-[#E5E0D5] p-5 rounded-2xl text-left space-y-3 relative overflow-hidden group hover:shadow-md transition-all flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="w-10 h-10 bg-[#1B365D]/5 text-[#1B365D] rounded-xl flex items-center justify-center font-bold">
                            {item.urutan || (index + 1)}
                          </div>
                          <h4 className="font-serif font-bold text-[#1B365D]">{item.judul}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {item.deskripsi}
                          </p>
                        </div>

                        {/* LAMPIRAN TEKS & TAUTAN MEDIA SOSIAL */}
                        <div className="border-t border-gray-100 pt-3 flex flex-col gap-2 mt-2">
                          {item.fileName && item.fileData ? (
                            <div className="flex items-center justify-between text-[11px] text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                              <span className="flex items-center gap-1 font-mono truncate max-w-[130px]" title={item.fileName}>
                                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                {item.fileName}
                              </span>
                              <div className="flex items-center gap-2 shrink-0 font-bold">
                                {(item.fileType?.includes('pdf') || item.fileName.toLowerCase().endsWith('.pdf')) && (
                                  <button
                                    type="button"
                                    onClick={() => setActivePreviewDoc({ name: item.fileName || '', type: item.fileType || '', data: item.fileData || '' })}
                                    className="text-[10px] text-[#1B365D] hover:underline cursor-pointer"
                                  >
                                    Pratinjau
                                  </button>
                                )}
                                <a
                                  href={item.fileData}
                                  download={item.fileName}
                                  className="text-[10px] text-emerald-700 hover:underline cursor-pointer"
                                >
                                  Unduh
                                </a>
                              </div>
                            </div>
                          ) : null}

                          {(item.linkFacebook || item.linkInstagram || item.linkYoutube) ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-400">Media Resmi:</span>
                              <div className="flex items-center gap-1.5">
                                {item.linkFacebook && (
                                  <a href={item.linkFacebook} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded text-blue-600" title="Facebook Resmi">
                                    <Facebook className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {item.linkInstagram && (
                                  <a href={item.linkInstagram} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded text-pink-600" title="Instagram Resmi">
                                    <Instagram className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {item.linkYoutube && (
                                  <a href={item.linkYoutube} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded text-red-600" title="Saluran YouTube">
                                    <Youtube className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                    {(homeContent.fokusList || []).length === 0 && (
                      <div className="text-center py-8 text-gray-400 italic text-xs col-span-3 border border-[#E5E0D5] rounded-2xl bg-white">
                        Belum ada fokus kontribusi ditambahkan. Masuk sebagai Admin / Sekretaris untuk menambahkan.
                      </div>
                    )}
                  </div>
                </div>

                {/* LAPAK UMKM UNGGULAN (HOMEPAGE GRID) */}
                {(() => {
                  const featuredUmkm = (homeContent.umkmList || []).filter(item => item.isBeranda);
                  if (featuredUmkm.length === 0) return null;

                  return (
                    <div className="space-y-6 pt-6 border-t border-[#E5E0D5]">
                      <div className="flex items-end justify-between text-left">
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-[#8B7E66] font-extrabold block">Pemberdayaan Ekonomi Senior</span>
                          <h3 className="text-2xl font-serif text-[#1B365D] font-bold mt-1">Produk UMKM Unggulan</h3>
                        </div>
                        <button 
                          onClick={() => setActiveTab('UMKM')} 
                          className="text-xs font-bold text-[#C5A059] hover:underline cursor-pointer"
                        >
                          Kunjungi Lapak UMKM Lengkap &rarr;
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {featuredUmkm.map((p) => {
                          const sanitizeWhatsApp = (numStr: string) => {
                            let clean = numStr.replace(/\D/g, '');
                            if (clean.startsWith('0')) {
                              clean = '62' + clean.slice(1);
                            } else if (clean.startsWith('8')) {
                              clean = '62' + clean;
                            }
                            return clean;
                          };

                          const formatRupiah = (val: number | string) => {
                            if (typeof val === 'number') {
                              return 'Rp ' + val.toLocaleString('id-ID');
                            }
                            if (val.trim().toLowerCase().startsWith('rp')) {
                              return val;
                            }
                            const cleanNum = Number(val.replace(/[^\d]/g, ''));
                            if (!isNaN(cleanNum) && cleanNum > 0) {
                              return 'Rp ' + cleanNum.toLocaleString('id-ID');
                            }
                            return val;
                          };

                          const hasVideo = !!p.videoUrl;

                          return (
                            <div 
                              key={p.id}
                              className="group bg-white rounded-2xl border border-[#E5E0D5] overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 text-left relative"
                            >
                              {/* Product Image Stage */}
                              <div className="relative aspect-video w-full bg-slate-150 overflow-hidden">
                                <img
                                  src={p.imageUrl || 'https://images.unsplash.com/photo-1546213290-e1b7610339e5?q=80&w=600&auto=format&fit=crop'}
                                  alt={p.namaProduk}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                
                                {/* Category Badge & Beranda Badge status */}
                                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10 font-sans">
                                  <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white bg-[#1B365D]/95 backdrop-blur-xs rounded-lg shadow-sm">
                                    {p.kategori || 'Produk'}
                                  </span>
                                  <span className="px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-white bg-amber-500 rounded-md shadow-xs flex items-center gap-0.5">
                                    ★ Terpilih di Beranda
                                  </span>
                                </div>

                                {/* Video Play Badge (If Youtube exists) */}
                                {hasVideo && (
                                  <a
                                    href={p.videoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="absolute bottom-3 right-3 p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-all cursor-pointer active:scale-90 flex items-center justify-center group/vid"
                                    title="Tonton Video Promosi"
                                  >
                                    <Video className="w-3.5 h-3.5 mr-1" />
                                    <span className="text-[9px] font-bold pr-1">Video</span>
                                  </a>
                                )}
                              </div>

                              {/* Content Panel */}
                              <div className="p-4.5 flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                  <h4 className="font-serif font-bold text-sm text-[#1B365D] line-clamp-1 group-hover:text-[#C5A059] transition-colors leading-snug">
                                    {p.namaProduk}
                                  </h4>
                                  <p className="text-[10px] text-[#8B7E66] font-medium leading-relaxed">
                                    Oleh: <span className="font-bold">{p.namaPenjual}</span>
                                  </p>
                                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                                    {p.deskripsi}
                                  </p>
                                </div>

                                <div className="space-y-3.5 pt-2 border-t border-gray-100">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Harga Estimasi</span>
                                    <span className="text-sm font-bold text-[#C5A059] font-mono">
                                      {formatRupiah(p.harga)}
                                    </span>
                                  </div>

                                  {/* Order Action Buttons Row */}
                                  <div className="grid grid-cols-2 gap-2">
                                    {/* WhatsApp Button */}
                                    <a
                                      href={`https://wa.me/${sanitizeWhatsApp(p.whatsappPenjual || '')}?text=${encodeURIComponent(`Halo Bapak/Ibu ${p.namaPenjual}, saya melihat produk "${p.namaProduk}" Anda di Beranda Website IPPI. Saya tertarik untuk memesan/bertanya.`)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 hover:shadow-xs active:scale-95 text-white text-[10px] font-bold rounded-xl transition-all text-center"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                                      <span>Tanya WA</span>
                                    </a>

                                    {/* Buy Tautan / Shopee Affiliate */}
                                    {p.linkBeli ? (
                                      <a
                                        href={p.linkBeli}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center space-x-1 px-3 py-2 border border-orange-200 hover:border-orange-300 text-orange-600 bg-orange-50/50 hover:bg-orange-50 active:scale-95 text-[10px] font-bold rounded-xl transition-all text-center font-sans"
                                      >
                                        <span>Beli Olshop</span>
                                        <ExternalLink className="w-3 h-3 shrink-0" />
                                      </a>
                                    ) : (
                                      <button
                                        disabled
                                        className="flex items-center justify-center space-x-1 px-3 py-2 border border-gray-100 text-gray-400 bg-slate-50 text-[10px] font-bold rounded-xl cursor-not-allowed opacity-70"
                                        title="Melalui jalur WhatsApp"
                                      >
                                        <span>Offline/WA saja</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

              </div>
            )}

            {/* VIEW 2: ABOUT US (TENTANG KAMI) */}
            {activeTab === 'ABOUT' && (
              <div className="space-y-8 text-left max-w-4xl mx-auto animate-fade-in">
                <div className="border-b border-[#E5E0D5] pb-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">SEJARAH & TUGAS</span>
                  <h2 className="text-3xl font-serif text-[#1B365D] font-bold mt-1">Struktur &amp; Makna IPPI</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-[#5D574F] leading-relaxed">
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-[#1B365D] text-lg">Maksud Organisasi</h3>
                    <p>
                      Ikatan Profesional & Pensiunan Indonesia (IPPI) didirikan atas kegelisahan mulia dari tokoh-tokoh purna tugas kementerian dan eksekutif korporat nasional. Kami berikrar menggalang seluruh keahlian intelektual yang tertidur agar tetap bermanfaat secara sosial dan komersial bagi masyarakat umum.
                    </p>
                    <p>
                      Sesuai akreditasi Kementerian Hukum dan HAM nomor <code className="bg-[#F4F1EA] px-1 rounded font-serif font-bold text-gray-700">{orgConfig.noIjinPendirian}</code>, IPPI memegang kedudukan sentral untuk mewakili suara senior di ranah legislatif dan publik.
                    </p>
                  </div>

                  <div className="space-y-4 bg-[#F4F1EA] p-6 rounded-2xl border border-[#E5E0D5]">
                    <h3 className="font-serif font-bold text-[#1B365D] text-lg">Prinsip Aksesibilitas Lansia</h3>
                    <p>
                      Website IPPI dirancang dengan mengutamakan aksesibilitas tinggi bagi lansia (senior accessibility limits). Desain visual menggunakan rasio kontras 4.5:1, pewarnaan Editorial Estate yang tidak membuat mata lelah, serta kemudahan kendali ukuran font instan di bagian atas web.
                    </p>
                    <p className="font-bold text-[#1B365D]">
                      "Muda Berprestasi, Dewasa Bernilai, Pensiun Menginspirasi."
                    </p>
                  </div>
                </div>

                {/* THE 4 CORNERSTONES DYNAMIC SLIDER */}
                <div className="pt-6 border-t border-[#E5E0D5]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif font-bold text-[#1B365D] text-xl">Tujuan Mutlak Organisasi</h3>
                    
                    {/* Slide Buttons */}
                    {(homeContent.aboutItems || []).length > 4 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-[#8B7E66] font-bold font-mono">
                          {aboutSlideIndex + 1} - {Math.min(aboutSlideIndex + 4, (homeContent.aboutItems || []).length)} dari {(homeContent.aboutItems || []).length}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAboutSlideIndex(prev => Math.max(0, prev - 1))}
                          disabled={aboutSlideIndex === 0}
                          className="p-1 rounded-full border border-[#E5E0D5] bg-white text-[#1B365D] hover:bg-gray-100 disabled:opacity-30 cursor-pointer shadow-xs"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setAboutSlideIndex(prev => Math.min((homeContent.aboutItems || []).length - 4, prev + 1))}
                          disabled={aboutSlideIndex >= (homeContent.aboutItems || []).length - 4}
                          className="p-1 rounded-full border border-[#E5E0D5] bg-white text-[#1B365D] hover:bg-gray-100 disabled:opacity-30 cursor-pointer shadow-xs"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {(homeContent.aboutItems || []).slice(aboutSlideIndex, aboutSlideIndex + 4).map((item) => (
                      <div key={item.id} className="p-4 bg-white border border-[#E5E0D5] rounded-xl hover:shadow-xs transition-all flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif font-bold text-[#1B365D] mb-1.5 text-sm">{item.judul}</h4>
                          <p className="text-xs text-gray-600 leading-relaxed">{item.deskripsi}</p>
                        </div>
                        <span className="text-[9px] text-[#C5A059] font-mono mt-3 font-semibold">Urutan Ke: {item.urutan}</span>
                      </div>
                    ))}
                    {(homeContent.aboutItems || []).length === 0 && (
                      <p className="text-xs text-gray-400 italic">Belum ada konten Tujuan Organisasi terdaftar.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: PROGRAM KERJA */}
            {activeTab === 'PROGRAM' && (
              <div className="space-y-8 text-left max-w-4xl mx-auto animate-fade-in">
                <div className="border-b border-[#E5E0D5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">RENCANA STRATEGIS</span>
                    <h2 className="text-3xl font-serif text-[#1B365D] font-bold mt-1">Program Kerja Unggulan IPPI</h2>
                  </div>

                  {/* Slide Buttons */}
                  {(homeContent.programList || []).length > 3 && (
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[10px] text-[#8B7E66] font-bold font-mono">
                        {programSlideIndex + 1} - {Math.min(programSlideIndex + 3, (homeContent.programList || []).length)} dari {(homeContent.programList || []).length}
                      </span>
                      <button
                        type="button"
                        onClick={() => setProgramSlideIndex(prev => Math.max(0, prev - 1))}
                        disabled={programSlideIndex === 0}
                        className="p-1 rounded-full border border-[#E5E0D5] bg-white text-[#1B365D] hover:bg-gray-100 disabled:opacity-30 cursor-pointer shadow-xs"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setProgramSlideIndex(prev => Math.min((homeContent.programList || []).length - 3, prev + 1))}
                        disabled={programSlideIndex >= (homeContent.programList || []).length - 3}
                        className="p-1 rounded-full border border-[#E5E0D5] bg-white text-[#1B365D] hover:bg-gray-100 disabled:opacity-30 cursor-pointer shadow-xs"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(homeContent.programList || []).slice(programSlideIndex, programSlideIndex + 3).map((prog) => (
                    <div
                      key={prog.id}
                      className={`p-6 rounded-2xl flex flex-col justify-between ${
                        prog.isHighlighted
                          ? 'bg-[#1B365D] text-white'
                          : 'bg-white border border-[#E5E0D5] text-gray-800'
                      } hover:shadow-md transition-all`}
                    >
                      <div className="space-y-3">
                        <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-1 rounded inline-block ${
                          prog.isHighlighted ? 'bg-white/10 text-[#C5A059]' : 'bg-[#F4F1EA] text-[#C5A059]'
                        }`}>
                          {prog.kategori}
                        </span>
                        <h3 className={`text-base font-serif font-bold ${prog.isHighlighted ? 'text-[#C5A059]' : 'text-[#1B365D]'}`}>
                          {prog.judul}
                        </h3>
                        <p className={`text-xs leading-relaxed ${prog.isHighlighted ? 'text-slate-300' : 'text-gray-500'}`}>
                          {prog.deskripsi}
                        </p>

                        {prog.fileName && prog.fileData && (
                          <div className={`mt-3 flex items-center justify-between p-2 rounded-lg text-xs ${
                            prog.isHighlighted ? 'bg-white/10 text-slate-100' : 'bg-gray-100 border border-gray-150 text-gray-700'
                          }`}>
                            <div className="flex items-center gap-1.5 min-w-0 pr-1">
                              <FileText className="w-3.5 h-3.5 shrink-0 text-[#C5A059]" />
                              <span className="font-semibold truncate text-[10px]" title={prog.fileName}>{prog.fileName}</span>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              {(prog.fileType?.includes('pdf') || prog.fileData.startsWith('data:application/pdf')) && (
                                <button
                                  type="button"
                                  onClick={() => setActivePreviewDoc({ name: prog.fileName!, type: prog.fileType!, data: prog.fileData! })}
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 hover:opacity-85 cursor-pointer ${
                                    prog.isHighlighted ? 'text-[#C5A059] bg-white/10' : 'text-blue-700 bg-blue-50 border border-blue-150'
                                  }`}
                                >
                                  <Eye className="w-2.5 h-2.5" /> Lihat
                                </button>
                              )}
                              <a
                                href={prog.fileData}
                                download={prog.fileName}
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 hover:opacity-85 cursor-pointer ${
                                  prog.isHighlighted ? 'text-white bg-[#C5A059]' : 'text-emerald-700 bg-emerald-50 border border-emerald-150'
                                }`}
                              >
                                <Download className="w-2.5 h-2.5" /> Unduh
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Media & Social Links */}
                        {(prog.linkFacebook || prog.linkInstagram || prog.linkYoutube) && (
                          <div className="mt-3 flex flex-wrap gap-1.5 pt-1 select-none">
                            {prog.linkFacebook && (
                              <a
                                href={prog.linkFacebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 hover:opacity-85 cursor-pointer transition-opacity ${
                                  prog.isHighlighted ? 'bg-blue-600/20 text-blue-200 border border-blue-500/25' : 'bg-blue-50 text-blue-800 border border-blue-150'
                                }`}
                              >
                                <Facebook className="w-2.5 h-2.5 text-blue-500 shrink-0" /> FB
                              </a>
                            )}
                            {prog.linkInstagram && (
                              <a
                                href={prog.linkInstagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 hover:opacity-85 cursor-pointer transition-opacity ${
                                  prog.isHighlighted ? 'bg-pink-600/20 text-pink-200 border border-pink-500/25' : 'bg-pink-50 text-pink-800 border border-pink-150'
                                }`}
                              >
                                <Instagram className="w-2.5 h-2.5 text-pink-500 shrink-0" /> IG
                              </a>
                            )}
                            {prog.linkYoutube && (
                              <a
                                href={prog.linkYoutube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 hover:opacity-85 cursor-pointer transition-opacity ${
                                  prog.isHighlighted ? 'bg-red-600/20 text-red-200 border border-red-500/25' : 'bg-red-50 text-red-800 border border-red-150'
                                }`}
                              >
                                <Youtube className="w-2.5 h-2.5 text-red-500 shrink-0" /> YouTube
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      <span className={`text-[9px] font-mono mt-4 font-semibold inline-block ${prog.isHighlighted ? 'text-slate-400' : 'text-gray-400'}`}>
                        Urutan No: {prog.urutan}
                      </span>
                    </div>
                  ))}
                  {(homeContent.programList || []).length === 0 && (
                    <div className="text-center py-6 text-gray-400 italic text-xs col-span-3">Belum ada program kerja terdaftar.</div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 4: GALLERY (GALERI KEGIATAN) */}
            {activeTab === 'GALLERY' && (
              <div className="space-y-8 text-left max-w-4xl mx-auto animate-fade-in">
                <div className="border-b border-[#E5E0D5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">JEJAK VISUAL</span>
                    <h2 className="text-3xl font-serif text-[#1B365D] font-bold mt-1">Dokumentasi Galeri Kegiatan IPPI</h2>
                    <p className="text-xs text-[#8B7E66] mt-1">Melihat dari dekat keriangan, kesibukan diskusi, dan persaudaraan sesama anggota.</p>
                  </div>

                  {/* Slide Buttons */}
                  {(homeContent.kegiatan || []).length > 2 && (
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[10px] text-[#8B7E66] font-bold font-mono">
                        {gallerySlideIndex + 1} - {Math.min(gallerySlideIndex + 2, (homeContent.kegiatan || []).length)} dari {(homeContent.kegiatan || []).length}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGallerySlideIndex(prev => Math.max(0, prev - 1))}
                        disabled={gallerySlideIndex === 0}
                        className="p-1 rounded-full border border-[#E5E0D5] bg-white text-[#1B365D] hover:bg-gray-100 disabled:opacity-30 cursor-pointer shadow-xs"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setGallerySlideIndex(prev => Math.min((homeContent.kegiatan || []).length - 2, prev + 1))}
                        disabled={gallerySlideIndex >= (homeContent.kegiatan || []).length - 2}
                        className="p-1 rounded-full border border-[#E5E0D5] bg-white text-[#1B365D] hover:bg-gray-100 disabled:opacity-30 cursor-pointer shadow-xs"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(homeContent.kegiatan || []).slice(gallerySlideIndex, gallerySlideIndex + 2).map((item) => (
                    <div key={item.id} className="bg-white border border-[#E5E0D5] rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
                      {/* Stylized photo/video placeholder or real uploaded image */}
                      <div className="h-56 bg-gradient-to-br from-[#1B365D] to-[#3B669D] relative overflow-hidden flex items-center justify-center">
                        {item.isVideo ? (
                          <iframe
                            src={getEmbedUrl(item.videoUrl || item.imageUrl)}
                            title={item.judul}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.judul} className="w-full h-full object-cover animate-fade-in" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="p-6 flex flex-col justify-between text-white h-full w-full">
                            <span className="text-[9px] font-bold text-[#C5A059] uppercase tracking-widest border border-[#C5A059]/40 px-2 py-0.5 rounded-full self-start">
                              Kegiatan IPPI
                            </span>
                            <div className="font-serif font-light text-2xl tracking-tight text-white/50">{orgConfig.logoText} LIVE</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-amber-900 font-mono font-semibold block">{item.tanggal || 'Kabar Terbaru'}</span>
                          <h4 className="font-serif font-bold text-[#1B365D] text-base leading-tight mt-1">{item.judul}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed mt-1">{item.deskripsi}</p>
                        </div>

                        {/* GALLERY ITEM ATTACHMENTS & SOCIAL MEDIA CHANNELS */}
                        <div className="border-t border-gray-100 pt-3 flex flex-col gap-2 w-full mt-2">
                          {item.fileName && item.fileData ? (
                            <div className="flex items-center justify-between text-[11px] text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                              <span className="flex items-center gap-1 font-mono truncate max-w-[140px]" title={item.fileName}>
                                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                {item.fileName}
                              </span>
                              <div className="flex items-center gap-2 shrink-0 font-bold">
                                {(item.fileType?.includes('pdf') || item.fileName.toLowerCase().endsWith('.pdf')) && (
                                  <button
                                    type="button"
                                    onClick={() => setActivePreviewDoc({ name: item.fileName || '', type: item.fileType || '', data: item.fileData || '' })}
                                    className="text-[10px] text-[#1B365D] hover:underline cursor-pointer"
                                  >
                                    Pratinjau
                                  </button>
                                )}
                                <a
                                  href={item.fileData}
                                  download={item.fileName}
                                  className="text-[10px] text-emerald-700 hover:underline cursor-pointer"
                                >
                                  Unduh
                                </a>
                              </div>
                            </div>
                          ) : null}

                          {(item.linkFacebook || item.linkInstagram || item.linkYoutube) ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-400">Media Kabar:</span>
                              <div className="flex items-center gap-1.5">
                                {item.linkFacebook && (
                                  <a href={item.linkFacebook} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded text-blue-600" title="Facebook Kegiatan">
                                    <Facebook className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {item.linkInstagram && (
                                  <a href={item.linkInstagram} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded text-pink-600" title="Instagram Kegiatan">
                                    <Instagram className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {item.linkYoutube && (
                                  <a href={item.linkYoutube} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded text-red-600" title="Video Kegiatan (YouTube)">
                                    <Youtube className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(homeContent.kegiatan || []).length === 0 && (
                    <div className="text-center py-6 text-gray-400 italic text-xs col-span-2">Belum ada dokumentasi galeri kegiatan terdaftar.</div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 5: NEWS (BERITA ACARA) */}
            {activeTab === 'BLOG' && (
              <div className="space-y-8 text-left max-w-3xl mx-auto animate-fade-in">
                <div className="border-b border-[#E5E0D5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">KABAR KEPENDUDUKAN</span>
                    <h2 className="text-3xl font-serif text-[#1B365D] font-bold mt-1">Arsip Berita &amp; Agenda IPPI</h2>
                  </div>

                  {/* Slide Buttons */}
                  {(homeContent.beritaList || []).length > 3 && (
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[10px] text-[#8B7E66] font-bold font-mono">
                        {newsSlideIndex + 1} - {Math.min(newsSlideIndex + 3, (homeContent.beritaList || []).length)} dari {(homeContent.beritaList || []).length}
                      </span>
                      <button
                        type="button"
                        onClick={() => setNewsSlideIndex(prev => Math.max(0, prev - 1))}
                        disabled={newsSlideIndex === 0}
                        className="p-1 rounded-full border border-[#E5E0D5] bg-white text-[#1B365D] hover:bg-gray-100 disabled:opacity-30 cursor-pointer shadow-xs"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewsSlideIndex(prev => Math.min((homeContent.beritaList || []).length - 3, prev + 1))}
                        disabled={newsSlideIndex >= (homeContent.beritaList || []).length - 3}
                        className="p-1 rounded-full border border-[#E5E0D5] bg-white text-[#1B365D] hover:bg-gray-100 disabled:opacity-30 cursor-pointer shadow-xs"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {(homeContent.beritaList || []).slice(newsSlideIndex, newsSlideIndex + 3).map((news) => (
                    <article key={news.id} className="bg-white border border-[#E5E0D5] rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all space-y-3">
                      <div className="flex items-center space-x-3 text-[10px] text-[#8B7E66] font-mono">
                        <span className="bg-[#1B365D]/5 text-[#1B365D] font-bold px-2 py-0.5 rounded">{news.tanggal}</span>
                        <span>•</span>
                        <span>Dipublish oleh: {news.penulis || 'Humas IPPI'}</span>
                      </div>
                      <h3 className="text-lg font-serif font-bold text-[#1B365D] hover:text-[#C5A059] transition-colors leading-tight">
                        {news.judul}
                      </h3>
                      <p className="text-xs text-gray-650 leading-relaxed font-sans">
                        {news.kutipan}
                      </p>
                    </article>
                  ))}
                  {(homeContent.beritaList || []).length === 0 && (
                    <div className="text-center py-6 text-gray-400 italic text-xs">Belum ada berita resmi terbit saat ini.</div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 6: JURNAL */}
            {activeTab === 'JOURNAL' && (
              <div className="space-y-8 text-left max-w-4xl mx-auto animate-fade-in">
                <div className="border-b border-[#E5E0D5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">KHAZANAH INTELEKTUAL LANSIA</span>
                    <h2 className="text-3xl font-serif text-[#1B365D] font-bold mt-1">Jurnal Pensiunan Berkala (JPPI)</h2>
                    <p className="text-xs text-gray-500 mt-1">Publikasi ilmiah berkala memuat analisis, gagasan integrasi kurir, perbankan, dan audit publik.</p>
                  </div>

                  {/* Slide Buttons */}
                  {(homeContent.jurnalList || []).length > 2 && (
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[10px] text-[#8B7E66] font-bold font-mono">
                        {journalSlideIndex + 1} - {Math.min(journalSlideIndex + 2, (homeContent.jurnalList || []).length)} dari {(homeContent.jurnalList || []).length}
                      </span>
                      <button
                        type="button"
                        onClick={() => setJournalSlideIndex(prev => Math.max(0, prev - 1))}
                        disabled={journalSlideIndex === 0}
                        className="p-1 rounded-full border border-[#E5E0D5] bg-white text-[#1B365D] hover:bg-gray-100 disabled:opacity-30 cursor-pointer shadow-xs"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setJournalSlideIndex(prev => Math.min((homeContent.jurnalList || []).length - 2, prev + 1))}
                        disabled={journalSlideIndex >= (homeContent.jurnalList || []).length - 2}
                        className="p-1 rounded-full border border-[#E5E0D5] bg-white text-[#1B365D] hover:bg-gray-100 disabled:opacity-30 cursor-pointer shadow-xs"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {(homeContent.jurnalList || []).slice(journalSlideIndex, journalSlideIndex + 2).map((journal) => (
                    <div key={journal.id} className="bg-white border-l-4 border-[#1B365D] border-y border-r border-[#E5E0D5] p-6 rounded-r-2xl space-y-2 shadow-xs hover:shadow-sm transition-all">
                      <span className="text-[10px] text-amber-900 font-mono font-bold block">{journal.tanggalPublikasi} (Edisi Cetak &amp; Online)</span>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#1B365D]">{journal.judul}</h3>
                      <p className="text-xs font-medium text-gray-600">Subjek Utama: <span className="text-[#1B365D] font-bold">{journal.subjek}</span></p>
                      <p className="text-xs italic text-gray-500 leading-relaxed bg-[#FDFCF8] p-3 rounded border border-dashed border-[#E5E0D5]">
                        <strong>Abstrak:</strong> {journal.abstrak}
                      </p>
                      
                      <div className="pt-2 flex space-x-3">
                        <button
                          type="button"
                          onClick={() => alert(`Mengunduh Berkas PDF: ${journal.judul}`)}
                          className="px-3.5 py-1.5 bg-[#1B365D] hover:bg-[#122543] text-white rounded text-xs font-semibold cursor-pointer shadow-2xs"
                        >
                          Unduh Fullteks PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => alert('Fitur kutipan sitasi RIS/Endnote disiapkan.')}
                          className="px-3.5 py-1.5 border border-[#E5E0D5] hover:bg-gray-50 rounded text-xs text-gray-600 font-semibold cursor-pointer"
                        >
                          Sitasi Jurnal
                        </button>
                      </div>
                    </div>
                  ))}
                  {(homeContent.jurnalList || []).length === 0 && (
                    <div className="text-center py-6 text-gray-400 italic text-xs">Belum ada manuskrip jurnal terdaftar saat ini.</div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW: LAPAK UMKM */}
            {activeTab === 'UMKM' && (
              <LapakUmkm
                content={homeContent}
                currentUser={currentUser}
                onSave={(updatedContent) => {
                  setHomeContent(updatedContent);
                  saveStoredContent(updatedContent);
                }}
              />
            )}

            {/* VIEW 7: MANAGEMENT WORKSPACE PORTAL (RUANG KERJA MULTI-ROLE) */}
            {activeTab === 'MANAGEMENT' && currentUser && (
              <div className="space-y-8 text-left">
                
                {/* Visual Workspace banner */}
                <div className="bg-[#1B365D] rounded-3xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between border-2 border-[#C5A059] shadow-xl gap-4">
                  <div>
                    <span className="text-xs text-[#C5A059] uppercase tracking-widest font-bold">PORTAL UTAMA IPPI</span>
                    <h2 className="text-2xl font-serif font-bold mt-1">Ruang Kerja Akses: {currentRole}</h2>
                    <p className="text-xs text-slate-300 mt-1">
                      Selamat bekerja, Bapak/Ibu <strong>{currentUser.nama}</strong>. Menu dan tombol di bawah ini dikhususkan bagi hak keandalan tugas Anda.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-white text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-lg cursor-pointer transition-colors shrink-0"
                    >
                      Keluar Portal
                    </button>
                  </div>
                </div>

                {/* ROLE-SPECIFIC SCREEN GENERATOR */}
                
                {/* 1. ANGGOTA VIEW (KARTU & EDIT PROFIL MANDIRI) */}
                {currentRole === UserRole.ANGGOTA && currentUser && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* ID Card Display */}
                    <div className="lg:col-span-1 space-y-6">
                      <MemberCard member={currentUser} config={orgConfig} />

                      {/* DPW IPPI Jawa Timur Official Bank Account details for members */}
                      {(orgConfig.noRekeningIppiBaris1 || orgConfig.noRekeningIppiBaris2) && (
                        <div className="bg-[#1B365D]/5 border border-[#1B365D]/10 rounded-2xl p-5 text-left space-y-3 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-[#C5A059]/5 rounded-bl-full pointer-events-none" />
                          <h4 className="text-xs font-bold text-[#1B365D] uppercase tracking-wider flex items-center space-x-2">
                            <span>💳 REKENING RESMI DPW IPPI JAWA TIMUR</span>
                          </h4>
                          <p className="text-[11px] text-[#5D574F] leading-relaxed">
                            Bapak/Ibu dapat mempergunakan info rujukan rekening resmi berikut ini untuk keperluan iuran anggota atau sumbangan dana sosial organisasi:
                          </p>
                          <div className="bg-white border border-[#E5E0D5] p-4 rounded-xl space-y-2 font-mono text-xs shadow-xs">
                            {orgConfig.noRekeningIppiBaris1 && (
                              <div className="flex justify-between items-start border-b border-gray-100 pb-2 last:border-0 last:pb-0 font-bold">
                                <div>
                                  <span className="block text-[9px] uppercase text-gray-400 font-sans tracking-wide">Baris 1</span>
                                  <span className="font-semibold text-gray-800">{orgConfig.noRekeningIppiBaris1}</span>
                                </div>
                              </div>
                            )}
                            {orgConfig.noRekeningIppiBaris2 && (
                              <div className="flex justify-between items-start pt-1 font-bold">
                                <div>
                                  <span className="block text-[9px] uppercase text-gray-400 font-sans tracking-wide">Baris 2</span>
                                  <span className="font-semibold text-gray-800">{orgConfig.noRekeningIppiBaris2}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Profile Editing form (Only allows editing: No Telp, Email, Alamat) */}
                    <div className="lg:col-span-1 bg-white border border-[#E5E0D5] p-6 rounded-2xl shadow-sm">
                      <h3 className="text-lg font-serif font-bold text-[#1B365D] border-b border-[#F4F1EA] pb-3 mb-4">
                        Modifikasi Identitas Diri Mandiri
                      </h3>
                      
                      {isEditProfileSuccess && (
                        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 rounded-lg mb-4">
                          Sukses: Data pribadi telepon, email, dan alamat Anda berhasil diperbarui di database IPPI!
                        </div>
                      )}

                      <p className="text-xs text-[#8B7E66] mb-4">
                        Aturan Organisasi: Data nama, tanggal lahir, gelar, dan pensiunan instansi dikunci demi integritas sertifikat nasional. Hubungi Sekretariat Utama bila terdapat kesalahan tulis.
                      </p>

                      <form onSubmit={handleUpdateMemberProfile} className="space-y-4">
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase">Nama Lengkap (Terkunci)</label>
                            <input
                              type="text"
                              value={currentUser.nama}
                              className="w-full bg-gray-100 border border-[#E5E0D5] text-gray-500 rounded px-3 py-2 text-xs"
                              disabled
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase">Institusi Asal (Terkunci)</label>
                            <input
                              type="text"
                              value={currentUser.institusiPensiun}
                              className="w-full bg-gray-100 border border-[#E5E0D5] text-gray-500 rounded px-3 py-2 text-xs"
                              disabled
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#2D2D2D] mb-1">A. Nomor HP / WhatsApp Aktif *</label>
                          <input
                            type="text"
                            value={memberPhone}
                            onChange={(e) => setMemberPhone(e.target.value)}
                            className="w-full bg-white border border-[#E5E0D5] rounded px-3 py-2 text-xs"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#2D2D2D] mb-1">B. Alamat Email Aktif *</label>
                          <input
                            type="email"
                            value={memberEmail}
                            onChange={(e) => setMemberEmail(e.target.value)}
                            className="w-full bg-white border border-[#E5E0D5] rounded px-3 py-2 text-xs"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#2D2D2D] mb-1">C. Alamat Rumah Lengkap Baru *</label>
                          <textarea
                            rows={3}
                            value={memberAddress}
                            onChange={(e) => setMemberAddress(e.target.value)}
                            className="w-full bg-white border border-[#E5E0D5] rounded px-3 py-2 text-xs"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#1B365D] hover:bg-[#122543] text-white text-xs font-bold rounded cursor-pointer"
                        >
                          Simpan Perubahan Mandiri
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="border-t border-[#E5E0D5] pt-10">
                    <MemberFinanceInfo member={currentUser} />
                  </div>
                </div>
              )}

                {/* 2. ADMIN ROLE DYNAMIC SHEETS & ACCUMULATOR ACCESS */}
                {currentRole === UserRole.ADMIN && (
                  <div className="space-y-8">
                    <AdminPanel
                      onConfigChange={(newConfig) => setOrgConfig(newConfig)}
                      onMembersChange={() => {}}
                      onContentChange={(newContent) => setHomeContent(newContent)}
                    />

                    {/* Admin Cumulative access displays */}
                    <div className="border-[#E5E0D5] border pt-6 rounded-2xl p-6 bg-[#F4F1EA]">
                      <h3 className="text-sm font-serif font-bold text-[#1B365D] uppercase tracking-wider mb-4 text-center">
                        🔒 Akses Akumulatif Kumulatif Admin (Full-Rights View)
                      </h3>

                      <div className="bg-white rounded-3xl border border-gray-200 p-4 mb-6 text-left">
                        <h4 className="font-bold text-xs uppercase tracking-wide text-amber-800 mb-3 border-b pb-1">Laporan & Input Neraca Keuangan</h4>
                        <LaporanNeraca currentRole={currentRole} txs={txs} neraca={neraca} logoUrl={orgConfig.logoUrl} logoText={orgConfig.logoText} />
                      </div>
                      
                      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                        <h4 className="font-bold text-xs uppercase tracking-wide text-amber-800 mb-2">Buku Kas Laporan Bendahara (Ledger)</h4>
                        <FinancialSheet currentRole={currentRole} />
                      </div>

                      <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <h4 className="font-bold text-xs uppercase tracking-wide text-amber-800 mb-2">Manajemen Kop Surat</h4>
                        <KopSurat config={orgConfig} userRole="ADMIN" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SECRETARY (SEKRETARIS) PANEL FOR DYNAMIC CONTENT & MEMBERS VERIFICATION */}
                {currentRole === UserRole.SEKRETARIS && (
                  <SecretaryPanel
                    config={orgConfig}
                    onContentChange={(newContent) => setHomeContent(newContent)}
                    onConfigChange={(newConfig) => setOrgConfig(newConfig)}
                  />
                )}

                {/* 4. TREASURER (BENDAHARA) PANEL FOR FINANCIAL LEDGER */}
                {currentRole === UserRole.BENDAHARA && (
                  <div className="space-y-8">
                    <LaporanNeraca currentRole={currentRole} txs={txs} neraca={neraca} logoUrl={orgConfig.logoUrl} logoText={orgConfig.logoText} />
                    <FinancialSheet currentRole={currentRole} />
                  </div>
                )}

                {/* 5. CHAIRMAN (KETUA) ACCESSIBILITY PANEL */}
                {currentRole === UserRole.KETUA && (
                  <div className="space-y-8">
                    <LaporanNeraca currentRole={currentRole} txs={txs} neraca={neraca} logoUrl={orgConfig.logoUrl} logoText={orgConfig.logoText} />
                    <FinancialSheet currentRole={currentRole} />
                    <div className="border border-[#E5E0D5] p-5 rounded-2xl bg-white text-left">
                      <h4 className="font-serif font-bold text-[#1B365D] text-base mb-3">Kop Surat Dinas Ketua</h4>
                      <KopSurat config={orgConfig} userRole="KETUA" />
                    </div>
                  </div>
                )}

              </div>
            )}
          </>
        )}

      </main>

      {/* FOOTER ACCORDING TO EDITORIAL AESTHETIC STYLE */}
      <footer className="bg-[#1B365D] text-[#FDFCF8] border-t-3 border-[#C5A059] py-12 px-4 sm:px-6 lg:px-10 mt-auto text-left relative z-10 transition-all">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
          
          {/* Logo brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#FDFCF8] rounded-full flex items-center justify-center text-[#1B365D] font-serif font-black text-sm border border-[#C5A059] overflow-hidden">
                {orgConfig.logoUrl ? (
                  <img src={orgConfig.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  orgConfig.logoText
                )}
              </div>
              <div className="leading-tight text-white">
                <span className="block font-serif font-bold text-sm tracking-wide text-slate-100 uppercase">IKATAN PROFESIONAL & PENSIUNAN INDONESIA</span>
                <span className="block text-[8px] tracking-widest text-[#C5A059] uppercase font-bold mt-0.5">DEDIKASI TANPA BATAS</span>
              </div>
            </div>
            <p className="text-[#8B7E66] font-serif italic text-xs leading-relaxed max-w-sm">
              "Menjadi tempat terhormat menjaga mata air keilmuan tetap mengalir bagi generasi penerus pertiwi."
            </p>
          </div>

          {/* Dynamic Address block */}
          <div className="space-y-3">
            <h4 className="text-[#C5A059] font-bold uppercase tracking-wider text-[11px]">KANTOR DEWAN PENGURUS WILAYAH</h4>
            <p className="text-slate-300 leading-relaxed uppercase">
              {orgConfig.namaSekretariat}<br />
              {orgConfig.alamatSekretariat}
            </p>
            <p className="text-slate-400 leading-normal font-mono">
              Registrasi Kemenkumham RI: {orgConfig.noIjinPendirian}<br />
              Email: {orgConfig.email} | Telp: {orgConfig.noTelp}
            </p>
          </div>

          {/* Quick link rules & accessibility statement */}
          <div className="space-y-3">
            <h4 className="text-[#C5A059] font-bold uppercase tracking-wider text-[11px]">PENGUMUMAN FORMAL LANSIA</h4>
            <p className="text-[#8B7E66] font-sans leading-relaxed">
              * Website resmi Ikatan Profesional & Pensiunan Indonesia sepenuhnya aman bagi kalangan senior, menggunakan tata letak baka, tanpa efek kedip yang berbahaya bagi penderita glaukoma.
            </p>
            <p className="text-[#C5A059] font-semibold mt-1">
              &copy; {new Date().getFullYear()} Ikatan Profesional & Pensiunan Indonesia - DPW Jatim.
            </p>
          </div>

        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON FOR SENIOR PORTAL ACCESSIBILITY */}
      <a
        href="https://api.whatsapp.com/send?phone=081803100222&text=Halo%20Sekretaris%20IPPI,%20saya%20memerlukan%20bantuan%20atau%20informasi%20mengenai%20pendaftaran%20anggota."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center space-x-2 hover:scale-105 transition-transform z-40 font-bold text-xs shrink-0 cursor-pointer border border-emerald-400"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="font-bold sm:inline">Hubungi IPPI</span>
      </a>

      {/* PERSISTENT MODALS */}

      {/* LOGIN MODAL OVERLAY */}
      {isLoginOpen && (
        <LoginModal
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setIsLoginOpen(false)}
          onRegisterClick={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
        />
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-4xl w-full flex flex-col max-h-[90vh] shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 text-left">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1B365D]" />
                <h4 className="font-bold text-sm text-[#1B365D] uppercase tracking-wide truncate max-w-[300px] md:max-w-[500px]">
                  Pratinjau: {activePreviewDoc.name}
                </h4>
              </div>
              <button
                onClick={() => setActivePreviewDoc(null)}
                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="flex-1 bg-gray-100 p-4 overflow-auto min-h-[500px] flex items-center justify-center">
              {activePreviewDoc.type.includes('pdf') || activePreviewDoc.data.startsWith('data:application/pdf') ? (
                <iframe
                  src={activePreviewDoc.data}
                  title={activePreviewDoc.name}
                  className="w-full h-[65vh] rounded-lg border shadow-sm"
                />
              ) : (
                <div className="text-center space-y-3 bg-white p-6 rounded-xl border max-w-md shadow-sm">
                  <FileText className="w-12 h-12 text-[#1B365D] mx-auto" />
                  <p className="text-sm font-semibold text-gray-800 font-serif">Pratinjau tidak didukung langsung di peramban</p>
                  <p className="text-xs text-gray-500">Berkas format ini harus diunduh terlebih dahulu untuk dapat dibuka / dibaca.</p>
                  <a
                    href={activePreviewDoc.data}
                    download={activePreviewDoc.name}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1B365D] hover:bg-[#1B365D]/90 text-white rounded-lg text-xs font-bold leading-none cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Unduh Berkas Sekarang
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
