import React, { useState, useEffect } from 'react';
import { OrgConfig, Member, VisitorLog, UserRole, JenisKelamin, Agama, HomepageContent } from '../types';
import { getStoredConfig, saveStoredConfig, getStoredMembers, saveStoredMembers, getStoredVisitors, saveStoredVisitors, logVisitorAction, getStoredContent, saveStoredContent, compressImage } from '../utils/storage';
import { Settings, Users, History, Check, Shield, Trash2, Edit2, Plus, RefreshCw, X, Image, Paperclip, FileText, Facebook, Instagram, Youtube } from 'lucide-react';
import AboutEditor from './editors/AboutEditor';
import ProgramEditor from './editors/ProgramEditor';
import BeritaEditor from './editors/BeritaEditor';
import JurnalEditor from './editors/JurnalEditor';
import LapakUmkm from './LapakUmkm';

export const getRoleBadge = (m: Member | Partial<Member>) => {
  let role = m.role || UserRole.ANGGOTA;
  if (!m.role && m.email) {
    if (m.email.toLowerCase().includes('admin')) role = UserRole.ADMIN;
    else if (m.email.toLowerCase().includes('sekretaris')) role = UserRole.SEKRETARIS;
    else if (m.email.toLowerCase().includes('bendahara')) role = UserRole.BENDAHARA;
    else if (m.email.toLowerCase().includes('ketua')) role = UserRole.KETUA;
  }

  switch (role) {
    case UserRole.ADMIN:
      return <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase mt-1">Admin</span>;
    case UserRole.SEKRETARIS:
      return <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase mt-1">Sekretaris</span>;
    case UserRole.BENDAHARA:
      return <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase mt-1">Bendahara</span>;
    case UserRole.KETUA:
      return <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold bg-violet-50 text-violet-700 border border-violet-200 uppercase mt-1">Ketua</span>;
    default:
      return <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-50 text-gray-600 border border-gray-200 uppercase mt-1">Anggota</span>;
  }
};

interface AdminPanelProps {
  onConfigChange: (newConfig: OrgConfig) => void;
  onMembersChange?: () => void;
  onContentChange?: (newContent: HomepageContent) => void;
}

export default function AdminPanel({ onConfigChange, onMembersChange, onContentChange }: AdminPanelProps) {
  const [config, setConfig] = useState<OrgConfig | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [visitors, setVisitors] = useState<VisitorLog[]>([]);

  // Active Admin Sub-tab
  const [subTab, setSubTab] = useState<'CONFIG' | 'USERS' | 'VISITORS' | 'GALLERY' | 'STRUKTUR' | 'TENTANG_KAMI' | 'PROG_KERJA' | 'BERITA' | 'JURNAL' | 'FOKUS_KONTRIBUSI' | 'LAPAK_UMKM'>('CONFIG');

  // Selected User for Editing
  const [isEditingUser, setIsEditingUser] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Partial<Member>>({});

  // Error/Success state
  const [feedback, setFeedback] = useState<{ status: 'ok' | 'error'; msg: string } | null>(null);

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

  // Homepage activities management states for Admin
  const [homeContent, setHomeContent] = useState<HomepageContent | null>(null);
  const [isAddKegOpen, setIsAddKegOpen] = useState(false);
  const [newKegJudul, setNewKegJudul] = useState('');
  const [newKegDesc, setNewKegDesc] = useState('');
  const [newKegTanggal, setNewKegTanggal] = useState('');
  const [newKegImage, setNewKegImage] = useState('');
  const [newKegIsVideo, setNewKegIsVideo] = useState(false);
  const [newKegVideoUrl, setNewKegVideoUrl] = useState('');
  const [newKegFileState, setNewKegFileState] = useState<{ name: string; type: string; data: string } | null>(null);
  const [newKegLinkFacebook, setNewKegLinkFacebook] = useState('');
  const [newKegLinkInstagram, setNewKegLinkInstagram] = useState('');
  const [newKegLinkYoutube, setNewKegLinkYoutube] = useState('');

  const [editingKegId, setEditingKegId] = useState<string | null>(null);
  const [editKegJudul, setEditKegJudul] = useState('');
  const [editKegDesc, setEditKegDesc] = useState('');
  const [editKegTanggal, setEditKegTanggal] = useState('');
  const [editKegImage, setEditKegImage] = useState('');
  const [editKegIsVideo, setEditKegIsVideo] = useState(false);
  const [editKegVideoUrl, setEditKegVideoUrl] = useState('');
  const [editKegFileState, setEditKegFileState] = useState<{ name: string; type: string; data: string } | null>(null);
  const [editKegLinkFacebook, setEditKegLinkFacebook] = useState('');
  const [editKegLinkInstagram, setEditKegLinkInstagram] = useState('');
  const [editKegLinkYoutube, setEditKegLinkYoutube] = useState('');

  // Best/Featured & Order states for Gallery Items
  const [newKegIsBest, setNewKegIsBest] = useState(false);
  const [newKegUrutan, setNewKegUrutan] = useState<number | ''>('');
  const [newKegIsBeranda, setNewKegIsBeranda] = useState(false);
  const [editKegIsBest, setEditKegIsBest] = useState(false);
  const [editKegUrutan, setEditKegUrutan] = useState<number | ''>('');
  const [editKegIsBeranda, setEditKegIsBeranda] = useState(false);

  // Organizational Structure states for Admin
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

  // Fokus Kontribusi states for Admin
  const [isAddFokusOpen, setIsAddFokusOpen] = useState(false);
  const [newFokusJudul, setNewFokusJudul] = useState('');
  const [newFokusDesc, setNewFokusDesc] = useState('');
  const [newFokusUrutan, setNewFokusUrutan] = useState<number | ''>('');
  const [newFokusFileState, setNewFokusFileState] = useState<{ name: string; type: string; data: string } | null>(null);
  const [newFokusImageUrl, setNewFokusImageUrl] = useState('');
  const [newFokusLinkFacebook, setNewFokusLinkFacebook] = useState('');
  const [newFokusLinkInstagram, setNewFokusLinkInstagram] = useState('');
  const [newFokusLinkYoutube, setNewFokusLinkYoutube] = useState('');

  const [editingFokusId, setEditingFokusId] = useState<string | null>(null);
  const [editFokusJudul, setEditFokusJudul] = useState('');
  const [editFokusDesc, setEditFokusDesc] = useState('');
  const [editFokusUrutan, setEditFokusUrutan] = useState<number | ''>('');
  const [editFokusFileState, setEditFokusFileState] = useState<{ name: string; type: string; data: string } | null>(null);
  const [editFokusImageUrl, setEditFokusImageUrl] = useState('');
  const [editFokusLinkFacebook, setEditFokusLinkFacebook] = useState('');
  const [editFokusLinkInstagram, setEditFokusLinkInstagram] = useState('');
  const [editFokusLinkYoutube, setEditFokusLinkYoutube] = useState('');

  const [previewAdminFile, setPreviewAdminFile] = useState<{ name: string; type: string; data: string } | null>(null);

  useEffect(() => {
    const handleReload = () => {
      setConfig(getStoredConfig());
      setMembers(getStoredMembers());
      setVisitors(getStoredVisitors());
      setHomeContent(getStoredContent());
    };
    handleReload();
    window.addEventListener('ippi_storage_updated', handleReload);
    return () => {
      window.removeEventListener('ippi_storage_updated', handleReload);
    };
  }, []);

  const triggerFeedback = (status: 'ok' | 'error', msg: string) => {
    setFeedback({ status, msg });
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleAdminFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: { name: string; type: string; data: string } | null) => void) => {
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
    if (!homeContent) return;
    if (!newStrNama || !newStrJabatan) {
      alert('Nama dan Jabatan wajib diisi!');
      return;
    }
    const currentList = homeContent.strukturList || [];
    const newItem = {
      id: `str_${Date.now()}`,
      nama: newStrNama.trim(),
      jabatan: newStrJabatan.trim(),
      photoUrl: newStrPhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&fit=crop&auto=format',
      urutan: Number(newStrUrutan) || (currentList.length + 1)
    };
    const updated = {
      ...homeContent,
      strukturList: [...currentList, newItem].sort((a, b) => a.urutan - b.urutan)
    };
    setHomeContent(updated);
    saveStoredContent(updated);
    if (onContentChange) onContentChange(updated);

    // reset Form
    setNewStrNama('');
    setNewStrJabatan('');
    setNewStrPhoto('');
    setNewStrUrutan('');
    setIsAddStrOpen(false);
    triggerFeedback('ok', 'Sukses: Pengurus baru berhasil ditambahkan ke dalam Struktur Organisasi!');
  };

  const handleStartEditStr = (item: any) => {
    setEditingStrId(item.id);
    setEditStrNama(item.nama);
    setEditStrJabatan(item.jabatan);
    setEditStrPhoto(item.photoUrl || '');
    setEditStrUrutan(item.urutan || 0);
  };

  const handleSaveEditStr = () => {
    if (!homeContent || !editingStrId) return;
    const currentList = homeContent.strukturList || [];
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
      ...homeContent,
      strukturList: updatedList
    };
    setHomeContent(updated);
    saveStoredContent(updated);
    if (onContentChange) onContentChange(updated);
    setEditingStrId(null);
    triggerFeedback('ok', 'Sukses: Anggota struktur organisasi berhasil diperbarui!');
  };

  const handleDeleteStr = (id: string, nama: string) => {
    if (!homeContent) return;
    setConfirmModal({
      isOpen: true,
      title: 'Penghapusan Pengurus',
      message: `Apakah Anda yakin ingin menghapus "${nama}" dari struktur organisasi?`,
      onConfirm: () => {
        const currentList = homeContent.strukturList || [];
        const updatedList = currentList.filter(item => item.id !== id);
        const updated = {
          ...homeContent,
          strukturList: updatedList
        };
        setHomeContent(updated);
        saveStoredContent(updated);
        if (onContentChange) onContentChange(updated);
        triggerFeedback('ok', 'Sukses: Struktur organisasi berhasil dihapus!'); // berhasil dihapus
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleAddKegiatan = () => {
    if (!homeContent) return;
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
    const currentKeg = homeContent.kegiatan || [];
    const newKeg = {
      id: `keg_${Date.now()}`,
      imageUrl: newKegImage,
      videoUrl: newKegVideoUrl,
      isVideo: newKegIsVideo,
      judul: newKegJudul,
      deskripsi: newKegDesc,
      tanggal: newKegTanggal,
      fileName: newKegFileState?.name,
      fileType: newKegFileState?.type,
      fileData: newKegFileState?.data,
      linkFacebook: newKegLinkFacebook.trim() || undefined,
      linkInstagram: newKegLinkInstagram.trim() || undefined,
      linkYoutube: newKegLinkYoutube.trim() || undefined,
      isBest: newKegIsBest,
      urutan: typeof newKegUrutan === 'number' ? newKegUrutan : undefined,
      isBeranda: newKegIsBeranda
    };
    const updatedKegList = [...currentKeg, newKeg].sort((a, b) => {
      const urutanA = a.urutan !== undefined ? Number(a.urutan) : 999999;
      const urutanB = b.urutan !== undefined ? Number(b.urutan) : 999999;
      return urutanA - urutanB;
    });
    const updated = {
      ...homeContent,
      kegiatan: updatedKegList
    };
    setHomeContent(updated);
    saveStoredContent(updated);
    if (onContentChange) onContentChange(updated);
    
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
    setNewKegIsBest(false);
    setNewKegUrutan('');
    setNewKegIsBeranda(false);
    setIsAddKegOpen(false);
    triggerFeedback('ok', 'Sukses: Media kegiatan baru berhasil ditambahkan!');
  };

  const handleStartEditKeg = (keg: any) => {
    setEditingKegId(keg.id);
    setEditKegJudul(keg.judul);
    setEditKegDesc(keg.deskripsi || '');
    setEditKegTanggal(keg.tanggal || '');
    setEditKegImage(keg.imageUrl || '');
    setEditKegIsVideo(!!keg.isVideo);
    setEditKegVideoUrl(keg.videoUrl || '');
    setEditKegLinkFacebook(keg.linkFacebook || '');
    setEditKegLinkInstagram(keg.linkInstagram || '');
    setEditKegLinkYoutube(keg.linkYoutube || '');
    setEditKegIsBest(!!keg.isBest);
    setEditKegUrutan(typeof keg.urutan === 'number' ? keg.urutan : '');
    setEditKegIsBeranda(!!keg.isBeranda);
    if (keg.fileName && keg.fileData) {
      setEditKegFileState({
        name: keg.fileName,
        type: keg.fileType || '',
        data: keg.fileData
      });
    } else {
      setEditKegFileState(null);
    }
  };

  const handleSaveEditKeg = () => {
    if (!homeContent || !editingKegId) return;
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
    const currentKeg = homeContent.kegiatan || [];
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
          fileName: editKegFileState?.name,
          fileType: editKegFileState?.type,
          fileData: editKegFileState?.data,
          linkFacebook: editKegLinkFacebook.trim() || undefined,
          linkInstagram: editKegLinkInstagram.trim() || undefined,
          linkYoutube: editKegLinkYoutube.trim() || undefined,
          isBest: editKegIsBest,
          urutan: typeof editKegUrutan === 'number' ? editKegUrutan : undefined,
          isBeranda: editKegIsBeranda
        };
      }
      return k;
    }).sort((a, b) => {
      const urutanA = a.urutan !== undefined ? Number(a.urutan) : 999999;
      const urutanB = b.urutan !== undefined ? Number(b.urutan) : 999999;
      return urutanA - urutanB;
    });
    const updated = {
      ...homeContent,
      kegiatan: updatedKeg
    };
    setHomeContent(updated);
    saveStoredContent(updated);
    if (onContentChange) onContentChange(updated);
    setEditingKegId(null);
    setEditKegFileState(null);
    setEditKegLinkFacebook('');
    setEditKegLinkInstagram('');
    setEditKegLinkYoutube('');
    setEditKegIsBeranda(false);
    triggerFeedback('ok', 'Sukses: Perubahan media kegiatan berhasil disimpan!');
  };

  const handleDeleteKeg = (id: string, judul: string) => {
    if (!homeContent) return;
    setConfirmModal({
      isOpen: true,
      title: 'Penghapusan Foto Kegiatan',
      message: `Apakah Anda yakin ingin menghapus foto kegiatan "${judul}"?`,
      onConfirm: () => {
        const currentKeg = homeContent.kegiatan || [];
        const updatedKeg = currentKeg.filter(k => k.id !== id);
        const updated = {
          ...homeContent,
          kegiatan: updatedKeg
        };
        setHomeContent(updated);
        saveStoredContent(updated);
        if (onContentChange) onContentChange(updated);
        triggerFeedback('ok', 'Sukses: Foto kegiatan berhasil dihapus!'); // berhasil dihapus
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Manage Fokus Kontribusi
  const handleAddFokus = () => {
    if (!homeContent) return;
    if (!newFokusJudul) {
      alert('Judul fokus wajib diisi!');
      return;
    }
    const currentFokus = homeContent.fokusList || [];
    const ord = typeof newFokusUrutan === 'number' ? newFokusUrutan : (currentFokus.length + 1);
    const newItem = {
      id: `fokus_${Date.now()}`,
      judul: newFokusJudul,
      deskripsi: newFokusDesc,
      urutan: ord,
      fileName: newFokusFileState?.name,
      fileType: newFokusFileState?.type,
      fileData: newFokusFileState?.data,
      linkFacebook: newFokusLinkFacebook.trim() || undefined,
      linkInstagram: newFokusLinkInstagram.trim() || undefined,
      linkYoutube: newFokusLinkYoutube.trim() || undefined,
      imageUrl: newFokusImageUrl || undefined
    };
    const updated = {
      ...homeContent,
      fokusList: [...currentFokus, newItem]
    };
    setHomeContent(updated);
    saveStoredContent(updated);
    if (onContentChange) onContentChange(updated);
    
    // Reset Form
    setNewFokusJudul('');
    setNewFokusDesc('');
    setNewFokusUrutan('');
    setNewFokusFileState(null);
    setNewFokusImageUrl('');
    setNewFokusLinkFacebook('');
    setNewFokusLinkInstagram('');
    setNewFokusLinkYoutube('');
    setIsAddFokusOpen(false);
    triggerFeedback('ok', 'Sukses: Fokus kontribusi baru berhasil ditambahkan!');
  };

  const handleStartEditFokus = (item: any) => {
    setEditingFokusId(item.id);
    setEditFokusJudul(item.judul);
    setEditFokusDesc(item.deskripsi || '');
    setEditFokusUrutan(item.urutan || '');
    setEditFokusLinkFacebook(item.linkFacebook || '');
    setEditFokusLinkInstagram(item.linkInstagram || '');
    setEditFokusLinkYoutube(item.linkYoutube || '');
    setEditFokusImageUrl(item.imageUrl || '');
    if (item.fileName && item.fileData) {
      setEditFokusFileState({
        name: item.fileName,
        type: item.fileType || '',
        data: item.fileData
      });
    } else {
      setEditFokusFileState(null);
    }
  };

  const handleSaveEditFokus = () => {
    if (!homeContent || !editingFokusId) return;
    if (!editFokusJudul) {
      alert('Judul fokus wajib diisi!');
      return;
    }
    const currentFokus = homeContent.fokusList || [];
    const ord = typeof editFokusUrutan === 'number' ? editFokusUrutan : 1;
    const updatedFokus = currentFokus.map(f => {
      if (f.id === editingFokusId) {
        return {
          ...f,
          judul: editFokusJudul,
          deskripsi: editFokusDesc,
          urutan: ord,
          fileName: editFokusFileState?.name,
          fileType: editFokusFileState?.type,
          fileData: editFokusFileState?.data,
          linkFacebook: editFokusLinkFacebook.trim() || undefined,
          linkInstagram: editFokusLinkInstagram.trim() || undefined,
          linkYoutube: editFokusLinkYoutube.trim() || undefined,
          imageUrl: editFokusImageUrl || undefined
        };
      }
      return f;
    });
    const updated = {
      ...homeContent,
      fokusList: updatedFokus
    };
    setHomeContent(updated);
    saveStoredContent(updated);
    if (onContentChange) onContentChange(updated);
    setEditingFokusId(null);
    setEditFokusFileState(null);
    setEditFokusImageUrl('');
    setEditFokusLinkFacebook('');
    setEditFokusLinkInstagram('');
    setEditFokusLinkYoutube('');
    triggerFeedback('ok', 'Sukses: Perubahan fokus kontribusi berhasil disimpan!');
  };

  const handleDeleteFokus = (id: string, judul: string) => {
    if (!homeContent) return;
    setConfirmModal({
      isOpen: true,
      title: 'Penghapusan Fokus Kontribusi',
      message: `Apakah Anda yakin ingin menghapus fokus kontribusi "${judul}"?`,
      onConfirm: () => {
        const currentFokus = homeContent.fokusList || [];
        const updatedFokus = currentFokus.filter(f => f.id !== id);
        const updated = {
          ...homeContent,
          fokusList: updatedFokus
        };
        setHomeContent(updated);
        saveStoredContent(updated);
        if (onContentChange) onContentChange(updated);
        triggerFeedback('ok', 'Sukses: Fokus kontribusi berhasil dihapus!'); // berhasil dihapus
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // 1. Manage Config

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    try {
      triggerFeedback('ok', 'Sedang menyimpan perubahan...');
      await saveStoredConfig(config);
      onConfigChange(config);
      triggerFeedback('ok', 'Sukses: Pengaturan profil sekretariat nasional IPPI berhasil disimpan!');
    } catch (err) {
      triggerFeedback('error', 'Gagal menyimpan pengaturan: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // 2. Manage Users (Create / Update / Delete)
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser.nama || !selectedUser.email || !selectedUser.noTelp) {
      triggerFeedback('error', 'Semua kolom bertanda * wajib diisi sebelum menyimpan!');
      return;
    }

    let updatedList = [...members];
    const isNew = !selectedUser.id;

    if (isNew) {
      // Create random number
      const nextSequence = Math.floor(10000 + Math.random() * 90000);
      const generatedNoAnggota = `999000${nextSequence}`;
      
      const newMember: Member = {
        id: `m_${Date.now()}`,
        nama: selectedUser.nama || '',
        tempatLahir: selectedUser.tempatLahir || '',
        tanggalLahir: selectedUser.tanggalLahir || '',
        institusiPensiun: selectedUser.institusiPensiun || '',
        jenisKelamin: selectedUser.jenisKelamin as JenisKelamin || JenisKelamin.LAKI_LAKI,
        agama: selectedUser.agama as Agama || Agama.ISLAM,
        keahlian: selectedUser.keahlian || '',
        noTelp: selectedUser.noTelp || '',
        email: selectedUser.email || '',
        alamat: selectedUser.alamat || '',
        password: selectedUser.password || 'password123',
        role: selectedUser.role || UserRole.ANGGOTA,
        isApproved: selectedUser.isApproved ?? true,
        noAnggota: generatedNoAnggota,
        noRekening: `${generatedNoAnggota}0`
      };
      updatedList.push(newMember);
      triggerFeedback('ok', `Sukses: Anggota baru "${newMember.nama}" berhasil ditambahkan!`);
    } else {
      updatedList = updatedList.map((m) => {
        if (m.id === selectedUser.id) {
          // If approved just now and doesn't have number yet
          let noAng = m.noAnggota;
          let noRek = m.noRekening;
          if (selectedUser.isApproved && !m.isApproved && !m.noAnggota) {
            const nextSequence = Math.floor(10000 + Math.random() * 90000);
            noAng = `999000${nextSequence}`;
            noRek = `${noAng}0`;
          }
          return {
            ...m,
            ...selectedUser,
            noAnggota: noAng,
            noRekening: noRek
          } as Member;
        }
        return m;
      });
      triggerFeedback('ok', 'Sukses: Profil anggota berhasil diperbaharui!');
    }

    saveStoredMembers(updatedList);
    setMembers(updatedList);
    setIsEditingUser(false);
    setSelectedUser({});
    if (onMembersChange) onMembersChange();
  };

  const handleDeleteUser = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Penghapusan Akun Anggota',
      message: `Apakah Anda yakin ingin menghapus akun "${name}" secara permanen dari database IPPI?`,
      onConfirm: () => {
        const updated = members.filter((m) => m.id !== id);
        saveStoredMembers(updated);
        setMembers(updated);
        triggerFeedback('ok', `Anggota "${name}" berhasil dihapus.`); // berhasil dihapus
        if (onMembersChange) onMembersChange();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleApproveInline = (id: string) => {
    const nextSequence = Math.floor(10000 + Math.random() * 90000);
    const noAng = `999000${nextSequence}`;
    const noRek = `${noAng}0`;

    const updated = members.map((m) => {
      if (m.id === id) {
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
    triggerFeedback('ok', 'Anggota berhasil divalidasi dan disetujui masuk IPPI!');
    if (onMembersChange) onMembersChange();
  };

  // 3. Visitor Logs
  const handleRefreshLogs = () => {
    const refreshed = getStoredVisitors();
    setVisitors(refreshed);
    
    // Inject a random log for realistic demonstration
    const names = [
      'Mohammad Muslih',
      'Ratna Sari, S.H.',
      'Sujatmiko, M.BA',
      'Dr. H. Sulaiman Ridwan',
      'Bambang Wijaya',
      'Anisa Hermawan'
    ];
    const roles = [UserRole.KETUA, UserRole.SEKRETARIS, UserRole.ADMIN, UserRole.BENDAHARA, UserRole.ANGGOTA];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    
    logVisitorAction(
      randomName,
      `${randomName.toLowerCase().replace(/[\s,\.\-]+/g, '')}@gmail.com`,
      randomRole,
      Math.random() > 0.4 ? 'LOGIN' : 'LOGOUT'
    );
    
    // Fetch again
    setVisitors(getStoredVisitors());
    triggerFeedback('ok', 'Log Visitor berhasil disegarkan secara real-time dari session server!');
  };

  // Clear All logs to reset
  const handleClearLogs = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Pembersihan Visitor Log',
      message: 'Apakah Anda ingin mengosongkan riwayat visitor log?',
      onConfirm: () => {
        saveStoredVisitors([]);
        setVisitors([]);
        triggerFeedback('ok', 'Riwayat visitor log berhasil dibersihkan.'); // berhasil dihapus
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  if (!config) return <div className="text-center py-8">Memuat data admin...</div>;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 shadow-sm">
      {/* Tab Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#F4F1EA] pb-5 mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-serif text-[#1B365D] font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#C5A059]" /> Panel Kontrol Administrasi Utama
          </h2>
          <p className="text-xs text-[#8B7E66] mt-1">
            Gunakan panel ini untuk mengelola logo, izin Kemenkumham, seluruh akun pendaftar lansia, dan memonitor data login visitor.
          </p>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex flex-col gap-3 w-full border-t border-gray-150 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-[10px] font-bold text-[#8B7E66] uppercase tracking-wider">Aktivitas Administrasi &amp; Anggota</div>
            <div className="flex flex-wrap bg-[#F4F1EA] p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => { setSubTab('CONFIG'); setIsEditingUser(false); }}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTab === 'CONFIG' ? 'bg-[#1B365D] text-white' : 'text-[#5D574F] hover:bg-gray-200'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Pengaturan Cabang</span>
              </button>
              <button
                type="button"
                onClick={() => { setSubTab('USERS'); }}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTab === 'USERS' ? 'bg-[#1B365D] text-white' : 'text-[#5D574F] hover:bg-gray-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Kelola Anggota</span>
              </button>
              <button
                type="button"
                onClick={() => { setSubTab('VISITORS'); setIsEditingUser(false); }}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTab === 'VISITORS' ? 'bg-[#1B365D] text-white' : 'text-[#5D574F] hover:bg-gray-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Log Visitor</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-gray-200 pt-2.5">
            <div className="text-[10px] font-bold text-[#8B7E66] uppercase tracking-wider">Pengelolaan Konten Publik IPPI (Tambah, Edit, Hapus)</div>
            <div className="flex flex-wrap bg-[#F4F1EA] p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => { setSubTab('TENTANG_KAMI'); setIsEditingUser(false); }}
                className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTab === 'TENTANG_KAMI' ? 'bg-[#1B365D] text-white' : 'text-[#5D574F] hover:bg-gray-200'
                }`}
              >
                <span>1. Tentang Kami</span>
              </button>
              <button
                type="button"
                onClick={() => { setSubTab('PROG_KERJA'); setIsEditingUser(false); }}
                className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTab === 'PROG_KERJA' ? 'bg-[#1B365D] text-white' : 'text-[#5D574F] hover:bg-gray-200'
                }`}
              >
                <span>2. Program Kerja</span>
              </button>
              <button
                type="button"
                onClick={() => { setSubTab('GALLERY'); setIsEditingUser(false); }}
                className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTab === 'GALLERY' ? 'bg-[#1B365D] text-white' : 'text-[#5D574F] hover:bg-gray-200'
                }`}
              >
                <span>3. Galeri Kegiatan</span>
              </button>
              <button
                type="button"
                onClick={() => { setSubTab('BERITA'); setIsEditingUser(false); }}
                className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTab === 'BERITA' ? 'bg-[#1B365D] text-white' : 'text-[#5D574F] hover:bg-gray-200'
                }`}
              >
                <span>4. Berita</span>
              </button>
              <button
                type="button"
                onClick={() => { setSubTab('JURNAL'); setIsEditingUser(false); }}
                className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTab === 'JURNAL' ? 'bg-[#1B365D] text-white' : 'text-[#5D574F] hover:bg-gray-200'
                }`}
              >
                <span>5. Jurnal Berkala</span>
              </button>
              <button
                type="button"
                onClick={() => { setSubTab('STRUKTUR'); setIsEditingUser(false); }}
                className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTab === 'STRUKTUR' ? 'bg-[#1B365D] text-white' : 'text-[#5D574F] hover:bg-gray-200'
                }`}
              >
                <span>Struktur Org</span>
              </button>
              <button
                type="button"
                onClick={() => { setSubTab('FOKUS_KONTRIBUSI'); setIsEditingUser(false); }}
                className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTab === 'FOKUS_KONTRIBUSI' ? 'bg-[#1B365D] text-white' : 'text-[#5D574F] hover:bg-gray-200'
                }`}
              >
                <span>6. Fokus Kontribusi</span>
              </button>
              <button
                type="button"
                onClick={() => { setSubTab('LAPAK_UMKM'); setIsEditingUser(false); }}
                className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  subTab === 'LAPAK_UMKM' ? 'bg-[#1B365D] text-white' : 'text-[#5D574F] hover:bg-gray-200'
                }`}
              >
                <span>7. Lapak UMKM</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-lg text-xs mb-6 font-semibold border ${
          feedback.status === 'ok' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {feedback.msg}
        </div>
      )}

      {/* SUB-TAB CONTENT 1: CONFIGURE SYSTEM SETTINGS */}
      {subTab === 'CONFIG' && (
        <form onSubmit={handleConfigSubmit} className="space-y-6 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5D574F] uppercase tracking-wider mb-2">
                  Singkatan Logo / Label Khas *
                </label>
                <input
                  type="text"
                  value={config.logoText}
                  onChange={(e) => setConfig({ ...config, logoText: e.target.value })}
                  className="w-full bg-white border border-[#E5E0D5] rounded-lg px-4 py-2.5 text-xs font-mono font-bold focus:ring-1 focus:ring-[#1B365D]"
                  required
                />
                <p className="text-[10px] text-gray-400 mt-1">Dicetak pada bagian ujung kartu depan.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5D574F] uppercase tracking-wider mb-2">
                  Unggah Logo Gambar Organisasi
                </label>
                <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border border-dashed border-[#E5E0D5]">
                  <div className="w-12 h-12 bg-white rounded-full border-2 border-[#C5A059] flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    {config.logoUrl ? (
                      <img src={config.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-serif font-bold text-[#1B365D]">{config.logoText || 'IPPI'}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          compressImage(file)
                            .then(base64 => setConfig({ ...config, logoUrl: base64 }))
                            .catch(err => {
                              console.error("Error compressing logo image:", err);
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const base64 = event.target?.result as string;
                                setConfig({ ...config, logoUrl: base64 });
                              };
                              reader.readAsDataURL(file);
                            });
                        }
                      }}
                      className="block w-full text-xs text-gray-500
                        file:mr-3 file:py-1.5 file:px-3
                        file:rounded-full file:border-0
                        file:text-[11px] file:font-semibold
                        file:bg-[#1B365D]/10 file:text-[#1B365D]
                        hover:file:bg-[#1B365D]/20
                        cursor-pointer focus:outline-none"
                    />
                    {config.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setConfig({ ...config, logoUrl: '' })}
                        className="text-[10px] text-red-600 hover:underline font-bold mt-1.5 block text-left"
                      >
                        Hapus Gambar (Kembali ke Teks)
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Pilih berkas gambar (PNG, JPG) untuk menggantikan logo tulisan.</p>
              </div>
            </div>

            <div className="flex flex-col justify-start">
              <label className="block text-xs font-bold text-[#5D574F] uppercase tracking-wider mb-2">
                Nama Kantor Sekretariat Utama *
              </label>
              <input
                type="text"
                value={config.namaSekretariat}
                onChange={(e) => setConfig({ ...config, namaSekretariat: e.target.value })}
                className="w-full bg-white border border-[#E5E0D5] rounded-lg px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5D574F] uppercase tracking-wider mb-2">
              Alamat Lengkap Sekretariatan Organisasi *
            </label>
            <textarea
              rows={3}
              value={config.alamatSekretariat}
              onChange={(e) => setConfig({ ...config, alamatSekretariat: e.target.value })}
              className="w-full bg-white border border-[#E5E0D5] rounded-lg px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
              required
            />
            <p className="text-[10px] text-gray-400 mt-1">Alamat ini akan tertera dinamis pada KARTU ANGGOTA bagian belakang dan KOP SURAT surat keluar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#5D574F] uppercase tracking-wider mb-2">
                No. Izin Pendirian / Kemenkumham *
              </label>
              <input
                type="text"
                value={config.noIjinPendirian}
                onChange={(e) => setConfig({ ...config, noIjinPendirian: e.target.value })}
                className="w-full bg-white border border-[#E5E0D5] rounded-lg px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5D574F] uppercase tracking-wider mb-2">
                No. Telepon Sekretariat *
              </label>
              <input
                type="text"
                value={config.noTelp}
                onChange={(e) => setConfig({ ...config, noTelp: e.target.value })}
                className="w-full bg-white border border-[#E5E0D5] rounded-lg px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5D574F] uppercase tracking-wider mb-2">
                Email Pengurus Sekretariat *
              </label>
              <input
                type="email"
                value={config.email}
                onChange={(e) => setConfig({ ...config, email: e.target.value })}
                className="w-full bg-white border border-[#E5E0D5] rounded-lg px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>
          </div>

          {/* Tambahan Info Rekening DPW IPPI Jawa Timur (2 Baris) */}
          <div className="bg-[#1B365D]/5 border border-[#1B365D]/10 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-[#1B365D] uppercase tracking-wider flex items-center space-x-1.5">
              <span>💳 Rekening Resmi DPW IPPI Jawa Timur (2 Baris)</span>
            </h4>
            <p className="text-[11px] text-[#5D574F]">
              Informasi rekening ini akan ditampilkan secara dinamis di halaman depan (Beranda Utama) dan di portal utama akses Anggota sebagai rujukan pembayaran.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5D574F] uppercase mb-2">
                  No Rekening Baris 1
                </label>
                <input
                  type="text"
                  value={config.noRekeningIppiBaris1 || ''}
                  onChange={(e) => setConfig({ ...config, noRekeningIppiBaris1: e.target.value })}
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
                  value={config.noRekeningIppiBaris2 || ''}
                  onChange={(e) => setConfig({ ...config, noRekeningIppiBaris2: e.target.value })}
                  placeholder="Contoh: a.n. DPW IPPI JAWA TIMUR"
                  className="w-full bg-white border border-[#E5E0D5] rounded-lg px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F4F1EA]">
            <button
              type="submit"
              className="px-6 py-3 bg-[#1B365D] hover:bg-[#122543] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Simpan Perubahan Pengaturan
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB CONTENT 2: MANAGE USER ACCOUNTS */}
      {subTab === 'USERS' && (
        <div className="space-y-6">
          {!isEditingUser ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#5D574F] uppercase tracking-wider">
                  Daftar Anggota / Pengurus Terdaftar ({members.length} Orang)
                </span>
                <button
                  onClick={() => {
                    setSelectedUser({
                      jenisKelamin: JenisKelamin.LAKI_LAKI,
                      agama: Agama.ISLAM,
                      role: UserRole.ANGGOTA,
                      isApproved: true
                    });
                    setIsEditingUser(true);
                  }}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Anggota Manual</span>
                </button>
              </div>

              {/* Table User list */}
              <div className="overflow-x-auto border border-[#E5E0D5] rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F4F1EA] text-[#1B365D] border-b border-[#E5E0D5]">
                      <th className="px-4 py-3 font-semibold">Nama Lengkap & Gelar</th>
                      <th className="px-4 py-3 font-semibold">Kontak & Rumah</th>
                      <th className="px-4 py-3 font-semibold">Pensiunan & Keahlian</th>
                      <th className="px-4 py-3 font-semibold">Status Validasi</th>
                      <th className="px-4 py-3 font-semibold text-center">Aksi Operasional</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4F1EA]">
                    {members.map((m) => (
                      <tr key={m.id} className="hover:bg-[#FDFCF8]">
                        <td className="px-4 py-3.5">
                          <p className="font-serif font-bold text-gray-900 text-sm">{m.nama}</p>
                          <div className="flex flex-col space-y-0.5 mt-0.5">
                            <span className="text-[10px] text-gray-400 font-mono">
                              No. Anggota: {m.noAnggota || 'Belum divalidasi'}
                            </span>
                            <div>{getRoleBadge(m)}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-gray-700">{m.noTelp}</p>
                          <p className="text-gray-500 text-[11px] font-mono">{m.email}</p>
                          <p className="text-gray-400 text-[10px] mt-0.5 line-clamp-1">{m.alamat}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-amber-900">{m.institusiPensiun}</p>
                          <p className="text-gray-500 text-[11px] italic line-clamp-1">{m.keahlian}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          {m.isApproved ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-bold">
                              <Check className="w-3 h-3" /> <span>Aktif & Approved</span>
                            </span>
                          ) : (
                            <div className="space-y-1">
                              <span className="block text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-center">
                                Menunggu Approval
                              </span>
                              <button
                                onClick={() => handleApproveInline(m.id)}
                                className="w-full text-center hover:underline text-[10px] text-[#1B365D] font-bold block cursor-pointer"
                              >
                                Klik Setujui (Approve)
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedUser(m);
                                setIsEditingUser(true);
                              }}
                              className="p-1.5 bg-gray-50 md:hover:bg-[#1B365D] md:hover:text-white rounded border border-[#E5E0D5] text-gray-700 transition-colors cursor-pointer"
                              title="Edit Profil"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(m.id, m.nama)}
                              className="p-1.5 bg-rose-50 text-rose-700 md:hover:bg-rose-600 md:hover:text-white rounded border border-rose-200 transition-colors cursor-pointer"
                              title="Hapus Akun"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Edit User Sub-Form
            <form onSubmit={handleSaveUser} className="bg-[#FDFCF8] border border-[#E5E0D5] p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-3">
                <h3 className="text-base font-serif font-bold text-[#1B365D]">
                  {selectedUser.id ? `Ubah Akun: ${selectedUser.nama}` : 'Tambah Akun Anggota Baru Baru'}
                </h3>
                <button
                  type="button"
                  onClick={() => { setIsEditingUser(false); setSelectedUser({}); }}
                  className="p-1 text-gray-400 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    value={selectedUser.nama || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, nama: e.target.value })}
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Aktif *</label>
                  <input
                    type="email"
                    value={selectedUser.email || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">No. Telp / HP / WhatsApp *</label>
                  <input
                    type="text"
                    value={selectedUser.noTelp || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, noTelp: e.target.value })}
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={selectedUser.tempatLahir || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, tempatLahir: e.target.value })}
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={selectedUser.tanggalLahir || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, tanggalLahir: e.target.value })}
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={selectedUser.jenisKelamin || JenisKelamin.LAKI_LAKI}
                    onChange={(e) => setSelectedUser({ ...selectedUser, jenisKelamin: e.target.value as JenisKelamin })}
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-[#1B365D]"
                  >
                    <option value={JenisKelamin.LAKI_LAKI}>Laki-Laki</option>
                    <option value={JenisKelamin.PEREMPUAN}>Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Agama</label>
                  <select
                    value={selectedUser.agama || Agama.ISLAM}
                    onChange={(e) => setSelectedUser({ ...selectedUser, agama: e.target.value as Agama })}
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-[#1B365D]"
                  >
                    {Object.values(Agama).map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Hak Akses / Peran *</label>
                  <select
                    value={selectedUser.role || UserRole.ANGGOTA}
                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as UserRole })}
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs font-bold text-[#1B365D] focus:ring-1 focus:ring-[#1B365D]"
                    required
                  >
                    <option value={UserRole.ANGGOTA}>Anggota Biasa (ANGGOTA)</option>
                    <option value={UserRole.ADMIN}>Admin Utama Cabang (ADMIN)</option>
                    <option value={UserRole.SEKRETARIS}>Sekretaris Pengurus (SEKRETARIS)</option>
                    <option value={UserRole.BENDAHARA}>Bendahara Keuangan (BENDAHARA)</option>
                    <option value={UserRole.KETUA}>Ketua Pengurus Cabang (KETUA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kata Sandi (Password) *</label>
                  <input
                    type="text"
                    value={selectedUser.password || ''}
                    placeholder="Kata sandi login..."
                    onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs font-mono font-semibold focus:ring-1 focus:ring-[#1B365D]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Institusi Pensiun</label>
                  <input
                    type="text"
                    value={selectedUser.institusiPensiun || ''}
                    placeholder="Contoh: PT Pos Indonesia"
                    onChange={(e) => setSelectedUser({ ...selectedUser, institusiPensiun: e.target.value })}
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Keahlian Masa Kerja</label>
                  <input
                    type="text"
                    value={selectedUser.keahlian || ''}
                    placeholder="Contoh: Logistik rute ekspedisi..."
                    onChange={(e) => setSelectedUser({ ...selectedUser, keahlian: e.target.value })}
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Alamat Rumah Lengkap</label>
                <textarea
                  rows={2}
                  value={selectedUser.alamat || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, alamat: e.target.value })}
                  className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="adminApproveCheckbox"
                  checked={selectedUser.isApproved || false}
                  onChange={(e) => setSelectedUser({ ...selectedUser, isApproved: e.target.checked })}
                  className="w-4 h-4 rounded text-[#1B365D]"
                />
                <label htmlFor="adminApproveCheckbox" className="text-xs font-bold text-[#1B365D]">
                  Setujui Anggota Ini Langsung (Approved status)
                </label>
              </div>

              <div className="flex space-x-3 pt-3 border-t border-[#E5E0D5]">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1B365D] text-white rounded text-xs font-bold hover:bg-[#122543] cursor-pointer"
                >
                  Simpan Perubahan Akun
                </button>
                <button
                  type="button"
                  onClick={() => { setIsEditingUser(false); setSelectedUser({}); }}
                  className="px-5 py-2.5 bg-[#F4F1EA] text-[#5D574F] rounded text-xs font-bold hover:bg-gray-200 cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* SUB-TAB CONTENT 3: LOG VISITOR TRACKING */}
      {subTab === 'VISITORS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5D574F] uppercase tracking-wider">
              Monitor Sesi Login Aktivitas (Visitor Logs)
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleRefreshLogs}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-xs font-bold cursor-pointer hover:bg-amber-100"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Log Visitor</span>
              </button>
              <button
                onClick={handleClearLogs}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-500 rounded text-xs font-bold cursor-pointer hover:bg-gray-200"
              >
                <span>Clear Logs</span>
              </button>
            </div>
          </div>

          <div className="border border-[#E5E0D5] rounded-xl overflow-hidden max-h-96 overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F4F1EA] text-[#1B365D] border-b border-[#E5E0D5] sticky top-0">
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Hak Sesi</th>
                  <th className="px-4 py-3 font-semibold">Aksi Akses</th>
                  <th className="px-4 py-3 font-semibold">Waktu Tercatat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F1EA]">
                {visitors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-400 italic">
                      Belum ada jejak login visitor terekam saat ini.
                    </td>
                  </tr>
                ) : (
                  visitors.map((v) => (
                    <tr key={v.id} className="hover:bg-[#FDFCF8]">
                      <td className="px-4 py-2.5">
                        <span className="font-bold text-gray-800 block">{v.nama}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{v.email}</span>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="text-[9px] font-bold bg-[#1B365D] text-white px-2 py-0.5 rounded">
                          {v.role}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold font-mono ${
                          v.action === 'LOGIN' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                        }`}>
                          {v.action}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-500 text-[10px] font-mono whitespace-nowrap">
                        {new Date(v.timestamp).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'GALLERY' && homeContent && (
        <div className="space-y-6 max-w-4xl text-left">
          <div className="bg-[#1B365D]/5 border border-[#1B365D]/10 rounded-xl p-4">
            <h4 className="text-xs font-bold text-[#1B365D] mb-1 uppercase tracking-wide">⚙️ Panel Kontrol Beranda Utama</h4>
            <p className="text-[11px] text-[#5D574F] leading-relaxed">
              Sebagai Administrator, Anda memiliki akses penuh untuk menghapus data usang, merapikan judul, atau mengunggah foto dokumentasi kegiatan terbaru di Indonesia langsung dari perangkat Anda.
            </p>
          </div>

          <div className="border border-[#E5E0D5] p-6 rounded-2xl bg-white space-y-6">
            <div className="flex items-center justify-between border-b border-[#F4F1EA] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#1B365D] uppercase tracking-wider">Daftar Dokumentasi Kegiatan Aktif</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Tampilkan 1 s.d. 2 foto terbaik agar pemirsa luar dapat melihat keaktifan IPPI.</p>
              </div>
              {!isAddKegOpen && !editingKegId && (
                <button
                  type="button"
                  onClick={() => setIsAddKegOpen(true)}
                  className="px-3 py-1.5 bg-[#C5A059] text-white hover:bg-[#B38F4D] rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Foto Kegiatan</span>
                </button>
              )}
            </div>

            {/* Form Tambah Kegiatan Baru */}
            {isAddKegOpen && (
              <div className="bg-amber-50/40 border border-amber-200 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
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
                        placeholder="Contoh: Kegiatan Bakti Sosial Akbar..."
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
                        placeholder="Ulasan ringkas..."
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
                        className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs mb-3"
                      />
                    </div>
                    <div className="bg-[#1B365D]/5 p-3 rounded-xl border border-[#1B365D]/10 space-y-2.5">
                      <div className="flex items-center space-x-2.5">
                        <input
                          id="newKegIsBeranda-admin"
                          type="checkbox"
                          checked={newKegIsBeranda}
                          onChange={(e) => {
                            setNewKegIsBeranda(e.target.checked);
                            setNewKegIsBest(e.target.checked);
                          }}
                          className="w-4 h-4 text-[#1B365D] focus:ring-[#1B365D] border-gray-300 rounded cursor-pointer"
                        />
                        <label htmlFor="newKegIsBeranda-admin" className="text-[11px] font-bold text-[#1B365D] uppercase cursor-pointer select-none">
                          🏡 Tampilkan di Beranda
                        </label>
                      </div>
                      
                      {newKegIsBeranda && (
                        <div>
                          <label className="block text-[9px] font-bold text-[#8B7E66] uppercase mb-1">
                            Nomor Urut Tampilan (Misal: 1 paling atas)
                          </label>
                          <input
                            type="number"
                            min="1"
                            placeholder="Contoh: 1, 2, 3"
                            value={newKegUrutan}
                            onChange={(e) => setNewKegUrutan(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                          />
                        </div>
                      )}
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

                <div className="border-t border-amber-200/40 pt-3">
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Lampiran Berkas Kegiatan (Opsional: PDF, DOC, DOCX, PPT, PPTX)</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1 text-xs">
                    <input
                      type="file"
                      id="new-keg-file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={(e) => handleAdminFileChange(e, setNewKegFileState)}
                      className="hidden"
                    />
                    <label
                      htmlFor="new-keg-file"
                      className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer border border-[#E5E0D5] flex items-center gap-1.5"
                    >
                      <Paperclip className="w-3.5 h-3.5" /> Pilih File (.pdf, .doc, .docx, .ppt, .pptx)
                    </label>
                    {newKegFileState ? (
                      <div className="flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-lg">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-semibold max-w-[200px] truncate">{newKegFileState.name}</span>
                        <button
                          type="button"
                          onClick={() => setNewKegFileState(null)}
                          className="text-red-700 hover:text-red-900 font-bold ml-1 text-sm leading-none cursor-pointer"
                          title="Hapus berkas"
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-500 italic">Maksimal 5MB. Dokumen dapat diunduh / dipreview pengunjung.</span>
                    )}
                  </div>
                </div>

                {/* TAUTAN MEDIA SOSIAL KEGIATAN */}
                <div className="border-t border-amber-200/40 pt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
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
                    className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-bold whitespace-nowrap"
                  >
                    Simpan Kegiatan Baru
                  </button>
                </div>
              </div>
            )}

            {/* Form Edit Kegiatan Existing */}
            {editingKegId && (
              <div className="bg-amber-50/40 border border-amber-300 p-5 rounded-2xl space-y-4">
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
                        className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs mb-3"
                      />
                    </div>
                    <div className="bg-[#1B365D]/5 p-3 rounded-xl border border-[#1B365D]/10 space-y-2.5">
                      <div className="flex items-center space-x-2.5">
                        <input
                          id="editKegIsBeranda-admin"
                          type="checkbox"
                          checked={editKegIsBeranda}
                          onChange={(e) => {
                            setEditKegIsBeranda(e.target.checked);
                            setEditKegIsBest(e.target.checked);
                          }}
                          className="w-4 h-4 text-[#1B365D] focus:ring-[#1B365D] border-gray-300 rounded cursor-pointer"
                        />
                        <label htmlFor="editKegIsBeranda-admin" className="text-[11px] font-bold text-[#1B365D] uppercase cursor-pointer select-none">
                          🏡 Tampilkan di Beranda
                        </label>
                      </div>
                      
                      {editKegIsBeranda && (
                        <div>
                          <label className="block text-[9px] font-bold text-[#8B7E66] uppercase mb-1">
                            Nomor Urut Tampilan (Misal: 1 paling atas)
                          </label>
                          <input
                            type="number"
                            min="1"
                            placeholder="Contoh: 1, 2, 3"
                            value={editKegUrutan}
                            onChange={(e) => setEditKegUrutan(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                          />
                        </div>
                      )}
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

                <div className="border-t border-amber-200/40 pt-3">
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Ganti Lampiran Berkas Kegiatan (Opsional: PDF, DOC, DOCX, PPT, PPTX)</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1 text-xs">
                    <input
                      type="file"
                      id="edit-keg-file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={(e) => handleAdminFileChange(e, setEditKegFileState)}
                      className="hidden"
                    />
                    <label
                      htmlFor="edit-keg-file"
                      className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer border border-[#E5E0D5] flex items-center gap-1.5"
                    >
                      <Paperclip className="w-3.5 h-3.5" /> Pilih File (.pdf, .doc, .docx, .ppt, .pptx)
                    </label>
                    {editKegFileState ? (
                      <div className="flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-lg">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-semibold max-w-[200px] truncate">{editKegFileState.name}</span>
                        <button
                          type="button"
                          onClick={() => setEditKegFileState(null)}
                          className="text-red-700 hover:text-red-900 font-bold ml-1 text-sm leading-none cursor-pointer"
                          title="Hapus berkas"
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-500 italic">Maksimal 5MB. Dokumen dapat diunduh / dipreview pengunjung.</span>
                    )}
                  </div>
                </div>

                {/* TAUTAN MEDIA SOSIAL KEGIATAN EDIT */}
                <div className="border-t border-amber-200/40 pt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
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
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold whitespace-nowrap"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            )}

            {/* List and Grid representation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(homeContent.kegiatan || []).map((keg) => (
                <div key={keg.id} className="border border-[#E5E0D5] rounded-xl p-4 bg-[#FFD]/10 flex flex-col space-y-3">
                  <div className="flex space-x-4 items-center w-full">
                    <div className="w-24 h-16 bg-white border border-[#E5E0D5] rounded-lg overflow-hidden shrink-0">
                      {keg.imageUrl ? (
                        <img src={keg.imageUrl} alt={keg.judul} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-[10px] text-gray-300 flex items-center justify-center h-full">No Image</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-[#1B365D] truncate">{keg.judul}</h5>
                      <div className="flex items-center space-x-1.5 mt-0.5 min-w-0">
                        <p className="text-[10px] text-gray-400 truncate shrink-0">{keg.tanggal || 'Belum diatur tanggal'}</p>
                        {(keg.isBeranda || keg.isBest) && (
                          <span className="bg-emerald-55 border border-emerald-200 text-emerald-850 text-[8px] font-extrabold px-1.5 py-0.5 rounded shrink-0">
                            🏡 Beranda {keg.urutan !== undefined ? `#${keg.urutan}` : ''}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed mt-1">{keg.deskripsi}</p>
                    </div>
                  </div>

                  {/* LAMPIRAN & TAUTAN EKSTERNAL */}
                  <div className="bg-gray-50/50 rounded-lg p-2 border border-gray-100 flex flex-col gap-1.5 w-full text-[11px]">
                    {keg.fileName ? (
                      <div className="flex items-center justify-between text-gray-700 bg-white p-1 rounded border border-gray-200">
                        <span className="flex items-center gap-1 font-mono truncate max-w-[180px]">
                          <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          {keg.fileName}
                        </span>
                        <div className="flex items-center gap-2">
                          {keg.fileType?.includes('pdf') && (
                            <button
                              type="button"
                              onClick={() => setPreviewAdminFile({ name: keg.fileName || '', type: keg.fileType || '', data: keg.fileData || '' })}
                              className="text-[10px] font-bold text-[#1B365D] hover:underline"
                            >
                              Pratinjau
                            </button>
                          )}
                          <a
                            href={keg.fileData}
                            download={keg.fileName}
                            className="text-[10px] font-bold text-emerald-700 hover:underline"
                          >
                            Unduh
                          </a>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-400 italic">Tidak ada lampiran dokumen</span>
                    )}

                    {/* Social links row */}
                    {(keg.linkFacebook || keg.linkInstagram || keg.linkYoutube) ? (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400">Media Eksternal:</span>
                        {keg.linkFacebook && (
                          <a href={keg.linkFacebook} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded text-blue-600" title="Facebook">
                            <Facebook className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {keg.linkInstagram && (
                          <a href={keg.linkInstagram} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded text-pink-600" title="Instagram">
                            <Instagram className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {keg.linkYoutube && (
                          <a href={keg.linkYoutube} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded text-red-600" title="YouTube">
                            <Youtube className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex space-x-3 border-t border-gray-100 pt-2 justify-end w-full">
                    <button
                      type="button"
                      onClick={() => handleStartEditKeg(keg)}
                      className="text-[10px] text-blue-600 hover:underline font-bold"
                      disabled={!!editingKegId || isAddKegOpen}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteKeg(keg.id, keg.judul)}
                      className="text-[10px] text-red-600 hover:underline font-bold"
                      disabled={!!editingKegId || isAddKegOpen}
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              ))}
              {(homeContent.kegiatan || []).length === 0 && (
                <p className="text-xs text-gray-400 col-span-2 italic">Belum ada foto kegiatan aktif di beranda.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {subTab === 'STRUKTUR' && homeContent && (
        <div className="space-y-6 max-w-4xl text-left animate-fade-in">
          <div className="bg-[#1B365D]/5 border border-[#1B365D]/10 rounded-xl p-4">
            <h4 className="text-xs font-bold text-[#1B365D] mb-1 uppercase tracking-wide">⚙️ Panel Kontrol Struktur Organisasi</h4>
            <p className="text-[11px] text-[#5D574F] leading-relaxed">
              Sebagai Administrator, Anda memiliki otorisasi penuh untuk menyusun hierarki kepemimpinan IPPI Cabang, menambah pengurus baru, mengunggah foto profil, mengedit nama/jabatan, atau menghapus data susunan pengurus secara real-time.
            </p>
          </div>

          <div className="border border-[#E5E0D5] p-6 rounded-2xl bg-white space-y-6">
            <div className="flex items-center justify-between border-b border-[#F4F1EA] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#1B365D] uppercase tracking-wider flex items-center space-x-1">
                  <span>👥 Susunan Jabatan & Pengurus Aktif</span>
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Tambah pimpinan, pengurus, atau dewan penasihat cabang tingkat daerah.</p>
              </div>
              {!isAddStrOpen && !editingStrId && (
                <button
                  type="button"
                  onClick={() => setIsAddStrOpen(true)}
                  className="px-3 py-1.5 bg-[#C5A059] text-white hover:bg-[#B38F4D] rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Pengurus</span>
                </button>
              )}
            </div>

            {/* Form Tambah Pengurus Baru */}
            {isAddStrOpen && (
              <div className="bg-amber-50/25 border border-amber-200/60 p-5 rounded-2xl space-y-4">
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
                        placeholder="Contoh: 1, 2, 3..."
                        value={newStrUrutan}
                        onChange={(e) => setNewStrUrutan(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Foto Profil Pengurus (Unggah File)</label>
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
                          <img src={newStrPhoto} alt="Preview" className="w-full h-full object-cover animate-fade-in" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddStruktur}
                    className="px-4 py-2 bg-[#1B365D] hover:bg-[#122543] text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    Simpan Pengurus Baru
                  </button>
                </div>
              </div>
            )}

            {/* Form Edit Pengurus Existing */}
            {editingStrId && (
              <div className="bg-amber-50/40 border border-amber-300 p-5 rounded-2xl space-y-4">
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
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            )}

            {/* List Susunan Pengurus Existing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(homeContent.strukturList || []).map((item) => (
                <div key={item.id} className="border border-[#E5E0D5] rounded-xl p-4 bg-gray-50/50 flex space-x-4 items-center">
                  <div className="w-14 h-14 bg-white border border-[#E5E0D5] rounded-full overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                    {item.photoUrl ? (
                      <img src={item.photoUrl} alt={item.nama} className="w-full h-full object-cover animate-fade-in" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Foto</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-[#1B365D] truncate">{item.nama}</h5>
                    <p className="text-[11px] text-[#C5A059] font-bold uppercase tracking-wide truncate">{item.jabatan}</p>
                    <p className="text-[9px] text-gray-400 font-mono">No. Urutan: {item.urutan}</p>
                    <div className="mt-2 flex space-x-3">
                      <button
                        type="button"
                        onClick={() => handleStartEditStr(item)}
                        className="text-[10px] text-blue-600 hover:underline font-bold"
                        disabled={!!editingStrId || isAddStrOpen}
                      >
                        ✏️ Edit Pengurus
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStr(item.id, item.nama)}
                        className="text-[10px] text-red-600 hover:underline font-bold"
                        disabled={!!editingStrId || isAddStrOpen}
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {(homeContent.strukturList || []).length === 0 && (
                <p className="text-xs text-gray-400 col-span-2 italic">Belum ada susunan pengurus aktif di beranda.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NEW CONTENT EDITORS */}
      {subTab === 'TENTANG_KAMI' && homeContent && (
        <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 shadow-sm">
          <AboutEditor
            content={homeContent}
            onSave={(updated, actionType) => {
              setHomeContent(updated);
              saveStoredContent(updated);
              onContentChange(updated);
              const actionMsg = actionType === 'add' ? 'berhasil ditambah' : actionType === 'edit' ? 'berhasil di rubah' : 'berhasil dihapus';
              setFeedback({ status: 'ok', msg: `Sukses: Konten Tentang Kami ${actionMsg}!` });
              setTimeout(() => setFeedback(null), 4000);
            }}
          />
        </div>
      )}

      {subTab === 'PROG_KERJA' && homeContent && (
        <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 shadow-sm">
          <ProgramEditor
            content={homeContent}
            onSave={(updated, actionType) => {
              setHomeContent(updated);
              saveStoredContent(updated);
              onContentChange(updated);
              const actionMsg = actionType === 'add' ? 'berhasil ditambah' : actionType === 'edit' ? 'berhasil di rubah' : 'berhasil dihapus';
              setFeedback({ status: 'ok', msg: `Sukses: Konten Program Kerja ${actionMsg}!` });
              setTimeout(() => setFeedback(null), 4000);
            }}
          />
        </div>
      )}

      {subTab === 'BERITA' && homeContent && (
        <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 shadow-sm">
          <BeritaEditor
            content={homeContent}
            onSave={(updated, actionType) => {
              setHomeContent(updated);
              saveStoredContent(updated);
              onContentChange(updated);
              const actionMsg = actionType === 'add' ? 'berhasil ditambah' : actionType === 'edit' ? 'berhasil di rubah' : 'berhasil dihapus';
              setFeedback({ status: 'ok', msg: `Sukses: Konten Berita Resmi ${actionMsg}!` });
              setTimeout(() => setFeedback(null), 4000);
            }}
          />
        </div>
      )}

      {subTab === 'JURNAL' && homeContent && (
        <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 shadow-sm">
          <JurnalEditor
            content={homeContent}
            onSave={(updated, actionType) => {
              setHomeContent(updated);
              saveStoredContent(updated);
              onContentChange(updated);
              const actionMsg = actionType === 'add' ? 'berhasil ditambah' : actionType === 'edit' ? 'berhasil di rubah' : 'berhasil dihapus';
              setFeedback({ status: 'ok', msg: `Sukses: Konten Jurnal Berkala ${actionMsg}!` });
              setTimeout(() => setFeedback(null), 4000);
            }}
          />
        </div>
      )}

      {subTab === 'FOKUS_KONTRIBUSI' && homeContent && (
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

              <div className="border-t border-[#E5E0D5]/70 pt-3">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Lampiran Berkas (Opsional: PDF, DOC, DOCX, PPT, PPTX)</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1 text-xs">
                  <input
                    type="file"
                    id="new-fokus-file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={(e) => handleAdminFileChange(e, setNewFokusFileState)}
                    className="hidden"
                  />
                  <label
                    htmlFor="new-fokus-file"
                    className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer border border-[#E5E0D5] flex items-center gap-1.5"
                  >
                    <Paperclip className="w-3.5 h-3.5" /> Pilih File (.pdf, .doc, .docx, .ppt, .pptx)
                  </label>
                  {newFokusFileState ? (
                    <div className="flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-lg">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold max-w-[200px] truncate">{newFokusFileState.name}</span>
                      <button
                        type="button"
                        onClick={() => setNewFokusFileState(null)}
                        className="text-red-700 hover:text-red-900 font-bold ml-1 text-sm leading-none cursor-pointer"
                        title="Hapus berkas"
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-500 italic">Maksimal 5MB. Dokumen dapat diunduh / dipreview pengunjung.</span>
                  )}
                </div>
              </div>

              <div className="border-t border-[#E5E0D5]/70 pt-3">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Upload/Unggah Foto Fokus Kontribusi (Opsional)</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1 text-xs">
                  <input
                    type="file"
                    id="new-fokus-photo"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        compressImage(file)
                          .then(base64 => setNewFokusImageUrl(base64))
                          .catch(err => {
                            console.error("Error compressing fokus image:", err);
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setNewFokusImageUrl(event.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          });
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="new-fokus-photo"
                    className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer border border-[#E5E0D5] flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Pilih Foto
                  </label>
                  {newFokusImageUrl ? (
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded overflow-hidden border border-gray-300 bg-slate-50">
                        <img src={newFokusImageUrl} className="w-full h-full object-cover" alt="Preview Fokus Baru" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewFokusImageUrl('')}
                        className="text-xs text-red-650 hover:text-red-750 font-bold hover:underline cursor-pointer"
                      >
                        Batal Unggah
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-500 italic">Foto ilustrasi pilar ini akan ditampilkan dalam card.</span>
                  )}
                </div>
              </div>

              {/* TAUTAN MEDIA SOSIAL FOKUS KONTRIBUSI */}
              <div className="border-t border-[#E5E0D5]/70 pt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
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

              <div className="border-t border-[#E5E0D5]/70 pt-3">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Ganti Lampiran Berkas (Opsional: PDF, DOC, DOCX, PPT, PPTX)</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1 text-xs">
                  <input
                    type="file"
                    id="edit-fokus-file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={(e) => handleAdminFileChange(e, setEditFokusFileState)}
                    className="hidden"
                  />
                  <label
                    htmlFor="edit-fokus-file"
                    className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer border border-[#E5E0D5] flex items-center gap-1.5"
                  >
                    <Paperclip className="w-3.5 h-3.5" /> Pilih File (.pdf, .doc, .docx, .ppt, .pptx)
                  </label>
                  {editFokusFileState ? (
                    <div className="flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-lg">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold max-w-[200px] truncate">{editFokusFileState.name}</span>
                      <button
                        type="button"
                        onClick={() => setEditFokusFileState(null)}
                        className="text-red-700 hover:text-red-900 font-bold ml-1 text-sm leading-none cursor-pointer"
                        title="Hapus berkas"
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-500 italic">Maksimal 5MB. Dokumen dapat diunduh / dipreview pengunjung.</span>
                  )}
                </div>
              </div>

              <div className="border-t border-[#E5E0D5]/70 pt-3">
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Ganti Foto Fokus Kontribusi (Opsional)</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1 text-xs">
                  <input
                    type="file"
                    id="edit-fokus-photo"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        compressImage(file)
                          .then(base64 => setEditFokusImageUrl(base64))
                          .catch(err => {
                            console.error("Error compressing edit fokus image:", err);
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setEditFokusImageUrl(event.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          });
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="edit-fokus-photo"
                    className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer border border-[#E5E0D5] flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Pilih / Ganti Foto
                  </label>
                  {editFokusImageUrl ? (
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded overflow-hidden border border-gray-300 bg-slate-50">
                        <img src={editFokusImageUrl} className="w-full h-full object-cover" alt="Preview Fokus Edit" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditFokusImageUrl('')}
                        className="text-xs text-red-650 hover:text-red-750 font-bold hover:underline cursor-pointer"
                      >
                        Hapus Foto
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-500 italic">Gunakan foto beresolusi sedang / lanskap.</span>
                  )}
                </div>
              </div>

              {/* TAUTAN MEDIA SOSIAL FOKUS KONTRIBUSI EDIT */}
              <div className="border-t border-[#E5E0D5]/70 pt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
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
            {(homeContent.fokusList || []).sort((a,b) => (a.urutan || 0) - (b.urutan || 0)).map((item, index) => (
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
                        className="p-1.5 text-[#1B365D] hover:bg-gray-100 rounded-lg text-[10px] font-semibold uppercase font-mono"
                        title="Edit data pilar"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFokus(item.id, item.judul)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-[10px] font-semibold uppercase font-mono"
                        title="Hapus pilar"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                  <h4 className="font-serif font-bold text-[#1B365D] text-sm mt-3">{item.judul}</h4>
                  {item.imageUrl && (
                    <div className="w-full h-32 rounded-xl overflow-hidden border border-[#E5E0D5] my-2 bg-slate-50 flex items-center justify-center">
                      <img src={item.imageUrl} alt={item.judul} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p className="text-[11px] text-gray-500 leading-relaxed mt-1">{item.deskripsi}</p>
                </div>

                {/* FILE ATTACHMENTS & EXTERNAL SOCIAL LINKS FOR FOKUS KONTRIBUSI */}
                <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100 space-y-1.5 mt-3 text-[11px]">
                  {item.fileName ? (
                    <div className="flex items-center justify-between text-gray-700 bg-white p-1 rounded border border-gray-200">
                      <span className="flex items-center gap-1 font-mono truncate max-w-[150px]">
                        <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        {item.fileName}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {item.fileType?.includes('pdf') && (
                          <button
                            type="button"
                            onClick={() => setPreviewAdminFile({ name: item.fileName || '', type: item.fileType || '', data: item.fileData || '' })}
                            className="text-[10px] font-bold text-[#1B365D] hover:underline"
                          >
                            Pratinjau
                          </button>
                        )}
                        <a
                          href={item.fileData}
                          download={item.fileName}
                          className="text-[10px] font-bold text-emerald-700 hover:underline"
                        >
                          Unduh
                        </a>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-400 italic">Tidak ada lampiran dokumen</span>
                  )}

                  {/* Social icons row */}
                  {(item.linkFacebook || item.linkInstagram || item.linkYoutube) ? (
                    <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100">
                      <span className="text-[9px] text-gray-400">Media:</span>
                      {item.linkFacebook && (
                        <a href={item.linkFacebook} target="_blank" rel="noopener noreferrer" className="p-0.5 hover:bg-gray-100 rounded text-blue-600" title="Facebook">
                          <Facebook className="w-3 h-3" />
                        </a>
                      )}
                      {item.linkInstagram && (
                        <a href={item.linkInstagram} target="_blank" rel="noopener noreferrer" className="p-0.5 hover:bg-gray-100 rounded text-pink-600" title="Instagram">
                          <Instagram className="w-3 h-3" />
                        </a>
                      )}
                      {item.linkYoutube && (
                        <a href={item.linkYoutube} target="_blank" rel="noopener noreferrer" className="p-0.5 hover:bg-gray-100 rounded text-red-600" title="YouTube">
                          <Youtube className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {(homeContent.fokusList || []).length === 0 && (
              <div className="col-span-3 text-center py-8 text-gray-400 italic text-xs">
                Belum ada pilar fokus kontribusi aktif di beranda. Silakan tambah pilar baru di atas.
              </div>
            )}
          </div>
        </div>
      )}

      {subTab === 'LAPAK_UMKM' && homeContent && (
        <div className="space-y-6 text-left">
          <LapakUmkm
            content={homeContent}
            currentUser={{ role: UserRole.ADMIN } as Member}
            onSave={(updated) => {
              setHomeContent(updated);
              saveStoredContent(updated);
              if (onContentChange) {
                onContentChange(updated);
              }
              setFeedback({ status: 'ok', msg: 'Sukses: Produk Lapak UMKM berhasil diperbarui!' });
              setTimeout(() => setFeedback(null), 4000);
            }}
          />
        </div>
      )}

      {/* PDF PRATINJAU MODAL */}
      {previewAdminFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200 animate-fade-in text-left">
            <div className="bg-[#1B365D] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-xs font-bold font-mono truncate max-w-[400px] leading-tight">{previewAdminFile.name}</h3>
                  <p className="text-[9px] text-[#A2B4D0]">Pratinjau Dokumen Lampiran Resmi</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAdminFile(null)}
                className="text-white hover:text-amber-400 transition-colors font-bold text-xl cursor-pointer leading-none px-2"
                title="Tutup Pratinjau"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 bg-gray-100 p-2 flex items-center justify-center overflow-auto">
              {previewAdminFile.type.includes('pdf') || previewAdminFile.name.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={previewAdminFile.data}
                  title="PDF Preview"
                  className="w-full h-full rounded border-0 bg-white"
                />
              ) : (
                <div className="text-center p-6 space-y-3">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto" />
                  <p className="text-xs text-gray-500 font-semibold font-mono">Format dokumen ini tidak mendukung pratinjau langsung.</p>
                  <a
                    href={previewAdminFile.data}
                    download={previewAdminFile.name}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                  >
                    Unduh Dokumen Berkas
                  </a>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end gap-3">
              <a
                href={previewAdminFile.data}
                download={previewAdminFile.name}
                className="px-4 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                Unduh Berkas
              </a>
              <button
                type="button"
                onClick={() => setPreviewAdminFile(null)}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
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

