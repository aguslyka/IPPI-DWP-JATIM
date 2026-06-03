import React, { useState } from 'react';
import { Member, OrgConfig } from '../types';
import { CreditCard, RefreshCw, Printer, ShieldCheck, MapPin } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  config: OrgConfig;
}

export default function MemberCard({ member, config }: MemberCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Fallback info if member registration hasn't been approved yet
  const displayNoAnggota = member.noAnggota || '999000011 (Draf)';
  const displayNoRekening = member.noRekening || '9990000110 (Draf)';

  const handlePrintCard = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Mohon aktifkan pop-up jendela untuk mengizinkan cetak kartu.');
      return;
    }

    const printHtml = `
      <html>
        <head>
          <title>Cetak Kartu Anggota IPPI - ${member.nama}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;600;700&display=swap');
            @page {
              size: portrait;
              margin: 15mm 10mm 15mm 10mm;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              box-sizing: border-box;
            }
            body {
              font-family: 'Inter', sans-serif;
              background-color: #ffffff;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 20px;
              margin: 0;
            }
            .card-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 30px;
              margin-top: 20px;
            }
            .card-side {
              width: 350px;
              height: 220px;
              border-radius: 16px;
              color: white !important;
              padding: 20px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              border: 2px solid #C5A059 !important;
              position: relative;
              font-size: 12px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.15);
              overflow: hidden;
            }
            .card-side.front {
              background: linear-gradient(135deg, #0F233C 0%, #1B365D 50%, #2B4E7A 100%) !important;
            }
            .card-side.back {
              background: #0F2038 !important;
            }
            .header {
              display: flex;
              align-items: center;
              border-bottom: 1px solid rgba(197, 160, 89, 0.3) !important;
              padding-bottom: 8px;
            }
            .logo {
              width: 36px;
              height: 36px;
              background-color: white !important;
              color: #1B365D !important;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-family: 'Cinzel', serif;
              font-size: 14px;
              border: 1px solid #C5A059 !important;
              margin-right: 12px;
              overflow: hidden;
            }
            .title-group {
              line-height: 1.25;
              text-align: left;
            }
            .title {
              font-family: 'Cinzel', serif;
              font-weight: 700;
              font-size: 10px;
              color: #C5A059 !important;
              letter-spacing: 0.5px;
            }
            .subtitle {
              font-size: 6px;
              opacity: 0.8;
              text-transform: uppercase;
              letter-spacing: 1.2px;
            }
            .body-front {
              margin-top: 15px;
              flex-grow: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              text-align: left;
            }
            .id-label {
              font-size: 8px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #C5A059 !important;
              margin-bottom: 2px;
              font-weight: bold;
            }
            .member-name {
              font-family: 'Cinzel', serif;
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 4px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              color: #ffffff !important;
            }
            .member-id {
              font-family: monospace;
              font-size: 14px;
              font-weight: bold;
              letter-spacing: 1px;
              color: #F4F1EA !important;
            }
            .footer-front {
              display: flex;
              justify-content: space-between;
              font-size: 8px;
              opacity: 0.9;
              border-top: 1px solid rgba(255,255,255,0.1) !important;
              padding-top: 6px;
            }
            .back-body {
              display: flex;
              flex-direction: column;
              height: 100%;
              justify-content: space-between;
              text-align: center;
            }
            .back-address {
              font-size: 10px;
              line-height: 1.4;
              margin: 15px 0;
              color: #F4F1EA !important;
            }
            .back-notice {
              font-size: 8px;
              opacity: 0.7;
              border-top: 1px solid rgba(255,255,255,0.1) !important;
              padding-top: 8px;
              margin-top: auto;
            }
            .print-btn {
              display: none;
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h2 class="no-print" style="color: #1B365D; font-family: 'Cinzel', serif; font-size: 18px; margin-bottom: 5px; text-align: center;">Cetak Kartu Anggota IPPI</h2>
          <p class="no-print" style="font-size: 11px; color: #5D574F; margin-bottom: 15px; text-align: center; max-width: 450px; line-height: 1.4;">
            Silakan klik tombol di bawah untuk mencetak atau menyimpan sebagai PDF. Pastikan pilihan <strong>"Gambar Latar Belakang / Background Graphics"</strong> dicentang pada dialog cetak browsermu agar warna kartu muncul sempurna.
          </p>
          <button class="no-print" onclick="window.print()" style="margin-bottom: 25px; padding: 10px 24px; background-color: #1B365D; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">Cetak / Simpan PDF</button>
          
          <div class="card-container">
            <!-- Front -->
            <div class="card-side front">
              <div class="header">
                <div class="logo">
                  ${config.logoUrl ? `<img src="${config.logoUrl}" style="width:100%;height:100%;object-fit:cover;" />` : config.logoText}
                </div>
                <div class="title-group">
                  <div class="title">IKATAN PROFESIONAL & PENSIUNAN INDONESIA</div>
                  <div class="subtitle">DPP REPUBLIK INDONESIA</div>
                </div>
              </div>
              <div class="body-front">
                <div class="id-label">NAMA ANGGOTA RESMI</div>
                <div class="member-name">${member.nama}</div>
                <div class="id-label" style="margin-top: 8px;">NOMOR ANGGOTA NASIONAL</div>
                <div class="member-id">${displayNoAnggota}</div>
              </div>
              <div class="footer-front">
                <span>REKENING IKATAN: ${displayNoRekening}</span>
                <span style="font-weight: bold; color: #C5A059 !important;">KARTU ANGGOTA AKTIF</span>
              </div>
            </div>

            <!-- Back -->
            <div class="card-side back">
              <div class="back-body" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                <div class="header" style="justify-content: flex-start; border-bottom: 1px solid rgba(197, 160, 89, 0.3) !important; padding-bottom: 6px;">
                  <div class="logo" style="margin-right: 8px; width: 32px; height: 32px; overflow: hidden; flex-shrink: 0; border: 1px solid #C5A059 !important; border-radius: 50%;">
                    ${config.logoUrl ? `<img src="${config.logoUrl}" style="width:100%;height:100%;object-fit:cover;" />` : config.logoText}
                  </div>
                  <div class="title-group" style="text-align: left; line-height: 1.15;">
                    <div class="title" style="font-family: 'Cinzel', serif; font-weight: 700; font-size: 8px; color: #C5A059 !important; letter-spacing: 0.5px;">PENGURUS PUSAT</div>
                    <div style="font-size: 7px; color: #FFFFFF; font-weight: bold; text-transform: uppercase;">IKATAN PROFESIONAL DAN PENSIUNAN INDONESIA</div>
                  </div>
                </div>
                <div style="text-align: left; font-size: 8px; color: #F4F1EA; margin: 8px 0; line-height: 1.35;">
                  <p style="margin: 0 0 4px 0;">
                    <strong style="color: #C5A059 !important;">Alamat Sekretariat PP IPPI:</strong><br>
                    Jl.Tanah Merdeka VII No.51 B RT.004/06 Kelurahan Kampung Rambutan Kecamatan Ciracas Jakarta Timur
                  </p>
                  <p style="margin: 0 0 2px 0;">
                    <strong>No.Telp:</strong> 081514017944 / 082113094238
                  </p>
                  <p style="margin: 0;">
                    <strong>Email:</strong> ikatanprofesionalpensiunanindo@gmail.com
                  </p>
                </div>
                <div class="back-notice" style="font-size: 7px; border-top: 1px solid rgba(255,255,255,0.1) !important; padding-top: 5px; color: #C5A059 !important; font-weight: bold; line-height: 1.2; text-align: center;">
                  SK Kemenkumham RI No. Regis Resmi:<br>
                  <span style="color: #FFFFFF; font-family: monospace; font-size: 7.5px;">AHU Kemenkum-0010333.AH.01.07.Tahun 2025 Tgl 13 Jan. 2026</span>
                </div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printHtml);
    printWindow.document.close();
  };

  return (
    <div className="bg-[#F4F1EA] border border-[#E5E0D5] rounded-2xl p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-serif text-[#1B365D] font-bold">Kartu Anggota Elegan</h2>
          <p className="text-xs text-[#8B7E66]">
            Dibuat otomatis secara visual eksklusif. Ketuk kartu untuk membalik dan melihat bagian belakang.
          </p>
        </div>
        
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white text-[#1B365D] hover:bg-gray-100 rounded-lg text-xs font-semibold border border-[#E5E0D5] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Balik Kartu</span>
          </button>

          <button
            onClick={handlePrintCard}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-[#1B365D] text-white hover:bg-[#122543] rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Card visual container */}
      <div className="flex justify-center items-center py-6">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative w-full max-w-[380px] h-[230px] rounded-2xl cursor-pointer select-none perspective-1000 transition-all duration-300 transform hover:scale-102"
        >
          {/* Card Wrapper with 3D Flip */}
          <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            
            {/* FRONT OF THE CARD */}
            <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-r from-[#0F233C] via-[#1B365D] to-[#2B4E7A] text-white p-5 flex flex-col justify-between border-2 border-[#C5A059] shadow-xl backface-hidden">
              {/* Subtle background lines styling to fit 'Editorial Aesthetic' */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(197,160,89,0.08)_0%,transparent_60%)] pointer-events-none rounded-2xl" />
              
              {/* Front Header */}
              <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-2 z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1B365D] font-serif font-black text-sm border-2 border-[#C5A059] shadow-sm shrink-0 overflow-hidden">
                    {config.logoUrl ? (
                      <img src={config.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      config.logoText
                    )}
                  </div>
                  <div className="leading-none text-left">
                    <span className="block font-serif text-[11px] font-bold text-[#C5A059] tracking-wide">IKATAN PROFESIONAL & PENSIUNAN INDONESIA</span>
                    <span className="block text-[6px] tracking-widest text-[#F4F1EA] font-semibold uppercase mt-0.5">DPP REPUBLIK INDONESIA</span>
                  </div>
                </div>
                <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0 opacity-80" />
              </div>

              {/* Front Body */}
              <div className="my-auto text-left pl-1 z-10">
                <span className="text-[7px] uppercase tracking-widest text-[#C5A059] font-bold block mb-1">NAMA ANGGOTA AKTIF</span>
                <h3 className="font-serif text-base sm:text-lg font-bold tracking-tight text-white line-clamp-1">
                  {member.nama}
                </h3>
                
                <span className="text-[7px] uppercase tracking-widest text-[#C5A059] font-bold block mt-3 mb-1">NOMOR ANGGOTA NASIONAL</span>
                <span className="font-mono text-base tracking-widest font-extrabold text-[#F4F1EA]">
                  {displayNoAnggota}
                </span>
              </div>

              {/* Front Footer */}
              <div className="flex justify-between items-center text-[8px] border-t border-white/10 pt-2 z-10 text-slate-300">
                <div className="flex flex-col text-left">
                  <span className="text-[6px] text-slate-400">NO. REKENING IKATAN</span>
                  <span className="font-mono font-bold tracking-wider">{displayNoRekening}</span>
                </div>
                <span className="bg-[#C5A059] text-[#1B365D] font-extrabold px-2 py-0.5 rounded text-[8px] tracking-wide uppercase">
                  ANGGOTA UTAMA
                </span>
              </div>
            </div>

            {/* BACK OF THE CARD */}
            <div className="absolute inset-0 w-full h-full rounded-2xl bg-[#0F2038] text-white p-5 flex flex-col justify-between border-2 border-[#C5A059] shadow-xl rotate-y-180 backface-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.06)_0%,transparent_60%)] pointer-events-none rounded-2xl" />

              {/* Back Header */}
              <div className="flex items-center space-x-2 border-b border-[#C5A059]/20 pb-1.5 z-10">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1B365D] font-serif font-black text-xs border border-[#C5A059] shrink-0 overflow-hidden">
                  {config.logoUrl ? (
                    <img src={config.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    config.logoText
                  )}
                </div>
                <div className="text-left leading-none">
                  <span className="block font-serif text-[8px] font-bold text-[#C5A059]">PENGURUS PUSAT</span>
                  <span className="block text-[7px] font-bold text-white tracking-tight uppercase">IKATAN PROFESIONAL DAN PENSIUNAN INDONESIA</span>
                </div>
              </div>

              {/* Back Body */}
              <div className="my-auto text-left space-y-1.5 z-10">
                <div className="text-[8.5px] text-[#F4F1EA] leading-relaxed">
                  <p className="font-semibold text-[#C5A059] flex items-center gap-1 mb-0.5">
                    <MapPin className="w-2.5 h-2.5 shrink-0" />
                    <span>Alamat Sekretariat PP IPPI:</span>
                  </p>
                  <p className="text-slate-200 pl-3.5 leading-normal">
                    Jl.Tanah Merdeka VII No.51 B RT.004/06 Kelurahan Kampung Rambutan Kecamatan Ciracas Jakarta Timur
                  </p>
                </div>

                <div className="text-[8.5px] text-[#F4F1EA] pl-3.5 leading-normal space-y-0.5">
                  <p><strong>No.Telp :</strong> <span className="text-slate-200 font-mono font-bold">081514017944/082113094238</span></p>
                  <p><strong>Email :</strong> <span className="text-slate-200 font-mono text-[8px]">ikatanprofesionalpensiunanindo@gmail.com</span></p>
                </div>
              </div>

              {/* Back Footer */}
              <div className="text-[7px] text-[#C5A059] leading-normal border-t border-white/10 pt-1.5 text-center z-10 font-sans">
                <p className="opacity-80">Surat Keputusan Menteri Hukum dan HAM RI:</p>
                <p className="font-bold text-white font-mono mt-0.5 uppercase tracking-wide">AHU Kemenkum-0010333.AH.01.07.Tahun 2025 Tgl 13 Jan. 2026</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Touch instruction to improve accessibility for seniors */}
      <p className="text-center text-[11px] text-[#8B7E66] italic mt-2 animate-pulse">
        *Ketuk pada gambar kartu anggota di atas untuk melihat bolak-balik.
      </p>
    </div>
  );
}
