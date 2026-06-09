import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import ManageAccountsPage from "./pages/ManageAccountsPage";
import AddAccountPage from "./pages/AddAccountPage";
import EditAccountPage from "./pages/EditAccountPage";
import AddBenihPage from "./pages/AddBenihPage";
import AddPengetahuanPage from "./pages/AddPengetahuanPage";
import ValidasiDataPage from "./pages/ValidasiDataPage";
import { Eye, Layout, Loader2 } from "lucide-react";
import { supabase } from "./lib/supabase";

export interface User {
  name: string;
  email: string;
  role: string;
  username: string;
}

export interface Account {
  id: string;
  namaDepan: string;
  namaBelakang: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  email: string;
  username: string;
  role: string;
  statusAktif: boolean;
  wajibGantiPassword: boolean;
  avatar: string;
}

export interface DataEntry {
  id: string;
  type: "Desa" | "Pengetahuan Adat" | "Benih/Varietas";
  nama: string;
  kategori: string;
  status: string;
  tanggal: string;
  lokasi: {
    kota: string;
    provinsi: string;
    deskripsiLokasi: string;
    koordinat: { lat: number; lng: number } | null;
  };
  deskripsi: string;
  images: string[];
  fpicDoc: string;
  namaLokal?: string;
  namaIlmiah?: string;
  namaPenemu?: string;
  judulPengetahuan?: string;
  varietasTerkait?: string;
  wilayahAsal?: string;
  namaNarasumber?: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [showDevPanel, setShowDevPanel] = useState<boolean>(true);

  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "MA001",
      namaDepan: "Alifianto",
      namaBelakang: "",
      namaLengkap: "Alifianto",
      tempatLahir: "Jakarta",
      tanggalLahir: "12 April 1993",
      email: "alifianto@gmail.com",
      username: "@alifianto",
      role: "Masyarakat Adat",
      statusAktif: true,
      wajibGantiPassword: false,
      avatar: "",
    },
    {
      id: "P001",
      namaDepan: "Mahmudin",
      namaBelakang: "",
      namaLengkap: "Mahmudin",
      tempatLahir: "Sleman",
      tanggalLahir: "28 Oktober 1985",
      email: "mahmudin@gmail.com",
      username: "@mahmudin",
      role: "Pakar",
      statusAktif: true,
      wajibGantiPassword: false,
      avatar: "",
    },
  ]);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);

  const [dataEntries, setDataEntries] = useState<DataEntry[]>([
    {
      id: "MA001",
      type: "Benih/Varietas",
      nama: "Benih Padi 12",
      kategori: "Benih Padi",
      status: "Verifikasi",
      tanggal: "15 Februari 2026",
      lokasi: {
        kota: "Ciletuh",
        provinsi: "Jawa Barat",
        deskripsiLokasi: "Desa Adat Kasepuhan Ciptagelar",
        koordinat: { lat: -6.9038, lng: 106.5078 },
      },
      deskripsi:
        "Masyarakat adat Kasepuhan Ciptagelar memasukkan varietas benih lokal padi 12 ke database untuk melestarikan keanekaragaman crop wild relatives.",
      images: [
        "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=600&h=450",
      ],
      fpicDoc: "fpic_padi12_signed.pdf",
      namaLokal: "Padi Cigeulis",
      namaIlmiah: "Oryza sativa L.",
      namaPenemu: "Kasepuhan Ciptagelar",
    },
    {
      id: "P001",
      type: "Desa",
      nama: "Desa Sukamaju",
      kategori: "Desa Konservasi",
      status: "Aktif",
      tanggal: "9 Februari 2026",
      lokasi: {
        kota: "Tasikmalaya",
        provinsi: "Jawa Barat",
        deskripsiLokasi: "Kecamatan Kadipaten",
        koordinat: { lat: -7.1539, lng: 108.1678 },
      },
      deskripsi:
        "Fasilitator lapangan menyelesaikan dokumen pendaftaran data sebaran dan status konservasi Desa Sukamaju.",
      images: [
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=600&h=450",
      ],
      fpicDoc: "dokumen_konservasi_sukamaju.pdf",
    },
  ]);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);

  const navigate = (page: string): void => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const fetchAndSetUserProfile = async (userId: string, email: string) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      setUser({
        name: profile.nama_lengkap || profile.nama_depan,
        email: profile.email || email,
        role: profile.role,
        username: profile.username || "",
      });
    } catch (err) {
      setUser({
        name: "Pengguna",
        email,
        role: "masyarakat_adat",
        username: "",
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          await fetchAndSetUserProfile(
            session.user.id,
            session.user.email || "",
          );
          setCurrentPage((prev) =>
            ["landing", "login", "signup"].includes(prev) ? "dashboard" : prev,
          );
        }
      } catch (err) {
      } finally {
        if (mounted) setIsAuthLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await fetchAndSetUserProfile(session.user.id, session.user.email || "");
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setCurrentPage("landing");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = (userData: User): void => {
    setUser(userData);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      alert("Terjadi kesalahan saat logout. Silakan coba lagi.");
    }
  };

  const handleUpdateUser = (userData: User): void => {
    setUser(userData);
  };

  const handleAddAccount = (newAccount: Account): void => {
    setAccounts((prev) => [...prev, newAccount]);
  };

  const handleUpdateAccount = (updatedAccount: Account): void => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc)),
    );
  };

  const handleDeleteAccount = (id: string): void => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  const handleToggleAccountStatus = (id: string): void => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, statusAktif: !acc.statusAktif } : acc,
      ),
    );
  };

  const handleAddEntry = (newEntry: DataEntry): void => {
    setDataEntries((prev) => [newEntry, ...prev]);
  };

  const handleValidateEntry = (id: string, newStatus: string): void => {
    setDataEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, status: newStatus } : entry,
      ),
    );
  };

  const handleToggleEntryStatus = (id: string): void => {
    setDataEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              status: entry.status === "Aktif" ? "Verifikasi" : "Aktif",
            }
          : entry,
      ),
    );
  };

  const handleDeleteEntry = (id: string): void => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setDataEntries((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  const currentEditingAccount =
    accounts.find((a) => a.id === editingAccountId) || accounts[0];
  const currentActiveEntry =
    dataEntries.find((e) => e.id === activeEntryId) || dataEntries[0];

  const renderPage = (): React.ReactElement => {
    if (user && ["landing", "login", "signup"].includes(currentPage)) {
      setTimeout(() => navigate("dashboard"), 0);
      return (
        <DashboardPage
          user={user}
          onNavigate={navigate}
          dataEntries={dataEntries}
          onToggleEntryStatus={handleToggleEntryStatus}
          onDeleteEntry={handleDeleteEntry}
          setActiveEntryId={setActiveEntryId}
        />
      );
    }

    const requiresAuth = !["landing", "login", "signup"].includes(currentPage);
    if (requiresAuth && !user) {
      setTimeout(() => navigate("landing"), 0);
      return <LandingPage onNavigate={navigate} />;
    }

    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={navigate} />;
      case "login":
        return (
          <LoginPage
            onNavigate={navigate}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case "signup":
        return <SignUpPage onNavigate={navigate} />;
      case "profile":
        return (
          <ProfilePage
            user={user}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
          />
        );
      case "dashboard":
        return (
          <DashboardPage
            user={user}
            onNavigate={navigate}
            dataEntries={dataEntries}
            onToggleEntryStatus={handleToggleEntryStatus}
            onDeleteEntry={handleDeleteEntry}
            setActiveEntryId={setActiveEntryId}
          />
        );
      case "add-data-benih":
        return (
          <AddBenihPage onNavigate={navigate} onAddEntry={handleAddEntry} />
        );
      case "add-data-pengetahuan":
        return (
          <AddPengetahuanPage
            onNavigate={navigate}
            onAddEntry={handleAddEntry}
          />
        );
      case "validasi-data":
        if (user?.role !== "administrator" && user?.role !== "fasilitator") {
          setTimeout(() => navigate("dashboard"), 0);
          return (
            <DashboardPage
              user={user}
              onNavigate={navigate}
              dataEntries={dataEntries}
              onToggleEntryStatus={handleToggleEntryStatus}
              onDeleteEntry={handleDeleteEntry}
              setActiveEntryId={setActiveEntryId}
            />
          );
        }
        return (
          <ValidasiDataPage
            entry={currentActiveEntry}
            onNavigate={navigate}
            onValidateEntry={handleValidateEntry}
          />
        );
      case "manage-accounts":
        if (user?.role !== "administrator") {
          setTimeout(() => navigate("dashboard"), 0);
          return (
            <DashboardPage
              user={user}
              onNavigate={navigate}
              dataEntries={dataEntries}
              onToggleEntryStatus={handleToggleEntryStatus}
              onDeleteEntry={handleDeleteEntry}
              setActiveEntryId={setActiveEntryId}
            />
          );
        }
        return (
          <ManageAccountsPage
            accounts={accounts}
            onNavigate={navigate}
            onDeleteAccount={handleDeleteAccount}
            onToggleAccountStatus={handleToggleAccountStatus}
            setEditingAccountId={setEditingAccountId}
          />
        );
      case "add-account":
        if (user?.role !== "administrator") {
          setTimeout(() => navigate("dashboard"), 0);
          return (
            <DashboardPage
              user={user}
              onNavigate={navigate}
              dataEntries={dataEntries}
              onToggleEntryStatus={handleToggleEntryStatus}
              onDeleteEntry={handleDeleteEntry}
              setActiveEntryId={setActiveEntryId}
            />
          );
        }
        return (
          <AddAccountPage
            onNavigate={navigate}
            onAddAccount={handleAddAccount}
          />
        );
      case "edit-account":
        if (user?.role !== "administrator") {
          setTimeout(() => navigate("dashboard"), 0);
          return (
            <DashboardPage
              user={user}
              onNavigate={navigate}
              dataEntries={dataEntries}
              onToggleEntryStatus={handleToggleEntryStatus}
              onDeleteEntry={handleDeleteEntry}
              setActiveEntryId={setActiveEntryId}
            />
          );
        }
        return (
          <EditAccountPage
            account={currentEditingAccount}
            onNavigate={navigate}
            onUpdateAccount={handleUpdateAccount}
          />
        );
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kms-gray-bg flex-col">
        <Loader2 className="w-10 h-10 animate-spin text-kms-blue-accent mb-4" />
        <p className="text-sm font-semibold text-gray-600 animate-pulse">
          Menyiapkan KMS Ecojourney...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-kms-gray-bg font-sans">
      <Header currentPage={currentPage} user={user} onNavigate={navigate} />

      <main className="flex-grow flex flex-col w-full">{renderPage()}</main>

      <Footer />

      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
        {showDevPanel && (
          <div className="bg-[#1E293B]/95 backdrop-blur-md text-white rounded-[5px] p-4 shadow-2xl border border-slate-700/60 mb-2 w-64 text-left animate-slide-up select-none">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center">
                <Layout className="w-3.5 h-3.5 mr-1 text-kms-green-light" />
                Dev Page Switcher
              </span>
              <button
                onClick={() => setShowDevPanel(false)}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-gray-300 px-1.5 py-0.5 rounded cursor-pointer"
              >
                Hide
              </button>
            </div>

            <div className="flex flex-col space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {[
                { id: "landing", label: "1. Landing Page" },
                { id: "login", label: "2. Login Page" },
                { id: "signup", label: "3. Sign Up Page" },
                { id: "dashboard", label: "4. Dashboard Page" },
                { id: "profile", label: "5. Profile Page" },
                { id: "manage-accounts", label: "6. Manajemen Akun" },
                { id: "add-account", label: "7. Add Account" },
                { id: "edit-account", label: "8. Edit Account / Role" },
                { id: "add-data-benih", label: "9. Add Benih Form" },
                { id: "add-data-pengetahuan", label: "10. Add Pengetahuan" },
                { id: "validasi-data", label: "11. Validasi Data Page" },
              ].map((pg) => (
                <button
                  key={pg.id}
                  onClick={() => {
                    if (
                      pg.id === "edit-account" &&
                      accounts.length > 0 &&
                      !editingAccountId
                    ) {
                      setEditingAccountId(accounts[0].id);
                    }
                    if (
                      pg.id === "validasi-data" &&
                      dataEntries.length > 0 &&
                      !activeEntryId
                    ) {
                      setActiveEntryId(dataEntries[0].id);
                    }
                    navigate(pg.id);
                  }}
                  className={`text-left text-xs px-2.5 py-2 rounded-[3px] transition duration-150 cursor-pointer ${
                    currentPage === pg.id
                      ? "bg-kms-green-dark text-white font-bold"
                      : "hover:bg-slate-800 text-gray-300"
                  }`}
                >
                  {pg.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-3 text-center leading-normal font-normal">
              Gunakan panel ini untuk meninjau masing-masing mockup desain
              dengan instan.
            </p>
          </div>
        )}

        {!showDevPanel && (
          <button
            onClick={() => setShowDevPanel(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-full shadow-lg border border-slate-700 hover:scale-105 transition-all duration-200 cursor-pointer flex items-center justify-center"
            title="Tampilkan Page Switcher"
          >
            <Eye className="w-5 h-5 text-kms-green-light" />
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
