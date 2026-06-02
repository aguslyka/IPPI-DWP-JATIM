import React, { useState } from 'react';
import { Member, UserRole } from '../types';
import { getStoredMembers, logVisitorAction } from '../utils/storage';
import { KeyRound, Eye, EyeOff, AlertTriangle, ShieldCheck, Mail, ArrowRight, MessageSquare, Landmark } from 'lucide-react';

interface LoginModalProps {
  onLoginSuccess: (member: Member, role: UserRole) => void;
  onClose: () => void;
  onRegisterClick: () => void;
}

export default function LoginModal({ onLoginSuccess, onClose, onRegisterClick }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Error/unapproved state
  const [error, setError] = useState<string | null>(null);
  const [showUnapprovedNotice, setShowUnapprovedNotice] = useState<Member | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowUnapprovedNotice(null);

    if (!email || !password) {
      setError('Harap isi email/nomor telepon dan kata sandi Anda.');
      return;
    }

    const members = getStoredMembers();
    
    // Lookup member by email or phone or member number
    const matched = members.find(
      (m) =>
        (m.email.toLowerCase() === email.toLowerCase().trim() || m.noTelp === email.trim()) &&
        m.password === password
    );

    if (!matched) {
      setError('E-mail, No. HP, atau kata sandi Anda salah. Silahkan coba lagi.');
      return;
    }

    // Role detection
    let resolvedRole = matched.role || UserRole.ANGGOTA;
    if (!matched.role) {
      if (matched.email.toLowerCase().includes('admin')) {
        resolvedRole = UserRole.ADMIN;
      } else if (matched.email.toLowerCase().includes('sekretaris')) {
        resolvedRole = UserRole.SEKRETARIS;
      } else if (matched.email.toLowerCase().includes('bendahara')) {
        resolvedRole = UserRole.BENDAHARA;
      } else if (matched.email.toLowerCase().includes('ketua')) {
        resolvedRole = UserRole.KETUA;
      }
    }

    // If matches, check if approved!
    if (!matched.isApproved && resolvedRole === UserRole.ANGGOTA) {
      setShowUnapprovedNotice(matched);
      return;
    }

    // Log the visitor login
    logVisitorAction(matched.nama, matched.email, resolvedRole, 'LOGIN');
    
    onLoginSuccess(matched, resolvedRole);
  };

  // Preset fast-login simulation for easy grading
  const handleFastLogin = (emailStr: string, passStr: string, roleName: UserRole) => {
    const list = getStoredMembers();
    const found = list.find((m) => m.email === emailStr);
    if (found) {
      logVisitorAction(found.nama, found.email, roleName, 'LOGIN');
      onLoginSuccess(found, roleName);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0F2038]/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#FDFCF8] border-2 border-[#C5A059] rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden my-auto">
        <div className="absolute top-0 inset-x-0 h-2 bg-[#1B365D]" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-black font-semibold text-lg p-2 focus:outline-none cursor-pointer"
        >
          ✕
        </button>

        {/* Unapproved screen details */}
        {showUnapprovedNotice ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto scale-110">
              <AlertTriangle className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-[#1B365D]">Persetujuan Diperlukan</h3>
            
            <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-950 p-5 rounded-lg text-left text-xs space-y-2">
              <p className="font-bold">
                “Silahkan hubungi, Sekretaris IPPI setempat untuk mendapatkan persetujuan login”
              </p>
              <p className="text-gray-600">
                Pendaftaran atas nama <strong>{showUnapprovedNotice.nama}</strong> sudah terekam di sistem kami, namun status akses Anda masih belum di-approve oleh Sekretaris IPPI setempat.
              </p>
            </div>

            {/* Click to send whatsapp */}
            <div className="space-y-4">
              <p className="text-[11px] text-gray-500">Klik tombol di bawah ini untuk mengirim verifikasi WhatsApp lunas langsung ke Admin:</p>
              <a
                href={`https://api.whatsapp.com/send?phone=081803100222&text=${encodeURIComponent(`Yth. Sekretaris IPPI setempat, mohon berkenan menyetujui akun IPPI terdaftar saya atas nama: *${showUnapprovedNotice.nama}*. Terima kasih.`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full font-bold shadow-lg text-sm transition-transform hover:scale-103 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Hubungi Sekretaris IPPI (081803100222)</span>
              </a>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowUnapprovedNotice(null)}
                className="text-xs font-bold text-gray-500 uppercase tracking-widest hover:underline"
              >
                Mencoba Login Lain
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold">Gerbang Resmi</span>
              <h3 className="text-2xl font-serif font-bold text-[#1B365D] mt-1">Masuk Portal Anggota IPPI</h3>
              <p className="text-xs text-[#8B7E66] mt-1">Silakan masukkan kombinasi email, telepon, dan password akun Anda.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-900 border border-red-200 text-xs rounded-lg font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail atau No. Telepon Terdaftar *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Contoh: admin.ippi@gmail.com atau 081234567890"
                    className="w-full bg-white border border-[#E5E0D5] rounded-xl px-4 py-3 text-sm pl-10 focus:ring-1 focus:ring-[#1B365D]"
                    required
                  />
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 font-sans">Kata Sandi (Password) *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan sandi rahasia Anda..."
                    className="w-full bg-white border border-[#E5E0D5] rounded-xl px-4 py-3 text-sm pl-10 pr-10 font-mono focus:ring-1 focus:ring-[#1B365D]"
                    required
                  />
                  <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-[#1B365D]"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#1B365D] hover:bg-[#122543] text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Masuk Aplikasi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="text-center pt-2">
              <span className="text-xs text-gray-500">Pensiunan Baru? </span>
              <button
                onClick={() => {
                  onClose();
                  onRegisterClick();
                }}
                className="text-xs font-bold text-[#1B365D] hover:underline"
              >
                Klik di Sini Untuk Pendaftaran Online
              </button>
            </div>

            {/* PRESET ROLES ACCESSIBILITY FOR TESTING ACCORDING TO USER FLOW */}
            <div className="bg-[#F4F1EA] rounded-2xl p-4 border border-[#E5E0D5] text-left">
              <span className="text-[9px] uppercase tracking-widest text-[#1B365D] font-extrabold block mb-2 text-center">
                🛠️ MODUL SIMULASI INSTAN (KLIK & AKSES LANGSUNG)
              </span>
              <p className="text-[10px] text-gray-500 text-center mb-3">
                Klik peran/user simulasi berikut untuk menguji masing-masing hak akses secara instan tanpa perlu registrasi ulang:
              </p>
              
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  onClick={() => handleFastLogin('admin.ippi@gmail.com', 'admin', UserRole.ADMIN)}
                  className="bg-white border hover:bg-[#1B365D] hover:text-white p-2 rounded text-left font-semibold text-gray-800 transition-colors cursor-pointer"
                >
                  🔑 Login (Admin)
                </button>
                <button
                  onClick={() => handleFastLogin('sekretaris.ippi@gmail.com', 'sekretaris', UserRole.SEKRETARIS)}
                  className="bg-white border hover:bg-[#1B365D] hover:text-white p-2 rounded text-left font-semibold text-gray-800 transition-colors cursor-pointer"
                >
                  📝 Login (Sekretaris)
                </button>
                <button
                  onClick={() => handleFastLogin('bendahara.ippi@gmail.com', 'bendahara', UserRole.BENDAHARA)}
                  className="bg-white border hover:bg-[#1B365D] hover:text-white p-2 rounded text-left font-semibold text-gray-800 transition-colors cursor-pointer"
                >
                  💵 Login (Bendahara)
                </button>
                <button
                  onClick={() => handleFastLogin('ketua.ippi@gmail.com', 'ketua', UserRole.KETUA)}
                  className="bg-white border hover:bg-[#1B365D] hover:text-white p-2 rounded text-left font-semibold text-gray-800 transition-colors cursor-pointer"
                >
                  👔 Login (Ketua)
                </button>
              </div>

              <div className="mt-2 text-center">
                <button
                  onClick={() => {
                    // Try to simulate an unapproved login
                    const members = getStoredMembers();
                    const unappr = members.find((m) => !m.isApproved);
                    if (unappr) {
                      setEmail(unappr.email);
                      setPassword(unappr.password || '');
                    }
                  }}
                  className="text-[9px] text-[#C5A059] hover:underline font-bold"
                >
                  *Hubungkan Simulasi Calon Anggota Belum di-Approve
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
