"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FaPencilAlt, FaTimes, FaTrashAlt } from "react-icons/fa";
import { Ruangan } from "@/lib/ruangan-data";

export type RoomDetailModalProps = {
  room: Ruangan | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (room: Ruangan) => void;
  onDelete?: (room: Ruangan) => void;
};

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function RoomDetailModal({
  room,
  open,
  onClose,
  onEdit,
  onDelete,
}: RoomDetailModalProps) {
  const isClient = useIsClient();
  const modalBoxRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  /* Simpan elemen pemicu fokus & kembalikan saat modal ditutup */
  useEffect(() => {
    if (open) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      modalBoxRef.current?.focus();
    } else if (triggerElementRef.current) {
      triggerElementRef.current.focus();
    }
  }, [open]);

  /* Kunci scroll body saat modal terbuka */
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  /* Tangani tombol ESC */
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!isClient || !open || !room) return null;

  const handleEditClick = () => {
    if (onEdit) onEdit(room);
  };

  const handleDeleteClick = () => {
    const roomName = room.nama || room.name;
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${roomName}?`)) {
      if (onDelete) onDelete(room);
    }
  };

  const modalContent = (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-[2px] animate-fadeIn"
    >
      <div
        ref={modalBoxRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-detail-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-[860px] max-h-[92vh] flex-col overflow-y-auto rounded-[24px] bg-white p-7 sm:p-9 md:p-10 shadow-2xl transition-all duration-200 focus:outline-none"
      >
        {/* Tombol Tutup (X) di pojok kanan atas */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail ruangan"
          className="absolute right-6 top-6 rounded-full p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
        >
          <FaTimes className="size-5" aria-hidden="true" />
        </button>

        {/* ── Judul Ruangan di Tengah Sesuai Desain ── */}
        <h2
          id="room-detail-modal-title"
          className="text-center text-2xl font-bold tracking-tight text-black sm:text-3xl mb-6"
        >
          {room.nama || room.name}
        </h2>

        {/* ── Layout 2 Kolom ── */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {/* Kolom Kiri: Foto Ruangan & Deskripsi */}
          <div className="flex flex-col">
            {/* Foto Ruangan */}
            <div className="relative h-[250px] w-full overflow-hidden rounded-[18px] bg-gray-100 sm:h-[280px]">
              <Image
                src={room.gambar || room.imageUrl || "/images/ruangan.jpg"}
                alt={room.nama || room.name}
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
                priority
              />
            </div>

            {/* Heading Deskripsi */}
            <h3 className="mt-5 mb-2 font-bold text-base text-black">
              Deskripsi Ruangan
            </h3>

            {/* Kotak Deskripsi */}
            <div className="min-h-[100px] rounded-[14px] border border-gray-300 bg-white p-4">
              <p className="text-[13px] leading-relaxed text-black">
                {room.deskripsi}
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Informasi, Fasilitas & Tombol Aksi */}
          <div className="flex flex-col">
            {/* Heading Informasi Ruangan */}
            <h3 className="mb-2 font-bold text-base text-black">
              Informasi Ruangan
            </h3>

            {/* Kotak Informasi */}
            <div className="flex flex-col gap-2 rounded-[14px] border border-gray-300 bg-white p-4 text-[13px] text-black">
              <div>
                Gedung: {room.gedung}
              </div>
              <div>
                Lantai: {room.lantai}
              </div>
              <div>
                Kapasitas ruangan: {room.kapasitas} orang
              </div>
            </div>

            {/* Heading Fasilitas */}
            <h3 className="mt-5 mb-2 font-bold text-base text-black">
              Fasilitas Ruangan
            </h3>

            {/* Kotak Fasilitas (Gaya Timeline) */}
            <div className="rounded-[14px] border border-gray-300 bg-white p-4">
              <div className="flex flex-col">
                {room.fasilitas.map((item, index) => {
                  const isLast = index === room.fasilitas.length - 1;
                  return (
                    <div
                      key={`${item}-${index}`}
                      className="relative flex items-start gap-3 pb-3 last:pb-0"
                    >
                      {/* Garis vertikal timeline penghubung */}
                      {!isLast && (
                        <span
                          className="absolute left-[3.5px] top-[9px] -bottom-1 w-[1px] bg-gray-400"
                          aria-hidden="true"
                        />
                      )}
                      {/* Titik bullet abu-abu gelap */}
                      <span
                        className="relative z-10 mt-[6px] size-[8px] shrink-0 rounded-full bg-[#4A4A4A]"
                        aria-hidden="true"
                      />
                      {/* Teks item fasilitas */}
                      <span className="text-[13px] leading-tight text-black">
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tombol Aksi (Edit Hijau & Hapus Merah) */}
            <div className="mt-6 flex items-center justify-end gap-3.5">
              {/* Tombol Edit */}
              <button
                type="button"
                onClick={handleEditClick}
                aria-label="Edit ruangan"
                className="flex size-[48px] items-center justify-center rounded-[14px] bg-[#00A81E] text-white shadow-md transition-all duration-150 hover:bg-[#00921A] active:scale-95 focus:outline-none cursor-pointer"
              >
                <FaPencilAlt className="size-4" aria-hidden="true" />
              </button>

              {/* Tombol Hapus */}
              <button
                type="button"
                onClick={handleDeleteClick}
                aria-label="Hapus ruangan"
                className="flex size-[48px] items-center justify-center rounded-[14px] bg-[#C40000] text-white shadow-md transition-all duration-150 hover:bg-[#A80000] active:scale-95 focus:outline-none cursor-pointer"
              >
                <FaTrashAlt className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
