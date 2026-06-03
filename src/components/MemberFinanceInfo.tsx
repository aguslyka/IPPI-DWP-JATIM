import React, { useEffect, useState } from 'react';
import { Member, FinancialTransaction, TransaksiKategori, SumberDana } from '../types';
import { getStoredTransactions } from '../utils/storage';
import { 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Bell, 
  ArrowRightLeft, 
  Receipt, 
  CreditCard, 
  TrendingUp, 
  FileText,
  UserCheck
} from 'lucide-react';

interface MemberFinanceInfoProps {
  member: Member;
}

export default function MemberFinanceInfo({ member }: MemberFinanceInfoProps) {
  const [personalTxs, setPersonalTxs] = useState<FinancialTransaction[]>([]);
  const [allTxs, setAllTxs] = useState<FinancialTransaction[]>([]);

  useEffect(() => {
    const loadTransactions = () => {
      const txs = getStoredTransactions();
      setAllTxs(txs);
      
      // Filter transactions related to this member (either by memberId or containing their name in description)
      const filtered = txs.filter(t => 
        t.memberId === member.id || 
        (t.deskripsi && t.deskripsi.toLowerCase().includes(member.nama.toLowerCase()))
      );
      setPersonalTxs(filtered);
    };

    loadTransactions();
    window.addEventListener('ippi_storage_updated', loadTransactions);
    return () => {
      window.removeEventListener('ippi_storage_updated', loadTransactions);
    };
  }, [member.id, member.nama]);

  // Total incoming paid by member (contributions)
  const totalIncoming = personalTxs
    .filter(t => t.kategori === TransaksiKategori.MASUK)
    .reduce((sum, t) => sum + (t.jumlahMasuk || 0), 0);

  // Total outgoing paid to/for member (payouts/benefits/expenses)
  const totalOutgoing = personalTxs
    .filter(t => t.kategori === TransaksiKategori.KELUAR)
    .reduce((sum, t) => sum + (t.jumlahKeluar || 0), 0);

  const netBalance = totalIncoming - totalOutgoing;

  // Check paid years dynamically
  const iuranYears = [2024, 2025, 2026];
  const yearStatus = iuranYears.map(year => {
    const isPaid = personalTxs.some(t => 
      t.sumberTujuan === SumberDana.IURAN && 
      (t.tanggal.startsWith(year.toString()) || t.deskripsi.includes(year.toString()))
    );
    return { year, isPaid };
  });

  // Specific inbox alerts tailored directly to the member
  const defaultAnnouncements = [
    {
      id: 'ann-1',
      title: 'Konfirmasi Penerimaan Kartu Digital',
      date: 'Terintegrasi Nasional',
      content: `Selamat, akun Anda dengan No. Anggota ${member.noAnggota || 'Sedang Diproses'} telah diaktivasi sepenuhnya. Kartu Anggota Digital di sebelah kiri kini aktif dan dapat dicetak sebagai bukti lisensi fisik Bapak/Ibu.`,
      icon: UserCheck,
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      id: 'ann-2',
      title: 'Pemberitahuan Kelancaran Iuran Anggota',
      date: 'Info Pembendaharaan',
      content: totalIncoming > 0 
        ? `Sistem Bendahara mendeteksi total setoran iuran sebesar Rp ${totalIncoming.toLocaleString('id-ID')} telah sukses diverifikasi. Terima kasih atas kepatuhan iuran Anda demi keberlangsungan program kontribusi sosial pensiunan!`
        : `Anda terdaftar sebagai anggota aktif. Mohon lakukan setoran iuran tahunan demi memelihara status keaktifan keanggotaan dan operasional gerakan sekretariat nasional.`,
      icon: Receipt,
      badgeColor: totalIncoming > 0 ? 'bg-blue-50 text-blue-800 border-blue-205' : 'bg-amber-50 text-amber-850 border-amber-200'
    },
    {
      id: 'ann-3',
      title: 'Dana Subsidi Bantuan Kemitraan IPPI',
      date: 'Program Sosial',
      content: `Sebagai anggota terdaftar Ikatan Profesional & Pensiun Indonesia, Anda berhak mendaftarkan usulan kemitraan atau mengajukan jaminan SPJ bantuan sosial/kesehatan pada agenda rapat triwulanan mendatang.`,
      icon: TrendingUp,
      badgeColor: 'bg-slate-50 text-slate-800 border-slate-200'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Visual Header */}
      <div className="border-[#E5E0D5] border-b pb-4">
        <h3 className="text-xl font-serif font-bold text-[#1B365D]">
          🏛️ Portal Keuangan & Informasi Anggota
        </h3>
        <p className="text-xs text-[#8B7E66] mt-1">
          Informasi transparan mengenai status kontribusi iuran wajib dan direktori pengumuman khusus untuk Anda.
        </p>
      </div>

      {/* Top Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Counter 1: Total Contribution */}
        <div className="bg-[#1B365D] text-white p-5 rounded-2xl border-l-4 border-[#C5A059] shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-2 top-2 text-[#C5A059] opacity-10">
            <CreditCard className="w-24 h-24" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">
              AKUMULASI IURAN TERVERIFIKASI SAYA
            </span>
            <h4 className="text-2xl font-serif font-bold mt-1">
              Rp {totalIncoming.toLocaleString('id-ID')}
            </h4>
            
            {/* Detailed link tracking of incoming vs outgoing of member */}
            <div className="mt-3.5 pt-3 border-t border-slate-700/60 text-[10px] text-slate-300">
              <div>
                <span className="block text-slate-400 font-semibold uppercase">PENGELUARAN / SUBSIDI DPW</span>
                <span className="font-bold text-rose-300">Rp {totalOutgoing.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
          <p className="text-[9px] text-slate-400 mt-4 leading-relaxed">
            * Dicatat secara sah oleh Bendahara berdasarkan kliring keuangan & transfer rekening organisasi.
          </p>
        </div>

        {/* Counter 2: Dues Standard Checklist */}
        <div className="bg-[#FDFCF8] border border-[#E5E0D5] p-5 rounded-2xl shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#1B365D] block mb-3">
            STATUS KONTRIBUSI TAHUNAN RESMI
          </span>
          <div className="grid grid-cols-3 gap-3">
            {yearStatus.map(status => (
              <div 
                key={status.year} 
                className={`py-2 px-3 rounded-xl border text-center relative ${
                  status.isPaid 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-[#FDFCF8] text-[#8B7E66] border-[#E5E0D5]'
                }`}
              >
                <span className="block text-[11px] font-bold">Th. {status.year}</span>
                <span className="inline-flex items-center space-x-1 text-[9px] font-semibold mt-1">
                  {status.isPaid ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>LUNAS</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>BELUM</span>
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#8B7E66] mt-4 leading-relaxed">
            Iuran tahunan membantu pendanaan SPJ operasional daerah & DPP IPPI RI.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* RIWAYAT PETUNJUK KAS SAYA */}
        <div className="bg-white border border-[#E5E0D5] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-serif font-bold text-[#1B365D] border-b border-[#F4F1EA] pb-2.5 mb-3 flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-[#C5A059]" />
              <span>Riwayat Transaksi Iuran Saya</span>
            </h4>

            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {personalTxs.length === 0 ? (
                <div className="text-center py-12 px-4 border border-dashed border-[#E5E0D5] rounded-xl bg-slate-55/10">
                  <span className="block text-2xl mb-2">📜</span>
                  <p className="text-xs text-[#8B7E66] italic leading-relaxed">
                    Belum ditemukan riwayat transfer atas nama Anda di Buku Kas Ledger PP IPPI.
                  </p>
                  <p className="text-[10px] text-[#A89F8D] mt-2">
                    Jika baru membayar, Bendahara akan melakukan verifikasi & menyinkronkannya ke sistem.
                  </p>
                </div>
              ) : (
                personalTxs.map((tx) => (
                  <div key={tx.id} className="p-3 bg-[#FDFCF8] border border-[#E5E0D5] rounded-xl text-xs space-y-1.5 transition-shadow hover:shadow-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-[#8B7E66] font-medium">{tx.tanggal}</span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold rounded-full text-[9px] border border-emerald-100">
                        VERIFIED
                      </span>
                    </div>
                    <p className="font-semibold text-gray-800 leading-snug">{tx.deskripsi}</p>
                    <div className="flex justify-between items-end pt-1 border-t border-dashed border-gray-100">
                      <span className="text-[10px] text-gray-400 font-mono italic">Ref: {tx.noRekening}</span>
                      {tx.kategori === TransaksiKategori.MASUK ? (
                        <span className="font-bold text-emerald-600 text-sm">
                          + Rp {tx.jumlahMasuk.toLocaleString('id-ID')}
                        </span>
                      ) : (
                        <span className="font-bold text-rose-600 text-sm">
                          - Rp {tx.jumlahKeluar.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-[#F4F1EA] text-[10px] text-[#8B7E66] leading-relaxed bg-slate-50 p-2 rounded">
            💡 Untuk melakukan pembayaran iuran, harap kirimkan transfer ke Bank Acuan sesuai instruksi, lalu hubungi Sekretariat / Bendahara untuk verifikasi instan.
          </div>
        </div>

        {/* INFORMASI MASUK UNTUK ANGGOTA */}
        <div className="bg-white border border-[#E5E0D5] rounded-2xl p-5 shadow-xs">
          <h4 className="text-sm font-serif font-bold text-[#1B365D] border-b border-[#F4F1EA] pb-2.5 mb-3 flex items-center space-x-2">
            <Bell className="w-4 h-4 text-[#C5A059]" />
            <span>Kotak Masuk & Informasi Untuk Anda</span>
          </h4>

          <div className="space-y-4">
            {defaultAnnouncements.map((ann) => {
              const IconComp = ann.icon;
              return (
                <div key={ann.id} className="flex gap-3 text-xs items-start p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                  <div className="p-2 bg-slate-100 rounded-lg text-[#1B365D] shrink-0">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="font-bold text-gray-800">{ann.title}</p>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded border text-gray-500 bg-slate-50 font-semibold">
                        {ann.date}
                      </span>
                    </div>
                    <p className="text-[#5D574F] leading-relaxed text-[11px]">{ann.content}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-2.5">
            <span className="text-xs">📢</span>
            <div className="text-[10px] text-[#1B365D] leading-relaxed">
              <strong>Pengumuman DPP Nasional:</strong> Agenda Rapat Keanggotaan Bulanan IPPI akan dilaksanakan setiap hari Sabtu minggu pertama. Kehadiran Bapak/Ibu sangat berarti bagi kesolidan keluarga besar pensiunan di seluruh nusantara.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
