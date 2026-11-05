"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Be_Vietnam_Pro } from "next/font/google";
import { Eye, EyeOff } from "lucide-react";

const font = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Sama persis dengan sistem skala di halaman login (frame 1512 x 982)
const px = (n: number) => `calc(var(--u) * ${n})`;

// ─── Countdown timer untuk OTP ───────────────────────────────────────────────
function useCountdown(initial: number) {
  const [seconds, setSeconds] = useState(initial);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) { setRunning(false); return; }
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds, running]);

  const restart = () => { setSeconds(initial); setRunning(true); };
  return { seconds, done: !running || seconds === 0, restart };
}

export default function ForgotPasswordPage() {
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

  // ── OTP helpers ──────────────────────────────────────────────────────────
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

  // ── Submit handlers ───────────────────────────────────────────────────────
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

  // ═════════════════════════════════════════════════════════════════════════
  return (
    <main
      className={`${font.className} flex h-screen w-full overflow-hidden bg-white`}
      style={{ "--u": "calc(min(100vw / 1512, 100vh / 982) * 1.15)" } as React.CSSProperties}
    >
      {/* ===== KIRI: foto gedung (identik dengan login) ===== */}
      <section className="relative hidden h-full w-1/2 shrink-0 overflow-hidden bg-black md:block">
        <Image
          src="/images/login-admin.png"
          alt="Gedung Laboratorium Vokasi dan Industri Kreatif"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Overlay hitam 60% */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Logo kiri atas */}
        <div
          className="absolute flex items-center"
          style={{ left: px(30), top: px(24), gap: px(8) }}
        >
          <Image
            src="/images/logo-invoks.png"
            alt="Logo INVOKS"
            width={74}
            height={85}
            style={{ width: px(74), height: "auto" }}
          />
          <span
            className="font-extrabold text-white"
            style={{ fontSize: px(36), letterSpacing: "0.04em" }}
          >
            INVOKS
          </span>
        </div>
      </section>

      {/* ===== KANAN: form multi-step ===== */}
      <section className="flex h-full min-w-0 flex-1 items-center justify-center px-6">
        <div
          className="flex max-w-full flex-col items-center"
          style={{ width: px(476) }}
        >
          {/* Logo atas judul */}
          <Image
            src="/images/logo-invoks.png"
            alt="Logo INVOKS"
            width={165}
            height={190}
            priority
            style={{ width: px(165), height: "auto", marginTop: px(-22) }}
          />

          {/* ══════════════════════════════════════════
              STEP 1 — Lupa Kata Sandi?
          ══════════════════════════════════════════ */}
          {step === 1 && (
            <form
              onSubmit={handleSubmitEmail}
              className="flex w-full flex-col items-center"
            >
              {/* Judul */}
              <h1
                className="text-center font-bold text-[#006199]"
                style={{ marginTop: px(3), fontSize: px(48), lineHeight: px(57) }}
              >
                Lupa Kata Sandi?
              </h1>

              {/* Subjudul */}
              <p
                className="text-center text-[#555]"
                style={{ marginTop: px(12), fontSize: px(18), lineHeight: px(26) }}
              >
                Jangan khawatir, kami akan mengirimkan email kepada anda untuk mengatur ulang kata sandi
              </p>

              {/* Input email */}
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan Email"
                className="w-full border border-[#434343] text-gray-900 outline-none placeholder:text-[#d2d2d2] focus:border-[#006199] focus:ring-1 focus:ring-[#006199]"
                style={{
                  marginTop: px(38),
                  height: px(73),
                  paddingLeft: px(27),
                  paddingRight: px(27),
                  fontSize: px(20),
                  borderRadius: px(8),
                }}
              />

              {/* Tombol Melanjutkan */}
              <div className="flex justify-center" style={{ marginTop: px(44) }}>
                <button
                  type="submit"
                  className="flex items-center justify-center max-w-full bg-[#006199] font-semibold text-white transition hover:bg-[#004f7e]"
                  style={{
                    width: px(308),
                    height: px(73),
                    fontSize: px(30),
                    borderRadius: px(14),
                  }}
                >
                  Melanjutkan
                </button>
              </div>
            </form>
          )}

          {/* ══════════════════════════════════════════
              STEP 2 — Cek Email Anda (OTP)
          ══════════════════════════════════════════ */}
          {step === 2 && (
            <form
              onSubmit={handleSubmitOtp}
              className="flex w-full flex-col items-center"
            >
              {/* Judul */}
              <h1
                className="text-center font-bold text-[#006199]"
                style={{ marginTop: px(3), fontSize: px(48), lineHeight: px(57) }}
              >
                Cek Email Anda
              </h1>

              {/* Subjudul */}
              <p
                className="text-center text-[#555]"
                style={{ marginTop: px(12), fontSize: px(18), lineHeight: px(26) }}
              >
                Kami baru saja mengirim OTP ke email anda
              </p>

              {/* 6 kotak OTP */}
              <div
                className="flex justify-center"
                style={{ marginTop: px(38), gap: px(14) }}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="border border-[#434343] text-center font-semibold text-gray-900 outline-none focus:border-[#006199] focus:ring-1 focus:ring-[#006199]"
                    style={{
                      width: px(62),
                      height: px(62),
                      fontSize: px(26),
                      borderRadius: px(8),
                    }}
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-500" style={{ marginTop: px(10), fontSize: px(16) }}>
                  {error}
                </p>
              )}

              {/* Countdown timer */}
              <p
                className="text-[#555]"
                style={{ marginTop: px(20), fontSize: px(19) }}
              >
                {timerDone ? "0 detik" : `${seconds} detik`}
              </p>

              {/* Kirim ulang */}
              <p
                className="text-[#555]"
                style={{ marginTop: px(12), fontSize: px(19) }}
              >
                Tidak mendapatkan kode?{" "}
                <button
                  type="button"
                  disabled={!timerDone}
                  onClick={() => {
                    setOtp(Array(6).fill(""));
                    setError("");
                    restartTimer();
                  }}
                  className="text-[#1f6feb] underline disabled:opacity-40"
                >
                  Kirim ulang
                </button>
              </p>

              {/* Tombol Verifikasi OTP */}
              <div className="flex justify-center" style={{ marginTop: px(32) }}>
                <button
                  type="submit"
                  className="flex items-center justify-center max-w-full bg-[#006199] font-semibold text-white transition hover:bg-[#004f7e]"
                  style={{
                    width: px(308),
                    height: px(73),
                    fontSize: px(30),
                    borderRadius: px(14),
                  }}
                >
                  Verifikasi OTP
                </button>
              </div>
            </form>
          )}

          {/* ══════════════════════════════════════════
              STEP 3 — Setel Ulang Kata Sandi
          ══════════════════════════════════════════ */}
          {step === 3 && (
            <form
              onSubmit={handleSubmitPassword}
              className="flex w-full flex-col items-center"
            >
              {/* Judul */}
              <h1
                className="text-center font-bold text-[#006199]"
                style={{ marginTop: px(3), fontSize: px(48), lineHeight: px(57) }}
              >
                Setel Ulang Kata Sandi
              </h1>

              {/* Subjudul */}
              <p
                className="text-center text-[#555]"
                style={{ marginTop: px(12), fontSize: px(18), lineHeight: px(26) }}
              >
                Gunakan kombinasi angka, huruf kapital,
                <br />
                huruf kecil, &amp; karakter khusus
              </p>

              {/* Input kata sandi baru */}
              <div className="relative w-full" style={{ marginTop: px(38) }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full border border-[#434343] text-gray-900 outline-none placeholder:text-[#d2d2d2] focus:border-[#006199] focus:ring-1 focus:ring-[#006199]"
                  style={{
                    height: px(73),
                    paddingLeft: px(27),
                    paddingRight: px(70),
                    fontSize: px(20),
                    borderRadius: px(8),
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 text-[#acb5bb] hover:text-gray-600"
                  style={{ right: px(24) }}
                >
                  {showPassword
                    ? <Eye style={{ width: px(21), height: px(21) }} />
                    : <EyeOff style={{ width: px(21), height: px(21) }} />}
                </button>
              </div>

              {/* Input konfirmasi */}
              <div className="relative w-full" style={{ marginTop: px(32) }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Verifikasi kata sandi"
                  className="w-full border border-[#434343] text-gray-900 outline-none placeholder:text-[#d2d2d2] focus:border-[#006199] focus:ring-1 focus:ring-[#006199]"
                  style={{
                    height: px(73),
                    paddingLeft: px(27),
                    paddingRight: px(70),
                    fontSize: px(20),
                    borderRadius: px(8),
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 -translate-y-1/2 text-[#acb5bb] hover:text-gray-600"
                  style={{ right: px(24) }}
                >
                  {showConfirmPassword
                    ? <Eye style={{ width: px(21), height: px(21) }} />
                    : <EyeOff style={{ width: px(21), height: px(21) }} />}
                </button>
              </div>

              {error && (
                <p className="text-red-500" style={{ marginTop: px(10), fontSize: px(16) }}>
                  {error}
                </p>
              )}

              {/* Tombol Setel Ulang */}
              <div className="flex justify-center" style={{ marginTop: px(44) }}>
                <button
                  type="submit"
                  className="flex items-center justify-center max-w-full bg-[#006199] font-semibold text-white transition hover:bg-[#004f7e]"
                  style={{
                    width: px(308),
                    height: px(73),
                    fontSize: px(30),
                    borderRadius: px(14),
                  }}
                >
                  Setel Ulang
                </button>
              </div>
            </form>
          )}

          {/* ══════════════════════════════════════════
              STEP 4 — Ubah Kata Sandi Berhasil
          ══════════════════════════════════════════ */}
          {step === 4 && (
            <div className="flex w-full flex-col items-center">
              {/* Judul */}
              <h1
                className="text-center font-bold text-[#006199]"
                style={{ marginTop: px(3), fontSize: px(48), lineHeight: px(57) }}
              >
                Ubah Kata Sandi Berhasil
              </h1>

              {/* Subjudul */}
              <p
                className="text-center text-[#555]"
                style={{ marginTop: px(12), fontSize: px(18), lineHeight: px(26) }}
              >
                Anda dapat masuk ke akun Anda.
              </p>

              {/* Tombol Pergi Ke Masuk */}
              <div className="flex justify-center" style={{ marginTop: px(44) }}>
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="flex items-center justify-center max-w-full bg-[#006199] font-semibold text-white transition hover:bg-[#004f7e]"
                  style={{
                    width: px(308),
                    height: px(73),
                    fontSize: px(30),
                    borderRadius: px(14),
                  }}
                >
                  Pergi Ke Masuk
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}