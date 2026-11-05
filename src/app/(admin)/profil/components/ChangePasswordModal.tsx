"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle, FaEye, FaEyeSlash, FaLock, FaTimes } from "react-icons/fa";

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ChangePasswordModal({
  open,
  onClose,
}: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
      setSuccess(false);
      setIsLoading(false);
    }
  }, [open]);

  // Handle ESC
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Kata sandi baru minimal 8 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsLoading(true);

    // Simulasi delay / update password
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1400);
    }, 700);
  };

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[1px] animate-fadeIn"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-[440px] flex-col rounded-2xl bg-white p-7 shadow-2xl"
      >
        {/* Tombol Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <FaTimes className="size-4" />
        </button>

        {/* Icon & Judul */}
        <div className="flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-blue-50 text-[#006199] mb-3">
            <FaLock className="size-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Ubah Kata Sandi</h2>
          <p className="mt-1 text-xs text-gray-500">
            Perbarui kata sandi akun administrator Anda
          </p>
        </div>

        {success ? (
          <div className="my-8 flex flex-col items-center justify-center text-center">
            <FaCheckCircle className="size-12 text-green-500 mb-2" />
            <p className="text-sm font-semibold text-gray-800">
              Kata sandi berhasil diperbarui!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
                {error}
              </div>
            )}

            {/* Kata Sandi Lama */}
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-semibold text-gray-700">
                Kata Sandi Lama *
              </label>
              <div className="relative">
                <input
                  type={showOld ? "text" : "password"}
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Masukkan kata sandi lama"
                  className="h-[42px] w-full rounded-lg border border-gray-300 pl-3.5 pr-10 text-sm text-gray-800 outline-none focus:border-[#006199] focus:ring-1 focus:ring-[#006199]"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showOld ? <FaEye className="size-4" /> : <FaEyeSlash className="size-4" />}
                </button>
              </div>
            </div>

            {/* Kata Sandi Baru */}
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-semibold text-gray-700">
                Kata Sandi Baru *
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="h-[42px] w-full rounded-lg border border-gray-300 pl-3.5 pr-10 text-sm text-gray-800 outline-none focus:border-[#006199] focus:ring-1 focus:ring-[#006199]"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <FaEye className="size-4" /> : <FaEyeSlash className="size-4" />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Kata Sandi Baru */}
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-semibold text-gray-700">
                Konfirmasi Kata Sandi Baru *
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi baru"
                  className="h-[42px] w-full rounded-lg border border-gray-300 pl-3.5 pr-10 text-sm text-gray-800 outline-none focus:border-[#006199] focus:ring-1 focus:ring-[#006199]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <FaEye className="size-4" /> : <FaEyeSlash className="size-4" />}
                </button>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-[#006199] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#004f7e] active:scale-95 disabled:opacity-50"
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}