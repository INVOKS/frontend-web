/**
 * Tipe data untuk Kelola Peminjaman (Ruangan & Barang)
 */

export type StatusPeminjaman = "mendatang" | "selesai" | "dibatalkan";
export type JenisPeminjaman = "ruangan" | "barang";
export type StatusPengembalianBarang = "dipinjam" | "dikembalikan";

export interface PeminjamanBarangItem {
  id?: string | number;
  nama: string;
  kode: string;
  gambar: string;
  jumlah: number;
  statusPengembalian?: StatusPengembalianBarang;
}

export interface DetailRuanganData {
  idRuangan?: string | number;
  gedung: string;
  ruang: string;
  lantai: string;
  kapasitas: string;
  namaKegiatan: string;
}

export interface Peminjaman {
  id: string;
  bookingCode?: string;
  namaPeminjam: string;
  jenis: JenisPeminjaman;
  status: StatusPeminjaman;
  tanggalMulai: string; // Format e.g. "15/10/2026" atau "2026-10-15"
  tanggalSelesai: string; // Format e.g. "22/10/2026" atau "2026-10-22"
  waktuMulai: string; // e.g. "13.00 - 17.00"
  waktuSelesai: string; // e.g. "09.00 - 13.00"
  detailRuangan?: DetailRuanganData;
  detailBarang?: PeminjamanBarangItem[];
}

export interface RoomBookingPayload {
  roomId: number;
  activityName: string;
  activityDescription?: string;
  organizer: string;
  participantCount: number;
  picName: string;
  picPhone: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface ItemBorrowingPayload {
  activityName: string;
  picName: string;
  picPhone: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  items: {
    itemId: number;
    quantity: number;
  }[];
}

