"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { Barang, KategoriBarang } from "@/lib/barang-data";

export type BarangAddModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (newBarang: Barang) => void;
  defaultKategori: KategoriBarang;
};

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function BarangAddModal({
  open,
  onClose,
  onSave,
  defaultKategori,
}: BarangAddModalProps) {
  const isClient = useIsClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nama, setNama] = useState("");
  const [detail, setDetail] = useState("");
  const [kodeBarang, setKodeBarang] = useState("");
  const [kategori, setKategori] = useState<KategoriBarang>(defaultKategori);
  const [specs, setSpecs] = useState<string[]>(["", "", ""]);

  // Foto Barang State
  const [gambarPreview, setGambarPreview] = useState<string>("");

  useEffect(() => {
    if (open) {
      setNama("");
      setDetail("");
      setKodeBarang("");
      setKategori(defaultKategori);
      setSpecs(["", "", ""]);
      setGambarPreview("");
    }
  }, [open, defaultKategori]);

  // Handle ESC
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Lock scroll
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!isClient || !open) return null;

  // Upload file foto langsung
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar (jpg, png, webp, dll.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5 MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setGambarPreview(objectUrl);
    e.target.value = "";
  };

  const handleSpecChange = (index: number, val: string) => {
    setSpecs((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const isFormValid =
    nama.trim().length > 0 &&
    detail.trim().length > 0 &&
    kodeBarang.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("Mohon lengkapi Nama Barang, Detail Barang, dan Kode Barang.");
      return;
    }

    const cleanedSpecs = specs.map((s) => s.trim()).filter((s) => s.length > 0);

    const fallbackImg =
      kategori === "ELEKTRONIK" ? "/images/Barang E1.png" : "/images/Barang F1.png";

    const newBarang: Barang = {
      id: `barang-${Date.now()}`,
      nama: nama.trim(),
      kategori,
      kodeBarang: kodeBarang.trim().toUpperCase(),
      kodeList: [kodeBarang.trim().toUpperCase()],
      gambar: gambarPreview || fallbackImg,
      detail: detail.trim(),
      spesifikasi:
        cleanedSpecs.length > 0 ? cleanedSpecs : ["Kondisi: Siap Digunakan"],
    };

    onSave(newBarang);
  };

  const modalContent = (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[1px] animate-fadeIn"
    >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tambah-barang-title"
          onClick={(e) => e.stopPropagation()}
          className="relative flex w-full max-w-[760px] flex-col rounded-2xl bg-white p-7 sm:p-9 shadow-2xl"
        >
          {/* Tombol Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <FaTimes className="size-4" />
          </button>

          {/* Judul: Tambah Barang (Sesuai Image 2) */}
          <h2
            id="tambah-barang-title"
            className="text-center text-2xl font-bold tracking-tight text-gray-900"
          >
            Tambah Barang
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col">
            {/* 1. Nama Barang */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-gray-800">
                Nama Barang
              </label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Ketik disini"
                className="h-[38px] w-full rounded-md border border-gray-400 px-3.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#006199]"
              />
            </div>

            {/* 2. Detail Barang */}
            <div className="mt-4 flex flex-col">
              <label className="mb-1 text-sm font-semibold text-gray-800">
                Detail Barang
              </label>
              <input
                type="text"
                required
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Ketik disini"
                className="h-[38px] w-full rounded-md border border-gray-400 px-3.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#006199]"
              />
            </div>

            {/* 3. Baris Bawah: Spesifikasi (Col 1), Kode & Kategori (Col 2), Foto Barang (Col 3) */}
            <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-12 items-start">
              {/* Kolom 1: Spesifikasi Barang (Timeline dengan 3 input) */}
              <div className="md:col-span-5 flex flex-col">
                <label className="mb-1 text-sm font-semibold text-gray-800">
                  Spesifikasi Barang
                </label>
                <div className="rounded-md border border-gray-400 bg-white p-3">
                  <div className="flex flex-col space-y-2">
                    {specs.map((spec, i) => {
                      const isLast = i === specs.length - 1;
                      return (
                        <div key={i} className="relative flex items-center gap-2">
                          {!isLast && (
                            <span
                              className="absolute left-[3.5px] top-[14px] -bottom-2 w-[1px] bg-gray-300"
                              aria-hidden="true"
                            />
                          )}
                          <span
                            className="relative z-10 size-[8px] shrink-0 rounded-full bg-black"
                            aria-hidden="true"
                          />
                          <input
                            type="text"
                            value={spec}
                            onChange={(e) => handleSpecChange(i, e.target.value)}
                            placeholder="Ketik disini"
                            className="h-[30px] w-full rounded border border-gray-300 px-2.5 text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#006199]"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Kolom 2: Kode Barang & Kategori Barang */}
              <div className="md:col-span-4 flex flex-col justify-between h-full space-y-3">
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-gray-800">
                    Kode Barang
                  </label>
                  <input
                    type="text"
                    required
                    value={kodeBarang}
                    onChange={(e) => setKodeBarang(e.target.value)}
                    placeholder="Ketik disini"
                    className="h-[38px] w-full rounded-md border border-gray-400 px-3.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#006199]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-gray-800">
                    Kategori Barang
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as KategoriBarang)}
                    className="h-[38px] w-full rounded-md border border-gray-400 bg-white px-3.5 text-sm text-gray-800 outline-none focus:border-[#006199]"
                  >
                    <option value="FURNITUR">Furniture</option>
                    <option value="ELEKTRONIK">Elektronik</option>
                  </select>
                </div>
              </div>

              {/* Kolom 3: Foto Barang (Kotak Biru dengan Ikon Folder Panah Atas sesuai Image 2) */}
              <div className="md:col-span-3 flex flex-col items-center sm:items-start">
                <label className="mb-1 text-sm font-semibold text-gray-800">
                  Foto Barang
                </label>

                {!gambarPreview ? (
                  /* Tombol Biru Folder Panah Atas (Sesuai Image 2) */
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                    className="flex h-[100px] w-[110px] cursor-pointer items-center justify-center rounded-xl bg-[#006199] shadow-sm transition hover:bg-[#004f7e] active:scale-95"
                    title="Pilih Foto Barang"
                  >
                    <svg
                      className="size-11 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
                      <path d="M12 9.5l-3.5 3.5h2.5v3.5h2v-3.5h2.5z" />
                    </svg>
                  </div>
                ) : (
                  /* Preview Foto langsung setelah dipilih */
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                    className="group relative h-[100px] w-[110px] cursor-pointer overflow-hidden rounded-xl border border-gray-300 shadow-sm"
                    title="Klik untuk ganti foto"
                  >
                    <Image
                      src={gambarPreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized={gambarPreview.startsWith("data:") || gambarPreview.startsWith("blob:")}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[11px] font-semibold text-white">Ganti</span>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* 4. Tombol Aksi: Batal (Merah) & Simpan (Hijau) (Sesuai Image 2) */}
            <div className="mt-8 flex justify-end gap-3.5">
              <button
                type="button"
                onClick={onClose}
                className="flex h-[38px] w-[95px] items-center justify-center rounded-lg bg-[#B00000] text-sm font-semibold text-white shadow-sm transition hover:bg-[#900000] active:scale-95"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex h-[38px] w-[95px] items-center justify-center rounded-lg bg-[#009E2B] text-sm font-semibold text-white shadow-sm transition hover:bg-[#008223] active:scale-95"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
  );

  return createPortal(modalContent, document.body);
}
