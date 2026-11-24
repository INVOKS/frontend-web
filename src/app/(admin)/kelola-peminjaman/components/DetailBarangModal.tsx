"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  FaCalendarAlt,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
} from "react-icons/fa";
import {
  Peminjaman,
  StatusPengembalianBarang,
} from "@/lib/peminjaman-data";

export type DetailBarangModalProps = {
  data: Peminjaman | null;
  open: boolean;
  onClose: () => void;
  onStatusChange?: (
    peminjamanId: string,
    itemIndex: number,
    newStatus: StatusPengembalianBarang
  ) => void;
};

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function DetailBarangModal({
  data,
  open,
  onClose,
  onStatusChange,
}: DetailBarangModalProps) {
  const isClient = useIsClient();
  const [openDropdownIdx, setOpenDropdownIdx] = useState<number | null>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  // Kunci scroll body saat modal terbuka
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(e.target as Node)
      ) {
        setOpenDropdownIdx(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tangani tombol ESC untuk menutup modal
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (openDropdownIdx !== null) {
          setOpenDropdownIdx(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, openDropdownIdx, onClose]);

  if (!isClient || !open || !data) return null;

  const isSelesai = data.status === "selesai";

  const modalContent = (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[1px] animate-fadeIn"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="peminjaman-barang-detail-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-[460px] max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-200 focus:outline-none"
      >
        {/* ── Header Modal ─────────────────────────────────────────── */}
        <div
          className={`relative px-6 py-4 flex items-center justify-center ${
            isSelesai ? "bg-[#9E9E9E]" : "bg-[#FFC400]"
          }`}
        >
          <h2
            id="peminjaman-barang-detail-title"
            className={`text-lg font-bold text-center tracking-wide ${
              isSelesai ? "text-white" : "text-black"
            }`}
          >
            {data.namaPeminjam}
          </h2>

          {/* Tombol Tutup (X) */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pop-up"
            className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 transition-colors focus:outline-none ${
              isSelesai
                ? "text-white hover:bg-black/10"
                : "text-black hover:bg-black/10"
            }`}
          >
            <FaTimes className="size-4" />
          </button>
        </div>

        {/* ── Body Modal (Scrollable jika konten panjang) ───────────── */}
        <div
          ref={dropdownContainerRef}
          className="p-6 overflow-y-auto flex flex-col gap-4"
        >
          {/* Read-Only: Tanggal */}
          <div className="flex items-start gap-2">
            <span className="text-xs font-semibold text-gray-700 w-16 mt-1 shrink-0">
              Tanggal
            </span>
            <span className="text-gray-400 text-xs mt-1 mr-1 shrink-0">:</span>
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-center gap-2 h-[30px] border border-gray-300 rounded px-2.5 text-xs text-gray-700 bg-gray-50 select-none cursor-not-allowed">
                <FaCalendarAlt className="text-gray-400 text-xs shrink-0" />
                <span>{data.tanggalMulai}</span>
              </div>
              <div className="flex items-center gap-2 h-[30px] border border-gray-300 rounded px-2.5 text-xs text-gray-700 bg-gray-50 select-none cursor-not-allowed">
                <FaCalendarAlt className="text-gray-400 text-xs shrink-0" />
                <span>{data.tanggalSelesai}</span>
              </div>
            </div>
          </div>

          {/* Read-Only: Waktu */}
          <div className="flex items-start gap-2">
            <span className="text-xs font-semibold text-gray-700 w-16 mt-1 shrink-0">
              Waktu
            </span>
            <span className="text-gray-400 text-xs mt-1 mr-1 shrink-0">:</span>
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-center gap-2 h-[30px] border border-gray-300 rounded px-2.5 text-xs text-gray-700 bg-gray-50 select-none cursor-not-allowed">
                <FaClock className="text-gray-400 text-xs shrink-0" />
                <span>{data.waktuMulai}</span>
              </div>
              <div className="flex items-center gap-2 h-[30px] border border-gray-300 rounded px-2.5 text-xs text-gray-700 bg-gray-50 select-none cursor-not-allowed">
                <FaClock className="text-gray-400 text-xs shrink-0" />
                <span>{data.waktuSelesai}</span>
              </div>
            </div>
          </div>

          {/* Detail Barang */}
          <div className="mt-2">
            <h3 className="text-xs font-bold text-gray-800 mb-2">
              Detail Barang
            </h3>

            {(!data.detailBarang || data.detailBarang.length === 0) ? (
              <p className="text-xs text-gray-500 italic">
                Tidak ada detail barang.
              </p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {data.detailBarang.map((item, idx) => {
                  const isDropdownOpen = openDropdownIdx === idx;
                  const currentStatus = item.statusPengembalian;
                  const displayStatusLabel =
                    currentStatus === "dikembalikan"
                      ? "Dikembalikan"
                      : currentStatus === "dipinjam"
                      ? "Dipinjam"
                      : "Status peminjaman";

                  return (
                    <div key={idx} className="flex items-center gap-2.5">
                      {/* Timeline dot & line */}
                      <div className="relative flex flex-col items-center self-stretch">
                        <span className="mt-[15px] size-2 rounded-full bg-gray-700 shrink-0 z-10" />
                        {idx < (data.detailBarang?.length ?? 0) - 1 && (
                          <span className="flex-1 w-px bg-gray-300 mt-1" />
                        )}
                      </div>

                      {/* Card Item Barang */}
                      <div className="relative flex items-center justify-between flex-1 border border-gray-300 rounded-md p-2 bg-white shadow-xs">
                        {/* Kiri: Foto, Nama, Kode */}
                        <div className="flex items-center gap-2.5">
                          <div className="relative size-[46px] shrink-0 overflow-hidden rounded bg-gray-100 border border-gray-100">
                            <Image
                              src={item.gambar}
                              alt={item.nama}
                              fill
                              className="object-cover"
                              sizes="46px"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800 leading-tight">
                              {item.nama}
                            </p>
                            <p className="text-[11px] text-gray-500">
                              {item.kode}
                            </p>
                          </div>
                        </div>

                        {/* Kanan: Dropdown Status Peminjaman */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenDropdownIdx(
                                isDropdownOpen ? null : idx
                              )
                            }
                            className={`flex items-center justify-between gap-2 min-w-[135px] h-[32px] px-3 border rounded text-[11px] font-medium transition-colors bg-white focus:outline-none ${
                              isDropdownOpen
                                ? "border-gray-800 ring-1 ring-gray-800 text-gray-900"
                                : "border-gray-300 hover:border-gray-400 text-gray-700"
                            }`}
                          >
                            <span className="truncate">
                              {displayStatusLabel}
                            </span>
                            {isDropdownOpen ? (
                              <FaChevronUp className="text-[10px] text-gray-600 shrink-0" />
                            ) : (
                              <FaChevronDown className="text-[10px] text-gray-600 shrink-0" />
                            )}
                          </button>

                          {/* Menu Dropdown */}
                          {isDropdownOpen && (
                            <div className="absolute right-0 top-full mt-1 w-[135px] bg-white border border-gray-300 rounded shadow-lg z-30 overflow-hidden">
                              <button
                                type="button"
                                onClick={() => {
                                  onStatusChange?.(data.id, idx, "dipinjam");
                                  setOpenDropdownIdx(null);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-gray-100 flex items-center justify-between ${
                                  currentStatus === "dipinjam"
                                    ? "bg-gray-50 font-semibold text-gray-900"
                                    : "text-gray-700"
                                }`}
                              >
                                <span>Dipinjam</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onStatusChange?.(
                                    data.id,
                                    idx,
                                    "dikembalikan"
                                  );
                                  setOpenDropdownIdx(null);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-gray-100 border-t border-gray-100 flex items-center justify-between ${
                                  currentStatus === "dikembalikan"
                                    ? "bg-gray-50 font-semibold text-gray-900"
                                    : "text-gray-700"
                                }`}
                              >
                                <span>Dikembalikan</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
