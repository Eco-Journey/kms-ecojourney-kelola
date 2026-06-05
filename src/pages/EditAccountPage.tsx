import React, { useState, useEffect } from 'react';
import { User, ChevronDown, Send } from 'lucide-react';
import { Account } from '../App';

interface EditAccountPageProps {
  account: Account | null;
  onNavigate: (page: string) => void;
  onUpdateAccount: (updatedAccount: Account) => void;
}

export default function EditAccountPage({ account, onNavigate, onUpdateAccount }: EditAccountPageProps): React.ReactElement {
  // If no account is active, fallback to a mock Budiono Siregar account as shown in mockup
  const currentAccount: Account = account || {
    id: 'MA002',
    namaDepan: 'Budiono',
    namaBelakang: 'Siregar',
    namaLengkap: 'Budiono Siregar',
    tempatLahir: 'Jakarta',
    tanggalLahir: '17 Agustus 1945',
    email: 'budionosiregar gmail com',
    username: '@budionosiregar',
    role: 'Masyarakat Adat',
    statusAktif: true,
    wajibGantiPassword: true,
    avatar: ''
  };

  const [isEditingDetails, setIsEditingDetails] = useState<boolean>(false);

  // Form fields states
  const [namaDepan, setNamaDepan] = useState<string>(currentAccount.namaDepan);
  const [namaBelakang, setNamaBelakang] = useState<string>(currentAccount.namaBelakang);
  const [namaLengkap, setNamaLengkap] = useState<string>(currentAccount.namaLengkap);
  const [tempatLahir, setTempatLahir] = useState<string>(currentAccount.tempatLahir);
  const [tanggalLahir, setTanggalLahir] = useState<string>(currentAccount.tanggalLahir);
  const [email, setEmail] = useState<string>(currentAccount.email);
  const [username, setUsername] = useState<string>(currentAccount.username);

  // Status and Role states
  const [role, setRole] = useState<string>(currentAccount.role);
  const [statusAktif, setStatusAktif] = useState<boolean>(currentAccount.statusAktif);
  const [wajibGantiPassword, setWajibGantiPassword] = useState<boolean>(currentAccount.wajibGantiPassword);
  const [askText, setAskText] = useState<string>('');

  // Dropdown states
  const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);

  // Update form fields when active account changes
  useEffect(() => {
    setNamaDepan(currentAccount.namaDepan);
    setNamaBelakang(currentAccount.namaBelakang);
    setNamaLengkap(currentAccount.namaLengkap);
    setTempatLahir(currentAccount.tempatLahir);
    setTanggalLahir(currentAccount.tanggalLahir);
    setEmail(currentAccount.email);
    setUsername(currentAccount.username);
    setRole(currentAccount.role);
    setStatusAktif(currentAccount.statusAktif);
    setWajibGantiPassword(currentAccount.wajibGantiPassword);
  }, [currentAccount]);

  const handleSaveChanges = (): void => {
    const updatedAccount: Account = {
      ...currentAccount,
      namaDepan,
      namaBelakang,
      namaLengkap: namaLengkap || `${namaDepan} ${namaBelakang}`,
      tempatLahir,
      tanggalLahir,
      email,
      username: username.startsWith('@') ? username : `@${username}`,
      role,
      statusAktif,
      wajibGantiPassword
    };

    onUpdateAccount(updatedAccount);
    setIsEditingDetails(false);
  };

  const handleStatusToggle = (): void => {
    const newStatus = !statusAktif;
    setStatusAktif(newStatus);
    // Persist status change immediately
    onUpdateAccount({
      ...currentAccount,
      statusAktif: newStatus
    });
  };

  const handleWajibGantiPasswordToggle = (): void => {
    const newWajib = !wajibGantiPassword;
    setWajibGantiPassword(newWajib);
    // Persist immediately
    onUpdateAccount({
      ...currentAccount,
      wajibGantiPassword: newWajib
    });
  };

  const handleRoleChange = (newRole: string): void => {
    setRole(newRole);
    setShowRoleDropdown(false);
    // Persist immediately
    onUpdateAccount({
      ...currentAccount,
      role: newRole
    });
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
            Add and Edit Role
          </h1>
          <p className="text-sm text-gray-300 mt-2 font-normal">
            Eco Journey Knowledge Management System
          </p>
        </div>
      </section>

      {/* 2. Content Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
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

            {/* Editable or Static view */}
            {isEditingDetails ? (
              <div className="space-y-4">
                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">Nama Depan</label>
                    <input
                      type="text"
                      value={namaDepan}
                      onChange={(e) => setNamaDepan(e.target.value)}
                      className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">Nama Belakang</label>
                    <input
                      type="text"
                      value={namaBelakang}
                      onChange={(e) => setNamaBelakang(e.target.value)}
                      className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Nama yang Ditampilkan</label>
                  <input
                    type="text"
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">Tempat Lahir</label>
                    <input
                      type="text"
                      value={tempatLahir}
                      onChange={(e) => setTempatLahir(e.target.value)}
                      className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">Tanggal Lahir</label>
                    <input
                      type="text"
                      value={tanggalLahir}
                      onChange={(e) => setTanggalLahir(e.target.value)}
                      className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Alamat Email</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                  />
                </div>

                {/* Edit Controls */}
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditingDetails(false)}
                    className="px-4 py-2 text-xs font-bold border border-gray-300 rounded-[5px] hover:bg-gray-100 transition cursor-pointer text-gray-700 bg-white"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveChanges}
                    className="bg-kms-green-dark hover:bg-emerald-950 text-white text-xs font-bold px-4 py-2 rounded-[5px] cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-gray-750">
                {/* 2-Column Property Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  {/* Nama Depan */}
                  <div>
                    <span className="text-xs font-bold text-gray-900 uppercase block tracking-wider mb-1">
                      Nama Depan
                    </span>
                    <span className="text-sm font-normal text-gray-700 block bg-gray-50/50 border border-transparent rounded py-1 px-2">
                      {namaDepan || '-'}
                    </span>
                  </div>

                  {/* Nama Belakang */}
                  <div>
                    <span className="text-xs font-bold text-gray-900 uppercase block tracking-wider mb-1">
                      Nama Belakang
                    </span>
                    <span className="text-sm font-normal text-gray-700 block bg-gray-50/50 border border-transparent rounded py-1 px-2">
                      {namaBelakang || '-'}
                    </span>
                  </div>
                </div>

                {/* Nama yang Ditampilkan */}
                <div>
                  <span className="text-xs font-bold text-gray-900 uppercase block tracking-wider mb-1">
                    Nama yang Ditampilkan
                  </span>
                  <span className="text-sm font-normal text-gray-700 block bg-gray-50/50 border border-transparent rounded py-1 px-2">
                    {namaLengkap || '-'}
                  </span>
                </div>

                {/* Tempat & Tanggal Lahir */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <span className="text-xs font-bold text-gray-900 uppercase block tracking-wider mb-1">
                      Tempat Lahir
                    </span>
                    <span className="text-sm font-normal text-gray-700 block bg-gray-50/50 border border-transparent rounded py-1 px-2">
                      {tempatLahir || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 uppercase block tracking-wider mb-1">
                      Tanggal Lahir
                    </span>
                    <span className="text-sm font-normal text-gray-700 block bg-gray-50/50 border border-transparent rounded py-1 px-2">
                      {tanggalLahir || '-'}
                    </span>
                  </div>
                </div>

                {/* Alamat Email */}
                <div>
                  <span className="text-xs font-bold text-gray-900 uppercase block tracking-wider mb-1">
                    Alamat Email
                  </span>
                  <span className="text-sm font-normal text-gray-700 block bg-gray-50/50 border border-transparent rounded py-1 px-2">
                    {email || '-'}
                  </span>
                </div>

                {/* Username */}
                <div>
                  <span className="text-xs font-bold text-gray-900 uppercase block tracking-wider mb-1">
                    Username
                  </span>
                  <span className="text-sm font-normal text-gray-700 block bg-gray-50/50 border border-transparent rounded py-1 px-2">
                    {username || '-'}
                  </span>
                </div>

                {/* Edit Button in read-only view */}
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditingDetails(true)}
                    className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-[5px] bg-[#EFEFEF] hover:bg-gray-200 transition text-xs font-bold text-gray-800 cursor-pointer shadow-xs border-none"
                  >
                    <span>Edit Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Avatar Picture & Account Status */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Card 1: Avatar photo/details */}
            <div className="bg-white rounded-[5px] border border-gray-200/50 shadow-sm p-6 flex flex-col items-center">
              {/* Photo Box Container */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#C084FC]/30 shadow-inner mb-4 relative flex items-center justify-center bg-[#E5D7FA]">
                {currentAccount.id === 'MA002' || namaDepan === 'Budiono' ? (
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200" 
                    alt="Budiono Siregar Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <User className="w-12 h-12 text-[#6B21A8]" />
                )}
              </div>
              
              <h3 className="text-lg font-extrabold text-gray-900 leading-tight">
                {username || '@budionosiregar'}
              </h3>
              <span className="text-xs text-gray-500 block mt-1 font-semibold">
                {namaLengkap || 'Budiono Siregar'}
              </span>

              {/* Upload/delete controls */}
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

              {/* Edit Role dropdown selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="w-full flex items-center justify-between border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm bg-[#EFEFEF] hover:bg-gray-200 transition cursor-pointer font-bold text-gray-800"
                >
                  <span>Edit Role: {role}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown Options */}
                {showRoleDropdown && (
                  <div className="absolute right-0 left-0 mt-1 bg-white border border-gray-200 rounded-[5px] shadow-lg z-10 overflow-hidden">
                    {['Masyarakat Adat', 'Pakar', 'Penyuluh', 'Fasilitator'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRoleChange(r)}
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

              {/* Status Switches */}
              <div className="space-y-4">
                {/* Switch 1: Akun Aktif */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-800">Akun Aktif</span>
                  <button
                    type="button"
                    onClick={handleStatusToggle}
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

                {/* Switch 2: Wajib Ganti Password */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-800">Wajib Ganti Password</span>
                  <button
                    type="button"
                    onClick={handleWajibGantiPasswordToggle}
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

              {/* Ask To Do Something Message Box */}
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
        </div>
      </div>
    </div>
  );
}
