import { useState } from 'react';
import { GaleriItem } from '../types';
import { compressImage } from '../utils/storage';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Upload, 
  X, 
  Check, 
  Calendar, 
  Image as ImageIcon,
  ZoomIn
} from 'lucide-react';

interface GaleriRTProps {
  items: GaleriItem[];
  onAdd: (item: GaleriItem) => void;
  onEdit: (item: GaleriItem) => void;
  onDelete: (id: string) => void;
  isPengurus: boolean;
}

export default function GaleriRT({ items, onAdd, onEdit, onDelete, isPengurus }: GaleriRTProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<GaleriItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<GaleriItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<GaleriItem, 'id'>>({
    judul: '',
    tanggal: new Date().toISOString().split('T')[0],
    fotoUrl: '',
    keterangan: '',
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      judul: '',
      tanggal: new Date().toISOString().split('T')[0],
      fotoUrl: '',
      keterangan: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GaleriItem) => {
    setEditingId(item.id);
    setFormData({
      judul: item.judul,
      tanggal: item.tanggal,
      fotoUrl: item.fotoUrl,
      keterangan: item.keterangan,
    });
    setIsModalOpen(true);
  };

  // Handle local file upload with compression for Local Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 960, 0.75);
      if (compressed) {
        setFormData((prev) => ({ ...prev, fotoUrl: compressed }));
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData((prev) => ({ ...prev, fotoUrl: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim() || !formData.fotoUrl.trim()) return;

    if (editingId) {
      onEdit({
        id: editingId,
        ...formData,
      });
    } else {
      onAdd({
        id: `gal-${Date.now()}`,
        ...formData,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900">Galeri Foto Kegiatan Warga</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Dokumentasi arsip kegiatan dan lingkungan Jogonalan RT.04 RW.02
          </p>
        </div>

        {isPengurus && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Foto Galeri</span>
          </button>
        )}
      </div>

      {/* Grid of Photos */}
      {items.length === 0 ? (
        <div className="bg-white border border-dashed border-stone-300 rounded-xl p-10 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-3">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-stone-800">Belum Ada Foto Dokumentasi</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
            {isPengurus 
              ? 'Galeri masih kosong. Anda dapat mengunggah foto kegiatan warga (kerja bakti, peringatan 17 Agustus, posyandu, dll) kapan saja.'
              : 'Belum ada dokumentasi foto kegiatan yang diunggah saat ini.'}
          </p>
          {items.length === 0 && isPengurus && (
            <button
              onClick={handleOpenAdd}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Unggah Foto Pertama Sekarang</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              <div 
                className="relative aspect-4/3 bg-stone-100 overflow-hidden cursor-pointer"
                onClick={() => setPreviewItem(item)}
              >
                <img
                  src={item.fotoUrl}
                  alt={item.judul}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <ZoomIn className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {item.tanggal}
                    </span>
                    {isPengurus && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(item);
                          }}
                          className="p-1 text-stone-400 hover:text-emerald-700 cursor-pointer"
                          title="Edit Foto"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemToDelete(item);
                          }}
                          className="p-1 text-stone-400 hover:text-red-700 cursor-pointer"
                          title="Hapus Foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-stone-900 text-sm">{item.judul}</h3>
                  {item.keterangan && (
                    <p className="text-stone-600 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {item.keterangan}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Preview */}
      {previewItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs cursor-pointer"
          onClick={() => setPreviewItem(null)}
        >
          <div 
            className="max-w-4xl max-h-[90vh] bg-stone-900 rounded-xl overflow-hidden shadow-2xl flex flex-col cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={previewItem.fotoUrl}
                alt={previewItem.judul}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain mx-auto"
              />
              <button
                onClick={() => setPreviewItem(null)}
                className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-stone-900 text-white">
              <h3 className="text-base font-semibold">{previewItem.judul}</h3>
              <p className="text-xs text-stone-400 mt-0.5">{previewItem.tanggal}</p>
              {previewItem.keterangan && (
                <p className="text-xs text-stone-300 mt-2">{previewItem.keterangan}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  {editingId ? 'Edit Data Foto' : 'Unggah Foto Galeri Baru'}
                </h3>
                <p className="text-xs text-stone-500">
                  Pilih foto dokumentasi dari HP/Laptop Anda atau tempelkan URL gambar
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Input (Upload or URL) */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Foto Dokumentasi *
                </label>
                
                <div className="border border-stone-300 rounded-lg p-3 bg-stone-50 space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-md cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Pilih Foto dari Perangkat</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-stone-400 text-xs">atau masukkan link URL</span>
                  </div>

                  <input
                    type="text"
                    value={formData.fotoUrl}
                    onChange={(e) => setFormData({ ...formData, fotoUrl: e.target.value })}
                    placeholder="https://... atau hasil unggah file di atas"
                    className="w-full text-xs px-3 py-1.5 bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />

                  {formData.fotoUrl && (
                    <div className="mt-2 relative w-full h-36 bg-stone-200 rounded-md overflow-hidden">
                      <img
                        src={formData.fotoUrl}
                        alt="Pratinjau"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Judul Foto / Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Contoh: Kerja Bakti Pembersihan Saluran Air RT.04"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Tanggal Kegiatan</label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Keterangan Singkat
                </label>
                <textarea
                  rows={3}
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ceritakan sedikit tentang kegiatan pada foto ini..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!formData.fotoUrl || !formData.judul}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-lg shadow-xs cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingId ? 'Simpan Foto' : 'Tambahkan ke Galeri'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal for Deletion */}
      <ConfirmDeleteModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            onDelete(itemToDelete.id);
            setItemToDelete(null);
          }
        }}
        title="Hapus Foto Dokumentasi?"
        message={`Apakah Anda yakin ingin menghapus foto "${itemToDelete?.judul}"? Foto ini akan dihapus dari arsip server.`}
      />
    </div>
  );
}
