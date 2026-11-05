"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FaChevronDown, FaPencilAlt, FaTimes, FaTrashAlt } from "react-icons/fa";
import { Barang } from "@/lib/barang-data";

export type BarangDetailModalProps = {
  barang: Barang | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (barang: Barang) => void;
  onDelete?: (barang: Barang) => void;
};

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function BarangDetailModal({
  barang,
  open,
  onClose,
  onEdit,
  onDelete,
}: BarangDetailModalProps) {
  const isClient = useIsClient();
  const modalBoxRef = useRef<HTMLDivElement>(null);
  const [selectedKode, setSelectedKode] = useState<string>("");

  useEffect(() => {
    if (barang) {
      setSelectedKode(barang.kodeBarang || barang.kodeList?.[0] || "");
    }
  }, [barang]);

  // Kunci scroll body saat modal terbuka
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // Tangani tombol ESC
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!isClient || !open || !barang) return null;

  const handleEditClick = () => {
    if (onEdit) onEdit(barang);
  };

  const handleDeleteClick = () => {
    const isConfirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus barang "${barang.nama}"?`
    );
    if (isConfirmed && onDelete) {
      onDelete(barang);
    }
  };

  const kodeOptions =
    barang.kodeList && barang.kodeList.length > 0
      ? barang.kodeList
      : [barang.kodeBarang || "BRG_01"];

  const modalContent = (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-[1px] animate-fadeIn"
    >
      <div
        ref={modalBoxRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="barang-detail-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-[840px] max-h-[90vh] flex-col overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200 focus:outline-none sm:p-8 md:p-9"
      >
        {/* Tombol Close (X) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail barang"
          className="absolute right-5 top-5 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
        >
          <FaTimes className="size-4 sm:size-5" aria-hidden="true" />
        </button>

        {/* Judul: Nama Barang (UPPERCASE) */}
        <h2
          id="barang-detail-title"
          className="text-center text-2xl font-extrabold tracking-wide text-gray-900 uppercase"
        >
          {barang.nama}
        </h2>

        {/* Layout Dua Kolom */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {/* Kolom Kiri: Foto & Kode Barang */}
          <div className="flex flex-col">
            {/* Foto Barang */}
            <div className="relative w-full aspect-[4/3] max-h-[250px] overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-xs">
              <Image
                src={barang.gambar || "/images/Barang E1.png"}
                alt={barang.nama}
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
                priority
                unoptimized={barang.gambar.startsWith("blob:")}
              />
            </div>

            {/* Heading Kode Barang */}
            <h3 className="mt-5 mb-2 text-sm font-bold text-gray-900 sm:text-base">
              Kode Barang
            </h3>

            {/* Dropdown Kode Barang */}
            <div className="relative">
              <select
                value={selectedKode}
                onChange={(e) => setSelectedKode(e.target.value)}
                aria-label="Pilih kode barang"
                className="h-[42px] w-full rounded-lg border border-gray-300 bg-white px-3.5 pr-10 text-[13px] font-semibold text-gray-800 outline-none appearance-none transition-colors focus:border-[#0F5A96] focus:ring-1 focus:ring-[#0F5A96] cursor-pointer"
              >
                {kodeOptions.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600">
                <FaChevronDown className="size-3.5" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Detail, Spesifikasi, & Tombol Aksi */}
          <div className="flex flex-col">
            {/* Heading Detail Barang */}
            <h3 className="mb-2 text-sm font-bold text-gray-900 sm:text-base">
              Detail Barang
            </h3>

            {/* Kotak Detail Barang */}
            <div className="min-h-[85px] rounded-lg border border-gray-300 bg-white p-3.5 sm:p-4">
              <p className="text-[13px] leading-relaxed text-gray-700">
                {barang.detail}
              </p>
            </div>

            {/* Heading Spesifikasi Barang */}
            <h3 className="mt-5 mb-2 text-sm font-bold text-gray-900 sm:text-base">
              Spesifikasi Barang
            </h3>

            {/* Kotak Spesifikasi Barang */}
            <div className="min-h-[140px] rounded-lg border border-gray-300 bg-white p-3.5 sm:p-4">
              <ul className="space-y-1.5 text-[13px] text-gray-700">
                {barang.spesifikasi.map((spec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span
                      className="mt-[6px] size-[5px] shrink-0 rounded-full bg-gray-700"
                      aria-hidden="true"
                    />
                    <span className="leading-snug">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tombol Aksi: Edit & Hapus */}
            <div className="mt-6 flex items-center justify-end gap-4">
              {/* Tombol Edit */}
              <button
                type="button"
                onClick={handleEditClick}
                aria-label="Edit barang"
                className="flex size-[48px] items-center justify-center rounded-md bg-[#14A91F] text-white shadow-sm transition-all duration-150 hover:bg-[#118f1a] hover:shadow active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14A91F]"
              >
                <FaPencilAlt className="size-5" aria-hidden="true" />
              </button>

              {/* Tombol Hapus */}
              <button
                type="button"
                onClick={handleDeleteClick}
                aria-label="Hapus barang"
                className="flex size-[48px] items-center justify-center rounded-md bg-[#B00000] text-white shadow-sm transition-all duration-150 hover:bg-[#940000] hover:shadow active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B00000]"
              >
                <FaTrashAlt className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

