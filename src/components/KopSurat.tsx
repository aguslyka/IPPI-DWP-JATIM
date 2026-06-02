import React, { useState } from 'react';
import { OrgConfig } from '../types';
import { Printer, Eye, EyeOff, FileText, CheckCircle2 } from 'lucide-react';

interface KopSuratProps {
  config: OrgConfig;
  userRole: string;
}

export default function KopSurat({ config, userRole }: KopSuratProps) {
  // Let the user toggle which fields are visible on the Kop Surat before printing!
  const [showLogo, setShowLogo] = useState(true);
  const [showNama, setShowNama] = useState(true);
  const [showAlamat, setShowAlamat] = useState(true);
  const [showIjin, setShowIjin] = useState(true);
  const [showKontak, setShowKontak] = useState(true);

  // Template demo letter content
  const [letterSubject, setLetterSubject] = useState('024/DPP-IPPI/V/2026');
  const [letterTitle, setLetterTitle] = useState('PEMBERITAHUAN GATHERING & DISKUSI ANTAR GENERASI');
  const [letterContent, setLetterContent] = useState(
    `Dengan hormat,\n\nSehubungan dengan akan dilaksanakannya agenda rutin triwulan Ikatan Profesional & Pensiunan Indonesia (IPPI), bersama ini kami mengundang seluruh Dewan Pengurus Cabang dan para Anggota Profesional Terdaftar untuk hadir pada rapat koordinasi program kerja.\n\nHari/Tanggal: Sabtu, 15 Juni 2026\nWaktu: 09.00 WIB - Selesai\nAcara: Sosialisasi Jurnal Logistik Lansia Terkini & Rekonsiliasi Kas Organisasi\nTepat: Aula Graha Keprofesionalan IPPI Pusat\n\nDemikian undangan ini kami sampaikan, atas perhatian dan partisipasi Bapak/Ibu sekalian, kami haturkan terima kasih yang sebesar-besarnya.`
  );

  const handlePrint = () => {
    // Style a print sheet specifically
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Mohon izinkan pop-up untuk mencetak dokumen.');
      return;
    }

    const printHtml = `
      <html>
        <head>
          <title>Cetak Kop Surat - IPPI</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Inter:wght@400;600;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #2D2D2D;
              padding: 40px;
              line-height: 1.5;
              background-color: #ffffff;
            }
            .kop-container {
              border-bottom: 3px double #1B365D;
              padding-bottom: 12px;
              margin-bottom: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              position: relative;
            }
            .kop-logo {
              width: 70px;
              height: 70px;
              background-color: #1B365D;
              color: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 24px;
              margin-right: 25px;
              font-family: 'Cinzel', serif;
              border: 2px solid #C5A059;
              overflow: hidden;
            }
            .kop-text {
              flex: 1;
            }
            .org-title {
              font-family: 'Cinzel', serif;
              font-size: 22px;
              font-weight: 700;
              color: #1B365D;
              margin: 0 0 4px 0;
              letter-spacing: 0.5px;
            }
            .org-subtitle {
              font-size: 10px;
              letter-spacing: 2px;
              text-transform: uppercase;
              color: #8B7E66;
              margin: 0 0 8px 0;
              font-weight: 600;
            }
            .org-details {
              font-size: 11px;
              color: #5D574F;
              margin: 2px 0;
            }
            .letter-meta {
              display: flex;
              justify-content: space-between;
              font-size: 13px;
              margin-bottom: 20px;
              color: #2D2D2D;
            }
            .letter-title {
              text-align: center;
              font-size: 15px;
              font-weight: bold;
              text-decoration: underline;
              margin: 30px 0 15px 0;
              color: #1B365D;
              text-transform: uppercase;
            }
            .letter-content {
              font-size: 13px;
              white-space: pre-line;
              text-align: justify;
              color: #2D2D2D;
              line-height: 1.6;
              margin-bottom: 50px;
            }
            .signature-block {
              display: flex;
              justify-content: flex-end;
              margin-top: 50px;
            }
            .signature-box {
              text-align: center;
              width: 250px;
              font-size: 13px;
            }
            .signature-line {
              margin-top: 75px;
              border-top: 1px solid #2D2D2D;
              font-weight: bold;
              padding-top: 4px;
            }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="kop-container">
            ${showLogo ? `<div class="kop-logo">${config.logoUrl ? `<img src="${config.logoUrl}" style="width:100%;height:100%;object-fit:cover;" />` : (config.logoText || 'IPPI')}</div>` : ''}
            <div class="kop-text">
              ${showNama ? `<h1 class="org-title">IKATAN PROFESIONAL & PENSIUNAN INDONESIA</h1>` : ''}
              ${showNama ? `<div class="org-subtitle">Dedikasi Tanpa Batas, Pengalaman Berharga</div>` : ''}
              ${showAlamat ? `<div class="org-details">Sekretariat: ${config.alamatSekretariat}</div>` : ''}
              ${showIjin ? `<div class="org-details">No. Ijin Pendirian Kementerian Hukum & HAM: ${config.noIjinPendirian}</div>` : ''}
              ${showKontak ? `<div class="org-details">Hubungi: Telp: ${config.noTelp} | Email: ${config.email}</div>` : ''}
            </div>
          </div>

          <div class="letter-meta">
            <div>
              <strong>Nomor:</strong> ${letterSubject}<br>
              <strong>Sifat:</strong> Penting / Umum<br>
              <strong>Lampiran:</strong> 1 (Satu) Berkas
            </div>
            <div>
              Jakarta, 30 Mei 2026<br>
              Kepada Yth.<br>
              <strong>Segenap Pengurus & Anggota IPPI</strong><br>
              di Tempat
            </div>
          </div>

          <div class="letter-title">${letterTitle}</div>

          <div class="letter-content">${letterContent}</div>

          <div class="signature-block">
            <div class="signature-box">
              Hormat Kami,<br>
              <strong>Dewan Pengurus Pusat IPPI</strong>
              <div class="signature-line">
                Prof. Dr. Ir. H. Mohammad Muslih, M.M.<br>
                <span style="font-weight: normal; font-size: 11px; color: #5D574F;">Ketua Umum DPP IPPI</span>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printHtml);
    printWindow.document.close();
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 lg:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F4F1EA] pb-6 mb-6">
        <div>
          <h2 className="text-2xl font-serif text-[#1B365D] font-bold">Kop Surat & Cetak PDF</h2>
          <p className="text-sm text-[#8B7E66] mt-1">
            Pratinjau kop surat organisasi formal berbasis pengaturan admin. Sempurna untuk lansia karena kontras yang tinggi.
          </p>
        </div>
        
        <button
          onClick={handlePrint}
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 bg-[#1B365D] text-white hover:bg-[#122543] rounded-lg text-sm font-semibold transition-colors shadow-sm self-start cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak ke PDF / Printer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6 bg-[#F4F1EA] p-5 rounded-xl border border-[#E5E0D5]">
          <h3 className="font-serif font-bold text-[#1B365D] text-base mb-3">Tata Letak Kop Surat</h3>
          <p className="text-xs text-[#5D574F] leading-relaxed mb-4">
            Gunakan tombol berikut untuk menghapus (menyembunyikan) atau memunculkan komponen kop surat sebelum dicetak:
          </p>

          <div className="space-y-3">
            {/* Toggle Logo */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E5E0D5]">
              <span className="text-xs font-semibold text-[#2D2D2D]">Visual Logo Bulat</span>
              <button
                onClick={() => setShowLogo(!showLogo)}
                className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded transition-colors ${
                  showLogo ? 'bg-amber-50 text-amber-800 hover:bg-amber-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {showLogo ? (
                  <>
                    <Eye className="w-3.5 h-3.5 mr-1" /> Tampil
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 mr-1" /> Sembunyi
                  </>
                )}
              </button>
            </div>

            {/* Toggle Nama */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E5E0D5]">
              <span className="text-xs font-semibold text-[#2D2D2D]">Nama Sekretariat</span>
              <button
                onClick={() => setShowNama(!showNama)}
                className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded transition-colors ${
                  showNama ? 'bg-amber-50 text-amber-800 hover:bg-amber-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {showNama ? (
                  <>
                    <Eye className="w-3.5 h-3.5 mr-1" /> Tampil
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 mr-1" /> Sembunyi
                  </>
                )}
              </button>
            </div>

            {/* Toggle Alamat */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E5E0D5]">
              <span className="text-xs font-semibold text-[#2D2D2D]">Alamat Sekretariat</span>
              <button
                onClick={() => setShowAlamat(!showAlamat)}
                className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded transition-colors ${
                  showAlamat ? 'bg-amber-50 text-amber-800 hover:bg-amber-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {showAlamat ? (
                  <>
                    <Eye className="w-3.5 h-3.5 mr-1" /> Tampil
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 mr-1" /> Sembunyi
                  </>
                )}
              </button>
            </div>

            {/* Toggle Ijin */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E5E0D5]">
              <span className="text-xs font-semibold text-[#2D2D2D]">Nomor Izin Pendirian</span>
              <button
                onClick={() => setShowIjin(!showIjin)}
                className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded transition-colors ${
                  showIjin ? 'bg-amber-50 text-amber-800 hover:bg-amber-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {showIjin ? (
                  <>
                    <Eye className="w-3.5 h-3.5 mr-1" /> Tampil
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 mr-1" /> Sembunyi
                  </>
                )}
              </button>
            </div>

            {/* Toggle Kontak */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E5E0D5]">
              <span className="text-xs font-semibold text-[#2D2D2D]">Telepon & Email</span>
              <button
                onClick={() => setShowKontak(!showKontak)}
                className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded transition-colors ${
                  showKontak ? 'bg-amber-50 text-amber-800 hover:bg-amber-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {showKontak ? (
                  <>
                    <Eye className="w-3.5 h-3.5 mr-1" /> Tampil
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 mr-1" /> Sembunyi
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E0D5] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B365D]">Isi Draft Surat Dinamis</h4>
            <div>
              <label className="block text-[11px] font-bold text-[#5D574F] mb-1">Nomor Surat</label>
              <input
                type="text"
                value={letterSubject}
                onChange={(e) => setLetterSubject(e.target.value)}
                className="w-full bg-white border border-[#E5E0D5] rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#5D574F] mb-1">Perihal / Judul Surat</label>
              <input
                type="text"
                value={letterTitle}
                onChange={(e) => setLetterTitle(e.target.value)}
                className="w-full bg-white border border-[#E5E0D5] rounded px-3 py-1.5 text-xs font-bold focus:ring-1 focus:ring-[#1B365D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#5D574F] mb-1">Konten Surat</label>
              <textarea
                rows={4}
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
                className="w-full bg-white border border-[#E5E0D5] rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#1B365D] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Preview Paper */}
        <div className="lg:col-span-2 border border-[#E5E0D5] p-6 lg:p-8 bg-white rounded-xl shadow-lg relative min-h-[500px]">
          <span className="absolute top-3 right-3 text-[10px] uppercase font-bold tracking-widest text-[#C5A059] bg-[#FDFCF8] px-2 py-1 rounded border border-[#E5E0D5] flex items-center gap-1">
            <FileText className="w-3 h-3" /> Live Preview Lembar Cetak
          </span>

          {/* Paper Header */}
          <div className="border-b-3 double border-[#1b365d] pb-4 mb-6 flex items-center justify-center text-center">
            {showLogo && (
              <div className="w-14 h-14 bg-[#1B365D] text-white rounded-full flex items-center justify-center text-lg font-serif font-bold border-2 border-[#C5A059] mr-4 shrink-0 shadow-sm overflow-hidden">
                {config.logoUrl ? (
                  <img src={config.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  config.logoText
                )}
              </div>
            )}
            <div>
              {showNama && (
                <h3 className="font-serif font-bold text-[#1B365D] text-lg sm:text-xl md:text-2xl tracking-normal text-center leading-tight">
                  IKATAN PROFESIONAL & PENSIUNAN INDONESIA
                </h3>
              )}
              {showNama && (
                <p className="text-[9px] tracking-widest text-[#8B7E66] font-semibold uppercase text-center mt-1">
                  Dedikasi Tanpa Batas, Pengalaman Berharga
                </p>
              )}
              
              <div className="text-[10px] text-[#5D574F] space-y-0.5 mt-2">
                {showAlamat && <p>Sekretariat: {config.alamatSekretariat}</p>}
                {showIjin && <p>No. Izin Pendirian Kementerian Hukum & HAM: {config.noIjinPendirian}</p>}
                {showKontak && (
                  <p className="font-medium text-[#1B365D]">
                    Hubungi: Telp: {config.noTelp} | Email: {config.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Letter Body in Live Preview */}
          <div className="space-y-4 text-xs text-[#2D2D2D] leading-relaxed">
            <div className="flex justify-between font-serif text-[11px] text-gray-500">
              <div>
                <p><strong>Nomor:</strong> {letterSubject}</p>
                <p><strong>Sifat:</strong> Penting / Umum</p>
              </div>
              <div className="text-right">
                <p>Jakarta, 30 Mei 2026</p>
                <p>Kepada Yth. Segenap Anggota IPPI</p>
              </div>
            </div>

            <div className="text-center font-bold font-serif my-6 text-[#1B365D] underline uppercase leading-snug">
              {letterTitle || 'PERIHAL DOKUMEN RESMI'}
            </div>

            <div className="whitespace-pre-wrap text-justify border-l-2 border-[#E5E0D5] pl-4 italic text-gray-600 my-4 py-1">
              {letterContent || 'Silahkan isi draf surat.'}
            </div>

            <div className="flex justify-end pt-8">
              <div className="text-center w-48 text-[11px]">
                <p className="text-gray-500 mb-12">Hormat Kami,</p>
                <p className="font-serif font-bold text-[#1B365D]">Prof. Dr. Ir. H. Mohammad Muslih, M.M.</p>
                <p className="text-[9px] text-[#8B7E66] uppercase font-bold tracking-wider mt-0.5">Ketua Umum DPP IPPI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
