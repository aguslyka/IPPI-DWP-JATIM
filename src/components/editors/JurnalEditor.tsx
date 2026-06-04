import React, { useState } from 'react';
import { HomepageContent, JurnalItem } from '../../types';
import { Plus, Trash2, Edit2, Save, X, Paperclip, Download, Eye, FileText, Facebook, Instagram, Youtube } from 'lucide-react';

interface JurnalEditorProps {
  content: HomepageContent;
  onSave: (updated: HomepageContent) => void;
}

export default function JurnalEditor({ content, onSave }: JurnalEditorProps) {
  const [items, setItems] = useState<JurnalItem[]>(content.jurnalList || []);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newJudul, setNewJudul] = useState('');
  const [newTanggalPublikasi, setNewTanggalPublikasi] = useState('');
  const [newSubjek, setNewSubjek] = useState('');
  const [newAbstrak, setNewAbstrak] = useState('');
  const [newFileState, setNewFileState] = useState<{ name: string; type: string; data: string } | null>(null);
  const [newLinkFacebook, setNewLinkFacebook] = useState('');
  const [newLinkInstagram, setNewLinkInstagram] = useState('');
  const [newLinkYoutube, setNewLinkYoutube] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editJudul, setEditJudul] = useState('');
  const [editTanggalPublikasi, setEditTanggalPublikasi] = useState('');
  const [editSubjek, setEditSubjek] = useState('');
  const [editAbstrak, setEditAbstrak] = useState('');
  const [editFileState, setEditFileState] = useState<{ name: string; type: string; data: string } | null>(null);
  const [editLinkFacebook, setEditLinkFacebook] = useState('');
  const [editLinkInstagram, setEditLinkInstagram] = useState('');
  const [editLinkYoutube, setEditLinkYoutube] = useState('');

  const [previewFile, setPreviewFile] = useState<{ name: string; type: string; data: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
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
    if (!newJudul.trim()) return;

    const newItem: JurnalItem = {
      id: `jr_${Date.now()}`,
      judul: newJudul.trim(),
      tanggalPublikasi: newTanggalPublikasi.trim() || 'Mei 2026',
      subjek: newSubjek.trim() || 'Logistik, Keuangan, Manajemen',
      abstrak: newAbstrak.trim(),
      fileName: newFileState?.name,
      fileType: newFileState?.type,
      fileData: newFileState?.data,
      linkFacebook: newLinkFacebook.trim() || undefined,
      linkInstagram: newLinkInstagram.trim() || undefined,
      linkYoutube: newLinkYoutube.trim() || undefined
    };

    const updatedList = [newItem, ...items];
    setItems(updatedList);
    onSave({ ...content, jurnalList: updatedList });

    // Reset Form
    setNewJudul('');
    setNewTanggalPublikasi('');
    setNewSubjek('');
    setNewAbstrak('');
    setNewFileState(null);
    setNewLinkFacebook('');
    setNewLinkInstagram('');
    setNewLinkYoutube('');
    setIsAddOpen(false);
  };

  const handleStartEdit = (item: JurnalItem) => {
    setEditingId(item.id);
    setEditJudul(item.judul);
    setEditTanggalPublikasi(item.tanggalPublikasi);
    setEditSubjek(item.subjek);
    setEditAbstrak(item.abstrak);
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
    if (!editJudul.trim()) return;

    const updatedList = items.map(item => {
      if (item.id === editingId) {
        return {
          ...item,
          judul: editJudul.trim(),
          tanggalPublikasi: editTanggalPublikasi.trim(),
          subjek: editSubjek.trim(),
          abstrak: editAbstrak.trim(),
          fileName: editFileState?.name,
          fileType: editFileState?.type,
          fileData: editFileState?.data,
          linkFacebook: editLinkFacebook.trim() || undefined,
          linkInstagram: editLinkInstagram.trim() || undefined,
          linkYoutube: editLinkYoutube.trim() || undefined
        };
      }
      return item;
    });

    setItems(updatedList);
    onSave({ ...content, jurnalList: updatedList });
    setEditingId(null);
    setEditFileState(null);
    setEditLinkFacebook('');
    setEditLinkInstagram('');
    setEditLinkYoutube('');
  };

  const handleDelete = (id: string, judul: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus jurnal ilmiah: "${judul}"?`)) {
      const updatedList = items.filter(item => item.id !== id);
      setItems(updatedList);
      onSave({ ...content, jurnalList: updatedList });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-[#1B365D] uppercase tracking-wider">📚 Pengelola Jurnal Pensiunan Berkala (JPPI)</h3>
          <p className="text-[10px] text-gray-500 mt-0.5">Tambah, ubah, dan hapus sitasi manuskrip, bahan ajar purna tugas, dan abstrak penelitian lansia.</p>
        </div>
        {!isAddOpen && !editingId && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#C5A059] hover:bg-[#B38F4D] text-white rounded-lg text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Jurnal Baru</span>
          </button>
        )}
      </div>

      {/* FORM: ADD NEW */}
      {isAddOpen && (
        <form onSubmit={handleAdd} className="bg-amber-50/40 border border-amber-200/50 p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/40 pb-2">
            <h4 className="text-xs font-bold text-[#1B365D] uppercase">Tulis &amp; Daftarkan Jurnal</h4>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="text-xs text-gray-400 hover:text-gray-600 font-bold"
            >
              Batal
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Judul Lengkap Jurnal &amp; Volume *</label>
              <input
                type="text"
                value={newJudul}
                onChange={(e) => setNewJudul(e.target.value)}
                placeholder="Contoh: Vol 3 No 1 (2026): Jurnal Pensiunan Profesional Indonesia (JPPI)"
                className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Tanggal / Edisi Publikasi</label>
              <input
                type="text"
                value={newTanggalPublikasi}
                onChange={(e) => setNewTanggalPublikasi(e.target.value)}
                placeholder="Contoh: Mei 2026 atau Desember 2025"
                className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Subjek Utama Kajian</label>
              <input
                type="text"
                value={newSubjek}
                onChange={(e) => setNewSubjek(e.target.value)}
                placeholder="Contoh: Audit Publik, Pengawasan Sosial BUMN"
                className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Abstrak Penelitian *</label>
              <textarea
                rows={3}
                value={newAbstrak}
                onChange={(e) => setNewAbstrak(e.target.value)}
                placeholder="Tulis sari / abstrak penelitian..."
                className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>

            <div className="md:col-span-2 border-t border-gray-100 pt-3">
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Lampiran Berkas / Dokumen (Opsional: PDF, DOC, DOCX, PPT, PPTX)</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1.5">
                <input
                  type="file"
                  id="new-jurnal-file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => handleFileChange(e, false)}
                  className="hidden"
                />
                <label
                  htmlFor="new-jurnal-file"
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
                      className="text-red-700 hover:text-red-900 font-bold ml-1 text-sm leading-none cursor-pointer"
                      title="Hapus berkas"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-500 italic">Maksimal 5MB. Dokumen ini dapat diunduh atau dipreview langsung oleh pembaca.</span>
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
              Daftarkan Jurnal
            </button>
          </div>
        </form>
      )}

      {/* FORM: EDIT */}
      {editingId && (
        <form onSubmit={handleSaveEdit} className="bg-blue-50/40 border border-blue-200 p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-blue-200 pb-2">
            <h4 className="text-xs font-bold text-[#1B365D] uppercase">✏️ Edit Metadata Jurnal</h4>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="text-xs text-gray-500 hover:text-gray-700 font-bold"
            >
              Batal
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Judul Lengkap Jurnal &amp; Volume *</label>
              <input
                type="text"
                value={editJudul}
                onChange={(e) => setEditJudul(e.target.value)}
                className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Tanggal / Edisi Publikasi</label>
              <input
                type="text"
                value={editTanggalPublikasi}
                onChange={(e) => setEditTanggalPublikasi(e.target.value)}
                className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Subjek Utama Kajian</label>
              <input
                type="text"
                value={editSubjek}
                onChange={(e) => setEditSubjek(e.target.value)}
                className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Abstrak Penelitian *</label>
              <textarea
                rows={3}
                value={editAbstrak}
                onChange={(e) => setEditAbstrak(e.target.value)}
                className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>

            <div className="md:col-span-2 border-t border-gray-100 pt-3">
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Lampiran Berkas / Dokumen (Opsional: PDF, DOC, DOCX, PPT, PPTX)</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1.5">
                <input
                  type="file"
                  id="edit-jurnal-file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => handleFileChange(e, true)}
                  className="hidden"
                />
                <label
                  htmlFor="edit-jurnal-file"
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
                      className="text-red-700 hover:text-red-900 font-bold ml-1 text-sm leading-none cursor-pointer"
                      title="Hapus berkas"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-500 italic">Maksimal 5MB. Dokumen ini dapat diunduh atau dipreview langsung oleh pembaca.</span>
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
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border border-[#E5E0D5] border-l-4 border-l-[#1B365D] rounded-r-xl p-4 bg-white shadow-xs flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-2 flex-1 w-full">
              <span className="text-[10px] text-amber-900 font-mono font-bold block">{item.tanggalPublikasi} (Edisi Cetak &amp; Online)</span>
              <h4 className="text-base font-serif font-bold text-[#1B365D] leading-tight">
                {item.judul}
              </h4>
              <p className="text-xs font-medium text-gray-600">Subjek Utama: <span className="text-[#1B365D] font-bold">{item.subjek}</span></p>
              <p className="text-xs italic text-gray-500 leading-relaxed bg-gray-50/50 p-2.5 rounded border border-[#E5E0D5]">
                {item.abstrak}
              </p>

              {item.fileName && item.fileData && (
                <div className="mt-3 flex items-center justify-between p-2 rounded-lg text-xs bg-gray-55 border border-gray-150 text-gray-700">
                  <div className="flex items-center gap-1.5 min-w-0 pr-2">
                    <FileText className="w-3.5 h-3.5 shrink-0 text-[#C5A059]" />
                    <span className="font-medium truncate text-[11px]" title={item.fileName}>{item.fileName}</span>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {(item.fileType?.includes('pdf') || item.fileData.startsWith('data:application/pdf')) && (
                      <button
                        type="button"
                        onClick={() => setPreviewFile({ name: item.fileName!, type: item.fileType!, data: item.fileData! })}
                        className="text-[10px] font-bold px-2 py-1 rounded flex items-center gap-0.5 hover:opacity-85 cursor-pointer text-[#1B365D] bg-slate-100 border border-slate-300"
                      >
                        <Eye className="w-3 h-3" /> Lihat
                      </button>
                    )}
                    <a
                      href={item.fileData}
                      download={item.fileName}
                      className="text-[10px] font-bold px-2 py-1 rounded flex items-center gap-0.5 hover:opacity-85 cursor-pointer text-emerald-700 bg-emerald-50 border border-emerald-200"
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
                      className="text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 hover:opacity-85 cursor-pointer transition-opacity bg-blue-50 text-blue-800 border border-blue-200"
                    >
                      <Facebook className="w-3 h-3 text-blue-600 shrink-0" /> Facebook
                    </a>
                  )}
                  {item.linkInstagram && (
                    <a
                      href={item.linkInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 hover:opacity-85 cursor-pointer transition-opacity bg-pink-50 text-pink-800 border border-pink-200"
                    >
                      <Instagram className="w-3 h-3 text-pink-500 shrink-0" /> Instagram
                    </a>
                  )}
                  {item.linkYoutube && (
                    <a
                      href={item.linkYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 hover:opacity-85 cursor-pointer transition-opacity bg-red-50 text-red-800 border border-red-200"
                    >
                      <Youtube className="w-3 h-3 text-red-500 shrink-0" /> YouTube
                    </a>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 shrink-0 self-end md:self-start">
              <button
                onClick={() => handleStartEdit(item)}
                className="p-1.5 text-blue-650 hover:bg-blue-50 border border-blue-200 rounded-md cursor-pointer"
                title="Edit jurnal"
                disabled={!!editingId || isAddOpen}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(item.id, item.judul)}
                className="p-1.5 text-red-650 hover:bg-red-50 border border-red-200 rounded-md cursor-pointer"
                title="Hapus jurnal"
                disabled={!!editingId || isAddOpen}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-6 text-gray-400 italic text-xs">Belum ada jurnal terdaftar.</div>
        )}
      </div>

      {/* PDF DOCUMENT PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="bg-[#1B365D] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C5A059]" />
                <span className="font-serif font-bold text-sm md:text-base truncate max-w-[300px] md:max-w-xl">
                  {previewFile.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 bg-gray-100 p-2 md:p-4">
              <iframe
                src={previewFile.data}
                className="w-full h-full border-0 rounded-lg shadow-sm"
                title="Document Preview"
              />
            </div>
            
            <div className="border-t border-gray-100 px-5 py-3 flex justify-end gap-2 bg-gray-50">
              <a
                href={previewFile.data}
                download={previewFile.name}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer-parent"
              >
                <Download className="w-4 h-4" /> Unduh Dokumen
              </a>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
