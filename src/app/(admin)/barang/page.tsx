"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Barang, KategoriBarang, initialBarangList } from "@/lib/barang-data";
import HeaderTabs from "./components/HeaderTabs";
import BarangCard from "./components/BarangCard";
import BarangDetailModal from "./components/BarangDetailModal";
import BarangEditModal from "./components/BarangEditModal";
import BarangAddModal from "./components/BarangAddModal";

export default function BarangPage() {
  const [barangList, setBarangList] = useState<Barang[]>(initialBarangList);
  const [activeCategory, setActiveCategory] = useState<KategoriBarang>("ELEKTRONIK");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Modal State (Detail atau Edit)
  const [modalState, setModalState] = useState<{
    type: "detail" | "edit";
    barang: Barang;
  } | null>(null);

  // Filter barang sesuai kategori yang aktif
  const filteredBarang = barangList.filter(
    (item) => item.kategori === activeCategory
  );

  // Handler klik kartu barang
  const handleCardClick = (barang: Barang) => {
    setModalState({
      type: "detail",
      barang,
    });
  };

  // Dari modal detail ke edit
  const handleEditFromDetail = (barang: Barang) => {
    setModalState({
      type: "edit",
      barang,
    });
  };

  // Tutup edit kembali ke detail
  const handleCloseEdit = () => {
    if (modalState?.barang) {
      setModalState({
        type: "detail",
        barang: modalState.barang,
      });
    } else {
      setModalState(null);
    }
  };

  const handleCloseDetail = () => {
    setModalState(null);
  };

  // Tambah Barang Baru
  const handleAddBarang = (newBarang: Barang) => {
    setBarangList((prev) => [newBarang, ...prev]);
    setIsAddModalOpen(false);
  };

  // Simpan Perubahan Edit Barang
  const handleSaveBarang = (updatedBarang: Barang) => {
    setBarangList((prev) =>
      prev.map((item) => (item.id === updatedBarang.id ? updatedBarang : item))
    );
    // Kembali ke detail dengan data terbaru
    setModalState({
      type: "detail",
      barang: updatedBarang,
    });
  };

  // Hapus Barang
  const handleDeleteBarang = (barang: Barang) => {
    setBarangList((prev) => prev.filter((item) => item.id !== barang.id));
    setModalState(null);
  };

  return (
    <div className="relative min-h-screen bg-white pb-24">
      {/* =====================================================
          HEADER KATEGORI BARANG (FURNITUR & ELEKTRONIK)
      ===================================================== */}
      <HeaderTabs
        activeTab={activeCategory}
        onTabChange={(tab) => setActiveCategory(tab)}
      />

      {/* =====================================================
          GRID KARTU BARANG (5 Kolom per Baris Sesuai Desain)
      ===================================================== */}
      <main className="w-full">
        <div
          key={activeCategory}
          className="grid grid-cols-2 gap-6 sm:gap-7 xl:gap-8 px-6 sm:px-8 xl:px-[56px] py-[30px] md:grid-cols-3 xl:grid-cols-5 animate-fadeIn"
        >
          {filteredBarang.length > 0 ? (
            filteredBarang.map((item) => (
              <BarangCard
                key={item.id}
                barang={item}
                onClick={() => handleCardClick(item)}
              />
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-gray-500">
              Belum ada barang di kategori {activeCategory}. Klik tombol{" "}
              <strong>+</strong> di pojok kanan bawah untuk menambahkan.
            </div>
          )}
        </div>
      </main>

      {/* =====================================================
          TOMBOL FLOATING TAMBAH BARANG (+)
      ===================================================== */}
      <button
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        aria-label="Tambah barang"
        className="fixed bottom-8 right-8 z-30 flex size-[56px] cursor-pointer items-center justify-center rounded-2xl bg-[#0672A6] text-white shadow-lg transition hover:scale-105 hover:brightness-110 active:scale-95 focus:outline-none"
      >
        <div className="flex size-[32px] items-center justify-center rounded-full border-[4px] border-white">
          <FaPlus className="size-4" aria-hidden="true" />
        </div>
      </button>

      {/* =====================================================
          MODAL DETAIL BARANG
      ===================================================== */}
      <BarangDetailModal
        barang={modalState?.type === "detail" ? modalState.barang : null}
        open={modalState?.type === "detail"}
        onClose={handleCloseDetail}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteBarang}
      />

      {/* =====================================================
          MODAL EDIT BARANG
      ===================================================== */}
      <BarangEditModal
        barang={modalState?.type === "edit" ? modalState.barang : null}
        open={modalState?.type === "edit"}
        onClose={handleCloseEdit}
        onSave={handleSaveBarang}
      />

      {/* =====================================================
          MODAL TAMBAH BARANG
      ===================================================== */}
      <BarangAddModal
        open={isAddModalOpen}
        defaultKategori={activeCategory}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddBarang}
      />
    </div>
  );
}
