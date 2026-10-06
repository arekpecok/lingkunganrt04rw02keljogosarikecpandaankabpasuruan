import { RTProfile, PengumumanItem, GaleriItem, UmkmItem } from '../types';

export const DEFAULT_PROFILE: RTProfile = {
  namaRt: 'RT.04 RW.02 Lingkungan Jogonalan',
  kelurahan: 'Jogosari',
  kecamatan: 'Pandaan',
  kabupaten: 'Pasuruan',
  ketuaRt: '',
  sekretaris: '',
  bendahara: '',
  seksiKeamanan: '',
  visi: '',
  misi: '',
  sambutan: '',
  kontakWa: '',
  alamatSekretariat: '',
  jadwalLayanan: '',
  jumlahKk: '',
  jumlahWarga: '',
};

export interface AppBundleData {
  profile: RTProfile;
  pengumuman: PengumumanItem[];
  galeri: GaleriItem[];
  umkm: UmkmItem[];
  adminPassword?: string;
  updatedAt?: string;
}

export const DEFAULT_ADMIN_PASSWORD = 'adminrt04';

// Pure Layer 1 (Server AI Studio - /data/db.json)
export const fetchDataFromServer = async (): Promise<AppBundleData | null> => {
  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.error('Gagal mengambil data dari server internal AI Studio:', err);
  }
  return null;
};

export const saveDataToServer = async (bundle: AppBundleData): Promise<boolean> => {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bundle),
    });
    return res.ok;
  } catch (err) {
    console.error('Gagal menyimpan data ke server internal AI Studio:', err);
    return false;
  }
};

// Admin Session (Session only for authentication)
const SESSION_KEYS = {
  IS_PENGURUS: 'jogonalan_session_is_pengurus',
  ACTIVE_TAB: 'jogonalan_session_active_tab',
};

export const loadIsPengurusSession = (): boolean => {
  try {
    return sessionStorage.getItem(SESSION_KEYS.IS_PENGURUS) === 'true';
  } catch {
    return false;
  }
};

export const saveIsPengurusSession = (val: boolean) => {
  try {
    sessionStorage.setItem(SESSION_KEYS.IS_PENGURUS, val ? 'true' : 'false');
  } catch {
    // Ignore session errors
  }
};

export const loadActiveTabSession = (fallback = 'profil'): string => {
  try {
    return sessionStorage.getItem(SESSION_KEYS.ACTIVE_TAB) || fallback;
  } catch {
    return fallback;
  }
};

export const saveActiveTabSession = (tab: string) => {
  try {
    sessionStorage.setItem(SESSION_KEYS.ACTIVE_TAB, tab);
  } catch {
    // Ignore
  }
};

// Compress image before sending to Server
export const compressImage = (file: File, maxWidth = 960, quality = 0.75): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => resolve(event.target?.result as string);
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};
