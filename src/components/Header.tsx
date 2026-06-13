import React, { useState, useEffect, useRef } from "react";
import { Menu, X, User as UserIcon, ChevronDown, Search, Bell, Mail } from "lucide-react";
import { User } from "../App";

interface HeaderProps {
  currentPage: string;
  user: User | null;
  onNavigate: (page: string) => void;
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
}

export default function Header({
  currentPage,
  user,
  onNavigate,
  unreadNotificationsCount = 0,
  unreadMessagesCount = 0,
}: HeaderProps): React.ReactElement {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAddDataOpen, setIsAddDataOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (page: string) => currentPage === page;
  const isLoggedIn = user !== null;
  const userRole = user?.role?.toLowerCase() || "";
  const canAddData = ["administrator", "masyarakat_adat", "masyarakat adat", "fasilitator", "penyuluh"].includes(userRole);
  const canValidate = ["administrator", "pakar", "validator"].includes(userRole);
  const isAdmin = userRole === "administrator";

  const handleNav = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    setIsAddDataOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsAddDataOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-kms-green-dark text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Branding */}
          <div
            className="flex items-center cursor-pointer select-none group mr-4"
            onClick={() => handleNav(isLoggedIn ? "dashboard" : "landing")}
          >
            <span className="text-xl md:text-2xl font-extrabold tracking-tight font-sans transition-all duration-200 group-hover:scale-102">
              Eco-Journey
            </span>
            <span className="ml-1.5 text-[9px] uppercase font-bold tracking-widest bg-kms-green-light/20 text-kms-green-light px-1.5 py-0.5 rounded border border-kms-green-light/30 select-none align-middle self-center">
              kelola
            </span>
          </div>

          {/* Quick Search (visible only on desktop lg) */}
          {isLoggedIn && (
            <div className="hidden lg:flex items-center bg-[#1E301D] border border-kms-green-light/20 rounded-[5px] px-3 py-1.5 w-64 focus-within:border-kms-green-light/50 transition-all duration-200 ml-2 mr-auto">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Pencarian cepat..."
                className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-400 w-full"
              />
            </div>
          )}

          {/* Nav Links & Actions */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-2 md:space-x-4">
              <nav className="hidden md:flex items-center space-x-0.5 lg:space-x-1">
                <button
                  onClick={() => handleNav("dashboard")}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-[5px] transition-colors cursor-pointer border-none ${
                    isActive("dashboard")
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Dashboard
                </button>

                {canAddData && (
                  <div ref={dropdownRef} className="relative group">
                    <button
                      onClick={() => setIsAddDataOpen(!isAddDataOpen)}
                      className={`flex items-center px-2.5 py-1.5 text-xs font-semibold rounded-[5px] transition-colors cursor-pointer border-none ${
                        ["add-data-benih", "add-data-pengetahuan"].includes(
                          currentPage,
                        )
                          ? "bg-white/10 text-white"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      Tambah Data
                      <ChevronDown
                        className={`w-3.5 h-3.5 ml-1 opacity-70 transition-transform duration-200 ${isAddDataOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isAddDataOpen && (
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-[5px] shadow-xl py-1 border border-gray-200 z-100">
                        <button
                          onClick={() => handleNav("add-data-benih")}
                          className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-kms-green-dark font-semibold cursor-pointer border-none transition-colors"
                        >
                          Benih / Varietas
                        </button>
                        <button
                          onClick={() => handleNav("add-data-pengetahuan")}
                          className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-kms-green-dark font-semibold cursor-pointer border-none transition-colors"
                        >
                          Pengetahuan Adat
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {canValidate && (
                  <button
                    onClick={() => handleNav("validasi-data")}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-[5px] transition-colors cursor-pointer border-none ${
                      isActive("validasi-data")
                        ? "bg-white/10 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Validasi Data
                  </button>
                )}

                {isAdmin && (
                  <button
                    onClick={() => handleNav("manage-accounts")}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-[5px] transition-colors cursor-pointer border-none ${
                      [
                        "manage-accounts",
                        "add-account",
                        "edit-account",
                      ].includes(currentPage)
                        ? "bg-white/10 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Manajemen Akun
                  </button>
                )}
              </nav>

              {/* Dedicated Notifications & Messages icons with badges */}
              <div className="hidden sm:flex items-center space-x-1.5 border-l border-white/15 pl-3">
                
                {/* Notification trigger button */}
                <button
                  onClick={() => handleNav("notifications")}
                  className={`relative p-1.5 rounded-full hover:bg-white/10 transition-all duration-200 cursor-pointer border-none bg-transparent flex items-center justify-center ${
                    isActive("notifications") ? "bg-white/10 text-white" : "text-gray-300 hover:text-white"
                  }`}
                  title="Notifikasi"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-kms-green-status rounded-full border border-kms-green-dark shadow-sm flex items-center justify-center text-[7px] font-black text-kms-green-dark"></span>
                  )}
                </button>

                {/* Messages trigger button */}
                <button
                  onClick={() => handleNav("messages")}
                  className={`relative p-1.5 rounded-full hover:bg-white/10 transition-all duration-200 cursor-pointer border-none bg-transparent flex items-center justify-center ${
                    isActive("messages") ? "bg-white/10 text-white" : "text-gray-300 hover:text-white"
                  }`}
                  title="Pesan Masuk"
                >
                  <Mail className="w-4.5 h-4.5" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-kms-red rounded-full border border-kms-green-dark shadow-sm flex items-center justify-center text-[7px] font-black text-white"></span>
                  )}
                </button>
              </div>

              {/* User profile dropdown triggers */}
              <div
                onClick={() => handleNav("profile")}
                className="flex items-center space-x-2.5 cursor-pointer group hover:bg-white/5 p-1 rounded-lg transition-all"
              >
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-[8px] text-gray-400 uppercase tracking-widest font-extrabold leading-tight mb-0.5">
                    {user.role.replace("_", " ")}
                  </span>
                  <span className="text-xs font-bold leading-tight text-white group-hover:text-kms-green-light transition-colors">
                    {user.name}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#E5D7FA] flex items-center justify-center border border-[#C084FC]/30 group-hover:border-[#C084FC]/60 transition-all shadow-sm">
                  <UserIcon className="w-3.5 h-3.5 text-[#6B21A8]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => handleNav("login")}
                className="text-xs font-bold text-white hover:text-kms-green-light transition cursor-pointer border-none bg-transparent"
              >
                Log In
              </button>
              <button
                onClick={() => handleNav("signup")}
                className="bg-kms-green-light hover:bg-[#A3CA99] text-[#284027] text-xs font-extrabold px-4 py-2 rounded-[5px] transition-all active:scale-95 cursor-pointer border-none shadow-xs"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-1.5 cursor-pointer border-none bg-transparent"
            >
              {isMobileMenuOpen ? (
                <X className="w-5.5 h-5.5" />
              ) : (
                <Menu className="w-5.5 h-5.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Layout */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1F331E] border-t border-white/10 shadow-inner">
          <div className="px-4 py-3 space-y-1">
            {user ? (
              <>
                <button
                  onClick={() => handleNav("dashboard")}
                  className={`block w-full text-left px-3 py-2 text-xs font-bold rounded-md border-none bg-transparent transition-colors ${
                    isActive("dashboard") ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav("notifications")}
                  className={`block w-full text-left px-3 py-2 text-xs font-bold rounded-md border-none bg-transparent transition-colors ${
                    isActive("notifications") ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Notifikasi {unreadNotificationsCount > 0 ? `(${unreadNotificationsCount})` : ""}
                </button>
                <button
                  onClick={() => handleNav("messages")}
                  className={`block w-full text-left px-3 py-2 text-xs font-bold rounded-md border-none bg-transparent transition-colors ${
                    isActive("messages") ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Pesan Masuk {unreadMessagesCount > 0 ? `(${unreadMessagesCount})` : ""}
                </button>
                
                {canAddData && (
                  <div className="pl-3 py-1 space-y-1">
                    <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">
                      Tambah Data
                    </span>
                    <button
                      onClick={() => handleNav("add-data-benih")}
                      className={`block w-full text-left px-3 py-2 text-xs font-bold rounded-md border-none bg-transparent transition-colors ${
                        isActive("add-data-benih") ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      Benih / Varietas
                    </button>
                    <button
                      onClick={() => handleNav("add-data-pengetahuan")}
                      className={`block w-full text-left px-3 py-2 text-xs font-bold rounded-md border-none bg-transparent transition-colors ${
                        isActive("add-data-pengetahuan") ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      Pengetahuan Adat
                    </button>
                  </div>
                )}

                {canValidate && (
                  <button
                    onClick={() => handleNav("validasi-data")}
                    className={`block w-full text-left px-3 py-2 text-xs font-bold rounded-md border-none bg-transparent transition-colors ${
                      isActive("validasi-data") ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Validasi Data
                  </button>
                )}

                {isAdmin && (
                  <button
                    onClick={() => handleNav("manage-accounts")}
                    className={`block w-full text-left px-3 py-2 text-xs font-bold rounded-md border-none bg-transparent transition-colors ${
                      ["manage-accounts", "add-account", "edit-account"].includes(currentPage) ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Manajemen Akun
                  </button>
                )}

                <hr className="border-white/10 my-3" />
                <button
                  onClick={() => handleNav("profile")}
                  className="w-full text-left px-3 py-2 text-xs font-extrabold text-kms-green-light hover:bg-white/10 rounded-md border-none bg-transparent flex items-center transition-colors"
                >
                  <UserIcon className="w-4 h-4 mr-2" /> Profil Saya
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNav("login")}
                  className="block w-full text-left px-3 py-2.5 text-xs font-bold text-white hover:bg-white/10 rounded-md border-none bg-transparent transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav("signup")}
                  className="block w-full text-left px-3 py-2.5 text-xs font-bold text-kms-green-light hover:bg-white/10 rounded-md border-none bg-transparent transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
