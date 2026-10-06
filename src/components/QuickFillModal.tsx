import { useState } from 'react';
import { RTProfile, PengumumanItem, GaleriItem, UmkmItem } from '../types';
import { compressImage } from '../utils/storage';
import { Zap, X, Check, Upload } from 'lucide-react';

interface QuickFillModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: RTProfile;
  onSaveQuick: (data: {
    profile: RTProfile;
    announcement?: PengumumanItem;
    gallery?: GaleriItem;
    umkm?: UmkmItem;
  }) => void;
}

export default function QuickFillModal({
  isOpen,
  onClose,
  profile,
  onSaveQuick,
}: QuickFillModalProps) {
  // Step in 1-minute wizard
  const [ketuaRt, setKetuaRt] = useState(profile.ketuaRt);
  const [kontakWa, setKontakWa] = useState(profile.kontakWa);
  const [alamatSekretariat, setAlamatSekretariat] = useState(profile.alamatSekretariat);
  const [sambutan, setSambutan] = useState(profile.sambutan);

  // Optional first announcement
  const [firstAnnJudul, setFirstAnnJudul] = useState('');
  const [firstAnnIsi, setFirstAnnIsi] = useState('');

  // Optional first gallery
  const [firstGalJudul, setFirstGalJudul] = useState('');
  const [firstGalFoto, setFirstGalFoto] = useState('');

  // Optional first UMKM
  const [firstUmkmNama, setFirstUmkmNama] = useState('');
  const [firstUmkmKategori, setFirstUmkmKategori] = useState('Makanan & Minuman');
  const [firstUmkmHp, setFirstUmkmHp] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 960, 0.75);
      if (compressed) {
        setFirstGalFoto(compressed);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFirstGalFoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfile: RTProfile = {
      ...profile,
      ketuaRt,
      kontakWa,
      alamatSekretariat,
      sambutan,
    };

    let announcement: PengumumanItem | undefined;
    if (firstAnnJudul.trim()) {
      announcement = {
        id: `ann-${Date.now()}`,
        judul: firstAnnJudul,
        tanggal: new Date().toISOString().split('T')[0],
        kategori: 'Kegiatan Warga',
        isi: firstAnnIsi || 'Informasi kegiatan warga RT.04 RW.02 Jogonalan.',
        penulis: ketuaRt ? `Ketua RT (${ketuaRt})` : 'Pengurus RT.04',
        penting: false,
      };
    }

    let gallery: GaleriItem | undefined;
    if (firstGalFoto.trim() && firstGalJudul.trim()) {
      gallery = {
        id: `gal-${Date.now()}`,
        judul: firstGalJudul,
        tanggal: new Date().toISOString().split('T')[0],
        fotoUrl: firstGalFoto,
        keterangan: 'Dokumentasi kegiatan RT.04 RW.02 Lingkungan Jogonalan',
      };
    }

    let umkm: UmkmItem | undefined;
    if (firstUmkmNama.trim()) {
      umkm = {
        id: `umkm-${Date.now()}`,
        namaUsaha: firstUmkmNama,
        pemilik: '',
        kategori: firstUmkmKategori,
        nomorHp: firstUmkmHp,
        alamat: 'Lingkungan Jogonalan RT.04 RW.02',
        deskripsi: '',
        isSponsor: false,
      };
    }

    onSaveQuick({
      profile: updatedProfile,
      announcement,
      gallery,
      umkm,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 border border-stone-200">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Mode Isi Cepat 1 Menit
              </h3>
              <p className="text-xs text-stone-500">
                Isi data pokok sekarang, lalu Anda bisa melengkapinya kapan saja.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-600 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Profil RT Pokok */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800">
                Data Pokok Pengurus RT.04 RW.02
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nama Ketua RT
                </label>
                <input
                  type="text"
                  value={ketuaRt}
                  onChange={(e) => setKetuaRt(e.target.value)}
                  placeholder="Nama Bapak/Ibu Ketua RT"
                  className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nomor WhatsApp Pelayanan
                </label>
                <input
                  type="text"
                  value={kontakWa}
                  onChange={(e) => setKontakWa(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Alamat Sekretariat / Balai RT
              </label>
              <input
                type="text"
                value={alamatSekretariat}
                onChange={(e) => setAlamatSekretariat(e.target.value)}
                placeholder="Contoh: Jogonalan RT.04 RW.02 Gg. Mawar"
                className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Sambutan / Pengantar untuk Warga (Opsional)
              </label>
              <textarea
                rows={2}
                value={sambutan}
                onChange={(e) => setSambutan(e.target.value)}
                placeholder="Selamat datang warga Lingkungan Jogonalan RT.04 RW.02..."
                className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Section 2: Pengumuman Pertama */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800">
                Pengumuman Pertama (Opsional)
              </h4>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Judul Pengumuman
              </label>
              <input
                type="text"
                value={firstAnnJudul}
                onChange={(e) => setFirstAnnJudul(e.target.value)}
                placeholder="Contoh: Kerja Bakti Mingguan / Jadwal Posyandu Balita"
                className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {firstAnnJudul && (
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Rincian Pengumuman
                </label>
                <textarea
                  rows={2}
                  value={firstAnnIsi}
                  onChange={(e) => setFirstAnnIsi(e.target.value)}
                  placeholder="Waktu, tempat, dan ketentuan..."
                  className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Section 3: Galeri Pertama */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center">
                3
              </span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800">
                Foto Galeri Pertama (Opsional)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Judul Foto Kegiatan
                </label>
                <input
                  type="text"
                  value={firstGalJudul}
                  onChange={(e) => setFirstGalJudul(e.target.value)}
                  placeholder="Contoh: Foto Kebersamaan Warga RT.04"
                  className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Unggah Foto
                </label>
                <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 cursor-pointer w-full justify-center">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{firstGalFoto ? 'Foto Terpilih' : 'Pilih File Foto'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: UMKM Pertama */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center">
                4
              </span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800">
                Usaha UMKM / Sponsor Pertama (Opsional)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nama Usaha
                </label>
                <input
                  type="text"
                  value={firstUmkmNama}
                  onChange={(e) => setFirstUmkmNama(e.target.value)}
                  placeholder="Contoh: Warung Barokah"
                  className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Kategori</label>
                <select
                  value={firstUmkmKategori}
                  onChange={(e) => setFirstUmkmKategori(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Makanan & Minuman">Makanan & Minuman</option>
                  <option value="Toko & Warung">Toko & Warung</option>
                  <option value="Jasa & Servis">Jasa & Servis</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Nomor WA</label>
                <input
                  type="text"
                  value={firstUmkmHp}
                  onChange={(e) => setFirstUmkmHp(e.target.value)}
                  placeholder="08xxxxxxxx"
                  className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-200">
            <span className="text-xs text-stone-500">
              Data tersimpan otomatis di perangkat Anda
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Simpan Semua Sekarang</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
