import React, { useState, useEffect } from 'react';
import { FinancialTransaction, TransaksiKategori, SumberDana, Member } from '../types';
import { getStoredTransactions, saveStoredTransactions, getStoredMembers, getStoredConfig } from '../utils/storage';
import { Plus, Download, Printer, Search, Send, FileSpreadsheet, Check, Edit, Trash2, X } from 'lucide-react';

interface FinancialSheetProps {
  currentRole: string;
}

export default function FinancialSheet({ currentRole }: FinancialSheetProps) {
  const [txs, setTxs] = useState<FinancialTransaction[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  // Form states
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [kategori, setKategori] = useState<TransaksiKategori>(TransaksiKategori.MASUK);
  const [sumberTujuan, setSumberTujuan] = useState<SumberDana>(SumberDana.IURAN);
  const [deskripsi, setDeskripsi] = useState('');
  const [noRekening, setNoRekening] = useState('');
  const [jumlah, setJumlah] = useState<number>(0);

  // Auto-Link member fields
  const [searchMemberId, setSearchMemberId] = useState('');
  const [linkedMember, setLinkedMember] = useState<Member | null>(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Compute matched members list based on 2+ characters typed
  const filteredSearchMembers = React.useMemo(() => {
    const trimmed = searchMemberId.trim().toLowerCase();
    if (trimmed.length < 2) return [];
    return members.filter(
      (m) =>
        (m.noAnggota && m.noAnggota.toLowerCase().includes(trimmed)) ||
        (m.id && m.id.toLowerCase().includes(trimmed)) ||
        (m.nama && m.nama.toLowerCase().includes(trimmed))
    );
  }, [searchMemberId, members]);

  const selectMemberFromDropdown = (m: Member) => {
    setLinkedMember(m);
    setSearchMemberId(m.noAnggota || m.nama);
    setShowSearchDropdown(false);
    setKategori(TransaksiKategori.MASUK);
    setSumberTujuan(SumberDana.IURAN);
    setNoRekening(`Bank - Account ${m.noRekening || '9990000110'} a.n. ${m.nama}`);
    setDeskripsi(`Pembayaran Iuran Anggota: ${m.nama}`);
  };

  // Message template generator target state
  const [whatsappMock, setWhatsappMock] = useState<{ phone: string; text: string } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Edit states for Admin Role
  const [editingTxId, setEditingTxId] = useState<string | null>(null);

  // Custom confirmation dialog state (yakin / tidak)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    const handleReload = () => {
      setTxs(getStoredTransactions());
      setMembers(getStoredMembers());
    };
    handleReload();
    window.addEventListener('ippi_storage_updated', handleReload);
    return () => {
      window.removeEventListener('ippi_storage_updated', handleReload);
    };
  }, []);

  // Sync member lookup when typing member id
  const handleMemberIdLookup = (idVal: string) => {
    setSearchMemberId(idVal);
    if (!idVal.trim()) {
      setLinkedMember(null);
      return;
    }
    const found = members.find(
      (m) =>
        m.noAnggota === idVal.trim() ||
        m.id === idVal.trim() ||
        m.nama.toLowerCase().includes(idVal.toLowerCase())
    );
    if (found) {
      setLinkedMember(found);
      setKategori(TransaksiKategori.MASUK); // Auto set type
      setSumberTujuan(SumberDana.IURAN);
      setNoRekening(`Bank - Account ${found.noRekening || '9990000110'} a.n. ${found.nama}`);
      setDeskripsi(`Pembayaran Iuran Tahun Anggota: ${found.nama}`);
    } else {
      setLinkedMember(null);
    }
  };

  const recomputeBalances = (transactions: FinancialTransaction[]): FinancialTransaction[] => {
    // Sort chronologically by date so balances sum logically
    const sorted = [...transactions].sort((a, b) => a.tanggal.localeCompare(b.tanggal));
    let runningBalance = 0;
    return sorted.map((t, idx) => {
      runningBalance += t.jumlahMasuk - t.jumlahKeluar;
      return {
        ...t,
        no: idx + 1,
        saldoAkhir: runningBalance,
      };
    });
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();

    if (!deskripsi || !noRekening || jumlah <= 0) {
      setStatusMessage('Peringatan: Harap isi deskripsi, no rekening, dan jumlah nominal dengan benar!');
      return;
    }

    const jMasuk = kategori === TransaksiKategori.MASUK ? jumlah : 0;
    const jKeluar = kategori === TransaksiKategori.KELUAR ? jumlah : 0;

    const executeSave = () => {
      let updatedTxs: FinancialTransaction[] = [];

      if (editingTxId) {
        // Edit Mode
        updatedTxs = txs.map((t) => {
          if (t.id === editingTxId) {
            return {
              ...t,
              tanggal,
              kategori,
              sumberTujuan,
              deskripsi,
              noRekening,
              jumlahMasuk: jMasuk,
              jumlahKeluar: jKeluar,
              memberId: linkedMember?.id || undefined,
            };
          }
          return t;
        });
        setStatusMessage('Sukses: Transaksi keuangan berhasil diperbarui!');
      } else {
        // Add Mode
        const newTx: FinancialTransaction = {
          id: `tx_${Date.now()}`,
          no: txs.length + 1,
          tanggal,
          kategori,
          sumberTujuan,
          deskripsi,
          noRekening,
          jumlahMasuk: jMasuk,
          jumlahKeluar: jKeluar,
          saldoAkhir: 0, // Computed in recomputeBalances
          memberId: linkedMember?.id || undefined,
        };
        updatedTxs = [...txs, newTx];
        setStatusMessage('Sukses: Transaksi keuangan berhasil dicatat!');
      }

      const finalTxs = recomputeBalances(updatedTxs);
      setTxs(finalTxs);
      saveStoredTransactions(finalTxs);

      // Create automatic WhatsApp prompt text
      let phoneNum = '081234567890';
      let waText = '';
      if (kategori === TransaksiKategori.MASUK) {
        phoneNum = linkedMember ? linkedMember.noTelp : '081803100222';
        waText = `Yth. Anggota IPPI, Terima kasih pembayaran Iuran Anda sebesar Rp ${jumlah.toLocaleString('id-ID')} telah kami verifikasi masuk ke kas keuangan IPPI pada tanggal ${tanggal}. Semoga berkah dan sehat selalu! - Bendahara IPPI (jangan lupa selau update di web : https://dpwsppijatim.cekdiribk.id)`;
      } else {
        waText = `Pemberitahuan IPPI: Pengeluaran dana SPJ dengan perihal "${deskripsi}" sebesar Rp ${jumlah.toLocaleString('id-ID')} telah dicairkan dan ditransfer ke rekening ${noRekening} pada tanggal ${tanggal}. Harap simpan nota lunas Anda. Terima kasih. - Bendahara IPPI`;
      }

      setWhatsappMock({
        phone: phoneNum,
        text: waText,
      });

      // Reset Form & Exit Edit state
      setEditingTxId(null);
      setDeskripsi('');
      setNoRekening('');
      setJumlah(0);
      setSearchMemberId('');
      setLinkedMember(null);

      setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
    };

    if (editingTxId) {
      setConfirmModal({
        isOpen: true,
        title: 'Konfirmasi Perubahan Transaksi',
        message: 'Apakah Anda yakin ingin menyimpan perubahan data transaksi kas di Buku Kas IPPI ini?',
        onConfirm: () => {
          executeSave();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      });
    } else {
      executeSave();
    }
  };

  const handleEditClick = (tx: FinancialTransaction) => {
    setEditingTxId(tx.id);
    setTanggal(tx.tanggal);
    setKategori(tx.kategori);
    setSumberTujuan(tx.sumberTujuan);
    setDeskripsi(tx.deskripsi);
    setNoRekening(tx.noRekening);
    setJumlah(tx.kategori === TransaksiKategori.MASUK ? tx.jumlahMasuk : tx.jumlahKeluar);

    if (tx.memberId) {
      const found = members.find((m) => m.id === tx.memberId);
      if (found) {
        setLinkedMember(found);
        setSearchMemberId(found.noAnggota || found.nama);
      } else {
        setLinkedMember(null);
        setSearchMemberId('');
      }
    } else {
      setLinkedMember(null);
      setSearchMemberId('');
    }
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTxId(null);
    setDeskripsi('');
    setNoRekening('');
    setJumlah(0);
    setSearchMemberId('');
    setLinkedMember(null);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Konfirmasi Penghapusan Transaksi',
      message: 'Apakah Anda yakin ingin menghapus transaksi ini dari ledger Buku Kas IPPI secara permanen?',
      onConfirm: () => {
        const remaining = txs.filter((t) => t.id !== id);
        const finalTxs = recomputeBalances(remaining);
        setTxs(finalTxs);
        saveStoredTransactions(finalTxs);
        setStatusMessage('Sukses: Transaksi keuangan berhasil dihapus secara permanen!');
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setTimeout(() => setStatusMessage(null), 3000);
      }
    });
  };

  // Aggregators for top KPI cards
  const totalMasuk = txs.reduce((sum, item) => sum + item.jumlahMasuk, 0);
  const totalKeluar = txs.reduce((sum, item) => sum + item.jumlahKeluar, 0);
  const saldoAkhir = totalMasuk - totalKeluar;

  // Print separate reports to PDF
  const printReport = (type: 'MASUK' | 'KELUAR' | 'ALL') => {
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
      alert('Mohon izinkan pop-up untuk mempratinjau laporan cetak.');
      return;
    }

    let filterTxs = txs;
    let title = 'LAPORAN REKAPITULASI KAS KEUANGAN IPPI';
    if (type === 'MASUK') {
      filterTxs = txs.filter((t) => t.jumlahMasuk > 0);
      title = 'LAPORAN REKAPITULASI DANA MASUK (INCOMING) - IPPI';
    } else if (type === 'KELUAR') {
      filterTxs = txs.filter((t) => t.jumlahKeluar > 0);
      title = 'LAPORAN REKAPITULASI DANA KELUAR (SPJ/OPERASIONAL) - IPPI';
    }

    const tableRows = filterTxs
      .map(
        (t, idx) => `
      <tr>
        <td style="text-align: center; border: 1px solid #ddd; padding: 8px;">${idx + 1}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${t.tanggal}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${t.sumberTujuan}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${t.noRekening}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${t.deskripsi}</td>
        <td style="text-align: right; border: 1px solid #ddd; padding: 8px;">
          ${t.jumlahMasuk > 0 ? `Rp ${t.jumlahMasuk.toLocaleString('id-ID')}` : '-'}
        </td>
        <td style="text-align: right; border: 1px solid #ddd; padding: 8px;">
          ${t.jumlahKeluar > 0 ? `Rp ${t.jumlahKeluar.toLocaleString('id-ID')}` : '-'}
        </td>
      </tr>
    `
      )
      .join('');

    const pageHtml = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: sans-serif; color: #333; padding: 30px; line-height: 1.4; }
            .header-print { text-align: center; border-bottom: 2px solid #1B365D; padding-bottom: 15px; margin-bottom: 25px; }
            .doc-title { font-size: 18px; font-weight: bold; color: #1B365D; text-transform: uppercase; }
            .table-rep { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            .table-rep th { background-color: #1B365D; color: white; border: 1px solid #ddd; padding: 10px; }
            .summary-box { float: right; width: 300px; margin-top: 30px; border: 1px solid #1B365D; padding: 15px; border-radius: 8px; font-size: 13px; }
            .summary-line { display: flex; justify-content: space-between; margin-bottom: 6px; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header-print">
            <h3>IKATAN PROFESIONAL & PENSIUNAN INDONESIA</h3>
            <p style="font-size: 11px; color: #555; margin-top: -10px;">Laporan Administrasi Keuangan Nasional</p>
            <div class="doc-title">${title}</div>
          </div>

          <p style="font-size: 11px; color: #666;">Dicetak dari sistem pada tanggal: 30 Mei 2026</p>

          <table class="table-rep">
            <thead>
              <tr>
                <th style="width: 5%">No</th>
                <th style="width: 12%">Tanggal</th>
                <th style="width: 15%">Sumber/Peruntukan</th>
                <th style="width: 23%">Rekening Acuan</th>
                <th style="width: 25%">Keterangan Transaksi</th>
                <th style="width: 10%">Masuk (Rp)</th>
                <th style="width: 10%">Keluar (Rp)</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div class="summary-box">
            <div class="summary-line"><strong>Total Uang Masuk:</strong> <span>Rp ${totalMasuk.toLocaleString('id-ID')}</span></div>
            <div class="summary-line"><strong>Total Uang Keluar:</strong> <span>Rp ${totalKeluar.toLocaleString('id-ID')}</span></div>
            <div class="summary-line" style="border-top: 1px solid #1B365D; padding-top: 6px; margin-top: 6px;">
              <strong>Saldo Akhir:</strong> <span style="color: #1B365D; font-weight: bold;">Rp ${saldoAkhir.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div style="margin-top: 140px; float: left; width: 200px; text-align: center; font-size: 12px;">
            Disetujui Oleh,<br><strong>Ketua Umum IPPI</strong><br><br><br><br>( Prof. Dr. Ir. H. M. Muslih )
          </div>
          <div style="margin-top: 140px; float: right; width: 200px; text-align: center; font-size: 12px;">
            Dibuat Oleh,<br><strong>Bendahara IPPI</strong><br><br><br><br>( Drs. Bambang Wijaya, S.E. )
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    reportWindow.document.write(pageHtml);
    reportWindow.document.close();
  };

  return (
    <div className="space-y-8">
      {/* KPI Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1B365D] text-white rounded-2xl p-6 shadow-sm border-l-8 border-[#C5A059]">
          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">TOTAL UANG MASUK (KUMULATIF)</span>
          <h3 className="text-3xl font-serif font-bold mt-2">Rp {totalMasuk.toLocaleString('id-ID')}</h3>
          <p className="text-xs text-slate-300 mt-2">Jumlah dana terkumpul dari iuran & subsidi pengurus.</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E0D5] border-l-8 border-red-500">
          <span className="text-[10px] uppercase tracking-widest text-red-500 font-bold">TOTAL UANG KELUAR (PENGELUARAN)</span>
          <h3 className="text-3xl font-serif font-bold mt-2 text-[#1B365D]">Rp {totalKeluar.toLocaleString('id-ID')}</h3>
          <p className="text-xs text-[#8B7E66] mt-2">Pencairan untuk kegiatan SPJ, operasional kantor, dll.</p>
        </div>

        <div className="bg-[#F4F1EA] rounded-2xl p-6 shadow-sm border-2 border-[#1B365D] border-l-8 border-emerald-600">
          <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">SALDO AKHIR KAS KINI</span>
          <h3 className="text-3xl font-serif font-bold mt-2 text-[#1B365D]">Rp {saldoAkhir.toLocaleString('id-ID')}</h3>
          <p className="text-xs text-[#8B7E66] mt-2">Sisa dana likuid aktif organisasi yang dapat digunakan.</p>
        </div>
      </div>

      {/* Main Ledger Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Ledger recording form (Only accessible for Treasurer & Admin Role) */}
        <div className="lg:col-span-1 space-y-6">
          {currentRole !== 'KETUA' ? (
            <div className="bg-[#FDFCF8] border border-[#E5E0D5] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-[#1B365D] border-b border-[#E5E0D5] pb-3 mb-4">
                {editingTxId ? '⚙️ Edit Transaksi Kas Terpilih' : 'Catat Transaksi Kas Baru'}
              </h3>

              {statusMessage && (
                <div className={`p-3 rounded text-xs mb-4 ${statusMessage.startsWith('Sukses') ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500' : 'bg-red-50 text-red-800 border-l-4 border-red-500'}`}>
                  {statusMessage}
                </div>
              )}

              <form onSubmit={handleSaveTransaction} className="space-y-4">
                {/* Auto Link Member lookup */}
                <div>
                  <label className="block text-xs font-bold text-[#5D574F] mb-1">
                    Cari No Anggota / Hubungkan Anggota (Khusus Iuran)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Masukkan 3+ huruf atau 4+ angka..."
                      value={searchMemberId}
                      onChange={(e) => {
                        handleMemberIdLookup(e.target.value);
                        setShowSearchDropdown(true);
                      }}
                      onFocus={() => setShowSearchDropdown(true)}
                      onBlur={() => setTimeout(() => setShowSearchDropdown(false), 250)}
                      className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 pr-10 text-xs focus:ring-1 focus:ring-[#1B365D] focus:outline-none"
                    />
                    <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />

                    {/* Interactive Dropdown List */}
                    {showSearchDropdown && filteredSearchMembers.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E5E0D5] rounded-xl shadow-xl max-h-48 overflow-y-auto z-40 divide-y divide-slate-100">
                        {filteredSearchMembers.map((m) => (
                          <div
                            key={m.id}
                            onMouseDown={() => selectMemberFromDropdown(m)}
                            className="p-2.5 hover:bg-amber-50/40 bg-white transition-colors cursor-pointer text-left text-xs flex justify-between items-center"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-bold text-[#1B365D] truncate">{m.nama}</p>
                              <p className="text-[10px] text-gray-400 truncate">
                                No: {m.noAnggota || '-'} • {m.jabatan || 'Anggota'}
                              </p>
                            </div>
                            <span className="shrink-0 text-[10px] font-bold text-[#C5A059] bg-[#FDFCF8] border border-[#E5E0D5] py-0.5 px-2 rounded-full">
                              Pilih
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {linkedMember && (
                    <div className="mt-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded px-3 py-1.5 text-[11px] flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 min-w-0">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold truncate">Terhubung: {linkedMember.nama}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLinkedMember(null);
                          setSearchMemberId('');
                        }}
                        className="shrink-0 text-[9px] font-bold text-red-700 bg-white hover:bg-red-50 border border-red-350 rounded px-1.5 py-0.5 transition-colors cursor-pointer"
                      >
                        Putus Link
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#5D574F] mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5D574F] mb-1">Aliran Dana</label>
                    <select
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value as TransaksiKategori)}
                      className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                    >
                      <option value={TransaksiKategori.MASUK}>Uang Masuk</option>
                      <option value={TransaksiKategori.KELUAR}>Uang Keluar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5D574F] mb-1">Kategori / Sumber Dana</label>
                  <select
                    value={sumberTujuan}
                    onChange={(e) => {
                      const val = e.target.value as SumberDana;
                      setSumberTujuan(val);
                      if (val === SumberDana.DANA_DPW) {
                        setKategori(TransaksiKategori.MASUK);
                        const conf = getStoredConfig();
                        const dpwBank = conf.noRekeningIppiBaris1 || 'Bank Jatim Rek: 1023048999 a.n. DPW IPPI JAWA TIMUR';
                        setNoRekening(dpwBank);
                        setDeskripsi('Penerimaan dana kontribusi / subsidi dari DPW Jatim');
                      } else if (val === SumberDana.DANA_DPP) {
                        setKategori(TransaksiKategori.MASUK);
                        setNoRekening('Bank BNI - Account 12345678 a.n. DPP IPPI');
                        setDeskripsi('Dana Subsidi Operasional dari Pengurus Pusat (DPP)');
                      }
                    }}
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                  >
                    <option value={SumberDana.IURAN}>Iuran Anggota ({SumberDana.IURAN})</option>
                    <option value={SumberDana.NOTA_MASUK}>Nota Dana Masuk</option>
                    <option value={SumberDana.DANA_DPP}>Dana DPP</option>
                    <option value={SumberDana.DANA_DPW}>Penerimaan dari DPW</option>
                    <option value={SumberDana.SPJ}>SPJ Keluar</option>
                    <option value={SumberDana.OPERASIONAL}>Operasional Kantor</option>
                    <option value={SumberDana.LAINNYA}>Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5D574F] mb-1">Keterangan / Deskripsi Transaksi</label>
                  <textarea
                    rows={2}
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Contoh: Pembayaran iuran maret atau Pembelian ATK..."
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5D574F] mb-1">Rekening Sumber/Tujuan & Pemilik</label>
                  <input
                    type="text"
                    value={noRekening}
                    onChange={(e) => setNoRekening(e.target.value)}
                    placeholder="Contoh: Bank Mandiri - 9993310022 a.n. Sulastri"
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1B365D]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5D574F] mb-1">Jumlah Nominal (Rp)</label>
                  <input
                    type="number"
                    value={jumlah || ''}
                    onChange={(e) => setJumlah(Number(e.target.value))}
                    placeholder="Masukkan nominal Rp..."
                    className="w-full bg-white border border-[#E5E0D5] rounded-lg px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-[#1B365D]"
                    required
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#1B365D] hover:bg-[#122543] text-white py-3 rounded-lg text-sm font-bold shadow transition-colors cursor-pointer"
                  >
                    {editingTxId ? '🔄 Simpan Perubahan Transaksi' : 'Simpan Transaksi Kas'}
                  </button>
                  {editingTxId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-xs font-semibold border border-gray-300 transition-colors cursor-pointer"
                    >
                      Batal Edit (Buat Baru)
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-[#FDFCF8] border border-amber-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-serif font-bold text-amber-900 mb-2">Akses Pemantauan Ketua</h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                Anda login sebagai <strong>Ketua Umum (Chairman)</strong>. Sesuai aturan organisasi, Anda memegang hak prerogatif untuk memantau data kas, melihat neraca bulanan, dan mencetak laporan keuangan, namun pencatatan transaksi kas baru sepenuhnya dikelola oleh <strong>Bendahara</strong>.
              </p>
            </div>
          )}

          {/* Quick Mock WhatsApp Notification panel */}
          {whatsappMock && (
            <div className="bg-[#E8F5E9] border border-emerald-300 text-[#1B5E20] rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase text-emerald-800">
                <Send className="w-4 h-4" />
                <span>Kirim Bukti Pembayaran ke WhatsApp</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Pesan notifikasi konfirmasi di bawah ini siap dikirim ke nomor WhatsApp anggota (lansia-terdaftar) secara otomatis:
              </p>
              <div className="bg-white rounded border border-emerald-200 p-3 font-mono text-[11px] text-gray-700 break-words">
                <strong>Kepada:</strong> {whatsappMock.phone} <br />
                <strong>Pesan:</strong> {whatsappMock.text}
              </div>
              <a
                href={`https://api.whatsapp.com/send?phone=${whatsappMock.phone}&text=${encodeURIComponent(whatsappMock.text)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition-transform hover:scale-102"
              >
                <span>Kirim Lewat WhatsApp Sekarang</span>
              </a>
            </div>
          )}
        </div>

        {/* Dynamic Ledger table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E5E0D5] rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F4F1EA] pb-4 mb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1B365D]">Buku Kas Ledger IPPI</h3>
                <p className="text-xs text-[#8B7E66]">Ringkasan administrasi buku besar lengkap dengan rumus saldo akhir otomatis.</p>
              </div>

              {/* PDF Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => printReport('MASUK')}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded text-xs font-semibold cursor-pointer border border-emerald-200"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Daftar Dana Masuk PDF</span>
                </button>
                <button
                  onClick={() => printReport('KELUAR')}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-red-50 text-red-800 hover:bg-red-100 rounded text-xs font-semibold cursor-pointer border border-red-200"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Daftar Dana Keluar PDF</span>
                </button>
                <button
                  onClick={() => printReport('ALL')}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-[#1B365D] text-white hover:bg-[#122543] rounded text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Buku Besar</span>
                </button>
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F4F1EA] text-[#1B365D] border-b border-[#E5E0D5]">
                    <th className="px-3 py-3 font-semibold text-center w-8">No</th>
                    <th className="px-3 py-3 font-semibold w-24">Tanggal</th>
                    <th className="px-3 py-3 font-semibold w-28">Kategori / Sumber</th>
                    <th className="px-3 py-3 font-semibold min-w-[200px]">Deskripsi Transaksi</th>
                    <th className="px-3 py-3 font-semibold w-24 text-right">Masuk (Rp)</th>
                    <th className="px-3 py-3 font-semibold w-24 text-right">Keluar (Rp)</th>
                    <th className="px-3 py-3 font-semibold w-28 text-right bg-slate-50">Saldo Akhir</th>
                    {(currentRole === 'ADMIN' || currentRole === 'BENDAHARA') && (
                      <th className="px-3 py-3 font-semibold w-20 text-center">Aksi</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F1EA]">
                  {txs.length === 0 ? (
                    <tr>
                      <td colSpan={currentRole === 'ADMIN' || currentRole === 'BENDAHARA' ? 8 : 7} className="px-4 py-8 text-center text-[#8B7E66] italic">
                        Belum ada pencatatan kas tercatat.
                      </td>
                    </tr>
                  ) : (
                    txs.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#FDFCF8] transition-colors">
                        <td className="px-3 py-3.5 text-center text-gray-500">{tx.no}</td>
                        <td className="px-3 py-3.5 font-medium whitespace-nowrap">{tx.tanggal}</td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.kategori === TransaksiKategori.MASUK ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>
                            {tx.sumberTujuan}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          <p className="font-semibold text-gray-800">{tx.deskripsi}</p>
                          <span className="text-[10px] text-gray-400 block mt-0.5">{tx.noRekening}</span>
                        </td>
                        <td className="px-3 py-3.5 text-right font-semibold text-emerald-600 whitespace-nowrap">
                          {tx.jumlahMasuk > 0 ? `+ ${tx.jumlahMasuk.toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="px-3 py-3.5 text-right font-semibold text-rose-600 whitespace-nowrap">
                          {tx.jumlahKeluar > 0 ? `- ${tx.jumlahKeluar.toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="px-3 py-3.5 text-right font-bold text-[#1B365D] bg-slate-50 whitespace-nowrap">
                          Rp {tx.saldoAkhir.toLocaleString('id-ID')}
                        </td>
                        {(currentRole === 'ADMIN' || currentRole === 'BENDAHARA') && (
                          <td className="px-2 py-3.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button
                                onClick={() => handleEditClick(tx)}
                                title="Edit Transaksi ini"
                                className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-all cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(tx.id)}
                                title="Hapus Transaksi ini"
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Quick Summary footnote */}
            <div className="mt-4 pt-4 border-t border-[#F4F1EA] text-[11px] text-[#5D574F] italic flex justify-between items-center bg-slate-50 p-2.5 rounded">
              <span>* Semua rumus saldo dihitung secara otomatis dan real-time dari riwayat transaksi terdahulu.</span>
              <span className="font-serif font-bold text-[#1B365D]">IPPI DPW Jawa Timur</span>
            </div>
          </div>
        </div>

      </div>

      {/* Custom Confirmation Popup Dialog (Yakin dan Tidak) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-[#1B365D]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-full border flex-shrink-0 ${
                confirmModal.title.includes('Penghapusan') 
                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                  : 'bg-indigo-50 border-indigo-200 text-[#1B365D]'
              }`}>
                {confirmModal.title.includes('Penghapusan') ? (
                  <Trash2 className="w-6 h-6" />
                ) : (
                  <Edit className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-serif font-bold text-[#1B365D] mb-1">
                  {confirmModal.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-end space-x-2.5">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-xs font-bold border border-[#E5E0D5] hover:bg-slate-50 text-gray-500 rounded-xl transition-colors cursor-pointer"
              >
                Tidak / Batal
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`px-4.5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all cursor-pointer hover:shadow-lg ${
                  confirmModal.title.includes('Penghapusan')
                    ? 'bg-rose-600 hover:bg-rose-700 active:scale-95'
                    : 'bg-[#1B365D] hover:bg-[#254673] active:scale-95'
                }`}
              >
                Yakin / Ya
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
