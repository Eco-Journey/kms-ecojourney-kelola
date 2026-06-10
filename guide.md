# KMS Ecojourney - Integration, Deployment, and Scale Guide

This document serves as a comprehensive developer manual to connect the client-side React prototype to a live Supabase production instance, deploy the application to hosting platforms (e.g., Netlify), and address outstanding development gaps.

---

## Table of Contents
1. [Supabase Integration & Database Schema](#1-supabase-integration--database-schema)
2. [Deployment Guide](#2-deployment-guide)
3. [Gap Analysis (Prototype vs. Production)](#3-gap-analysis-prototype-vs-production)
4. [Upgrades & Future Improvements](#4-upgrades--future-improvements)

---

## 1. Supabase Integration & Database Schema

The prototype connects to Supabase using the `@supabase/supabase-js` client initialized in `src/lib/supabase.ts`. 

To set up your database, execute the following SQL scripts in the **Supabase SQL Editor**:

### A. Database Tables DDL
```sql
-- 1. Create Profiles Table (Linked to Supabase Auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  nama_depan VARCHAR(255) NOT NULL,
  nama_belakang VARCHAR(255),
  nama_lengkap VARCHAR(255) GENERATED ALWAYS AS (
    CASE 
      WHEN nama_belakang IS NULL THEN nama_depan
      ELSE nama_depan || ' ' || nama_belakang
    END
  ) STORED,
  tempat_lahir VARCHAR(255),
  tanggal_lahir DATE,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE,
  role VARCHAR(50) DEFAULT 'masyarakat_adat' CHECK (role IN ('administrator', 'masyarakat_adat', 'pakar', 'penyuluh', 'fasilitator', 'klhk')),
  status_aktif BOOLEAN DEFAULT true,
  wajib_ganti_password BOOLEAN DEFAULT false,
  avatar_url TEXT,
  catatan_admin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Data Entries Table
CREATE TABLE public.data_entries (
  id VARCHAR(100) PRIMARY KEY,
  type VARCHAR(50) NOT NULL CHECK (type IN ('desa', 'pengetahuan_adat', 'benih_varietas')),
  status VARCHAR(50) DEFAULT 'verifikasi' CHECK (status IN ('aktif', 'verifikasi', 'ditolak', 'perlu_revisi')),
  kategori VARCHAR(100),
  nama VARCHAR(255) NOT NULL,
  tanggal VARCHAR(100),
  kota_kabupaten VARCHAR(255),
  provinsi VARCHAR(255),
  deskripsi_lokasi TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  deskripsi TEXT,
  fpic_doc_path TEXT,
  
  -- Benih specific fields
  nama_lokal VARCHAR(255),
  nama_ilmiah VARCHAR(255),
  nama_penemu VARCHAR(255),
  conservation_status VARCHAR(100),
  altitude VARCHAR(100),
  land_type VARCHAR(100),
  rainfall VARCHAR(100),
  
  -- Pengetahuan specific fields
  judul_pengetahuan VARCHAR(255),
  varietas_terkait VARCHAR(255),
  wilayah_asal VARCHAR(255),
  nama_narasumber VARCHAR(255),
  
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  validated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  validated_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Entry Images Table (Support Multiple Images per Entry)
CREATE TABLE public.entry_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id VARCHAR(100) REFERENCES public.data_entries(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  is_main BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Calendar Events Table
CREATE TABLE public.calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('tanam', 'panen', 'pupuk', 'audit')),
  day INT NOT NULL CHECK (day >= 1 AND day <= 31),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### B. Automating Profile Creation on Sign Up
To automatically create a profile record when a new user registers via Supabase Auth, set up a database trigger:
```sql
-- Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nama_depan, email, role, status_aktif)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nama_depan', 'Pengguna Baru'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'masyarakat_adat'),
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger Setup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### C. Row-Level Security (RLS) Policies
Enable RLS to secure data access:
```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entry_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Only admins can manage all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'administrator'
    )
  );

-- 2. Data Entries Policies
CREATE POLICY "Anyone can view active entries" ON public.data_entries
  FOR SELECT USING (status = 'aktif' OR auth.uid() IS NOT NULL);

CREATE POLICY "Masyarakat and Fasilitator can insert entries" ON public.data_entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('administrator', 'masyarakat_adat', 'fasilitator')
    )
  );

CREATE POLICY "Validators and Admins can update validation fields" ON public.data_entries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('administrator', 'pakar')
    )
  );
```

### D. Storage Buckets
Create the following storage buckets inside the **Supabase Storage** dashboard:
1. `fpic-documents` (Public bucket, maximum upload size: 5MB, accepted formats: PDF, DOCX).
2. `entry-images` (Public bucket, maximum upload size: 5MB, accepted formats: JPEG, PNG).

Configure access control policies to allow authenticated uploads.

---

## 2. Deployment Guide

### A. Environment Configuration
Create a `.env` file in the root directory. In production, configure these variables in the host dashboard settings (e.g. Netlify App Settings > Environment Variables):
```env
VITE_SUPABASE_URL=https://zdxvagxatsrvhlmpptpg.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_w6fzGz4_jnusfUDHQzyqIA_IUAiQWlN
```

### B. Building the App
Run the build script:
```bash
npm run build
```
This generates static compiled files in the `dist/` directory.

### C. Hosting on Netlify
To ensure client-side routing works properly when pages are reloaded directly (avoiding 404 errors), configure redirects:

1. **netlify.toml** file in the root workspace (already configured):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Alternatively, create a `_redirects` file in the `public/` directory:
```
/* /index.html 200
```

---

## 3. Gap Analysis (Prototype vs. Production)

| Feature | Current Prototype State | Required Production Setup | Action Required |
| :--- | :--- | :--- | :--- |
| **Authentication** | Mock accounts trigger login bypass. Non-mock emails call real `signInWithPassword`. | Remove the hardcoded mock login logic from `LoginPage.tsx` so all accounts authenticate securely via Supabase Auth. | Remove `isMockEmail` conditional blocks once all users are imported. |
| **FPIC Uploads** | Simulates upload by reading file name string. | Call `supabase.storage.from('fpic-documents').upload()` to upload physical PDF binaries and store return paths. | Integrate file object buffer upload handlers in `AddBenihPage` and `AddPengetahuanPage`. |
| **Photo Uploads** | Renders dummy Unsplash URLs or base64 files. | Crop image inside `CropImageModal.tsx`, upload to `entry-images` bucket, and save storage path to `entry_images` DB table. | Wire canvas cropping data uri outputs to Supabase Storage client APIs. |
| **Interactive Map (GIS)** | `MapLocator` is used in readOnly mode showing single points. | Fetch coordinates from `data_entries` where `status = 'aktif'` and plot markers dynamically on the Map. | Pass array of entry coordinates to `MapLocator` prop on dashboard. |
| **Jadwal Tanam** | Stored in local React memory state. | Read/write from the `calendar_events` table using `supabase.from('calendar_events')`. | Replace local `setCalendarEvents` state updates with table queries. |

---

## 4. Upgrades & Future Improvements

1. **Image Optimizations**: Setup a CDN or image processing pipeline (e.g., Supabase Image Transformation) to request resized thumbnails instead of original raw high-res images in table listings.
2. **Offline Data Sync**: Enable local caching (e.g. using LocalStorage or IndexDB) to allow field penyuluh/fasilitator to input varieties when disconnected from mobile networks in remote rural areas. Sync changes when back online.
3. **Audit Trails / Log Table**: Create a history tracking table (`audit_logs`) to track which Pakar/Validator approved or requested revisions for each entry to improve verification transparency.
4. **Invite-Only User Creation**: Standardize user creation so Admins invite Pakar/Fasilitator via email invitations instead of allowing open public signup.
