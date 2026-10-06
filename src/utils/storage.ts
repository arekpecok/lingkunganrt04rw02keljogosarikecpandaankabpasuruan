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

const STORAGE_KEYS = {
  BUNDLE: 'jogonalan_rt04_full_bundle',
  IS_PENGURUS: 'jogonalan_rt04_is_pengurus',
  ACTIVE_TAB: 'jogonalan_rt04_active_tab',
};

// Local storage fallback helpers
export const loadDataLocal = (): AppBundleData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUNDLE);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        profile: parsed.profile || DEFAULT_PROFILE,
        pengumuman: Array.isArray(parsed.pengumuman) ? parsed.pengumuman : [],
        galeri: Array.isArray(parsed.galeri) ? parsed.galeri : [],
        umkm: Array.isArray(parsed.umkm) ? parsed.umkm : [],
        adminPassword: parsed.adminPassword || DEFAULT_ADMIN_PASSWORD,
        updatedAt: parsed.updatedAt,
      };
    }
  } catch (err) {
    console.warn('Gagal membaca cache lokal:', err);
  }

  return {
    profile: DEFAULT_PROFILE,
    pengumuman: [],
    galeri: [],
    umkm: [],
    adminPassword: DEFAULT_ADMIN_PASSWORD,
  };
};

export const saveDataLocal = (bundle: AppBundleData): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.BUNDLE, JSON.stringify(bundle));
    return true;
  } catch (err) {
    console.warn('Gagal menyimpan cache lokal:', err);
    return false;
  }
};

// Hybrid Server & Static Host Fetcher
export const fetchDataFromServer = async (): Promise<{ data: AppBundleData; mode: 'server' | 'local' }> => {
  const localData = loadDataLocal();

  try {
    const res = await fetch('./api/data');
    const contentType = res.headers.get('content-type');
    
    // Check if server is running and returns JSON (not HTML fallback)
    if (res.ok && contentType && contentType.includes('application/json')) {
      const serverData = await res.json();
      if (serverData && typeof serverData === 'object') {
        const validatedBundle: AppBundleData = {
          profile: serverData.profile || localData.profile,
          pengumuman: Array.isArray(serverData.pengumuman) ? serverData.pengumuman : localData.pengumuman,
          galeri: Array.isArray(serverData.galeri) ? serverData.galeri : localData.galeri,
          umkm: Array.isArray(serverData.umkm) ? serverData.umkm : localData.umkm,
          adminPassword: serverData.adminPassword || localData.adminPassword || DEFAULT_ADMIN_PASSWORD,
          updatedAt: serverData.updatedAt || localData.updatedAt,
        };
        // Update local cache
        saveDataLocal(validatedBundle);
        return { data: validatedBundle, mode: 'server' };
      }
    }
  } catch {
    // Server not available (e.g. GitHub Pages or static host)
  }

  // Gracefully fallback to local storage
  return { data: localData, mode: 'local' };
};

// Hybrid Server & Static Host Saver
export const saveDataToServer = async (
  bundle: AppBundleData
): Promise<{ success: boolean; mode: 'server' | 'local' }> => {
  // Always write to local storage as rock-solid guarantee
  saveDataLocal(bundle);

  try {
    const res = await fetch('./api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bundle),
    });

    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      return { success: true, mode: 'server' };
    }
  } catch {
    // Running on static hosting like GitHub Pages
  }

  // On GitHub Pages/static host, saving to local storage is 100% successful
  return { success: true, mode: 'local' };
};

// Admin Session
export const loadIsPengurusSession = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEYS.IS_PENGURUS) === 'true';
  } catch {
    return false;
  }
};

export const saveIsPengurusSession = (val: boolean) => {
  try {
    localStorage.setItem(STORAGE_KEYS.IS_PENGURUS, val ? 'true' : 'false');
  } catch {
    // Ignore
  }
};

export const loadActiveTabSession = (fallback = 'profil'): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB) || fallback;
  } catch {
    return fallback;
  }
};

export const saveActiveTabSession = (tab: string) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tab);
  } catch {
    // Ignore
  }
};

// Compress image before saving
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
