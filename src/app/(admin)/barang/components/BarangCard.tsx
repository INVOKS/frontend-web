"use client";

import Image from "next/image";
import { Barang } from "@/lib/barang-data";

type BarangCardProps = {
  barang: Barang;
  onClick: () => void;
};

export default function BarangCard({ barang, onClick }: BarangCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Lihat detail ${barang.nama}`}
      className="group flex flex-col items-center cursor-pointer select-none transition-transform duration-200 hover:-translate-y-1 focus:outline-none w-full"
    >
      {/* 
        Gambar Barang:
        Rasio persis 172:161 (sesuai resolusi aset asli Figma 172x161)
        sehingga proporsi gambar tidak bantet / tidak terpotong.
      */}
      <div className="relative w-full aspect-[172/161] overflow-hidden rounded-xl bg-gray-50 border border-gray-100 shadow-sm transition-shadow duration-200 group-hover:shadow-md">
        <Image
          src={barang.gambar || "/images/Barang E1.png"}
          alt={barang.nama}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized={barang.gambar.startsWith("blob:")}
        />
      </div>

      {/* Pill Nama Barang di Bawah Foto */}
      <div className="mt-2.5 flex justify-center w-full">
        <div className="inline-flex min-w-[90px] max-w-full items-center justify-center rounded-xl border border-gray-200/90 bg-white px-4 py-1.5 text-center text-xs sm:text-[13px] font-bold text-gray-800 shadow-xs transition-colors group-hover:border-gray-300 group-hover:bg-gray-50">
          <span className="truncate">{barang.nama}</span>
        </div>
      </div>
    </div>
  );
}
