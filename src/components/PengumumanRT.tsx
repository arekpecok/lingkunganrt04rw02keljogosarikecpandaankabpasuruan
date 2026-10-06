import { useState } from 'react';
import { PengumumanItem } from '../types';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  AlertCircle, 
  X, 
  Check, 
  Calendar, 
  User, 
  Megaphone
} from 'lucide-react';

interface PengumumanRTProps {
  items: PengumumanItem[];
  onAdd: (item: PengumumanItem) => void;
  onEdit: (item: PengumumanItem) => void;
  onDelete: (id: string) => void;
  isPengurus: boolean;
}

export default function PengumumanRT({ items, onAdd, onEdit, onDelete, isPengurus }: PengumumanRTProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<PengumumanItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<PengumumanItem, 'id'>>({
    judul: '',
    tanggal: new Date().toISOString().split('T')[0],
    kategori: 'Kegiatan Warga',
    isi: '',
    penulis: 'Pengurus RT.04',
    penting: false,
  });

  const categories = [
    'Semua',
    'Kegiatan Warga',
    'Kerja Bakti',
    'Edaran RT',
    'Iuran & Keuangan',
    'Posyandu & Kesehatan',
    'Keamanan',
    'Lainnya',
  ];

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      judul: '',
      tanggal: new Date().toISOString().split('T')[0],
      kategori: 'Kegiatan Warga',
      isi: '',
      penulis: 'Pengurus RT.04',
      penting: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PengumumanItem) => {
    setEditingId(item.id);
    setFormData({
      judul: item.judul,
      tanggal: item.tanggal,
      kategori: item.kategori,
      isi: item.isi,
      penulis: item.penulis,
      penting: item.penting || false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim()) return;

    if (editingId) {
      onEdit({
        id: editingId,
        ...formData,
      });
    } else {
      onAdd({
        id: `ann-${Date.now()}`,
        ...formData,
      });
    }

    setIsModalOpen(false);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.isi.toLowerCase().includes(search.toLowerCase()) ||
      item.penulis.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || item.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900">Pengumuman & Informasi RT</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Informasi resmi untuk warga RT.04 RW.02 Lingkungan Jogonalan
          </p>
        </div>

        {isPengurus && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pengumuman Baru</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pengumuman atau kata kunci..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filter categories tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List of Announcements */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-dashed border-stone-300 rounded-xl p-10 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-3">
            <Megaphone className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-stone-800">
            {items.length === 0 ? 'Belum Ada Pengumuman Ditambahkan' : 'Tidak Ditemukan Pengumuman'}
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
            {items.length === 0 
              ? (isPengurus 
                  ? 'Anda dapat mulai menambahkan pengumuman pertama untuk warga RT.04 RW.02 sekarang.'
                  : 'Belum ada pengumuman resmi yang diterbitkan saat ini.')
              : 'Coba ubah kata kunci pencarian atau kategori filter di atas.'}
          </p>
          {items.length === 0 && isPengurus && (
            <button
              onClick={handleOpenAdd}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tulis Pengumuman Sekarang</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white border rounded-xl p-5 transition-shadow hover:shadow-xs ${
                item.penting ? 'border-amber-400 bg-amber-50/10' : 'border-stone-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                    <span className="font-medium text-emerald-800">{item.kategori}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.tanggal}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {item.penulis}
                    </span>
                    {item.penting && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                          <AlertCircle className="w-3 h-3" />
                          Penting
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-stone-900 mt-1">{item.judul}</h3>
                </div>

                {isPengurus && (
                  <div className="flex items-center gap-1.5 self-end sm:self-start">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-stone-400 hover:text-emerald-700 rounded-md hover:bg-stone-50 cursor-pointer"
                      title="Edit Pengumuman"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setItemToDelete(item)}
                      className="p-1.5 text-stone-400 hover:text-red-700 rounded-md hover:bg-stone-50 cursor-pointer"
                      title="Hapus Pengumuman"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-stone-100 text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {item.isi}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  {editingId ? 'Edit Pengumuman RT' : 'Tulis Pengumuman RT Baru'}
                </h3>
                <p className="text-xs text-stone-500">
                  Isi informasi kegiatan atau edaran untuk warga RT.04 RW.02
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
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Judul Pengumuman *
                </label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Contoh: Kerja Bakti Bersih Lingkungan Minggu Pagi"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    {categories.filter(c => c !== 'Semua').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Isi Lengkap Pengumuman *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.isi}
                  onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Tuliskan rincian pengumuman, waktu, tempat, dan instruksi untuk warga..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Penulis / Pengirim</label>
                  <input
                    type="text"
                    value={formData.penulis}
                    onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Pengurus RT.04 atau Ketua RT"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                    <input
                      type="checkbox"
                      checked={formData.penting}
                      onChange={(e) => setFormData({ ...formData, penting: e.target.checked })}
                      className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Tandai sebagai Pengumuman Penting</span>
                  </label>
                </div>
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
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingId ? 'Simpan Perubahan' : 'Terbitkan Pengumuman'}</span>
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
        title="Hapus Pengumuman?"
        message={`Apakah Anda yakin ingin menghapus pengumuman "${itemToDelete?.judul}"? Tindakan ini akan menghapus data dari server secara permanen.`}
      />
    </div>
  );
}
