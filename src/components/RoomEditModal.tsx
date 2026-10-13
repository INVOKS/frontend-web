"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { Ruangan } from "@/lib/ruangan-data";

export type RoomEditModalProps = {
  room: Ruangan | null;
  open: boolean;
  onClose: () => void;
  onSave: (room: Ruangan) => void;
};

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

type RoomEditFormContentProps = {
  room: Ruangan;
  onClose: () => void;
  onSave: (room: Ruangan) => void;
};

function RoomEditFormContent({
  room,
  onClose,
  onSave,
}: RoomEditFormContentProps) {
  const modalBoxRef = useRef<HTMLDivElement>(null);
  const lantaiInputRef = useRef<HTMLInputElement>(null);

  // Inisialisasi state draft dari room (reset otomatis via key={room.id})
  const [lantai, setLantai] = useState(String(room.lantai));
  const [kapasitas, setKapasitas] = useState(String(room.kapasitas));
  const [deskripsi, setDeskripsi] = useState(room.deskripsi || "");
  const [fasilitasItems, setFasilitasItems] = useState<string[]>(
    room.fasilitas ? [...room.fasilitas] : []
  );
  const [newFasilitasInput, setNewFasilitasInput] = useState("");

  // Pindahkan fokus awal ke input Lantai saat pertama kali dibuka
  useEffect(() => {
    const timer = setTimeout(() => {
      lantaiInputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Cek apakah ada perubahan yang belum disimpan (dirty state)
  const isDirty = () => {
    const initialLantai = String(room.lantai);
    const initialKapasitas = String(room.kapasitas);
    const initialDeskripsi = (room.deskripsi || "").trim();
    const initialFasilitas = room.fasilitas || [];

    if (lantai.trim() !== initialLantai.trim()) return true;
    if (kapasitas.trim() !== initialKapasitas.trim()) return true;
    if (deskripsi.trim() !== initialDeskripsi) return true;
    if (newFasilitasInput.trim() !== "") return true;

    if (fasilitasItems.length !== initialFasilitas.length) return true;
    for (let i = 0; i < fasilitasItems.length; i++) {
      if (fasilitasItems[i].trim() !== (initialFasilitas[i] || "").trim()) {
        return true;
      }
    }

    return false;
  };

  // Tutup dengan konfirmasi jika ada perubahan yang belum disimpan
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

  // Validasi form
  const lantaiNum = parseInt(lantai.trim(), 10);
  const isLantaiValid = !isNaN(lantaiNum) && lantaiNum >= 1;
  const lantaiError = !lantai.trim()
    ? "Lantai wajib diisi"
    : !isLantaiValid
    ? "Lantai harus berupa angka bulat minimal 1"
    : "";

  const kapasitasNum = parseInt(kapasitas.trim(), 10);
  const isKapasitasValid = !isNaN(kapasitasNum) && kapasitasNum >= 1;
  const kapasitasError = !kapasitas.trim()
    ? "Kapasitas wajib diisi"
    : !isKapasitasValid
    ? "Kapasitas harus berupa angka minimal 1"
    : "";

  const isFormValid = isLantaiValid && isKapasitasValid;

  // Handler fasilitas dinamis
  const handleEditFasilitas = (index: number, value: string) => {
    setFasilitasItems((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleBlurFasilitas = (index: number) => {
    setFasilitasItems((prev) => {
      const item = prev[index];
      if (!item || item.trim() === "") {
        return prev.filter((_, i) => i !== index);
      }
      return prev;
    });
  };

  const handleRemoveFasilitas = (index: number) => {
    setFasilitasItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddFasilitas = () => {
    const trimmed = newFasilitasInput.trim();
    if (!trimmed) return;

    // Hindari duplikat tanpa memperhatikan huruf besar/kecil
    const isDuplicate = fasilitasItems.some(
      (item) => item.trim().toLowerCase() === trimmed.toLowerCase()
    );

    if (!isDuplicate) {
      setFasilitasItems((prev) => [...prev, trimmed]);
    }

    setNewFasilitasInput("");
  };

  // Submit Simpan
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    // Bersihkan daftar fasilitas
    const cleanedFasilitas = fasilitasItems
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    // Jika ada teks di input tambah yang belum di-submit, sertakan jika bukan duplikat
    if (newFasilitasInput.trim()) {
      const trimmedNew = newFasilitasInput.trim();
      const exists = cleanedFasilitas.some(
        (f) => f.toLowerCase() === trimmedNew.toLowerCase()
      );
      if (!exists) {
        cleanedFasilitas.push(trimmedNew);
      }
    }

    const updatedRoom: Ruangan = {
      ...room,
      lantai: lantaiNum,
      kapasitas: kapasitasNum,
      min: kapasitasNum,
      max: Math.max(kapasitasNum, room.max || kapasitasNum),
      deskripsi: deskripsi.trim(),
      fasilitas: cleanedFasilitas,
    };

    onSave(updatedRoom);
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
        aria-labelledby="room-edit-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-[840px] max-h-[90vh] flex-col overflow-y-auto rounded-lg bg-white p-6 shadow-2xl transition-all duration-200 focus:outline-none sm:p-8 md:p-9"
      >
        {/* Tombol Close (X) */}
        <button
          type="button"
          onClick={handleSafeClose}
          aria-label="Tutup form edit ruangan"
          className="absolute right-5 top-5 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar"
        >
          <FaTimes className="size-4 sm:size-5" aria-hidden="true" />
        </button>

        {/* Judul: Nama Ruangan (Readonly) */}
        <h2
          id="room-edit-modal-title"
          className="text-center text-2xl font-bold tracking-tight text-gray-900"
        >
          {room.nama || room.name}
        </h2>

        {/* Form Isi Dua Kolom */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {/* Kolom Kiri: Foto Ruangan & Deskripsi */}
            <div className="flex flex-col">
              {/* Foto Ruangan (Tidak dapat diubah) */}
              <div className="relative h-[240px] w-full overflow-hidden rounded-md border border-gray-100 bg-gray-100 shadow-xs sm:h-[275px]">
                <Image
                  src={room.gambar || room.imageUrl || "/images/ruangan.jpg"}
                  alt={room.nama || room.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Heading Deskripsi Ruangan */}
              <h3 className="mt-5 mb-2 text-sm font-bold text-gray-900 sm:text-base">
                Deskripsi Ruangan
              </h3>

              {/* Textarea Deskripsi */}
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Masukkan deskripsi ruangan..."
                className="h-[100px] min-h-[100px] w-full resize-none rounded-lg border border-gray-300 p-3.5 text-[13px] leading-relaxed text-gray-700 outline-none transition-colors focus:border-sidebar focus:ring-1 focus:ring-sidebar"
              />
            </div>

            {/* Kolom Kanan: Informasi, Fasilitas, & Tombol Simpan */}
            <div className="flex flex-col">
              {/* Heading Informasi Ruangan */}
              <h3 className="mb-2 text-sm font-bold text-gray-900 sm:text-base">
                Informasi Ruangan
              </h3>

              {/* Input Lantai */}
              <div className="flex flex-col">
                <label
                  htmlFor="edit-lantai"
                  className="mb-1 text-xs font-semibold text-gray-700"
                >
                  Lantai
                </label>
                <input
                  id="edit-lantai"
                  ref={lantaiInputRef}
                  type="text"
                  value={lantai}
                  onChange={(e) => setLantai(e.target.value)}
                  placeholder="Contoh: 1"
                  className={`h-[38px] w-full rounded border px-3 text-[13px] text-gray-800 outline-none transition-colors ${
                    lantaiError
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-400 focus:border-sidebar focus:ring-1 focus:ring-sidebar"
                  }`}
                />
                {lantaiError && (
                  <span className="mt-1 text-[11px] text-red-500">
                    {lantaiError}
                  </span>
                )}
              </div>

              {/* Input Kapasitas */}
              <div className="mt-3 flex flex-col">
                <label
                  htmlFor="edit-kapasitas"
                  className="mb-1 text-xs font-semibold text-gray-700"
                >
                  Kapasitas
                </label>
                <div className="relative flex items-center">
                  <input
                    id="edit-kapasitas"
                    type="number"
                    min="1"
                    value={kapasitas}
                    onChange={(e) => setKapasitas(e.target.value)}
                    placeholder="80"
                    className={`h-[38px] w-full rounded border pl-3 pr-16 text-[13px] text-gray-800 outline-none transition-colors ${
                      kapasitasError
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-400 focus:border-sidebar focus:ring-1 focus:ring-sidebar"
                    }`}
                  />
                  <span className="pointer-events-none absolute right-3 text-[13px] text-gray-500">
                    orang
                  </span>
                </div>
                {kapasitasError && (
                  <span className="mt-1 text-[11px] text-red-500">
                    {kapasitasError}
                  </span>
                )}
              </div>

              {/* Heading Fasilitas Ruangan */}
              <h3 className="mt-5 mb-2 text-sm font-bold text-gray-900 sm:text-base">
                Fasilitas Ruangan
              </h3>

              {/* Kotak Fasilitas (Gaya Timeline) */}
              <div className="rounded border border-gray-300 bg-white p-2.5 sm:p-3">
                <div className="flex flex-col">
                  {fasilitasItems.map((item, index) => (
                    <div
                      key={index}
                      className="relative flex items-center gap-2.5 pb-2"
                    >
                      {/* Garis vertikal timeline penghubung */}
                      <span
                        className="absolute left-[3.5px] top-[14px] -bottom-2 w-[1px] bg-gray-300"
                        aria-hidden="true"
                      />
                      {/* Titik bullet hitam */}
                      <span
                        className="relative z-10 size-[8px] shrink-0 rounded-full bg-black"
                        aria-hidden="true"
                      />
                      {/* Input teks fasilitas */}
                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          handleEditFasilitas(index, e.target.value)
                        }
                        onBlur={() => handleBlurFasilitas(index)}
                        aria-label={`Nama fasilitas ${index + 1}`}
                        className="h-[28px] w-full max-w-[85%] rounded border border-gray-300 px-2 text-[13px] text-gray-700 outline-none transition-colors focus:border-sidebar"
                      />
                      {/* Tombol hapus item */}
                      <button
                        type="button"
                        onClick={() => handleRemoveFasilitas(index)}
                        aria-label={`Hapus fasilitas ${item}`}
                        className="p-1 text-gray-400 transition-colors hover:text-red-500 focus:outline-none"
                      >
                        <FaTimes className="size-3" aria-hidden="true" />
                      </button>
                    </div>
                  ))}

                  {/* Baris Input Tambah Disini */}
                  <div className="relative flex items-center gap-2.5">
                    {/* Titik bullet hitam */}
                    <span
                      className="relative z-10 size-[8px] shrink-0 rounded-full bg-black"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      placeholder="Tambah disini"
                      value={newFasilitasInput}
                      onChange={(e) => setNewFasilitasInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddFasilitas();
                        }
                      }}
                      onBlur={handleAddFasilitas}
                      aria-label="Tambah fasilitas baru"
                      className="h-[28px] w-full max-w-[85%] rounded border border-gray-300 px-2 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none transition-colors focus:border-sidebar"
                    />
                  </div>
                </div>
              </div>

              {/* Tombol Simpan Rata Kanan */}
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="flex h-[36px] w-[125px] items-center justify-center rounded-md bg-[#0F5A96] text-base font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#0c4777] hover:shadow active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5A96]"
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

export default function RoomEditModal({
  room,
  open,
  onClose,
  onSave,
}: RoomEditModalProps) {
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

  if (!isClient || !open || !room) {
    return null;
  }

  return createPortal(
    <RoomEditFormContent
      key={room.id}
      room={room}
      onClose={onClose}
      onSave={onSave}
    />,
    document.body
  );
}
