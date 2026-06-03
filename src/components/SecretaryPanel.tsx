import React, { useState, useEffect } from 'react';
import { HomepageContent, Member, OrgConfig } from '../types';
import { getStoredContent, saveStoredContent, getStoredMembers, saveStoredMembers, saveStoredConfig } from '../utils/storage';
import { Edit, Save, Plus, Trash2, CheckCircle2, MessageSquare, PhoneCall, Printer } from 'lucide-react';
import KopSurat from './KopSurat';
import AboutEditor from './editors/AboutEditor';
import ProgramEditor from './editors/ProgramEditor';
import BeritaEditor from './editors/BeritaEditor';
import JurnalEditor from './editors/JurnalEditor';

interface SecretaryPanelProps {
  config: OrgConfig;
  onContentChange: (newContent: HomepageContent) => void;
  onConfigChange?: (newConfig: OrgConfig) => void;
}

export default function SecretaryPanel({ config, onContentChange, onConfigChange }: SecretaryPanelProps) {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [localConfig, setLocalConfig] = useState<OrgConfig>(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  // Subtab choice
  const [activeSubTab, setActiveSubTab] = useState<'EDIT_HOME' | 'APPROVALS' | 'KOP' | 'TENTANG_KAMI' | 'PROG_KERJA' | 'BERITA' | 'JURNAL' | 'FOKUS_KONTRIBUSI'>('EDIT_HOME');

  // Input states for adding new "Mengapa Bergabung" bullet
  const [newBullet, setNewBullet] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Activity Photo states
  const [isAddKegOpen, setIsAddKegOpen] = useState(false);
  const [newKegJudul, setNewKegJudul] = useState('');
  const [newKegDesc, setNewKegDesc] = useState('');
  const [newKegTanggal, setNewKegTanggal] = useState('');
  const [newKegImage, setNewKegImage] = useState('');
  const [newKegIsVideo, setNewKegIsVideo] = useState(false);
  const [newKegVideoUrl, setNewKegVideoUrl] = useState('');

  const [editingKegId, setEditingKegId] = useState<string | null>(null);
  const [editKegJudul, setEditKegJudul] = useState('');
  const [editKegDesc, setEditKegDesc] = useState('');
  const [editKegTanggal, setEditKegTanggal] = useState('');
  const [editKegImage, setEditKegImage] = useState('');
  const [editKegIsVideo, setEditKegIsVideo] = useState(false);
  const [editKegVideoUrl, setEditKegVideoUrl] = useState('');

  // Organizational Structure states
  const [isAddStrOpen, setIsAddStrOpen] = useState(false);
  const [newStrNama, setNewStrNama] = useState('');
  const [newStrJabatan, setNewStrJabatan] = useState('');
  const [newStrPhoto, setNewStrPhoto] = useState('');
  const [newStrUrutan, setNewStrUrutan] = useState<number | ''>('');

  const [editingStrId, setEditingStrId] = useState<string | null>(null);
  const [editStrNama, setEditStrNama] = useState('');
  const [editStrJabatan, setEditStrJabatan] = useState('');
  const [editStrPhoto, setEditStrPhoto] = useState('');
  const [editStrUrutan, setEditStrUrutan] = useState<number | ''>('');

  // Fokus Kontribusi states for Secretary
  const [isAddFokusOpen, setIsAddFokusOpen] = useState(false);
  const [newFokusJudul, setNewFokusJudul] = useState('');
  const [newFokusDesc, setNewFokusDesc] = useState('');
  const [newFokusUrutan, setNewFokusUrutan] = useState<number | ''>('');

  const [editingFokusId, setEditingFokusId] = useState<string | null>(null);
  const [editFokusJudul, setEditFokusJudul] = useState('');
  const [editFokusDesc, setEditFokusDesc] = useState('');
  const [editFokusUrutan, setEditFokusUrutan] = useState<number | ''>('');

  useEffect(() => {
    const handleReload = () => {
      setContent(getStoredContent());
      setMembers(getStoredMembers());
    };
    handleReload();
    window.addEventListener('ippi_storage_updated', handleReload);
    return () => {
      window.removeEventListener('ippi_storage_updated', handleReload);
    };
  }, []);

  const handleAddStruktur = () => {
    if (!content) return;
    if (!newStrNama || !newStrJabatan) {
      alert('Nama dan Jabatan wajib diisi!');
      return;
    }
    const currentList = content.strukturList || [];
    const newItem = {
      id: `str_${Date.now()}`,
      nama: newStrNama.trim(),
      jabatan: newStrJabatan.trim(),
      photoUrl: newStrPhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&fit=crop&auto=format',
      urutan: Number(newStrUrutan) || (currentList.length + 1)
    };
    const updated = {
      ...content,
      strukturList: [...currentList, newItem].sort((a, b) => a.urutan - b.urutan)
    };
    setContent(updated);
    saveStoredContent(updated);
    onContentChange(updated);

    // reset Form
    setNewStrNama('');
    setNewStrJabatan('');
    setNewStrPhoto('');
    setNewStrUrutan('');
    setIsAddStrOpen(false);
    setFeedback('Sukses: Struktur organisasi berhasil ditambahkan!');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleStartEditStr = (item: any) => {
    setEditingStrId(item.id);
    setEditStrNama(item.nama);
    setEditStrJabatan(item.jabatan);
    setEditStrPhoto(item.photoUrl || '');
    setEditStrUrutan(item.urutan || 0);
  };

  const handleSaveEditStr = () => {
    if (!content || !editingStrId) return;
    const currentList = content.strukturList || [];
    const updatedList = currentList.map(item => {
      if (item.id === editingStrId) {
        return {
          ...item,
          nama: editStrNama.trim(),
          jabatan: editStrJabatan.trim(),
          photoUrl: editStrPhoto,
          urutan: Number(editStrUrutan) || 0
        };
      }
      return item;
    }).sort((a, b) => a.urutan - b.urutan);

    const updated = {
      ...content,
      strukturList: updatedList
    };
    setContent(updated);
    saveStoredContent(updated);
    onContentChange(updated);
    setEditingStrId(null);
    setFeedback('Sukses: Anggota struktur organisasi berhasil diperbarui!');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteStr = (id: string, nama: string) => {
    if (!content) return;
    if (confirm(`Apakah Anda yakin ingin menghapus "${nama}" dari struktur organisasi?`)) {
      const currentList = content.strukturList || [];
      const updatedList = currentList.filter(item => item.id !== id);
      const updated = {
        ...content,
        strukturList: updatedList
      };
      setContent(updated);
      saveStoredContent(updated);
      onContentChange(updated);
      setFeedback('Sukses: Struktur organisasi berhasil dihapus!');
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleAddKegiatan = () => {
    if (!content) return;
    if (!newKegJudul) {
      alert('Judul kegiatan wajib diisi!');
      return;
    }
    if (newKegIsVideo && !newKegVideoUrl) {
      alert('URL video wajib diisi jika memilih jenis media Video!');
      return;
    }
    if (!newKegIsVideo && !newKegImage) {
      alert('Foto kegiatan wajib diunggah!');
      return;
    }
    const currentKeg = content.kegiatan || [];
    const newKeg = {
      id: `keg_${Date.now()}`,
      imageUrl: newKegImage,
      videoUrl: newKegVideoUrl,
      isVideo: newKegIsVideo,
      judul: newKegJudul,
      deskripsi: newKegDesc,
      tanggal: newKegTanggal
    };
    const updated = {
      ...content,
      kegiatan: [...currentKeg, newKeg]
    };
    setContent(updated);
    saveStoredContent(updated);
    onContentChange(updated);
    
    // reset form
    setNewKegJudul('');
    setNewKegDesc('');
    setNewKegTanggal('');
    setNewKegImage('');
    setNewKegIsVideo(false);
    setNewKegVideoUrl('');
    setIsAddKegOpen(false);
    setFeedback('Sukses: Media kegiatan baru berhasil ditambahkan!');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleStartEditKeg = (keg: any) => {
    setEditingKegId(keg.id);
    setEditKegJudul(keg.judul);
    setEditKegDesc(keg.deskripsi || '');
    setEditKegTanggal(keg.tanggal || '');
    setEditKegImage(keg.imageUrl || '');
    setEditKegIsVideo(!!keg.isVideo);
    setEditKegVideoUrl(keg.videoUrl || '');
  };

  const handleSaveEditKeg = () => {
    if (!content || !editingKegId) return;
    if (!editKegJudul) {
      alert('Judul kegiatan wajib diisi!');
      return;
    }
    if (editKegIsVideo && !editKegVideoUrl) {
      alert('URL video wajib diisi jika memilih jenis media Video!');
      return;
    }
    if (!editKegIsVideo && !editKegImage) {
      alert('Foto kegiatan wajib diunggah!');
      return;
    }
    const currentKeg = content.kegiatan || [];
    const updatedKeg = currentKeg.map(k => {
      if (k.id === editingKegId) {
        return {
          ...k,
          judul: editKegJudul,
          deskripsi: editKegDesc,
          tanggal: editKegTanggal,
          imageUrl: editKegImage,
          videoUrl: editKegVideoUrl,
          isVideo: editKegIsVideo
        };
      }
      return k;
    });
    const updated = {
      ...content,
      kegiatan: updatedKeg
    };
    setContent(updated);
    saveStoredContent(updated);
    onContentChange(updated);
    setEditingKegId(null);
    setFeedback('Sukses: Perubahan media kegiatan berhasil disimpan!');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteKeg = (id: string, judul: string) => {
    if (!content) return;
    if (confirm(`Apakah Anda yakin ingin menghapus foto kegiatan "${judul}"?`)) {
      const currentKeg = content.kegiatan || [];
      const updatedKeg = currentKeg.filter(k => k.id !== id);
      const updated = {
        ...content,
        kegiatan: updatedKeg
      };
      setContent(updated);
      saveStoredContent(updated);
      onContentChange(updated);
      setFeedback('Sukses: Foto kegiatan berhasil dihapus!');
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Manage Fokus Kontribusi
  const handleAddFokus = () => {
    if (!content) return;
    if (!newFokusJudul) {
      alert('Judul fokus wajib diisi!');
      return;
    }
    const currentFokus = content.fokusList || [];
    const ord = typeof newFokusUrutan === 'number' ? newFokusUrutan : (currentFokus.length + 1);
    const newItem = {
      id: `fokus_${Date.now()}`,
      judul: newFokusJudul,
      deskripsi: newFokusDesc,
      urutan: ord
    };
    const updated = {
      ...content,
      fokusList: [...currentFokus, newItem]
    };
    setContent(updated);
    saveStoredContent(updated);
    if (onContentChange) onContentChange(updated);
    
    // Reset Form
    setNewFokusJudul('');
    setNewFokusDesc('');
    setNewFokusUrutan('');
    setIsAddFokusOpen(false);
    setFeedback('Sukses: Fokus kontribusi baru berhasil ditambahkan!');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleStartEditFokus = (item: any) => {
    setEditingFokusId(item.id);
    setEditFokusJudul(item.judul);
    setEditFokusDesc(item.deskripsi || '');
    setEditFokusUrutan(item.urutan || '');
  };

  const handleSaveEditFokus = () => {
    if (!content || !editingFokusId) return;
    if (!editFokusJudul) {
      alert('Judul fokus wajib diisi!');
      return;
    }
    const currentFokus = content.fokusList || [];
    const ord = typeof editFokusUrutan === 'number' ? editFokusUrutan : 1;
    const updatedFokus = currentFokus.map(f => {
      if (f.id === editingFokusId) {
        return {
          ...f,
          judul: editFokusJudul,
          deskripsi: editFokusDesc,
          urutan: ord
        };
      }
      return f;
    });
    const updated = {
      ...content,
      fokusList: updatedFokus
    };
    setContent(updated);
    saveStoredContent(updated);
    if (onContentChange) onContentChange(updated);
    setEditingFokusId(null);
    setFeedback('Sukses: Perubahan fokus kontribusi berhasil disimpan!');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteFokus = (id: string, judul: string) => {
    if (!content) return;
    if (confirm(`Apakah Anda yakin ingin menghapus fokus kontribusi "${judul}"?`)) {
      const currentFokus = content.fokusList || [];
      const updatedFokus = currentFokus.filter(f => f.id !== id);
      const updated = {
        ...content,
        fokusList: updatedFokus
      };
      setContent(updated);
      saveStoredContent(updated);
      if (onContentChange) onContentChange(updated);
      setFeedback('Sukses: Fokus kontribusi berhasil dihapus!');
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleSaveHomepage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    saveStoredContent(content);
    onContentChange(content);
    saveStoredConfig(localConfig);
    if (onConfigChange) onConfigChange(localConfig);
    setFeedback('Sukses: Teks, Layout, dan Rekening Resmi halaman beranda website berhasil diperbarui!');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAddBullet = () => {
    if (!newBullet.trim() || !content) return;
    const updatedBullets = [...content.mengapaBergabung, newBullet.trim()];
    const updated = { ...content, mengapaBergabung: updatedBullets };
    setContent(updated);
    setNewBullet('');
  };

  const handleRemoveBullet = (index: number) => {
    if (!content) return;
    const updatedBullets = content.mengapaBergabung.filter((_, idx) => idx !== index);
    const updated = { ...content, mengapaBergabung: updatedBullets };
    setContent(updated);
  };

  const handleApproveMember = (mId: string, name: string) => {
    const nextSequence = Math.floor(10000 + Math.random() * 90000);
    const noAng = `999000${nextSequence}`;
    const noRek = `${noAng}0`;

    const updated = members.map((m) => {
      if (m.id === mId) {
        return {
          ...m,
          isApproved: true,
          noAnggota: noAng,
          noRekening: noRek
        };
      }
      return m;
    });

    saveStoredMembers(updated);
    setMembers(updated);
    setFeedback(`Anggota ${name} telah berhasil di-approve! Silakan kirim pesan WhatsApp konfirmasi.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  if (!content) return <div className="text-center py-6">Memuat data sekretaris...</div>;

  const pendingMembers = members.filter((m) => !m.isApproved);

  return (
    <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 shadow-sm">
      
      {/* Tab bar header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#F4F1EA] pb-5 mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-serif text-[#1B365D] font-bold">Panel Akses Sekretaris</h2>
          <p className="text-xs text-[#8B7E66] mt-1">
            Ubah tampilan publik web instan, lakukan verifikasi pendaftar baru, dan persiapkan kop surat resmi untuk cetak PDF.
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex flex-wrap bg-[#F4F1EA] p-1 rounded-xl gap-1 self-start md:self-end">
            <button
              type="button"
              onClick={() => setActiveSubTab('EDIT_HOME')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'EDIT_HOME' ? 'bg-[#1B365D] text-white' : 'text-[#5D574F] hover:bg-gray-200'
              }`}
            >
              Edit Beranda Publik
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('APPROVALS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold relative transition-all cursor-pointer ${
                activeSubTab === 'APPROVALS' ? 'bg-[#1B365D] text-white' : 'text-[#5D574F] hover:bg-gray-200'
              }`}
            >
              <span>Persetujuan Registrasi</span>
              {pendingMembers.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce shadow">
                  {pendingMembers.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('KOP')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'KOP' ? 'bg-[#1B365D] text-white' : 'text-[#5D574F] hover:bg-gray-200'
              }`}
            >
              Kop Surat Resmi
            </button>
          </div>
          <div className="flex flex-wrap bg-[#FDFCF8] border border-[#E5E0D5] p-1 rounded-xl gap-1 self-start md:self-end">
            <button
              type="button"
              onClick={() => setActiveSubTab('TENTANG_KAMI')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                activeSubTab === 'TENTANG_KAMI' ? 'bg-[#1B365D] text-white' : 'text-gray-500 hover:bg-gray-150'
              }`}
            >
              ✏️ 1. Tentang Kami
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('PROG_KERJA')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                activeSubTab === 'PROG_KERJA' ? 'bg-[#1B365D] text-white' : 'text-gray-500 hover:bg-gray-150'
              }`}
            >
              ✏️ 2. Program Kerja
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('BERITA')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                activeSubTab === 'BERITA' ? 'bg-[#1B365D] text-white' : 'text-gray-500 hover:bg-gray-150'
              }`}
            >
              ✏️ 3. Berita Resmi
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('JURNAL')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                activeSubTab === 'JURNAL' ? 'bg-[#1B365D] text-white' : 'text-gray-500 hover:bg-gray-150'
              }`}
            >
              ✏️ 4. Jurnal IPPI
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('FOKUS_KONTRIBUSI')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                activeSubTab === 'FOKUS_KONTRIBUSI' ? 'bg-[#1B365D] text-white' : 'text-gray-500 hover:bg-gray-150'
              }`}
            >
              ✏️ 5. Fokus Kontribusi
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold mb-6">
          {feedback}
        </div>
      )}

      {/* SUB-TAB: HOME EDITOR */}
      {activeSubTab === 'EDIT_HOME' && (
        <form onSubmit={handleSaveHomepage} className="space-y-6 max-w-4xl">
          <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4">
            <h4 className="text-xs font-bold text-amber-900 mb-1 uppercase tracking-wide">💡 Panduan Membaca bagi Lansia</h4>
            <p className="text-[11px] text-[#5D574F] leading-relaxed">
              Sebagai sekretaris, pastikan deskripsi yang Anda masukkan menggunakan bahasa Indonesia yang santun, formal, terstruktur, serta memiliki ukuran huruf yang seimbang agar ramah dibaca oleh sesama rekan lanjut usia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#5D574F] uppercase mb-2">Judul Banner Utama (Hero Title) *</label>
              <input
                type="text"
                value={content.heroTitle}
                onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                className="w-full bg-white border border-[#E5E0D5] rounded-lg px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5D574F] uppercase mb-2">Slogan Atas (Hero Subtitle) *</label>
              <input
                type="text"
                value={content.heroSub}
                onChange={(e) => setContent({ ...content, heroSub: e.target.value })}
                className="w-full bg-white border border-[#E5E0D5] rounded-lg px-4 py-2.5 text-xs font-serif italic focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5D574F] uppercase mb-2">Draf Kalimat Ucapan Selamat Datang (Hero Paragraph) *</label>
            <textarea
              rows={4}
              value={content.heroText}
              onChange={(e) => setContent({ ...content, heroText: e.target.value })}
              className="w-full bg-white border border-[#E5E0D5] rounded-lg px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5D574F] uppercase mb-2">Ringkasan Narasi Visi & Misi *</label>
            <textarea
              rows={3}
              value={content.visiMisi}
              onChange={(e) => setContent({ ...content, visiMisi: e.target.value })}
              className="w-full bg-white border border-[#E5E0D5] rounded-lg px-4 py-2.5 text-xs italic focus:ring-1 focus:ring-[#1B365D]"
              required
            />
          </div>

          {/* Tambahan Input Rekening DPW IPPI Jawa Timur (2 Baris) */}
          <div className="bg-[#1B365D]/5 border border-[#1B365D]/10 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-[#1B365D] uppercase tracking-wider flex items-center space-x-1.5">
              <span>💳 Rekening Resmi DPW IPPI Jawa Timur (2 Baris)</span>
            </h4>
            <p className="text-[11px] text-[#5D574F]">
              Sebagai sekretaris, Anda dapat memperbarui informasi rekening yang tampil secara dinamis di halaman depan (beranda) dan di portal akses anggota di bawah ini:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5D574F] uppercase mb-2">
                  No Rekening Baris 1
                </label>
                <input
                  type="text"
                  value={localConfig.noRekeningIppiBaris1 || ''}
                  onChange={(e) => setLocalConfig({ ...localConfig, noRekeningIppiBaris1: e.target.value })}
                  placeholder="Contoh: Bank Jatim Rek: 1023048999"
                  className="w-full bg-white border border-[#E5E0D5] rounded-lg px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5D574F] uppercase mb-2">
                  No Rekening Baris 2
                </label>
                <input
                  type="text"
                  value={localConfig.noRekeningIppiBaris2 || ''}
                  onChange={(e) => setLocalConfig({ ...localConfig, noRekeningIppiBaris2: e.target.value })}
                  placeholder="Contoh: a.n. DPW IPPI JAWA TIMUR"
                  className="w-full bg-white border border-[#E5E0D5] rounded-lg px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                />
              </div>
            </div>
          </div>

          {/* Bullet points editor */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-[#5D574F] uppercase">Bagian "Mengapa Bergabung" (Daftar Poin Utama)</label>
            
            <div className="space-y-2">
              {content.mengapaBergabung.map((bullet, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-[#F4F1EA] rounded-lg border border-[#E5E0D5]">
                  <span className="text-xs text-gray-800 font-medium">✔️ {bullet}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBullet(idx)}
                    className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                    title="Hapus poin ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tambah butir alasan bergabung baru..."
                value={newBullet}
                onChange={(e) => setNewBullet(e.target.value)}
                className="flex-1 bg-white border border-[#E5E0D5] rounded-lg px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
              />
              <button
                type="button"
                onClick={handleAddBullet}
                className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#B38F4D] text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Tambah Poin
              </button>
            </div>
          </div>

          {/* GALERI KEGIATAN BERANDA EDITOR */}
          <div className="border-t border-[#F4F1EA] pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1B365D] uppercase tracking-wider">📸 Pengelola Foto Kegiatan Beranda</h3>
                <p className="text-[10px] text-[#8B7E66] mt-0.5">Edit, tambah, atau hapus foto dokumentasi kegiatan terbaru yang muncul di beranda.</p>
              </div>
              {!isAddKegOpen && !editingKegId && (
                <button
                  type="button"
                  onClick={() => setIsAddKegOpen(true)}
                  className="px-3 py-1.5 bg-[#C5A059] text-white hover:bg-[#B38F4D] rounded-lg text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Foto Kegiatan</span>
                </button>
              )}
            </div>

            {/* Form Tambah Kegiatan Baru */}
            {isAddKegOpen && (
              <div className="bg-amber-50/30 border border-amber-200/50 p-4 rounded-xl space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-[#E5E0D5]/50 pb-2">
                  <h4 className="text-xs font-bold text-[#1B365D] uppercase">Tambah Kegiatan Baru</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddKegOpen(false);
                      setNewKegJudul('');
                      setNewKegDesc('');
                      setNewKegTanggal('');
                      setNewKegImage('');
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Batal
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Judul Kegiatan *</label>
                      <input
                        type="text"
                        placeholder="Contoh: Rapat Koordinasi Wilayah..."
                        value={newKegJudul}
                        onChange={(e) => setNewKegJudul(e.target.value)}
                        className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Jenis Media *</label>
                      <select
                        value={newKegIsVideo ? 'video' : 'photo'}
                        onChange={(e) => {
                          const isVid = e.target.value === 'video';
                          setNewKegIsVideo(isVid);
                          if (isVid) setNewKegImage('');
                        }}
                        className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                      >
                        <option value="photo">Foto (Unggah File)</option>
                        <option value="video">Video (URL YouTube / MP4)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Keterangan Singkat / Deskripsi</label>
                      <textarea
                        rows={2}
                        placeholder="Ulasan ringkas kegiatan..."
                        value={newKegDesc}
                        onChange={(e) => setNewKegDesc(e.target.value)}
                        className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Tanggal Kegiatan</label>
                      <input
                        type="date"
                        value={newKegTanggal}
                        onChange={(e) => setNewKegTanggal(e.target.value)}
                        className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs"
                      />
                    </div>
                    {newKegIsVideo ? (
                      <div>
                        <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">URL Video YouTube / Direct Link *</label>
                        <input
                          type="text"
                          placeholder="Contoh: https://www.youtube.com/watch?v=xxxx"
                          value={newKegVideoUrl}
                          onChange={(e) => setNewKegVideoUrl(e.target.value)}
                          className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Unggah Foto Kegiatan *</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const base64 = event.target?.result as string;
                                setNewKegImage(base64);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="block w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:bg-[#1B365D]/10 file:text-[#1B365D]"
                        />
                        {newKegImage && (
                          <div className="mt-2 w-24 h-16 rounded-lg overflow-hidden border border-[#E5E0D5] bg-gray-50">
                            <img src={newKegImage} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddKegiatan}
                    className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-bold"
                  >
                    Simpan Kegiatan Baru
                  </button>
                </div>
              </div>
            )}

            {/* Form Edit Kegiatan Existing */}
            {editingKegId && (
              <div className="bg-amber-50/40 border border-amber-300 p-4 rounded-xl space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <h4 className="text-xs font-bold text-[#1B365D] uppercase">✏️ Edit Media Kegiatan</h4>
                  <button
                    type="button"
                    onClick={() => setEditingKegId(null)}
                    className="text-xs text-slate-500 hover:text-slate-700 font-bold"
                  >
                    Batal
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Judul Kegiatan *</label>
                      <input
                        type="text"
                        value={editKegJudul}
                        onChange={(e) => setEditKegJudul(e.target.value)}
                        className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Jenis Media</label>
                      <select
                        value={editKegIsVideo ? 'video' : 'photo'}
                        onChange={(e) => {
                          const isVid = e.target.value === 'video';
                          setEditKegIsVideo(isVid);
                          if (isVid) setEditKegImage('');
                        }}
                        className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                      >
                        <option value="photo">Foto (Unggah File)</option>
                        <option value="video">Video (URL YouTube / MP4)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Keterangan Singkat / Deskripsi</label>
                      <textarea
                        rows={2}
                        value={editKegDesc}
                        onChange={(e) => setEditKegDesc(e.target.value)}
                        className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Tanggal Kegiatan</label>
                      <input
                        type="date"
                        value={editKegTanggal}
                        onChange={(e) => setEditKegTanggal(e.target.value)}
                        className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs"
                      />
                    </div>
                    {editKegIsVideo ? (
                      <div>
                        <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">URL Video YouTube / Direct Link *</label>
                        <input
                          type="text"
                          placeholder="Contoh: https://www.youtube.com/watch?v=xxxx"
                          value={editKegVideoUrl}
                          onChange={(e) => setEditKegVideoUrl(e.target.value)}
                          className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Ganti Foto Kegiatan</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const base64 = event.target?.result as string;
                                setEditKegImage(base64);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="block w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:bg-[#1B365D]/10 file:text-[#1B365D]"
                        />
                        {editKegImage && (
                          <div className="mt-2 w-24 h-16 rounded-lg overflow-hidden border border-[#E5E0D5] bg-gray-50">
                            <img src={editKegImage} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveEditKeg}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            )}

            {/* List of current Kegiatan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(content.kegiatan || []).map((keg) => (
                <div key={keg.id} className="border border-[#E5E0D5] rounded-xl p-3 bg-gray-50/50 flex space-x-3 items-center">
                  <div className="w-20 h-16 bg-white border border-[#E5E0D5] rounded-lg overflow-hidden shrink-0">
                    {keg.imageUrl ? (
                      <img src={keg.imageUrl} alt={keg.judul} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-[9px] text-gray-300 flex items-center justify-center h-full">No Image</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[11px] font-bold text-[#1B365D] truncate">{keg.judul}</h5>
                    <p className="text-[9px] text-gray-400 truncate">{keg.tanggal || 'No date'}</p>
                    <div className="mt-1 flex space-x-3">
                      <button
                        type="button"
                        onClick={() => handleStartEditKeg(keg)}
                        className="text-[10px] text-blue-600 hover:underline font-bold"
                        disabled={!!editingKegId || isAddKegOpen}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteKeg(keg.id, keg.judul)}
                        className="text-[10px] text-red-600 hover:underline font-bold"
                        disabled={!!editingKegId || isAddKegOpen}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {(content.kegiatan || []).length === 0 && (
                <p className="text-[11px] text-gray-400 col-span-2 italic text-left">Belum ada foto kegiatan. Silakan tambah di atas.</p>
              )}
            </div>
          </div>

          {/* STRUKTUR ORGANISASI EDITOR */}
          <div className="border-t border-[#F4F1EA] pt-6 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#F4F1EA] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1B365D] uppercase tracking-wider flex items-center space-x-1">
                  <span>👥 Kelola Struktur Organisasi</span>
                </h3>
                <p className="text-[10px] text-[#8B7E66] mt-0.5">Edit, tambah, atau hapus susunan pimpinan dan pengurus cabang yang tampil di beranda utama.</p>
              </div>
              {!isAddStrOpen && !editingStrId && (
                <button
                  type="button"
                  onClick={() => setIsAddStrOpen(true)}
                  className="px-3 py-1.5 bg-[#C5A059] text-white hover:bg-[#B38F4D] rounded-lg text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Pengurus</span>
                </button>
              )}
            </div>

            {/* Form Tambah Pengurus Baru */}
            {isAddStrOpen && (
              <div className="bg-amber-50/30 border border-amber-200/50 p-4 rounded-xl space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-[#E5E0D5]/50 pb-2">
                  <h4 className="text-xs font-bold text-[#1B365D] uppercase">Tambah Pengurus Baru</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddStrOpen(false);
                      setNewStrNama('');
                      setNewStrJabatan('');
                      setNewStrPhoto('');
                      setNewStrUrutan('');
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Batal
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Nama Lengkap & Gelar *</label>
                      <input
                        type="text"
                        placeholder="Contoh: Prof. Dr. Ir. H. Mohammad Muslih, S.H., M.M."
                        value={newStrNama}
                        onChange={(e) => setNewStrNama(e.target.value)}
                        className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Jabatan Struktur *</label>
                      <input
                        type="text"
                        placeholder="Contoh: Ketua Umum, Dewan Penasihat, Sekretaris..."
                        value={newStrJabatan}
                        onChange={(e) => setNewStrJabatan(e.target.value)}
                        className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Urutan Tampilan (Angka)</label>
                      <input
                        type="number"
                        placeholder="Contoh: 1, 2, 3 untuk mengatur urutan..."
                        value={newStrUrutan}
                        onChange={(e) => setNewStrUrutan(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Foto Profil Pengurus (Unggah File/Base64)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64 = event.target?.result as string;
                              setNewStrPhoto(base64);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="block w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:bg-[#1B365D]/10 file:text-[#1B365D]"
                      />
                      {newStrPhoto && (
                        <div className="mt-2 w-16 h-16 rounded-full overflow-hidden border border-[#E5E0D5] bg-gray-50 flex items-center justify-center">
                          <img src={newStrPhoto} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddStruktur}
                    className="px-4 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-bold"
                  >
                    Simpan Pengurus Baru
                  </button>
                </div>
              </div>
            )}

            {/* Form Edit Pengurus Existing */}
            {editingStrId && (
              <div className="bg-amber-50/40 border border-amber-300 p-4 rounded-xl space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <h4 className="text-xs font-bold text-[#1B365D] uppercase">✏️ Edit Susunan Pengurus</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStrId(null);
                      setEditStrNama('');
                      setEditStrJabatan('');
                      setEditStrPhoto('');
                      setEditStrUrutan('');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-700 font-bold"
                  >
                    Batal
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Nama Lengkap & Gelar *</label>
                      <input
                        type="text"
                        value={editStrNama}
                        onChange={(e) => setEditStrNama(e.target.value)}
                        className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Jabatan Struktur *</label>
                      <input
                        type="text"
                        value={editStrJabatan}
                        onChange={(e) => setEditStrJabatan(e.target.value)}
                        className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Urutan Tampilan (Angka)</label>
                      <input
                        type="number"
                        value={editStrUrutan}
                        onChange={(e) => setEditStrUrutan(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Ganti Foto Profil</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64 = event.target?.result as string;
                              setEditStrPhoto(base64);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="block w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:bg-[#1B365D]/10 file:text-[#1B365D]"
                      />
                      {editStrPhoto && (
                        <div className="mt-2 w-16 h-16 rounded-full overflow-hidden border border-[#E5E0D5] bg-gray-50 flex items-center justify-center">
                          <img src={editStrPhoto} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveEditStr}
                    className="px-4 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            )}

            {/* List Susunan Pengurus Existing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(content.strukturList || []).map((item) => (
                <div key={item.id} className="border border-[#E5E0D5] rounded-xl p-3 bg-white flex space-x-3 items-center">
                  <div className="w-12 h-12 bg-gray-100 border border-[#E5E0D5] rounded-full overflow-hidden shrink-0">
                    {item.photoUrl ? (
                      <img src={item.photoUrl} alt={item.nama} className="w-full h-full object-cover animate-fade-in" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="text-[9px] text-gray-300 flex items-center justify-center h-full">Foto</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[11px] font-bold text-[#1B365D] truncate">{item.nama}</h5>
                    <p className="text-[9px] text-[#C5A059] font-bold truncate uppercase">{item.jabatan}</p>
                    <p className="text-[8px] text-gray-400 font-mono">Urutan: {item.urutan}</p>
                    <div className="mt-1 flex space-x-3">
                      <button
                        type="button"
                        onClick={() => handleStartEditStr(item)}
                        className="text-[9px] text-blue-600 hover:underline font-bold"
                        disabled={!!editingStrId || isAddStrOpen}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStr(item.id, item.nama)}
                        className="text-[9px] text-red-600 hover:underline font-bold"
                        disabled={!!editingStrId || isAddStrOpen}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {(content.strukturList || []).length === 0 && (
                <p className="text-[11px] text-gray-400 col-span-2 italic text-left">Belum ada susunan pengurus. Silakan tambah pengurus baru di atas.</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#F4F1EA]">
            <button
              type="submit"
              className="px-6 py-3 bg-[#1B365D] hover:bg-[#122543] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Simpan Pembaruan Website Beranda
            </button>
          </div>

        </form>
      )}

      {/* SUB-TAB: APPROVALS */}
      {activeSubTab === 'APPROVALS' && (
        <div className="space-y-6">
          <h3 className="text-base font-serif font-bold text-[#1B365D]">Persetujuan Akun Calon Anggota</h3>
          <p className="text-xs text-[#8B7E66]">
            Berikut pendaftar baru yang memerlukan persetujuan manual tingkat sekretariat cabang. Sesuai mandat, klik No. WA dari peserta untuk mengirim verifikasi langsung, lalu klik tombol "Setujui Masuk IPPI" untuk menerbitkan NIM nasional.
          </p>

          <div className="space-y-4">
            {pendingMembers.length === 0 ? (
              <div className="text-center py-10 bg-[#FCD34D]/10 border border-amber-200 rounded-xl">
                <p className="text-sm font-semibold text-amber-900">Selamat! Seluruh pendaftaran telah diselesaikan.</p>
                <p className="text-xs text-amber-800 mt-1">Belum ada antrean peserta baru saat ini.</p>
              </div>
            ) : (
              pendingMembers.map((m) => {
                const draftWAMsg = `Selamat Anda telah bergabung dengan IPPI, silahkan login dengan user dan password yang sudah didaftarkan.`;
                const waUrl = `https://api.whatsapp.com/send?phone=${m.noTelp}&text=${encodeURIComponent(draftWAMsg)}`;

                return (
                  <div key={m.id} className="bg-[#FDFCF8] border border-[#E5E0D5] rounded-xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold block">PENDAFTAR MASUK</span>
                      <h4 className="font-serif font-bold text-[#1B365D] text-base">{m.nama}</h4>
                      <p className="text-xs text-gray-400 font-mono">Lahir: {m.tempatLahir}, {m.tanggalLahir}</p>
                      <p className="text-[11px] text-gray-500 font-semibold">{m.institusiPensiun}</p>
                    </div>

                    <div className="text-xs text-[#5D574F] space-y-1 bg-[#F4F1EA] p-3 rounded-lg">
                      <p><strong>Hubungi WA Pelanggan:</strong></p>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 text-[#1B365D] font-bold hover:underline text-xs"
                      >
                        <MessageSquare className="w-4 h-4 text-[#25D366]" />
                        <span>{m.noTelp} (Klik Kontak WA)</span>
                      </a>
                      <p className="text-[10px] text-gray-400 italic mt-1 font-mono">Draf isi WA: "{draftWAMsg}"</p>
                    </div>

                    <div className="flex flex-col gap-2 md:items-end">
                      <button
                        onClick={() => handleApproveMember(m.id, m.nama)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-transform hover:scale-102 cursor-pointer shadow-sm w-full md:w-auto"
                      >
                        Setujui Masuk IPPI
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB: KOP SURAT */}
      {activeSubTab === 'KOP' && (
        <div className="space-y-4">
          <KopSurat config={config} userRole="SEKRETARIS" />
        </div>
      )}

      {/* NEW CONTENT EDITORS FOR SECRETARY */}
      {activeSubTab === 'TENTANG_KAMI' && content && (
        <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 shadow-sm">
          <AboutEditor
            content={content}
            onSave={(updated) => {
              setContent(updated);
              saveStoredContent(updated);
              onContentChange(updated);
              setFeedback('Sukses: Konten Tentang Kami berhasil diperbarui!');
              setTimeout(() => setFeedback(null), 4000);
            }}
          />
        </div>
      )}

      {activeSubTab === 'PROG_KERJA' && content && (
        <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 shadow-sm">
          <ProgramEditor
            content={content}
            onSave={(updated) => {
              setContent(updated);
              saveStoredContent(updated);
              onContentChange(updated);
              setFeedback('Sukses: Konten Program Kerja berhasil diperbarui!');
              setTimeout(() => setFeedback(null), 4000);
            }}
          />
        </div>
      )}

      {activeSubTab === 'BERITA' && content && (
        <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 shadow-sm">
          <BeritaEditor
            content={content}
            onSave={(updated) => {
              setContent(updated);
              saveStoredContent(updated);
              onContentChange(updated);
              setFeedback('Sukses: Konten Berita Resmi berhasil diperbarui!');
              setTimeout(() => setFeedback(null), 4000);
            }}
          />
        </div>
      )}

      {activeSubTab === 'JURNAL' && content && (
        <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 shadow-sm">
          <JurnalEditor
            content={content}
            onSave={(updated) => {
              setContent(updated);
              saveStoredContent(updated);
              onContentChange(updated);
              setFeedback('Sukses: Konten Jurnal Berkala berhasil diperbarui!');
              setTimeout(() => setFeedback(null), 4000);
            }}
          />
        </div>
      )}

      {activeSubTab === 'FOKUS_KONTRIBUSI' && content && (
        <div className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E0D5] pb-3 gap-3">
            <div>
              <h3 className="text-lg font-serif text-[#1B365D] font-bold">Kelola Fokus Kontribusi Beranda</h3>
              <p className="text-[10px] text-[#8B7E66] mt-0.5">Edit, tambah, atau hapus pilar program kerja yang tampil di halaman beranda utama.</p>
            </div>
            {!isAddFokusOpen && !editingFokusId && (
              <button
                type="button"
                onClick={() => setIsAddFokusOpen(true)}
                className="inline-flex items-center space-x-1 px-4 py-2 bg-[#1B365D] text-white rounded-xl text-xs font-bold hover:bg-[#1B365D]/90 shadow-xs cursor-pointer"
              >
                <span>+ Tambah Pilar Baru</span>
              </button>
            )}
          </div>

          {/* Form Tambah */}
          {isAddFokusOpen && (
            <div className="bg-slate-50 border border-[#E5E0D5] p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-2">
                <h4 className="text-xs font-bold text-[#1B365D] uppercase">🆕 Tambah Pilar Fokus Kontribusi</h4>
                <button
                  type="button"
                  onClick={() => setIsAddFokusOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Batal
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Judul Fokus / Pilar *</label>
                    <input
                      type="text"
                      placeholder="Contoh: Penyaluran Tenaga Ahli (Consultancy)"
                      value={newFokusJudul}
                      onChange={(e) => setNewFokusJudul(e.target.value)}
                      className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Urutan Tampilan</label>
                    <input
                      type="number"
                      placeholder="Contoh: 1"
                      value={newFokusUrutan}
                      onChange={(e) => setNewFokusUrutan(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Deskripsi / Keterangan Singkat</label>
                  <textarea
                    rows={4}
                    placeholder="Tuliskan ulasan ringkas mengenai pilar kontribusi ini bagi kemajuan luhur bangsa..."
                    value={newFokusDesc}
                    onChange={(e) => setNewFokusDesc(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleAddFokus}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                >
                  Simpan Pilar Baru
                </button>
              </div>
            </div>
          )}

          {/* Form Edit */}
          {editingFokusId && (
            <div className="bg-amber-50/40 border border-amber-300 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <h4 className="text-xs font-bold text-[#1B365D] uppercase">✏️ Edit Pilar Fokus Kontribusi</h4>
                <button
                  type="button"
                  onClick={() => setEditingFokusId(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Batal
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Judul Fokus / Pilar *</label>
                    <input
                      type="text"
                      placeholder="Contoh: Penyaluran Tenaga Ahli (Consultancy)"
                      value={editFokusJudul}
                      onChange={(e) => setEditFokusJudul(e.target.value)}
                      className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Urutan Tampilan</label>
                    <input
                      type="number"
                      placeholder="Contoh: 1"
                      value={editFokusUrutan}
                      onChange={(e) => setEditFokusUrutan(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Deskripsi / Keterangan Singkat</label>
                  <textarea
                    rows={4}
                    placeholder="Tuliskan ulasan ringkas mengenai pilar kontribusi ini bagi kemajuan luhur bangsa..."
                    value={editFokusDesc}
                    onChange={(e) => setEditFokusDesc(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveEditFokus}
                  className="px-4 py-2 bg-[#C5A059] text-white rounded-xl text-xs font-bold hover:bg-[#C5A059]/90 cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {/* List of current Fokus Kontribusi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(content.fokusList || []).sort((a,b) => (a.urutan || 0) - (b.urutan || 0)).map((item, index) => (
              <div key={item.id} className="bg-white border border-[#E5E0D5] p-5 rounded-2xl relative space-y-3 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-[#1B365D]/5 text-[#1B365D] font-bold flex items-center justify-center text-xs">
                      {item.urutan || (index + 1)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleStartEditFokus(item)}
                        className="p-1.5 text-[#1B365D] hover:bg-gray-100 rounded-lg text-[10px] font-semibold uppercase"
                        title="Edit data pilar"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFokus(item.id, item.judul)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-[10px] font-semibold uppercase"
                        title="Hapus pilar"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                  <h4 className="font-serif font-bold text-[#1B365D] text-sm mt-3">{item.judul}</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed mt-1">{item.deskripsi}</p>
                </div>
              </div>
            ))}

            {(content.fokusList || []).length === 0 && (
              <div className="col-span-3 text-center py-8 text-gray-400 italic text-xs">
                Belum ada pilar fokus kontribusi aktif di beranda. Silakan tambah pilar baru di atas.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
