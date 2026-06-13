# Dokumen Sinkronisasi & Penyelarasan (Sync)
**Eco Journey: KMS SDG Pertanian**

Dokumen ini berfungsi sebagai panduan penyelarasan arsitektur, basis data, identitas desain (UI/UX), dan fitur antara portal publik (**kms-ecojourney-publik**) dengan portal manajemen/admin (**kms-ecojourney-kelola**).

---

## 1. Identitas Visual & Desain UI (UI Design System)

Untuk memastikan konsistensi visual di kedua platform, portal admin harus menerapkan token desain yang sama dengan portal publik berikut:

### A. Palet Warna (Color Palette)
| Kategori | Nama Warna | Kode HEX | Penggunaan Utama |
| :--- | :--- | :--- | :--- |
| **Primary** | Dark Green | `#284027` | Brand color, header, footer, primary button |
| **Accent Light** | Soft Green | `#D5E2C4` | Border, background cards, hover states |
| **Secondary** | Earth Brown | `#7A5535` | Tag/kategori, background cards secondary |
| **Neutral Background**| Cool Gray | `#F2F2F2` | Latar belakang halaman |
| **Neutral White** | Pure White | `#FFFFFF` | Latar belakang card, form, dan panel |
| **Semantic Success** | Emerald Green| `#02E10E` | Aksi tambah data (Add), simpan (Finish/Save) |
| **Semantic Error** | Coral Red | `#EB3131` | Aksi hapus (Delete), batal (Cancel), tolak |
| **Semantic Info/Edit** | Slate Indigo | `#384166` | Aksi edit/ubah data |

### B. Tipografi
* **Font Utama:** `Plus Jakarta Sans`
* **Skala Tipografi:**
  * **Heading H1:** 36px, Weight: `ExtraBold` (700/800)
  * **Heading H2:** 20px, Weight: `ExtraBold` (700/800)
  * **Body Text:** 20px, Weight: `Regular` (400)
  * **Caption/Keterangan:** 16px, Weight: `Regular` (400)

### C. Komponen UI
* **Button & Input Border Radius:** `5px` (corner radius 5)
* **Shadows:** Drop shadow halus tanpa border tipis yang kasar (`shadow-sm` / soft shadow).
* **Branding Name:** Menggunakan teks logo **"Eco Journey"** secara konsisten.

---

## 2. Skema & Model Database (Supabase Schema)

Kedua portal menggunakan database **Supabase** yang sama. Portal publik hanya melakukan aksi **READ (SELECT)**, sedangkan portal admin (**kms-ecojourney-kelola**) mengelola aksi **WRITE (INSERT, UPDATE, DELETE)**.

### A. Konfigurasi Variabel Lingkungan (.env)
Kedua aplikasi terhubung ke proyek Supabase yang sama:
```env
VITE_SUPABASE_URL=https://zdxvagxatsrvhlmpptpg.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_w6fzGz4_jnusfUDHQzyqIA_IUAiQWlN
```

### B. Struktur Tabel Database & Kriteria Sinkronisasi

#### 1. Tabel Desa (`villages`)
Tabel untuk menyimpan data desa adat/lokal pelestari SDG Pertanian.
* `id` (TEXT, PK): Identifier unik (e.g. `sukojaya`, `cihideung`, `ciptagelar`).
* `name` (TEXT, NOT NULL): Nama desa.
* `varieties` (TEXT, NOT NULL): Varietas utama yang dihasilkan (e.g. "Padi Genjah, Talas Ketan").
* `image` (TEXT, NOT NULL): URL gambar sampul desa.
* `description` (TEXT): Penjelasan sejarah/profil desa.
* `practices_count` (INT, DEFAULT 0): Jumlah praktik tradisional terdokumentasi.
* `varieties_count` (INT, DEFAULT 0): Jumlah varietas lokal yang ditanam.
* `conservation_status` (TEXT): Status konservasi (e.g. "Aman", "Terancam", "Langka").
* `location_map_url` (TEXT): Nama provinsi/daerah koordinat (e.g. "Jawa Barat", "Maluku").
* `latitude` (DOUBLE PRECISION): Koordinat garis lintang untuk Leaflet Map.
* `longitude` (DOUBLE PRECISION): Koordinat garis bujur untuk Leaflet Map.

#### 2. Tabel Varietas (`varieties`)
Katalog varietas tanaman SDG Pertanian (Padi, Talas, Uwi, Pala, Cengkeh).
* `id` (TEXT, PK): ID varietas (e.g. `varietas-a`).
* `name` (TEXT, NOT NULL): Nama varietas.
* `village` (TEXT, NOT NULL): Nama desa penghasil.
* `commodity` (TEXT, NOT NULL): Jenis komoditas (Padi / Talas / Uwi / Pala / Cengkeh).
* `physicalDescription` (TEXT): Deskripsi morfologi tanaman.
* `conservationStatus` (TEXT, NOT NULL): Status kelangkaan (Aman / Terancam / Sangat Terancam / Langka).
* `altitude` (TEXT): Ketinggian lahan tanam (e.g. "500 Mdpl").
* `landType` (TEXT): Jenis ekosistem tanah (e.g. "Sawah", "Pekarangan", "Kebun").
* `rainfall` (TEXT): Kebutuhan curah hujan (e.g. "Tinggi", "Sedang", "Rendah").
* `images` (TEXT[]): Array URL gambar galeri varietas.
* `practices` (JSONB): Menyimpan array objek praktik lokal tradisional dengan format JSON:
  ```json
  [
    {
      "id": "practice-1",
      "title": "Judul Praktik",
      "image": "https://url-gambar.com",
      "description": "Deskripsi praktik lokal..."
    }
  ]
  ```
* `calendarEvents` (JSONB): Mapping event kalender adat tanam dengan format JSON:
  ```json
  {
    "1": ["Quotes"],
    "3": ["Quotes", "Giveaway"],
    "20": ["Reel"]
  }
  ```

#### 3. Tabel Artikel Pengetahuan (`articles`)
Kearifan lokal lisan dan riset ilmiah yang terdokumentasi secara tertulis.
* `id` (TEXT, PK): ID artikel.
* `title` (TEXT, NOT NULL): Judul pengetahuan.
* `subtitle` (TEXT): Sub-judul atau rangkuman.
* `image` (TEXT, NOT NULL): Gambar cover artikel.
* `description` (TEXT, NOT NULL): Deskripsi singkat/abstrak artikel.
* `content` (TEXT, NOT NULL): Isi lengkap artikel pengetahuan (mendukung format `whitespace-pre-line`).
* `category` (TEXT): Kategori (e.g. "Konservasi", "Pasca Panen", "Ritual Adat").
* `date` (TEXT, NOT NULL): Tanggal publikasi (e.g. "12 Mei 2026").
* `author_name` (TEXT, NOT NULL): Nama kontributor/penulis/pakar.
* `author_title` (TEXT): Keterangan profesi penulis (e.g. "Ketua Adat Kasepuhan").
* `author_image` (TEXT): URL foto profil penulis.
* `is_verified` (BOOLEAN, DEFAULT FALSE): Status verifikasi oleh pakar etnobotani/adat.
* `year` (INT): Tahun pencatatan data.
* `variety_id` (TEXT, FK): Relasi ke tabel `varieties.id`.

#### 4. Tabel Marker Peta Sebaran (`mappins`)
Titik koordinat visual sebaran di peta Leaflet.
* `varietyId` (TEXT, PK, FK): Relasi ke tabel `varieties.id`.
* `cx` (INT, NOT NULL): Koordinat X mockup (fallback untuk SVG map statis).
* `cy` (INT, NOT NULL): Koordinat Y mockup (fallback untuk SVG map statis).
* `label` (TEXT, NOT NULL): Label pop-up pin (e.g. "Varietas A (SukoJaya)").
* `commodity` (TEXT, NOT NULL): Komoditas tanaman.
* `status` (TEXT, NOT NULL): Status kelangkaan varietas.
* `province` (TEXT): Nama provinsi (e.g. "Jawa Barat").
* `ecosystem` (TEXT): Jenis lahan ekosistem (e.g. "Sawah").

#### 5. Tabel Statistik Metrik (`stats`)
Ringkasan metrik dashboard di halaman depan (Home).
* `id` (TEXT, PK): ID metrik.
* `label` (TEXT, NOT NULL): Label metrik (e.g. "Jumlah varietas terdokumentasi").
* `value` (TEXT, NOT NULL): Nilai angka/teks (e.g. "148 Varietas").
* `description` (TEXT): Keterangan pelengkap di bawah metrik.
* `iconName` (TEXT, NOT NULL): Nama ikon dari library `lucide-react` (e.g. "Wheat", "Home", "UserCheck").

---

## 3. Kebijakan Keamanan (Row Level Security - RLS)

Sistem sinkronisasi bergantung pada hak akses Supabase yang diatur dalam RLS:

1. **Akses Publik (`anon`):**
   * Diizinkan hanya untuk membaca data (`SELECT`).
   * Perintah SQL RLS:
     ```sql
     CREATE POLICY "Allow public read access" ON <nama_tabel> FOR SELECT TO anon USING (true);
     ```
2. **Akses Admin (`authenticated`):**
   * Diizinkan untuk melakukan operasi manipulasi penuh (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).
   * Portal **kms-ecojourney-kelola** akan masuk menggunakan akun pengelola dan menyertakan JWT token auth agar dapat memodifikasi tabel.

---

## 4. Mekanisme Fallback (Graceful Fallback)

* Baik portal publik maupun portal admin disarankan menyertakan mekanisme fallback ke mock data lokal (`mockData.ts`) jika koneksi ke database online Supabase terputus.
* Ini menjamin kelancaran presentasi/demo aplikasi secara luring (offline) tanpa mengalami crash atau halaman kosong.
