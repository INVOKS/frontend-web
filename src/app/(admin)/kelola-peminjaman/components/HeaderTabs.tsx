"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type FilterOption = { value: string; label: string };

type HeaderTabsProps = {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
  filterValue: string;
  filterOptions: FilterOption[];
  onFilterChange: (value: string) => void;
  filterPlaceholder?: string;
};

export default function HeaderTabs({
  tabs,
  active,
  onChange,
  filterValue,
  filterOptions,
  onFilterChange,
  filterPlaceholder = "Pilih kategori",
}: HeaderTabsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Tutup dropdown saat klik di luar */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel =
    filterOptions.find((o) => o.value === filterValue)?.label ?? filterPlaceholder;

  return (
    <header className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-6 select-none shadow-sm">
      {/* ── Tab RUANGAN / BARANG ─────────────────── */}
      <nav aria-label="Tab Peminjaman" className="flex items-center gap-1 h-full">
        {tabs.map((tab) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
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

      {/* ── Kanan: Dropdown filter + Hallo Admin ── */}
      <div className="flex items-center gap-5">
        {/* Custom dropdown filter */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((p) => !p)}
            className="flex items-center gap-2 px-4 h-[34px] rounded-md border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none"
          >
            <span className={filterValue ? "text-gray-800" : "text-gray-500"}>
              {selectedLabel}
            </span>
            {dropdownOpen ? (
              <FaChevronUp className="text-gray-500 text-xs" />
            ) : (
              <FaChevronDown className="text-gray-500 text-xs" />
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-1 min-w-[160px] bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden animate-fadeIn">
              <button
                type="button"
                onClick={() => {
                  onFilterChange("");
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50 ${
                  filterValue === ""
                    ? "font-semibold text-gray-900 bg-gray-50"
                    : "text-gray-700"
                }`}
              >
                Semua Kategori
              </button>
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onFilterChange(opt.value);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50 ${
                    opt.value === filterValue
                      ? "font-semibold text-gray-900 bg-gray-50"
                      : "text-gray-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Admin Text tanpa foto */}
        <span className="text-sm text-[#213F6B] whitespace-nowrap">
          Hallo, <strong className="font-bold">Admin INVOKS</strong>
        </span>
      </div>
    </header>
  );
}
