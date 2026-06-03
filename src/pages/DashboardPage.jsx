import React, { useState } from 'react';
import { 
  Users, Sprout, Database, FileText, Plus, Search, 
  ChevronLeft, ChevronRight, Share2, Edit, Trash2, Calendar as CalendarIcon, CheckCircle2, X 
} from 'lucide-react';

export default function DashboardPage({ user }) {
  // 1. Mock Data for Overall Data Table
  const [tableData, setTableData] = useState([
    { id: 1, nama: 'Uwi (Dioscorea alata)', tempat: 'Desa Sukamaju', kategori: 'Pangan Karbohidrat', status: 'Aktif' },
    { id: 2, nama: 'Padi Gogo Lokal', tempat: 'Desa Rancamanyar', kategori: 'Serealia', status: 'Aktif' },
    { id: 3, nama: 'Talas Banten', tempat: 'Desa Kadupandak', kategori: 'Pangan Karbohidrat', status: 'Aktif' },
    { id: 4, nama: 'Cengkeh Zanzibar', tempat: 'Desa Maluku Hulu', kategori: 'Rempah', status: 'Verifikasi' },
    { id: 5, nama: 'Pala Banda', tempat: 'Desa Banda Neira', kategori: 'Rempah', status: 'Aktif' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form fields for Add Data
  const [newNama, setNewNama] = useState('');
  const [newTempat, setNewTempat] = useState('');
  const [newKategori, setNewKategori] = useState('Pangan Karbohidrat');
  const [newStatus, setNewStatus] = useState('Aktif');

  // 2. Calendar Event state
  const [calendarEvents, setCalendarEvents] = useState({
    5: [{ label: 'Tanam Padi', type: 'tanam' }],
    10: [{ label: 'Pupuk Uwi', type: 'pupuk' }],
    14: [{ label: 'Tanam Talas', type: 'tanam' }, { label: 'Panen Cengkeh', type: 'panen' }],
    22: [{ label: 'Panen Pala', type: 'panen' }],
    28: [{ label: 'Tanam Uwi', type: 'tanam' }, { label: 'Audit Benih', type: 'audit' }],
  });

  const [selectedDayEvents, setSelectedDayEvents] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEventLabel, setNewEventLabel] = useState('');
  const [newEventType, setNewEventType] = useState('tanam');

  // Handle adding table data
  const handleAddData = (e) => {
    e.preventDefault();
    if (!newNama || !newTempat) return;

    const newItem = {
      id: tableData.length + 1,
      nama: newNama,
      tempat: newTempat,
      kategori: newKategori,
      status: newStatus
    };

    setTableData([...tableData, newItem]);
    
    // Clear inputs
    setNewNama('');
    setNewTempat('');
    setNewKategori('Pangan Karbohidrat');
    setNewStatus('Aktif');
    setIsModalOpen(false);
  };

  // Handle deleting table data
  const handleDeleteItem = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setTableData(tableData.filter(item => item.id !== id));
    }
  };

  // Handle adding calendar event
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventLabel || !selectedDay) return;

    const currentDayEvents = calendarEvents[selectedDay] || [];
    const updatedEvents = {
      ...calendarEvents,
      [selectedDay]: [...currentDayEvents, { label: newEventLabel, type: newEventType }]
    };

    setCalendarEvents(updatedEvents);
    setNewEventLabel('');
    setIsEventModalOpen(false);
    setSelectedDayEvents(updatedEvents[selectedDay]);
  };

  // Filtering Logic
  const filteredData = tableData.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.tempat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterKategori === 'Semua' || item.kategori === filterKategori;
    return matchesSearch && matchesFilter;
  });

  // Calendar setup for January 2025
  const daysInMonth = 31;
  const startOffset = 2; // Dec 30, Dec 31
  const prevMonthDays = [30, 31];
  const nextMonthDays = [1, 2];

  const calendarDays = [];
  // Previous month padding
  prevMonthDays.forEach(d => calendarDays.push({ day: d, isCurrentMonth: false }));
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, isCurrentMonth: true });
  }
  // Next month padding
  nextMonthDays.forEach(d => calendarDays.push({ day: d, isCurrentMonth: false }));

  return (
    <div className="flex flex-col min-h-screen bg-kms-gray-bg w-full pb-16">
      
      {/* 1. Welcome Banner & Statistics */}
      <section 
        className="relative bg-cover bg-center py-12 px-6 md:px-12 text-white flex flex-col justify-between shadow-sm"
        style={{ backgroundImage: "linear-gradient(rgba(40, 64, 39, 0.8), rgba(40, 64, 39, 0.85)), url('/rice_terrace_hero.png')" }}
      >
        <div className="text-left mb-8 max-w-2xl select-none">
          <span className="text-xs uppercase tracking-widest text-kms-green-light font-bold">
            Dashboard
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-1">
            Welcome, {user?.name || 'Budi'}!
          </h1>
          <p className="text-sm text-gray-300 mt-2 font-normal">
            To Eco Journey Knowledge Management System
          </p>
        </div>

        {/* Floating statistics cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {[
            { label: 'Total Varietas Benih', value: '1.125+', icon: Sprout, bg: 'bg-white/10' },
            { label: 'Total Desa Terdata', value: '450+', icon: Database, bg: 'bg-white/10' },
            { label: 'Total Pengetahuan', value: '925+', icon: FileText, bg: 'bg-white/10' },
            { label: 'Total Laporan Masuk', value: '27', icon: Users, bg: 'bg-white/10' }
          ].map((stat, idx) => (
            <div key={idx} className={`${stat.bg} backdrop-blur-md rounded-[5px] p-4 text-left border border-white/15 hover:border-white/30 hover:bg-white/15 transition-all duration-200 shadow-sm`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] text-kms-green-light font-bold uppercase tracking-wider block">
                    {stat.label}
                  </span>
                  <span className="text-2xl md:text-3xl font-extrabold mt-1 block">
                    {stat.value}
                  </span>
                </div>
                <stat.icon className="w-5 h-5 text-kms-green-light opacity-80" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10 w-full text-left">
        
        {/* 2. Public Statistic Section */}
        <section className="space-y-3">
          <h2 className="text-xl font-extrabold text-gray-900">
            Public Statistic
          </h2>
          <hr className="border-gray-300" />
          
          <div className="bg-white p-6 rounded-[5px] shadow-sm border border-gray-200/50 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* SVG Line Chart */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-extrabold text-gray-800">Public Visit (Trend)</span>
                <span className="text-xs text-kms-blue-edit font-semibold">Aktif</span>
              </div>
              <div className="w-full bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                <svg className="w-full h-48" viewBox="0 0 500 200">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#02E10E" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#02E10E" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#E5E7EB" strokeDasharray="4 4" />
                  <line x1="40" y1="70" x2="480" y2="70" stroke="#E5E7EB" strokeDasharray="4 4" />
                  <line x1="40" y1="120" x2="480" y2="120" stroke="#E5E7EB" strokeDasharray="4 4" />
                  <line x1="40" y1="170" x2="480" y2="170" stroke="#E5E7EB" />
                  
                  {/* Gradient Area under path */}
                  <path 
                    d="M 40 170 C 100 120, 150 140, 200 90 C 250 40, 300 30, 350 70 C 400 110, 440 130, 480 120 L 480 170 L 40 170 Z" 
                    fill="url(#chartGradient)" 
                  />
                  
                  {/* The Line curve */}
                  <path 
                    d="M 40 170 C 100 120, 150 140, 200 90 C 250 40, 300 30, 350 70 C 400 110, 440 130, 480 120" 
                    fill="none" 
                    stroke="#284027" 
                    strokeWidth="3.5" 
                  />
                  
                  {/* Highest peak point indicator */}
                  <circle cx="300" cy="38" r="6" fill="#02E10E" stroke="#fff" strokeWidth="2" />
                  <text x="300" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#284027">4.520 Vis</text>
                  
                  {/* Axes labels */}
                  <text x="40" y="185" textAnchor="middle" fontSize="10" fill="#9CA3AF">Min</text>
                  <text x="260" y="185" textAnchor="middle" fontSize="10" fill="#9CA3AF">Tengah</text>
                  <text x="480" y="185" textAnchor="middle" fontSize="10" fill="#9CA3AF">Max</text>
                </svg>
              </div>
            </div>

            {/* SVG Bar Chart */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-extrabold text-gray-800">Public Visit (Bulanan)</span>
                <span className="text-xs text-gray-500 font-semibold">Jan - Jun</span>
              </div>
              <div className="w-full bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                <svg className="w-full h-48" viewBox="0 0 500 200">
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#E5E7EB" strokeDasharray="4 4" />
                  <line x1="40" y1="70" x2="480" y2="70" stroke="#E5E7EB" strokeDasharray="4 4" />
                  <line x1="40" y1="120" x2="480" y2="120" stroke="#E5E7EB" strokeDasharray="4 4" />
                  <line x1="40" y1="170" x2="480" y2="170" stroke="#E5E7EB" />
                  
                  {/* Stacked Bars: Jan to Jun */}
                  {/* Jan: h-120 */}
                  <rect x="70" y="50" width="30" height="120" rx="3" fill="#02E10E" />
                  <rect x="70" y="110" width="30" height="60" fill="#284027" />
                  
                  {/* Feb: h-140 */}
                  <rect x="140" y="30" width="30" height="140" rx="3" fill="#02E10E" />
                  <rect x="140" y="90" width="30" height="80" fill="#D5E2C4" />
                  <rect x="140" y="130" width="30" height="40" fill="#7A5535" />
                  
                  {/* Mar: h-90 */}
                  <rect x="210" y="80" width="30" height="90" rx="3" fill="#02E10E" />
                  <rect x="210" y="120" width="30" height="50" fill="#284027" />
                  
                  {/* Apr: h-110 */}
                  <rect x="280" y="60" width="30" height="110" rx="3" fill="#02E10E" />
                  <rect x="280" y="100" width="30" height="70" fill="#D5E2C4" />
                  
                  {/* Mei: h-70 */}
                  <rect x="350" y="100" width="30" height="70" rx="3" fill="#02E10E" />
                  <rect x="350" y="130" width="30" height="40" fill="#7A5535" />
                  
                  {/* Jun: h-100 */}
                  <rect x="420" y="70" width="30" height="100" rx="3" fill="#02E10E" />
                  <rect x="420" y="110" width="30" height="60" fill="#284027" />

                  {/* Labels */}
                  <text x="85" y="185" textAnchor="middle" fontSize="10" fill="#4B5563" fontWeight="bold">Jan</text>
                  <text x="155" y="185" textAnchor="middle" fontSize="10" fill="#4B5563" fontWeight="bold">Feb</text>
                  <text x="225" y="185" textAnchor="middle" fontSize="10" fill="#4B5563" fontWeight="bold">Mar</text>
                  <text x="295" y="185" textAnchor="middle" fontSize="10" fill="#4B5563" fontWeight="bold">Apr</text>
                  <text x="365" y="185" textAnchor="middle" fontSize="10" fill="#4B5563" fontWeight="bold">Mei</text>
                  <text x="435" y="185" textAnchor="middle" fontSize="10" fill="#4B5563" fontWeight="bold">Jun</text>
                </svg>
              </div>
            </div>
            
          </div>
        </section>

        {/* 3. Manajemen Akun Section */}
        <section className="space-y-3">
          <h2 className="text-xl font-extrabold text-gray-900">
            Manajemen Akun
          </h2>
          <hr className="border-gray-300" />
          
          <div 
            className="rounded-[5px] p-6 md:p-8 flex flex-col items-center justify-between text-white bg-cover bg-center space-y-6"
            style={{ backgroundImage: "linear-gradient(rgba(122, 85, 53, 0.75), rgba(122, 85, 53, 0.8)), url('/rice_terrace_hero.png')" }}
          >
            {/* Cards layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {[
                { count: '700+', label: 'Masyarakat Adat', desc: 'Pemilik pengetahuan tradisional lisan' },
                { count: '150+', label: 'Validator', desc: 'Akademisi & pakar keanekaragaman' },
                { count: '150+', label: 'Fasilitator', desc: 'Penyuluh & pendamping lapangan' }
              ].map((role, idx) => (
                <div key={idx} className="bg-kms-brown rounded-[5px] p-6 text-center border border-white/20 shadow-sm flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-kms-green-light" />
                  </div>
                  <span className="text-2xl md:text-3xl font-extrabold block">{role.count}</span>
                  <span className="text-sm font-extrabold text-kms-green-light mt-1 block">{role.label}</span>
                  <span className="text-xs text-gray-200 mt-2 block font-normal leading-relaxed">{role.desc}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => alert('Mengalihkan ke panel kelola akun...')}
              className="bg-kms-green-dark hover:bg-emerald-950 active:scale-95 text-white text-sm font-extrabold px-8 py-3 rounded-[5px] border border-white/10 transition-all duration-200 cursor-pointer"
            >
              Kelola Akun
            </button>
          </div>
        </section>

        {/* 4. Overall Data Section */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-gray-900">
              Overall Data
            </h2>
          </div>
          <hr className="border-gray-300" />

          <div className="bg-white rounded-[5px] shadow-sm border border-gray-200/50 p-6 space-y-4">
            
            {/* Toolbar controls */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto flex-1 max-w-xl">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari benih atau desa..."
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-[5px] text-sm w-full outline-none focus:border-kms-blue-accent"
                  />
                </div>
                {/* Filter Dropdown */}
                <select
                  value={filterKategori}
                  onChange={(e) => setFilterKategori(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-[5px] text-sm bg-white outline-none cursor-pointer focus:border-kms-blue-accent"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="Pangan Karbohidrat">Pangan Karbohidrat</option>
                  <option value="Serealia">Serealia</option>
                  <option value="Rempah">Rempah</option>
                </select>
              </div>

              {/* Add Data Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-kms-green-dark hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-[5px] transition-all flex items-center cursor-pointer w-full md:w-auto justify-center"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Data
              </button>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto border border-gray-200 rounded-[5px]">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-[#284027]/5 text-gray-700 font-extrabold">
                  <tr>
                    <th className="px-4 py-3 text-left w-12">No</th>
                    <th className="px-4 py-3 text-left">Nama</th>
                    <th className="px-4 py-3 text-left">Tempat</th>
                    <th className="px-4 py-3 text-left">Kategori</th>
                    <th className="px-4 py-3 text-center w-24">Status</th>
                    <th className="px-4 py-3 text-center w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-gray-700 font-normal">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3.5 font-semibold">{idx + 1}</td>
                        <td className="px-4 py-3.5 font-semibold text-gray-900">{item.nama}</td>
                        <td className="px-4 py-3.5 text-gray-600">{item.tempat}</td>
                        <td className="px-4 py-3.5">
                          <span className="bg-kms-green-light/40 text-kms-green-dark text-xs px-2.5 py-1 rounded-[5px] font-bold">
                            {item.kategori}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-flex items-center text-xs font-extrabold px-2 py-0.5 rounded-full ${
                            item.status === 'Aktif' 
                              ? 'bg-green-100 text-kms-green-status' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              item.status === 'Aktif' ? 'bg-kms-green-status' : 'bg-yellow-500'
                            }`}></span>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center space-x-2.5">
                            <button className="text-gray-500 hover:text-kms-blue-edit cursor-pointer p-1 rounded hover:bg-gray-100 transition">
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button className="text-gray-500 hover:text-kms-blue-edit cursor-pointer p-1 rounded hover:bg-gray-100 transition">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-gray-500 hover:text-kms-red cursor-pointer p-1 rounded hover:bg-gray-100 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-400 font-normal">
                        Tidak ada data ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination simulator */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-500 font-normal">Showing {filteredData.length} of {tableData.length} entries</span>
              <div className="flex items-center space-x-1">
                <button className="p-1 rounded border border-gray-300 hover:bg-gray-100 text-gray-500 cursor-pointer disabled:opacity-50" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-2.5 py-1 text-xs font-bold rounded bg-kms-green-dark text-white">1</button>
                <button className="p-1 rounded border border-gray-300 hover:bg-gray-100 text-gray-500 cursor-pointer disabled:opacity-50" disabled>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* 5. Kalender Tanam Section */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-gray-900">
              Kalender Tanam
            </h2>
          </div>
          <hr className="border-gray-300" />

          <div className="bg-white rounded-[5px] shadow-sm border border-gray-200/50 p-6 space-y-4">
            
            {/* Calendar Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center space-x-3 select-none">
                <button className="p-1 rounded hover:bg-gray-100 border border-gray-300 text-gray-600 cursor-pointer">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-base font-extrabold text-gray-800">January 2025</span>
                <button className="p-1 rounded hover:bg-gray-100 border border-gray-300 text-gray-600 cursor-pointer">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <button 
                onClick={() => {
                  setSelectedDay(1);
                  setIsEventModalOpen(true);
                }}
                className="bg-kms-green-dark hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-[5px] transition flex items-center cursor-pointer w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Event
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="border border-gray-200 rounded-[5px] overflow-hidden">
              {/* Day names */}
              <div className="grid grid-cols-7 bg-[#284027]/5 text-center py-2 text-xs font-extrabold text-gray-700 border-b border-gray-200">
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
                <span>SUN</span>
              </div>
              
              {/* Calendar cells */}
              <div className="grid grid-cols-7 bg-white text-gray-700">
                {calendarDays.map((cell, idx) => {
                  const dayEvents = cell.isCurrentMonth ? calendarEvents[cell.day] : null;
                  
                  return (
                    <div 
                      key={idx}
                      onClick={() => {
                        if (cell.isCurrentMonth) {
                          setSelectedDay(cell.day);
                          setSelectedDayEvents(dayEvents || []);
                        }
                      }}
                      className={`min-h-24 md:min-h-28 p-1.5 border-r border-b border-gray-200 flex flex-col text-left transition-colors cursor-pointer ${
                        cell.isCurrentMonth 
                          ? 'hover:bg-gray-50/80 bg-white' 
                          : 'bg-gray-50 text-gray-400'
                      } ${selectedDay === cell.day && cell.isCurrentMonth ? 'bg-kms-green-light/20 ring-1 ring-kms-green-dark/20' : ''}`}
                    >
                      <span className={`text-xs md:text-sm font-bold block mb-1 ${
                        cell.isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
                      }`}>
                        {cell.day}
                      </span>
                      
                      {/* Events display */}
                      <div className="space-y-1 overflow-y-auto max-h-[70px] pr-0.5">
                        {dayEvents && dayEvents.map((evt, eIdx) => {
                          let colorClass = 'bg-blue-50 text-blue-600 border-blue-200';
                          if (evt.type === 'panen') colorClass = 'bg-orange-50 text-orange-600 border-orange-200';
                          if (evt.type === 'audit') colorClass = 'bg-purple-50 text-purple-600 border-purple-200';
                          if (evt.type === 'pupuk') colorClass = 'bg-yellow-50 text-yellow-600 border-yellow-200';

                          return (
                            <span 
                              key={eIdx}
                              title={evt.label}
                              className={`block text-[9px] font-extrabold px-1 py-0.5 rounded border leading-tight truncate ${colorClass}`}
                            >
                              {evt.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Event list view beneath calendar if day selected */}
            {selectedDay && (
              <div className="bg-[#284027]/5 rounded-[5px] p-4 text-sm space-y-2 border border-kms-green-light/20">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-gray-800">
                    Agenda: {selectedDay} Januari 2025
                  </span>
                  <button 
                    onClick={() => setIsEventModalOpen(true)}
                    className="text-xs text-kms-green-dark hover:underline font-bold cursor-pointer"
                  >
                    + Tambah Agenda
                  </button>
                </div>
                {selectedDayEvents && selectedDayEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {selectedDayEvents.map((evt, idx) => (
                      <div key={idx} className="bg-white border border-gray-200 rounded p-2.5 flex items-center space-x-2 shadow-xs">
                        <CalendarIcon className="w-4 h-4 text-kms-green-dark" />
                        <div>
                          <p className="font-semibold text-gray-800 text-xs">{evt.label}</p>
                          <p className="text-[10px] text-gray-400 capitalize">{evt.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 font-normal py-2">Tidak ada agenda kegiatan untuk tanggal ini.</p>
                )}
              </div>
            )}

          </div>
        </section>

        {/* 6. Laporan Terbaru Section */}
        <section className="space-y-3">
          <h2 className="text-xl font-extrabold text-gray-900">
            Laporan Terbaru
          </h2>
          <hr className="border-gray-300" />

          <div className="bg-white rounded-[5px] shadow-sm border border-gray-200/50 p-6 space-y-4">
            
            {/* List */}
            <div className="space-y-4">
              {[
                { 
                  title: 'Benih Padi 12 ditambahkan', 
                  desc: 'Masyarakat adat Kasepuhan Ciptagelar memasukkan varietas benih lokal padi 12 ke database.', 
                  date: '15 Februari 2026' 
                },
                { 
                  title: 'Desa Sukamaju ditambahkan', 
                  desc: 'Fasilitator lapangan menyelesaikan dokumen pendaftaran data sebaran dan status konservasi Desa Sukamaju.', 
                  date: '9 Februari 2026' 
                }
              ].map((log, idx) => (
                <div key={idx} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200/40">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-kms-green-status" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <h4 className="text-sm font-extrabold text-gray-900">{log.title}</h4>
                      <span className="text-xs text-gray-400 font-normal">{log.date}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 font-normal leading-relaxed truncate-2-lines">
                      {log.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination dots indicator */}
            <div className="flex justify-center items-center space-x-1.5 pt-2">
              <span className="w-2 h-2 rounded-full bg-kms-green-dark"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            </div>

          </div>
        </section>

      </div>

      {/* ================= MODAL ADD DATA ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[5px] shadow-xl border border-gray-200 w-full max-w-md overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="bg-kms-green-dark text-white px-5 py-4 flex justify-between items-center">
              <h3 className="text-base font-extrabold">Add New Seed Data</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-kms-green-light cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddData} className="p-5 space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Nama Varietas</label>
                <input
                  type="text"
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  placeholder="Contoh: Talas Ketan, Cengkeh Raja"
                  className="w-full border border-gray-300 rounded-[5px] px-3 py-2 text-sm outline-none focus:border-kms-blue-accent"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Lokasi / Desa asal</label>
                <input
                  type="text"
                  value={newTempat}
                  onChange={(e) => setNewTempat(e.target.value)}
                  placeholder="Contoh: Desa Sukamulya"
                  className="w-full border border-gray-300 rounded-[5px] px-3 py-2 text-sm outline-none focus:border-kms-blue-accent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">Kategori</label>
                  <select
                    value={newKategori}
                    onChange={(e) => setNewKategori(e.target.value)}
                    className="w-full border border-gray-300 rounded-[5px] px-2.5 py-2 text-sm outline-none cursor-pointer"
                  >
                    <option value="Pangan Karbohidrat">Karbohidrat</option>
                    <option value="Serealia">Serealia</option>
                    <option value="Rempah">Rempah</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-[5px] px-2.5 py-2 text-sm outline-none cursor-pointer"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Verifikasi">Verifikasi</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold border border-gray-300 rounded-[5px] hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-kms-green-dark hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-[5px] cursor-pointer"
                >
                  Save Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL ADD CALENDAR EVENT ================= */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[5px] shadow-xl border border-gray-200 w-full max-w-sm overflow-hidden animate-scale-up">
            <div className="bg-kms-green-dark text-white px-4 py-3.5 flex justify-between items-center">
              <h3 className="text-sm font-extrabold">Tambah Agenda Tanggal {selectedDay}</h3>
              <button 
                onClick={() => setIsEventModalOpen(false)}
                className="text-white hover:text-kms-green-light cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="p-4 space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Nama Agenda</label>
                <input
                  type="text"
                  value={newEventLabel}
                  onChange={(e) => setNewEventLabel(e.target.value)}
                  placeholder="Contoh: Panen Padi Cigeulis"
                  className="w-full border border-gray-300 rounded-[5px] px-3 py-2 text-xs outline-none focus:border-kms-blue-accent"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Jenis Kegiatan</label>
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value)}
                  className="w-full border border-gray-300 rounded-[5px] px-2 py-2 text-xs outline-none cursor-pointer"
                >
                  <option value="tanam">Tanam (Biru)</option>
                  <option value="panen">Panen (Jingga)</option>
                  <option value="pupuk">Pemupukan (Kuning)</option>
                  <option value="audit">Audit/Verifikasi (Ungu)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2.5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-bold border border-gray-300 rounded-[5px] hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-kms-green-dark hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-[5px] cursor-pointer"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
