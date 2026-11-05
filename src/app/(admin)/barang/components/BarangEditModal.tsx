"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  FaCamera,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import { Barang } from "@/lib/barang-data";

export type BarangEditModalProps = {
  barang: Barang | null;
  open: boolean;
  onClose: () => void;
  onSave: (barang: Barang) => void;
};

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

type BarangEditFormContentProps = {
  barang: Barang;
  onClose: () => void;
  onSave: (barang: Barang) => void;
};

function BarangEditFormContent({
  barang,
  onClose,
  onSave,
}: BarangEditFormContentProps) {
  const modalBoxRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nama, setNama] = useState(barang.nama);
  const [detail, setDetail] = useState(barang.detail);
  const [spesifikasiItems, setSpesifikasiItems] = useState<string[]>(
    barang.spesifikasi ? [...barang.spesifikasi] : []
  );
  const [newSpecInput, setNewSpecInput] = useState("");

  // Kode Barang & Unit List
  const [isKodeDropdownOpen, setIsKodeDropdownOpen] = useState(false);
  const [kodeList, setKodeList] = useState<string[]>(() => {
    if (barang.kodeList && barang.kodeList.length > 0) {
      return [...barang.kodeList];
    }
    return [barang.kodeBarang || "PK_01"];
  });
  const [activeKode, setActiveKode] = useState<string>(
    barang.kodeBarang || barang.kodeList?.[0] || "PK_01"
  );

  // Foto Barang State
  const [gambarPreview, setGambarPreview] = useState<string>(
    barang.gambar || "/images/Barang E1.png"
  );
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  // Handle upload file baru langsung
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

  // Handler tombol ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Handler Unit / Kode Barang
  const handleUpdateUnit = (index: number, val: string) => {
    setKodeList((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleRemoveUnit = (index: number) => {
    if (kodeList.length <= 1) {
      alert("Minimal harus ada 1 kode barang.");
      return;
    }
    setKodeList((prev) => prev.filter((_, i) => i !== index));
    if (activeKode === kodeList[index]) {
      setActiveKode(kodeList[index === 0 ? 1 : 0]);
    }
  };

  const handleAddUnit = () => {
    const prefix = activeKode.split("_")[0] || "BRG";
    const nextNum = String(kodeList.length + 1).padStart(2, "0");
    const newCode = `${prefix}_${nextNum}`;
    setKodeList((prev) => [...prev, newCode]);
  };

  // Handler Spesifikasi
  const handleEditSpec = (index: number, val: string) => {
    setSpesifikasiItems((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleAddSpecFromInput = () => {
    const trimmed = newSpecInput.trim();
    if (!trimmed) return;
    setSpesifikasiItems((prev) => [...prev, trimmed]);
    setNewSpecInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedSpecs = spesifikasiItems
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (newSpecInput.trim()) {
      cleanedSpecs.push(newSpecInput.trim());
    }

    const cleanedCodes = kodeList
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const updatedBarang: Barang = {
      ...barang,
      nama: nama.trim() || barang.nama,
      kodeBarang: cleanedCodes[0] || activeKode,
      kodeList: cleanedCodes,
      gambar: gambarPreview,
      detail: detail.trim(),
      spesifikasi: cleanedSpecs,
    };

    onSave(updatedBarang);
  };

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-[1px] animate-fadeIn"
    >
      <div
        ref={modalBoxRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="barang-edit-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-[840px] max-h-[92vh] flex-col overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200 focus:outline-none sm:p-8 md:p-9"
      >
          {/* Tombol Close (X) */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup edit barang"
            className="absolute right-5 top-5 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
          >
            <FaTimes className="size-4 sm:size-5" aria-hidden="true" />
          </button>

          {/* Judul: Nama Barang (UPPERCASE sesuai desain Figma) */}
          <h2
            id="barang-edit-title"
            className="text-center text-2xl font-extrabold tracking-wide text-gray-900 uppercase"
          >
            {barang.nama}
          </h2>

          {/* Form Isi Dua Kolom */}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {/* Kolom Kiri: Foto & Dropdown Kode Barang */}
              <div className="flex flex-col">
                {/* Foto Barang – Bisa diklik untuk ganti atau atur posisi/zoom */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Klik untuk ganti foto atau atur tata letak"
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) =>
                    e.key === "Enter" && fileInputRef.current?.click()
                  }
                  onMouseEnter={() => setIsHoveringImage(true)}
                  onMouseLeave={() => setIsHoveringImage(false)}
                  className="relative w-full aspect-[4/3] max-h-[250px] cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006199]"
                >
                  <Image
                    src={gambarPreview}
                    alt={nama}
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover transition-transform duration-300"
                    priority
                    unoptimized={gambarPreview.startsWith("data:") || gambarPreview.startsWith("blob:")}
                  />

                  {/* Overlay hover dengan ikon kamera dan edit posisi */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/45 transition-opacity duration-200"
                    style={{ opacity: isHoveringImage ? 1 : 0 }}
                  >
                    <FaCamera className="size-7 text-white drop-shadow" />
                    <span className="text-xs font-semibold text-white drop-shadow">
                      Klik untuk ganti foto
                    </span>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <p className="mt-1.5 text-center text-[11px] text-gray-400">
                  Klik foto untuk ganti • Maks. 5 MB
                </p>

                {/* Heading Kode Barang */}
                <h3 className="mt-5 mb-2 text-sm font-bold text-gray-900 sm:text-base">
                  Kode Barang
                </h3>

                {/* Dropdown Kode Barang (Expandable sesuai Image 1 & Image 3) */}
                <div className="relative w-full">
                  {!isKodeDropdownOpen ? (
                    /* Tampilan Tertutup (Sesuai Image 3) */
                    <button
                      type="button"
                      onClick={() => setIsKodeDropdownOpen(true)}
                      className="flex h-[42px] w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3.5 text-[13px] font-semibold text-gray-800 transition hover:border-gray-400 focus:outline-none"
                    >
                      <span>{activeKode}</span>
                      <FaChevronDown className="size-3.5 text-gray-600" />
                    </button>
                  ) : (
                    /* Tampilan Terbuka (Sesuai Image 1) */
                    <div className="w-full rounded-lg border border-gray-400 bg-white shadow-sm overflow-hidden animate-fadeIn">
                      {/* Header Dropdown */}
                      <button
                        type="button"
                        onClick={() => setIsKodeDropdownOpen(false)}
                        className="flex h-[40px] w-full items-center justify-between border-b border-gray-300 bg-gray-50/80 px-3.5 text-[13px] font-semibold text-gray-800 transition hover:bg-gray-100"
                      >
                        <span>Kode Barang</span>
                        <FaChevronUp className="size-3.5 text-gray-600" />
                      </button>

                      {/* List Unit / Kode Inventaris */}
                      <div className="flex flex-col p-2 space-y-2 max-h-[180px] overflow-y-auto">
                        {kodeList.map((code, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-2 rounded border border-gray-300 px-3 py-1.5 bg-white"
                          >
                            <input
                              type="text"
                              value={code}
                              onChange={(e) =>
                                handleUpdateUnit(index, e.target.value)
                              }
                              placeholder="Kode Inventaris"
                              className="w-full text-[13px] font-medium text-gray-800 outline-none placeholder:text-gray-400"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveUnit(index)}
                              title="Hapus unit"
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                              <FaTrashAlt className="size-3.5" />
                            </button>
                          </div>
                        ))}

                        {/* Tombol Tambah Unit */}
                        <button
                          type="button"
                          onClick={handleAddUnit}
                          className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gray-700 hover:text-[#006199] transition-colors border-t border-gray-100 mt-1"
                        >
                          <FaPlus className="size-3" />
                          <span>Tambah Unit</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Kolom Kanan: Detail, Spesifikasi, & Tombol Simpan */}
              <div className="flex flex-col">
                {/* Heading Detail Barang */}
                <h3 className="mb-2 text-sm font-bold text-gray-900 sm:text-base">
                  Detail Barang
                </h3>

                {/* Textarea Detail Barang */}
                <textarea
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder="Detail deskripsi barang..."
                  rows={3}
                  className="h-[85px] min-h-[85px] w-full resize-none rounded-lg border border-gray-300 p-3 text-[13px] leading-relaxed text-gray-700 outline-none transition-colors focus:border-[#006199] focus:ring-1 focus:ring-[#006199]"
                />

                {/* Heading Spesifikasi Barang */}
                <h3 className="mt-5 mb-2 text-sm font-bold text-gray-900 sm:text-base">
                  Spesifikasi Barang
                </h3>

                {/* Kotak Spesifikasi Gaya Timeline dengan Input Persegi (Sesuai Image 1) */}
                <div className="rounded-lg border border-gray-300 bg-white p-3">
                  <div className="flex flex-col">
                    {spesifikasiItems.map((spec, index) => {
                      const isLast = index === spesifikasiItems.length - 1;
                      return (
                        <div
                          key={index}
                          className="relative flex items-center gap-3 pb-2.5"
                        >
                          {/* Garis Vertikal Timeline */}
                          <span
                            className="absolute left-[3.5px] top-[14px] -bottom-2 w-[1px] bg-gray-300"
                            aria-hidden="true"
                          />
                          {/* Bullet Titik Hitam */}
                          <span
                            className="relative z-10 size-[8px] shrink-0 rounded-full bg-black"
                            aria-hidden="true"
                          />
                          {/* Input Teks Spesifikasi */}
                          <input
                            type="text"
                            value={spec}
                            onChange={(e) => handleEditSpec(index, e.target.value)}
                            className="h-[32px] w-full rounded border border-gray-300 px-3 text-[12px] text-gray-700 outline-none transition-colors focus:border-[#006199]"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setSpesifikasiItems((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                            className="text-gray-400 hover:text-red-500 p-1"
                            title="Hapus poin"
                          >
                            <FaTimes className="size-3" />
                          </button>
                        </div>
                      );
                    })}

                    {/* Baris Input "Tambah disini" (Sesuai Image 1) */}
                    <div className="relative flex items-center gap-3">
                      <span
                        className="relative z-10 size-[8px] shrink-0 rounded-full bg-gray-400"
                        aria-hidden="true"
                      />
                      <input
                        type="text"
                        placeholder="Tambah disini"
                        value={newSpecInput}
                        onChange={(e) => setNewSpecInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSpecFromInput();
                          }
                        }}
                        onBlur={handleAddSpecFromInput}
                        className="h-[32px] w-full rounded border border-gray-300 px-3 text-[12px] text-gray-700 placeholder:text-gray-400 outline-none transition-colors focus:border-[#006199]"
                      />
                    </div>
                  </div>
                </div>

                {/* Tombol Simpan Biru (Sesuai Image 1 & Image 3) */}
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="flex h-[40px] w-[130px] items-center justify-center rounded-lg bg-[#006199] text-base font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#004f7e] hover:shadow active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006199]"
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

export default function BarangEditModal({
  barang,
  open,
  onClose,
  onSave,
}: BarangEditModalProps) {
  const isClient = useIsClient();

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!isClient || !open || !barang) return null;

  return createPortal(
    <BarangEditFormContent
      key={barang.id}
      barang={barang}
      onClose={onClose}
      onSave={onSave}
    />,
    document.body
  );
}
