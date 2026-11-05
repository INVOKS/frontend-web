// ─── Types ─────────────────────────────────────────────────────────────────

export type StatusPeminjaman = "mendatang" | "selesai";
export type JenisPeminjaman = "ruangan" | "barang";

export interface PeminjamanBarangItem {
  nama: string;
  kode: string;
  gambar: string;
  jumlah: number;
}

export interface DetailRuanganData {
  gedung: string;
  ruang: string;
  lantai: string;
  kapasitas: string;
  namaKegiatan: string;
}

export interface Peminjaman {
  id: string;
  namaPeminjam: string;
  jenis: JenisPeminjaman;
  status: StatusPeminjaman;
  tanggalMulai: string;    // e.g. "15/10/2026"
  tanggalSelesai: string;  // e.g. "22/10/2026"
  waktuMulai: string;      // e.g. "13.00 - 17.00"
  waktuSelesai: string;    // e.g. "09.00 - 13.00"
  detailRuangan?: DetailRuanganData;
  detailBarang?: PeminjamanBarangItem[];
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

export const mockPeminjaman: Peminjaman[] = [
  // ── RUANGAN – mendatang ──────────────────────────────────────────────────
  {
    id: "r-1",
    namaPeminjam: "Erlangga T.",
    jenis: "ruangan",
    status: "mendatang",
    tanggalMulai: "15/10/2026",
    tanggalSelesai: "22/10/2026",
    waktuMulai: "13.00 - 17.00",
    waktuSelesai: "09.00 - 13.00",
    detailRuangan: {
      gedung: "BNI",
      ruang: "202",
      lantai: "Basment",
      kapasitas: "30 orang",
      namaKegiatan: "Seminar",
    },
  },
  {
    id: "r-2",
    namaPeminjam: "Muhammad Ikhsan",
    jenis: "ruangan",
    status: "mendatang",
    tanggalMulai: "15/10/2026",
    tanggalSelesai: "22/10/2026",
    waktuMulai: "13.00 - 17.00",
    waktuSelesai: "09.00 - 13.00",
    detailRuangan: {
      gedung: "BNI",
      ruang: "202",
      lantai: "Basment",
      kapasitas: "30 orang",
      namaKegiatan: "Seminar",
    },
  },
  {
    id: "r-3",
    namaPeminjam: "Mang Ujo",
    jenis: "ruangan",
    status: "mendatang",
    tanggalMulai: "15/10/2026",
    tanggalSelesai: "22/10/2026",
    waktuMulai: "13.00 - 17.00",
    waktuSelesai: "09.00 - 13.00",
    detailRuangan: {
      gedung: "BNI",
      ruang: "202",
      lantai: "Basment",
      kapasitas: "30 orang",
      namaKegiatan: "Seminar",
    },
  },

  // ── RUANGAN – selesai ────────────────────────────────────────────────────
  {
    id: "r-4",
    namaPeminjam: "Sam Ndut",
    jenis: "ruangan",
    status: "selesai",
    tanggalMulai: "15/10/2026",
    tanggalSelesai: "22/10/2026",
    waktuMulai: "13.00 - 17.00",
    waktuSelesai: "09.00 - 13.00",
    detailRuangan: {
      gedung: "BNI",
      ruang: "202",
      lantai: "Basment",
      kapasitas: "30 orang",
      namaKegiatan: "Seminar",
    },
  },
  {
    id: "r-5",
    namaPeminjam: "Safira Desy",
    jenis: "ruangan",
    status: "selesai",
    tanggalMulai: "15/10/2026",
    tanggalSelesai: "22/10/2026",
    waktuMulai: "13.00 - 17.00",
    waktuSelesai: "09.00 - 13.00",
    detailRuangan: {
      gedung: "BNI",
      ruang: "202",
      lantai: "Basment",
      kapasitas: "30 orang",
      namaKegiatan: "Seminar",
    },
  },
  {
    id: "r-6",
    namaPeminjam: "Damar Putra",
    jenis: "ruangan",
    status: "selesai",
    tanggalMulai: "15/10/2026",
    tanggalSelesai: "22/10/2026",
    waktuMulai: "13.00 - 17.00",
    waktuSelesai: "09.00 - 13.00",
    detailRuangan: {
      gedung: "BNI",
      ruang: "202",
      lantai: "Basment",
      kapasitas: "30 orang",
      namaKegiatan: "Seminar",
    },
  },

  // ── BARANG – mendatang ───────────────────────────────────────────────────
  {
    id: "b-1",
    namaPeminjam: "Mang Ujo",
    jenis: "barang",
    status: "mendatang",
    tanggalMulai: "15/10/2026",
    tanggalSelesai: "22/10/2026",
    waktuMulai: "13.00 - 17.00",
    waktuSelesai: "09.00 - 13.00",
    detailBarang: [
      { nama: "Sofa Vokasi", kode: "SF_01", gambar: "/images/Barang F2.png", jumlah: 1 },
      { nama: "Proyektor", kode: "PK_01", gambar: "/images/Barang E1.png", jumlah: 1 },
      { nama: "Sofa Vokasi", kode: "SF_02", gambar: "/images/Barang F2.png", jumlah: 1 },
    ],
  },
  {
    id: "b-2",
    namaPeminjam: "Erlangga T",
    jenis: "barang",
    status: "mendatang",
    tanggalMulai: "15/10/2026",
    tanggalSelesai: "22/10/2026",
    waktuMulai: "13.00 - 17.00",
    waktuSelesai: "09.00 - 13.00",
    detailBarang: [
      { nama: "Sofa Vokasi", kode: "SF_01", gambar: "/images/Barang F2.png", jumlah: 1 },
      { nama: "Proyektor", kode: "PK_01", gambar: "/images/Barang E1.png", jumlah: 1 },
      { nama: "Sofa Vokasi", kode: "SF_02", gambar: "/images/Barang F2.png", jumlah: 1 },
    ],
  },

  // ── BARANG – selesai ─────────────────────────────────────────────────────
  {
    id: "b-3",
    namaPeminjam: "Sam Ndut",
    jenis: "barang",
    status: "selesai",
    tanggalMulai: "15/10/2026",
    tanggalSelesai: "22/10/2026",
    waktuMulai: "13.00 - 17.00",
    waktuSelesai: "09.00 - 13.00",
    detailBarang: [
      { nama: "Sofa Vokasi", kode: "SF_01", gambar: "/images/Barang F2.png", jumlah: 1 },
      { nama: "Proyektor", kode: "PK_01", gambar: "/images/Barang E1.png", jumlah: 1 },
      { nama: "Sofa Vokasi", kode: "SF_02", gambar: "/images/Barang F2.png", jumlah: 1 },
    ],
  },
];

