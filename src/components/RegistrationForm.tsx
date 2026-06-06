import React, { useState } from 'react';
import { Member, JenisKelamin, Agama } from '../types';
import { getStoredMembers, saveStoredMembers } from '../utils/storage';
import { UserCheck, MessageSquare, AlertCircle, Sparkles, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface RegistrationFormProps {
  onSuccess: () => void;
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  // Input fields
  const [nama, setNama] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [institusiPensiun, setInstitusiPensiun] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<JenisKelamin>(JenisKelamin.LAKI_LAKI);
  const [agama, setAgama] = useState<Agama>(Agama.ISLAM);
  const [keahlian, setKeahlian] = useState('');
  const [noTelp, setNoTelp] = useState('');
  const [email, setEmail] = useState('');
  const [alamat, setAlamat] = useState('');
  const [password, setPassword] = useState('');
  
  // Custom eye icon state
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [errors, setErrors] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredMember, setRegisteredMember] = useState<Member | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Strictly validate all fields
    if (
      !nama.trim() ||
      !tempatLahir.trim() ||
      !tanggalLahir ||
      !institusiPensiun.trim() ||
      !keahlian.trim() ||
      !noTelp.trim() ||
      !email.trim() ||
      !alamat.trim() ||
      !password.trim()
    ) {
      setErrors('Peringatan: Seluruh kolom berbintang merah (*) wajib diisi! Silakan lengkapi kolom yang masih kosong.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors(null);

    const members = getStoredMembers();
    
    // Check if email already exists
    const exists = members.find((m) => m.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setErrors('Email ini sudah terdaftar di sistem IPPI. Silakan gunakan email lain atau hubungi pengurus.');
      return;
    }

    const newMember: Member = {
      id: `m_${Date.now()}`,
      nama: nama.trim(),
      tempatLahir: tempatLahir.trim(),
      tanggalLahir: tanggalLahir,
      institusiPensiun: institusiPensiun.trim(),
      jenisKelamin: jenisKelamin,
      agama: agama,
      keahlian: keahlian.trim(),
      noTelp: noTelp.trim(),
      email: email.trim(),
      alamat: alamat.trim(),
      password: password,
      isApproved: false, // Default is waiting for secretary approval
    };

    const updated = [...members, newMember];
    saveStoredMembers(updated);
    
    setIsSuccess(true);
    setRegisteredMember(newMember);
  };

  if (isSuccess && registeredMember) {
    const waText = `Halo Sekretaris IPPI, saya baru saja mendaftar online di sistem web keanggotaan IPPI. Atas nama: *${registeredMember.nama}* dari *${registeredMember.institusiPensiun}*. Mohon berkenan approve akun saya. Terima kasih.`;
    const encodedWa = encodeURIComponent(waText);

    return (
      <div className="bg-white border-2 border-emerald-500 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl text-center my-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 scale-110">
          <CheckCircle className="w-10 h-10" />
        </div>

        <h3 className="text-3xl font-serif font-bold text-[#1B365D] mb-4">Pendaftaran Anggota Berhasil!</h3>
        
        {/* Dynamic Warning Alert Box */}
        <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-950 p-6 rounded-xl text-left my-6 space-y-3">
          <p className="text-sm font-semibold capitalize">
            Mohon Perhatian Pengguna Lanjut Usia:
          </p>
          <p className="text-xs leading-relaxed font-bold">
            “Silahkan hubungi, Sekretaris IPPI setempat untuk mendapatkan persetujuan login”
          </p>
          <p className="text-[11px] text-[#5D574F] leading-relaxed">
            Akun Anda saat ini disimpan sebagai draft rahasia di database nasional. Anda belum bisa masuk menggunakan kata sandi sampai divalidasi oleh sekretariat pusat dengan NIM dan rekening resmi.
          </p>
        </div>

        {/* WhatsApp Button click WhatsApp Floating Button */}
        <div className="space-y-4">
          <p className="text-xs text-[#5D574F] italic">Silakan klik tombol WhatsApp hijau di bawah untuk menghubungi sekretaris cabang:</p>
          
          <a
            href={`https://api.whatsapp.com/send?phone=6281803100222&text=${encodedWa}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-3 px-6 py-4 bg-[#25D366] hover:bg-[#1C8C44] text-white hover:scale-105 transition-transform rounded-full shadow-lg font-bold text-base cursor-pointer"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
            <span>Hubungi Sekretaris IPPI (081803100222)</span>
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-[#F4F1EA]">
          <button
            onClick={() => {
              onSuccess();
            }}
            className="text-xs font-bold text-[#1B365D] tracking-wider uppercase border-b-2 border-[#1B365D]"
          >
            Kembali ke Beranda Utama
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E0D5] rounded-3xl p-6 lg:p-10 shadow-xl max-w-4xl mx-auto">
      <div className="text-center pb-6 border-b border-[#F4F1EA] mb-8">
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#C5A059] bg-[#F4F1EA] px-3 py-1 rounded-full">
          Formulir Pengisian Anggota
        </span>
        <h2 className="text-3xl font-serif text-[#1B365D] font-bold mt-2">Daftar Anggota Baru IPPI</h2>
        <p className="text-sm text-[#8B7E66] max-w-lg mx-auto leading-relaxed mt-2">
          Ikatan Profesional & Pensiunan Indonesia - Pengisian data terkelompok rahasia dan ramah pembaca lansia.
        </p>
      </div>

      {errors && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-950 text-xs font-semibold rounded-lg mb-6 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errors}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* GROUP 1: PERSONAL DATUM (DATA PRIBADI) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#C5A059] uppercase tracking-wider border-b border-[#F4F1EA] pb-1">
            I. DATA PRIBADI (IDENTITAS DIRI LENGKAP)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#2D2D2D] mb-1">
                A. Nama Anggota (Lengkap dengan gelar) <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Mohammad Muslih, S.H., M.M."
                className="w-full bg-[#FDFCF8] border border-[#E5E0D5] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#2D2D2D] mb-1">
                  B. Tempat Lahir <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={tempatLahir}
                  onChange={(e) => setTempatLahir(e.target.value)}
                  placeholder="Contoh: Malang"
                  className="w-full bg-[#FDFCF8] border border-[#E5E0D5] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#1B365D]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D2D2D] mb-1">
                  C. Tanggal Lahir <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="date"
                  value={tanggalLahir}
                  onChange={(e) => setTanggalLahir(e.target.value)}
                  className="w-full bg-[#FDFCF8] border border-[#E5E0D5] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#1B365D]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#2D2D2D] mb-1">
                D. Jenis Kelamin <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="flex gap-4 pt-2">
                <label className="inline-flex items-center space-x-2 text-sm font-semibold text-[#5D574F] cursor-pointer">
                  <input
                    type="radio"
                    name="genderReg"
                    value={JenisKelamin.LAKI_LAKI}
                    checked={jenisKelamin === JenisKelamin.LAKI_LAKI}
                    onChange={() => setJenisKelamin(JenisKelamin.LAKI_LAKI)}
                    className="w-4 h-4 text-[#1B365D]"
                  />
                  <span>Laki-Laki</span>
                </label>
                <label className="inline-flex items-center space-x-2 text-sm font-semibold text-[#5D574F] cursor-pointer">
                  <input
                    type="radio"
                    name="genderReg"
                    value={JenisKelamin.PEREMPUAN}
                    checked={jenisKelamin === JenisKelamin.PEREMPUAN}
                    onChange={() => setJenisKelamin(JenisKelamin.PEREMPUAN)}
                    className="w-4 h-4 text-[#1B365D]"
                  />
                  <span>Perempuan</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2D2D2D] mb-1">
                E. Agama Terpilih <span className="text-red-500 font-bold">*</span>
              </label>
              <select
                value={agama}
                onChange={(e) => setAgama(e.target.value as Agama)}
                className="w-full bg-[#FDFCF8] border border-[#E5E0D5] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#1B365D]"
              >
                {Object.values(Agama).map((val) => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D2D2D] mb-1">
              F. Alamat Rumah Lengkap (Sesuai KTP) <span className="text-red-500 font-bold">*</span>
            </label>
            <textarea
              rows={3}
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Contoh: Jl Pahlawan 24 Madiun RT. 003 RW. 001 Madiun Lor, Kec. Manguharjo Kota Madiun 63122"
              className="w-full bg-[#FDFCF8] border border-[#E5E0D5] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#1B365D]"
              required
            />
          </div>
        </div>

        {/* GROUP 2: CAREER LOGS (RIWAYAT KARIER & KEAHLIAN MASA LALU) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#C5A059] uppercase tracking-wider border-b border-[#F4F1EA] pb-1">
            II. RIWAYAT KARIER & KEAHLIAN / MINAT KONTRIBUSI
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#2D2D2D] mb-1">
                A. Institusi Asal Pensiunan <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                value={institusiPensiun}
                onChange={(e) => setInstitusiPensiun(e.target.value)}
                placeholder="Contoh: PT Pos Indonesia (Persero) atau Kementerian"
                className="w-full bg-[#FDFCF8] border border-[#E5E0D5] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2D2D2D] mb-1">
                B. Spesialisasi Bidang Keahlian Kerja <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                value={keahlian}
                onChange={(e) => setKeahlian(e.target.value)}
                placeholder="Contoh: Kurir dan ekspedisi, logistik, jasa keuangan, serta properti"
                className="w-full bg-[#FDFCF8] border border-[#E5E0D5] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>
          </div>
        </div>

        {/* GROUP 3: REGISTER SECURE ACCESSIBILITY (KONTAK & AKSES LOGIN) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#C5A059] uppercase tracking-wider border-b border-[#F4F1EA] pb-1">
            III. KONTAK AKTIF & KATA SANDI (PASSWORD) AKSES PORTAL
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#2D2D2D] mb-1">
                A. No. Telp. / HP. / WhatsApp <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="tel"
                value={noTelp}
                onChange={(e) => setNoTelp(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full bg-[#FDFCF8] border border-[#E5E0D5] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#1B365D] font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2D2D2D] mb-1">
                B. Alamat Surat Elektronik (Email) <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Contoh: Ikatanppi@gmail.com"
                className="w-full bg-[#FDFCF8] border border-[#E5E0D5] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#1B365D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2D2D2D] mb-1">
                C. Kata Sandi Baru (Password) <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Gunakan sandi yang mudah diingat..."
                  className="w-full bg-[#FDFCF8] border border-[#E5E0D5] rounded-xl px-4 py-3 text-sm pr-10 font-mono focus:ring-1 focus:ring-[#1B365D]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-[#1B365D]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit action buttons */}
        <div className="pt-6 border-t border-[#F4F1EA] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-gray-500 max-w-md text-center sm:text-left leading-relaxed">
            Dengan mendaftar, Anda menyetujui Anggaran Dasar & Anggaran Rumah Tangga (AD/ART) IPPI untuk berkontribusi demi kesejahteraan profesional senior Indonesia.
          </p>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 bg-[#1B365D] hover:bg-[#122543] text-white font-bold text-base rounded-xl shadow-lg transition-transform hover:scale-101 cursor-pointer flex items-center justify-center space-x-2 shrink-0"
          >
            <UserCheck className="w-5 h-5" />
            <span>Kirim Berkas Pendaftaran</span>
          </button>
        </div>

      </form>
    </div>
  );
}
