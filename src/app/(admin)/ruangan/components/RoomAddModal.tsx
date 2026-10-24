"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { FolderUp } from "lucide-react";
import { Ruangan } from "@/lib/ruangan-data";

export interface RoomAddModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (newRoom: Ruangan) => void;
  defaultGedung?: string;
}

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

interface RoomAddFormContentProps {
  onClose: () => void;
  onSave: (newRoom: Ruangan) => void;
  defaultGedung: string;
}

function RoomAddFormContent({
  onClose,
  onSave,
  defaultGedung,
}: RoomAddFormContentProps) {
  const modalBoxRef = useRef<HTMLDivElement>(null);
  const namaInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const facilityInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Form states
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [lantai, setLantai] = useState("");
  const [kapasitas, setKapasitas] = useState("");
  const [fasilitas, setFasilitas] = useState<string[]>(["", "", ""]);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>("");

  // Validation triggered on submit attempt
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Focus awal ke input Nama Ruangan saat modal terbuka
  useEffect(() => {
    const timer = setTimeout(() => {
      namaInputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup object URL preview jika ada
  useEffect(() => {
    return () => {
      if (fotoPreview && fotoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(fotoPreview);
      }
    };
  }, [fotoPreview]);

  // Validasi field
  const namaTrimmed = nama.trim();
  const isNamaValid = namaTrimmed.length > 0;
  const namaError = hasSubmitted && !isNamaValid ? "Nama Ruangan wajib diisi" : "";

  const lantaiNum = parseInt(lantai.trim(), 10);
  const isLantaiValid = !isNaN(lantaiNum) && lantaiNum >= 1;
  const lantaiError =
    hasSubmitted && !lantai.trim()
      ? "Lantai wajib diisi"
      : hasSubmitted && !isLantaiValid
      ? "Lantai harus berupa angka bulat minimal 1"
      : "";

  const kapasitasNum = parseInt(kapasitas.trim(), 10);
  const isKapasitasValid = !isNaN(kapasitasNum) && kapasitasNum >= 1;
  const kapasitasError =
    hasSubmitted && !kapasitas.trim()
      ? "Kapasitas wajib diisi"
      : hasSubmitted && !isKapasitasValid
      ? "Kapasitas harus berupa angka minimal 1"
      : "";

  const isFormValid = isNamaValid && isLantaiValid && isKapasitasValid;

  // Cek apakah ada data yang sudah diisi (dirty state)
  const isDirty = () => {
    if (nama.trim() !== "") return true;
    if (deskripsi.trim() !== "") return true;
    if (lantai.trim() !== "") return true;
    if (kapasitas.trim() !== "") return true;
    if (fotoFile !== null || fotoPreview !== "") return true;
    if (fasilitas.some((item) => item.trim() !== "")) return true;
    return false;
  };

  // Tutup dengan konfirmasi jika form sudah ada isinya
  const handleSafeClose = () => {
    if (isDirty()) {
      const isConfirmed = window.confirm("Perubahan belum disimpan. Tutup?");
      if (!isConfirmed) return;
    }
    onClose();
  };

  // Tangani tombol ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSafeClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Handler Fasilitas
  const handleFasilitasChange = (index: number, value: string) => {
    setFasilitas((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleFasilitasKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Jika di baris terakhir, buat baris baru
      if (index === fasilitas.length - 1) {
        setFasilitas((prev) => [...prev, ""]);
        setTimeout(() => {
          facilityInputRefs.current[index + 1]?.focus();
        }, 50);
      } else {
        facilityInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleFasilitasBlur = (index: number) => {
    // Jika baris terakhir diketik lalu blur, otomatis tambah baris kosong baru
    if (index === fasilitas.length - 1 && fasilitas[index]?.trim() !== "") {
      setFasilitas((prev) => [...prev, ""]);
    }
  };

  const handleRemoveFasilitas = (index: number) => {
    setFasilitas((prev) => {
      if (prev.length <= 1) return [""];
      return prev.filter((_, i) => i !== index);
    });
  };

  // Handler Upload Foto
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fotoPreview && fotoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(fotoPreview);
    }

    setFotoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setFotoPreview(objectUrl);
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fotoPreview && fotoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(fotoPreview);
    }
    setFotoFile(null);
    setFotoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit Simpan Ruangan
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (!isFormValid) {
      // Fokus pada input pertama yang bermasalah
      if (!isNamaValid) {
        namaInputRef.current?.focus();
      }
      return;
    }

    // Bersihkan daftar fasilitas (trim dan buang baris kosong)
    const cleanedFasilitas = fasilitas
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const roomName = nama.trim();
    const finalGambar = fotoPreview || "/images/ruang1.jpg";
    const generatedId = `room-${Date.now()}`;

    const newRoom: Ruangan = {
      id: generatedId,
      nama: roomName,
      name: roomName,
      gedung: defaultGedung,
      lantai: lantaiNum,
      kapasitas: kapasitasNum,
      min: kapasitasNum,
      max: kapasitasNum,
      gambar: finalGambar,
      imageUrl: finalGambar,
      deskripsi: deskripsi.trim(),
      fasilitas: cleanedFasilitas,
    };

    onSave(newRoom);
  };

  return (
    <div
      role="presentation"
      onClick={handleSafeClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-[1px] animate-fadeIn"
    >
      <div
        ref={modalBoxRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-add-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-[840px] max-h-[90vh] flex-col overflow-y-auto rounded-xl bg-white p-6 shadow-2xl transition-all duration-200 focus:outline-none sm:p-8 md:p-9"
      >
        {/* Tombol Close (X) */}
        <button
          type="button"
          onClick={handleSafeClose}
          aria-label="Tutup form tambah ruangan"
          className="absolute right-5 top-5 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar"
        >
          <FaTimes className="size-4 sm:size-5" aria-hidden="true" />
        </button>

        {/* Judul: Tambah Ruangan */}
        <h2
          id="room-add-modal-title"
          className="text-center text-2xl font-bold tracking-tight text-gray-900"
        >
          Tambah Ruangan
        </h2>

        {/* Form Isi Tambah Ruangan */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 sm:gap-5">
          {/* Input Baris Atas (Lebar Penuh / Full Width) */}
          <div className="flex flex-col gap-3.5 sm:gap-4">
            {/* 1. Nama Ruangan */}
            <div className="flex flex-col">
              <label
                htmlFor="add-nama"
                className="mb-1 text-sm font-semibold text-gray-800"
              >
                Nama Ruangan
              </label>
              <input
                id="add-nama"
                ref={namaInputRef}
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Ketik disini"
                className={`h-[38px] w-full rounded-md border px-3.5 text-[13px] text-gray-800 placeholder:text-gray-400 outline-none transition-colors ${
                  namaError
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#0F5A96] focus:ring-1 focus:ring-[#0F5A96]"
                }`}
              />
              {namaError && (
                <span className="mt-1 text-[11px] text-red-500">{namaError}</span>
              )}
            </div>

            {/* 2. Deskripsi Ruangan */}
            <div className="flex flex-col">
              <label
                htmlFor="add-deskripsi"
                className="mb-1 text-sm font-semibold text-gray-800"
              >
                Deskripsi Ruangan
              </label>
              <textarea
                id="add-deskripsi"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Ketik disini"
                className="h-[76px] min-h-[76px] w-full resize-none rounded-md border border-gray-300 p-3 text-[13px] leading-relaxed text-gray-800 placeholder:text-gray-400 outline-none transition-colors focus:border-[#0F5A96] focus:ring-1 focus:ring-[#0F5A96]"
              />
            </div>

            {/* 3. Lantai */}
            <div className="flex flex-col">
              <label
                htmlFor="add-lantai"
                className="mb-1 text-sm font-semibold text-gray-800"
              >
                Lantai
              </label>
              <input
                id="add-lantai"
                type="number"
                min="1"
                value={lantai}
                onChange={(e) => setLantai(e.target.value)}
                placeholder="Ketik disini"
                className={`h-[38px] w-full rounded-md border px-3.5 text-[13px] text-gray-800 placeholder:text-gray-400 outline-none transition-colors ${
                  lantaiError
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#0F5A96] focus:ring-1 focus:ring-[#0F5A96]"
                }`}
              />
              {lantaiError && (
                <span className="mt-1 text-[11px] text-red-500">{lantaiError}</span>
              )}
            </div>

            {/* 4. Kapasitas */}
            <div className="flex flex-col">
              <label
                htmlFor="add-kapasitas"
                className="mb-1 text-sm font-semibold text-gray-800"
              >
                Kapasitas
              </label>
              <input
                id="add-kapasitas"
                type="number"
                min="1"
                value={kapasitas}
                onChange={(e) => setKapasitas(e.target.value)}
                placeholder="Ketik disini"
                className={`h-[38px] w-full rounded-md border px-3.5 text-[13px] text-gray-800 placeholder:text-gray-400 outline-none transition-colors ${
                  kapasitasError
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#0F5A96] focus:ring-1 focus:ring-[#0F5A96]"
                }`}
              />
              {kapasitasError && (
                <span className="mt-1 text-[11px] text-red-500">
                  {kapasitasError}
                </span>
              )}
            </div>
          </div>

          {/* Bagian Bawah (Layout 2 Kolom) */}
          <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {/* Kolom Kiri: Fasilitas Ruangan */}
            <div className="flex flex-col">
              <h3 className="mb-2 text-sm font-bold text-gray-900 sm:text-base">
                Fasilitas Ruangan
              </h3>

              {/* Kotak ber-border tipis berisi daftar input fasilitas bergaya timeline */}
              <div className="rounded-lg border border-gray-300 bg-white p-3 sm:p-4">
                <div className="flex flex-col">
                  {fasilitas.map((item, index) => {
                    const isLast = index === fasilitas.length - 1;
                    return (
                      <div
                        key={index}
                        className="relative flex items-center gap-2.5 pb-2.5 last:pb-0"
                      >
                        {/* Garis vertikal tipis penghubung timeline */}
                        {!isLast && (
                          <span
                            className="absolute left-[3.5px] top-[14px] -bottom-2 w-[1px] bg-gray-300"
                            aria-hidden="true"
                          />
                        )}
                        {/* Titik bullet hitam di setiap baris */}
                        <span
                          className="relative z-10 size-[8px] shrink-0 rounded-full bg-black"
                          aria-hidden="true"
                        />
                        {/* Input teks fasilitas */}
                        <input
                          ref={(el) => {
                            facilityInputRefs.current[index] = el;
                          }}
                          type="text"
                          value={item}
                          onChange={(e) =>
                            handleFasilitasChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleFasilitasKeyDown(e, index)}
                          onBlur={() => handleFasilitasBlur(index)}
                          placeholder="Ketik disini"
                          aria-label={`Fasilitas ${index + 1}`}
                          className="h-[30px] w-full rounded border border-gray-300 px-2.5 text-[13px] text-gray-800 placeholder:text-gray-400 outline-none transition-colors focus:border-[#0F5A96] focus:ring-1 focus:ring-[#0F5A96]"
                        />
                        {/* Tombol hapus baris fasilitas */}
                        {fasilitas.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFasilitas(index)}
                            aria-label={`Hapus baris fasilitas ${index + 1}`}
                            className="p-1 text-gray-400 transition-colors hover:text-red-500 focus:outline-none"
                          >
                            <FaTimes className="size-3" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Foto Ruangan & Tombol Aksi */}
            <div className="flex flex-col">
              <h3 className="mb-2 text-sm font-bold text-gray-900 sm:text-base">
                Foto Ruangan
              </h3>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Pilih foto ruangan"
              />

              {/* Area unggah foto berbentuk persegi/kotak biru (#0F5A96) */}
              {fotoPreview ? (
                <div className="relative flex h-[160px] w-full flex-col overflow-hidden rounded-lg border border-gray-300 bg-gray-50 shadow-sm sm:h-[180px]">
                  <Image
                    src={fotoPreview}
                    alt="Preview foto ruangan"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex flex-col justify-between bg-black/30 p-2.5 transition-opacity hover:bg-black/40">
                    <div className="flex justify-between items-start">
                      <span className="max-w-[70%] truncate rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                        {fotoFile ? fotoFile.name : "Foto terpilih"}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        aria-label="Hapus foto"
                        className="rounded-full bg-red-600 p-1.5 text-white shadow hover:bg-red-700 focus:outline-none"
                      >
                        <FaTimes className="size-3" aria-hidden="true" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="self-center rounded bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 shadow transition-colors hover:bg-white"
                    >
                      Ganti Foto
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  aria-label="Unggah foto ruangan"
                  className="group flex h-[160px] w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-[#0F5A96] p-4 text-white shadow-sm transition-all duration-150 hover:bg-[#0c4777] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5A96] sm:h-[180px]"
                >
                  <FolderUp
                    className="size-14 text-white transition-transform duration-200 group-hover:scale-105"
                    aria-hidden="true"
                  />
                  <span className="mt-2 text-xs font-semibold text-white/90">
                    Unggah Foto Ruangan
                  </span>
                  <span className="mt-0.5 text-[11px] text-white/70">
                    Klik untuk memilih file gambar
                  </span>
                </div>
              )}

              {/* Tombol Aksi (Kanan Bawah) */}
              <div className="mt-6 flex items-center justify-end gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={handleSafeClose}
                  className="flex h-[36px] min-w-[90px] items-center justify-center rounded-md bg-[#C00000] px-5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#9c0000] hover:shadow active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C00000]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex h-[36px] min-w-[90px] items-center justify-center rounded-md bg-[#14A91F] px-5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#108c19] hover:shadow active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14A91F]"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RoomAddModal({
  open,
  onClose,
  onSave,
  defaultGedung = "BNI",
}: RoomAddModalProps) {
  const isClient = useIsClient();
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Simpan trigger elemen fokus saat modal dibuka
  useEffect(() => {
    if (open) {
      triggerElementRef.current = document.activeElement as HTMLElement;
    } else if (triggerElementRef.current) {
      triggerElementRef.current.focus();
    }
  }, [open]);

  // Kunci scroll body saat modal terbuka
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!isClient || !open) {
    return null;
  }

  return createPortal(
    <RoomAddFormContent
      key={open ? "open" : "closed"}
      onClose={onClose}
      onSave={onSave}
      defaultGedung={defaultGedung}
    />,
    document.body
  );
}
