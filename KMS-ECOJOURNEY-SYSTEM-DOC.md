# KMS Ecojourney — System Analysis & Development Prompt Guide
> Dokumen ini berisi konteks lengkap proyek dan kumpulan prompt siap pakai.
> Paste bagian **MASTER PROMPT** di awal setiap sesi AI untuk hasil terbaik.

---

## DAFTAR ISI
1. [Project Identity](#1-project-identity)
2. [Architecture Overview](#2-architecture-overview)
3. [Tech Stack](#3-tech-stack)
4. [Database Schema](#4-database-schema)
5. [Role & Permission Matrix](#5-role--permission-matrix)
6. [Business Workflows](#6-business-workflows)
7. [Storage Structure](#7-storage-structure)
8. [Frontend Structure](#8-frontend-structure)
9. [Status Implementasi](#9-status-implementasi)
10. [Key Code Patterns](#10-key-code-patterns)
11. [MASTER PROMPT](#11-master-prompt)
12. [Prompt Catalog per Fitur](#12-prompt-catalog-per-fitur)

---

## 1. Project Identity

| Atribut | Detail |
|---|---|
| **Nama Proyek** | KMS Ecojourney — Knowledge Management System SDG Pertanian |
| **Institusi** | CDC UI (Center for Development and Community Engagement, Universitas Indonesia) |
| **Tujuan** | Mendokumentasikan dan mempublikasikan pengetahuan tentang benih/varietas lokal, pengetahuan adat pertanian, dan desa konservasi di Indonesia |
| **Backend** | Supabase (PostgreSQL + Auth + Storage + RLS) |
| **Repo Kelola** | `kms-ecojourney-kelola-main` — Admin/internal dashboard |
| **Repo Publik** | `kms-ecojourney-publik-main` — Situs publik read-only |

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         SUPABASE PROJECT                        │
│                       "Eco Journey"                             │
│                                                                 │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────────────┐ │
│  │   AUTH   │  │   DATABASE   │  │         STORAGE           │ │
│  │          │  │              │  │                           │ │
│  │ Email/PW │  │ profiles     │  │ entry-images   (public)   │ │
│  │ Sessions │  │ data_entries │  │ fpic-documents (private)  │ │
│  │ JWT      │  │ entry_images │  │ avatars        (public)   │ │
│  └──────────┘  │ local_pract. │  └───────────────────────────┘ │
│                │ calendar_ev. │                                 │
│                └──────────────┘                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  ROW LEVEL SECURITY                     │   │
│  │ anon → read aktif only | authenticated → role-based     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
          ▲                                    ▲
          │                                    │
┌─────────────────┐                  ┌─────────────────────┐
│   KMS KELOLA    │                  │     KMS PUBLIK      │
│ React + TS      │                  │  React + JS         │
│ Tailwind v4     │                  │  Tailwind v3        │
│ Vite            │                  │  Vite               │
│                 │                  │                     │
│ Auth required   │                  │ No auth (anon)      │
│ CRUD + Admin    │                  │ Read-only public    │
│ Validasi data   │                  │ data only           │
└─────────────────┘                  └─────────────────────┘
```

---

## 3. Tech Stack

### kms-ecojourney-kelola (Admin Dashboard)
| Layer | Library | Version |
|---|---|---|
| Framework | React | 19.x |
| Language | TypeScript | 5.7.x |
| Styling | Tailwind CSS | v4 (via `@tailwindcss/vite`) |
| Build | Vite | 8.x |
| Icons | lucide-react | 1.17.x |
| Backend Client | @supabase/supabase-js | latest |
| Routing | State-based (custom `navigate()` in App.tsx) — **bukan react-router-dom** |
| Form | Controlled components (useState per field) |
| Rich Text | RichTextEditor custom component (`src/components/RichTextEditor.tsx`) |
| Map | MapLocator custom component (`src/components/MapLocator.tsx`) |
| Image Crop | CropImageModal custom component (`src/components/CropImageModal.tsx`) |

### kms-ecojourney-publik (Public Site)
| Layer | Library | Version |
|---|---|---|
| Framework | React | 19.x |
| Language | JavaScript (JSX) | — |
| Styling | Tailwind CSS | v3 |
| Build | Vite | 8.x |
| Icons | lucide-react | 0.475.x |
| Backend Client | @supabase/supabase-js | latest |
| Routing | State-based (custom `setCurrentRoute()` in App.jsx) — **bukan react-router-dom** |

---

## 4. Database Schema

> Supabase Project: "Eco Journey" | Region: Southeast Asia (Singapore)

### 4.1 Custom Types (Enum)

```sql
user_role:            administrator | masyarakat_adat | pakar | penyuluh | fasilitator
entry_type:           benih_varietas | pengetahuan_adat | desa
entry_status:         aktif | verifikasi | ditolak
conservation_status:  aman | langka | terancam | sangat_terancam
calendar_event_type:  tanam | pupuk | panen | audit | quotes | giveaway | reel | lainnya
```

### 4.2 Tabel `profiles`
> Extends `auth.users`. Auto-created via trigger `on_auth_user_created`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | FK → auth.users(id) ON DELETE CASCADE |
| `nama_depan` | TEXT NOT NULL | — |
| `nama_belakang` | TEXT | nullable |
| `nama_lengkap` | TEXT GENERATED | `TRIM(nama_depan \|\| ' ' \|\| nama_belakang)` |
| `tempat_lahir` | TEXT | nullable |
| `tanggal_lahir` | DATE | nullable |
| `email` | TEXT UNIQUE NOT NULL | — |
| `username` | TEXT UNIQUE | nullable, format: `@username` |
| `role` | user_role | DEFAULT `masyarakat_adat` |
| `status_aktif` | BOOLEAN | DEFAULT TRUE |
| `wajib_ganti_password` | BOOLEAN | DEFAULT FALSE |
| `avatar_url` | TEXT | nullable, path di Storage bucket `avatars` |
| `catatan_admin` | TEXT | nullable, field "Ask to do something" |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | auto-updated via trigger |

### 4.3 Tabel `data_entries`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | gen_random_uuid() |
| `type` | entry_type NOT NULL | benih_varietas / pengetahuan_adat / desa |
| `status` | entry_status | DEFAULT `verifikasi` |
| `kategori` | TEXT | nullable |
| `nama` | TEXT NOT NULL | nama varietas / judul desa |
| `tanggal` | DATE | tanggal penemuan / publikasi |
| `kota_kabupaten` | TEXT | nullable |
| `provinsi` | TEXT | nullable |
| `deskripsi_lokasi` | TEXT | nullable |
| `lat` | DOUBLE PRECISION | nullable |
| `lng` | DOUBLE PRECISION | nullable |
| `deskripsi` | TEXT | HTML rich text dari RichTextEditor |
| `fpic_doc_path` | TEXT | Storage path PDF dokumen FPIC |
| `nama_lokal` | TEXT | *Benih only* |
| `nama_ilmiah` | TEXT | *Benih only* |
| `nama_penemu` | TEXT | *Benih only* |
| `conservation_status` | conservation_status | *Benih only* (publik detail) |
| `altitude` | TEXT | *Benih only*, ex: "500 Mdpl" |
| `land_type` | TEXT | *Benih only*, ex: "Sawah Tadah Hujan" |
| `rainfall` | TEXT | *Benih only*, ex: "Tinggi" |
| `judul_pengetahuan` | TEXT | *Pengetahuan only* |
| `varietas_terkait` | TEXT | *Pengetahuan only* |
| `wilayah_asal` | TEXT | *Pengetahuan only* |
| `nama_narasumber` | TEXT | *Pengetahuan only* |
| `created_by` | UUID | FK → profiles(id) ON DELETE SET NULL |
| `validated_by` | UUID | FK → profiles(id) ON DELETE SET NULL |
| `validated_at` | TIMESTAMPTZ | nullable |
| `rejection_reason` | TEXT | nullable |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | auto-updated via trigger |

### 4.4 Tabel `entry_images`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | gen_random_uuid() |
| `entry_id` | UUID NOT NULL | FK → data_entries(id) ON DELETE CASCADE |
| `storage_path` | TEXT NOT NULL | path di bucket `entry-images` |
| `is_main` | BOOLEAN | DEFAULT FALSE, UNIQUE per entry_id |
| `sort_order` | INTEGER | DEFAULT 0 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |

### 4.5 Tabel `local_practices`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | gen_random_uuid() |
| `entry_id` | UUID NOT NULL | FK → data_entries(id) ON DELETE CASCADE |
| `title` | TEXT NOT NULL | judul praktik lokal |
| `description` | TEXT | nullable |
| `image_path` | TEXT | nullable, path di Storage |
| `sort_order` | INTEGER | DEFAULT 0 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |

### 4.6 Tabel `calendar_events`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | gen_random_uuid() |
| `entry_id` | UUID | nullable, FK → data_entries(id) ON DELETE CASCADE |
| `day_of_month` | INTEGER | CHECK 1–31 |
| `month` | INTEGER | nullable, CHECK 1–12 |
| `year` | INTEGER | nullable |
| `label` | TEXT NOT NULL | — |
| `type` | calendar_event_type | DEFAULT `lainnya` |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |

### 4.7 Helper Functions

```sql
get_my_role()              -- Returns current user's role as TEXT
is_admin_or_fasilitator()  -- Returns BOOLEAN, used in RLS policies
update_updated_at_column() -- Trigger function for updated_at
handle_new_user()          -- Trigger: auto-create profile on signup
```

---

## 5. Role & Permission Matrix

| Aksi | administrator | fasilitator | pakar | penyuluh | masyarakat_adat | anon |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Login ke kelola | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Baca data `aktif` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Baca semua data | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Tambah data entry baru | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit data entry milik sendiri | ✅ | ✅ | ✅ | ✅ | ✅* | ❌ |
| Validasi / Tolak data | ✅ | ✅ | ❌** | ❌** | ❌ | ❌ |
| Hapus data entry | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lihat halaman Manajemen Akun | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Tambah / Edit akun user | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Hapus akun user | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Upload gambar/FPIC | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Akses FPIC documents (private) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

*) `masyarakat_adat` hanya bisa edit miliknya sendiri selama status masih `verifikasi`
**) Tergantung keputusan tim — lihat catatan Gap 2 di setup notes

### Halaman Kelola per Role

| Halaman | administrator | fasilitator | pakar | penyuluh | masyarakat_adat |
|---|:---:|:---:|:---:|:---:|:---:|
| Landing | ✅ | ✅ | ✅ | ✅ | ✅ |
| Login / Signup | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Profil | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tambah Benih | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tambah Pengetahuan | ✅ | ✅ | ✅ | ✅ | ✅ |
| Validasi Data | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manajemen Akun | ✅ | ❌ | ❌ | ❌ | ❌ |
| Tambah / Edit Akun | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 6. Business Workflows

### 6.1 Alur Submisi Data
```
User (any role)
  → Login ke kelola
  → Tambah Data (AddBenihPage / AddPengetahuanPage)
  → Upload foto + FPIC dokumen
  → Data masuk ke DB dengan status: "verifikasi"
  → Muncul di Dashboard dengan badge "Verifikasi"

Administrator / Fasilitator
  → Klik data di Dashboard
  → Buka ValidasiDataPage
  → Review semua detail + foto + FPIC
  → Klik "Setujui" → status berubah jadi "aktif"
     ATAU
  → Klik "Tolak" → status berubah jadi "ditolak"

Data dengan status "aktif"
  → Otomatis muncul di kms-publik
  → (RLS anon hanya baca status='aktif')
```

### 6.2 Alur Auth
```
Signup (SignUpPage)
  → supabase.auth.signUp({ email, password, data: { nama_depan, role } })
  → Trigger handle_new_user() otomatis buat row di profiles
  → User bisa login

Login (LoginPage)
  → supabase.auth.signInWithPassword({ email, password })
  → Fetch profile dari tabel profiles
  → Simpan user state di App.tsx (name, email, role, username)
  → Navigate ke dashboard

Restore Session (App.tsx useEffect)
  → supabase.auth.getSession()
  → Jika ada session, fetch profile
  → Restore user state

Logout
  → supabase.auth.signOut()
  → Clear user state
  → Navigate ke landing
```

### 6.3 Alur Upload File
```
Gambar:
  → Upload ke Storage bucket: entry-images
  → Path: {user_id}/{entry_id}/image_{index}.jpg
  → Insert row ke entry_images dengan storage_path
  → Untuk display: supabase.storage.from('entry-images').getPublicUrl(path)

FPIC Dokumen:
  → Upload ke Storage bucket: fpic-documents (PRIVATE)
  → Path: {user_id}/{entry_id}/fpic.pdf
  → Update kolom fpic_doc_path di data_entries
  → Untuk download: supabase.storage.from('fpic-documents').createSignedUrl(path, 3600)

Avatar:
  → Upload ke Storage bucket: avatars
  → Path: {user_id}/avatar.jpg
  → Update kolom avatar_url di profiles
```

---

## 7. Storage Structure

```
Supabase Storage
│
├── entry-images/          [PUBLIC BUCKET]
│   └── {user_id}/
│       └── {entry_id}/
│           ├── image_0.jpg   ← main image (is_main: true)
│           ├── image_1.jpg
│           └── image_2.jpg
│
├── fpic-documents/        [PRIVATE BUCKET]
│   └── {user_id}/
│       └── {entry_id}/
│           └── fpic.pdf
│
└── avatars/               [PUBLIC BUCKET]
    └── {user_id}/
        └── avatar.jpg
```

---

## 8. Frontend Structure

### 8.1 kms-kelola Pages & Routing

Routing menggunakan custom state `currentPage` di `App.tsx` dengan fungsi `navigate(page: string)`.

| Route Key | Komponen | Akses |
|---|---|---|
| `landing` | `LandingPage` | Public |
| `login` | `LoginPage` | Public |
| `signup` | `SignUpPage` | Public |
| `dashboard` | `DashboardPage` | Auth required |
| `profile` | `ProfilePage` | Auth required |
| `manage-accounts` | `ManageAccountsPage` | Admin only |
| `add-account` | `AddAccountPage` | Admin only |
| `edit-account` | `EditAccountPage` | Admin only |
| `add-data-benih` | `AddBenihPage` | Auth required |
| `add-data-pengetahuan` | `AddPengetahuanPage` | Auth required |
| `validasi-data` | `ValidasiDataPage` | Admin + Fasilitator |

**Shared State di App.tsx:**
- `user: User | null` — logged in user info
- `accounts: Account[]` — daftar user accounts
- `dataEntries: DataEntry[]` — daftar semua data entry
- `editingAccountId: string | null` — ID akun yang sedang diedit
- `activeEntryId: string | null` — ID entry yang sedang divalidasi

**Interface Types (App.tsx):**
```typescript
interface User {
  name: string;
  email: string;
  role: string;
  username: string;
}

interface Account {
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

interface DataEntry {
  id: string;
  type: 'Desa' | 'Pengetahuan Adat' | 'Benih/Varietas';
  nama: string;
  kategori: string;
  status: string; // 'Aktif' | 'Verifikasi' | 'Ditolak'
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
```

**Komponen Shared:**
- `Header` — adaptive header (tampilan berbeda tiap halaman)
- `Footer` — global footer
- `RichTextEditor` — rich text editor untuk deskripsi
- `MapLocator` — komponen input koordinat dengan peta
- `CropImageModal` — modal crop foto sebelum upload

### 8.2 kms-publik Pages & Routing

Routing menggunakan `currentRoute` state di `App.jsx`.

| Route | Komponen | Sumber Data |
|---|---|---|
| `home` | `Home` | stats, featured villages, artikel terbaru |
| `varietas` | `Varietas` | list benih_varietas status=aktif |
| `detail-{id}` | `DetailVarietas` | single entry + images + local_practices + calendar |
| `peta` | `PetaSebaran` | semua benih_varietas dengan lat/lng |
| `pengetahuan` | `Pengetahuan` | list pengetahuan_adat status=aktif |

**Data Mock yang Perlu Diganti:**
- `VARITIES_DATA` → query `data_entries` type=benih_varietas, status=aktif
- `ARTICLES_DATA` → query `data_entries` type=pengetahuan_adat, status=aktif
- `STATS_DATA` → count queries dari data_entries + profiles
- `FEATURED_VILLAGES` → query `data_entries` type=desa, status=aktif, limit 3

---

## 9. Status Implementasi

### ✅ Sudah Selesai (Supabase Setup)
- [x] Supabase project dibuat (region: Singapore)
- [x] Custom enum types dibuat
- [x] Semua tabel dibuat dengan relasi dan constraints
- [x] Trigger `handle_new_user` untuk auto-create profile
- [x] Trigger `update_updated_at_column` untuk semua tabel
- [x] Helper functions `get_my_role()` dan `is_admin_or_fasilitator()`
- [x] RLS diaktifkan di semua tabel
- [x] RLS policies untuk `profiles` (+ patch read semua user)
- [x] RLS policies untuk `data_entries`
- [x] RLS policies untuk `entry_images`, `local_practices`, `calendar_events`
- [x] Storage bucket `entry-images` (public)
- [x] Storage bucket `fpic-documents` (private)
- [x] Storage bucket `avatars` (public)
- [x] Storage policies untuk semua bucket
- [x] Auth: Email provider aktif
- [x] Auth: URL Configuration (Site URL + Redirect URLs)
- [x] `@supabase/supabase-js` diinstall di kelola
- [x] `src/lib/supabase.ts` dibuat di kelola
- [x] `src/vite-env.d.ts` dibuat di kelola
- [x] `.env` diisi di kelola
- [ ] `@supabase/supabase-js` diinstall di publik
- [ ] `src/lib/supabase.js` dibuat di publik
- [ ] `.env` diisi di publik

### ❌ Belum Dikerjakan (Integrasi Frontend)
- [ ] Auth: Login di LoginPage.tsx → Supabase
- [ ] Auth: Signup di SignUpPage.tsx → Supabase
- [ ] Auth: Session restore di App.tsx useEffect
- [ ] Auth: Logout di ProfilePage.tsx
- [ ] Dashboard: Fetch data_entries dari Supabase
- [ ] Dashboard: Toggle status (aktif ↔ verifikasi)
- [ ] Dashboard: Delete entry
- [ ] AddBenihPage: Submit form → insert ke Supabase + upload gambar + FPIC
- [ ] AddPengetahuanPage: Submit form → insert ke Supabase + upload gambar + FPIC
- [ ] ValidasiDataPage: Approve/Tolak → update status di Supabase
- [ ] ManageAccountsPage: Fetch profiles dari Supabase
- [ ] AddAccountPage: Create user via Edge Function
- [ ] EditAccountPage: Update profile di Supabase
- [ ] ProfilePage: Fetch + update profile sendiri
- [ ] Role-based routing guard di App.tsx
- [ ] Publik Home: Ganti STATS_DATA dengan count query
- [ ] Publik Varietas: Ganti VARITIES_DATA dengan Supabase query
- [ ] Publik DetailVarietas: Fetch single entry + related data
- [ ] Publik PetaSebaran: Fetch entries dengan koordinat
- [ ] Publik Pengetahuan: Ganti ARTICLES_DATA dengan Supabase query

---

## 10. Key Code Patterns

### Pattern A — Supabase Client (kelola, sudah ada di src/lib/supabase.ts)
```typescript
import { supabase } from '../lib/supabase'
```

### Pattern B — Get Current User + Profile
```typescript
const { data: { user } } = await supabase.auth.getUser()
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()
```

### Pattern C — Query Data Entries dengan Join
```typescript
const { data, error } = await supabase
  .from('data_entries')
  .select(`
    *,
    entry_images (id, storage_path, is_main, sort_order),
    profiles!created_by (nama_lengkap, role)
  `)
  .order('created_at', { ascending: false })
```

### Pattern D — Insert Entry + Upload Gambar
```typescript
// 1. Insert entry
const { data: entry } = await supabase
  .from('data_entries')
  .insert({ ...fields, created_by: user.id })
  .select().single()

// 2. Upload gambar
const blob = await fetch(base64String).then(r => r.blob())
await supabase.storage.from('entry-images')
  .upload(`${user.id}/${entry.id}/image_0.jpg`, blob)

// 3. Insert image record
await supabase.from('entry_images').insert({
  entry_id: entry.id,
  storage_path: `${user.id}/${entry.id}/image_0.jpg`,
  is_main: true, sort_order: 0
})
```

### Pattern E — Get Public URL dari Storage
```typescript
const { data } = supabase.storage
  .from('entry-images')
  .getPublicUrl(storagePath)
const url = data.publicUrl
```

### Pattern F — Validasi Entry
```typescript
await supabase.from('data_entries').update({
  status: 'aktif', // atau 'ditolak'
  validated_by: user.id,
  validated_at: new Date().toISOString(),
}).eq('id', entryId)
```

### Pattern G — Role Guard di renderPage()
```typescript
case 'manage-accounts':
  if (user?.role !== 'administrator') return <Navigate to="dashboard" />
  return <ManageAccountsPage ... />
```

### Pattern H — Mapping Supabase → Frontend Interface
```typescript
// Supabase snake_case → Frontend camelCase (DataEntry interface di App.tsx)
const mapped: DataEntry = {
  id: row.id,
  type: row.type === 'benih_varietas' ? 'Benih/Varietas' 
      : row.type === 'pengetahuan_adat' ? 'Pengetahuan Adat' : 'Desa',
  nama: row.nama,
  status: row.status === 'aktif' ? 'Aktif'
        : row.status === 'verifikasi' ? 'Verifikasi' : 'Ditolak',
  lokasi: {
    kota: row.kota_kabupaten ?? '',
    provinsi: row.provinsi ?? '',
    deskripsiLokasi: row.deskripsi_lokasi ?? '',
    koordinat: row.lat && row.lng ? { lat: row.lat, lng: row.lng } : null,
  },
  images: row.entry_images
    ?.sort((a, b) => a.sort_order - b.sort_order)
    .map(img => supabase.storage.from('entry-images').getPublicUrl(img.storage_path).data.publicUrl)
    ?? [],
  // ... dst
}
```

---

## 11. MASTER PROMPT

> 📋 **Copy-paste seluruh blok ini di awal setiap sesi AI baru.**
> Cocok untuk Claude, ChatGPT, Gemini, Cursor, Windsurf, atau AI apapun.

---

```
Kamu adalah senior full-stack developer yang membantu saya mengembangkan proyek KMS Ecojourney.

=== KONTEKS PROYEK ===
KMS Ecojourney adalah Knowledge Management System untuk SDG Pertanian milik CDC UI.
Tujuan: mendokumentasikan benih/varietas lokal, pengetahuan adat pertanian, dan desa konservasi di Indonesia.

=== DUA REPO FRONTEND ===
1. kms-ecojourney-kelola: Admin dashboard (React 19 + TypeScript + Tailwind v4 + Vite)
   - Routing: state-based via currentPage + navigate() di App.tsx (BUKAN react-router-dom)
   - Semua halaman: Landing, Login, Signup, Dashboard, Profile, ManageAccounts,
     AddAccount, EditAccount, AddBenih, AddPengetahuan, ValidasiData
   - Supabase client sudah ada di: src/lib/supabase.ts
   - Import: import { supabase } from '../lib/supabase'

2. kms-ecojourney-publik: Situs publik read-only (React 19 + JSX + Tailwind v3 + Vite)
   - Routing: state-based via currentRoute + setCurrentRoute() di App.jsx
   - Halaman: Home, Varietas, DetailVarietas, PetaSebaran, Pengetahuan
   - Saat ini masih pakai mockData.js, perlu diganti dengan Supabase query

=== BACKEND: SUPABASE ===
Backend 100% Supabase. Sudah setup:
- Auth: Email/Password
- Tabel: profiles, data_entries, entry_images, local_practices, calendar_events
- Storage: entry-images (public), fpic-documents (private), avatars (public)
- RLS: aktif di semua tabel

=== 5 ROLE USER ===
administrator | fasilitator | pakar | penyuluh | masyarakat_adat

=== 3 TIPE DATA ENTRY ===
benih_varietas | pengetahuan_adat | desa

=== 3 STATUS ENTRY ===
verifikasi (default) → aktif (approved) / ditolak (rejected)

=== SCHEMA TABEL UTAMA ===

profiles: id (UUID, FK auth.users), nama_depan, nama_belakang, nama_lengkap (generated),
  tempat_lahir, tanggal_lahir, email, username, role (enum), status_aktif, 
  wajib_ganti_password, avatar_url, catatan_admin, created_at, updated_at

data_entries: id, type (enum), status (enum), kategori, nama, tanggal,
  kota_kabupaten, provinsi, deskripsi_lokasi, lat, lng, deskripsi (HTML),
  fpic_doc_path,
  [benih] nama_lokal, nama_ilmiah, nama_penemu, conservation_status, altitude, land_type, rainfall,
  [pengetahuan] judul_pengetahuan, varietas_terkait, wilayah_asal, nama_narasumber,
  created_by (FK profiles), validated_by (FK profiles), validated_at, rejection_reason,
  created_at, updated_at

entry_images: id, entry_id (FK), storage_path, is_main, sort_order, created_at

local_practices: id, entry_id (FK), title, description, image_path, sort_order, created_at

calendar_events: id, entry_id (FK), day_of_month, month, year, label, type (enum), created_at

=== PERMISSION ===
- anon: hanya baca data_entries WHERE status = 'aktif'
- authenticated: baca semua data
- masyarakat_adat/pakar/penyuluh/fasilitator: bisa tambah entry, edit milik sendiri
- fasilitator + administrator: bisa validasi (ubah status)
- administrator: full CRUD termasuk hapus dan manage accounts

=== INTERFACE YANG SUDAH ADA (App.tsx) ===
User { name, email, role, username }
Account { id, namaDepan, namaBelakang, namaLengkap, tempatLahir, tanggalLahir,
          email, username, role, statusAktif, wajibGantiPassword, avatar }
DataEntry { id, type ('Desa'|'Pengetahuan Adat'|'Benih/Varietas'), nama, kategori,
            status ('Aktif'|'Verifikasi'|'Ditolak'), tanggal,
            lokasi { kota, provinsi, deskripsiLokasi, koordinat {lat,lng}|null },
            deskripsi, images[], fpicDoc, namaLokal?, namaIlmiah?, namaPenemu?,
            judulPengetahuan?, varietasTerkait?, wilayahAsal?, namaNarasumber? }

PENTING: Interface frontend pakai PascalCase/camelCase dan nilai status dalam Bahasa Indonesia
("Aktif", "Verifikasi", "Ditolak"), sedangkan Supabase pakai snake_case dan enum lowercase
("aktif", "verifikasi", "ditolak"). Selalu lakukan mapping saat fetch dari Supabase.

=== CONVENTIONS ===
- Selalu gunakan async/await (bukan .then() kecuali di useEffect fire-and-forget)
- Error handling: tampilkan pesan error ke user, jangan silent fail
- Loading state: selalu ada indicator loading saat fetch
- TypeScript: gunakan proper types, hindari 'any'
- File Supabase kelola: src/lib/supabase.ts
- File Supabase publik: src/lib/supabase.js

Sekarang bantu saya dengan:
[TULIS PERMINTAAN SPESIFIK DI SINI]
```

---

## 12. Prompt Catalog per Fitur

Gunakan prompt-prompt ini **setelah** paste Master Prompt di atas.
Atau bisa juga langsung paste standalone jika konteksnya sudah ada.

---

### 🔐 PROMPT — Auth Integration (Login, Signup, Session)

```
Bantu saya mengintegrasikan Auth Supabase ke kms-kelola.
Yang perlu dikerjakan:

1. LoginPage.tsx: ganti fungsi submit handler dengan supabase.auth.signInWithPassword,
   fetch profile setelah login, panggil onLoginSuccess dengan data User yang sudah di-mapping.

2. SignUpPage.tsx: ganti fungsi submit dengan supabase.auth.signUp,
   sertakan metadata { nama_depan, role: 'masyarakat_adat' }.

3. App.tsx: tambahkan useEffect untuk restore session saat pertama load
   menggunakan supabase.auth.getSession(), dan subscribe onAuthStateChange.

4. ProfilePage.tsx / App.tsx: ganti handleLogout dengan supabase.auth.signOut().

Berikan kode lengkap siap paste untuk setiap file tersebut.
Perhatikan bahwa Supabase pakai snake_case, frontend pakai camelCase/PascalCase — lakukan mapping.
```

---

### 📊 PROMPT — Dashboard Data Fetch

```
Bantu saya mengganti state mock dataEntries di DashboardPage.tsx (kms-kelola)
dengan fetch dari Supabase.

Yang dibutuhkan:
1. Fetch semua data_entries dengan join ke entry_images dan profiles (nama pembuat)
2. Map hasil Supabase (snake_case, status lowercase) ke interface DataEntry (camelCase, status Bahasa Indonesia)
3. Untuk images: generate public URL dari storage_path menggunakan getPublicUrl
4. Tambahkan loading state dan error handling
5. Handle realtime update (opsional tapi bagus): subscribe ke perubahan tabel data_entries

Interface DataEntry yang sudah ada di App.tsx:
[paste interface DataEntry dari section 8.1 di atas]

Berikan kode lengkap untuk DashboardPage.tsx atau hook terpisah useDataEntries().
```

---

### 📝 PROMPT — Form Submit (AddBenihPage / AddPengetahuanPage)

```
Bantu saya mengintegrasikan submit form AddBenihPage.tsx (kms-kelola) ke Supabase.

Flow yang dibutuhkan:
1. Get current user dari supabase.auth.getUser()
2. Insert ke tabel data_entries dengan semua field benih (type: 'benih_varietas', status: 'verifikasi')
3. Upload foto-foto (state uploadedImages berisi base64 strings) ke Storage bucket 'entry-images'
   Path format: {user_id}/{entry_id}/image_{index}.jpg
4. Insert rows ke entry_images untuk setiap foto (is_main: true untuk index selectedMainImageIndex)
5. Upload file FPIC (fpicFileName) ke bucket 'fpic-documents'
   Path format: {user_id}/{entry_id}/fpic.pdf
6. Update fpic_doc_path di data_entries setelah upload
7. Panggil onAddEntry(mappedEntry) dengan DataEntry yang sudah di-mapping ke format frontend
8. Navigate ke dashboard

Tambahkan loading state selama proses upload (bisa lama jika ada banyak foto).
Berikan kode lengkap siap paste.
```

---

### ✅ PROMPT — Validasi Data

```
Bantu saya mengintegrasikan ValidasiDataPage.tsx (kms-kelola) ke Supabase.

Yang dibutuhkan:
1. Ganti fungsi handleApprove (Setujui) dan handleReject (Tolak)
2. Update tabel data_entries: set status, validated_by (user.id), validated_at (now)
3. Untuk tolak: juga simpan rejection_reason jika ada input alasan penolakan di UI
4. Setelah berhasil: panggil onValidateEntry(id, newStatus) lalu navigate ke dashboard
5. Tampilkan loading state selama proses
6. Handle error: jika gagal, tampilkan pesan error, jangan navigate

Saat ini onValidateEntry menerima status dalam format: 'Aktif' atau 'Ditolak' (Bahasa Indonesia).
Pastikan mapping ke format Supabase enum: 'aktif' atau 'ditolak'.
```

---

### 👥 PROMPT — Manajemen Akun

```
Bantu saya mengintegrasikan halaman ManageAccountsPage, AddAccountPage, 
dan EditAccountPage (kms-kelola) ke Supabase.

Yang dibutuhkan:

ManageAccountsPage:
- Fetch semua profiles dari Supabase, map ke interface Account
- Toggle statusAktif: update kolom status_aktif di profiles
- Delete: delete dari profiles (akan cascade ke auth.users? tidak — perlu hapus auth.users juga)
  Untuk delete user sepenuhnya, perlu Edge Function karena butuh service_role key.
  Sementara ini: cukup set status_aktif = false sebagai "soft delete".

AddAccountPage:
- Membuat user baru butuh service_role key (tidak boleh di frontend)
- Buat Supabase Edge Function 'create-user' sebagai proxy
- Frontend memanggil: supabase.functions.invoke('create-user', { body: {...} })

EditAccountPage:
- Update profile (semua field kecuali email yang perlu auth flow tersendiri)
- Gunakan: supabase.from('profiles').update({...}).eq('id', account.id)

Berikan kode lengkap untuk semua file dan Edge Function jika diperlukan.
```

---

### 🌐 PROMPT — Publik Site Integration

```
Bantu saya mengganti semua mockData.js di kms-publik dengan Supabase queries.
Supabase client ada di src/lib/supabase.js.

Halaman yang perlu diintegrasikan:

1. Home.jsx: 
   - STATS_DATA → count queries: total benih aktif, total desa aktif, total pengetahuan aktif, total profiles
   - FEATURED_VILLAGES → 3 data_entries type='desa' status='aktif' terbaru
   - Artikel terbaru → 3 data_entries type='pengetahuan_adat' status='aktif' terbaru

2. Varietas.jsx:
   - VARITIES_DATA → query data_entries type='benih_varietas', status='aktif'
   - Include join entry_images
   - Map ke struktur yang dipakai komponen (id, name, village, commodity, images[], dll)

3. DetailVarietas.jsx:
   - Single query by ID: data_entries + entry_images + local_practices + calendar_events
   - Map ke struktur detail yang dipakai komponen

4. PetaSebaran.jsx:
   - Query data_entries type='benih_varietas', status='aktif', WHERE lat IS NOT NULL AND lng IS NOT NULL
   - Map ke format pin peta yang ada

5. Pengetahuan.jsx:
   - ARTICLES_DATA → query data_entries type='pengetahuan_adat', status='aktif'
   - Map ke struktur article (id, title, image, description, category, date, author)

Berikan kode untuk semua file tersebut dengan loading state dan error handling.
```

---

### 🛡️ PROMPT — Role-Based UI Guard

```
Bantu saya menambahkan role-based routing guard di App.tsx (kms-kelola).

Yang dibutuhkan:
1. Di fungsi renderPage(), sebelum render halaman sensitif, 
   cek apakah user.role memiliki akses.
2. Jika tidak punya akses, redirect ke dashboard atau tampilkan halaman "Akses Ditolak".
3. Juga sembunyikan menu navigasi yang tidak relevan per role di Header.tsx.

Permission yang perlu diimplementasikan:
- manage-accounts, add-account, edit-account → administrator only
- validasi-data → administrator DAN fasilitator
- add-data-benih, add-data-pengetahuan → semua role kecuali tidak ada restriction
- dashboard, profile → semua authenticated user

User state ada di App.tsx: user: User | null dengan field role: string
Role values dari Supabase: 'administrator' | 'fasilitator' | 'pakar' | 'penyuluh' | 'masyarakat_adat'

Berikan kode lengkap untuk guard di renderPage() dan perubahan Header.tsx jika diperlukan.
```

---

### 🐛 PROMPT — Debug / Fix Error

```
Saya mengalami error di proyek KMS Ecojourney (kms-kelola/kms-publik).

Tech stack: React 19 + TypeScript (kelola) / React 19 + JSX (publik) + Supabase + Tailwind + Vite
Routing: state-based (bukan react-router)
Supabase client: src/lib/supabase.ts (kelola) / src/lib/supabase.js (publik)

Error yang terjadi:
[PASTE ERROR MESSAGE]

File yang bermasalah:
[PASTE NAMA FILE]

Kode yang bermasalah:
[PASTE KODE]

Konteks tambahan:
[JELASKAN APA YANG SEDANG DICOBA DILAKUKAN]

Tolong analisis penyebab error dan berikan solusi lengkap.
```

---

### 🆕 PROMPT — Tambah Fitur Baru

```
Saya ingin menambahkan fitur baru ke KMS Ecojourney.

Fitur: [NAMA FITUR]
Deskripsi: [JELASKAN FITUR]
Ada di repo: kms-kelola / kms-publik (pilih salah satu)
Halaman terkait: [NAMA HALAMAN]

Pertimbangkan:
- Routing di proyek ini state-based (bukan react-router-dom)
- Backend adalah Supabase (tabel dan schema sudah terdefinisi, lihat section schema di atas)
- Jika butuh tabel baru: berikan SQL migration-nya juga
- Jika butuh Storage: tentukan bucket dan path format-nya
- Jika ada implikasi RLS: berikan SQL policy-nya juga
- Styling menggunakan Tailwind CSS (kelola: v4, publik: v3)

Berikan:
1. Rencana implementasi singkat
2. Kode lengkap siap paste
3. SQL tambahan jika diperlukan
```

---

*Dokumen ini dibuat berdasarkan analisis kode frontend dan setup Supabase yang telah dikerjakan.*
*Update dokumen ini setiap kali ada perubahan signifikan pada schema, permissions, atau arsitektur.*
