import React, { useState, useEffect } from 'react';
import { HomepageContent, Member, OrgConfig, UserRole } from '../types';
import { getStoredContent, saveStoredContent, getStoredMembers, saveStoredMembers, saveStoredConfig, compressImage } from '../utils/storage';
import { Edit, Save, Plus, Trash2, CheckCircle2, MessageSquare, PhoneCall, Printer, Paperclip, FileText, Facebook, Instagram, Youtube, Check } from 'lucide-react';
import KopSurat from './KopSurat';
import AboutEditor from './editors/AboutEditor';
import ProgramEditor from './editors/ProgramEditor';
import BeritaEditor from './editors/BeritaEditor';
import JurnalEditor from './editors/JurnalEditor';
import LapakUmkm from './LapakUmkm';

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
  const [activeSubTab, setActiveSubTab] = useState<'EDIT_HOME' | 'APPROVALS' | 'KOP' | 'TENTANG_KAMI' | 'PROG_KERJA' | 'BERITA' | 'JURNAL' | 'FOKUS_KONTRIBUSI' | 'LAPAK_UMKM'>('EDIT_HOME');

  // Input states for adding new "Mengapa Bergabung" bullet
  const [newBullet, setNewBullet] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Custom confirmation dialog state
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

  // SESSIONS COMPANION STATES FOR DOCUMENTS & SOCIAL PROFILES - SECRETARY
  const [previewSecFile, setPreviewSecFile] = useState<{ name: string; type: string; data: string } | null>(null);

  // Kegiatan Lampiran & Media Sosial
  const [newKegFileState, setNewKegFileState] = useState<{ name: string; type: string; data: string } | null>(null);
  const [editKegFileState, setEditKegFileState] = useState<{ name: string; type: string; data: string } | null>(null);

  const [newKegLinkFacebook, setNewKegLinkFacebook] = useState('');
  const [newKegLinkInstagram, setNewKegLinkInstagram] = useState('');
  const [newKegLinkYoutube, setNewKegLinkYoutube] = useState('');

  const [editKegLinkFacebook, setEditKegLinkFacebook] = useState('');
  const [editKegLinkInstagram, setEditKegLinkInstagram] = useState('');
  const [editKegLinkYoutube, setEditKegLinkYoutube] = useState('');

  // Fokus Lampiran & Media Sosial
  const [newFokusFileState, setNewFokusFileState] = useState<{ name: string; type: string; data: string } | null>(null);
  const [editFokusFileState, setEditFokusFileState] = useState<{ name: string; type: string; data: string } | null>(null);

  const [newFokusLinkFacebook, setNewFokusLinkFacebook] = useState('');
  const [newFokusLinkInstagram, setNewFokusLinkInstagram] = useState('');
  const [newFokusLinkYoutube, setNewFokusLinkYoutube] = useState('');

  const [editFokusLinkFacebook, setEditFokusLinkFacebook] = useState('');
  const [editFokusLinkInstagram, setEditFokusLinkInstagram] = useState('');
  const [editFokusLinkYoutube, setEditFokusLinkYoutube] = useState('');
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

  const handleSecFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: { name: string; type: string; data: string } | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran berkas maksimal adalah 5MB untuk kestabilan penyimpanan database.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      setter({
        name: file.name,
        type: file.type,
        data: base64Data
      });
    };
    reader.readAsDataURL(file);
  };

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
    setConfirmModal({
      isOpen: true,
      title: 'Penghapusan Pengurus',
      message: `Apakah Anda yakin ingin menghapus "${nama}" dari struktur organisasi?`,
      onConfirm: () => {
        const currentList = content.strukturList || [];
        const updatedList = currentList.filter(item => item.id !== id);
        const updated = {
          ...content,
          strukturList: updatedList
        };
        setContent(updated);
        saveStoredContent(updated);
        onContentChange(updated);
        setFeedback('Sukses: Struktur organisasi berhasil dihapus!'); // berhasil dihapus
        setTimeout(() => setFeedback(null), 4000);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
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
      tanggal: newKegTanggal,
      // Attached File properties
      fileName: newKegFileState ? newKegFileState.name : undefined,
      fileType: newKegFileState ? newKegFileState.type : undefined,
      fileData: newKegFileState ? newKegFileState.data : undefined,
      // Social Web links
      linkFacebook: newKegLinkFacebook.trim() || undefined,
      linkInstagram: newKegLinkInstagram.trim() || undefined,
      linkYoutube: newKegLinkYoutube.trim() || undefined
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
    setNewKegFileState(null);
    setNewKegLinkFacebook('');
    setNewKegLinkInstagram('');
    setNewKegLinkYoutube('');
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
    setEditKegFileState(keg.fileName ? { name: keg.fileName, type: keg.fileType || '', data: keg.fileData || '' } : null);
    setEditKegLinkFacebook(keg.linkFacebook || '');
    setEditKegLinkInstagram(keg.linkInstagram || '');
    setEditKegLinkYoutube(keg.linkYoutube || '');
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
          isVideo: editKegIsVideo,
          // Update file
          fileName: editKegFileState ? editKegFileState.name : undefined,
          fileType: editKegFileState ? editKegFileState.type : undefined,
          fileData: editKegFileState ? editKegFileState.data : undefined,
          // Update social
          linkFacebook: editKegLinkFacebook.trim() || undefined,
          linkInstagram: editKegLinkInstagram.trim() || undefined,
          linkYoutube: editKegLinkYoutube.trim() || undefined
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
    setEditKegFileState(null);
    setEditKegLinkFacebook('');
    setEditKegLinkInstagram('');
    setEditKegLinkYoutube('');
    setFeedback('Sukses: Perubahan media kegiatan berhasil disimpan!');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteKeg = (id: string, judul: string) => {
    if (!content) return;
    setConfirmModal({
      isOpen: true,
      title: 'Penghapusan Foto Kegiatan',
      message: `Apakah Anda yakin ingin menghapus foto kegiatan "${judul}"?`,
      onConfirm: () => {
        const currentKeg = content.kegiatan || [];
        const updatedKeg = currentKeg.filter(k => k.id !== id);
        const updated = {
          ...content,
          kegiatan: updatedKeg
        };
        setContent(updated);
        saveStoredContent(updated);
        onContentChange(updated);
        setFeedback('Sukses: Foto kegiatan berhasil dihapus!'); // berhasil dihapus
        setTimeout(() => setFeedback(null), 4000);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
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
      urutan: ord,
      // Attached File properties
      fileName: newFokusFileState ? newFokusFileState.name : undefined,
      fileType: newFokusFileState ? newFokusFileState.type : undefined,
      fileData: newFokusFileState ? newFokusFileState.data : undefined,
      // Social Web links
      linkFacebook: newFokusLinkFacebook.trim() || undefined,
      linkInstagram: newFokusLinkInstagram.trim() || undefined,
      linkYoutube: newFokusLinkYoutube.trim() || undefined
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
    setNewFokusFileState(null);
    setNewFokusLinkFacebook('');
    setNewFokusLinkInstagram('');
    setNewFokusLinkYoutube('');
    setIsAddFokusOpen(false);
    setFeedback('Sukses: Fokus kontribusi baru berhasil ditambahkan!');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleStartEditFokus = (item: any) => {
    setEditingFokusId(item.id);
    setEditFokusJudul(item.judul);
    setEditFokusDesc(item.deskripsi || '');
    setEditFokusUrutan(item.urutan || '');
    setEditFokusFileState(item.fileName ? { name: item.fileName, type: item.fileType || '', data: item.fileData || '' } : null);
    setEditFokusLinkFacebook(item.linkFacebook || '');
    setEditFokusLinkInstagram(item.linkInstagram || '');
    setEditFokusLinkYoutube(item.linkYoutube || '');
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
          urutan: ord,
          // Update file
          fileName: editFokusFileState ? editFokusFileState.name : undefined,
          fileType: editFokusFileState ? editFokusFileState.type : undefined,
          fileData: editFokusFileState ? editFokusFileState.data : undefined,
          // Update social
          linkFacebook: editFokusLinkFacebook.trim() || undefined,
          linkInstagram: editFokusLinkInstagram.trim() || undefined,
          linkYoutube: editFokusLinkYoutube.trim() || undefined
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
    setEditFokusFileState(null);
    setEditFokusLinkFacebook('');
    setEditFokusLinkInstagram('');
    setEditFokusLinkYoutube('');
    setFeedback('Sukses: Perubahan fokus kontribusi berhasil disimpan!');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteFokus = (id: string, judul: string) => {
    if (!content) return;
    setConfirmModal({
      isOpen: true,
      title: 'Penghapusan Fokus Kontribusi',
      message: `Apakah Anda yakin ingin menghapus fokus kontribusi "${judul}"?`,
      onConfirm: () => {
        const currentFokus = content.fokusList || [];
        const updatedFokus = currentFokus.filter(f => f.id !== id);
        const updated = {
          ...content,
          fokusList: updatedFokus
        };
        setContent(updated);
        saveStoredContent(updated);
        if (onContentChange) onContentChange(updated);
        setFeedback('Sukses: Fokus kontribusi berhasil dihapus!'); // berhasil dihapus
        setTimeout(() => setFeedback(null), 4000);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    try {
      setFeedback('Sedang menyimpan perubahan...');
      await saveStoredContent(content);
      onContentChange(content);
      await saveStoredConfig(localConfig);
      if (onConfigChange) onConfigChange(localConfig);
      setFeedback('Sukses: Teks, Layout, dan Rekening Resmi halaman beranda website berhasil diperbarui!');
    } catch (err) {
      setFeedback('Gagal menyimpan perubahan: ' + (err instanceof Error ? err.message : String(err)));
    }
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
            <button
              type="button"
              onClick={() => setActiveSubTab('LAPAK_UMKM')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                activeSubTab === 'LAPAK_UMKM' ? 'bg-[#1B365D] text-white' : 'text-gray-500 hover:bg-gray-150'
              }`}
            >
              ✏️ 6. Lapak UMKM
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
                              compressImage(file)
                                .then(base64 => setNewKegImage(base64))
                                .catch(err => {
                                  console.error("Error compressing gallery image:", err);
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    const base64 = event.target?.result as string;
                                    setNewKegImage(base64);
                                  };
                                  reader.readAsDataURL(file);
                                });
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

                <div className="border-t border-[#E5E0D5]/70 pt-3 text-left">
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Lampiran Berkas Kegiatan (Opsional: PDF, DOC, DOCX, PPT, PPTX)</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1 text-xs">
                    <input
                      type="file"
                      id="sec-new-keg-file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={(e) => handleSecFileChange(e, setNewKegFileState)}
                      className="hidden"
                    />
                    <label
                      htmlFor="sec-new-keg-file"
                      className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer border border-[#E5E0D5] flex items-center gap-1.5"
                    >
                      <Paperclip className="w-3.5 h-3.5" /> Pilih File Berkas
                    </label>
                    {newKegFileState ? (
                      <div className="flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-lg">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-semibold max-w-[200px] truncate">{newKegFileState.name}</span>
                        <button
                          type="button"
                          onClick={() => setNewKegFileState(null)}
                          className="text-red-700 hover:text-red-900 font-bold ml-1 text-sm leading-none cursor-pointer"
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-500 italic">Maksimal 5MB. Dokumen dapat diunduh / dipreview pengunjung.</span>
                    )}
                  </div>
                </div>

                {/* SOCIAL CHANNELS ROW */}
                <div className="border-t border-[#E5E0D5]/70 pt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                      <span className="flex items-center gap-1"><Facebook className="w-3.5 h-3.5 text-blue-600 animate-pulse" /> Link Facebook (Opsional)</span>
                    </label>
                    <input
                      type="url"
                      value={newKegLinkFacebook}
                      onChange={(e) => setNewKegLinkFacebook(e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full bg-white border border-[#E5E0D5] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                      <span className="flex items-center gap-1"><Instagram className="w-3.5 h-3.5 text-pink-600 animate-pulse" /> Link Instagram (Opsional)</span>
                    </label>
                    <input
                      type="url"
                      value={newKegLinkInstagram}
                      onChange={(e) => setNewKegLinkInstagram(e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full bg-white border border-[#E5E0D5] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                      <span className="flex items-center gap-1"><Youtube className="w-3.5 h-3.5 text-red-600 animate-pulse" /> Link YouTube (Opsional)</span>
                    </label>
                    <input
                      type="url"
                      value={newKegLinkYoutube}
                      onChange={(e) => setNewKegLinkYoutube(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full bg-white border border-[#E5E0D5] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                    />
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
                              compressImage(file)
                                .then(base64 => setEditKegImage(base64))
                                .catch(err => {
                                  console.error("Error compressing edit gallery image:", err);
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    const base64 = event.target?.result as string;
                                    setEditKegImage(base64);
                                  };
                                  reader.readAsDataURL(file);
                                });
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

                <div className="border-t border-[#E5E0D5]/70 pt-3 text-left">
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Ganti Lampiran Berkas Kegiatan (Opsional: PDF, DOC, DOCX, PPT, PPTX)</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1 text-xs">
                    <input
                      type="file"
                      id="sec-edit-keg-file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={(e) => handleSecFileChange(e, setEditKegFileState)}
                      className="hidden"
                    />
                    <label
                      htmlFor="sec-edit-keg-file"
                      className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer border border-[#E5E0D5] flex items-center gap-1.5"
                    >
                      <Paperclip className="w-3.5 h-3.5" /> Pilih File Berkas
                    </label>
                    {editKegFileState ? (
                      <div className="flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-lg">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-semibold max-w-[200px] truncate">{editKegFileState.name}</span>
                        <button
                          type="button"
                          onClick={() => setEditKegFileState(null)}
                          className="text-red-700 hover:text-red-900 font-bold ml-1 text-sm leading-none cursor-pointer"
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-500 italic">Maksimal 5MB. Dokumen dapat diunduh / dipreview pengunjung.</span>
                    )}
                  </div>
                </div>

                {/* SOCIAL CHANNELS ROW ON EDIT */}
                <div className="border-t border-[#E5E0D5]/70 pt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                      <span className="flex items-center gap-1"><Facebook className="w-3.5 h-3.5 text-blue-600 animate-pulse" /> Link Facebook (Opsional)</span>
                    </label>
                    <input
                      type="url"
                      value={editKegLinkFacebook}
                      onChange={(e) => setEditKegLinkFacebook(e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full bg-white border border-[#E5E0D5] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                      <span className="flex items-center gap-1"><Instagram className="w-3.5 h-3.5 text-pink-600 animate-pulse" /> Link Instagram (Opsional)</span>
                    </label>
                    <input
                      type="url"
                      value={editKegLinkInstagram}
                      onChange={(e) => setEditKegLinkInstagram(e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full bg-white border border-[#E5E0D5] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                      <span className="flex items-center gap-1"><Youtube className="w-3.5 h-3.5 text-red-600 animate-pulse" /> Link YouTube (Opsional)</span>
                    </label>
                    <input
                      type="url"
                      value={editKegLinkYoutube}
                      onChange={(e) => setEditKegLinkYoutube(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full bg-white border border-[#E5E0D5] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                    />
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
                <div key={keg.id} className="border border-[#E5E0D5] rounded-xl p-3 bg-gray-50/50 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 items-center">
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

                    {/* Lampiran files and social preview row for Secretary */}
                    <div className="mt-1.5 flex flex-wrap gap-2 text-[10px] items-center">
                      {keg.fileName ? (
                        <span className="flex items-center gap-1 font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 max-w-[150px] truncate">
                          <FileText className="w-3 h-3 text-emerald-600" />
                          {keg.fileName}
                        </span>
                      ) : (
                        <span className="text-[9px] text-gray-400 italic">No files</span>
                      )}

                      {/* Social web channels */}
                      {(keg.linkFacebook || keg.linkInstagram || keg.linkYoutube) ? (
                        <div className="flex items-center gap-1 bg-blue-50/50 px-1 py-0.5 rounded border border-blue-50">
                          {keg.linkFacebook && <Facebook className="w-3 h-3 text-blue-600" />}
                          {keg.linkInstagram && <Instagram className="w-3 h-3 text-pink-600" />}
                          {keg.linkYoutube && <Youtube className="w-3 h-3 text-red-600" />}
                        </div>
                      ) : null}
                    </div>

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
                            compressImage(file)
                              .then(base64 => setNewStrPhoto(base64))
                              .catch(err => {
                                console.error("Error compressing structure photo:", err);
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const base64 = event.target?.result as string;
                                  setNewStrPhoto(base64);
                                };
                                reader.readAsDataURL(file);
                              });
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
                            compressImage(file)
                              .then(base64 => setEditStrPhoto(base64))
                              .catch(err => {
                                console.error("Error compressing edit structure photo:", err);
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const base64 = event.target?.result as string;
                                  setEditStrPhoto(base64);
                                };
                                reader.readAsDataURL(file);
                              });
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
            onSave={(updated, actionType) => {
              setContent(updated);
              saveStoredContent(updated);
              onContentChange(updated);
              const actionMsg = actionType === 'add' ? 'berhasil ditambah' : actionType === 'edit' ? 'berhasil di rubah' : 'berhasil dihapus';
              setFeedback(`Sukses: Konten Tentang Kami ${actionMsg}!`);
              setTimeout(() => setFeedback(null), 4000);
            }}
          />
        </div>
      )}

      {activeSubTab === 'PROG_KERJA' && content && (
        <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 shadow-sm">
          <ProgramEditor
            content={content}
            onSave={(updated, actionType) => {
              setContent(updated);
              saveStoredContent(updated);
              onContentChange(updated);
              const actionMsg = actionType === 'add' ? 'berhasil ditambah' : actionType === 'edit' ? 'berhasil di rubah' : 'berhasil dihapus';
              setFeedback(`Sukses: Konten Program Kerja ${actionMsg}!`);
              setTimeout(() => setFeedback(null), 4000);
            }}
          />
        </div>
      )}

      {activeSubTab === 'BERITA' && content && (
        <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 shadow-sm">
          <BeritaEditor
            content={content}
            onSave={(updated, actionType) => {
              setContent(updated);
              saveStoredContent(updated);
              onContentChange(updated);
              const actionMsg = actionType === 'add' ? 'berhasil ditambah' : actionType === 'edit' ? 'berhasil di rubah' : 'berhasil dihapus';
              setFeedback(`Sukses: Konten Berita Resmi ${actionMsg}!`);
              setTimeout(() => setFeedback(null), 4000);
            }}
          />
        </div>
      )}

      {activeSubTab === 'JURNAL' && content && (
        <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 shadow-sm">
          <JurnalEditor
            content={content}
            onSave={(updated, actionType) => {
              setContent(updated);
              saveStoredContent(updated);
              onContentChange(updated);
              const actionMsg = actionType === 'add' ? 'berhasil ditambah' : actionType === 'edit' ? 'berhasil di rubah' : 'berhasil dihapus';
              setFeedback(`Sukses: Konten Jurnal Berkala ${actionMsg}!`);
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

              {/* Lampiran berkas pilar fokus */}
              <div className="border-t border-[#E5E0D5]/70 pt-3 text-left">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Lampiran Berkas Kegiatan (Opsional: PDF, DOC, DOCX, PPT, PPTX)</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1 text-xs">
                  <input
                    type="file"
                    id="sec-new-fokus-file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={(e) => handleSecFileChange(e, setNewFokusFileState)}
                    className="hidden"
                  />
                  <label
                    htmlFor="sec-new-fokus-file"
                    className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer border border-[#E5E0D5] flex items-center gap-1.5"
                  >
                    <Paperclip className="w-3.5 h-3.5" /> Pilih File Berkas
                  </label>
                  {newFokusFileState ? (
                    <div className="flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-lg">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold max-w-[200px] truncate">{newFokusFileState.name}</span>
                      <button
                        type="button"
                        onClick={() => setNewFokusFileState(null)}
                        className="text-red-700 hover:text-red-900 font-bold ml-1 text-sm leading-none cursor-pointer"
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-500 italic">Maksimal 5MB. Dokumen dapat diunduh / dipreview pengunjung.</span>
                  )}
                </div>
              </div>

              {/* Social URLs media links for Fokus pilar */}
              <div className="border-t border-[#E5E0D5]/70 pt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                    <span className="flex items-center gap-1"><Facebook className="w-3.5 h-3.5 text-blue-600 animate-pulse" /> Link Facebook (Opsional)</span>
                  </label>
                  <input
                    type="url"
                    value={newFokusLinkFacebook}
                    onChange={(e) => setNewFokusLinkFacebook(e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                    <span className="flex items-center gap-1"><Instagram className="w-3.5 h-3.5 text-pink-600 animate-pulse" /> Link Instagram (Opsional)</span>
                  </label>
                  <input
                    type="url"
                    value={newFokusLinkInstagram}
                    onChange={(e) => setNewFokusLinkInstagram(e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                    <span className="flex items-center gap-1"><Youtube className="w-3.5 h-3.5 text-red-600 animate-pulse" /> Link YouTube (Opsional)</span>
                  </label>
                  <input
                    type="url"
                    value={newFokusLinkYoutube}
                    onChange={(e) => setNewFokusLinkYoutube(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
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

              {/* Ganti Lampiran berkas pilar fokus */}
              <div className="border-t border-[#E5E0D5]/70 pt-3 text-left">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Ganti Lampiran Berkas Kegiatan (Opsional: PDF, DOC, DOCX, PPT, PPTX)</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1 text-xs">
                  <input
                    type="file"
                    id="sec-edit-fokus-file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={(e) => handleSecFileChange(e, setEditFokusFileState)}
                    className="hidden"
                  />
                  <label
                    htmlFor="sec-edit-fokus-file"
                    className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer border border-[#E5E0D5] flex items-center gap-1.5"
                  >
                    <Paperclip className="w-3.5 h-3.5" /> Pilih File Berkas
                  </label>
                  {editFokusFileState ? (
                    <div className="flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-lg">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold max-w-[200px] truncate">{editFokusFileState.name}</span>
                      <button
                        type="button"
                        onClick={() => setEditFokusFileState(null)}
                        className="text-red-700 hover:text-red-900 font-bold ml-1 text-sm leading-none cursor-pointer"
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-500 italic">Maksimal 5MB. Dokumen dapat diunduh / dipreview pengunjung.</span>
                  )}
                </div>
              </div>

              {/* Social URLs media links for Fokus pilar edit mode */}
              <div className="border-t border-[#E5E0D5]/70 pt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                    <span className="flex items-center gap-1"><Facebook className="w-3.5 h-3.5 text-blue-600 animate-pulse" /> Link Facebook (Opsional)</span>
                  </label>
                  <input
                    type="url"
                    value={editFokusLinkFacebook}
                    onChange={(e) => setEditFokusLinkFacebook(e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                    <span className="flex items-center gap-1"><Instagram className="w-3.5 h-3.5 text-pink-600 animate-pulse" /> Link Instagram (Opsional)</span>
                  </label>
                  <input
                    type="url"
                    value={editFokusLinkInstagram}
                    onChange={(e) => setEditFokusLinkInstagram(e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                    <span className="flex items-center gap-1"><Youtube className="w-3.5 h-3.5 text-red-600 animate-pulse" /> Link YouTube (Opsional)</span>
                  </label>
                  <input
                    type="url"
                    value={editFokusLinkYoutube}
                    onChange={(e) => setEditFokusLinkYoutube(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
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

                  <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2 text-[10px] items-center">
                    {item.fileName ? (
                      <span className="flex items-center gap-1 font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 max-w-[170px] truncate" title={item.fileName}>
                        <FileText className="w-3 h-3 text-emerald-600 shrink-0" />
                        {item.fileName}
                      </span>
                    ) : (
                      <span className="text-[9px] text-gray-400 italic">No files attached</span>
                    )}

                    {/* Social networks badge indicators */}
                    {(item.linkFacebook || item.linkInstagram || item.linkYoutube) ? (
                      <div className="flex items-center gap-1 bg-blue-50/50 px-1.5 py-0.5 rounded border border-blue-50">
                        {item.linkFacebook && <Facebook className="w-3 h-3 text-blue-600" />}
                        {item.linkInstagram && <Instagram className="w-3 h-3 text-pink-600" />}
                        {item.linkYoutube && <Youtube className="w-3 h-3 text-red-600" />}
                      </div>
                    ) : null}
                  </div>
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

      {activeSubTab === 'LAPAK_UMKM' && content && (
        <div className="space-y-6 text-left">
          <LapakUmkm
            content={content}
            currentUser={{ role: UserRole.SEKRETARIS } as Member}
            onSave={(updated) => {
              setContent(updated);
              saveStoredContent(updated);
              onContentChange(updated);
              setFeedback('Sukses: Produk Lapak UMKM berhasil diperbarui!');
              setTimeout(() => setFeedback(null), 4000);
            }}
          />
        </div>
      )}

      {/* RENDER CUSTOM CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-[#1B365D]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
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
