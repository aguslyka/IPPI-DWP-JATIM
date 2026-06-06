import React, { useState, useMemo } from 'react';
import { HomepageContent, UmkmProduct, UserRole, Member } from '../types';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Video, 
  Check, 
  X, 
  ExternalLink, 
  MessageCircle, 
  Tag, 
  ChevronRight, 
  AlertCircle
} from 'lucide-react';
import { compressImage } from '../utils/storage';

interface LapakUmkmProps {
  content: HomepageContent;
  currentUser: Member | null;
  onSave: (updated: HomepageContent) => void;
}

export default function LapakUmkm({ content, currentUser, onSave }: LapakUmkmProps) {
  const products = useMemo(() => content.umkmList || [], [content.umkmList]);
  
  // Checking Administrative access
  const canManage = useMemo(() => {
    return currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.SEKRETARIS;
  }, [currentUser]);

  // View & UI states
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modal states for CRUD
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<UmkmProduct | null>(null);
  
  // Form fields
  const [namaProduk, setNamaProduk] = useState('');
  const [namaPenjual, setNamaPenjual] = useState('');
  const [kategori, setKategori] = useState('Kuliner & Camilan');
  const [harga, setHarga] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [linkBeli, setLinkBeli] = useState('');
  const [whatsappPenjual, setWhatsappPenjual] = useState('');
  const [isBeranda, setIsBeranda] = useState(false);
  
  // Custom Confirmation Modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Video viewer Modal state
  const [activeVideoEmbdUrl, setActiveVideoEmbdUrl] = useState<string | null>(null);

  // Categories list
  const categories = ['Semua', 'Kuliner & Camilan', 'Fashion & Batik', 'Kesehatan & Herbal', 'Jasa & Seni', 'Lain-lain'];

  // Helper: Format WhatsApp to standard wa.me/62...
  const sanitizeWhatsApp = (numStr: string) => {
    let clean = numStr.replace(/\D/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    } else if (clean.startsWith('8')) {
      clean = '62' + clean;
    }
    return clean;
  };

  // Helper: Get YouTube Embed URL if exists
  const getYoutubeEmbed = (urlStr: string) => {
    if (!urlStr) return null;
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = urlStr.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
  };

  // Handle opening modal for Add
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setNamaProduk('');
    setNamaPenjual(currentUser ? currentUser.nama : '');
    setKategori('Kuliner & Camilan');
    setHarga('');
    setDeskripsi('');
    setImageUrl('');
    setVideoUrl('');
    setLinkBeli('');
    setWhatsappPenjual(currentUser ? currentUser.noTelp : '');
    setIsBeranda(false);
    setIsFormOpen(true);
  };

  // Handle opening modal for Edit
  const handleOpenEdit = (p: UmkmProduct) => {
    setEditingProduct(p);
    setNamaProduk(p.namaProduk);
    setNamaPenjual(p.namaPenjual);
    setKategori(p.kategori || 'Kuliner & Camilan');
    setHarga(String(p.harga));
    setDeskripsi(p.deskripsi);
    setImageUrl(p.imageUrl || '');
    setVideoUrl(p.videoUrl || '');
    setLinkBeli(p.linkBeli || '');
    setWhatsappPenjual(p.whatsappPenjual || '');
    setIsBeranda(!!p.isBeranda);
    setIsFormOpen(true);
  };

  // Save/Update Form Handler
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaProduk.trim() || !namaPenjual.trim() || !deskripsi.trim() || !harga.trim() || !whatsappPenjual.trim()) {
      alert('Mohon isi semua field wajib (Nama Produk, Nama Penjual, Harga, Deskripsi, WhatsApp)!');
      return;
    }

    const priceClean = harga.replace(/[^\d]/g, ''); // Extract numeric values if it's only numbers
    const finalHarga = priceClean && !isNaN(Number(priceClean)) ? Number(priceClean) : harga;

    const defaultImagesByCat: Record<string, string> = {
      'Kuliner & Camilan': 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop',
      'Fashion & Batik': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop',
      'Kesehatan & Herbal': 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop',
      'Jasa & Seni': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600&auto=format&fit=crop',
      'Lain-lain': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop'
    };

    const finalImage = imageUrl.trim() || defaultImagesByCat[kategori] || 'https://images.unsplash.com/photo-1546213290-e1b7610339e5?q=80&w=600&auto=format&fit=crop';

    if (editingProduct) {
      // Edit mode
      const updatedList = products.map((item) => {
        if (item.id === editingProduct.id) {
          return {
            ...item,
            namaProduk: namaProduk.trim(),
            namaPenjual: namaPenjual.trim(),
            kategori,
            harga: finalHarga,
            deskripsi: deskripsi.trim(),
            imageUrl: finalImage,
            videoUrl: videoUrl.trim(),
            linkBeli: linkBeli.trim(),
            whatsappPenjual: whatsappPenjual.trim(),
            isBeranda: isBeranda
          };
        }
        return item;
      });

      setConfirmModal({
        isOpen: true,
        title: 'Konfirmasi Perubahan',
        message: `Apakah Anda yakin ingin menyimpan perubahan data produk "${namaProduk}"?`,
        onConfirm: () => {
          onSave({ ...content, umkmList: updatedList });
          setIsFormOpen(false);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      });
    } else {
      // Add mode
      const newProduct: UmkmProduct = {
        id: `umkm_${Date.now()}`,
        namaProduk: namaProduk.trim(),
        namaPenjual: namaPenjual.trim(),
        kategori,
        harga: finalHarga,
        deskripsi: deskripsi.trim(),
        imageUrl: finalImage,
        videoUrl: videoUrl.trim(),
        linkBeli: linkBeli.trim(),
        whatsappPenjual: whatsappPenjual.trim(),
        isBeranda: isBeranda,
        urutan: products.length + 1
      };

      const updatedList = [...products, newProduct];
      onSave({ ...content, umkmList: updatedList });
      setIsFormOpen(false);
    }
  };

  // Delete product Handler
  const handleDeleteProduct = (p: UmkmProduct) => {
    setConfirmModal({
      isOpen: true,
      title: 'Konfirmasi Penghapusan',
      message: `Apakah Anda benar-benar yakin ingin menghapus produk "${p.namaProduk}" dari Lapak UMKM? Tindakan ini tidak dapat dibatalkan.`,
      onConfirm: () => {
        const updatedList = products.filter((item) => item.id !== p.id);
        onSave({ ...content, umkmList: updatedList });
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Helper: Format price display
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

  // Filtering products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'Semua' || p.kategori === selectedCategory;
      const cleanSearch = searchTerm.toLowerCase().trim();
      const matchSearch = 
        !cleanSearch || 
        p.namaProduk.toLowerCase().includes(cleanSearch) || 
        p.deskripsi.toLowerCase().includes(cleanSearch) || 
        p.namaPenjual.toLowerCase().includes(cleanSearch) || 
        (p.kategori || '').toLowerCase().includes(cleanSearch);
      return matchCat && matchSearch;
    }).sort((a, b) => (a.urutan || 99) - (b.urutan || 99));
  }, [products, selectedCategory, searchTerm]);

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Banner / Header */}
      <div className="border-b border-[#E5E0D5] pb-5 flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">Pemberdayaan Bisnis Pensiunan</span>
          <h2 className="text-3xl font-serif text-[#1B365D] font-bold mt-1">Lapak UMKM IPPI</h2>
          <p className="text-xs text-[#8B7E66] mt-1 max-w-2xl leading-relaxed">
            Mempromosikan produk kreatif, karya seni, kerajinan tangan, kuliner khas, dan pengobatan herbal buatan mandiri oleh pensiunan profesional anggota IPPI. Mari dukung usaha mandiri rekan sejawat!
          </p>
        </div>
        
        {/* Admin controls */}
        {canManage && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-[#C5A059] hover:bg-[#B38F4D] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-sm self-start md:self-auto active:scale-97"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E5E0D5] p-4 shadow-sm space-y-4">
        {/* Categories Carousel */}
        <div className="flex items-center space-x-2 overflow-x-auto scroller-hidden pb-1">
          <Tag className="w-4 h-4 text-[#8B7E66] shrink-0 max-sm:hidden" />
          <div className="flex space-x-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 px-3.5 text-xs font-bold rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#1B365D] border-[#1B365D] text-white shadow-xs'
                    : 'bg-slate-50 border-gray-200 text-gray-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Input Search Row */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari produk pensiunan (contoh: kopi, batik, minyak herbal, atau nama penjual)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 hover:border-gray-300 focus:border-[#C5A059] focus:bg-white focus:outline-none rounded-xl transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-gray-600"
            >
              Hapus
            </button>
          )}
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500/80 mx-auto" />
          <p className="text-gray-600 font-serif text-sm font-bold">Produk Tidak Ditemukan</p>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Maaf, tidak ada produk UMKM yang cocok dengan filter "{selectedCategory}" atau pencarian "{searchTerm}". Coba kata kunci yang lain.
          </p>
          {(searchTerm || selectedCategory !== 'Semua') && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Semua');
                setSearchTerm('');
              }}
              className="text-xs font-bold text-[#1B365D] hover:underline cursor-pointer"
            >
              Reset Filter Pencarian
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const hasVideo = !!p.videoUrl;
            
            return (
              <div 
                key={p.id}
                className="group bg-white rounded-2xl border border-[#E5E0D5] overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 relative"
              >
                {/* Product Image Stage */}
                <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
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
                    {p.isBeranda && (
                      <span className="px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-white bg-amber-500 rounded-md shadow-xs flex items-center gap-0.5">
                        ★ Terpilih di Beranda
                      </span>
                    )}
                  </div>

                  {/* Video Play Badge (If Youtube exists) */}
                  {hasVideo && (
                    <button
                      type="button"
                      onClick={() => {
                        const embed = getYoutubeEmbed(p.videoUrl || '');
                        if (embed) setActiveVideoEmbdUrl(embed);
                        else if (p.videoUrl) window.open(p.videoUrl, '_blank');
                      }}
                      className="absolute bottom-3 right-3 p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-all cursor-pointer active:scale-90 flex items-center justify-center group/vid"
                      title="Tonton Video Promosi"
                    >
                      <Video className="w-3.5 h-3.5 mr-1" />
                      <span className="text-[9px] font-bold pr-1">Video</span>
                    </button>
                  )}

                  {/* Admin Toolbar (on top of card image) */}
                  {canManage && (
                    <div className="absolute top-3 right-3 flex items-center space-x-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-xs p-1.5 rounded-xl shadow-md border border-gray-100">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors cursor-pointer"
                        title="Ubah Produk"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p)}
                        className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content Panel */}
                <div className="p-4.5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif font-bold text-sm text-[#1B365D] line-clamp-1 group-hover:text-[#C5A059] transition-colors leading-snug">
                        {p.namaProduk}
                      </h3>
                    </div>
                    
                    <p className="text-[10px] text-[#8B7E66] font-medium leading-relaxed">
                      Oleh: <span className="font-bold">{p.namaPenjual}</span>
                    </p>

                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                      {p.deskripsi}
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">HARGA ESTIMASI</span>
                      <span className="text-sm font-bold text-[#C5A059] font-mono">
                        {formatRupiah(p.harga)}
                      </span>
                    </div>

                    {/* Order Action Buttons Row */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* WhatsApp Button */}
                      <a
                        href={`https://wa.me/${sanitizeWhatsApp(p.whatsappPenjual || '')}?text=${encodeURIComponent(`Halo Bapak/Ibu ${p.namaPenjual}, saya melihat produk "${p.namaProduk}" di Portal UMKM Koperasi IPPI RI. Saya ingin bertanya lebih lanjut mengenai produk tersebut.`)}`}
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
                          className="flex items-center justify-center space-x-1 px-3 py-2 border border-orange-200 hover:border-orange-300 text-orange-600 bg-orange-50/50 hover:bg-orange-50 active:scale-95 text-[10px] font-bold rounded-xl transition-all text-center"
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
      )}

      {/* FOOTER TIPS */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start space-x-3.5 max-w-3xl mx-auto">
        <ShoppingBag className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-serif font-bold text-[#1B365D]">Mau Mempromosikan Produk UMKM Anda?</h4>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Anggota terdaftar yang memiliki produk jajanan, batik, iuran jahit, buku otobiografi, atau konsultansi keahlian dapat menghubungi **Sekretaris Cabang IPPI** agar barang dagangannya dipajang di halaman Lapak UMKM ini secara gratis.
          </p>
        </div>
      </div>

      {/* ================= FORM MODAL (ADD & EDIT) ================= */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-[#1B365D]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 max-w-lg w-full shadow-2xl relative my-8 animate-in fade-in zoom-in duration-200 text-left">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-serif font-bold text-[#1B365D] flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
                <span>{editingProduct ? 'Ubah Data Produk UMKM' : 'Tambah Produk UMKM Baru'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-serif">
              
              {/* Row 1: Nama Produk */}
              <div className="space-y-1">
                <label className="block text-gray-700 font-bold">Nama Produk <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Madu Rimba Hutan Asli / Kripik Pisang Madu Jatim"
                  value={namaProduk}
                  onChange={(e) => setNamaProduk(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-gray-200 focus:border-[#C5A059] focus:bg-white focus:outline-none rounded-xl transition-all font-sans font-normal"
                />
              </div>

              {/* Row 2: Penjual & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-gray-700 font-bold">Penjual / Produksi <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ibu Hj. Sitti Aminah"
                    value={namaPenjual}
                    onChange={(e) => setNamaPenjual(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-gray-200 focus:border-[#C5A059] focus:bg-white focus:outline-none rounded-xl transition-all font-sans font-normal"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-700 font-bold">Kategori Produk <span className="text-rose-500">*</span></label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-gray-200 focus:border-[#C5A059] focus:bg-white focus:outline-none rounded-xl transition-all cursor-pointer font-sans font-normal"
                  >
                    <option value="Kuliner & Camilan">Kuliner & Camilan</option>
                    <option value="Fashion & Batik">Fashion & Batik</option>
                    <option value="Kesehatan & Herbal">Kesehatan & Herbal</option>
                    <option value="Jasa & Seni">Jasa & Seni</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Harga & No WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-gray-700 font-bold font-serif">Mata Uang/Harga Estimasi <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 150000 atau Rp 150.000"
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-gray-200 focus:border-[#C5A059] focus:bg-white focus:outline-none rounded-xl transition-all font-sans font-mono"
                  />
                  <p className="text-[10px] text-[#8B7E66] font-sans">Bisa berupa angka mentah maupun deskripsi (contoh: Hubungi Penjual).</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-700 font-bold">No. WhatsApp Hubung <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 08123456789 atau 628123456789"
                    value={whatsappPenjual}
                    onChange={(e) => setWhatsappPenjual(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-gray-200 focus:border-[#C5A059] focus:bg-white focus:outline-none rounded-xl transition-all font-sans font-normal"
                  />
                </div>
              </div>

              {/* Row 4: Deskripsi */}
              <div className="space-y-1">
                <label className="block text-gray-700 font-bold">Deskripsi Singkat Produk <span className="text-rose-500">*</span></label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ceritakan sejarah pembuatan produk, bahan baku, keunggulan, rasa, kelangkaan, atau lama pengerjaan produk itu..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-gray-200 focus:border-[#C5A059] focus:bg-white focus:outline-none rounded-xl transition-all font-sans font-normal"
                />
              </div>

              {/* Row 5: URL Gambar */}
              <div className="space-y-1">
                <label className="block text-gray-700 font-bold">Link URL Gambar Produk <span className="text-gray-400 font-normal">(Opsional)</span></label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... (Kosongkan bila ingin memakai gambar bawaan kategori)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-gray-200 focus:border-[#C5A059] focus:bg-white focus:outline-none rounded-xl transition-all font-sans font-normal"
                />
              </div>

              {/* Upload Foto Produk */}
              <div className="space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-200 text-left">
                <label className="block text-gray-700 font-bold">Atau Upload/Unggah Foto Produk Langsung <span className="text-gray-400 font-normal">(Rekomendasi)</span></label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1 text-xs">
                  <input
                    type="file"
                    id="umkm-photo-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        compressImage(file)
                          .then(base64 => setImageUrl(base64))
                          .catch(err => {
                            console.error("Error compressing product image:", err);
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setImageUrl(event.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          });
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="umkm-photo-upload"
                    className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#1B365D] rounded-lg text-xs font-semibold cursor-pointer border border-gray-350 flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Pilih file foto produk
                  </label>
                  {imageUrl && imageUrl.startsWith('data:image') ? (
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded overflow-hidden border border-gray-300 bg-white">
                        <img src={imageUrl} className="w-full h-full object-cover" alt="Preview Produk" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="text-xs text-red-650 hover:text-red-750 font-bold hover:underline cursor-pointer font-sans"
                      >
                        Batal / Hapus Foto
                      </button>
                    </div>
                  ) : imageUrl ? (
                    <span className="text-[10px] text-gray-500 italic max-w-[200px] truncate font-sans">Menggunakan URL eksternal gambar</span>
                  ) : (
                    <span className="text-[10px] text-gray-400 italic font-sans">Maksimal 5MB. Foto lokal akan dicompress &amp; disimpan secara luhur.</span>
                  )}
                </div>
              </div>

              {/* Row 6: Tautan Beli Olshop & Video Promosi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-gray-700 font-bold">URL Shopee / Toko Online <span className="text-gray-400 font-normal">(Opsional)</span></label>
                  <input
                    type="url"
                    placeholder="https://shopee.co.id/produk-affiliate..."
                    value={linkBeli}
                    onChange={(e) => setLinkBeli(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-gray-200 focus:border-[#C5A059] focus:bg-white focus:outline-none rounded-xl transition-all font-sans font-normal"
                  />
                  <p className="text-[10px] text-gray-400 font-sans">Bisa diisi link affiliate Shopee, Tokopedia, Bukalapak dll.</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-700 font-bold">URL Video Promosi YouTube <span className="text-gray-400 font-normal">(Opsional)</span></label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-gray-200 focus:border-[#C5A059] focus:bg-white focus:outline-none rounded-xl transition-all font-sans font-normal"
                  />
                  <p className="text-[10px] text-gray-400 font-sans">Sematkan demonstrasi unboxing produk.</p>
                </div>
              </div>

              {/* Pilihan Tampilkan di Beranda */}
              <div className="flex items-center space-x-2.5 bg-[#1B365D]/5 border border-blue-100 p-3.5 rounded-xl">
                <input
                  type="checkbox"
                  id="isBeranda"
                  checked={isBeranda}
                  onChange={(e) => setIsBeranda(e.target.checked)}
                  className="w-4.5 h-4.5 text-[#1B365D] border-gray-300 rounded focus:ring-[#C5A059] cursor-pointer"
                />
                <label htmlFor="isBeranda" className="text-[#1B365D] font-bold cursor-pointer select-none leading-tight">
                  Tampilkan Produk ini Sebagai Produk Terpilih di Beranda / Halaman Utama
                </label>
              </div>

              {/* Buttons Action */}
              <div className="flex justify-end space-x-2.5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-bold font-sans border border-[#E5E0D5] hover:bg-slate-50 text-gray-500 rounded-xl transition-colors cursor-pointer"
                >
                  Batal / Tutup
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold font-sans text-white bg-[#1B365D] hover:bg-[#254673] rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  {editingProduct ? 'Simpan Perubahan' : 'Terbitkan Produk'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= VIDEO WATCH MODAL ================= */}
      {activeVideoEmbdUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 max-w-2xl w-full shadow-2xl relative my-8 animate-in fade-in zoom-in duration-200 text-left">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className="text-xs text-white font-medium flex items-center space-x-1.5">
                <Video className="w-4 h-4 text-rose-500" />
                <span>Tonton Video Demontrasi / Penjelasan Produk</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveVideoEmbdUrl(null)}
                className="p-1.5 hover:bg-slate-800 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner border border-slate-800">
              <iframe
                src={`${activeVideoEmbdUrl}?autoplay=1`}
                title="UMKM YouTube Promo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              ></iframe>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveVideoEmbdUrl(null)}
                className="px-4 py-2 text-[11px] font-bold font-sans bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl transition-colors cursor-pointer"
              >
                Tutup Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CONFIRMATION DIALOG MODAL ================= */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-[#1B365D]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200 text-left">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-full border flex-shrink-0 ${
                confirmModal.title.includes('Penghapusan') 
                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                  : 'bg-indigo-50 border-indigo-200 text-[#1B365D]'
              }`}>
                {confirmModal.title.includes('Penghapusan') ? (
                  <Trash2 className="w-5 h-5" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-serif font-bold text-[#1B365D] mb-1">
                  {confirmModal.title}
                </h3>
                <p className="text-xs text-gray-600 font-sans leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-end space-x-2.5">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-[11px] font-bold border border-[#E5E0D5] hover:bg-slate-50 text-gray-500 rounded-xl transition-colors cursor-pointer"
              >
                Batal / Tidak
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`px-4.5 py-2 text-[11px] font-bold text-white rounded-xl shadow-md transition-all cursor-pointer hover:shadow-lg ${
                  confirmModal.title.includes('Penghapusan')
                    ? 'bg-rose-600 hover:bg-rose-700 active:scale-95'
                    : 'bg-[#1B365D] hover:bg-[#254673] active:scale-95'
                }`}
              >
                Yakin / Ya
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
