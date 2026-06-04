import React, { useState, useEffect } from 'react';
import { BalanceSheetData, FinancialTransaction, UserRole } from '../types';
import { saveStoredNeraca } from '../utils/storage';
import { Printer, Edit3, Save, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface LaporanNeracaProps {
  currentRole: UserRole | null;
  txs: FinancialTransaction[];
  neraca: BalanceSheetData;
  logoUrl?: string;
  logoText?: string;
}

export default function LaporanNeraca({ currentRole, txs, neraca, logoUrl, logoText }: LaporanNeracaProps) {
  const isAuthorized = currentRole === UserRole.ADMIN || currentRole === UserRole.BENDAHARA;
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Internal form fields matching BalanceSheetData
  const [form, setForm] = useState<BalanceSheetData>({
    piutangAnggota: 0,
    uangMukaPanjar: 0,
    lainLainAktivaLancar: 0,
    lainLainAktivaLancarKet: '',
    peralatanKantor: 0,
    akumulasiPenyusutan: 0,
    lainLainAktivaTetap: 0,
    lainLainAktivaTetapKet: '',
    hutangOperasional: 0,
    kewajibanLainnya: 0,
    lainLainLiabilitas: 0,
    lainLainLiabilitasKet: '',
    modalCadangan: 0,
    surplusDefisit: 0,
    lainLainEkuitas: 0,
    lainLainEkuitasKet: ''
  });

  // Calculate dynamic bank/cash balance from ledger
  const totalMasuk = txs.reduce((acc, curr) => acc + (curr.jumlahMasuk || 0), 0);
  const totalKeluar = txs.reduce((acc, curr) => acc + (curr.jumlahKeluar || 0), 0);
  const currentCashBank = totalMasuk - totalKeluar;

  // Track and update local form state when incoming prop changes
  useEffect(() => {
    if (neraca) {
      setForm({ ...neraca });
    }
  }, [neraca]);

  // Handle manual input change
  const handleNumberChange = (field: keyof BalanceSheetData, val: string) => {
    const parsed = parseInt(val.replace(/\D/g, ''), 10) || 0;
    setForm(prev => ({ ...prev, [field]: parsed }));
  };

  const handleTextChange = (field: keyof BalanceSheetData, val: string) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  // Helper to auto sync surplus/defisit from transactions ledger
  const autoSyncSurplusDefisit = () => {
    setForm(prev => ({ ...prev, surplusDefisit: currentCashBank }));
  };

  // Save to storage & Firestore
  const handleSave = () => {
    saveStoredNeraca(form);
    setIsEditing(false);
    setSuccessMessage('Data Neraca berhasil disimpan dan disingkronkan ke database!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // Mathematical balance calculations
  const totalAsetLancar = currentCashBank + form.piutangAnggota + form.uangMukaPanjar + form.lainLainAktivaLancar;
  const totalAsetTetap = form.peralatanKantor - form.akumulasiPenyusutan + form.lainLainAktivaTetap;
  const totalAktiva = totalAsetLancar + totalAsetTetap;

  const totalKewajiban = form.hutangOperasional + form.kewajibanLainnya + form.lainLainLiabilitas;
  const totalEkuitas = form.modalCadangan + form.surplusDefisit + form.lainLainEkuitas;
  
  // Saldo sebagai penyeimbang (Aktiva - Pasiva sebelum penyeimbang)
  const pasivaSebelumPenyeimbang = totalKewajiban + totalEkuitas;
  const saldoPenyeimbang = totalAktiva - pasivaSebelumPenyeimbang;
  
  // Total Pasiva setelah ditambahkan saldo penyeimbang
  const totalPasiva = totalKewajiban + totalEkuitas + saldoPenyeimbang;

  // Cek apakah neraca murni seimbang (tanpa perlu saldo penyeimbang)
  const isMurniBalanced = totalAktiva === pasivaSebelumPenyeimbang;
  const balanceGap = Math.abs(totalAktiva - pasivaSebelumPenyeimbang);

  return (
    <div id="laporan-neraca-wrapper" className="space-y-6">
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl text-xs flex items-center gap-2 font-medium">
          <CheckCircle size={16} className="text-emerald-600 animate-bounce" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ADMIN/BENDAHARA CONTROL CARD CONTAINER */}
      {isAuthorized && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-5 sm:p-6 text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800">
                Sistem Konfigurasi Neraca (Admin & Bendahara)
              </span>
              <h4 className="text-base font-serif font-bold text-[#1B365D]">Atur Parameter & Saldo Laporan Neraca</h4>
              <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
                Kombinasikan saldo kas real-time dari buku keuangan digital dengan entri aset tetap, piutang, kewajiban, dan ekuitas organisasi.
              </p>
            </div>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-2 self-start sm:self-center ${
                isEditing 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                  : 'bg-[#1B365D] text-white hover:bg-[#C5A059]'
              }`}
            >
              <Edit3 size={14} />
              {isEditing ? 'Batal Mengedit' : 'Input / Edit Neraca'}
            </button>
          </div>

          {/* EDIT FORM */}
          {isEditing && (
            <div className="bg-white border border-amber-200 rounded-2xl p-4 sm:p-6 space-y-6 animate-fadeIn font-sans">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* FORM COLUMN I: AKTIVA (ASET) */}
                <div className="space-y-4">
                  <h5 className="font-bold text-[#1B365D] text-xs border-b pb-1 uppercase tracking-wider">
                    I. AKTIVA (ASET)
                  </h5>
                  
                  {/* A. Aset Lancar */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-700">A. Aset Lancar</p>
                    <div className="pl-2 space-y-2.5">
                      <div>
                        <label className="block text-[11px] text-gray-500 font-medium mb-1">
                          Kas dan Bank (Saldo Kas IPPI - Otomatis dari Buku Kas)
                        </label>
                        <input
                          type="text"
                          disabled
                          value={`Rp ${currentCashBank.toLocaleString('id-ID')}`}
                          className="w-full text-xs p-2.5 bg-gray-100 border border-gray-200 rounded-lg font-mono text-gray-600 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-gray-700 font-medium mb-1">
                          Piutang Anggota (Rp)
                        </label>
                        <input
                          type="text"
                          value={form.piutangAnggota.toLocaleString('id-ID')}
                          onChange={(e) => handleNumberChange('piutangAnggota', e.target.value)}
                          className="w-full text-xs p-2.5 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#1B365D] focus:outline-hidden font-mono"
                          placeholder="Masukkan nilai piutang"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-gray-700 font-medium mb-1">
                          Uang Muka / Panjar SPJ (Rp)
                        </label>
                        <input
                          type="text"
                          value={form.uangMukaPanjar.toLocaleString('id-ID')}
                          onChange={(e) => handleNumberChange('uangMukaPanjar', e.target.value)}
                          className="w-full text-xs p-2.5 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#1B365D] focus:outline-hidden font-mono"
                          placeholder="Masukkan nilai uang muka/panjar"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-gray-700 font-medium mb-1">
                            Lain-lain Aset Lancar (Rp)
                          </label>
                          <input
                            type="text"
                            value={form.lainLainAktivaLancar.toLocaleString('id-ID')}
                            onChange={(e) => handleNumberChange('lainLainAktivaLancar', e.target.value)}
                            className="w-full text-xs p-2.5 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#1B365D] focus:outline-hidden font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-700 font-medium mb-1">
                            Keterangan Lain-lain Lancar
                          </label>
                          <input
                            type="text"
                            value={form.lainLainAktivaLancarKet}
                            onChange={(e) => handleTextChange('lainLainAktivaLancarKet', e.target.value)}
                            className="w-full text-xs p-2.5 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#1B365D] focus:outline-hidden"
                            placeholder="Contoh: Deposito Berjangka"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* B. Aset Tetap */}
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-bold text-gray-700">B. Aset Tetap</p>
                    <div className="pl-2 space-y-2.5">
                      <div>
                        <label className="block text-[11px] text-gray-700 font-medium mb-1">
                          Peralatan dan Inventaris Kantor (Rp)
                        </label>
                        <input
                          type="text"
                          value={form.peralatanKantor.toLocaleString('id-ID')}
                          onChange={(e) => handleNumberChange('peralatanKantor', e.target.value)}
                          className="w-full text-xs p-2.5 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#1B365D] focus:outline-hidden font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-gray-700 font-medium mb-1">
                          Akumulasi Penyusutan (Rp, kurangi nilai aset tetap)
                        </label>
                        <input
                          type="text"
                          value={form.akumulasiPenyusutan.toLocaleString('id-ID')}
                          onChange={(e) => handleNumberChange('akumulasiPenyusutan', e.target.value)}
                          className="w-full text-xs p-2.5 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#1B365D] focus:outline-hidden font-mono text-[#D63031] font-semibold"
                          placeholder="Masukkan nilai penyusutan"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-gray-700 font-medium mb-1">
                            Lain-lain Aset Tetap (Rp)
                          </label>
                          <input
                            type="text"
                            value={form.lainLainAktivaTetap.toLocaleString('id-ID')}
                            onChange={(e) => handleNumberChange('lainLainAktivaTetap', e.target.value)}
                            className="w-full text-xs p-2.5 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#1B365D] focus:outline-hidden font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-700 font-medium mb-1">
                            Keterangan Lain-lain Tetap
                          </label>
                          <input
                            type="text"
                            value={form.lainLainAktivaTetapKet}
                            onChange={(e) => handleTextChange('lainLainAktivaTetapKet', e.target.value)}
                            className="w-full text-xs p-2.5 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#1B365D] focus:outline-hidden"
                            placeholder="Contoh: Gedung Kantor Utama"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* FORM COLUMN II: PASIVA (KEWAJIBAN & EKUITAS) */}
                <div className="space-y-4">
                  <h5 className="font-bold text-[#1B365D] text-xs border-b pb-1 uppercase tracking-wider">
                    II. PASIVA (KEWAJIBAN & EKUITAS)
                  </h5>

                  {/* A. Kewajiban */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-700">A. Kewajiban (Liabilitas)</p>
                    <div className="pl-2 space-y-2.5">
                      <div>
                        <label className="block text-[11px] text-gray-700 font-medium mb-1">
                          Hutang Jangka Pendek / Operasional (Rp)
                        </label>
                        <input
                          type="text"
                          value={form.hutangOperasional.toLocaleString('id-ID')}
                          onChange={(e) => handleNumberChange('hutangOperasional', e.target.value)}
                          className="w-full text-xs p-2.5 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#1B365D] focus:outline-hidden font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-gray-700 font-medium mb-1">
                          Kewajiban Pembayaran Lainnya (Rp)
                        </label>
                        <input
                          type="text"
                          value={form.kewajibanLainnya.toLocaleString('id-ID')}
                          onChange={(e) => handleNumberChange('kewajibanLainnya', e.target.value)}
                          className="w-full text-xs p-2.5 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#1B365D] focus:outline-hidden font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-gray-700 font-medium mb-1">
                            Lain-lain Kewajiban (Rp)
                          </label>
                          <input
                            type="text"
                            value={form.lainLainLiabilitas.toLocaleString('id-ID')}
                            onChange={(e) => handleNumberChange('lainLainLiabilitas', e.target.value)}
                            className="w-full text-xs p-2.5 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#1B365D] focus:outline-hidden font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-700 font-medium mb-1">
                            Keterangan Lain-lain Kewajiban
                          </label>
                          <input
                            type="text"
                            value={form.lainLainLiabilitasKet}
                            onChange={(e) => handleTextChange('lainLainLiabilitasKet', e.target.value)}
                            className="w-full text-xs p-2.5 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#1B365D] focus:outline-hidden"
                            placeholder="Contoh: Titipan Dana Hibah"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* B. Ekuitas */}
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-bold text-gray-700">B. Ekuitas (Kekayaan Bersih)</p>
                    <div className="pl-2 space-y-2.5">
                      <div>
                        <label className="block text-[11px] text-gray-700 font-medium mb-1">
                          Modal / Dana Cadangan Organisasi (Rp)
                        </label>
                        <input
                          type="text"
                          value={form.modalCadangan.toLocaleString('id-ID')}
                          onChange={(e) => handleNumberChange('modalCadangan', e.target.value)}
                          className="w-full text-xs p-2.5 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#1B365D] focus:outline-hidden font-mono"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[11px] text-gray-700 font-medium">
                            Surplus / Defisit Periode Berjalan (Rp)
                          </label>
                          <button
                            type="button"
                            onClick={autoSyncSurplusDefisit}
                            className="text-[10px] text-[#1B365D] hover:text-[#C5A059] font-bold flex items-center gap-1 focus:outline-hidden cursor-pointer"
                            title="Klik untuk menyamakan saldo dengan kas real-time buku kas"
                          >
                            <RefreshCw size={10} /> Gunakan Saldo Buku Kas (Rp {currentCashBank.toLocaleString('id-ID')})
                          </button>
                        </div>
                        <input
                          type="text"
                          value={form.surplusDefisit.toLocaleString('id-ID')}
                          onChange={(e) => handleNumberChange('surplusDefisit', e.target.value)}
                          className="w-full text-xs p-2.5 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#1B365D] focus:outline-hidden font-mono"
                          placeholder="Masukkan nilai surplus/defisit"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-gray-700 font-medium mb-1">
                            Lain-lain Ekuitas (Rp)
                          </label>
                          <input
                            type="text"
                            value={form.lainLainEkuitas.toLocaleString('id-ID')}
                            onChange={(e) => handleNumberChange('lainLainEkuitas', e.target.value)}
                            className="w-full text-xs p-2.5 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#1B365D] focus:outline-hidden font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-700 font-medium mb-1">
                            Keterangan Lain-lain Ekuitas
                          </label>
                          <input
                            type="text"
                            value={form.lainLainEkuitasKet}
                            onChange={(e) => handleTextChange('lainLainEkuitasKet', e.target.value)}
                            className="w-full text-xs p-2.5 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-[#1B365D] focus:outline-hidden"
                            placeholder="Contoh: Sumbangan Hibah CSR"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* SAVE ACTION & CALCULATIONS FEEDBACK */}
              <div className="border-t border-gray-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-2xl">
                <div className="text-[11px] text-gray-600 flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <div>
                    <span>Total Aktiva: </span>
                    <span className="font-bold text-[#1B365D] font-mono">Rp {totalAktiva.toLocaleString('id-ID')}</span>
                  </div>
                  <div>
                    <span>Pasiva (Murni): </span>
                    <span className="font-bold text-[#1B365D] font-mono">Rp {pasivaSebelumPenyeimbang.toLocaleString('id-ID')}</span>
                  </div>
                  {saldoPenyeimbang !== 0 && (
                    <div>
                      <span>Penyeimbang: </span>
                      <span className="font-bold text-amber-700 font-mono">Rp {saldoPenyeimbang.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 ml-0 sm:ml-2">
                    {isMurniBalanced ? (
                      <span className="bg-emerald-100 border border-emerald-300 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[9px] flex items-center gap-0.5">
                        ● SEIMBANG MURNI
                      </span>
                    ) : (
                      <span className="bg-amber-100 border border-amber-300 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[9px] flex items-center gap-0.5">
                        ▲ PENYEIMBANG AKTIF
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="w-1/2 sm:w-auto px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-1/2 sm:w-auto px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Save size={14} />
                    Simpan & Singkronkan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LAPORAN NERACA VIEW DOCUMENT */}
      <div className="bg-white border border-[#E5E0D5] rounded-3xl p-6 sm:p-8 text-left shadow-xs space-y-6">
        
        {/* Header Kop Laporan */}
        <div className="border-b-2 border-[#1B365D] pb-5 flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
          {(logoUrl || logoText) && (
            <div className="w-16 h-16 bg-[#1B365D] text-white rounded-full flex items-center justify-center text-xl font-serif font-bold border-2 border-[#C5A059] md:mr-2 shrink-0 shadow-sm overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo Organisasi" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                logoText
              )}
            </div>
          )}
          <div className="space-y-1">
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-[#8B7E66]">IKATAN PROFESIONAL & PENSIUNAN INDONESIA DPW JAWA TIMUR</h3>
            <h4 className="text-xl sm:text-2xl font-serif text-[#1B365D] font-extrabold leading-tight">LAPORAN NERACA KEUANGAN ORGANISASI</h4>
            <p className="text-[11px] text-gray-500 font-mono">
              Per Tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Balance Sheet Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          
          {/* I. AKTIVA COLUMN */}
          <div className="space-y-4 text-sm font-sans">
            <h5 className="font-bold text-[#1B365D] border-b pb-1 flex justify-between uppercase tracking-wider text-xs">
              <span>I. AKTIVA (ASET)</span>
              <span className="text-gray-400 font-normal">Lancar & Tetap</span>
            </h5>
            
            <div className="space-y-4">
              {/* A. Aset Lancar */}
              <div>
                <h6 className="font-semibold text-gray-700 text-xs uppercase tracking-wide text-left">A. Aset Lancar</h6>
                <div className="pl-3 space-y-2 mt-1.5 text-xs text-slate-800">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Kas dan Bank (Saldo Kas IPPI)</span>
                    <span className="font-mono text-gray-900 font-semibold bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                      Rp {currentCashBank.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Piutang Anggota</span>
                    <span className={`font-mono ${form.piutangAnggota > 0 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                      Rp {form.piutangAnggota.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Uang Muka / Panjar SPJ</span>
                    <span className={`font-mono ${form.uangMukaPanjar > 0 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                      Rp {form.uangMukaPanjar.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {(form.lainLainAktivaLancar > 0 || form.lainLainAktivaLancarKet) && (
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="italic">Lain-lain {form.lainLainAktivaLancarKet ? `(${form.lainLainAktivaLancarKet})` : ''}</span>
                      <span className="font-mono text-gray-900 font-semibold">
                        Rp {form.lainLainAktivaLancar.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="pl-3 flex justify-between items-center text-xs font-semibold text-gray-700 mt-2 border-t border-dashed border-gray-100 pt-1.5">
                  <span>Sub Total Aset Lancar</span>
                  <span className="font-mono">Rp {totalAsetLancar.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* B. Aset Tetap */}
              <div className="pt-2">
                <h6 className="font-semibold text-gray-700 text-xs uppercase tracking-wide text-left">B. Aset Tetap</h6>
                <div className="pl-3 space-y-2 mt-1.5 text-xs text-slate-800">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Peralatan & Inventaris Kantor</span>
                    <span className={`font-mono ${form.peralatanKantor > 0 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                      Rp {form.peralatanKantor.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500">
                    <span>Akumulasi Penyusutan Peralatan</span>
                    <span className={`font-mono ${form.akumulasiPenyusutan > 0 ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                      (Rp {form.akumulasiPenyusutan.toLocaleString('id-ID')})
                    </span>
                  </div>
                  {(form.lainLainAktivaTetap > 0 || form.lainLainAktivaTetapKet) && (
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="italic">Lain-lain {form.lainLainAktivaTetapKet ? `(${form.lainLainAktivaTetapKet})` : ''}</span>
                      <span className="font-mono text-gray-900 font-semibold">
                        Rp {form.lainLainAktivaTetap.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="pl-3 flex justify-between items-center text-xs font-semibold text-gray-700 mt-2 border-t border-dashed border-gray-100 pt-1.5">
                  <span>Sub Total Aset Tetap</span>
                  <span className="font-mono">Rp {totalAsetTetap.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* II. PASIVA COLUMN */}
          <div className="space-y-4 text-sm font-sans pt-4 md:pt-0 md:pl-8">
            <h5 className="font-bold text-[#1B365D] border-b pb-1 flex justify-between uppercase tracking-wider text-xs">
              <span>II. PASIVA (KEWAJIBAN & EKUITAS)</span>
              <span className="text-gray-400 font-normal">Hak & Kewajiban</span>
            </h5>

            <div className="space-y-4">
              {/* A. Kewajiban */}
              <div>
                <h6 className="font-semibold text-gray-700 text-xs uppercase tracking-wide text-left">A. Kewajiban (Liabilitas)</h6>
                <div className="pl-3 space-y-2 mt-1.5 text-xs text-slate-800">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Hutang Jangka Pendek (Operasional)</span>
                    <span className={`font-mono ${form.hutangOperasional > 0 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                      Rp {form.hutangOperasional.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Kewajiban Pembayaran Lainnya</span>
                    <span className={`font-mono ${form.kewajibanLainnya > 0 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                      Rp {form.kewajibanLainnya.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {(form.lainLainLiabilitas > 0 || form.lainLainLiabilitasKet) && (
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="italic">Lain-lain {form.lainLainLiabilitasKet ? `(${form.lainLainLiabilitasKet})` : ''}</span>
                      <span className="font-mono text-gray-900 font-semibold">
                        Rp {form.lainLainLiabilitas.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="pl-3 flex justify-between items-center text-xs font-semibold text-gray-700 mt-2 border-t border-dashed border-gray-100 pt-1.5">
                  <span>Sub Total Kewajiban</span>
                  <span className="font-mono">Rp {totalKewajiban.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* B. Ekuitas */}
              <div className="pt-2">
                <h6 className="font-semibold text-gray-700 text-xs uppercase tracking-wide text-left">B. Ekuitas (Kekayaan Bersih)</h6>
                <div className="pl-3 space-y-2 mt-1.5 text-xs text-slate-800">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Modal/Dana Cadangan Organisasi</span>
                    <span className={`font-mono ${form.modalCadangan > 0 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                      Rp {form.modalCadangan.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Surplus / Defisit Periode Berjalan</span>
                    <span className={`font-mono ${form.surplusDefisit !== 0 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                      Rp {form.surplusDefisit.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {(form.lainLainEkuitas > 0 || form.lainLainEkuitasKet) && (
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="italic">Lain-lain {form.lainLainEkuitasKet ? `(${form.lainLainEkuitasKet})` : ''}</span>
                      <span className="font-mono text-gray-900 font-semibold">
                        Rp {form.lainLainEkuitas.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="pl-3 flex justify-between items-center text-xs font-semibold text-gray-700 mt-2 border-t border-dashed border-gray-100 pt-1.5">
                  <span>Sub Total Ekuitas Bersih</span>
                  <span className="font-mono">Rp {totalEkuitas.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* C. SALDO */}
              <div className="pt-2">
                <h6 className="font-semibold text-gray-700 text-xs uppercase tracking-wide text-left">C. SALDO</h6>
                <div className="pl-3 space-y-2 mt-1.5 text-xs text-slate-800">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Saldo...</span>
                    <span className={`font-mono font-bold ${saldoPenyeimbang !== 0 ? 'text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200' : 'text-gray-400'}`}>
                      Rp {saldoPenyeimbang.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* TOTALS SEIMBANG BAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t-2 border-dashed border-gray-200 text-sm font-sans">
          <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl flex justify-between items-center">
            <span className="font-bold text-emerald-800 text-xs tracking-wider uppercase">TOTAL AKTIVA (ASET)</span>
            <span className="font-mono text-emerald-950 font-extrabold text-base">
              Rp {totalAktiva.toLocaleString('id-ID')}
            </span>
          </div>
          
          <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl flex justify-between items-center md:ml-4">
            <span className="font-bold text-emerald-800 text-xs tracking-wider uppercase">TOTAL PASIVA (KEW. & EKUITAS)</span>
            <span className="font-mono text-emerald-950 font-extrabold text-base">
              Rp {totalPasiva.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Print & Status Bar Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 pt-2 font-sans bg-gray-50 p-3.5 rounded-xl border border-gray-100">
          <div className="flex items-center gap-1.5">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${isMurniBalanced ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
            {isMurniBalanced ? (
              <span className="font-semibold text-[11px] text-emerald-800">
                Laporan Neraca Seimbang secara Murni (Balanced & Real-time Terintegrasi)
              </span>
            ) : (
              <span className="font-semibold text-[11px] text-amber-800 flex items-center gap-1">
                <AlertTriangle size={12} className="text-amber-600" />
                Neraca Seimbang (Balanced) & Real-time Terintegrasi Bendahara (Saldo: Rp {saldoPenyeimbang.toLocaleString('id-ID')})
              </span>
            )}
          </div>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 text-[10px] font-bold text-[#1B365D] hover:text-[#C5A059] border border-gray-300 rounded hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Printer size={12} /> Cetak Laporan Neraca
          </button>
        </div>
      </div>
    </div>
  );
}
