import { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, X, Check, ShieldCheck, AlertCircle } from 'lucide-react';

interface PengurusAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPassword: string;
  onLoginSuccess: () => void;
}

export function PengurusLoginModal({
  isOpen,
  onClose,
  currentPassword,
  onLoginSuccess,
}: PengurusAuthModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === currentPassword) {
      setError(null);
      setPassword('');
      onLoginSuccess();
      onClose();
    } else {
      setError('Password salah. Silakan coba lagi atau gunakan password default.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 border border-stone-200">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Mode Pengurus RT</h3>
              <p className="text-[11px] text-stone-500">Akses khusus untuk mengedit isi website</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-600 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Masukkan Password Pengurus
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Ketik password..."
                className="w-full text-xs px-3 py-2 pr-9 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {error ? (
              <div className="flex items-center gap-1 text-[11px] text-red-600 mt-1.5">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{error}</span>
              </div>
            ) : (
              <p className="text-[11px] text-stone-400 mt-1.5">
                Password default bawaan: <code className="bg-stone-100 px-1 py-0.5 rounded text-emerald-800 font-mono font-bold">adminrt04</code>
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Masuk Pengurus</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPassword: string;
  onPasswordChanged: (newPassword: string) => void;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
  currentPassword,
  onPasswordChanged,
}: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPassword !== currentPassword) {
      setError('Password lama tidak cocok.');
      return;
    }
    if (newPassword.length < 4) {
      setError('Password baru minimal 4 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password baru tidak cocok.');
      return;
    }

    setError(null);
    onPasswordChanged(newPassword);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 border border-stone-200">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Ganti Password Pengurus</h3>
              <p className="text-[11px] text-stone-500">Atur password khusus pengurus RT.04</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-600 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Password Saat Ini *
            </label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setError(null);
              }}
              className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Masukkan password lama"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Password Baru *
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError(null);
              }}
              className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Minimal 4 karakter"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Ulangi Password Baru *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError(null);
              }}
              className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ketik ulang password baru"
            />
          </div>

          {error && (
            <div className="flex items-center gap-1 text-[11px] text-red-600 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan Password Baru</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
