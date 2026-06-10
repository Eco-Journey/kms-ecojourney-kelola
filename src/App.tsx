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
import { Loader2 } from "lucide-react";
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
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
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

  const handleUpdateEntry = (updatedEntry: DataEntry): void => {
    setDataEntries((prev) =>
      prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)),
    );
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
          <AddBenihPage
            onNavigate={navigate}
            onAddEntry={handleAddEntry}
            editEntry={activeEntryId ? currentActiveEntry : null}
            onUpdateEntry={handleUpdateEntry}
          />
        );
      case "add-data-pengetahuan":
        return (
          <AddPengetahuanPage
            onNavigate={navigate}
            onAddEntry={handleAddEntry}
            editEntry={activeEntryId ? currentActiveEntry : null}
            onUpdateEntry={handleUpdateEntry}
          />
        );
      case "validasi-data":
        // Everyone can view details, validation controls will be disabled/hidden inside for non-pakar/non-admin
        return (
          <ValidasiDataPage
            entry={currentActiveEntry}
            user={user}
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


    </div>
  );
}

export default App;
