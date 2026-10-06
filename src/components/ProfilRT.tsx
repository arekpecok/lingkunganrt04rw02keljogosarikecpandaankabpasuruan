import { useState } from 'react';
import { RTProfile } from '../types';
import { 
  Building2, 
  MapPin, 
  Users, 
  Phone, 
  Clock, 
  Edit3, 
  Save, 
  X, 
  UserCheck, 
  ShieldCheck, 
  CreditCard,
  Compass,
  Target
} from 'lucide-react';

interface ProfilRTProps {
  profile: RTProfile;
  onUpdate: (updated: RTProfile) => void;
  isPengurus: boolean;
}

export default function ProfilRT({ profile, onUpdate, isPengurus }: ProfilRTProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<RTProfile>(profile);

  const handleOpenEdit = () => {
    if (!isPengurus) return;
    setFormData(profile);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Information */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <div>
            <div className="flex items-center gap-2 text-stone-500 text-xs font-medium tracking-wide uppercase">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Lingkungan Jogonalan · RW.02 · Kelurahan Jogosari · Kec. Pandaan · Kab. Pasuruan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
              {profile.namaRt || 'RT.04 RW.02 Lingkungan Jogonalan'}
            </h1>
            <p className="text-stone-600 text-sm mt-1">
              Pusat Pelayanan & Keterbukaan Informasi Warga RT.04 RW.02 Kelurahan Jogosari
            </p>
          </div>

          {isPengurus && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenEdit}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profil RT</span>
              </button>
            </div>
          )}
        </div>

        {/* Sambutan Ketua RT */}
        <div className="pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-2">
            Sambutan / Pengantar RT
          </h2>
          {profile.sambutan ? (
            <p className="text-stone-800 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {profile.sambutan}
            </p>
          ) : isPengurus ? (
            <div className="p-4 bg-stone-50 border border-dashed border-stone-300 rounded-lg text-stone-500 text-sm flex items-center justify-between">
              <span>(Bagian sambutan belum diisi. Anda dapat mengisinya sendiri melalui tombol Edit Profil).</span>
              <button
                onClick={handleOpenEdit}
                className="text-emerald-700 hover:text-emerald-800 font-medium text-xs underline cursor-pointer"
              >
                Isi Sambutan
              </button>
            </div>
          ) : (
            <p className="text-stone-500 text-sm italic">
              Selamat datang di portal informasi resmi warga Lingkungan Jogonalan RT.04 RW.02 Kelurahan Jogosari.
            </p>
          )}
        </div>
      </div>

      {/* Visi & Misi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-stone-900 text-base">Visi RT.04</h3>
          </div>
          {profile.visi ? (
            <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">{profile.visi}</p>
          ) : (
            <p className="text-stone-400 text-xs italic">
              Visi belum diisi. Klik "Edit Profil" untuk menulis visi lingkungan RT.04.
            </p>
          )}
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-stone-900 text-base">Misi RT.04</h3>
          </div>
          {profile.misi ? (
            <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">{profile.misi}</p>
          ) : (
            <p className="text-stone-400 text-xs italic">
              Misi belum diisi. Klik "Edit Profil" untuk menulis misi lingkungan RT.04.
            </p>
          )}
        </div>
      </div>

      {/* Struktur Kepengurusan RT */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
          <div>
            <h3 className="font-bold text-stone-900 text-lg">Struktur Kepengurusan RT.04 RW.02</h3>
            <p className="text-xs text-stone-500 mt-0.5">Pengurus Lingkungan Jogonalan Periode Aktif</p>
          </div>
          {isPengurus && (
            <button
              onClick={handleOpenEdit}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
            >
              Ubah Pengurus
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Ketua RT */}
          <div className="p-4 rounded-lg border border-stone-200 bg-stone-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500 block">
                  Ketua RT
                </span>
                <span className="font-semibold text-stone-900 text-sm block">
                  {profile.ketuaRt || '(Belum diisi)'}
                </span>
              </div>
            </div>
          </div>

          {/* Sekretaris */}
          <div className="p-4 rounded-lg border border-stone-200 bg-stone-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500 block">
                  Sekretaris
                </span>
                <span className="font-semibold text-stone-900 text-sm block">
                  {profile.sekretaris || '(Belum diisi)'}
                </span>
              </div>
            </div>
          </div>

          {/* Bendahara */}
          <div className="p-4 rounded-lg border border-stone-200 bg-stone-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500 block">
                  Bendahara
                </span>
                <span className="font-semibold text-stone-900 text-sm block">
                  {profile.bendahara || '(Belum diisi)'}
                </span>
              </div>
            </div>
          </div>

          {/* Seksi Keamanan */}
          <div className="p-4 rounded-lg border border-stone-200 bg-stone-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-800 flex items-center justify-center font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500 block">
                  Seksi Keamanan
                </span>
                <span className="font-semibold text-stone-900 text-sm block">
                  {profile.seksiKeamanan || '(Belum diisi)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Layanan & Kontak RT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-stone-900 text-sm">Kontak / WhatsApp RT</h4>
              <p className="text-stone-600 text-xs mt-1">
                {profile.kontakWa ? (
                  <a 
                    href={`https://wa.me/${profile.kontakWa.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-emerald-700 font-medium hover:underline inline-block mt-0.5"
                  >
                    {profile.kontakWa}
                  </a>
                ) : (
                  '(Belum diisi)'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-stone-900 text-sm">Jadwal Layanan Administrasi</h4>
              <p className="text-stone-600 text-xs mt-1">
                {profile.jadwalLayanan || '(Belum diisi - Contoh: Setiap hari 18.30 - 21.00 WIB)'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-stone-900 text-sm">Alamat Sekretariat / Balai</h4>
              <p className="text-stone-600 text-xs mt-1">
                {profile.alamatSekretariat || '(Belum diisi - Contoh: Rumah Ketua RT.04 Jogonalan)'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Profil RT */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900">Edit Profil RT.04 RW.02</h3>
                <p className="text-xs text-stone-500">Isi data profil lingkungan Jogonalan Anda sendiri</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Nama Lingkungan / RT</label>
                  <input
                    type="text"
                    value={formData.namaRt}
                    onChange={(e) => setFormData({ ...formData, namaRt: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: RT.04 RW.02 Lingkungan Jogonalan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Kontak WhatsApp RT</label>
                  <input
                    type="text"
                    value={formData.kontakWa}
                    onChange={(e) => setFormData({ ...formData, kontakWa: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: 081234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Sambutan / Pengantar RT</label>
                <textarea
                  rows={3}
                  value={formData.sambutan}
                  onChange={(e) => setFormData({ ...formData, sambutan: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Tuliskan kata sambutan atau informasi pengantar warga..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Visi RT</label>
                  <textarea
                    rows={2}
                    value={formData.visi}
                    onChange={(e) => setFormData({ ...formData, visi: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Tuliskan visi..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Misi RT</label>
                  <textarea
                    rows={2}
                    value={formData.misi}
                    onChange={(e) => setFormData({ ...formData, misi: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Tuliskan misi..."
                  />
                </div>
              </div>

              <div className="border-t border-stone-200 pt-3">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Nama-Nama Pengurus RT
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Nama Ketua RT</label>
                    <input
                      type="text"
                      value={formData.ketuaRt}
                      onChange={(e) => setFormData({ ...formData, ketuaRt: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Nama Ketua RT..."
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Nama Sekretaris</label>
                    <input
                      type="text"
                      value={formData.sekretaris}
                      onChange={(e) => setFormData({ ...formData, sekretaris: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Nama Sekretaris..."
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Nama Bendahara</label>
                    <input
                      type="text"
                      value={formData.bendahara}
                      onChange={(e) => setFormData({ ...formData, bendahara: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Nama Bendahara..."
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Seksi Keamanan</label>
                    <input
                      type="text"
                      value={formData.seksiKeamanan}
                      onChange={(e) => setFormData({ ...formData, seksiKeamanan: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Nama Seksi Keamanan..."
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-200 pt-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Jadwal Layanan Warga</label>
                  <input
                    type="text"
                    value={formData.jadwalLayanan}
                    onChange={(e) => setFormData({ ...formData, jadwalLayanan: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Setiap Hari 19.00 - 21.00 WIB"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Alamat Sekretariat</label>
                  <input
                    type="text"
                    value={formData.alamatSekretariat}
                    onChange={(e) => setFormData({ ...formData, alamatSekretariat: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Rumah Bapak RT, Jogonalan Gg. 2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Profil</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
