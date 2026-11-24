"use client";

import { useState, useMemo } from "react";
import HeaderTabs from "./components/HeaderTabs";
import PeminjamanCard from "./components/PeminjamanCard";
import DetailBarangModal from "./components/DetailBarangModal";
import {
  mockPeminjaman,
  JenisPeminjaman,
  Peminjaman,
  StatusPengembalianBarang,
} from "@/lib/peminjaman-data";

const TABS: { label: string; value: JenisPeminjaman }[] = [
  { label: "RUANGAN", value: "ruangan" },
  { label: "BARANG", value: "barang" },
];

const STATUS_OPTIONS = [
  { value: "mendatang", label: "Mendatang" },
  { value: "selesai", label: "Selesai" },
];

export default function KelolaPeminjamanPage() {
  const [activeTab, setActiveTab] = useState<JenisPeminjaman>("ruangan");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>(mockPeminjaman);
  const [selectedPeminjaman, setSelectedPeminjaman] = useState<Peminjaman | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredData = useMemo(() => {
    return peminjamanList.filter((item) => {
      const matchJenis = item.jenis === activeTab;
      const matchStatus = filterStatus === "" || item.status === filterStatus;
      return matchJenis && matchStatus;
    });
  }, [peminjamanList, activeTab, filterStatus]);

  const handleTabChange = (tab: string) => {
    const found = TABS.find((t) => t.label === tab);
    if (found) {
      setActiveTab(found.value);
      setFilterStatus(""); // reset filter saat ganti tab
    }
  };

  const handleCardClick = (item: Peminjaman) => {
    if (item.jenis === "barang") {
      setSelectedPeminjaman(item);
      setIsModalOpen(true);
    }
  };

  const handleStatusChange = (
    peminjamanId: string,
    itemIndex: number,
    newStatus: StatusPengembalianBarang
  ) => {
    setPeminjamanList((prevList) =>
      prevList.map((item) => {
        if (item.id !== peminjamanId || !item.detailBarang) return item;

        const updatedDetailBarang = item.detailBarang.map((barangItem, idx) => {
          if (idx !== itemIndex) return barangItem;
          return {
            ...barangItem,
            statusPengembalian: newStatus,
          };
        });

        const updatedItem = {
          ...item,
          detailBarang: updatedDetailBarang,
        };

        // Jika item ini sedang dibuka di modal, perbarui juga state modalnya
        if (selectedPeminjaman && selectedPeminjaman.id === peminjamanId) {
          setSelectedPeminjaman(updatedItem);
        }

        return updatedItem;
      })
    );
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col">
      {/* ══ HEADER + FILTER (satu bar, sesuai header yang sudah ada) ══ */}
      <HeaderTabs
        tabs={TABS.map((t) => t.label)}
        active={TABS.find((t) => t.value === activeTab)?.label ?? "RUANGAN"}
        onChange={handleTabChange}
        filterValue={filterStatus}
        filterOptions={STATUS_OPTIONS}
        onFilterChange={setFilterStatus}
        filterPlaceholder="Pilih kategori"
      />

      {/* ══ GRID KARTU ══ */}
      <div className="flex-1 px-6 py-8">
        {filteredData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            Tidak ada data peminjaman.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredData.map((item) => (
              <PeminjamanCard
                key={item.id}
                data={item}
                onClick={() => handleCardClick(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ══ POP-UP DETAIL PEMINJAMAN BARANG ══ */}
      <DetailBarangModal
        open={isModalOpen}
        data={selectedPeminjaman}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
