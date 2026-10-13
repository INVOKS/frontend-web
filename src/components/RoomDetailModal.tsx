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

  // Simpan elemen pemicu fokus & kembalikan saat modal ditutup
  useEffect(() => {
    if (open) {
      triggerElementRef.current = document.activeElement as HTMLElement;
      modalBoxRef.current?.focus();
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

  // Tangani tombol ESC untuk menutup modal
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!isClient || !open || !room) {
    return null;
  }

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(room);
    } else {
      console.log("Edit ruangan:", room);
    }
  };

  const handleDeleteClick = () => {
    const roomName = room.nama || room.name;
    const isConfirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus ${roomName}?`
    );
    if (isConfirmed) {
      if (onDelete) {
        onDelete(room);
      } else {
        console.log("Hapus ruangan:", room);
      }
    }
  };

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
        aria-labelledby="room-detail-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-[840px] max-h-[90vh] flex-col overflow-y-auto rounded-lg bg-white p-6 shadow-2xl transition-all duration-200 focus:outline-none sm:p-8 md:p-9"
      >
        {/* Tombol Close (X) Pojok Kanan Atas */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail ruangan"
          className="absolute right-5 top-5 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar"
        >
          <FaTimes className="size-4 sm:size-5" aria-hidden="true" />
        </button>

        {/* Judul: Nama Ruangan */}
        <h2
          id="room-detail-modal-title"
          className="text-center text-2xl font-bold tracking-tight text-gray-900"
        >
          {room.nama || room.name}
        </h2>

        {/* Layout Dua Kolom */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {/* Kolom Kiri: Foto & Deskripsi */}
          <div className="flex flex-col">
            {/* Foto Ruangan */}
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

            {/* Heading Deskripsi */}
            <h3 className="mt-5 mb-2 text-sm font-bold text-gray-900 sm:text-base">
              Deskripsi Ruangan
            </h3>

            {/* Kotak Deskripsi */}
            <div className="min-h-[100px] rounded-lg border border-gray-300 bg-white p-4">
              <p className="text-[13px] leading-relaxed text-gray-700">
                {room.deskripsi}
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Informasi, Fasilitas, & Tombol Aksi */}
          <div className="flex flex-col">
            {/* Heading Informasi */}
            <h3 className="mb-2 text-sm font-bold text-gray-900 sm:text-base">
              Informasi Ruangan
            </h3>

            {/* Kotak Informasi */}
            <div className="flex flex-col gap-1.5 rounded-lg border border-gray-300 bg-white p-4 text-[13px] text-gray-700">
              <div>
                <span className="font-semibold text-gray-900">Gedung:</span>{" "}
                {room.gedung}
              </div>
              <div>
                <span className="font-semibold text-gray-900">Lantai:</span>{" "}
                {room.lantai}
              </div>
              <div>
                <span className="font-semibold text-gray-900">
                  Kapasitas ruangan:
                </span>{" "}
                {room.kapasitas} orang
              </div>
            </div>

            {/* Heading Fasilitas */}
            <h3 className="mt-5 mb-2 text-sm font-bold text-gray-900 sm:text-base">
              Fasilitas Ruangan
            </h3>

            {/* Kotak Fasilitas (Gaya Timeline) */}
            <div className="rounded-lg border border-gray-300 bg-white p-4">
              <div className="flex flex-col">
                {room.fasilitas.map((item, index) => {
                  const isLast = index === room.fasilitas.length - 1;
                  return (
                    <div
                      key={`${item}-${index}`}
                      className="relative flex items-start gap-3 pb-3 last:pb-0"
                    >
                      {/* Garis vertikal penghubung timeline */}
                      {!isLast && (
                        <span
                          className="absolute left-[3.5px] top-[9px] -bottom-1 w-[1px] bg-gray-300"
                          aria-hidden="true"
                        />
                      )}
                      {/* Titik bullet hitam */}
                      <span
                        className="relative z-10 mt-[6px] size-[8px] shrink-0 rounded-full bg-black"
                        aria-hidden="true"
                      />
                      {/* Teks item fasilitas */}
                      <span className="text-[13px] leading-tight text-gray-700">
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tombol Aksi: Edit & Hapus */}
            <div className="mt-6 flex items-center justify-end gap-6">
              {/* Tombol Edit */}
              <button
                type="button"
                onClick={handleEditClick}
                aria-label="Edit ruangan"
                className="flex size-[50px] items-center justify-center rounded-md bg-[#14A91F] text-white shadow-sm transition-all duration-150 hover:bg-[#118f1a] hover:shadow active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14A91F]"
              >
                <FaPencilAlt className="size-5" aria-hidden="true" />
              </button>

              {/* Tombol Hapus */}
              <button
                type="button"
                onClick={handleDeleteClick}
                aria-label="Hapus ruangan"
                className="flex size-[50px] items-center justify-center rounded-md bg-[#B00000] text-white shadow-sm transition-all duration-150 hover:bg-[#940000] hover:shadow active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B00000]"
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
