import { useState } from 'react';
import { UmkmItem } from '../types';
import { compressImage } from '../utils/storage';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Upload, 
  X, 
  Check, 
  Store, 
  Phone, 
  MapPin, 
  User, 
  Award,
  ExternalLink
} from 'lucide-react';

interface SponsorUmkmProps {
  items: UmkmItem[];
  onAdd: (item: UmkmItem) => void;
  onEdit: (item: UmkmItem) => void;
  onDelete: (id: string) => void;
  isPengurus: boolean;
}

export default function SponsorUmkm({ items, onAdd, onEdit, onDelete, isPengurus }: SponsorUmkmProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<UmkmItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<UmkmItem, 'id'>>({
    namaUsaha: '',
    pemilik: '',
    kategori: 'Makanan & Minuman',
    nomorHp: '',
    alamat: 'Lingkungan Jogonalan RT.04 RW.02',
    deskripsi: '',
    fotoUrl: '',
    isSponsor: false,
  });

  const categories = [
    'Semua',
    'Makanan & Minuman',
    'Toko & Warung',
    'Jasa & Servis',
    'Fashion & Jahit',
    'Pertanian & Bibit',
    'Sponsor Mitra',
    'Lainnya',
  ];

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      namaUsaha: '',
      pemilik: '',
      kategori: 'Makanan & Minuman',
      nomorHp: '',
      alamat: 'Lingkungan Jogonalan RT.04 RW.02',
      deskripsi: '',
      fotoUrl: '',
      isSponsor: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: UmkmItem) => {
    setEditingId(item.id);
    setFormData({
      namaUsaha: item.namaUsaha,
      pemilik: item.pemilik,
      kategori: item.kategori,
      nomorHp: item.nomorHp,
      alamat: item.alamat,
      deskripsi: item.deskripsi,
      fotoUrl: item.fotoUrl || '',
      isSponsor: item.isSponsor || false,
    });
    setIsModalOpen(true);
  };

  // Local file upload with compression for Local Storage
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
    if (!formData.namaUsaha.trim()) return;

    if (editingId) {
      onEdit({
        id: editingId,
        ...formData,
      });
    } else {
      onAdd({
        id: `umkm-${Date.now()}`,
        ...formData,
      });
    }

    setIsModalOpen(false);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.namaUsaha.toLowerCase().includes(search.toLowerCase()) ||
      item.pemilik.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || item.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900">Direktori Sponsor & UMKM Warga</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Dukung perekonomian dan usaha mandiri warga RT.04 RW.02 Jogonalan
          </p>
        </div>

        {isPengurus && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Sponsor / UMKM Baru</span>
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
            placeholder="Cari usaha, produk, atau nama pemilik..."
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

      {/* List of UMKM / Sponsor Cards */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-dashed border-stone-300 rounded-xl p-10 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-3">
            <Store className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-stone-800">
            {items.length === 0 ? 'Belum Ada Data Usaha / Sponsor' : 'Tidak Ditemukan Usaha'}
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
            {items.length === 0
              ? (isPengurus 
                  ? 'Daftarkan usaha warung, kuliner, jasa, atau produk warga RT.04 RW.02 untuk dipromosikan bersama.'
                  : 'Belum ada data usaha atau sponsor yang didaftarkan saat ini.')
              : 'Silakan sesuaikan kata kunci atau filter pencarian Anda.'}
          </p>
          {items.length === 0 && isPengurus && (
            <button
              onClick={handleOpenAdd}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Daftarkan Usaha Sekarang</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Image if available */}
                {item.fotoUrl ? (
                  <div className="relative aspect-16/9 bg-stone-100 overflow-hidden">
                    <img
                      src={item.fotoUrl}
                      alt={item.namaUsaha}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {item.isSponsor && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>Sponsor Resmi</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-3 bg-emerald-700" />
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold tracking-wider text-emerald-800 uppercase block">
                        {item.kategori}
                      </span>
                      <h3 className="font-bold text-stone-900 text-base mt-0.5">{item.namaUsaha}</h3>
                    </div>

                    {isPengurus && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 text-stone-400 hover:text-emerald-700 rounded-md cursor-pointer"
                          title="Edit Data"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setItemToDelete(item)}
                          className="p-1 text-stone-400 hover:text-red-700 rounded-md cursor-pointer"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-stone-600 text-xs mt-2 line-clamp-3 leading-relaxed">
                    {item.deskripsi || 'Tidak ada deskripsi tambahan.'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">Pemilik: <strong>{item.pemilik || '-'}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{item.alamat || 'RT.04 RW.02 Jogonalan'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom WhatsApp / Action Button */}
              <div className="px-5 pb-5 pt-0">
                {item.nomorHp ? (
                  <a
                    href={`https://wa.me/${item.nomorHp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hubungi via WhatsApp</span>
                    <ExternalLink className="w-3 h-3 text-emerald-600" />
                  </a>
                ) : (
                  <div className="text-[11px] text-center text-stone-400 py-1.5">
                    Nomor kontak belum dicantumkan
                  </div>
                )}
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
                  {editingId ? 'Edit Data Sponsor / UMKM' : 'Tambah Sponsor atau UMKM Baru'}
                </h3>
                <p className="text-xs text-stone-500">
                  Daftarkan nama usaha warga RT.04 RW.02 Jogonalan
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nama Usaha / Sponsor *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.namaUsaha}
                    onChange={(e) => setFormData({ ...formData, namaUsaha: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Warung Bu Sri / Toko Berkah"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nama Pemilik
                  </label>
                  <input
                    type="text"
                    value={formData.pemilik}
                    onChange={(e) => setFormData({ ...formData, pemilik: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Ibu Sri Wahyuni"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Kategori Usaha</label>
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
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    value={formData.nomorHp}
                    onChange={(e) => setFormData({ ...formData, nomorHp: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: 081234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Alamat / Lokasi Rumah di Jogonalan
                </label>
                <input
                  type="text"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Contoh: Jogonalan RT.04 RW.02 No. 12 (depan pos)"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Deskripsi Usaha & Menu/Jasa yang Ditawarkan
                </label>
                <textarea
                  rows={3}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Contoh: Menyediakan nasi pecel khas pandaan, lauk pauk, minuman dingin, melayani pesanan katering warga..."
                />
              </div>

              {/* Foto Produk */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Foto Produk / Banner Usaha (Opsional)
                </label>
                <div className="border border-stone-300 rounded-lg p-3 bg-stone-50 space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-md cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Unggah Foto dari HP/Laptop</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-stone-400 text-xs">atau masukkan URL</span>
                  </div>
                  <input
                    type="text"
                    value={formData.fotoUrl}
                    onChange={(e) => setFormData({ ...formData, fotoUrl: e.target.value })}
                    placeholder="https://... atau hasil unggah di atas"
                    className="w-full text-xs px-3 py-1.5 bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  {formData.fotoUrl && (
                    <div className="mt-2 relative w-full h-28 bg-stone-200 rounded-md overflow-hidden">
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

              {/* Status Sponsor Checkbox */}
              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.isSponsor}
                    onChange={(e) => setFormData({ ...formData, isSponsor: e.target.checked })}
                    className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Tandai sebagai Mitra Sponsor Resmi RT</span>
                </label>
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
                  <span>{editingId ? 'Simpan Usaha' : 'Daftarkan Usaha'}</span>
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
        title="Hapus Data Usaha / Sponsor?"
        message={`Apakah Anda yakin ingin menghapus data usaha "${itemToDelete?.namaUsaha}"? Data akan dihapus dari server secara permanen.`}
      />
    </div>
  );
}
