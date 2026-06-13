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
import NotificationsPage from "./pages/NotificationsPage";
import MessagesPage from "./pages/MessagesPage";
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
  rejectionReason?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "info" | "success" | "warning";
  actionRoute?: string;
  entryId?: string;
}

export interface MessageDetail {
  sender: string;
  text: string;
  time: string;
}

export interface MessageThread {
  id: string;
  entryId?: string;
  senderName: string;
  avatarLetter: string;
  subject: string;
  time: string;
  isRead: boolean;
  messages: MessageDetail[];
}

function App() {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<"connecting" | "connected" | "fallback">("connecting");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [messages, setMessages] = useState<MessageThread[]>([]);

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
  
  const fetchEntries = async () => {
    try {
      // 1. Fetch varieties, articles, and villages concurrently
      const [varRes, artRes, vilRes] = await Promise.all([
        supabase.from("varieties").select("*"),
        supabase.from("articles").select("*"),
        supabase.from("villages").select("*"),
      ]);

      if (varRes.error) throw varRes.error;
      if (artRes.error) throw artRes.error;
      if (vilRes.error) throw vilRes.error;

      const mappedVarieties: DataEntry[] = (varRes.data || []).map((v: any) => ({
        id: v.id,
        type: "Benih/Varietas",
        nama: v.name,
        kategori: v.commodity?.startsWith("Benih ") ? v.commodity : ("Benih " + (v.commodity || "Pangan")),
        status: v.status || "Aktif",
        tanggal: v.tanggal || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        lokasi: {
          kota: v.village || "",
          provinsi: v.province || "Jawa Barat",
          deskripsiLokasi: v.landType || "",
          koordinat: v.latitude && v.longitude ? { lat: v.latitude, lng: v.longitude } : null
        },
        deskripsi: v.physicalDescription || "",
        images: v.images && v.images.length > 0 ? v.images : ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600&h=450"],
        fpicDoc: v.fpicDoc || "dokumen_fpic_signed.pdf",
        namaLokal: v.name,
        namaIlmiah: v.namaIlmiah || "Solanum tuberosum L.",
        namaPenemu: v.village,
        altitude: v.altitude || "",
        landType: v.landType || "",
        rainfall: v.rainfall || "",
        rejectionReason: v.rejection_reason || undefined
      }));

      const mappedArticles: DataEntry[] = (artRes.data || []).map((a: any) => ({
        id: a.id,
        type: "Pengetahuan Adat",
        nama: a.title,
        kategori: a.category?.startsWith("Pengetahuan ") ? a.category : ("Pengetahuan " + (a.category || "Obat Tradisional")),
        status: a.is_verified ? "Aktif" : (a.status || "Verifikasi"),
        tanggal: a.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        lokasi: {
          kota: a.wilayah_asal || "Jawa Barat",
          provinsi: "Jawa Barat",
          deskripsiLokasi: a.description || "",
          koordinat: null
        },
        deskripsi: a.content || a.description || "",
        images: [a.image || "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600&h=450"],
        fpicDoc: a.fpicDoc || "dokumen_fpic_signed.pdf",
        judulPengetahuan: a.title,
        varietasTerkait: a.variety_id || "",
        wilayahAsal: a.wilayah_asal || "",
        namaNarasumber: a.author_name || "",
        rejectionReason: a.rejection_reason || undefined
      }));

      const mappedVillages: DataEntry[] = (vilRes.data || []).map((v: any) => ({
        id: v.id,
        type: "Desa",
        nama: v.name,
        kategori: "Desa Konservasi",
        status: "Aktif",
        tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        lokasi: {
          kota: v.name,
          provinsi: v.location_map_url || "Jawa Barat",
          deskripsiLokasi: v.description || "",
          koordinat: v.latitude && v.longitude ? { lat: v.latitude, lng: v.longitude } : null
        },
        deskripsi: v.description || "",
        images: [v.image || "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=600&h=450"],
        fpicDoc: "dokumen_konservasi_" + v.id + ".pdf"
      }));

      setDataEntries([...mappedVarieties, ...mappedArticles, ...mappedVillages]);
      setDbConnectionStatus("connected");
    } catch (err) {
      console.warn("Gagal memuat dari public tables, mencoba fallback ke data_entries:", err);
      // Fallback: Read from the unified data_entries table
      try {
        const { data, error } = await supabase
          .from("data_entries")
          .select("*, entry_images(storage_path, sort_order)")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          const mappedData: DataEntry[] = data.map((row: any) => {
            let mappedType: "Desa" | "Pengetahuan Adat" | "Benih/Varietas" = "Desa";
            if (row.type === "benih_varietas") mappedType = "Benih/Varietas";
            else if (row.type === "pengetahuan_adat") mappedType = "Pengetahuan Adat";

            let mappedStatus = "Verifikasi";
            if (row.status === "aktif") mappedStatus = "Aktif";
            else if (row.status === "ditolak") mappedStatus = "Ditolak";
            else if (row.status === "perlu_revisi") mappedStatus = "Perlu Revisi";

            const images = row.entry_images && row.entry_images.length > 0
              ? row.entry_images
                  .sort((a: any, b: any) => a.sort_order - b.sort_order)
                  .map(
                    (img: any) => {
                      if (img.storage_path.startsWith("http")) return img.storage_path;
                      return supabase.storage
                        .from("entry-images")
                        .getPublicUrl(img.storage_path).data.publicUrl;
                    }
                  )
              : ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600&h=450"];

            const fpicDocUrl = row.fpic_doc_path
              ? (row.fpic_doc_path.startsWith("http") || row.fpic_doc_path.includes("/")
                  ? row.fpic_doc_path
                  : supabase.storage
                      .from("fpic-documents")
                      .getPublicUrl(row.fpic_doc_path).data.publicUrl)
              : "dokumen_fpic_signed.pdf";

            return {
              id: row.id,
              type: mappedType,
              nama: row.nama,
              kategori: row.kategori || "",
              status: mappedStatus,
              tanggal: row.tanggal || "",
              lokasi: {
                kota: row.kota_kabupaten || "",
                provinsi: row.provinsi || "",
                deskripsiLokasi: row.deskripsi_lokasi || "",
                koordinat:
                  row.lat && row.lng ? { lat: row.lat, lng: row.lng } : null,
              },
              deskripsi: row.deskripsi || "",
              images: images,
              fpicDoc: fpicDocUrl,
              namaLokal: row.nama_lokal || undefined,
              namaIlmiah: row.nama_ilmiah || undefined,
              namaPenemu: row.nama_penemu || undefined,
              judulPengetahuan: row.judul_pengetahuan || undefined,
              varietasTerkait: row.varietas_terkait || undefined,
              wilayahAsal: row.wilayah_asal || undefined,
              namaNarasumber: row.nama_narasumber || undefined,
              rejectionReason: row.rejection_reason || undefined
            };
          });

          setDataEntries(mappedData);
        }
        setDbConnectionStatus("connected");
      } catch (err2) {
        console.error("Gagal memuat data dari data_entries juga:", err2);
        setDbConnectionStatus("fallback");
      }
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
    fetchEntries();

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

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setMessages([]);
      return;
    }

    const userRole = user.role.toLowerCase();
    const isAdmin = userRole === "administrator";
    const isPakar = userRole === "pakar" || userRole === "validator";
    const isSubmitter = ["administrator", "masyarakat_adat", "masyarakat adat", "fasilitator", "penyuluh"].includes(userRole);

    const targetNotifs: NotificationItem[] = [];

    // System Notification (always present)
    targetNotifs.push({
      id: "sys-welcome",
      title: "Selamat Datang",
      message: `Selamat datang di portal kelola Eco-Journey, ${user.name}. Semua modul manajemen data dan sinkronisasi siap digunakan.`,
      time: "1 jam lalu",
      isRead: false,
      type: "info"
    });

    dataEntries.forEach(entry => {
      // Trigger A: Menunggu Validasi (Pakar & Admin)
      if (entry.status === "Verifikasi" && (isPakar || isAdmin)) {
        targetNotifs.push({
          id: `verif-${entry.id}`,
          title: `Menunggu Validasi: ${entry.nama}`,
          message: `${entry.type} baru '${entry.nama}' diunggah dari ${entry.lokasi.kota} dan memerlukan validasi.`,
          time: "Baru saja",
          isRead: false,
          type: "info",
          actionRoute: "validasi-data",
          entryId: entry.id
        });
      }

      // Trigger B: Perlu Revisi (Submitter & Admin)
      if (entry.status === "Perlu Revisi" && isSubmitter) {
        targetNotifs.push({
          id: `revisi-${entry.id}`,
          title: `Revisi Diperlukan: ${entry.nama}`,
          message: `Data '${entry.nama}' memerlukan perbaikan. Catatan pakar: "${entry.rejectionReason || 'Mohon lengkapi data.'}"`,
          time: "5 menit lalu",
          isRead: false,
          type: "warning",
          actionRoute: entry.type === "Benih/Varietas" ? "add-data-benih" : "add-data-pengetahuan",
          entryId: entry.id
        });
      }

      // Trigger C: Disetujui / Aktif (Submitter & Admin)
      if (entry.status === "Aktif" && isSubmitter) {
        targetNotifs.push({
          id: `approved-${entry.id}`,
          title: `Data Disetujui: ${entry.nama}`,
          message: `Selamat! ${entry.type} '${entry.nama}' telah berhasil divalidasi dan sekarang aktif di portal publik.`,
          time: "2 jam lalu",
          isRead: false,
          type: "success",
          entryId: entry.id
        });
      }

      // Trigger D: Ditolak (Submitter & Admin)
      if (entry.status === "Ditolak" && isSubmitter) {
        targetNotifs.push({
          id: `rejected-${entry.id}`,
          title: `Data Ditolak: ${entry.nama}`,
          message: `Pengajuan '${entry.nama}' ditolak. Alasan: "${entry.rejectionReason || 'Dokumen persetujuan FPIC tidak sesuai.'}"`,
          time: "1 hari lalu",
          isRead: false,
          type: "warning",
          entryId: entry.id
        });
      }
    });

    // Merge notifications (preserve isRead)
    setNotifications(prev => {
      return targetNotifs.map(t => {
        const existing = prev.find(p => p.id === t.id);
        if (existing) {
          return { ...t, isRead: existing.isRead };
        }
        return t;
      });
    });

    const targetThreads: MessageThread[] = [];

    // System discussion thread
    targetThreads.push({
      id: "thread-sys",
      senderName: "Mahmudin (Pakar Adat)",
      avatarLetter: "M",
      subject: "Diskusi Padi Kasepuhan",
      time: "2 jam lalu",
      isRead: false,
      messages: [
        {
          sender: "Mahmudin (Pakar Adat)",
          text: "Halo, untuk Padi Cigeulis sudah saya verifikasi di lapangan. Sangat cocok dengan database etnobotani Jawa Barat.",
          time: "2 jam lalu"
        },
        {
          sender: "Anda",
          text: "Terima kasih banyak, Pak Mahmudin. Kerja sama yang luar biasa.",
          time: "1 jam lalu"
        }
      ]
    });

    // Generate threads for items needing revisions
    dataEntries.forEach(entry => {
      if ((entry.status === "Perlu Revisi" || entry.status === "Ditolak") && entry.rejectionReason) {
        targetThreads.push({
          id: `thread-${entry.id}`,
          entryId: entry.id,
          senderName: "Mahmudin (Pakar Adat)",
          avatarLetter: "M",
          subject: `Catatan Revisi: ${entry.nama}`,
          time: "Baru saja",
          isRead: false,
          messages: [
            {
              sender: "Mahmudin (Pakar Adat)",
              text: `Halo, saya telah mereview pengajuan '${entry.nama}'. Mohon diperbaiki bagian deskripsi karena alasan berikut: ${entry.rejectionReason}`,
              time: "Baru saja"
            }
          ]
        });
      }
    });

    // Merge message threads (preserve isRead and user replies)
    setMessages(prev => {
      return targetThreads.map(t => {
        const existing = prev.find(p => p.id === t.id);
        if (existing) {
          const mergedMessages = [...t.messages];
          if (existing.messages.length > t.messages.length) {
            mergedMessages.push(...existing.messages.slice(t.messages.length));
          }
          return { ...t, isRead: existing.isRead, messages: mergedMessages };
        }
        return t;
      });
    });

  }, [dataEntries, user]);

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleSendMessageReply = (threadId: string, replyText: string) => {
    if (!replyText.trim()) return;
    setMessages((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            isRead: true,
            messages: [
              ...thread.messages,
              {
                sender: "Anda",
                text: replyText,
                time: "Baru saja",
              },
            ],
          };
        }
        return thread;
      })
    );
  };

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

  // Helpers for falling back to data_entries table if public tables are missing
  const insertIntoDataEntries = async (newEntry: DataEntry, dbType: string, dbStatus: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;

    const { error } = await supabase.from("data_entries").insert({
      id: newEntry.id,
      type: dbType,
      status: dbStatus,
      kategori: newEntry.kategori,
      nama: newEntry.nama,
      tanggal: newEntry.tanggal,
      kota_kabupaten: newEntry.lokasi.kota,
      provinsi: newEntry.lokasi.provinsi,
      deskripsi_lokasi: newEntry.lokasi.deskripsiLokasi,
      lat: newEntry.lokasi.koordinat ? newEntry.lokasi.koordinat.lat : null,
      lng: newEntry.lokasi.koordinat ? newEntry.lokasi.koordinat.lng : null,
      deskripsi: newEntry.deskripsi,
      fpic_doc_path: newEntry.fpicDoc || null,
      
      nama_lokal: newEntry.namaLokal || null,
      nama_ilmiah: newEntry.namaIlmiah || null,
      nama_penemu: newEntry.namaPenemu || null,
      
      judul_pengetahuan: newEntry.judulPengetahuan || null,
      varietas_terkait: newEntry.varietasTerkait || null,
      wilayah_asal: newEntry.wilayahAsal || null,
      nama_narasumber: newEntry.namaNarasumber || null,
      
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    if (error) throw error;
    
    if (newEntry.images && newEntry.images.length > 0) {
      for (let i = 0; i < newEntry.images.length; i++) {
        await supabase.from("entry_images").insert({
          entry_id: newEntry.id,
          storage_path: newEntry.images[i],
          is_main: i === 0,
          sort_order: i
        });
      }
    }
  };

  const updateDataEntries = async (updatedEntry: DataEntry, dbType: string, dbStatus: string) => {
    const { error } = await supabase.from("data_entries").update({
      type: dbType,
      status: dbStatus,
      kategori: updatedEntry.kategori,
      nama: updatedEntry.nama,
      tanggal: updatedEntry.tanggal,
      kota_kabupaten: updatedEntry.lokasi.kota,
      provinsi: updatedEntry.lokasi.provinsi,
      deskripsi_lokasi: updatedEntry.lokasi.deskripsiLokasi,
      lat: updatedEntry.lokasi.koordinat ? updatedEntry.lokasi.koordinat.lat : null,
      lng: updatedEntry.lokasi.koordinat ? updatedEntry.lokasi.koordinat.lng : null,
      deskripsi: updatedEntry.deskripsi,
      fpic_doc_path: updatedEntry.fpicDoc || null,
      
      nama_lokal: updatedEntry.namaLokal || null,
      nama_ilmiah: updatedEntry.namaIlmiah || null,
      nama_penemu: updatedEntry.namaPenemu || null,
      
      judul_pengetahuan: updatedEntry.judulPengetahuan || null,
      varietas_terkait: updatedEntry.varietasTerkait || null,
      wilayah_asal: updatedEntry.wilayahAsal || null,
      nama_narasumber: updatedEntry.namaNarasumber || null,
      
      rejection_reason: updatedEntry.rejectionReason || null,
      updated_at: new Date().toISOString()
    }).eq("id", updatedEntry.id);

    if (error) throw error;

    if (updatedEntry.images && updatedEntry.images.length > 0) {
      await supabase.from("entry_images").delete().eq("entry_id", updatedEntry.id);
      for (let i = 0; i < updatedEntry.images.length; i++) {
        await supabase.from("entry_images").insert({
          entry_id: updatedEntry.id,
          storage_path: updatedEntry.images[i],
          is_main: i === 0,
          sort_order: i
        });
      }
    }
  };

  const validateDataEntries = async (id: string, dbStatus: string, rejectionReason?: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const validatorId = session?.user?.id || null;

    const { error } = await supabase.from("data_entries").update({
      status: dbStatus,
      rejection_reason: rejectionReason || null,
      validated_by: validatorId,
      validated_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).eq("id", id);

    if (error) throw error;
  };

  const handleAddEntry = async (newEntry: DataEntry): Promise<void> => {
    // 1. Update local state (fallback/optimistic)
    setDataEntries((prev) => [newEntry, ...prev]);

    // 2. Sync to Supabase
    try {
      const dbType = newEntry.type === "Benih/Varietas" ? "benih_varietas" 
                   : newEntry.type === "Pengetahuan Adat" ? "pengetahuan_adat" 
                   : "desa";

      const dbStatus = newEntry.status === "Aktif" ? "aktif" 
                     : newEntry.status === "Ditolak" ? "ditolak" 
                     : newEntry.status === "Perlu Revisi" ? "perlu_revisi" 
                     : "verifikasi";

      if (newEntry.type === "Benih/Varietas") {
        try {
          const { error } = await supabase.from("varieties").insert({
            id: newEntry.id,
            name: newEntry.nama,
            village: newEntry.lokasi.kota,
            commodity: newEntry.kategori.replace("Benih ", ""),
            physicalDescription: newEntry.deskripsi,
            conservationStatus: newEntry.namaIlmiah || "Aman",
            altitude: newEntry.lokasi.deskripsiLokasi || "",
            landType: newEntry.lokasi.deskripsiLokasi || "",
            rainfall: "Sedang",
            images: newEntry.images,
            practices: [],
            calendarEvents: {}
          });
          if (error) throw error;

          await supabase.from("mappins").insert({
            varietyId: newEntry.id,
            cx: 400,
            cy: 175,
            label: `${newEntry.nama} (${newEntry.lokasi.kota})`,
            commodity: newEntry.kategori.replace("Benih ", ""),
            status: newEntry.namaIlmiah || "Aman",
            province: newEntry.lokasi.provinsi,
            ecosystem: newEntry.lokasi.deskripsiLokasi || "Sawah"
          });
        } catch (e) {
          console.warn("Public varieties table not available, falling back to data_entries:", e);
          await insertIntoDataEntries(newEntry, dbType, dbStatus);
        }
      } else if (newEntry.type === "Pengetahuan Adat") {
        try {
          const { error } = await supabase.from("articles").insert({
            id: newEntry.id,
            title: newEntry.nama,
            subtitle: newEntry.kategori,
            image: newEntry.images[0] || "",
            description: newEntry.deskripsi.substring(0, 150),
            content: newEntry.deskripsi,
            category: newEntry.kategori.replace("Pengetahuan ", ""),
            date: newEntry.tanggal,
            author_name: newEntry.namaNarasumber || "Kontributor Adat",
            author_title: "Narasumber",
            author_image: "",
            is_verified: newEntry.status === "Aktif",
            year: new Date().getFullYear(),
            variety_id: newEntry.varietasTerkait || ""
          });
          if (error) throw error;
        } catch (e) {
          console.warn("Public articles table not available, falling back to data_entries:", e);
          await insertIntoDataEntries(newEntry, dbType, dbStatus);
        }
      } else {
        try {
          const { error } = await supabase.from("villages").insert({
            id: newEntry.id,
            name: newEntry.nama,
            varieties: newEntry.namaLokal || "",
            image: newEntry.images[0] || "",
            description: newEntry.deskripsi,
            practices_count: 0,
            varieties_count: 0,
            conservation_status: "Aman",
            location_map_url: newEntry.lokasi.provinsi,
            latitude: newEntry.lokasi.koordinat ? newEntry.lokasi.koordinat.lat : null,
            longitude: newEntry.lokasi.koordinat ? newEntry.lokasi.koordinat.lng : null
          });
          if (error) throw error;
        } catch (e) {
          console.warn("Public villages table not available, falling back to data_entries:", e);
          await insertIntoDataEntries(newEntry, dbType, dbStatus);
        }
      }
      
      await fetchEntries();
    } catch (err) {
      console.error("Gagal menyimpan ke Supabase, data disimpan lokal:", err);
    }
  };

  const handleUpdateEntry = async (updatedEntry: DataEntry): Promise<void> => {
    // 1. Update local state
    setDataEntries((prev) =>
      prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)),
    );

    // 2. Sync to Supabase
    try {
      const dbType = updatedEntry.type === "Benih/Varietas" ? "benih_varietas" 
                   : updatedEntry.type === "Pengetahuan Adat" ? "pengetahuan_adat" 
                   : "desa";

      const dbStatus = updatedEntry.status === "Aktif" ? "aktif" 
                     : updatedEntry.status === "Ditolak" ? "ditolak" 
                     : updatedEntry.status === "Perlu Revisi" ? "perlu_revisi" 
                     : "verifikasi";

      if (updatedEntry.type === "Benih/Varietas") {
        try {
          const { error } = await supabase.from("varieties").update({
            name: updatedEntry.nama,
            village: updatedEntry.lokasi.kota,
            commodity: updatedEntry.kategori.replace("Benih ", ""),
            physicalDescription: updatedEntry.deskripsi,
            conservationStatus: updatedEntry.namaIlmiah || "Aman",
            altitude: updatedEntry.lokasi.deskripsiLokasi || "",
            landType: updatedEntry.lokasi.deskripsiLokasi || "",
            images: updatedEntry.images
          }).eq("id", updatedEntry.id);
          if (error) throw error;

          await supabase.from("mappins").update({
            label: `${updatedEntry.nama} (${updatedEntry.lokasi.kota})`,
            commodity: updatedEntry.kategori.replace("Benih ", ""),
            status: updatedEntry.namaIlmiah || "Aman",
            province: updatedEntry.lokasi.provinsi,
            ecosystem: updatedEntry.lokasi.deskripsiLokasi || "Sawah"
          }).eq("varietyId", updatedEntry.id);
        } catch (e) {
          console.warn("Public varieties table update failed, falling back to data_entries:", e);
          await updateDataEntries(updatedEntry, dbType, dbStatus);
        }
      } else if (updatedEntry.type === "Pengetahuan Adat") {
        try {
          const { error } = await supabase.from("articles").update({
            title: updatedEntry.nama,
            subtitle: updatedEntry.kategori,
            image: updatedEntry.images[0] || "",
            description: updatedEntry.deskripsi.substring(0, 150),
            content: updatedEntry.deskripsi,
            category: updatedEntry.kategori.replace("Pengetahuan ", ""),
            date: updatedEntry.tanggal,
            author_name: updatedEntry.namaNarasumber || "Kontributor Adat",
            is_verified: updatedEntry.status === "Aktif",
            variety_id: updatedEntry.varietasTerkait || ""
          }).eq("id", updatedEntry.id);
          if (error) throw error;
        } catch (e) {
          console.warn("Public articles table update failed, falling back to data_entries:", e);
          await updateDataEntries(updatedEntry, dbType, dbStatus);
        }
      } else {
        try {
          const { error } = await supabase.from("villages").update({
            name: updatedEntry.nama,
            varieties: updatedEntry.namaLokal || "",
            image: updatedEntry.images[0] || "",
            description: updatedEntry.deskripsi,
            location_map_url: updatedEntry.lokasi.provinsi,
            latitude: updatedEntry.lokasi.koordinat ? updatedEntry.lokasi.koordinat.lat : null,
            longitude: updatedEntry.lokasi.koordinat ? updatedEntry.lokasi.koordinat.lng : null
          }).eq("id", updatedEntry.id);
          if (error) throw error;
        } catch (e) {
          console.warn("Public villages table update failed, falling back to data_entries:", e);
          await updateDataEntries(updatedEntry, dbType, dbStatus);
        }
      }

      await fetchEntries();
    } catch (err) {
      console.error("Gagal memperbarui di Supabase, data disimpan lokal:", err);
    }
  };

  const handleValidateEntry = async (id: string, newStatus: string, rejectionReason?: string): Promise<void> => {
    // 1. Update local state
    setDataEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, status: newStatus, rejectionReason } : entry,
      ),
    );

    // 2. Sync to Supabase
    try {
      const dbStatus = newStatus === "Aktif" ? "aktif" 
                     : newStatus === "Ditolak" ? "ditolak" 
                     : newStatus === "Perlu Revisi" ? "perlu_revisi" 
                     : "verifikasi";

      const target = dataEntries.find(e => e.id === id);
      if (target) {
        if (target.type === "Pengetahuan Adat") {
          try {
            const { error } = await supabase.from("articles").update({
              is_verified: newStatus === "Aktif",
              rejection_reason: rejectionReason || null
            }).eq("id", id);
            if (error) throw error;
          } catch (e) {
            console.warn("Public articles validation failed, falling back to data_entries:", e);
            await validateDataEntries(id, dbStatus, rejectionReason);
          }
        } else if (target.type === "Benih/Varietas") {
          try {
            const { error } = await supabase.from("varieties").update({
              status: dbStatus
            }).eq("id", id);
            if (error) throw error;
          } catch (e) {
            console.warn("Public varieties validation failed, falling back to data_entries:", e);
            await validateDataEntries(id, dbStatus, rejectionReason);
          }
        } else {
          await validateDataEntries(id, dbStatus, rejectionReason);
        }
      } else {
        await validateDataEntries(id, dbStatus, rejectionReason);
      }

      await fetchEntries();
    } catch (err) {
      console.error("Gagal memvalidasi di Supabase, data disimpan lokal:", err);
    }
  };


  const handleDeleteEntry = async (id: string): Promise<void> => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini secara permanen?")) {
      setDataEntries((prev) => prev.filter((entry) => entry.id !== id));
      
      const target = dataEntries.find(e => e.id === id);
      try {
        if (target) {
          if (target.type === "Benih/Varietas") {
            try {
              await supabase.from("varieties").delete().eq("id", id);
              await supabase.from("mappins").delete().eq("varietyId", id);
            } catch (e) {
              await supabase.from("data_entries").delete().eq("id", id);
            }
          } else if (target.type === "Pengetahuan Adat") {
            try {
              await supabase.from("articles").delete().eq("id", id);
            } catch (e) {
              await supabase.from("data_entries").delete().eq("id", id);
            }
          } else {
            try {
              await supabase.from("villages").delete().eq("id", id);
            } catch (e) {
              await supabase.from("data_entries").delete().eq("id", id);
            }
          }
        } else {
          await supabase.from("data_entries").delete().eq("id", id);
        }
        await fetchEntries();
      } catch (err) {
        console.error("Gagal menghapus dari Supabase, data dihapus lokal:", err);
      }
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
          onDeleteEntry={handleDeleteEntry}
          setActiveEntryId={setActiveEntryId}
          dbConnectionStatus={dbConnectionStatus}
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
            onDeleteEntry={handleDeleteEntry}
            setActiveEntryId={setActiveEntryId}
            dbConnectionStatus={dbConnectionStatus}
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
              onDeleteEntry={handleDeleteEntry}
              setActiveEntryId={setActiveEntryId}
              dbConnectionStatus={dbConnectionStatus}
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
              onDeleteEntry={handleDeleteEntry}
              setActiveEntryId={setActiveEntryId}
              dbConnectionStatus={dbConnectionStatus}
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
              onDeleteEntry={handleDeleteEntry}
              setActiveEntryId={setActiveEntryId}
              dbConnectionStatus={dbConnectionStatus}
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
      case "notifications":
        return (
          <NotificationsPage
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationAsRead}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            onNavigate={navigate}
            setActiveEntryId={setActiveEntryId}
          />
        );
      case "messages":
        return (
          <MessagesPage
            messages={messages}
            onSendMessageReply={handleSendMessageReply}
            onNavigate={navigate}
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
      <Header
        currentPage={currentPage}
        user={user}
        onNavigate={navigate}
        unreadNotificationsCount={notifications.filter((n) => !n.isRead).length}
        unreadMessagesCount={messages.filter((m) => !m.isRead).length}
      />

      <main className="flex-grow flex flex-col w-full">{renderPage()}</main>

      <Footer />


    </div>
  );
}

export default App;
