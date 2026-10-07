"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, EyeOff, Eye } from "lucide-react";
import { Be_Vietnam_Pro } from "next/font/google";

const font = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Semua ukuran = angka asli dari desain Figma (frame 1512 x 982) x skala layar
const px = (n: number) => `calc(var(--u) * ${n})`;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: ganti dengan request login ke backend kamu
    console.log({ email, password, remember });
    router.push("/dashboard");
  };

  return (
    <main
      className={`${font.className} flex h-screen w-full overflow-hidden bg-white`}
      // 1.15 = faktor pembesar. 1 = ukuran persis desain. Naikkan/turunkan sesuai selera.
      style={
        {
          "--u": "calc(min(100vw / 1512, 100vh / 982) * 1.15)",
        } as React.CSSProperties
      }
    >
      {/* ===== Kiri: foto gedung ===== */}
      <section className="relative hidden h-full w-1/2 shrink-0 overflow-hidden bg-black md:block">
        <Image
          src="/images/login-admin.png"
          alt="Gedung Laboratorium Vokasi dan Industri Kreatif"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Overlay hitam 60% (sesuai desain). Ubah /60 untuk gelap-terangnya */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Logo kiri atas: kubus terlihat ± 53px, tulisan INVOKS 36px */}
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

      {/* ===== Kanan: form ===== */}
      <section className="flex h-full min-w-0 flex-1 items-center justify-center px-6">
        <div
          className="flex max-w-full flex-col items-center"
          style={{ width: px(476) }}
        >
          {/* Logo atas judul: kubus terlihat ± 120px */}
          <Image
            src="/images/logo-invoks.png"
            alt="Logo INVOKS"
            width={165}
            height={190}
            priority
            style={{ width: px(165), height: "auto", marginTop: px(-22) }}
          />

          {/* Judul 48px, line-height 57px */}
          <h1
            className="text-center font-bold text-[#006199]"
            style={{ marginTop: px(3), fontSize: px(48), lineHeight: px(57) }}
          >
            Masuk ke Akun
            <br />
            Anda
          </h1>

          <form
            onSubmit={handleSubmit}
            className="w-full"
            style={{ marginTop: px(38) }}
          >
            {/* Input: tinggi 73, jarak antar input 39 */}
            <div className="flex flex-col" style={{ gap: px(39) }}>
              <input
                type="email"
                placeholder="Masukkan Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-[#434343] text-gray-900 outline-none placeholder:text-[#d2d2d2] focus:border-[#006199] focus:ring-1 focus:ring-[#006199]"
                style={{
                  height: px(73),
                  paddingLeft: px(27),
                  paddingRight: px(27),
                  fontSize: px(20),
                  borderRadius: px(8),
                }}
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                  className="absolute top-1/2 -translate-y-1/2 text-[#acb5bb] hover:text-gray-600"
                  style={{ right: px(24) }}
                >
                  {showPassword ? (
                    <Eye style={{ width: px(21), height: px(21) }} />
                  ) : (
                    <EyeOff style={{ width: px(21), height: px(21) }} />
                  )}
                </button>
              </div>
            </div>

            {/* Ingat saya + Lupa kata sandi */}
            <div
              className="flex items-center justify-between"
              style={{ marginTop: px(43), fontSize: px(19) }}
            >
              <label
                className="flex cursor-pointer items-center text-black"
                style={{ gap: px(8), marginLeft: px(4) }}
              >
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="peer sr-only"
                />
                <span
                  className="flex items-center justify-center border-2 border-[#979797] bg-[#ececec] text-[#7a7a7a] peer-focus-visible:ring-2 peer-focus-visible:ring-[#006199]"
                  style={{
                    width: px(26),
                    height: px(26),
                    borderRadius: px(3),
                  }}
                >
                  {remember && (
                    <Check
                      strokeWidth={3}
                      style={{ width: px(18), height: px(18) }}
                    />
                  )}
                </span>
                Ingat saya
              </label>

              <Link
                href="/lupa-kata-sandi"
                className="text-[#1f6feb] underline hover:text-[#1555b8]"
              >
                Lupa kata sandi
              </Link>
            </div>

            {/* Tombol Masuk 308 x 73 */}
            <div className="flex justify-center" style={{ marginTop: px(44) }}>
              <button
                type="submit"
                className="max-w-full bg-[#006199] font-semibold text-white transition hover:bg-[#004f7e]"
                style={{
                  width: px(308),
                  height: px(73),
                  fontSize: px(30),
                  borderRadius: px(8 + 6),
                }}
              >
                Masuk
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}