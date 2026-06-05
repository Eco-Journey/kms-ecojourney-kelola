import React, { useState } from 'react';
import { 
  Users, Search, Share2, Edit, Trash2, Plus, Clock, UserX, SlidersHorizontal, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { Account } from '../App';

interface ManageAccountsPageProps {
  accounts: Account[];
  onNavigate: (page: string) => void;
  onDeleteAccount: (id: string) => void;
  onToggleAccountStatus: (id: string) => void;
  setEditingAccountId: (id: string) => void;
}

export default function ManageAccountsPage({ 
  accounts, 
  onNavigate, 
  onDeleteAccount, 
  onToggleAccountStatus, 
  setEditingAccountId 
}: ManageAccountsPageProps): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Count accounts to compute dashboard stats dynamically
  const activeCount = 204 + accounts.filter(a => a.statusAktif).length;
  const inactiveCount = 13 + accounts.filter(a => !a.statusAktif).length;

  // Filter accounts based on search query
  const filteredAccounts = accounts.filter(acc => {
    return acc.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) || 
           acc.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
           acc.role.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleDelete = (id: string, name: string): void => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun ${name}?`)) {
      onDeleteAccount(id);
    }
  };

  const handleEdit = (id: string): void => {
    setEditingAccountId(id);
    onNavigate('edit-account');
  };

  return (
    <div className="flex flex-col min-h-screen bg-kms-gray-bg w-full pb-16">
      {/* 1. Header Banner & Statistics */}
      <section 
        className="relative bg-cover bg-center py-12 px-6 md:px-12 text-white flex flex-col justify-between shadow-sm"
        style={{ backgroundImage: "linear-gradient(rgba(40, 64, 39, 0.8), rgba(40, 64, 39, 0.85)), url('/rice_terrace_hero.png')" }}
      >
        <div className="text-left mb-8 max-w-2xl select-none">
          <span 
            onClick={() => onNavigate('dashboard')}
            className="text-xs uppercase tracking-widest text-kms-green-light font-bold hover:underline cursor-pointer"
          >
            Dashboard
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-1">
            Manajemen Akun
          </h1>
          <p className="text-sm text-gray-300 mt-2 font-normal">
            Eco Journey Knowledge Management System
          </p>
        </div>

        {/* Floating statistics cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {[
            { label: 'Akun Aktif', value: activeCount, icon: Users, bg: 'bg-[#D5E2C4] text-[#284027] border-[#D5E2C4]/20' },
            { label: 'Menunggu Verifikasi', value: '13+', icon: Clock, bg: 'bg-[#7A5535] text-white border-white/10' },
            { label: 'Dinonaktifkan', value: inactiveCount, icon: UserX, bg: 'bg-[#8B3A3A] text-white border-white/10' },
            { label: 'Login 24 Jam', value: '27', icon: Clock, bg: 'bg-[#E0F2FE] text-[#0369A1] border-[#E0F2FE]/20' }
          ].map((stat, idx) => (
            <div key={idx} className={`${stat.bg} backdrop-blur-md rounded-[5px] p-4 text-left border hover:scale-[1.02] transition-all duration-200 shadow-sm`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider block opacity-85">
                    {stat.label}
                  </span>
                  <span className="text-2xl md:text-3xl font-extrabold mt-1 block">
                    {stat.value}
                  </span>
                </div>
                <stat.icon className="w-5 h-5 opacity-80 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Accounts List Table */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6 w-full text-left">
        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            All Account
          </h2>
          <hr className="border-gray-300" />
        </div>

        <div className="bg-white rounded-[5px] shadow-sm border border-gray-200/50 p-6 space-y-4">
          {/* Table Controls toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            {/* Searching & Filter Option */}
            <div className="flex items-center space-x-2 w-full sm:w-auto flex-1 max-w-md">
              <button className="p-2 border border-gray-300 rounded-[5px] hover:bg-gray-50 transition cursor-pointer text-gray-500 bg-white">
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Searching..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-[5px] text-sm w-full outline-none focus:border-kms-blue-accent font-normal"
                />
              </div>
            </div>

            {/* Add Account Button */}
            <button
              onClick={() => onNavigate('add-account')}
              className="bg-kms-green-dark hover:bg-emerald-950 active:scale-95 text-white text-sm font-bold px-5 py-2 rounded-[5px] border border-white/10 transition-all duration-200 cursor-pointer flex items-center justify-center w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Account
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border border-gray-200 rounded-[5px]">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-[#284027] text-white font-extrabold">
                <tr>
                  <th className="px-6 py-3.5 text-left w-20">Nomor</th>
                  <th className="px-6 py-3.5 text-left w-36">ID User</th>
                  <th className="px-6 py-3.5 text-left">Nama User</th>
                  <th className="px-6 py-3.5 text-left">Role</th>
                  <th className="px-6 py-3.5 text-center w-36">Status</th>
                  <th className="px-6 py-3.5 text-center w-36">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white text-gray-700 font-normal">
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">{idx + 1}</td>
                      <td className="px-6 py-4 font-semibold text-gray-600">{item.id}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{item.namaLengkap}</td>
                      <td className="px-6 py-4 text-gray-600">{item.role}</td>
                      
                      {/* Toggle Switch for Status */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center">
                          <button 
                            onClick={() => onToggleAccountStatus(item.id)}
                            className={`w-11 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 outline-none border-none ${
                              item.statusAktif ? 'bg-kms-green-status' : 'bg-gray-300'
                            }`}
                            title={item.statusAktif ? "Deactivate Account" : "Activate Account"}
                          >
                            <div 
                              className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-200 ${
                                item.statusAktif ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </td>

                      {/* Action buttons (Share, Edit, Delete) */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <button 
                            onClick={() => alert(`Share link untuk user ${item.namaLengkap} telah disalin ke clipboard.`)}
                            className="text-gray-500 hover:text-kms-blue-edit cursor-pointer p-1 rounded hover:bg-gray-100 transition border-none bg-transparent"
                            title="Share User Profile"
                          >
                            <Share2 className="w-4.5 h-4.5" />
                          </button>
                          <button 
                            onClick={() => handleEdit(item.id)}
                            className="text-gray-500 hover:text-kms-blue-edit cursor-pointer p-1 rounded hover:bg-gray-100 transition border-none bg-transparent"
                            title="Edit User Profile"
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id, item.namaLengkap)}
                            className="text-gray-500 hover:text-kms-red cursor-pointer p-1 rounded hover:bg-gray-100 transition border-none bg-transparent"
                            title="Delete Account"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400 font-normal">
                      Tidak ada akun ditemukan.
                    </td>
                  </tr>
                )}
                
                {/* Mock empty rows to match UI Design layout */}
                {filteredAccounts.length < 8 && Array.from({ length: 8 - filteredAccounts.length }).map((_, i) => (
                  <tr key={`empty-${i}`} className="h-[53px]">
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination simulation */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
            <span className="text-xs text-gray-500 font-normal">
              Showing {filteredAccounts.length} of {accounts.length} entries
            </span>
            
            {/* Dots navigation indicators from layout */}
            <div className="flex justify-center items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-kms-green-dark cursor-pointer"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 hover:bg-gray-400 cursor-pointer"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 hover:bg-gray-400 cursor-pointer"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 hover:bg-gray-400 cursor-pointer"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 hover:bg-gray-400 cursor-pointer"></span>
            </div>

            <div className="flex items-center space-x-1">
              <button className="p-1.5 rounded border border-gray-300 hover:bg-gray-50 text-gray-500 cursor-pointer disabled:opacity-50 bg-white" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-3 py-1 text-xs font-bold rounded bg-kms-green-dark text-white">1</button>
              <button className="p-1.5 rounded border border-gray-300 hover:bg-gray-50 text-gray-500 cursor-pointer disabled:opacity-50 bg-white" disabled>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
