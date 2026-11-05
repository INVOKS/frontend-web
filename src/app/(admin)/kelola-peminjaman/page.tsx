"use client";

import { useState, useMemo } from "react";
import HeaderTabs from "./components/HeaderTabs";
import PeminjamanCard from "./components/PeminjamanCard";
import { mockPeminjaman, JenisPeminjaman } from "@/lib/peminjaman-data";

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

  const filteredData = useMemo(() => {
    return mockPeminjaman.filter((item) => {
      const matchJenis = item.jenis === activeTab;
      const matchStatus = filterStatus === "" || item.status === filterStatus;
      return matchJenis && matchStatus;
    });
  }, [activeTab, filterStatus]);

  const handleTabChange = (tab: string) => {
    const found = TABS.find((t) => t.label === tab);
    if (found) {
      setActiveTab(found.value);
      setFilterStatus(""); // reset filter saat ganti tab
    }
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col">
      {/* ══ HEADER + FILTER (satu bar) ══ */}
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
              <PeminjamanCard key={item.id} data={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
