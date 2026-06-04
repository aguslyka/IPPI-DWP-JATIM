import React, { useState } from 'react';
import { HomepageContent, ProgramItem } from '../../types';
import { Plus, Trash2, Edit2, Save, X, Paperclip, Download, Eye, FileText, Facebook, Instagram, Youtube, Link } from 'lucide-react';

interface ProgramEditorProps {
  content: HomepageContent;
  onSave: (updated: HomepageContent, actionType?: 'add' | 'edit' | 'delete') => void;
}

export default function ProgramEditor({ content, onSave }: ProgramEditorProps) {
  const [items, setItems] = useState<ProgramItem[]>(content.programList || []);

  // Sync state with parent content when it changes (reactive sync)
  React.useEffect(() => {
    setItems(content.programList || []);
  }, [content.programList]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newKategori, setNewKategori] = useState('');
  const [newJudul, setNewJudul] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIsHighlighted, setNewIsHighlighted] = useState(false);
  const [newUrutan, setNewUrutan] = useState<number | ''>('');
  const [newFileState, setNewFileState] = useState<{ name: string; type: string; data: string } | null>(null);
  const [newLinkFacebook, setNewLinkFacebook] = useState('');
  const [newLinkInstagram, setNewLinkInstagram] = useState('');
  const [newLinkYoutube, setNewLinkYoutube] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editKategori, setEditKategori] = useState('');
  const [editJudul, setEditJudul] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editIsHighlighted, setEditIsHighlighted] = useState(false);
  const [editUrutan, setEditUrutan] = useState<number | ''>('');
  const [editFileState, setEditFileState] = useState<{ name: string; type: string; data: string } | null>(null);
  const [editLinkFacebook, setEditLinkFacebook] = useState('');
  const [editLinkInstagram, setEditLinkInstagram] = useState('');
  const [editLinkYoutube, setEditLinkYoutube] = useState('');

  const [previewFile, setPreviewFile] = useState<{ name: string; type: string; data: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 5MB to ensure database stability with Firestore/LocalStorage
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran berkas maksimal adalah 5MB untuk kestabilan penyimpanan database.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      if (isEdit) {
        setEditFileState({
          name: file.name,
          type: file.type,
          data: base64Data
        });
      } else {
        setNewFileState({
          name: file.name,
          type: file.type,
          data: base64Data
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const clearFile = (isEdit: boolean) => {
    if (isEdit) {
      setEditFileState(null);
    } else {
      setNewFileState(null);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJudul.trim() || !newKategori.trim()) return;

    const newItem: ProgramItem = {
      id: `pr_${Date.now()}`,
      kategori: newKategori.trim(),
      judul: newJudul.trim(),
      deskripsi: newDesc.trim(),
      isHighlighted: newIsHighlighted,
      urutan: Number(newUrutan) || (items.length + 1),
      fileName: newFileState?.name,
      fileType: newFileState?.type,
      fileData: newFileState?.data,
      linkFacebook: newLinkFacebook.trim() || undefined,
      linkInstagram: newLinkInstagram.trim() || undefined,
      linkYoutube: newLinkYoutube.trim() || undefined
    };

    const updatedList = [...items, newItem].sort((a, b) => a.urutan - b.urutan);
    setItems(updatedList);
    // berhasil ditambah
    onSave({ ...content, programList: updatedList }, 'add');

    // Reset Form
    setNewKategori('');
    setNewJudul('');
    setNewDesc('');
    setNewIsHighlighted(false);
    setNewUrutan('');
    setNewFileState(null);
    setNewLinkFacebook('');
    setNewLinkInstagram('');
    setNewLinkYoutube('');
    setIsAddOpen(false);
  };

  const handleStartEdit = (item: ProgramItem) => {
    setEditingId(item.id);
    setEditKategori(item.kategori);
    setEditJudul(item.judul);
    setEditDesc(item.deskripsi);
    setEditIsHighlighted(item.isHighlighted || false);
    setEditUrutan(item.urutan);
    setEditLinkFacebook(item.linkFacebook || '');
    setEditLinkInstagram(item.linkInstagram || '');
    setEditLinkYoutube(item.linkYoutube || '');
    if (item.fileName && item.fileData) {
      setEditFileState({
        name: item.fileName,
        type: item.fileType || '',
        data: item.fileData
      });
    } else {
      setEditFileState(null);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editJudul.trim() || !editKategori.trim()) return;

    const updatedList = items.map(item => {
      if (item.id === editingId) {
        return {
          ...item,
          kategori: editKategori.trim(),
          judul: editJudul.trim(),
          deskripsi: editDesc.trim(),
          isHighlighted: editIsHighlighted,
          urutan: Number(editUrutan) || 0,
          fileName: editFileState?.name,
          fileType: editFileState?.type,
          fileData: editFileState?.data,
          linkFacebook: editLinkFacebook.trim() || undefined,
          linkInstagram: editLinkInstagram.trim() || undefined,
          linkYoutube: editLinkYoutube.trim() || undefined
        };
      }
      return item;
    }).sort((a, b) => a.urutan - b.urutan);

    setItems(updatedList);
    // berhasil di rubah
    onSave({ ...content, programList: updatedList }, 'edit');
    setEditingId(null);
    setEditFileState(null);
    setEditLinkFacebook('');
    setEditLinkInstagram('');
    setEditLinkYoutube('');
  };

  const handleDelete = (id: string, judul: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus agenda/program kerja: "${judul}"?`)) {
      const updatedList = items.filter(item => item.id !== id);
      setItems(updatedList);
      onSave({ ...content, programList: updatedList }, 'delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-[#1B365D] uppercase tracking-wider">📋 Pengelola Program Kerja Unggulan</h3>
          <p className="text-[10px] text-gray-500 mt-0.5">Tambah, ubah, dan hapus agenda rencana strategis nasional &amp; kesejahteraan anggota IPPI.</p>
        </div>
        {!isAddOpen && !editingId && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#C5A059] hover:bg-[#B38F4D] text-white rounded-lg text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Program Kerja</span>
          </button>
        )}
      </div>

      {/* FORM: ADD NEW */}
      {isAddOpen && (
        <form onSubmit={handleAdd} className="bg-amber-50/40 border border-amber-200/50 p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/40 pb-2">
            <h4 className="text-xs font-bold text-[#1B365D] uppercase">Tambah Program Kerja Baru</h4>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="text-xs text-gray-400 hover:text-gray-600 font-bold"
            >
              Batal
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Kategori Program *</label>
              <input
                type="text"
                value={newKategori}
                onChange={(e) => setNewKategori(e.target.value)}
                placeholder="Contoh: Sosial & Welfare, Agenda Nasional, Edukasi..."
                className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Judul Program Kerja *</label>
              <input
                type="text"
                value={newJudul}
                onChange={(e) => setNewJudul(e.target.value)}
                placeholder="Contoh: Tabungan Sehat Keluarga"
                className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Nomor Urutan Tampilan</label>
              <input
                type="number"
                value={newUrutan}
                onChange={(e) => setNewUrutan(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Contoh: 1, 2, 3..."
                className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
              />
            </div>
            <div className="flex items-center text-xs pt-6">
              <label className="flex items-center space-x-2 font-bold text-gray-750 uppercase cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newIsHighlighted}
                  onChange={(e) => setNewIsHighlighted(e.target.checked)}
                  className="rounded border-gray-300 text-[#1B365D] focus:ring-[#1B365D]"
                />
                <span>Jadikan Berwarna Gelap (Highlight Accent Card)</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Ulasan / Deskripsi Program Kerja *</label>
              <textarea
                rows={3}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Masukkan ringkasan lengkap cara operasional dan keuntungan program ini..."
                className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>
            <div className="md:col-span-2 border-t border-gray-100 pt-3">
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Lampiran Berkas / Dokumen (Opsional: PDF, DOC, DOCX, PPT, PPTX)</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1.5">
                <input
                  type="file"
                  id="new-program-file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => handleFileChange(e, false)}
                  className="hidden"
                />
                <label
                  htmlFor="new-program-file"
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer border border-gray-300 flex items-center gap-1.5"
                >
                  <Paperclip className="w-3.5 h-3.5" /> Pilih File (.pdf, .doc, .docx, .ppt, .pptx)
                </label>
                {newFileState ? (
                  <div className="flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-lg">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold max-w-[200px] truncate">{newFileState.name}</span>
                    <button
                      type="button"
                      onClick={() => clearFile(false)}
                      className="text-red-750 hover:text-red-800 font-bold ml-1 text-sm leading-none"
                      title="Hapus berkas"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-500 italic">Maksimal 5MB. Dokumen ini dapat diunduh atau dipreview langsung oleh anggota.</span>
                )}
              </div>
            </div>
            
            {/* TAUTAN MEDIA SOSIAL */}
            <div className="md:col-span-2 border-t border-gray-100 pt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  <span className="flex items-center gap-1"><Facebook className="w-3.5 h-3.5 text-blue-600" /> Link Facebook (Opsional)</span>
                </label>
                <input
                  type="url"
                  value={newLinkFacebook}
                  onChange={(e) => setNewLinkFacebook(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full bg-white border border-[#E5E0D5] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  <span className="flex items-center gap-1"><Instagram className="w-3.5 h-3.5 text-pink-600" /> Link Instagram (Opsional)</span>
                </label>
                <input
                  type="url"
                  value={newLinkInstagram}
                  onChange={(e) => setNewLinkInstagram(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-white border border-[#E5E0D5] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  <span className="flex items-center gap-1"><Youtube className="w-3.5 h-3.5 text-red-600" /> Link YouTube (Opsional)</span>
                </label>
                <input
                  type="url"
                  value={newLinkYoutube}
                  onChange={(e) => setNewLinkYoutube(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-white border border-[#E5E0D5] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              Simpan Program Baru
            </button>
          </div>
        </form>
      )}

      {/* FORM: EDIT */}
      {editingId && (
        <form onSubmit={handleSaveEdit} className="bg-blue-50/40 border border-blue-200 p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-blue-200 pb-2">
            <h4 className="text-xs font-bold text-[#1B365D] uppercase">✏️ Edit Program Kerja</h4>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="text-xs text-gray-500 hover:text-gray-700 font-bold"
            >
              Batal
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Kategori Program *</label>
              <input
                type="text"
                value={editKategori}
                onChange={(e) => setEditKategori(e.target.value)}
                className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Judul Program Kerja *</label>
              <input
                type="text"
                value={editJudul}
                onChange={(e) => setEditJudul(e.target.value)}
                className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Nomor Urutan Tampilan</label>
              <input
                type="number"
                value={editUrutan}
                onChange={(e) => setEditUrutan(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
              />
            </div>
            <div className="flex items-center text-xs pt-6">
              <label className="flex items-center space-x-2 font-bold text-gray-700 uppercase cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={editIsHighlighted}
                  onChange={(e) => setEditIsHighlighted(e.target.checked)}
                  className="rounded border-gray-300 text-[#1B365D] focus:ring-[#1B365D]"
                />
                <span>Jadikan Berwarna Gelap (Highlight Accent Card)</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Ulasan / Deskripsi Program Kerja *</label>
              <textarea
                rows={3}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>
            <div className="md:col-span-2 border-t border-gray-100 pt-3">
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Lampiran Berkas / Dokumen (Opsional: PDF, DOC, DOCX, PPT, PPTX)</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1.5">
                <input
                  type="file"
                  id="edit-program-file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => handleFileChange(e, true)}
                  className="hidden"
                />
                <label
                  htmlFor="edit-program-file"
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer border border-gray-300 flex items-center gap-1.5"
                >
                  <Paperclip className="w-3.5 h-3.5" /> Pilih File (.pdf, .doc, .docx, .ppt, .pptx)
                </label>
                {editFileState ? (
                  <div className="flex items-center gap-2 text-xs bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1 rounded-lg">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-semibold max-w-[200px] truncate">{editFileState.name}</span>
                    <button
                      type="button"
                      onClick={() => clearFile(true)}
                      className="text-red-750 hover:text-red-800 font-bold ml-1 text-sm leading-none"
                      title="Hapus berkas"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-500 italic">Maksimal 5MB. Dokumen ini dapat diunduh atau dipreview langsung oleh anggota.</span>
                )}
              </div>
            </div>

            {/* TAUTAN MEDIA SOSIAL EDIT */}
            <div className="md:col-span-2 border-t border-gray-100 pt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  <span className="flex items-center gap-1"><Facebook className="w-3.5 h-3.5 text-blue-600" /> Link Facebook (Opsional)</span>
                </label>
                <input
                  type="url"
                  value={editLinkFacebook}
                  onChange={(e) => setEditLinkFacebook(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full bg-white border border-blue-250 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  <span className="flex items-center gap-1"><Instagram className="w-3.5 h-3.5 text-pink-600" /> Link Instagram (Opsional)</span>
                </label>
                <input
                  type="url"
                  value={editLinkInstagram}
                  onChange={(e) => setEditLinkInstagram(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-white border border-blue-250 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                  <span className="flex items-center gap-1"><Youtube className="w-3.5 h-3.5 text-red-600" /> Link YouTube (Opsional)</span>
                </label>
                <input
                  type="url"
                  value={editLinkYoutube}
                  onChange={(e) => setEditLinkYoutube(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-white border border-blue-250 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D]"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      )}

      {/* ITEMS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`border rounded-xl p-4 flex flex-col justify-between ${
              item.isHighlighted
                ? 'bg-[#1B365D] text-white border-[#1B365D]'
                : 'bg-gray-50/50 text-gray-800 border-[#E5E0D5]'
            }`}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-extrabold ${
                  item.isHighlighted ? 'bg-white/15 text-[#C5A059]' : 'bg-[#1B365D]/10 text-[#C5A059]'
                }`}>
                  {item.kategori}
                </span>
                <span className={`text-[10px] font-mono font-bold ${item.isHighlighted ? 'text-slate-350' : 'text-gray-400'}`}>
                  No: {item.urutan}
                </span>
              </div>
              <h4 className={`text-sm font-serif font-bold ${item.isHighlighted ? 'text-[#C5A059]' : 'text-[#1B365D]'}`}>
                {item.judul}
              </h4>
              <p className={`text-xs leading-relaxed ${item.isHighlighted ? 'text-slate-300' : 'text-gray-600'}`}>
                {item.deskripsi}
              </p>
              
              {item.fileName && item.fileData && (
                <div className={`mt-3 flex items-center justify-between p-2 rounded-lg text-xs ${
                  item.isHighlighted ? 'bg-white/10 text-slate-100' : 'bg-gray-100 border border-gray-200 text-gray-700'
                }`}>
                  <div className="flex items-center gap-1.5 min-w-0 pr-2">
                    <FileText className="w-3.5 h-3.5 shrink-0 text-[#C5A059]" />
                    <span className="font-medium truncate text-[11px]" title={item.fileName}>{item.fileName}</span>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {item.fileType?.includes('pdf') && (
                      <button
                        type="button"
                        onClick={() => setPreviewFile({ name: item.fileName!, type: item.fileType!, data: item.fileData! })}
                        className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-0.5 hover:opacity-85 cursor-pointer ${
                          item.isHighlighted ? 'text-[#C5A059] bg-white/10' : 'text-blue-700 bg-blue-50 border border-blue-200'
                        }`}
                      >
                        <Eye className="w-3 h-3" /> Lihat
                      </button>
                    )}
                    <a
                      href={item.fileData}
                      download={item.fileName}
                      className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-0.5 hover:opacity-85 cursor-pointer ${
                        item.isHighlighted ? 'text-white bg-[#C5A059]' : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                      }`}
                    >
                      <Download className="w-3 h-3" /> Unduh
                    </a>
                  </div>
                </div>
              )}

              {/* Media & Social Links */}
              {(item.linkFacebook || item.linkInstagram || item.linkYoutube) && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 pt-1 select-none">
                  {item.linkFacebook && (
                    <a
                      href={item.linkFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 hover:opacity-85 cursor-pointer transition-opacity ${
                        item.isHighlighted ? 'bg-blue-600/25 text-blue-200 border border-blue-500/30' : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      <Facebook className="w-3 h-3" /> Facebook
                    </a>
                  )}
                  {item.linkInstagram && (
                    <a
                      href={item.linkInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 hover:opacity-85 cursor-pointer transition-opacity ${
                        item.isHighlighted ? 'bg-pink-600/25 text-pink-200 border border-pink-500/30' : 'bg-pink-50 text-pink-800 border border-pink-200'
                      }`}
                    >
                      <Instagram className="w-3 h-3" /> Instagram
                    </a>
                  )}
                  {item.linkYoutube && (
                    <a
                      href={item.linkYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 hover:opacity-85 cursor-pointer transition-opacity ${
                        item.isHighlighted ? 'bg-red-600/25 text-red-200 border border-red-500/30' : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      <Youtube className="w-3 h-3" /> YouTube
                    </a>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4 border-t mt-3 border-gray-200/20">
              <button
                onClick={() => handleStartEdit(item)}
                className={`p-1 text-xs font-semibold rounded hover:bg-gray-50/15 ${
                  item.isHighlighted ? 'text-[#C5A059] border border-[#C5A059]/40' : 'text-blue-600 border border-blue-200 bg-white'
                } cursor-pointer`}
                title="Edit agenda ini"
                disabled={!!editingId || isAddOpen}
              >
                <Edit2 className="w-3.5 h-3.5 inline-block" />
              </button>
              <button
                onClick={() => handleDelete(item.id, item.judul)}
                className={`p-1 text-xs font-semibold rounded hover:bg-gray-50/15 ${
                  item.isHighlighted ? 'text-rose-450 border border-rose-350/40' : 'text-red-650 border border-red-200 bg-white'
                } cursor-pointer`}
                title="Hapus agenda ini"
                disabled={!!editingId || isAddOpen}
              >
                <Trash2 className="w-3.5 h-3.5 inline-block" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-6 text-gray-400 italic text-xs col-span-2">Belum ada Program Kerja terdaftar.</div>
        )}
      </div>

      {/* PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-4xl w-full flex flex-col max-h-[90vh] shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1B365D]" />
                <h4 className="font-bold text-sm text-[#1B365D] uppercase tracking-wide truncate max-w-[300px] md:max-w-[500px]">
                  Pratinjau: {previewFile.name}
                </h4>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 bg-gray-100 p-4 overflow-auto min-h-[500px] flex items-center justify-center">
              {previewFile.type.includes('pdf') || previewFile.data.startsWith('data:application/pdf') ? (
                <iframe
                  src={previewFile.data}
                  title={previewFile.name}
                  className="w-full h-[65vh] rounded-lg border shadow-sm"
                />
              ) : (
                <div className="text-center space-y-3 bg-white p-6 rounded-xl border max-w-md shadow-sm">
                  <FileText className="w-12 h-12 text-[#1B365D] mx-auto" />
                  <p className="text-sm font-semibold text-gray-800 font-serif">Pratinjau tidak didukung langsung di peramban</p>
                  <p className="text-xs text-gray-500">Berkas format ini harus diunduh terlebih dahulu untuk dapat dibuka / dibaca.</p>
                  <a
                    href={previewFile.data}
                    download={previewFile.name}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1B365D] hover:bg-[#1B365D]/90 text-white rounded-lg text-xs font-bold"
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
