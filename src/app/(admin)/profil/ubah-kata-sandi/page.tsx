"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

function useCountdown(initial: number) {
  const [seconds, setSeconds] = useState(initial);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) {
      setRunning(false);
      return;
    }
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds, running]);

  const restart = () => {
    setSeconds(initial);
    setRunning(true);
  };

  return { seconds, done: !running || seconds === 0, restart };
}

export default function UbahKataSandiAdminPage() {
  const router = useRouter();

  // step: 1=email, 2=OTP, 3=password baru, 4=berhasil
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { seconds, done: timerDone, restart: restartTimer } = useCountdown(30);

  // Otomatis isi email dari session admin jika ada
  useEffect(() => {
    try {
      const raw = localStorage.getItem("invoks_auth_user");
      if (raw) {
        const user = JSON.parse(raw);
        if (user?.email) setEmail(user.email);
      }
    } catch {
      // ignore
    }
  }, []);

  // ── OTP helpers ──
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // ── Submit Handlers ──
  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    restartTimer();
  };

  const handleSubmitOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some((d) => d === "")) {
      setError("Lengkapi 6 digit kode OTP terlebih dahulu.");
      return;
    }
    setError("");
    setStep(3);
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Kata sandi dan konfirmasi tidak sama.");
      return;
    }
    setError("");
    setStep(4);
  };

  return (
    <main className="flex min-h-screen w-full overflow-hidden bg-white">
      {/* ══ SISI KIRI: Foto Gedung Vokasi + Logo INVOKS ══ */}
      <section className="relative hidden h-screen w-1/2 shrink-0 overflow-hidden bg-black md:block">
        <Image
          src="/images/login-admin.png"
          alt="Gedung Laboratorium Vokasi dan Industri Kreatif"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Overlay hitam 60% */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Logo INVOKS kiri atas */}
        <div className="absolute left-8 top-7 flex items-center gap-3">
          <Image
            src="/images/logo-invoks.png"
            alt="Logo INVOKS"
            width={60}
            height={70}
            className="w-14 h-auto"
            priority
          />
          <span className="text-3xl font-extrabold tracking-wider text-white">
            INVOKS
          </span>
        </div>
      </section>

      {/* ══ SISI KANAN: Form Multi-Step Sesuai Desain ══ */}
      <section className="flex h-screen min-w-0 flex-1 items-center justify-center px-6 sm:px-12 overflow-y-auto">
        <div className="flex w-full max-w-[460px] flex-col items-center py-8">
          {/* Logo 3D INVOKS di atas teks */}
          <div className="relative mb-4 flex items-center justify-center">
            <Image
              src="/images/logo-invoks.png"
              alt="Logo INVOKS"
              width={140}
              height={160}
              priority
              className="w-[120px] sm:w-[135px] h-auto object-contain"
            />
          </div>

          {/* ══════════════════════════════════════════════
              STEP 1: Ubah Kata Sandi?
          ══════════════════════════════════════════════ */}
          {step === 1 && (
            <form onSubmit={handleSubmitEmail} className="flex w-full flex-col items-center">
              <h1 className="text-center text-3xl sm:text-4xl font-extrabold text-[#006199] tracking-tight">
                Ubah Kata Sandi?
              </h1>

              <p className="mt-3 text-center text-sm sm:text-base text-[#555] leading-relaxed">
                Jangan khawatir, kami akan mengirimkan email kepada anda untuk mengatur ulang kata sandi
              </p>

              <div className="mt-8 w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan Email"
                  className="h-[54px] w-full rounded-lg border border-[#434343] px-5 text-base text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#006199] focus:ring-1 focus:ring-[#006199]"
                />
              </div>

              <div className="mt-8 flex w-full justify-center">
                <button
                  type="submit"
                  className="flex h-[52px] w-full max-w-[280px] items-center justify-center rounded-xl bg-[#006199] text-xl font-bold text-white shadow-md transition-all hover:bg-[#004f7e] active:scale-95 cursor-pointer"
                >
                  Melanjutkan
                </button>
              </div>
            </form>
          )}

          {/* ══════════════════════════════════════════════
              STEP 2: Cek Email Anda (OTP)
          ══════════════════════════════════════════ */}
          {step === 2 && (
            <form onSubmit={handleSubmitOtp} className="flex w-full flex-col items-center">
              <h1 className="text-center text-3xl sm:text-4xl font-extrabold text-[#006199] tracking-tight">
                Cek Email Anda
              </h1>

              <p className="mt-3 text-center text-sm sm:text-base text-[#555] leading-relaxed">
                Kami baru saja mengirim OTP ke email anda
              </p>

              {/* 6 Kotak Input OTP */}
              <div className="mt-8 flex justify-center gap-2.5 sm:gap-3.5">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="size-[48px] sm:size-[54px] rounded-lg border border-[#434343] text-center text-2xl font-bold text-gray-900 outline-none transition focus:border-[#006199] focus:ring-1 focus:ring-[#006199]"
                  />
                ))}
              </div>

              {error && (
                <p className="mt-3 text-sm text-red-500 font-medium">
                  {error}
                </p>
              )}

              {/* Countdown Timer */}
              <p className="mt-6 text-sm sm:text-base font-medium text-[#555]">
                {timerDone ? "0 detik" : `${seconds} detik`}
              </p>

              {/* Kirim Ulang Link */}
              <p className="mt-2 text-sm text-[#555]">
                Tidak mendapatkan kode?{" "}
                <button
                  type="button"
                  disabled={!timerDone}
                  onClick={() => {
                    setOtp(Array(6).fill(""));
                    setError("");
                    restartTimer();
                  }}
                  className="font-semibold text-[#006199] underline hover:text-[#004f7e] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Kirim ulang
                </button>
              </p>

              <div className="mt-7 flex w-full justify-center">
                <button
                  type="submit"
                  className="flex h-[52px] w-full max-w-[280px] items-center justify-center rounded-xl bg-[#006199] text-xl font-bold text-white shadow-md transition-all hover:bg-[#004f7e] active:scale-95 cursor-pointer"
                >
                  Verifikasi OTP
                </button>
              </div>
            </form>
          )}

          {/* ══════════════════════════════════════════════
              STEP 3: Setel Ulang Kata Sandi
          ══════════════════════════════════════════ */}
          {step === 3 && (
            <form onSubmit={handleSubmitPassword} className="flex w-full flex-col items-center">
              <h1 className="text-center text-3xl sm:text-4xl font-extrabold text-[#006199] tracking-tight">
                Setel Ulang Kata Sandi
              </h1>

              <p className="mt-3 text-center text-sm sm:text-base text-[#555] leading-relaxed">
                Gunakan kombinasi angka, huruf kapital,
                <br />
                huruf kecil, &amp; karakter khusus
              </p>

              {/* Input Password Baru */}
              <div className="relative mt-8 w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="h-[54px] w-full rounded-lg border border-[#434343] pl-5 pr-12 text-base text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#006199] focus:ring-1 focus:ring-[#006199]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                </button>
              </div>

              {/* Input Verifikasi Password */}
              <div className="relative mt-4 w-full">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Verifikasi kata sandi"
                  className="h-[54px] w-full rounded-lg border border-[#434343] pl-5 pr-12 text-base text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#006199] focus:ring-1 focus:ring-[#006199]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {showConfirmPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                </button>
              </div>

              {error && (
                <p className="mt-3 text-sm text-red-500 font-medium">
                  {error}
                </p>
              )}

              <div className="mt-8 flex w-full justify-center">
                <button
                  type="submit"
                  className="flex h-[52px] w-full max-w-[280px] items-center justify-center rounded-xl bg-[#006199] text-xl font-bold text-white shadow-md transition-all hover:bg-[#004f7e] active:scale-95 cursor-pointer"
                >
                  Setel Ulang
                </button>
              </div>
            </form>
          )}

          {/* ══════════════════════════════════════════════
              STEP 4: Ubah Kata Sandi Berhasil
          ══════════════════════════════════════════ */}
          {step === 4 && (
            <div className="flex w-full flex-col items-center">
              <h1 className="text-center text-3xl sm:text-4xl font-extrabold text-[#006199] tracking-tight">
                Ubah Kata Sandi Berhasil
              </h1>

              <p className="mt-3 text-center text-sm sm:text-base text-[#555] leading-relaxed">
                Anda dapat masuk ke akun Anda dengan kata sandi baru
              </p>

              <div className="mt-8 flex w-full justify-center">
                <button
                  type="button"
                  onClick={() => router.push("/profil")}
                  className="flex h-[52px] w-full max-w-[280px] items-center justify-center rounded-xl bg-[#006199] text-xl font-bold text-white shadow-md transition-all hover:bg-[#004f7e] active:scale-95 cursor-pointer"
                >
                  Pergi Ke Akun
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

