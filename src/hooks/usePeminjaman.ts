"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Peminjaman,
  JenisPeminjaman,
  StatusPeminjaman,
  StatusPengembalianBarang,
} from "@/types/peminjaman";
import { mockPeminjaman } from "@/lib/peminjaman-data";

export function usePeminjaman(initialData: Peminjaman[] = mockPeminjaman) {
  const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>(initialData);
  const [activeTab, setActiveTab] = useState<JenisPeminjaman>("ruangan");
  const [statusFilter, setStatusFilter] = useState<StatusPeminjaman | "semua">("mendatang");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Filter peminjaman berdasarkan tab aktif (ruangan/barang) dan status
  const filteredPeminjaman = useMemo(() => {
    return peminjamanList.filter((item) => {
      // Filter jenis
      if (item.jenis !== activeTab) return false;

      // Filter status
      if (statusFilter !== "semua" && item.status !== statusFilter) {
        return false;
      }

      // Filter pencarian teks
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchNama = item.namaPeminjam.toLowerCase().includes(query);
        const matchRuang = item.detailRuangan?.ruang.toLowerCase().includes(query) || false;
        const matchGedung = item.detailRuangan?.gedung.toLowerCase().includes(query) || false;
        const matchBarang =
          item.detailBarang?.some((b) => b.nama.toLowerCase().includes(query)) || false;

        return matchNama || matchRuang || matchGedung || matchBarang;
      }

      return true;
    });
  }, [peminjamanList, activeTab, statusFilter, searchQuery]);

  // Update status pengembalian unit barang pada peminjaman barang
  const updateStatusPengembalian = useCallback(
    (peminjamanId: string, kodeBarang: string, status: StatusPengembalianBarang) => {
      setPeminjamanList((prevList) =>
        prevList.map((item) => {
          if (item.id !== peminjamanId || !item.detailBarang) return item;

          const updatedDetailBarang = item.detailBarang.map((b) =>
            b.kode === kodeBarang ? { ...b, statusPengembalian: status } : b
          );

          // Cek apakah seluruh barang sudah dikembalikan
          const allReturned = updatedDetailBarang.every(
            (b) => b.statusPengembalian === "dikembalikan"
          );

          return {
            ...item,
            detailBarang: updatedDetailBarang,
            status: allReturned ? "selesai" : item.status,
          };
        })
      );
    },
    []
  );

  // Update status keseluruhan peminjaman (misal: mendatang -> selesai)
  const updateStatusPeminjaman = useCallback(
    (peminjamanId: string, newStatus: StatusPeminjaman) => {
      setPeminjamanList((prevList) =>
        prevList.map((item) =>
          item.id === peminjamanId ? { ...item, status: newStatus } : item
        )
      );
    },
    []
  );

  return {
    peminjamanList,
    filteredPeminjaman,
    activeTab,
    statusFilter,
    searchQuery,
    isLoading,
    setActiveTab,
    setStatusFilter,
    setSearchQuery,
    setIsLoading,
    setPeminjamanList,
    updateStatusPengembalian,
    updateStatusPeminjaman,
  };
}

export default usePeminjaman;
