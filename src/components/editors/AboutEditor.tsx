import React, { useState } from 'react';
import { HomepageContent, AboutItem } from '../../types';
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon, Link as LinkIcon, Video as VideoIcon, Home } from 'lucide-react';
import { compressImage } from '../../utils/storage';

interface AboutEditorProps {
  content: HomepageContent;
  onSave: (updated: HomepageContent, actionType?: 'add' | 'edit' | 'delete') => void;
}

export default function AboutEditor({ content, onSave }: AboutEditorProps) {
  const [items, setItems] = useState<AboutItem[]>(content.aboutItems || []);

  // Sync state with parent content when it changes (reactive sync)
  React.useEffect(() => {
    setItems(content.aboutItems || []);
  }, [content.aboutItems]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newJudul, setNewJudul] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrutan, setNewUrutan] = useState<number | ''>('');
  const [newIsBeranda, setNewIsBeranda] = useState(false);
  const [newMediaType, setNewMediaType] = useState<'none' | 'poto' | 'url'>('none');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editJudul, setEditJudul] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editUrutan, setEditUrutan] = useState<number | ''>('');
  const [editIsBeranda, setEditIsBeranda] = useState(false);
  const [editMediaType, setEditMediaType] = useState<'none' | 'poto' | 'url'>('none');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editMediaUrl, setEditMediaUrl] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJudul.trim()) return;

    const newItem: AboutItem = {
      id: `ab_${Date.now()}`,
      judul: newJudul.trim(),
      deskripsi: newDesc.trim(),
      urutan: Number(newUrutan) || (items.length + 1),
      isBeranda: newIsBeranda,
      mediaType: newMediaType !== 'none' ? newMediaType : undefined,
      imageUrl: newMediaType === 'poto' ? newImageUrl : undefined,
      mediaUrl: newMediaType === 'url' ? newMediaUrl : undefined,
    };

    const updatedList = [...items, newItem].sort((a, b) => a.urutan - b.urutan);
    setItems(updatedList);
    // berhasil ditambah
    onSave({ ...content, aboutItems: updatedList }, 'add');

    // Reset Form
    setNewJudul('');
    setNewDesc('');
    setNewUrutan('');
    setNewIsBeranda(false);
    setNewMediaType('none');
    setNewImageUrl('');
    setNewMediaUrl('');
    setIsAddOpen(false);
  };

  const handleStartEdit = (item: AboutItem) => {
    setEditingId(item.id);
    setEditJudul(item.judul);
    setEditDesc(item.deskripsi);
    setEditUrutan(item.urutan);
    setEditIsBeranda(!!item.isBeranda);
    setEditMediaType(item.mediaType || 'none');
    setEditImageUrl(item.imageUrl || '');
    setEditMediaUrl(item.mediaUrl || '');
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
          urutan: Number(editUrutan) || 0,
          isBeranda: editIsBeranda,
          mediaType: editMediaType !== 'none' ? editMediaType : undefined,
          imageUrl: editMediaType === 'poto' ? editImageUrl : undefined,
          mediaUrl: editMediaType === 'url' ? editMediaUrl : undefined,
        };
      }
      return item;
    }).sort((a, b) => a.urutan - b.urutan);

    setItems(updatedList);
    // berhasil di rubah
    onSave({ ...content, aboutItems: updatedList }, 'edit');
    setEditingId(null);
  };

  const handleDelete = (id: string, judul: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus poin Tentang Kami: "${judul}"?`)) {
      const updatedList = items.filter(item => item.id !== id);
      setItems(updatedList);
      onSave({ ...content, aboutItems: updatedList }, 'delete');
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
              onClick={() => {
                setIsAddOpen(false);
                setNewIsBeranda(false);
                setNewMediaType('none');
                setNewImageUrl('');
                setNewMediaUrl('');
              }}
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

            {/* NEW VISIBILITY & MEDIA OPTION FOR TENTANG KAMI */}
            <div className="md:col-span-2 bg-[#1B365D]/5 p-3 rounded-xl border border-[#1B365D]/10 space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  id="newIsBeranda"
                  type="checkbox"
                  checked={newIsBeranda}
                  onChange={(e) => setNewIsBeranda(e.target.checked)}
                  className="w-4 h-4 text-[#1B365D] focus:ring-[#1B365D] border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="newIsBeranda" className="text-[11px] font-bold text-[#1B365D] uppercase cursor-pointer select-none">
                  🏡 Tampilkan di Beranda
                </label>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#1B365D] uppercase mb-1">Jenis Media Pendukung</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="newMediaType"
                      value="none"
                      checked={newMediaType === 'none'}
                      onChange={() => setNewMediaType('none')}
                      className="text-[#1B365D]"
                    />
                    <span className="text-xs text-gray-700">Tanpa Media</span>
                  </label>
                  <label className="inline-flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="newMediaType"
                      value="poto"
                      checked={newMediaType === 'poto'}
                      onChange={() => setNewMediaType('poto')}
                      className="text-[#1B365D]"
                    />
                    <span className="text-xs text-gray-700">Unggah Foto (Poto)</span>
                  </label>
                  <label className="inline-flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="newMediaType"
                      value="url"
                      checked={newMediaType === 'url'}
                      onChange={() => setNewMediaType('url')}
                      className="text-[#1B365D]"
                    />
                    <span className="text-xs text-gray-700">Tautan URL (Youtube/Facebook)</span>
                  </label>
                </div>
              </div>

              {newMediaType === 'poto' && (
                <div className="space-y-2 pt-1">
                  <label className="block text-[10px] font-bold text-[#8B7E66] uppercase">Unggah File Foto</label>
                  <div className="flex items-center space-x-3">
                    <input
                      id="new-about-photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          compressImage(file)
                            .then(base64 => setNewImageUrl(base64))
                            .catch(err => {
                              console.error("Error compressing image:", err);
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setNewImageUrl(event.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            });
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="new-about-photo"
                      className="px-3 py-1.5 bg-white hover:bg-gray-255 text-gray-700 border border-gray-300 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Pilih Foto
                    </label>
                    {newImageUrl && (
                      <button
                        type="button"
                        onClick={() => setNewImageUrl('')}
                        className="text-[10px] text-red-600 hover:underline"
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>
                  {newImageUrl && (
                    <div className="mt-2 text-center bg-white p-2 rounded-lg border border-gray-200 inline-block">
                      <img src={newImageUrl} alt="Preview" className="h-20 object-contain rounded-md" />
                    </div>
                  )}
                </div>
              )}

              {newMediaType === 'url' && (
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[10px] font-bold text-[#8B7E66] uppercase">Alamat URL Media (Facebook / Youtube / Lainnya)</label>
                  <input
                    type="url"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder="https://youtube.com/... atau https://facebook.com/..."
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                  />
                </div>
              )}
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
              onClick={() => {
                setEditingId(null);
                setEditIsBeranda(false);
                setEditMediaType('none');
                setEditImageUrl('');
                setEditMediaUrl('');
              }}
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

            {/* EDIT VISIBILITY & MEDIA OPTION FOR TENTANG KAMI */}
            <div className="md:col-span-2 bg-[#1B365D]/5 p-3 rounded-xl border border-[#1B365D]/10 space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  id="editIsBeranda"
                  type="checkbox"
                  checked={editIsBeranda}
                  onChange={(e) => setEditIsBeranda(e.target.checked)}
                  className="w-4 h-4 text-[#1B365D] focus:ring-[#1B365D] border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="editIsBeranda" className="text-[11px] font-bold text-[#1B365D] uppercase cursor-pointer select-none">
                  🏡 Tampilkan di Beranda
                </label>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#1B365D] uppercase mb-1">Jenis Media Pendukung</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="editMediaType"
                      value="none"
                      checked={editMediaType === 'none'}
                      onChange={() => setEditMediaType('none')}
                      className="text-[#1B365D]"
                    />
                    <span className="text-xs text-gray-700">Tanpa Media</span>
                  </label>
                  <label className="inline-flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="editMediaType"
                      value="poto"
                      checked={editMediaType === 'poto'}
                      onChange={() => setEditMediaType('poto')}
                      className="text-[#1B365D]"
                    />
                    <span className="text-xs text-gray-700">Unggah Foto (Poto)</span>
                  </label>
                  <label className="inline-flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="editMediaType"
                      value="url"
                      checked={editMediaType === 'url'}
                      onChange={() => setEditMediaType('url')}
                      className="text-[#1B365D]"
                    />
                    <span className="text-xs text-gray-700">Tautan URL (Youtube/Facebook)</span>
                  </label>
                </div>
              </div>

              {editMediaType === 'poto' && (
                <div className="space-y-2 pt-1">
                  <label className="block text-[10px] font-bold text-[#8B7E66] uppercase">Unggah File Foto</label>
                  <div className="flex items-center space-x-3">
                    <input
                      id="edit-about-photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          compressImage(file)
                            .then(base64 => setEditImageUrl(base64))
                            .catch(err => {
                              console.error("Error compressing image:", err);
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setEditImageUrl(event.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            });
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="edit-about-photo"
                      className="px-3 py-1.5 bg-white hover:bg-gray-55 text-gray-700 border border-gray-300 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Ganti Foto
                    </label>
                    {editImageUrl && (
                      <button
                        type="button"
                        onClick={() => setEditImageUrl('')}
                        className="text-[10px] text-red-600 hover:underline"
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>
                  {editImageUrl && (
                    <div className="mt-2 text-center bg-white p-2 rounded-lg border border-gray-200 inline-block">
                      <img src={editImageUrl} alt="Preview" className="h-20 object-contain rounded-md" />
                    </div>
                  )}
                </div>
              )}

              {editMediaType === 'url' && (
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[10px] font-bold text-[#8B7E66] uppercase">Alamat URL Media (Facebook / Youtube / Lainnya)</label>
                  <input
                    type="url"
                    value={editMediaUrl}
                    onChange={(e) => setEditMediaUrl(e.target.value)}
                    placeholder="https://youtube.com/... atau https://facebook.com/..."
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                  />
                </div>
              )}
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
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-5 h-5 bg-[#1B365D] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                  {item.urutan}
                </span>
                <h5 className="text-xs font-bold text-[#1B365D] uppercase tracking-wide">{item.judul}</h5>
                {item.isBeranda && (
                  <span className="bg-[#1B365D]/10 text-[#1B365D] border border-[#1B365D]/20 text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Home className="w-2.5 h-2.5" /> Beranda
                  </span>
                )}
                {item.mediaType === 'poto' && (
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <ImageIcon className="w-2.5 h-2.5" /> Poto
                  </span>
                )}
                {item.mediaType === 'url' && (
                  <span className="bg-orange-100 text-orange-800 border border-orange-200 text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <VideoIcon className="w-2.5 h-2.5" /> Video URL
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">{item.deskripsi}</p>
              
              {/* Media Preview in List */}
              {item.mediaType === 'poto' && item.imageUrl && (
                <div className="mt-2 bg-white p-1 rounded-lg border border-gray-200 inline-block">
                  <img src={item.imageUrl} alt={item.judul} className="h-14 rounded object-contain" />
                </div>
              )}
              {item.mediaType === 'url' && item.mediaUrl && (
                <div className="mt-1.5 flex items-center space-x-1 text-[10px] text-orange-850 bg-orange-50 inline-flex px-2 py-0.5 rounded border border-orange-100 font-mono">
                  <LinkIcon className="w-3 h-3 text-orange-500" />
                  <a href={item.mediaUrl} target="_blank" rel="noreferrer" className="truncate max-w-xs hover:underline">
                    {item.mediaUrl}
                  </a>
                </div>
              )}
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
