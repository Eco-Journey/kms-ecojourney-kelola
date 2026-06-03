import React from 'react';
import { Bell, Mail, Search, User } from 'lucide-react';

export default function Header({ currentPage, user, onNavigate }) {
  const isLoggedIn = currentPage === 'dashboard' || currentPage === 'profile';

  return (
    <header className="bg-kms-green-dark w-full text-white px-4 md:px-8 py-4 flex items-center justify-between shadow-md select-none">
      {/* Left Branding */}
      <div 
        onClick={() => onNavigate('landing')} 
        className="flex items-center space-x-2 cursor-pointer group"
      >
        <span className="text-2xl md:text-3xl font-extrabold tracking-wider font-sans transition-all duration-200 group-hover:scale-105">
          KMS
        </span>
      </div>

      {/* Middle Search Bar (only for Dashboard / Logged In pages) */}
      {isLoggedIn && (
        <div className="hidden md:flex items-center bg-[#1E301D] border border-kms-green-light/20 rounded-md px-3 py-1.5 w-64 lg:w-96 focus-within:border-kms-green-light/50 transition-all duration-200">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-400 w-full"
          />
        </div>
      )}

      {/* Right Side Icons & Avatar */}
      {isLoggedIn ? (
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Icons */}
          <button className="relative p-1.5 rounded-full hover:bg-white/10 transition-all duration-200 cursor-pointer">
            <Bell className="w-5 h-5 text-gray-200" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-kms-green-status rounded-full"></span>
          </button>
          <button className="relative p-1.5 rounded-full hover:bg-white/10 transition-all duration-200 cursor-pointer">
            <Mail className="w-5 h-5 text-gray-200" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-kms-red rounded-full"></span>
          </button>

          {/* User Profile Trigger */}
          <div 
            onClick={() => onNavigate('profile')} 
            className="flex items-center space-x-3 cursor-pointer group hover:opacity-90 transition-all duration-200"
          >
            {/* Purple Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#E5D7FA] flex items-center justify-center border-2 border-[#C084FC]/30 group-hover:border-[#C084FC]/60 transition-all">
              <User className="w-5 h-5 text-[#6B21A8]" />
            </div>
            
            {/* Name and Role */}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold leading-tight">
                {user?.role || 'Administrator'}
              </span>
              <span className="text-sm font-bold leading-tight group-hover:text-kms-green-light transition-all">
                {user?.name || 'Budi'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Guest Navigation: Easy entry to Landing / Login */
        <div className="flex items-center space-x-4">
          {currentPage !== 'login' && currentPage !== 'signup' && (
            <button 
              onClick={() => onNavigate('login')}
              className="text-sm font-semibold hover:text-kms-green-light transition-all duration-200 cursor-pointer"
            >
              Log in
            </button>
          )}
        </div>
      )}
    </header>
  );
}
