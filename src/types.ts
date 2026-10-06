export interface RTProfile {
  namaRt: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  ketuaRt: string;
  sekretaris: string;
  bendahara: string;
  seksiKeamanan: string;
  visi: string;
  misi: string;
  sambutan: string;
  kontakWa: string;
  alamatSekretariat: string;
  jadwalLayanan: string;
  jumlahKk: string;
  jumlahWarga: string;
}

export interface PengumumanItem {
  id: string;
  judul: string;
  tanggal: string;
  kategori: string;
  isi: string;
  penulis: string;
  penting?: boolean;
}

export interface GaleriItem {
  id: string;
  judul: string;
  tanggal: string;
  fotoUrl: string;
  keterangan: string;
}

export interface UmkmItem {
  id: string;
  namaUsaha: string;
  pemilik: string;
  kategori: string;
  nomorHp: string;
  alamat: string;
  deskripsi: string;
  fotoUrl?: string;
  isSponsor?: boolean;
}

export interface AppSettings {
  adminPassword?: string;
}
