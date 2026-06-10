import React, { useState } from 'react';
import { Upload, ChevronRight, ChevronLeft, Trash2, FileText, Check } from 'lucide-react';
import MapLocator from '../components/MapLocator';
import RichTextEditor from '../components/RichTextEditor';
import CropImageModal from '../components/CropImageModal';
import { DataEntry } from '../App';

interface AddPengetahuanPageProps {
  onNavigate: (page: string) => void;
  onAddEntry: (newEntry: DataEntry) => void;
  editEntry?: DataEntry | null;
  onUpdateEntry?: (entry: DataEntry) => void;
}

export default function AddPengetahuanPage({
  onNavigate,
  onAddEntry,
  editEntry = null,
  onUpdateEntry,
}: AddPengetahuanPageProps): React.ReactElement {
  const [judulPengetahuan, setJudulPengetahuan] = useState<string>('');
  const [varietasTerkait, setVarietasTerkait] = useState<string>('');
  const [wilayahAsal, setWilayahAsal] = useState<string>('');
  const [kategori, setKategori] = useState<string>('Obat Tradisional');
  const [tanggalPublikasi, setTanggalPublikasi] = useState<string>('');

  const [namaNarasumber, setNamaNarasumber] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [kotaKabupaten, setKotaKabupaten] = useState<string>('');
  const [provinsi, setProvinsi] = useState<string>('');
  const [deskripsiLokasi, setDeskripsiLokasi] = useState<string>('');
  const [deskripsi, setDeskripsi] = useState<string>('');

  React.useEffect(() => {
    if (editEntry) {
      setJudulPengetahuan(editEntry.nama || "");
      setVarietasTerkait(editEntry.varietasTerkait || "");
      setWilayahAsal(editEntry.wilayahAsal || "");
      const cleanKategori = editEntry.kategori ? editEntry.kategori.replace(/^Pengetahuan /, "") : "Obat Tradisional";
      setKategori(cleanKategori);
      setTanggalPublikasi(editEntry.tanggal || "");
      setNamaNarasumber(editEntry.namaNarasumber || "");
      if (editEntry.lokasi) {
        setLatitude(editEntry.lokasi.koordinat ? editEntry.lokasi.koordinat.lat : null);
        setLongitude(editEntry.lokasi.koordinat ? editEntry.lokasi.koordinat.lng : null);
        setKotaKabupaten(editEntry.lokasi.kota || "");
        setProvinsi(editEntry.lokasi.provinsi || "");
        setDeskripsiLokasi(editEntry.lokasi.deskripsiLokasi || "");
      }
      setDeskripsi(editEntry.deskripsi || "");
      setUploadedImages(editEntry.images || []);
      setFpicFileName(editEntry.fpicDoc || "");
    }
  }, [editEntry]);

  // Image Upload States
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedMainImageIndex, setSelectedMainImageIndex] = useState<number>(0);
  const [isCropOpen, setIsCropOpen] = useState<boolean>(false);

  // FPIC Document Upload
  const [fpicFileName, setFpicFileName] = useState<string>('');

  const handleMapChange = (lat: number, lng: number): void => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleCropComplete = (url: string): void => {
    setUploadedImages(prev => {
      const newImages = [...prev, url];
      setSelectedMainImageIndex(newImages.length - 1);
      return newImages;
    });
  };

  const handleDeleteImage = (index: number): void => {
    setUploadedImages(prev => {
      const filtered = prev.filter((_, i) => i !== index);
      setSelectedMainImageIndex(prevIdx => {
        if (filtered.length === 0) return 0;
        if (prevIdx >= filtered.length) return filtered.length - 1;
        return prevIdx;
      });
      return filtered;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!judulPengetahuan || !namaNarasumber || !kotaKabupaten || !provinsi) {
      alert('Mohon lengkapi semua data wajib!');
      return;
    }

    if (editEntry) {
      const updatedEntry: DataEntry = {
        ...editEntry,
        nama: judulPengetahuan,
        kategori: 'Pengetahuan ' + kategori,
        tanggal: tanggalPublikasi || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        lokasi: {
          kota: kotaKabupaten,
          provinsi: provinsi,
          deskripsiLokasi: deskripsiLokasi,
          koordinat: latitude !== null && longitude !== null ? { lat: latitude, lng: longitude } : null
        },
        deskripsi: deskripsi,
        images: uploadedImages.length > 0 ? uploadedImages : ['https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600&h=450'],
        fpicDoc: fpicFileName || 'dokumen_fpic_signed.pdf',
        judulPengetahuan: judulPengetahuan,
        varietasTerkait: varietasTerkait,
        wilayahAsal: wilayahAsal,
        namaNarasumber: namaNarasumber
      };

      if (onUpdateEntry) {
        onUpdateEntry(updatedEntry);
      }
      alert('Pengetahuan adat berhasil diperbarui!');
    } else {
      const randomId = 'P' + Math.floor(100 + Math.random() * 900);
      const newEntry: DataEntry = {
        id: randomId,
        type: 'Pengetahuan Adat',
        nama: judulPengetahuan,
        kategori: 'Pengetahuan ' + kategori,
        status: 'Verifikasi', // Initial status is verification
        tanggal: tanggalPublikasi || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        lokasi: {
          kota: kotaKabupaten,
          provinsi: provinsi,
          deskripsiLokasi: deskripsiLokasi,
          koordinat: latitude !== null && longitude !== null ? { lat: latitude, lng: longitude } : null
        },
        deskripsi: deskripsi,
        images: uploadedImages.length > 0 ? uploadedImages : ['https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600&h=450'],
        fpicDoc: fpicFileName || 'dokumen_fpic_signed.pdf',
        judulPengetahuan: judulPengetahuan,
        varietasTerkait: varietasTerkait,
        wilayahAsal: wilayahAsal,
        namaNarasumber: namaNarasumber
      };

      onAddEntry(newEntry);
      alert('Pengetahuan adat berhasil ditambahkan dan dikirim untuk verifikasi!');
    }
    onNavigate('dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-kms-gray-bg w-full pb-16">
      {/* Banner */}
      <section 
        className="relative bg-cover bg-center py-12 px-6 md:px-12 text-white flex flex-col justify-between shadow-sm select-none"
        style={{ backgroundImage: "linear-gradient(rgba(40, 64, 39, 0.8), rgba(40, 64, 39, 0.85)), url('/rice_terrace_hero.png')" }}
      >
        <div className="text-left">
          <span 
            onClick={() => onNavigate('dashboard')}
            className="text-xs uppercase tracking-widest text-kms-green-light font-bold hover:underline cursor-pointer"
          >
            Dashboard
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-1">
            {editEntry ? "Edit Data (Pengetahuan Adat)" : "Add Data (Pengetahuan Adat)"}
          </h1>
          <p className="text-sm text-gray-300 mt-2 font-normal">
            Eco Journey Knowledge Management System
          </p>
        </div>
      </section>

      {/* Main Form Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full text-left">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Detail Data (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Card 1: Detail Data */}
            <div className="bg-white rounded-[5px] border border-gray-200/50 shadow-sm p-6 md:p-8 space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Detail Data
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-normal">
                  Masukan detail informasi terkait Data yang Dibutuhkan
                </p>
                <hr className="border-gray-200 mt-4" />
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Judul Pengetahuan Adat <span className="text-kms-red">*</span></label>
                  <input
                    type="text"
                    value={judulPengetahuan}
                    onChange={(e) => setJudulPengetahuan(e.target.value)}
                    placeholder="Contoh: Ritual Tanam Seren Taun Kasepuhan Ciptagelar"
                    className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">Varietas Terkait</label>
                    <input
                      type="text"
                      value={varietasTerkait}
                      onChange={(e) => setVarietasTerkait(e.target.value)}
                      placeholder="Contoh: Padi Gogo Cigeulis"
                      className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">Wilayah Asal</label>
                    <input
                      type="text"
                      value={wilayahAsal}
                      onChange={(e) => setWilayahAsal(e.target.value)}
                      placeholder="Contoh: Kasepuhan Ciptagelar"
                      className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">Kategori</label>
                    <select
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                      className="w-full border border-gray-300 rounded-[5px] px-2.5 py-2 text-sm outline-none cursor-pointer font-semibold text-gray-750 bg-white"
                    >
                      <option value="Obat Tradisional">Obat Tradisional</option>
                      <option value="Festival Adat">Festival Adat</option>
                      <option value="Ritual Tanam">Ritual Tanam</option>
                      <option value="Sejarah Budidaya">Sejarah Budidaya</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">Tanggal Publikasi</label>
                    <input
                      type="text"
                      value={tanggalPublikasi}
                      onChange={(e) => setTanggalPublikasi(e.target.value)}
                      placeholder="Contoh: 12 Mei 2026"
                      className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Detail Lokasi dan Narasumber */}
            <div className="bg-white rounded-[5px] border border-gray-200/50 shadow-sm p-6 md:p-8 space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Detail Lokasi dan Narasumber
                </h2>
                <hr className="border-gray-200 mt-4" />
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Nama Narasumber <span className="text-kms-red">*</span></label>
                  <input
                    type="text"
                    value={namaNarasumber}
                    onChange={(e) => setNamaNarasumber(e.target.value)}
                    placeholder="Contoh: Abah Ugi Sugriana"
                    className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                    required
                  />
                </div>

                {/* Map Locator Component */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Koordinat Lokasi</label>
                  <MapLocator 
                    latitude={latitude} 
                    longitude={longitude} 
                    onChange={handleMapChange} 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">Kota/Kabupaten <span className="text-kms-red">*</span></label>
                    <input
                      type="text"
                      value={kotaKabupaten}
                      onChange={(e) => setKotaKabupaten(e.target.value)}
                      placeholder="Contoh: Sukabumi"
                      className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">Provinsi <span className="text-kms-red">*</span></label>
                    <input
                      type="text"
                      value={provinsi}
                      onChange={(e) => setProvinsi(e.target.value)}
                      placeholder="Contoh: Jawa Barat"
                      className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Deskripsi Lokasi</label>
                  <input
                    type="text"
                    value={deskripsiLokasi}
                    onChange={(e) => setDeskripsiLokasi(e.target.value)}
                    placeholder="Contoh: Desa Adat Sirnaresmi, Kecamatan Cisolok"
                    className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2 text-sm outline-none focus:border-kms-blue-accent font-normal bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Deskripsi Pengetahuan</label>
                  <RichTextEditor 
                    value={deskripsi} 
                    onChange={setDeskripsi} 
                    placeholder="Tuliskan secara lengkap tata cara, legenda, ritual, obat-obatan tradisional..."
                  />
                </div>
              </div>

              {/* Card Bottom Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="px-6 py-2.5 text-xs font-bold border border-gray-300 rounded-[5px] hover:bg-gray-150 transition cursor-pointer text-gray-700 bg-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-kms-green-status hover:bg-emerald-500 active:scale-95 text-white text-xs font-extrabold px-6 py-2.5 rounded-[5px] transition-all duration-200 cursor-pointer shadow-sm flex items-center border-none"
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  {editEntry ? "Simpan Perubahan" : "Add Data"}
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Uploads (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Card 1: Image Gallery Box */}
            <div className="bg-white rounded-[5px] border border-gray-200/50 shadow-sm p-6 space-y-4">
              <span className="text-xs font-bold text-gray-800 uppercase block tracking-wider">
                Foto Pengetahuan / Pendukung
              </span>
              
              {/* Main Preview Box */}
              <div 
                onClick={() => setIsCropOpen(true)}
                className="relative aspect-square w-full bg-slate-50 border border-dashed border-gray-350 rounded-[5px] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100/50 transition-colors overflow-hidden group"
              >
                {uploadedImages.length > 0 ? (
                  <>
                    <img 
                      src={uploadedImages[selectedMainImageIndex]} 
                      alt="Main Crop Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                      Ganti / Tambah Gambar
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <span className="text-xs font-bold text-gray-500 block">Click to Upload / Crop Picture</span>
                  </div>
                )}
              </div>

              {/* Horizontal list of thumbnails */}
              {uploadedImages.length > 0 && (
                <div className="flex items-center space-x-2 select-none justify-center">
                  <button type="button" className="p-1 rounded hover:bg-gray-100 text-gray-500 border border-gray-300 bg-white">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex space-x-1.5">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative group w-12 h-12 rounded border-2 border-gray-250 overflow-hidden aspect-square">
                        <img 
                          onClick={() => setSelectedMainImageIndex(idx)}
                          src={img} 
                          alt={`thumb-${idx}`} 
                          className="w-full h-full object-cover cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(idx)}
                          className="absolute top-0 right-0 bg-kms-red/90 text-white p-0.5 rounded-bl hover:bg-kms-red transition cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="p-1 rounded hover:bg-gray-100 text-gray-500 border border-gray-300 bg-white">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Upload Action buttons */}
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCropOpen(true)}
                  className="flex-1 py-2 text-xs font-bold bg-[#EFEFEF] hover:bg-gray-200 border border-gray-300 rounded-[5px] transition cursor-pointer text-gray-800"
                >
                  Edit Picture
                </button>
                <button
                  type="button"
                  onClick={() => setUploadedImages([])}
                  className="py-2 px-3 text-xs font-bold bg-kms-red hover:bg-red-700 text-white rounded-[5px] transition cursor-pointer flex items-center justify-center border-none"
                  title="Clear All Images"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Card 2: Upload Dokumen FPIC */}
            <div className="bg-white rounded-[5px] border border-gray-200/50 shadow-sm p-6 space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
                  Upload Dokumen FPIC
                </h3>
                <hr className="border-gray-200 mt-2" />
              </div>

              <div 
                onClick={() => {
                  const name = prompt('Masukkan nama file dokumen FPIC (PDF):', 'fpic_adat_ciptagelar_signed.pdf');
                  if (name) setFpicFileName(name);
                }}
                className="border-2 border-dashed border-gray-300 bg-slate-50 hover:bg-slate-100/50 transition rounded-[5px] p-6 text-center cursor-pointer flex flex-col items-center justify-center group"
              >
                {fpicFileName ? (
                  <div className="flex items-center space-x-2 text-kms-green-dark">
                    <FileText className="w-8 h-8" />
                    <div className="text-left">
                      <p className="text-xs font-bold truncate max-w-xs">{fpicFileName}</p>
                      <p className="text-[10px] text-gray-400">PDF Document • Klik untuk ganti</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mb-2 group-hover:text-gray-500 transition-colors" />
                    <span className="text-xs font-bold text-gray-500">Klik untuk upload dokumen persetujuan FPIC</span>
                    <span className="text-[9px] text-gray-400 mt-1 block">Format supported: PDF, max 5MB</span>
                  </>
                )}
              </div>
            </div>

          </div>

        </form>
      </div>

      {/* Crop/Upload Image Modal Popup */}
      {isCropOpen && (
        <CropImageModal 
          onClose={() => setIsCropOpen(false)} 
          onFinish={handleCropComplete} 
        />
      )}
    </div>
  );
}
