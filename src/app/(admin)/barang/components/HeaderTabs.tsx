"use client";

import { KategoriBarang } from "@/lib/barang-data";

type HeaderTabsProps = {
  activeTab: KategoriBarang;
  onTabChange: (tab: KategoriBarang) => void;
};

const TABS: KategoriBarang[] = ["ELEKTRONIK", "FURNITUR"];

export default function HeaderTabs({ activeTab, onTabChange }: HeaderTabsProps) {
  return (
    <header className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-6 select-none shadow-sm">
      {/* ── Tab Kategori Barang (Kiri) ── */}
      <nav aria-label="Tab Kategori Barang" className="flex items-center gap-1 h-full">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`
                h-[36px] px-5 rounded-full text-sm font-bold uppercase transition-all duration-150 cursor-pointer focus:outline-none
                ${
                  isActive
                    ? "bg-[#FFC400] text-black shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {tab}
            </button>
          );
        })}
      </nav>

      {/* ── Kanan: Hallo Admin INVOKS tanpa foto ── */}
      <div className="flex items-center gap-5">
        <span className="text-sm text-[#213F6B] whitespace-nowrap">
          Hallo, <strong className="font-bold">Admin INVOKS</strong>
        </span>
      </div>
    </header>
  );
}
