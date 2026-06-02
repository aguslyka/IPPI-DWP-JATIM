import React, { useState } from 'react';
import { HomepageContent, BeritaItem } from '../../types';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface BeritaEditorProps {
  content: HomepageContent;
  onSave: (updated: HomepageContent) => void;
}

export default function BeritaEditor({ content, onSave }: BeritaEditorProps) {
  const [items, setItems] = useState<BeritaItem[]>(content.beritaList || []);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newJudul, setNewJudul] = useState('');
  const [newTanggal, setNewTanggal] = useState('');
  const [newKutipan, setNewKutipan] = useState('');
  const [newPenulis, setNewPenulis] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editJudul, setEditJudul] = useState('');
  const [editTanggal, setEditTanggal] = useState('');
  const [editKutipan, setEditKutipan] = useState('');
  const [editPenulis, setEditPenulis] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJudul.trim()) return;

    const newItem: BeritaItem = {
      id: `be_${Date.now()}`,
      judul: newJudul.trim(),
      tanggal: newTanggal || new Date().toISOString().split('T')[0],
      kutipan: newKutipan.trim(),
      penulis: newPenulis.trim() || 'Admin IPPI'
    };

    const updatedList = [newItem, ...items];
    setItems(updatedList);
    onSave({ ...content, beritaList: updatedList });

    // Reset Form
    setNewJudul('');
    setNewTanggal('');
    setNewKutipan('');
    setNewPenulis('');
    setIsAddOpen(false);
  };

  const handleStartEdit = (item: BeritaItem) => {
    setEditingId(item.id);
    setEditJudul(item.judul);
    setEditTanggal(item.tanggal);
    setEditKutipan(item.kutipan);
    setEditPenulis(item.penulis);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editJudul.trim()) return;

    const updatedList = items.map(item => {
      if (item.id === editingId) {
        return {
          ...item,
          judul: editJudul.trim(),
          tanggal: editTanggal,
          kutipan: editKutipan.trim(),
          penulis: editPenulis.trim() || 'Admin'
        };
      }
      return item;
    });

    setItems(updatedList);
    onSave({ ...content, beritaList: updatedList });
    setEditingId(null);
  };

  const handleDelete = (id: string, judul: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus berita: "${judul}"?`)) {
      const updatedList = items.filter(item => item.id !== id);
      setItems(updatedList);
      onSave({ ...content, beritaList: updatedList });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-[#1B365D] uppercase tracking-wider">📰 Pengelola Berita &amp; Kabar IPPI</h3>
          <p className="text-[10px] text-gray-500 mt-0.5">Tambah, ubah, dan hapus rilis berita resmi, pengumuman nasional, atau agenda pengurus cabang.</p>
        </div>
        {!isAddOpen && !editingId && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#C5A059] hover:bg-[#B38F4D] text-white rounded-lg text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Berita Baru</span>
          </button>
        )}
      </div>

      {/* FORM: ADD NEW */}
      {isAddOpen && (
        <form onSubmit={handleAdd} className="bg-amber-50/40 border border-amber-200/50 p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/40 pb-2">
            <h4 className="text-xs font-bold text-[#1B365D] uppercase">Tulis Berita Baru</h4>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="text-xs text-gray-400 hover:text-gray-600 font-bold"
            >
              Batal
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Judul Utama Berita *</label>
              <input
                type="text"
                value={newJudul}
                onChange={(e) => setNewJudul(e.target.value)}
                placeholder="Contoh: Rapat Kerja Pemilihan Cabang Jawa Timur..."
                className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Tanggal Terbit</label>
              <input
                type="date"
                value={newTanggal}
                onChange={(e) => setNewTanggal(e.target.value)}
                className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Penulis / Redaksi</label>
              <input
                type="text"
                value={newPenulis}
                onChange={(e) => setNewPenulis(e.target.value)}
                placeholder="Contoh: Humas IPPI Pusat"
                className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Isi Singkat / Kutipan Berita *</label>
              <textarea
                rows={3}
                value={newKutipan}
                onChange={(e) => setNewKutipan(e.target.value)}
                placeholder="Tulis ulasan ringkas isi berita..."
                className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              Terbitkan Berita
            </button>
          </div>
        </form>
      )}

      {/* FORM: EDIT */}
      {editingId && (
        <form onSubmit={handleSaveEdit} className="bg-blue-50/40 border border-blue-200 p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-blue-200 pb-2">
            <h4 className="text-xs font-bold text-[#1B365D] uppercase">✏️ Edit Berita</h4>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="text-xs text-gray-500 hover:text-gray-700 font-bold"
            >
              Batal
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Judul Utama Berita *</label>
              <input
                type="text"
                value={editJudul}
                onChange={(e) => setEditJudul(e.target.value)}
                className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Tanggal Terbit</label>
              <input
                type="date"
                value={editTanggal}
                onChange={(e) => setEditTanggal(e.target.value)}
                className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Penulis / Redaksi</label>
              <input
                type="text"
                value={editPenulis}
                onChange={(e) => setEditPenulis(e.target.value)}
                className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Isi Singkat / Kutipan Berita *</label>
              <textarea
                rows={3}
                value={editKutipan}
                onChange={(e) => setEditKutipan(e.target.value)}
                className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                required
              />
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
          <div key={item.id} className="border border-[#E5E0D5] rounded-xl p-4 bg-white shadow-xs flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400 font-mono">
                <span className="bg-[#1B365D]/5 text-[#1B365D] font-bold px-2 py-0.5 rounded">
                  {item.tanggal}
                </span>
                <span>•</span>
                <span>Penulis: {item.penulis}</span>
              </div>
              <h4 className="text-base font-serif font-bold text-[#1B365D] leading-tight">
                {item.judul}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed font-sans block">
                {item.kutipan}
              </p>
            </div>
            
            <div className="flex space-x-2 shrink-0 self-end md:self-start">
              <button
                onClick={() => handleStartEdit(item)}
                className="p-1.5 text-blue-650 hover:bg-blue-50 border border-blue-200 rounded-md cursor-pointer"
                title="Edit berita"
                disabled={!!editingId || isAddOpen}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(item.id, item.judul)}
                className="p-1.5 text-red-650 hover:bg-red-50 border border-red-200 rounded-md cursor-pointer"
                title="Hapus berita"
                disabled={!!editingId || isAddOpen}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-6 text-gray-400 italic text-xs">Belum ada berita terdaftar.</div>
        )}
      </div>
    </div>
  );
}
