import { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  initialMode = 'login',
  reasonMessage = '',
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('তরুণ লেখক ও সাহিত্যপ্রেমী');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await onLogin(email, password);
        if (!res.ok) {
          setError(res.message || 'লগইন ব্যর্থ হয়েছে।');
        } else {
          setEmail('');
          setPassword('');
          onClose();
        }
      } else {
        const res = await onRegister({ name, email, password, bio });
        if (!res.ok) {
          setError(res.message || 'নিবন্ধন ব্যর্থ হয়েছে।');
        } else {
          setName('');
          setEmail('');
          setPassword('');
          onClose();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-[#FDFBF7] border-2 border-[#D8CBB8] shadow-2xl overflow-hidden my-8"
      >
        {/* Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#9E2A2B] to-[#6E1A1B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {mode === 'login' ? (
              <LogIn className="w-5 h-5 text-[#F3C663]" />
            ) : (
              <UserPlus className="w-5 h-5 text-[#F3C663]" />
            )}
            <h2 className="font-heading text-xl font-bold">
              {mode === 'login'
                ? 'সাহিত্যকাননে লগইন করুন'
                : 'নতুন লেখক অ্যাকাউন্ট খুলুন'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Reason Banner if redirected from Posting or Admin */}
          {reasonMessage && (
            <div className="p-3.5 rounded-xl bg-[#FCF7EB] border border-[#C89D54] text-xs font-semibold text-[#78350F] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9E2A2B] shrink-0" />
              <span>{reasonMessage}</span>
            </div>
          )}

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#EFE6D5]">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#9E2A2B] text-white shadow-xs'
                  : 'text-[#4A423B] hover:text-[#1E1B18]'
              }`}
            >
              লগইন (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#9E2A2B] text-white shadow-xs'
                  : 'text-[#4A423B] hover:text-[#1E1B18]'
              }`}
            >
              নতুন নিবন্ধন (Sign Up)
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-[#2B2622] mb-1">
                  আপনার পূর্ণ নাম *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#7A6F66] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="আপনার নাম লিখুন"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D8CBB8] bg-[#FAF6F0] text-sm focus:outline-none focus:border-[#9E2A2B]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#2B2622] mb-1">
                ইমেইল ঠিকানা *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7A6F66] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="আপনার ইমেইল লিখুন"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D8CBB8] bg-[#FAF6F0] text-sm focus:outline-none focus:border-[#9E2A2B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B2622] mb-1">
                পাসওয়ার্ড *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7A6F66] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D8CBB8] bg-[#FAF6F0] text-sm focus:outline-none focus:border-[#9E2A2B]"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-[#2B2622] mb-1">
                  লেখক পরিচিতি (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="যেমন: তরুণ কবি ও গল্পকার"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB8] bg-[#FAF6F0] text-sm focus:outline-none focus:border-[#9E2A2B]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#9E2A2B] hover:bg-[#7D2021] text-white font-heading text-base font-bold shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              {loading
                ? 'অপেক্ষা করুন...'
                : mode === 'login'
                ? 'লগইন সম্পন্ন করুন'
                : 'অ্যাকাউন্ট তৈরি ও লগইন করুন'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
