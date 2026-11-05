"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaCamera, FaMinus, FaPlus, FaRedo, FaTimes } from "react-icons/fa";

type ProfilePhotoProps = {
  currentPhoto: string;
  onPhotoChange: (newPhotoUrl: string) => void;
};

export default function ProfilePhoto({
  currentPhoto,
  onPhotoChange,
}: ProfilePhotoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State untuk modal zoom & geser foto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string>("");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Trigger file input
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Saat file dipilih dari komputer
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
    setRawImageSrc(objectUrl);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsModalOpen(true);
    e.target.value = "";
  };

  // Drag untuk geser foto
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Crop & simpan hasil zoom/geser via Canvas
  const handleCropAndApply = () => {
    if (!imgRef.current || !containerRef.current) return;

    const img = imgRef.current;
    const size = 400; // Output resolusi 400x400

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const cSize = containerRef.current.clientWidth;
    const scaleFactor = size / cSize;

    ctx.save();
    // Background putih
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // Geser dan perbesar sesuai pan & zoom
    ctx.translate(size / 2 + pan.x * scaleFactor, size / 2 + pan.y * scaleFactor);
    ctx.scale(zoom * scaleFactor, zoom * scaleFactor);

    const imgW = cSize;
    const imgH = (cSize * img.naturalHeight) / img.naturalWidth;
    ctx.drawImage(img, -imgW / 2, -imgH / 2, imgW, imgH);
    ctx.restore();

    const croppedUrl = canvas.toDataURL("image/jpeg", 0.92);
    onPhotoChange(croppedUrl);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Avatar Bulat dengan Badge Kamera */}
      <div className="relative">
        <div
          role="button"
          tabIndex={0}
          onClick={handlePhotoClick}
          onKeyDown={(e) => e.key === "Enter" && handlePhotoClick()}
          title="Klik untuk ubah foto profil"
          className="group relative size-[140px] sm:size-[150px] cursor-pointer overflow-hidden rounded-full border-[3px] border-gray-100 bg-gray-100 shadow-sm transition hover:shadow-md"
        >
          <Image
            src={currentPhoto || "/images/avatar.jpg"}
            alt="Foto Profil Admin"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
            unoptimized={currentPhoto.startsWith("data:") || currentPhoto.startsWith("blob:")}
          />
          {/* Overlay hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
            <FaCamera className="size-6 text-white drop-shadow" />
          </div>
        </div>

        {/* Tombol Kamera Kecil di Pojok Bawah Kanan Avatar (Sesuai Desain Figma) */}
        <button
          type="button"
          onClick={handlePhotoClick}
          title="Ubah foto profil"
          className="absolute bottom-1 right-1 flex size-[34px] items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md transition hover:bg-gray-50 hover:text-[#006199] active:scale-95"
        >
          <FaCamera className="size-3.5" />
        </button>

        {/* Hidden Input File */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Modal Zoom & Geser Tata Letak Foto Profil */}
      {isModalOpen && (
        <div
          role="presentation"
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-fadeIn"
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="relative flex w-full max-w-[440px] flex-col rounded-2xl bg-white p-6 shadow-2xl"
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                Sesuaikan Foto Profil
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <FaTimes className="size-4" />
              </button>
            </div>

            {/* Frame Lingkaran Avatar untuk Drag & Pan */}
            <div className="mt-5 flex flex-col items-center">
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className={`relative size-[230px] overflow-hidden rounded-full border-4 border-[#006199] bg-gray-100 select-none shadow-inner ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={rawImageSrc}
                  alt="Preview"
                  draggable={false}
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: "center center",
                    transition: isDragging ? "none" : "transform 0.05s ease-out",
                  }}
                  className="size-full object-contain pointer-events-none"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Tahan & geser untuk mengatur posisi foto
              </p>
            </div>

            {/* Slider Zoom (Perbesar / Perkecil) */}
            <div className="mt-4 flex items-center justify-between gap-3 px-2">
              <span className="text-xs font-semibold text-gray-600">Zoom:</span>
              <div className="flex items-center gap-2.5 flex-1 max-w-[220px]">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
                  className="rounded-full p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700"
                  title="Perkecil"
                >
                  <FaMinus className="size-2.5" />
                </button>
                <input
                  type="range"
                  min="0.6"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-[#006199] cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(2.5, z + 0.1))}
                  className="rounded-full p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700"
                  title="Perbesar"
                >
                  <FaPlus className="size-2.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-[#006199] hover:underline"
                title="Kembalikan ke tengah"
              >
                <FaRedo className="size-2.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Tombol Aksi */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCropAndApply}
                className="rounded-lg bg-[#006199] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#004f7e] active:scale-95"
              >
                Terapkan Foto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

