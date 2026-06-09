import React, { useState, useEffect, useRef } from "react";
import { Menu, X, User as UserIcon, ChevronDown, Search } from "lucide-react";
import { User } from "../App";
import NotificationMenu from "./NotificationMenu";
import MessageMenu from "./MessageMenu";

interface HeaderProps {
  currentPage: string;
  user: User | null;
  onNavigate: (page: string) => void;
}

export default function Header({
  currentPage,
  user,
  onNavigate,
}: HeaderProps): React.ReactElement {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAddDataOpen, setIsAddDataOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (page: string) => currentPage === page;
  const isLoggedIn = user !== null;

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
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center cursor-pointer select-none group"
            onClick={() => handleNav(isLoggedIn ? "dashboard" : "landing")}
          >
            <span className="text-2xl md:text-3xl font-extrabold tracking-wider font-sans transition-all duration-200 group-hover:scale-105">
              KMS
            </span>
            <span className="ml-2 text-sm font-semibold text-kms-green-light hidden sm:block">
              Ecojourney
            </span>
          </div>

          {isLoggedIn && (
            <div className="hidden md:flex items-center bg-[#1E301D] border border-kms-green-light/20 rounded-[5px] px-3 py-1.5 w-48 lg:w-72 focus-within:border-kms-green-light/50 transition-all duration-200 ml-6 mr-auto">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Pencarian cepat..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-400 w-full"
              />
            </div>
          )}

          {isLoggedIn ? (
            <div className="flex items-center space-x-3 md:space-x-5">
              <nav className="hidden md:flex items-center space-x-1">
                <button
                  onClick={() => handleNav("dashboard")}
                  className={`px-3 py-2 text-sm font-semibold rounded-[5px] transition-colors cursor-pointer border-none ${
                    isActive("dashboard")
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Dashboard
                </button>

                <div ref={dropdownRef} className="relative group">
                  <button
                    onClick={() => setIsAddDataOpen(!isAddDataOpen)}
                    className={`flex items-center px-3 py-2 text-sm font-semibold rounded-[5px] transition-colors cursor-pointer border-none ${
                      ["add-data-benih", "add-data-pengetahuan"].includes(
                        currentPage,
                      )
                        ? "bg-white/10 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Tambah Data
                    <ChevronDown
                      className={`w-4 h-4 ml-1 opacity-70 transition-transform duration-200 ${isAddDataOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isAddDataOpen && (
                    <div className="absolute left-0 mt-2 w-52 bg-white rounded-[5px] shadow-xl py-1.5 border border-gray-200 z-100">
                      <button
                        onClick={() => handleNav("add-data-benih")}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-kms-green-dark font-semibold cursor-pointer border-none transition-colors"
                      >
                        Benih / Varietas
                      </button>
                      <button
                        onClick={() => handleNav("add-data-pengetahuan")}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-kms-green-dark font-semibold cursor-pointer border-none transition-colors"
                      >
                        Pengetahuan Adat
                      </button>
                    </div>
                  )}
                </div>

                {(user.role === "administrator" ||
                  user.role === "fasilitator") && (
                  <button
                    onClick={() => handleNav("validasi-data")}
                    className={`px-3 py-2 text-sm font-semibold rounded-[5px] transition-colors cursor-pointer border-none ${
                      isActive("validasi-data")
                        ? "bg-white/10 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Validasi Data
                  </button>
                )}

                {user.role === "administrator" && (
                  <button
                    onClick={() => handleNav("manage-accounts")}
                    className={`px-3 py-2 text-sm font-semibold rounded-[5px] transition-colors cursor-pointer border-none ${
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

              <div className="hidden sm:flex items-center space-x-2 border-l border-white/10 pl-4">
                <NotificationMenu onNavigate={onNavigate} />
                <MessageMenu />
              </div>

              <div
                onClick={() => handleNav("profile")}
                className="flex items-center space-x-3 cursor-pointer group hover:bg-white/5 p-1.5 rounded-lg transition-all"
              >
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold leading-tight mb-0.5">
                    {user.role.replace("_", " ")}
                  </span>
                  <span className="text-sm font-bold leading-tight text-white group-hover:text-kms-green-light transition-colors">
                    {user.name}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#E5D7FA] flex items-center justify-center border-2 border-[#C084FC]/30 group-hover:border-[#C084FC]/70 transition-all shadow-sm">
                  <UserIcon className="w-4 h-4 text-[#6B21A8]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => handleNav("login")}
                className="text-sm font-bold text-white hover:text-kms-green-light transition cursor-pointer border-none bg-transparent"
              >
                Log In
              </button>
              <button
                onClick={() => handleNav("signup")}
                className="bg-kms-green-light hover:bg-[#A3CA99] text-[#284027] text-sm font-extrabold px-5 py-2 rounded-[5px] transition-all active:scale-95 cursor-pointer border-none shadow-sm"
              >
                Sign Up
              </button>
            </div>
          )}

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2 cursor-pointer border-none bg-transparent"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1F331E] border-t border-white/10 shadow-inner">
          <div className="px-4 py-3 space-y-1">
            {user ? (
              <>
                <button
                  onClick={() => handleNav("dashboard")}
                  className="block w-full text-left px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10 rounded-md border-none bg-transparent transition-colors"
                >
                  Dashboard
                </button>
                <div className="pl-3 py-1 space-y-1">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Tambah Data
                  </span>
                  <button
                    onClick={() => handleNav("add-data-benih")}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white rounded-md border-none bg-transparent transition-colors"
                  >
                    Benih / Varietas
                  </button>
                  <button
                    onClick={() => handleNav("add-data-pengetahuan")}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white rounded-md border-none bg-transparent transition-colors"
                  >
                    Pengetahuan Adat
                  </button>
                </div>

                {(user.role === "administrator" ||
                  user.role === "fasilitator") && (
                  <button
                    onClick={() => handleNav("validasi-data")}
                    className="block w-full text-left px-3 py-2.5 text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white rounded-md border-none bg-transparent transition-colors"
                  >
                    Validasi Data
                  </button>
                )}

                {user.role === "administrator" && (
                  <button
                    onClick={() => handleNav("manage-accounts")}
                    className="block w-full text-left px-3 py-2.5 text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white rounded-md border-none bg-transparent transition-colors"
                  >
                    Manajemen Akun
                  </button>
                )}

                <hr className="border-white/10 my-3" />
                <button
                  onClick={() => handleNav("profile")}
                  className="w-full text-left px-3 py-2.5 text-sm font-bold text-kms-green-light hover:bg-white/10 rounded-md border-none bg-transparent flex items-center transition-colors"
                >
                  <UserIcon className="w-4 h-4 mr-2" /> Profil Saya
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNav("login")}
                  className="block w-full text-left px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10 rounded-md border-none bg-transparent transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav("signup")}
                  className="block w-full text-left px-3 py-2.5 text-sm font-bold text-kms-green-light hover:bg-white/10 rounded-md border-none bg-transparent transition-colors"
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
