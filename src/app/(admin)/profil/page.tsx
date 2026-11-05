"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { getStoredUser } from "@/lib/auth";
import ProfilePhoto from "./components/ProfilePhoto";
import ProfileForm, { AdminProfileData } from "./components/ProfileForm";

export default function ProfilPage() {
  const router = useRouter();

  const [profilePhoto, setProfilePhoto] = useState<string>("/images/avatar.jpg");
  const [profileData, setProfileData] = useState<AdminProfileData>({
    namaDepan: "",
    namaBelakang: "",
    email: "",
    cabangVokasi: "Veteran",
  });
  const [adminName, setAdminName] = useState<string>("Admin");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Inisialisasi data profil dari sesi auth
  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      const parts = (user.namaLengkap || "").trim().split(" ");
      setAdminName(user.namaLengkap || "Admin");
      setProfileData({
        namaDepan: parts[0] || "",
        namaBelakang: parts.slice(1).join(" ") || "",
        email: user.email || "",
        cabangVokasi: "Veteran",
      });
      if (user.foto) setProfilePhoto(user.foto);
    }
  }, []);

  const handlePhotoChange = (newPhotoUrl: string) => {
    setProfilePhoto(newPhotoUrl);
    setToastMessage("Foto profil berhasil diperbarui!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (updated: AdminProfileData) => {
    setProfileData(updated);
    const fullNama = `${updated.namaDepan} ${updated.namaBelakang}`.trim();
    setAdminName(fullNama || "Admin");
    try {
      const currentUser = getStoredUser();
      if (currentUser) {
        localStorage.setItem(
          "invoks_auth_user",
          JSON.stringify({ ...currentUser, namaLengkap: fullNama, email: updated.email })
        );
      }
    } catch (e) {
      console.error("Gagal sinkronisasi user:", e);
    }
    setToastMessage("Data akun berhasil disimpan!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* ══ HEADER PUTIH (konsisten dgn halaman lain) ══ */}
      <header className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-6 select-none shadow-sm">
        {/* Tombol kembali + judul */}
        <button
          type="button"
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-black transition hover:opacity-75 cursor-pointer focus:outline-none"
        >
          <FaArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          <h1 className="text-base font-bold tracking-tight text-gray-800">
            Informasi Akun
          </h1>
        </button>

        {/* Admin Text tanpa foto */}
        <span className="text-sm text-[#213F6B] whitespace-nowrap">
          Hallo, <strong className="font-bold">Admin INVOKS</strong>
        </span>
      </header>

      {/* Toast Notifikasi */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* ══ KARTU PROFIL ══ */}
      <div className="mt-8 mx-auto w-[92%] max-w-[1100px]">
        <div className="rounded-[28px] border border-gray-100 bg-white p-8 sm:p-12 shadow-xl transition-all">
          <ProfilePhoto currentPhoto={profilePhoto} onPhotoChange={handlePhotoChange} />
          <ProfileForm
            initialData={profileData}
            onSave={handleSaveProfile}
            onOpenChangePassword={() => router.push("/profil/ubah-kata-sandi")}
          />
        </div>
      </div>
    </div>
  );
}
