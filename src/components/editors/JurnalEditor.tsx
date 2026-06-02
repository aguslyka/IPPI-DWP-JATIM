import React, { useState } from 'react';
import { HomepageContent, JurnalItem } from '../../types';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editJudul, setEditJudul] = useState('');
  const [editTanggalPublikasi, setEditTanggalPublikasi] = useState('');
  const [editSubjek, setEditSubjek] = useState('');
  const [editAbstrak, setEditAbstrak] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJudul.trim()) return;

    const newItem: JurnalItem = {
      id: `jr_${Date.now()}`,
      judul: newJudul.trim(),
      tanggalPublikasi: newTanggalPublikasi.trim() || 'Mei 2026',
      subjek: newSubjek.trim() || 'Logistik, Keuangan, Manajemen',
      abstrak: newAbstrak.trim()
    };

    const updatedList = [newItem, ...items];
    setItems(updatedList);
    onSave({ ...content, jurnalList: updatedList });

    // Reset Form
    setNewJudul('');
    setNewTanggalPublikasi('');
    setNewSubjek('');
    setNewAbstrak('');
    setIsAddOpen(false);
  };

  const handleStartEdit = (item: JurnalItem) => {
    setEditingId(item.id);
    setEditJudul(item.judul);
    setEditTanggalPublikasi(item.tanggalPublikasi);
    setEditSubjek(item.subjek);
    setEditAbstrak(item.abstrak);
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
          abstrak: editAbstrak.trim()
        };
      }
      return item;
    });

    setItems(updatedList);
    onSave({ ...content, jurnalList: updatedList });
    setEditingId(null);
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
          </div>
          <div className="flex justify-end">
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
            <div className="space-y-2 flex-1">
              <span className="text-[10px] text-amber-900 font-mono font-bold block">{item.tanggalPublikasi} (Edisi Cetak &amp; Online)</span>
              <h4 className="text-base font-serif font-bold text-[#1B365D] leading-tight">
                {item.judul}
              </h4>
              <p className="text-xs font-medium text-gray-600">Subjek Utama: <span className="text-[#1B365D] font-bold">{item.subjek}</span></p>
              <p className="text-xs italic text-gray-500 leading-relaxed bg-gray-50/50 p-2.5 rounded border border-[#E5E0D5]">
                {item.abstrak}
              </p>
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
    </div>
  );
}
