import { useState, useEffect } from 'react';
import { 
  RTProfile, 
  PengumumanItem, 
  GaleriItem, 
  UmkmItem 
} from './types';
import { 
  fetchDataFromServer, 
  saveDataToServer, 
  loadIsPengurusSession,
  saveIsPengurusSession,
  loadActiveTabSession,
  saveActiveTabSession,
  DEFAULT_PROFILE,
  DEFAULT_ADMIN_PASSWORD,
  AppBundleData
} from './utils/storage';
import ProfilRT from './components/ProfilRT';
import PengumumanRT from './components/PengumumanRT';
import GaleriRT from './components/GaleriRT';
import SponsorUmkm from './components/SponsorUmkm';
import QuickFillModal from './components/QuickFillModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import { PengurusLoginModal, ChangePasswordModal } from './components/PengurusAuthModal';
import heroImg from './assets/images/jogonalan_neighborhood_hero_1791301604982.jpg';
import { 
  Zap, 
  Megaphone, 
  Image as ImageIcon, 
  Store, 
  Download, 
  UploadCloud, 
  RotateCcw,
  Menu,
  X,
  Server,
  CheckCircle2,
  Lock,
  Unlock,
  KeyRound,
  LogOut,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

type ActiveTab = 'profil' | 'pengumuman' | 'galeri' | 'umkm';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('profil');
  const [profile, setProfile] = useState<RTProfile>(DEFAULT_PROFILE);
  const [pengumuman, setPengumuman] = useState<PengumumanItem[]>([]);
  const [galeri, setGaleri] = useState<GaleriItem[]>([]);
  const [umkm, setUmkm] = useState<UmkmItem[]>([]);
  const [isPengurus, setIsPengurus] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>(DEFAULT_ADMIN_PASSWORD);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isQuickFillOpen, setIsQuickFillOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Status
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string>('Baru saja');
  const [serverStatus, setServerStatus] = useState<'connected' | 'saving' | 'error'>('connected');

  // Trigger feedback toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    const date = new Date();
    setLastSaved(date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Helper to persist strictly to Server AI Studio (/data/db.json) - Lapis 1 Saja
  const persistToServer = async (
    p: RTProfile,
    ann: PengumumanItem[],
    gal: GaleriItem[],
    u: UmkmItem[],
    customPassword: string,
    successMsg: string
  ) => {
    setServerStatus('saving');
    const bundle: AppBundleData = {
      profile: p,
      pengumuman: ann,
      galeri: gal,
      umkm: u,
      adminPassword: customPassword,
    };
    const ok = await saveDataToServer(bundle);
    if (ok) {
      setServerStatus('connected');
      triggerToast(successMsg);
    } else {
      setServerStatus('error');
      triggerToast('Gagal menyimpan ke server!');
    }
  };

  // Load data strictly from Server AI Studio (Lapis 1) on mount
  useEffect(() => {
    const savedTab = loadActiveTabSession('profil') as ActiveTab;
    if (['profil', 'pengumuman', 'galeri', 'umkm'].includes(savedTab)) {
      setActiveTab(savedTab);
    }
    setIsPengurus(loadIsPengurusSession());

    setIsLoading(true);
    fetchDataFromServer().then((serverData) => {
      setIsLoading(false);
      if (serverData) {
        setServerStatus('connected');
        if (serverData.adminPassword) {
          setAdminPassword(serverData.adminPassword);
        }
        if (serverData.profile) {
          setProfile(serverData.profile);
        }
        if (Array.isArray(serverData.pengumuman)) {
          setPengumuman(serverData.pengumuman);
        }
        if (Array.isArray(serverData.galeri)) {
          setGaleri(serverData.galeri);
        }
        if (Array.isArray(serverData.umkm)) {
          setUmkm(serverData.umkm);
        }
        if (serverData.updatedAt) {
          const date = new Date(serverData.updatedAt);
          setLastSaved(date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      } else {
        setServerStatus('error');
      }
    });
  }, []);

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    saveActiveTabSession(tab);
  };

  // Auth Handlers
  const handleLoginSuccess = () => {
    setIsPengurus(true);
    saveIsPengurusSession(true);
    triggerToast('Berhasil masuk Mode Pengurus RT.04!');
  };

  const handleLogout = () => {
    setIsPengurus(false);
    saveIsPengurusSession(false);
    triggerToast('Keluar dari Mode Pengurus. Mode warga aktif.');
  };

  const handlePasswordChanged = (newPw: string) => {
    setAdminPassword(newPw);
    persistToServer(profile, pengumuman, galeri, umkm, newPw, 'Password pengurus diperbarui di Server AI Studio!');
  };

  // Handlers for Profile
  const handleUpdateProfile = (updated: RTProfile) => {
    setProfile(updated);
    persistToServer(updated, pengumuman, galeri, umkm, adminPassword, 'Profil RT tersimpan di Server AI Studio!');
  };

  // Handlers for Pengumuman
  const handleAddPengumuman = (item: PengumumanItem) => {
    const updated = [item, ...pengumuman];
    setPengumuman(updated);
    persistToServer(profile, updated, galeri, umkm, adminPassword, 'Pengumuman baru tersimpan di Server AI Studio!');
  };

  const handleEditPengumuman = (updatedItem: PengumumanItem) => {
    const updated = pengumuman.map((item) => (item.id === updatedItem.id ? updatedItem : item));
    setPengumuman(updated);
    persistToServer(profile, updated, galeri, umkm, adminPassword, 'Pengumuman diperbarui di Server AI Studio!');
  };

  const handleDeletePengumuman = (id: string) => {
    const updated = pengumuman.filter((item) => item.id !== id);
    setPengumuman(updated);
    persistToServer(profile, updated, galeri, umkm, adminPassword, 'Pengumuman dihapus dari Server AI Studio.');
  };

  // Handlers for Galeri
  const handleAddGaleri = (item: GaleriItem) => {
    const updated = [item, ...galeri];
    setGaleri(updated);
    persistToServer(profile, pengumuman, updated, umkm, adminPassword, 'Foto galeri tersimpan di Server AI Studio!');
  };

  const handleEditGaleri = (updatedItem: GaleriItem) => {
    const updated = galeri.map((item) => (item.id === updatedItem.id ? updatedItem : item));
    setGaleri(updated);
    persistToServer(profile, pengumuman, updated, umkm, adminPassword, 'Foto galeri diperbarui di Server AI Studio!');
  };

  const handleDeleteGaleri = (id: string) => {
    const updated = galeri.filter((item) => item.id !== id);
    setGaleri(updated);
    persistToServer(profile, pengumuman, updated, umkm, adminPassword, 'Foto galeri dihapus dari Server AI Studio.');
  };

  // Handlers for UMKM
  const handleAddUmkm = (item: UmkmItem) => {
    const updated = [item, ...umkm];
    setUmkm(updated);
    persistToServer(profile, pengumuman, galeri, updated, adminPassword, 'Data UMKM tersimpan di Server AI Studio!');
  };

  const handleEditUmkm = (updatedItem: UmkmItem) => {
    const updated = umkm.map((item) => (item.id === updatedItem.id ? updatedItem : item));
    setUmkm(updated);
    persistToServer(profile, pengumuman, galeri, updated, adminPassword, 'Data UMKM diperbarui di Server AI Studio!');
  };

  const handleDeleteUmkm = (id: string) => {
    const updated = umkm.filter((item) => item.id !== id);
    setUmkm(updated);
    persistToServer(profile, pengumuman, galeri, updated, adminPassword, 'Data UMKM dihapus dari Server AI Studio.');
  };

  // Quick fill handler
  const handleSaveQuick = (data: {
    profile: RTProfile;
    announcement?: PengumumanItem;
    gallery?: GaleriItem;
    umkm?: UmkmItem;
  }) => {
    setProfile(data.profile);

    let updatedAnn = pengumuman;
    if (data.announcement) {
      updatedAnn = [data.announcement, ...pengumuman];
      setPengumuman(updatedAnn);
    }

    let updatedGal = galeri;
    if (data.gallery) {
      updatedGal = [data.gallery, ...galeri];
      setGaleri(updatedGal);
    }

    let updatedUmkm = umkm;
    if (data.umkm) {
      updatedUmkm = [data.umkm, ...umkm];
      setUmkm(updatedUmkm);
    }

    persistToServer(data.profile, updatedAnn, updatedGal, updatedUmkm, adminPassword, 'Semua data pengisian cepat tersimpan di Server AI Studio!');
  };

  // Backup & Restore (ONLY ACCESSIBLE BY PENGURUS)
  const handleExportData = () => {
    const bundle = {
      profile,
      pengumuman,
      galeri,
      umkm,
      adminPassword,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_jogonalan_rt04_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Cadangan berkas berhasil diunduh!');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const bundle = JSON.parse(event.target?.result as string);
        const newProf = bundle.profile || profile;
        const newAnn = Array.isArray(bundle.pengumuman) ? bundle.pengumuman : pengumuman;
        const newGal = Array.isArray(bundle.galeri) ? bundle.galeri : galeri;
        const newUmkm = Array.isArray(bundle.umkm) ? bundle.umkm : umkm;
        const newPw = bundle.adminPassword || adminPassword;

        setProfile(newProf);
        setPengumuman(newAnn);
        setGaleri(newGal);
        setUmkm(newUmkm);
        setAdminPassword(newPw);

        persistToServer(newProf, newAnn, newGal, newUmkm, newPw, 'Semua data cadangan dipulihkan ke Server AI Studio!');
      } catch (err) {
        triggerToast('Format berkas tidak sesuai JSON cadangan.');
      }
    };
    reader.readAsText(file);
  };

  const executeResetData = () => {
    setProfile(DEFAULT_PROFILE);
    setPengumuman([]);
    setGaleri([]);
    setUmkm([]);
    persistToServer(DEFAULT_PROFILE, [], [], [], DEFAULT_ADMIN_PASSWORD, 'Data di server AI Studio berhasil dikosongkan.');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Real-time Save Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-stone-900 text-white text-xs font-medium rounded-xl shadow-xl border border-stone-800 transition-all">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => handleSelectTab('profil')}
          className="text-base sm:text-lg font-serif font-bold tracking-tight text-stone-900 text-left hover:text-emerald-800 transition-colors cursor-pointer"
        >
          RT.04 RW.02 Jogonalan
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wide uppercase">
          <button
            onClick={() => handleSelectTab('profil')}
            className={`py-1 transition-colors cursor-pointer ${
              activeTab === 'profil'
                ? 'text-emerald-800 border-b-2 border-emerald-700'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Profil RT
          </button>
          <button
            onClick={() => handleSelectTab('pengumuman')}
            className={`py-1 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pengumuman'
                ? 'text-emerald-800 border-b-2 border-emerald-700'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Pengumuman RT</span>
            {pengumuman.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-stone-200 rounded-full text-stone-800">
                {pengumuman.length}
              </span>
            )}
          </button>
          <button
            onClick={() => handleSelectTab('galeri')}
            className={`py-1 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'galeri'
                ? 'text-emerald-800 border-b-2 border-emerald-700'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Galeri RT</span>
            {galeri.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-stone-200 rounded-full text-stone-800">
                {galeri.length}
              </span>
            )}
          </button>
          <button
            onClick={() => handleSelectTab('umkm')}
            className={`py-1 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'umkm'
                ? 'text-emerald-800 border-b-2 border-emerald-700'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Sponsor & UMKM</span>
            {umkm.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-stone-200 rounded-full text-stone-800">
                {umkm.length}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Actions & Mode Pengurus Toggle */}
        <div className="flex items-center gap-2">
          {isPengurus ? (
            /* Mode Pengurus Active Actions */
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mode Pengurus</span>
              </span>

              <button
                onClick={() => setIsQuickFillOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                title="Isi Cepat 1 Menit"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Isi Cepat</span>
              </button>

              <button
                onClick={() => setIsChangePasswordModalOpen(true)}
                className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-stone-700 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded-lg flex items-center gap-1 cursor-pointer"
                title="Ganti Password Pengurus"
              >
                <KeyRound className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden md:inline">Ganti Password</span>
              </button>

              <button
                onClick={handleLogout}
                className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg flex items-center gap-1 cursor-pointer"
                title="Keluar Mode Pengurus"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : (
            /* Regular Citizen View -> Button to Login Pengurus */
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 border border-stone-300 rounded-lg transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-stone-500" />
              <span>Login Pengurus</span>
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg border border-stone-200 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 py-3 space-y-2 shadow-md">
          <button
            onClick={() => {
              handleSelectTab('profil');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === 'profil' ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700'
            }`}
          >
            1. Profil RT
          </button>
          <button
            onClick={() => {
              handleSelectTab('pengumuman');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between ${
              activeTab === 'pengumuman' ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700'
            }`}
          >
            <span>2. Pengumuman RT</span>
            <span className="text-[10px] text-stone-500 font-mono">({pengumuman.length})</span>
          </button>
          <button
            onClick={() => {
              handleSelectTab('galeri');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between ${
              activeTab === 'galeri' ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700'
            }`}
          >
            <span>3. Galeri RT</span>
            <span className="text-[10px] text-stone-500 font-mono">({galeri.length})</span>
          </button>
          <button
            onClick={() => {
              handleSelectTab('umkm');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between ${
              activeTab === 'umkm' ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700'
            }`}
          >
            <span>4. Sponsor & UMKM</span>
            <span className="text-[10px] text-stone-500 font-mono">({umkm.length})</span>
          </button>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
            {isPengurus ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Unlock className="w-3.5 h-3.5" /> Mode Pengurus Aktif
              </span>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium"
              >
                <Lock className="w-3.5 h-3.5" /> Masuk Sebagai Pengurus
              </button>
            )}
          </div>
        </div>
      )}

      {/* Ribbon Status (Lapis 1 - Server AI Studio Tunggal) */}
      {isPengurus ? (
        <div className="bg-emerald-900 text-emerald-100 text-xs px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-300" />
            <span>
              <strong>Penyimpanan Tunggal (Lapis 1):</strong> Data disimpan langsung di berkas server <code>/data/db.json</code> Google AI Studio.
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-emerald-200">
            <span>Status Server: <strong className="text-emerald-300">{serverStatus === 'connected' ? 'Tersambung Aktif' : serverStatus === 'saving' ? 'Menyimpan...' : 'Periksa Server'}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Terakhir disimpan: <strong>{lastSaved}</strong></span>
          </div>
        </div>
      ) : (
        <div className="bg-stone-800 text-stone-200 text-xs px-4 sm:px-8 py-1.5 flex items-center justify-between gap-2 border-b border-stone-700">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Portal Keterbukaan Informasi Warga RT.04 RW.02 Jogonalan, Jogosari, Pandaan, Pasuruan.</span>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
          >
            Akses Pengurus RT
          </button>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative bg-stone-900 text-white overflow-hidden">
        {/* Background Image with Measured Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Lingkungan Jogonalan"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-stone-900/50" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <span>Sistem Keterbukaan Informasi Warga</span>
              <span aria-hidden="true">·</span>
              <span>Pandaan Pasuruan</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight text-balance">
              Lingkungan Jogonalan RT.04 RW.02
            </h1>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Kelurahan Jogosari, Kecamatan Pandaan, Kabupaten Pasuruan, Jawa Timur. Portal layanan mandiri warga untuk profil lingkungan, transparansi pengumuman, dokumentasi galeri, serta promosi UMKM warga.
            </p>
          </div>

          {/* Quick Metrics / Status Tiers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-stone-800">
            <div 
              onClick={() => handleSelectTab('profil')}
              className="bg-stone-900/80 border border-stone-800/80 rounded-xl p-3.5 hover:border-emerald-600 transition-colors cursor-pointer"
            >
              <span className="text-[11px] text-stone-400 uppercase tracking-wide block">Wilayah RT</span>
              <span className="text-sm sm:text-base font-bold text-white block mt-0.5 truncate">
                RT.04 RW.02
              </span>
            </div>

            <div 
              onClick={() => handleSelectTab('pengumuman')}
              className="bg-stone-900/80 border border-stone-800/80 rounded-xl p-3.5 hover:border-emerald-600 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-stone-400 uppercase tracking-wide block">Pengumuman</span>
                <Megaphone className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-sm sm:text-base font-bold text-white font-mono tabular-nums block mt-0.5">
                {pengumuman.length} Informasi
              </span>
            </div>

            <div 
              onClick={() => handleSelectTab('galeri')}
              className="bg-stone-900/80 border border-stone-800/80 rounded-xl p-3.5 hover:border-emerald-600 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-stone-400 uppercase tracking-wide block">Galeri Foto</span>
                <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <span className="text-sm sm:text-base font-bold text-white font-mono tabular-nums block mt-0.5">
                {galeri.length} Dokumentasi
              </span>
            </div>

            <div 
              onClick={() => handleSelectTab('umkm')}
              className="bg-stone-900/80 border border-stone-800/80 rounded-xl p-3.5 hover:border-emerald-600 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-stone-400 uppercase tracking-wide block">Sponsor & UMKM</span>
                <Store className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className="text-sm sm:text-base font-bold text-white font-mono tabular-nums block mt-0.5">
                {umkm.length} Usaha
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* NAVIGATION TABS BAR */}
      <div className="border-b border-stone-200 bg-white sticky top-[57px] z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none">
            <button
              onClick={() => handleSelectTab('profil')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'profil'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              1. Halaman Profil RT
            </button>
            <button
              onClick={() => handleSelectTab('pengumuman')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'pengumuman'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <span>2. Halaman Pengumuman RT</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeTab === 'pengumuman' ? 'bg-emerald-950 text-emerald-200' : 'bg-stone-200 text-stone-700'}`}>
                {pengumuman.length}
              </span>
            </button>
            <button
              onClick={() => handleSelectTab('galeri')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'galeri'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <span>3. Halaman Galeri RT</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeTab === 'galeri' ? 'bg-emerald-950 text-emerald-200' : 'bg-stone-200 text-stone-700'}`}>
                {galeri.length}
              </span>
            </button>
            <button
              onClick={() => handleSelectTab('umkm')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'umkm'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <span>4. Halaman Sponsor & UMKM</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeTab === 'umkm' ? 'bg-emerald-950 text-emerald-200' : 'bg-stone-200 text-stone-700'}`}>
                {umkm.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
            <p className="text-xs">Memuat data dari Server AI Studio...</p>
          </div>
        ) : (
          <>
            {activeTab === 'profil' && (
              <ProfilRT
                profile={profile}
                onUpdate={handleUpdateProfile}
                isPengurus={isPengurus}
              />
            )}

            {activeTab === 'pengumuman' && (
              <PengumumanRT
                items={pengumuman}
                onAdd={handleAddPengumuman}
                onEdit={handleEditPengumuman}
                onDelete={handleDeletePengumuman}
                isPengurus={isPengurus}
              />
            )}

            {activeTab === 'galeri' && (
              <GaleriRT
                items={galeri}
                onAdd={handleAddGaleri}
                onEdit={handleEditGaleri}
                onDelete={handleDeleteGaleri}
                isPengurus={isPengurus}
              />
            )}

            {activeTab === 'umkm' && (
              <SponsorUmkm
                items={umkm}
                onAdd={handleAddUmkm}
                onEdit={handleEditUmkm}
                onDelete={handleDeleteUmkm}
                isPengurus={isPengurus}
              />
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-stone-200 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-serif font-bold text-stone-900 text-sm">
                Sistem Informasi Warga RT.04 RW.02 Lingkungan Jogonalan
              </h4>
              <p className="text-stone-500 text-xs mt-1">
                Kelurahan Jogosari, Kecamatan Pandaan, Kabupaten Pasuruan, Jawa Timur
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-stone-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Penyimpanan: Server Tunggal AI Studio (<code>/data/db.json</code>)</span>
              </div>
            </div>

            {/* BACKUP & RESTORE BUTTONS: ONLY VISIBLE TO PENGURUS */}
            {isPengurus ? (
              <div className="flex flex-wrap items-center gap-3 p-3 bg-stone-50 border border-stone-200 rounded-xl">
                <span className="text-[11px] font-semibold uppercase text-stone-500 tracking-wider w-full sm:w-auto">
                  Alat Kelola Cadangan Server:
                </span>
                <button
                  onClick={handleExportData}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 cursor-pointer shadow-2xs"
                  title="Unduh cadangan data server ke file JSON"
                >
                  <Download className="w-3.5 h-3.5 text-stone-500" />
                  <span>Unduh Cadangan Server (JSON)</span>
                </button>

                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 cursor-pointer shadow-2xs">
                  <UploadCloud className="w-3.5 h-3.5 text-stone-500" />
                  <span>Pulihkan ke Server (Restore)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-stone-400 hover:text-red-600 cursor-pointer"
                  title="Reset Semua Data Server"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Server</span>
                </button>
              </div>
            ) : (
              <div className="text-xs text-stone-500 text-right">
                <span>Pelayanan Warga RT.04 RW.02 Lingkungan Jogonalan</span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2">
            <span>Portal Keterbukaan Informasi Warga Jogonalan · Pandaan · Pasuruan</span>
            <span>{isPengurus ? 'Mode Pengurus RT Aktif' : 'Mode Tampilan Warga (Hanya Baca)'}</span>
          </div>
        </div>
      </footer>

      {/* In-App Confirmation Modal for Server Reset */}
      <ConfirmDeleteModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={executeResetData}
        title="Reset Semua Data Server?"
        message="PERINGATAN KHUSUS PENGURUS: Seluruh isi data profil RT, pengumuman, galeri foto, dan UMKM di berkas database server AI Studio (/data/db.json) akan dikosongkan. Apakah Anda yakin ingin melanjutkan?"
        confirmLabel="Ya, Kosongkan Data"
      />

      {/* 1-Minute Quick Fill Wizard Modal (Pengurus Only) */}
      {isPengurus && (
        <QuickFillModal
          isOpen={isQuickFillOpen}
          onClose={() => setIsQuickFillOpen(false)}
          profile={profile}
          onSaveQuick={handleSaveQuick}
        />
      )}

      {/* Login Mode Pengurus Modal */}
      <PengurusLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentPassword={adminPassword}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        currentPassword={adminPassword}
        onPasswordChanged={handlePasswordChanged}
      />
    </div>
  );
}
