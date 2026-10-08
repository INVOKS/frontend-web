# 🏢 INVOKS - Sistem Kelola Inventaris Vokasi (Frontend Web)

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react)](https://react.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**INVOKS** (*Sistem Kelola Inventaris Vokasi*) adalah platform aplikasi web modern yang dirancang untuk mempermudah inventarisasi fasilitas, manajemen ruangan, pengelolaan barang, serta alur peminjaman fasilitas di lingkungan Vokasi. Repositori ini berisi kode sumber antarmuka pengguna (*Frontend*) berbasis **Next.js App Router**.

---

## 📑 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi & Dependensi](#-teknologi--dependensi)
- [Struktur Proyek](#-struktur-proyek)
- [Halaman & Navigasi (Routes)](#-halaman--navigasi-routes)
- [Detail Komponen & Logika Data](#-detail-komponen--logika-data)
- [Desain & Konfigurasi Tema](#-desain--konfigurasi-tema)
- [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
- [Skrip NPM yang Tersedia](#-skrip-npm-yang-tersedia)
- [Roadmap Pengembangan](#-roadmap-pengembangan)

---

## ✨ Fitur Utama

1. **Autentikasi Admin (Login Page)**:
   - Tampilan *split-screen* modern yang responsif dan presisi sesuai desain Figma.
   - Sisi kiri menampilkan hero gedung Vokasi dengan overlay gelap dan logo INVOKS.
   - Form interaktif dengan validasi dasar, toggle visibilitas kata sandi (*show/hide password*), opsi "Ingat saya", serta tautan "Lupa kata sandi".
   - Menggunakan kalkulasi penskalaan dinamis (`--u`) agar proporsi visual tetap konsisten di berbagai resolusi layar.

2. **Dashboard Interaktif**:
   - Tampilan penyambutan admin (*Hero Greeting Section*) dengan latar belakang Gedung Vokasi.
   - Navigasi cepat (*Call-to-Action*) menuju modul pengelolaan inventaris.
   - Indikator status profil admin di pojok kanan atas.

3. **Modul Pengelolaan Ruangan (`/ruangan`)**:
   - **Gedung Multi-Tab**: Mendukung navigasi instan antar gedung (Gedung BNI, Gedung Dieng, Gedung KP) dengan transisi visual mulus.
   - **Filter Lantai**: Dropdown seleksi lantai (Basement, Lantai 1, Lantai 2, dst.) untuk mempermudah pencarian ruang tertentu.
   - **Visualisasi Kartu Ruangan (`RoomCard`)**: Menampilkan thumbnail ruangan, nama ruang, dan kapasitas daya tampung (contoh: 80 - 100 orang).
   - **Floating Action Button (FAB)**: Tombol aksi melayang di sudut kanan bawah untuk alur penambahan ruangan baru.

4. **Navigasi Sidebar Admin Terpadu**:
   - Menu samping *sticky* dengan penanda rute aktif (*active state indicator*).
   - Menu utama: Dashboard, Profil, Ruangan, Barang, dan Kelola Peminjaman.
   - Tombol cepat untuk Logout.

5. **Kesiapan Modul Inventaris Lainnya**:
   - Struktur rute siap pakai untuk modul **Barang**, **Kelola Peminjaman**, dan **Profil**.

---

## 🛠 Teknologi & Dependensi

| Kategori | Teknologi | Deskripsi / Versi |
| :--- | :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) | Versi 16.4.0 (App Router) |
| **Library UI** | [React](https://react.dev/) | Versi 19.3.0 |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org/) | Versi 5.x untuk *type-safety* |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Versi 4 (`@tailwindcss/turbopack`) dengan custom `@theme` |
| **Ikon** | [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/) | Menyediakan set ikon lengkap (`lucide-react`, `react-icons/fa`, `react-icons/md`) |
| **Font** | `next/font/google` | Font **Be Vietnam Pro** untuk tipografi modern dan bersih |

---

## 📁 Struktur Proyek

```text
fe-web/
├── public/
│   ├── images/              # Aset gambar gedung, ruangan, logo, dan avatar
│   │   ├── deddydieng.png   # Avatar admin
│   │   ├── login-admin.png  # Hero background halaman login
│   │   ├── logoinvoks.png   # Logo brand INVOKS
│   │   ├── ruang1.jpg .. 5  # Foto-foto sampel ruangan
│   │   └── vokasi.jpg       # Background hero dashboard
│   ├── next.svg
│   └── vercel.svg
├── src/
│   ├── app/
│   │   ├── (admin)/         # Route Group khusus panel Admin (berbagi Sidebar)
│   │   │   ├── barang/
│   │   │   │   └── page.tsx # Halaman kelola barang
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx # Halaman dashboard penyambutan admin
│   │   │   ├── kelola-peminjaman/
│   │   │   │   └── page.tsx # Halaman kelola transaksi peminjaman
│   │   │   ├── profil/
│   │   │   │   └── page.tsx # Halaman profil admin
│   │   │   ├── ruangan/
│   │   │   │   └── page.tsx # Halaman kelola ruangan per gedung & lantai
│   │   │   └── layout.tsx   # Layout bersama: Sidebar + main container
│   │   ├── (auth)/          # Route Group autentikasi (tanpa Sidebar)
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx # Halaman reset kata sandi
│   │   │   └── login/
│   │   │       └── page.tsx # Halaman login admin Figma-accurate
│   │   ├── globals.css      # Konfigurasi Tailwind v4, tema warna & animasi
│   │   ├── layout.tsx       # Root layout aplikasi Next.js
│   │   └── page.tsx         # Halaman root / landing page
│   ├── components/
│   │   ├── HeaderTabs.tsx   # Tab navigasi atas pemilihan gedung & info admin
│   │   ├── LoginForm.tsx    # Komponen draft form login
│   │   ├── RoomCard.tsx     # Komponen kartu visualisasi ruangan
│   │   └── Sidebar.tsx      # Sidebar navigasi admin dengan highlight aktif
│   └── lib/
│       └── ruangan-data.ts  # Tipe TypeScript & dataset dummy gedung/lantai/ruang
├── package.json             # Manifest dependensi dan script npm
├── tsconfig.json            # Konfigurasi compiler TypeScript
├── eslint.config.mjs        # Konfigurasi linting ESLint
└── README.md                # Dokumentasi proyek
```

---

## 🗺 Halaman & Navigasi (Routes)

Aplikasi ini memanfaatkan arsitektur **Route Groups** di Next.js:

| URL Path | Route Group | Deskripsi | Status |
| :--- | :--- | :--- | :--- |
| `/` | `src/app/page.tsx` | Halaman root bawaan / landing page awal | Aktif |
| `/login` | `(auth)/login` | Form login khusus admin dengan split visual | Selesai |
| `/forgot-password` | `(auth)/forgot-password` | Form permintaan reset kata sandi | Tahap Pengembangan |
| `/dashboard` | `(admin)/dashboard` | Halaman utama admin dengan sambutan dan CTA | Selesai |
| `/ruangan` | `(admin)/ruangan` | Manajemen ruangan: tab gedung, filter lantai, kartu ruangan, & FAB | Selesai |
| `/barang` | `(admin)/barang` | Manajemen daftar barang inventaris | Tahap Pengembangan |
| `/kelola-peminjaman`| `(admin)/kelola-peminjaman` | Daftar permohonan dan riwayat peminjaman | Tahap Pengembangan |
| `/profil` | `(admin)/profil` | Manajemen akun dan informasi personal admin | Tahap Pengembangan |

---

## 🧩 Detail Komponen & Logika Data

### 1. `Sidebar.tsx`
- **Lokasi**: `src/components/Sidebar.tsx`
- **Fungsi**: Bilah navigasi vertikal di sisi kiri (`w-[274px]`).
- **Fitur**:
  - Menggunakan hook `usePathname()` untuk otomatis menandai menu yang sedang aktif (`bg-sidebar-active` dengan border halus).
  - Tautan langsung ke seluruh rute admin.
  - Bagian bawah dilengkapi tombol Logout.

### 2. `HeaderTabs.tsx`
- **Lokasi**: `src/components/HeaderTabs.tsx`
- **Fungsi**: Header horizontal biru tua (`bg-navy`) setinggi `84px`.
- **Fitur**:
  - Menampilkan daftar tab gedung (misal: GEDUNG BNI, GEDUNG DIENG, GEDUNG KP).
  - Indikator aktif berupa garis aksen di bagian bawah tab.
  - Sisi kanan menampilkan salam *"Hello, Admin"* disertai avatar foto profil melingkar.

### 3. `RoomCard.tsx`
- **Lokasi**: `src/components/RoomCard.tsx`
- **Props**: `name: string`, `capacityMin: number`, `capacityMax: number`, `imageUrl?: string`.
- **Fungsi**: Menampilkan unit kartu ruangan berukuran tetap dengan bayangan halus (*box-shadow*), efek *hover lift*, foto ruangan, nama ruang, dan rentang kapasitas mahasiswa/peserta.

### 4. `ruangan-data.ts`
- **Lokasi**: `src/lib/ruangan-data.ts`
- **Fungsi**: Sumber data terstruktur untuk ruangan kampus Vokasi.
- **Model Tipe**:
  - `Room`: nama ruangan, kapasitas minimal, maksimal, dan tautan gambar.
  - `Floor`: id lantai, label (misal: "Basement", "Lantai 1"), dan daftar `Room[]`.
  - `Building`: nama gedung dan daftar `Floor[]`.
- **Dataset Tersedia**:
  - **GEDUNG BNI**: Memiliki 4 lantai (Basement, Lantai 1, Lantai 2, Lantai 3).
  - **GEDUNG DIENG**: Memiliki 7 lantai (Lantai 1 sampai 7).
  - **GEDUNG KP**: Memiliki 5 lantai (Lantai 1 sampai 5).

---

## 🎨 Desain & Konfigurasi Tema

Proyek ini menggunakan **Tailwind CSS v4** dengan konfigurasi variabel tema di `src/app/globals.css`:

```css
@theme {
  --color-sidebar: #005f99;        /* Biru primer navigasi sidebar & tombol utama */
  --color-navy: #1c3a63;           /* Biru gelap untuk header tabs */
  --color-accent: #ffbf00;         /* Kuning aksen untuk banner penanda lantai */
  --color-sidebar-active: rgba(255, 255, 255, 0.12); /* Efek sorot menu aktif */
}
```

Tersedia juga animasi custom `@keyframes fadeIn` untuk transisi halus saat berganti tab gedung atau memilih filter lantai.

---

## 🚀 Panduan Instalasi & Menjalankan

### Prasyarat
Pastikan sistem Anda telah terpasang:
- **Node.js** (versi 18.18+ atau versi 20+ direkomendasikan)
- **npm** (atau package manager alternatif seperti `pnpm` / `yarn`)

### Langkah-langkah

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/INVOKS/frontend-web.git
   cd frontend-web
   ```

2. **Checkout ke Branch Pengembangan**:
   ```bash
   git checkout dev/syafiq
   ```

3. **Instal Dependensi**:
   ```bash
   npm install
   ```

4. **Jalankan Server Pengembangan (Dev Server)**:
   ```bash
   npm run dev
   ```
   Buka browser dan akses alamat [http://localhost:3000](http://localhost:3000).

5. **Uji Rute Utama**:
   - Login: [http://localhost:3000/login](http://localhost:3000/login)
   - Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - Ruangan: [http://localhost:3000/ruangan](http://localhost:3000/ruangan)

---

## 📜 Skrip NPM yang Tersedia

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan Next.js development server dengan Hot Reload |
| `npm run build` | Melakukan kompilasi dan optimasi bundle untuk tahap *production* |
| `npm run start` | Menjalankan server *production* hasil kompilasi `npm run build` |
| `npm run lint` | Menjalankan pengecekan kualitas dan konsistensi kode via ESLint |

---

## 🔮 Roadmap Pengembangan

- [x] Desain sistem & struktur dasar folder App Router Next.js
- [x] Pembuatan komponen `Sidebar` dan layout admin terpusat
- [x] Pembuatan halaman login admin responsif berbasis desain Figma
- [x] Pembuatan halaman dashboard penyambutan
- [x] Pembuatan modul visualisasi ruangan (tab gedung, filter lantai, kartu ruangan, dataset)
- [ ] Integrasi REST API autentikasi (Login token/session handling)
- [ ] Implementasi modal form dialog Tambah & Edit Ruangan pada FAB
- [ ] Pengembangan modul tabel data **Barang** (stok, kondisi, kategori)
- [ ] Pengembangan modul **Kelola Peminjaman** (verifikasi, kalender jadwal, status peminjaman)
- [ ] Pengembangan halaman pengaturan **Profil** pengguna
