"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type HeaderTabsProps = {
  /** Daftar tab gedung, misal ["GEDUNG BNI", "GEDUNG DIENG", "GEDUNG KP"] */
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
  /** Label & value opsi dropdown lantai */
  floorOptions: { value: string; label: string }[];
  selectedFloor: string;
  onFloorChange: (value: string) => void;
};

export default function HeaderTabs({
  tabs,
  active,
  onChange,
  floorOptions,
  selectedFloor,
  onFloorChange,
}: HeaderTabsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Tutup dropdown saat klik luar */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedOption = floorOptions.find((o) => o.value === selectedFloor);
  const selectedLabel = selectedOption?.label ?? "Semua Lantai";

  return (
    <header className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-6 select-none shadow-sm">
      {/* ── Tab Gedung (Kiri) ────────────────────── */}
      <nav aria-label="Tab Gedung" className="flex items-center gap-1 h-full">
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

      {/* ── Kanan: Dropdown Lantai + Hallo Admin ── */}
      <div className="flex items-center gap-5">
        {/* Dropdown Pilih Lantai */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((p) => !p)}
            className="flex items-center gap-2 px-4 h-[34px] rounded-md border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none"
          >
            <span>{selectedLabel}</span>
            {dropdownOpen ? (
              <FaChevronUp className="text-gray-500 text-xs" />
            ) : (
              <FaChevronDown className="text-gray-500 text-xs" />
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-1 min-w-[160px] bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden animate-fadeIn">
              {floorOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onFloorChange(opt.value);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50 ${
                    opt.value === selectedFloor
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
