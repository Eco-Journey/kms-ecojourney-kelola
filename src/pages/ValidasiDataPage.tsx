import React, { useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Check, X } from "lucide-react";
import MapLocator from "../components/MapLocator";
import { DataEntry } from "../App";
import Toast, { ToastType } from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

interface ValidasiDataPageProps {
  entry: DataEntry | null;
  onNavigate: (page: string) => void;
  onValidateEntry: (
    id: string,
    newStatus: "Aktif" | "Verifikasi" | "Ditolak" | string,
  ) => void;
}

export default function ValidasiDataPage({
  entry,
  onNavigate,
  onValidateEntry,
}: ValidasiDataPageProps): React.ReactElement {
  // Mock fallback item matching Image 4
  const currentEntry: DataEntry = entry || {
    id: "B999",
    type: "Benih/Varietas",
    nama: "Varietas XYZ",
    kategori: "Benih Padi",
    status: "Verifikasi",
    tanggal: "5 Maret 2026",
    lokasi: {
      kota: "Surabaya",
      provinsi: "Surabaya",
      deskripsiLokasi:
        "Terdapat di Surabaya bagian Timur, Desa ABCD, Kecamatan XYZ, deket rumah Pak Mamat",
      koordinat: { lat: -7.2575, lng: 112.7521 },
    },
    deskripsi:
      "Varietas ini merupakan Padi yang tumbuh dengan ekosistem lorem ipsum dolor sit amet.",
    images: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600&h=450", // Mock plate of Nasi Goreng/food
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600&h=450",
      "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=600&h=450",
    ],
    fpicDoc: "dokumen_fpic_signed_xyz.pdf",
    namaLokal: "Padi Bogor",
    namaIlmiah: "Bogoriankerenbangetxyz",
    namaPenemu: "Luthfi Daffa Praditya Jason",
  };

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    isOpen: boolean;
    type: "approve" | "reject";
  } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const handleApprove = (): void => {
    setConfirmAction({ isOpen: true, type: "approve" });
  };

  const handleReject = (): void => {
    setConfirmAction({ isOpen: true, type: "reject" });
  };

  const executeApprove = () => {
    onValidateEntry(currentEntry.id, "Aktif");
    setConfirmAction(null);
    showToast("Data berhasil divalidasi dan dipublikasikan!", "success");
    setTimeout(() => onNavigate("dashboard"), 1800);
  };

  const executeReject = () => {
    onValidateEntry(currentEntry.id, "Ditolak");
    setConfirmAction(null);
    showToast("Data pengajuan telah ditolak.", "info");
    setTimeout(() => onNavigate("dashboard"), 1800);
  };

  const handleDownloadFPIC = () => {
    showToast(`Memulai unduhan dokumen ${currentEntry.fpicDoc}...`, "success");

    // Simulasi respons unduhan file dari Client Side.
    // (Jika sudah terhubung ke backend, Anda tinggal mengganti "url" ke URL Storage dari Supabase)
    const blob = new Blob(["Konten mock dokumen FPIC dari Data Seed"], {
      type: "application/pdf",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", currentEntry.fpicDoc);
    document.body.appendChild(link);
    link.click();

    // Cleanup reference
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-kms-gray-bg w-full pb-16">
      {/* Banner */}
      <section
        className="relative bg-cover bg-center py-12 px-6 md:px-12 text-white flex flex-col justify-between shadow-sm select-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(40, 64, 39, 0.8), rgba(40, 64, 39, 0.85)), url('/rice_terrace_hero.png')",
        }}
      >
        <div className="text-left">
          <span
            onClick={() => onNavigate("dashboard")}
            className="text-xs uppercase tracking-widest text-kms-green-light font-bold hover:underline cursor-pointer"
          >
            Dashboard
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-1">
            Validasi Data
          </h1>
          <p className="text-sm text-gray-300 mt-2 font-normal">
            Eco Journey Knowledge Management System
          </p>
        </div>
      </section>

      {/* Main Validation Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Data Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card 1: Detail Data (Read-only) */}
            <div className="bg-white rounded-[5px] border border-gray-200/50 shadow-sm p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Detail Data
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-normal">
                  Masukan detail informasi terkait Data yang Dibutuhkan
                </p>
                <hr className="border-gray-200 mt-4" />
              </div>

              {currentEntry.type === "Pengetahuan Adat" ? (
                /* Pengetahuan Adat specifics */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider mb-1">
                      Judul Pengetahuan Adat
                    </span>
                    <span className="text-sm font-semibold text-gray-950 block">
                      {currentEntry.nama}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider mb-1">
                      Varietas Terkait
                    </span>
                    <span className="text-sm font-normal text-gray-700 block">
                      {currentEntry.varietasTerkait || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider mb-1">
                      Wilayah Asal
                    </span>
                    <span className="text-sm font-normal text-gray-700 block">
                      {currentEntry.wilayahAsal || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider mb-1">
                      Kategori
                    </span>
                    <span className="text-sm font-normal text-gray-700 block">
                      {currentEntry.kategori}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider mb-1">
                      Tanggal Publikasi
                    </span>
                    <span className="text-sm font-normal text-gray-700 block">
                      {currentEntry.tanggal}
                    </span>
                  </div>
                </div>
              ) : (
                /* Benih / Varietas specifics */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider mb-1">
                      Nama Varietas/Temuan
                    </span>
                    <span className="text-sm font-semibold text-gray-950 block">
                      {currentEntry.nama}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider mb-1">
                      Nama Lokal
                    </span>
                    <span className="text-sm font-normal text-gray-700 block">
                      {currentEntry.namaLokal || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider mb-1">
                      Nama Ilmiah
                    </span>
                    <span className="text-sm font-normal text-gray-700 block italic">
                      {currentEntry.namaIlmiah || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider mb-1">
                      Kategori
                    </span>
                    <span className="text-sm font-normal text-gray-700 block">
                      {currentEntry.kategori}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider mb-1">
                      Tanggal Penemuan
                    </span>
                    <span className="text-sm font-normal text-gray-700 block">
                      {currentEntry.tanggal}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Detail Lokasi dan Penemu/Narasumber */}
            <div className="bg-white rounded-[5px] border border-gray-200/50 shadow-sm p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  {currentEntry.type === "Pengetahuan Adat"
                    ? "Detail Lokasi dan Narasumber"
                    : "Detail Lokasi dan Penemu"}
                </h2>
                <hr className="border-gray-200 mt-4" />
              </div>

              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider mb-1">
                    {currentEntry.type === "Pengetahuan Adat"
                      ? "Nama Narasumber"
                      : "Nama Penemu"}
                  </span>
                  <span className="text-sm font-semibold text-gray-950 block">
                    {currentEntry.type === "Pengetahuan Adat"
                      ? currentEntry.namaNarasumber
                      : currentEntry.namaPenemu}
                  </span>
                </div>

                {/* Map Display (readOnly mode) */}
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider mb-1">
                    Koordinat
                  </span>
                  <MapLocator
                    readOnly={true}
                    latitude={
                      currentEntry.lokasi.koordinat
                        ? currentEntry.lokasi.koordinat.lat
                        : null
                    }
                    longitude={
                      currentEntry.lokasi.koordinat
                        ? currentEntry.lokasi.koordinat.lng
                        : null
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider mb-1">
                      Kota/Kabupaten
                    </span>
                    <span className="text-sm font-normal text-gray-700 block">
                      {currentEntry.lokasi.kota}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider mb-1">
                      Provinsi
                    </span>
                    <span className="text-sm font-normal text-gray-700 block">
                      {currentEntry.lokasi.provinsi}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider mb-1">
                    Deskripsi Lokasi
                  </span>
                  <span className="text-sm font-normal text-gray-700 block bg-gray-50 p-2.5 rounded border border-gray-150 leading-relaxed">
                    {currentEntry.lokasi.deskripsiLokasi || "-"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider mb-1">
                    Deskripsi
                  </span>
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-[5px] p-3.5 text-sm min-h-[120px] text-gray-750 leading-relaxed font-normal whitespace-pre-wrap">
                    {currentEntry.deskripsi || "Tidak ada deskripsi detail."}
                  </div>
                </div>
              </div>

              {/* Dynamic validation actions inside Card bottom */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-gray-150">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-gray-600">
                    Status Pengajuan:
                  </span>
                  <span
                    className={`inline-flex items-center text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                      currentEntry.status === "Aktif"
                        ? "bg-green-150 text-kms-green-dark"
                        : currentEntry.status === "Ditolak"
                          ? "bg-red-100 text-kms-red"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {currentEntry.status}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => onNavigate("dashboard")}
                    className="px-5 py-2 text-xs font-bold border border-gray-300 rounded-[5px] hover:bg-gray-150 transition cursor-pointer text-gray-700 bg-white"
                  >
                    Cancel
                  </button>

                  {/* Approve / Reject buttons available if not yet processed */}
                  {currentEntry.status === "Verifikasi" && (
                    <>
                      <button
                        type="button"
                        onClick={handleReject}
                        className="bg-kms-red hover:bg-red-700 text-white text-xs font-extrabold px-4.5 py-2 rounded-[5px] transition cursor-pointer shadow-xs border-none flex items-center"
                      >
                        <X className="w-3.5 h-3.5 mr-1" />
                        Tolak
                      </button>
                      <button
                        type="button"
                        onClick={handleApprove}
                        className="bg-kms-green-status hover:bg-emerald-500 text-white text-xs font-extrabold px-4.5 py-2 rounded-[5px] transition cursor-pointer shadow-xs border-none flex items-center"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Edit Data
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Submitted image and document (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Image Viewer Card */}
            <div className="bg-white rounded-[5px] border border-gray-200/50 shadow-sm p-6 space-y-4">
              <span className="text-xs font-bold text-gray-800 uppercase block tracking-wider">
                Foto Dokumen Temuan
              </span>

              {/* Main Image View */}
              <div className="relative aspect-square w-full bg-slate-900 border border-gray-200 rounded-[5px] overflow-hidden flex items-center justify-center">
                <img
                  src={currentEntry.images[activeImageIndex]}
                  alt="Validation Main Asset"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Carousel */}
              {currentEntry.images.length > 1 && (
                <div className="flex items-center space-x-2 select-none justify-center">
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-gray-100 text-gray-500 border border-gray-300 bg-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex space-x-1.5">
                    {currentEntry.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`w-12 h-12 rounded overflow-hidden aspect-square border-2 cursor-pointer ${
                          idx === activeImageIndex
                            ? "border-kms-green-dark scale-105"
                            : "border-gray-200"
                        }`}
                        onClick={() => setActiveImageIndex(idx)}
                      >
                        <img
                          src={img}
                          alt={`thumb-${idx}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-gray-100 text-gray-500 border border-gray-300 bg-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Edit Picture / Delete (Mock Buttons from layout) */}
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      "Fitur edit gambar hanya aktif pada form pengajuan awal.",
                      "info",
                    )
                  }
                  className="flex-1 py-2 text-xs font-bold bg-[#EFEFEF] hover:bg-gray-200 border border-gray-300 rounded-[5px] transition cursor-pointer text-gray-800"
                >
                  Edit Picture
                </button>
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      "Foto tidak diizinkan untuk dihapus dalam mode validasi.",
                      "warning",
                    )
                  }
                  className="py-2 px-3 text-xs font-bold bg-kms-red hover:bg-red-700 text-white rounded-[5px] transition cursor-pointer border-none flex items-center justify-center"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* FPIC Document card */}
            <div className="bg-white rounded-[5px] border border-gray-200/50 shadow-sm p-6 space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
                  Upload Dokumen FPIC
                </h3>
                <hr className="border-gray-200 mt-2" />
              </div>

              {/* Document details box */}
              <div className="border border-gray-200 bg-slate-50 rounded-[5px] p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-kms-green-dark">
                  <FileText className="w-8 h-8 text-[#284027]/70" />
                  <div className="text-left">
                    <p className="text-xs font-bold truncate max-w-xs">
                      {currentEntry.fpicDoc}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      PDF Document • Signed
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      `Memulai unduhan dokumen ${currentEntry.fpicDoc}...`,
                      "success",
                    )
                  }
                  className="px-3.5 py-1.5 bg-[#EFEFEF] hover:bg-gray-200 border border-gray-300 rounded text-[10px] font-bold text-gray-800 cursor-pointer"
                >
                  Unduh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modals and Toasts */}
      <ConfirmModal
        isOpen={confirmAction?.isOpen || false}
        title={
          confirmAction?.type === "approve" ? "Setujui Data?" : "Tolak Data?"
        }
        message={
          confirmAction?.type === "approve"
            ? "Apakah Anda yakin ingin menyetujui dan mempublikasikan data ini? Data yang sudah disetujui akan ditampilkan ke publik untuk umum."
            : "Apakah Anda yakin menolak data pengajuan ini? Data tidak akan dipublikasikan dan user (pengaju) akan diberitahu terkait penolakan ini."
        }
        confirmText={
          confirmAction?.type === "approve" ? "Ya, Setujui" : "Ya, Tolak"
        }
        confirmColor={confirmAction?.type === "approve" ? "green" : "red"}
        onConfirm={
          confirmAction?.type === "approve" ? executeApprove : executeReject
        }
        onCancel={() => setConfirmAction(null)}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
