"use client";

import { useState, useMemo, useCallback } from "react";
import { Barang, KategoriBarang } from "@/types/barang";
import { initialBarangList } from "@/lib/barang-data";

export function useBarang(initialData: Barang[] = initialBarangList) {
  const [barangList, setBarangList] = useState<Barang[]>(initialData);
  const [activeCategory, setActiveCategory] = useState<KategoriBarang>("ELEKTRONIK");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Filter barang berdasarkan kategori aktif dan kata kunci pencarian
  const filteredBarang = useMemo(() => {
    return barangList.filter((item) => {
      const matchCategory = activeCategory
        ? item.kategori.toUpperCase() === activeCategory.toUpperCase()
        : true;
      const matchSearch = searchQuery
        ? item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.kodeBarang.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchCategory && matchSearch;
    });
  }, [barangList, activeCategory, searchQuery]);

  // Tambah barang baru
  const addBarang = useCallback((newBarang: Barang) => {
    setBarangList((prev) => [newBarang, ...prev]);
  }, []);

  // Update data barang
  const updateBarang = useCallback((id: string | number, updatedData: Partial<Barang>) => {
    setBarangList((prev) =>
      prev.map((item) => (String(item.id) === String(id) ? { ...item, ...updatedData } : item))
    );
  }, []);

  // Hapus barang
  const deleteBarang = useCallback((id: string | number) => {
    setBarangList((prev) => prev.filter((item) => String(item.id) !== String(id)));
  }, []);

  return {
    barangList,
    filteredBarang,
    activeCategory,
    searchQuery,
    isLoading,
    setActiveCategory,
    setSearchQuery,
    setIsLoading,
    setBarangList,
    addBarang,
    updateBarang,
    deleteBarang,
  };
}

export default useBarang;
