import { createClient } from "@supabase/supabase-js";

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!rawSupabaseUrl || !rawSupabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Cek file .env");
}

const cleanSupabaseUrl = rawSupabaseUrl
  .replace(/['"]/g, "")
  .trim()
  .replace(/\/$/, "");
const cleanSupabaseAnonKey = rawSupabaseAnonKey.replace(/['"]/g, "").trim();

export const supabase = createClient(cleanSupabaseUrl, cleanSupabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type UserRole =
  | "administrator"
  | "masyarakat_adat"
  | "pakar"
  | "penyuluh"
  | "fasilitator";

export type EntryType = "benih_varietas" | "pengetahuan_adat" | "desa";
export type EntryStatus = "aktif" | "verifikasi" | "ditolak";

export interface Profile {
  id: string;
  nama_depan: string;
  nama_belakang: string | null;
  nama_lengkap: string;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  email: string;
  username: string | null;
  role: UserRole;
  status_aktif: boolean;
  wajib_ganti_password: boolean;
  avatar_url: string | null;
  catatan_admin: string | null;
  created_at: string;
  updated_at: string;
}

export interface DataEntry {
  id: string;
  type: EntryType;
  status: EntryStatus;
  kategori: string | null;
  nama: string;
  tanggal: string | null;
  kota_kabupaten: string | null;
  provinsi: string | null;
  deskripsi_lokasi: string | null;
  lat: number | null;
  lng: number | null;
  deskripsi: string | null;
  fpic_doc_path: string | null;

  nama_lokal: string | null;
  nama_ilmiah: string | null;
  nama_penemu: string | null;
  conservation_status: string | null;
  altitude: string | null;
  land_type: string | null;
  rainfall: string | null;

  judul_pengetahuan: string | null;
  varietas_terkait: string | null;
  wilayah_asal: string | null;
  nama_narasumber: string | null;

  created_by: string | null;
  validated_by: string | null;
  validated_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;

  entry_images?: EntryImage[];
  profiles?: Profile;
}

export interface EntryImage {
  id: string;
  entry_id: string;
  storage_path: string;
  is_main: boolean;
  sort_order: number;
  created_at: string;
}
