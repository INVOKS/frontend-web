"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp, FaLock, FaPencilAlt, FaSave } from "react-icons/fa";

export type AdminProfileData = {
  namaDepan: string;
  namaBelakang: string;
  email: string;
  cabangVokasi: string;
};

type ProfileFormProps = {
  initialData: AdminProfileData;
  onSave: (data: AdminProfileData) => void;
  onOpenChangePassword: () => void;
};

export default function ProfileForm({
  initialData,
  onSave,
  onOpenChangePassword,
}: ProfileFormProps) {
  const [namaDepan, setNamaDepan] = useState(initialData.namaDepan);
  const [namaBelakang, setNamaBelakang] = useState(initialData.namaBelakang);
  const [email, setEmail] = useState(initialData.email);
  const [cabangVokasi, setCabangVokasi] = useState(initialData.cabangVokasi);

  const [isEditing, setIsEditing] = useState(false);
  const [isCabangOpen, setIsCabangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cabangOptions = ["Veteran", "Dieng"];

  useEffect(() => {
    setNamaDepan(initialData.namaDepan);
    setNamaBelakang(initialData.namaBelakang);
    setEmail(initialData.email);
    setCabangVokasi(initialData.cabangVokasi);
  }, [initialData]);

  // Klik di luar dropdown untuk menutup
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCabangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleEditOrSave = () => {
    if (isEditing) {
      // Simpan perubahan
      onSave({
        namaDepan: namaDepan.trim(),
        namaBelakang: namaBelakang.trim(),
        email: email.trim(),
        cabangVokasi,
      });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="w-full mt-8">
      {/* Grid 2 Kolom Form Sesuai Desain Figma */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        {/* Kolom 1 Baris 1: Nama depan */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm text-gray-700">Nama depan</label>
          <input
            type="text"
            value={namaDepan}
            onChange={(e) => setNamaDepan(e.target.value)}
            disabled={!isEditing}
            placeholder="Ketik disini"
            className="h-[46px] w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-[#006199] focus:ring-1 focus:ring-[#006199] disabled:bg-gray-50/70 disabled:text-gray-700"
          />
        </div>

        {/* Kolom 2 Baris 1: Nama belakang */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm text-gray-700">Nama belakang</label>
          <input
            type="text"
            value={namaBelakang}
            onChange={(e) => setNamaBelakang(e.target.value)}
            disabled={!isEditing}
            placeholder="Ketik disini"
            className="h-[46px] w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-[#006199] focus:ring-1 focus:ring-[#006199] disabled:bg-gray-50/70 disabled:text-gray-700"
          />
        </div>

        {/* Kolom 1 Baris 2: Email */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditing}
            placeholder="Ketik disini"
            className="h-[46px] w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-[#006199] focus:ring-1 focus:ring-[#006199] disabled:bg-gray-50/70 disabled:text-gray-700"
          />
        </div>

        {/* Kolom 2 Baris 2: Cabang Vokasi (Dropdown Sesuai Image 1 & Image 2) */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm text-gray-700">Cabang Vokasi</label>
          <div ref={dropdownRef} className="relative">
            {!isCabangOpen ? (
              /* Tampilan Tertutup (Sesuai Image 1) */
              <button
                type="button"
                disabled={!isEditing}
                onClick={() => setIsCabangOpen(true)}
                className="flex h-[46px] w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 outline-none transition hover:border-gray-400 focus:border-[#006199] disabled:bg-gray-50/70 disabled:text-gray-700 disabled:hover:border-gray-300 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>{cabangVokasi || "Pilih cabang"}</span>
                <FaChevronDown className="size-3.5 text-gray-600" />
              </button>
            ) : (
              /* Tampilan Terbuka (Sesuai Image 2) */
              <div className="w-full rounded-lg border border-gray-300 bg-white shadow-sm overflow-hidden animate-fadeIn">
                <button
                  type="button"
                  onClick={() => setIsCabangOpen(false)}
                  className="flex h-[46px] w-full items-center justify-between border-b border-gray-200 px-4 text-sm text-gray-500 hover:bg-gray-50"
                >
                  <span>Pilih cabang</span>
                  <FaChevronUp className="size-3.5 text-gray-600" />
                </button>
                <div className="flex flex-col divide-y divide-gray-200">
                  {cabangOptions.map((cabang) => (
                    <button
                      key={cabang}
                      type="button"
                      onClick={() => {
                        setCabangVokasi(cabang);
                        setIsCabangOpen(false);
                      }}
                      className={`flex h-[44px] w-full items-center px-4 text-sm text-left transition hover:bg-gray-50 ${
                        cabangVokasi === cabang
                          ? "font-semibold text-[#006199] bg-blue-50/50"
                          : "text-gray-800"
                      }`}
                    >
                      {cabang}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tombol Edit / Simpan di Pojok Kanan Bawah Input Cabang Vokasi (Sesuai Image 1) */}
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleToggleEditOrSave}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-semibold text-white shadow-sm transition active:scale-95 ${
                isEditing
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-[#006199] hover:bg-[#004f7e]"
              }`}
            >
              {isEditing ? (
                <>
                  <FaSave className="size-3" />
                  <span>Simpan</span>
                </>
              ) : (
                <>
                  <FaPencilAlt className="size-3" />
                  <span>Edit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Baris 3 Kolom 1: Tombol Ubah Password (Sesuai Image 1 & Image 2) */}
        <div className="flex flex-col">
          <button
            type="button"
            onClick={onOpenChangePassword}
            className="flex h-[46px] w-full max-w-[280px] items-center gap-3 rounded-lg border border-gray-400 bg-white px-4 text-sm font-semibold text-gray-800 shadow-xs transition hover:border-gray-600 hover:bg-gray-50 active:scale-98"
          >
            <div className="flex size-6 items-center justify-center rounded-full bg-blue-100 text-[#006199]">
              <FaLock className="size-3" />
            </div>
            <span>Ubah password</span>
          </button>
        </div>
      </div>
    </div>
  );
}

