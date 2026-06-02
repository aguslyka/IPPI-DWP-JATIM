import React, { useState } from 'react';
import { HomepageContent, AboutItem } from '../../types';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface AboutEditorProps {
  content: HomepageContent;
  onSave: (updated: HomepageContent) => void;
}

export default function AboutEditor({ content, onSave }: AboutEditorProps) {
  const [items, setItems] = useState<AboutItem[]>(content.aboutItems || []);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newJudul, setNewJudul] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrutan, setNewUrutan] = useState<number | ''>('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editJudul, setEditJudul] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editUrutan, setEditUrutan] = useState<number | ''>('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJudul.trim()) return;

    const newItem: AboutItem = {
      id: `ab_${Date.now()}`,
      judul: newJudul.trim(),
      deskripsi: newDesc.trim(),
      urutan: Number(newUrutan) || (items.length + 1)
    };

    const updatedList = [...items, newItem].sort((a, b) => a.urutan - b.urutan);
    setItems(updatedList);
    onSave({ ...content, aboutItems: updatedList });

    // Reset Form
    setNewJudul('');
    setNewDesc('');
    setNewUrutan('');
    setIsAddOpen(false);
  };

  const handleStartEdit = (item: AboutItem) => {
    setEditingId(item.id);
    setEditJudul(item.judul);
    setEditDesc(item.deskripsi);
    setEditUrutan(item.urutan);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editJudul.trim()) return;

    const updatedList = items.map(item => {
      if (item.id === editingId) {
        return {
          ...item,
          judul: editJudul.trim(),
          deskripsi: editDesc.trim(),
          urutan: Number(editUrutan) || 0
        };
      }
      return item;
    }).sort((a, b) => a.urutan - b.urutan);

    setItems(updatedList);
    onSave({ ...content, aboutItems: updatedList });
    setEditingId(null);
  };

  const handleDelete = (id: string, judul: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus poin Tentang Kami: "${judul}"?`)) {
      const updatedList = items.filter(item => item.id !== id);
      setItems(updatedList);
      onSave({ ...content, aboutItems: updatedList });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-[#1B365D] uppercase tracking-wider">✏️ Pengelola Konten Tentang Kami</h3>
          <p className="text-[10px] text-gray-500 mt-0.5">Tambah, ubah, dan susun ulang poin-poin penjelasan tentang visi dan prinsip aksesibilitas IPPI.</p>
        </div>
        {!isAddOpen && !editingId && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#C5A059] hover:bg-[#B38F4D] text-white rounded-lg text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Poin Tentang Kami</span>
          </button>
        )}
      </div>

      {/* FORM: ADD NEW */}
      {isAddOpen && (
        <form onSubmit={handleAdd} className="bg-amber-50/40 border border-amber-200/50 p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/40 pb-2">
            <h4 className="text-xs font-bold text-[#1B365D] uppercase">Tambah Item Tentang Kami Baru</h4>
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
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Judul Poin *</label>
              <input
                type="text"
                value={newJudul}
                onChange={(e) => setNewJudul(e.target.value)}
                placeholder="Contoh: Integritas & Pengalaman"
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
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Deskripsi Poin *</label>
              <textarea
                rows={3}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Tulis penjabaran selengkapnya mengenai poin ini..."
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
              Simpan Item Baru
            </button>
          </div>
        </form>
      )}

      {/* FORM: EDIT */}
      {editingId && (
        <form onSubmit={handleSaveEdit} className="bg-blue-50/40 border border-blue-200 p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-blue-200 pb-2">
            <h4 className="text-xs font-bold text-[#1B365D] uppercase">✏️ Edit Item Tentang Kami</h4>
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
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Judul Poin *</label>
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
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Deskripsi Poin *</label>
              <textarea
                rows={3}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
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
      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border border-[#E5E0D5] rounded-xl p-4 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1.5 flex-1 select-none">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 bg-[#1B365D] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                  {item.urutan}
                </span>
                <h5 className="text-xs font-bold text-[#1B365D] uppercase tracking-wide">{item.judul}</h5>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">{item.deskripsi}</p>
            </div>
            <div className="flex space-x-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => handleStartEdit(item)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-md cursor-pointer"
                title="Edit item ini"
                disabled={!!editingId || isAddOpen}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(item.id, item.judul)}
                className="p-1.5 text-red-650 hover:bg-red-50 border border-red-200 rounded-md cursor-pointer"
                title="Hapus item ini"
                disabled={!!editingId || isAddOpen}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-6 text-gray-400 italic text-xs">Belum ada item Tentang Kami terdaftar.</div>
        )}
      </div>
    </div>
  );
}
