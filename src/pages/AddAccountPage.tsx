import React, { useState, useEffect } from 'react';
import { User, ChevronDown, Send } from 'lucide-react';
import { Account } from '../App';

interface AddAccountPageProps {
  onNavigate: (page: string) => void;
  onAddAccount: (newAccount: Account) => void;
}

export default function AddAccountPage({ onNavigate, onAddAccount }: AddAccountPageProps): React.ReactElement {
  const [namaDepan, setNamaDepan] = useState<string>('');
  const [namaBelakang, setNamaBelakang] = useState<string>('');
  const [namaLengkap, setNamaLengkap] = useState<string>('');
  const [tempatLahir, setTempatLahir] = useState<string>('');
  const [tanggalLahir, setTanggalLahir] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  
  // Account Status States
  const [role, setRole] = useState<string>('Masyarakat Adat');
  const [statusAktif, setStatusAktif] = useState<boolean>(true);
  const [wajibGantiPassword, setWajibGantiPassword] = useState<boolean>(false);
  const [askText, setAskText] = useState<string>('');

  // Dropdown for Role Selector
  const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);

  // Sync display name as user types first and last name
  useEffect(() => {
    const fullName = [namaDepan, namaBelakang].filter(Boolean).join(' ');
    setNamaLengkap(fullName);
  }, [namaDepan, namaBelakang]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!namaDepan || !email || !username) {
      alert('Nama Depan, Email, dan Username wajib diisi!');
      return;
    }

    // Generate random mock ID
    const randomId = Math.random().toString(36).substring(2, 6).toUpperCase();
    const idPrefix = role === 'Pakar' ? 'P' : 'MA';
    const newId = `${idPrefix}${randomId}`;

    const newAccount: Account = {
      id: newId,
      namaDepan,
      namaBelakang,
      namaLengkap: namaLengkap || `${namaDepan} ${namaBelakang}`,
      tempatLahir,
      tanggalLahir,
      email,
      username: username.startsWith('@') ? username : `@${username}`,
      role,
      statusAktif,
      wajibGantiPassword,
      avatar: ''
    };

    onAddAccount(newAccount);
    alert('Akun berhasil ditambahkan!');
    onNavigate('manage-accounts');
  };

  return (
    <div className="flex flex-col min-h-screen bg-kms-gray-bg w-full pb-16">
      {/* 1. Header Banner */}
      <section 
        className="relative bg-cover bg-center py-12 px-6 md:px-12 text-white flex flex-col justify-between shadow-sm"
        style={{ backgroundImage: "linear-gradient(rgba(40, 64, 39, 0.8), rgba(40, 64, 39, 0.85)), url('/rice_terrace_hero.png')" }}
      >
        <div className="text-left select-none">
          <span 
            onClick={() => onNavigate('manage-accounts')}
            className="text-xs uppercase tracking-widest text-kms-green-light font-bold hover:underline cursor-pointer"
          >
            Manajemen Akun
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-1">
            Add Account
          </h1>
          <p className="text-sm text-gray-300 mt-2 font-normal">
            Eco Journey Knowledge Management System
          </p>
        </div>
      </section>

      {/* 2. Form Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full text-left">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Detail Identitas */}
          <div className="lg:col-span-7 bg-white rounded-[5px] border border-gray-200/50 shadow-sm p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Detail Identitas
              </h2>
              <p className="text-xs text-gray-500 mt-1 font-normal">
                Masukan detail informasi identitas pengguna baru
              </p>
              <hr className="border-gray-200 mt-4" />
            </div>

            {/* Inputs Grid */}
            <div className="space-y-4">
              {/* Nama Depan & Belakang */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Nama Depan <span className="text-kms-red">*</span></label>
                  <input
                    type="text"
                    value={namaDepan}
                    onChange={(e) => setNamaDepan(e.target.value)}
                    placeholder="Budiono"
                    className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Nama Belakang</label>
                  <input
                    type="text"
                    value={namaBelakang}
                    onChange={(e) => setNamaBelakang(e.target.value)}
                    placeholder="Siregar"
                    className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                  />
                </div>
              </div>

              {/* Nama yang Ditampilkan */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Nama yang Ditampilkan</label>
                <input
                  type="text"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Budiono Siregar"
                  className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm bg-gray-50 outline-none focus:border-kms-blue-accent font-normal text-gray-800"
                />
              </div>

              {/* Tempat Lahir & Tanggal Lahir */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Tempat Lahir</label>
                  <input
                    type="text"
                    value={tempatLahir}
                    onChange={(e) => setTempatLahir(e.target.value)}
                    placeholder="Jakarta"
                    className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Tanggal Lahir</label>
                  <input
                    type="text"
                    value={tanggalLahir}
                    onChange={(e) => setTanggalLahir(e.target.value)}
                    placeholder="17 Agustus 1945"
                    className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                  />
                </div>
              </div>

              {/* Alamat Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Alamat Email <span className="text-kms-red">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budionosiregar@gmail.com"
                  className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2.5 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                  required
                />
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Username <span className="text-kms-red">*</span></label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    const val = e.target.value;
                    setUsername(val.startsWith('@') ? val : `@${val}`);
                  }}
                  placeholder="@budionosiregar"
                  className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                  required
                />
              </div>
            </div>

            {/* Action Buttons inside Card */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => onNavigate('manage-accounts')}
                className="px-5 py-2.5 text-xs font-bold border border-gray-300 rounded-[5px] hover:bg-gray-100 transition cursor-pointer text-gray-700 bg-white"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-kms-green-dark hover:bg-emerald-950 active:scale-95 text-white text-xs font-bold px-6 py-2.5 rounded-[5px] transition-all duration-200 cursor-pointer"
              >
                Save Account
              </button>
            </div>
          </div>

          {/* Right Column: Avatar Preview & Account Status */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Card 1: User Avatar preview */}
            <div className="bg-white rounded-[5px] border border-gray-200/50 shadow-sm p-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-[#E5D7FA] flex items-center justify-center border-4 border-[#C084FC]/30 shadow-inner mb-4 relative">
                <User className="w-12 h-12 text-[#6B21A8]" />
              </div>
              
              <h3 className="text-lg font-extrabold text-gray-900 leading-tight">
                {namaLengkap || 'Budiono Siregar'}
              </h3>
              <span className="text-xs text-gray-500 block mt-1 font-semibold">
                {username || '@budionosiregar'}
              </span>

              {/* Photo Control buttons */}
              <div className="flex space-x-2 mt-5 w-full">
                <button 
                  type="button"
                  onClick={() => alert('Fitur unggah foto belum diaktifkan dalam prototype ini.')}
                  className="flex-1 py-2 text-xs font-semibold text-gray-800 bg-[#EFEFEF] hover:bg-gray-200 border border-gray-300 rounded-[5px] transition cursor-pointer"
                >
                  Unggah Foto
                </button>
                <button 
                  type="button"
                  onClick={() => alert('Foto dihapus.')}
                  className="flex-1 py-2 text-xs font-semibold text-gray-800 bg-[#EFEFEF] hover:bg-gray-200 border border-gray-300 rounded-[5px] transition cursor-pointer"
                >
                  Hapus Foto
                </button>
              </div>
            </div>

            {/* Card 2: Status Akun */}
            <div className="bg-white rounded-[5px] border border-gray-200/50 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  Status Akun
                </h3>
                <hr className="border-gray-200 mt-3" />
              </div>

              {/* Edit Role Button selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="w-full flex items-center justify-between border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm bg-white hover:bg-gray-50 transition cursor-pointer font-bold text-gray-700"
                >
                  <span>Role: {role}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown popup */}
                {showRoleDropdown && (
                  <div className="absolute right-0 left-0 mt-1 bg-white border border-gray-200 rounded-[5px] shadow-lg z-10 overflow-hidden">
                    {['Masyarakat Adat', 'Pakar', 'Penyuluh', 'Fasilitator'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setRole(r);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 transition cursor-pointer font-semibold ${
                          role === r ? 'bg-kms-green-light/40 text-kms-green-dark' : 'text-gray-700'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="space-y-4">
                {/* Toggle 1: Akun Aktif */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-800">Akun Aktif</span>
                  <button
                    type="button"
                    onClick={() => setStatusAktif(!statusAktif)}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 outline-none border-none ${
                      statusAktif ? 'bg-kms-green-status' : 'bg-gray-300'
                    }`}
                  >
                    <div 
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-200 ${
                        statusAktif ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 2: Wajib Ganti Password */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-800">Wajib Ganti Password</span>
                  <button
                    type="button"
                    onClick={() => setWajibGantiPassword(!wajibGantiPassword)}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 outline-none border-none ${
                      wajibGantiPassword ? 'bg-kms-green-status' : 'bg-gray-300'
                    }`}
                  >
                    <div 
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-200 ${
                        wajibGantiPassword ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Ask To Do Something Textarea section */}
              <div className="space-y-2 pt-2 border-t border-gray-100 text-left">
                <label className="text-xs font-bold text-gray-800 block">Ask To Do Something</label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={askText}
                    onChange={(e) => setAskText(e.target.value)}
                    placeholder="Tulis instruksi atau pesan untuk user..."
                    className="w-full border border-gray-300 rounded-[5px] p-2.5 text-xs outline-none focus:border-kms-blue-accent font-normal resize-none pb-10 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!askText) return;
                      alert(`Pesan terkirim ke ${namaLengkap || 'user'}: "${askText}"`);
                      setAskText('');
                    }}
                    className="absolute right-2 bottom-2 bg-kms-green-status hover:bg-emerald-500 active:scale-95 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-[5px] shadow-sm transition-all duration-200 cursor-pointer flex items-center border-none"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Send
                  </button>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
