import React, { useState } from 'react';
import { HomepageContent, ProgramItem } from '../../types';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface ProgramEditorProps {
  content: HomepageContent;
  onSave: (updated: HomepageContent) => void;
}

export default function ProgramEditor({ content, onSave }: ProgramEditorProps) {
  const [items, setItems] = useState<ProgramItem[]>(content.programList || []);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newKategori, setNewKategori] = useState('');
  const [newJudul, setNewJudul] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIsHighlighted, setNewIsHighlighted] = useState(false);
  const [newUrutan, setNewUrutan] = useState<number | ''>('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editKategori, setEditKategori] = useState('');
  const [editJudul, setEditJudul] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editIsHighlighted, setEditIsHighlighted] = useState(false);
  const [editUrutan, setEditUrutan] = useState<number | ''>('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJudul.trim() || !newKategori.trim()) return;

    const newItem: ProgramItem = {
      id: `pr_${Date.now()}`,
      kategori: newKategori.trim(),
      judul: newJudul.trim(),
      deskripsi: newDesc.trim(),
      isHighlighted: newIsHighlighted,
      urutan: Number(newUrutan) || (items.length + 1)
    };

    const updatedList = [...items, newItem].sort((a, b) => a.urutan - b.urutan);
    setItems(updatedList);
    onSave({ ...content, programList: updatedList });

    // Reset Form
    setNewKategori('');
    setNewJudul('');
    setNewDesc('');
    setNewIsHighlighted(false);
    setNewUrutan('');
    setIsAddOpen(false);
  };

  const handleStartEdit = (item: ProgramItem) => {
    setEditingId(item.id);
    setEditKategori(item.kategori);
    setEditJudul(item.judul);
    setEditDesc(item.deskripsi);
    setEditIsHighlighted(item.isHighlighted || false);
    setEditUrutan(item.urutan);
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
          urutan: Number(editUrutan) || 0
        };
      }
      return item;
    }).sort((a, b) => a.urutan - b.urutan);

    setItems(updatedList);
    onSave({ ...content, programList: updatedList });
    setEditingId(null);
  };

  const handleDelete = (id: string, judul: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus agenda/program kerja: "${judul}"?`)) {
      const updatedList = items.filter(item => item.id !== id);
      setItems(updatedList);
      onSave({ ...content, programList: updatedList });
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
          </div>
          <div className="flex justify-end">
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
              <p className={`text-xs leading-relaxed truncate-2-lines ${item.isHighlighted ? 'text-slate-300' : 'text-gray-600'}`}>
                {item.deskripsi}
              </p>
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
    </div>
  );
}
