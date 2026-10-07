"use client";

import { useState } from "react";
import HeaderTabs from "@/components/HeaderTabs";
import RoomCard from "@/components/RoomCard";
import { FaPlusCircle } from "react-icons/fa";
import { buildings } from "@/lib/ruangan-data";

export default function RuanganPage() {
  const [building, setBuilding] = useState<string>("GEDUNG BNI");
  const [selectedFloor, setSelectedFloor] = useState<string>("");

  const tabs = buildings.map((b) => b.name);
  const activeBuilding =
    buildings.find((b) => b.name === building) ?? buildings[0];

  const visibleFloors = selectedFloor
    ? activeBuilding.floors.filter((f) => f.id === selectedFloor)
    : activeBuilding.floors;

  // ganti tab: reset filter lantai
  const handleBuildingChange = (name: string) => {
    setBuilding(name);
    setSelectedFloor("");
  };

  return (
    <div className="relative min-h-screen bg-white pb-24">
      {/* 1. Header Tabs Gedung */}
      <HeaderTabs
        tabs={tabs}
        active={building}
        onChange={handleBuildingChange}
      />

      {/* 2. Filter Dropdown Lantai */}
      <div className="flex justify-end pr-[22px] py-[36px]">
        <select
          value={selectedFloor}
          onChange={(e) => setSelectedFloor(e.target.value)}
          aria-label="Pilih lantai"
          className="h-[36px] w-[237px] rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-sm transition-colors focus:border-sidebar focus:outline-none"
        >
          <option value="">Pilih lantai</option>
          {activeBuilding.floors.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Section Per Lantai */}
      <div key={building + "-" + selectedFloor} className="flex flex-col gap-6 animate-fadeIn">
        {visibleFloors.map((floorData) => (
          <section key={floorData.id} className="w-full">
            {/* Banner Lantai */}
            <div className="flex h-[36px] w-full items-center justify-center bg-accent text-lg font-bold text-black tracking-wide">
              {floorData.label}
            </div>

            {/* Grid Kartu Ruangan */}
            <div className="grid grid-cols-2 gap-8 px-6 py-[32px] md:grid-cols-3 md:px-[56px] xl:grid-cols-5">
              {floorData.rooms.map((room) => (
                <RoomCard
                  key={room.name}
                  name={room.name}
                  capacityMin={room.min}
                  capacityMax={room.max}
                  imageUrl={room.imageUrl}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 4. Tombol Tambah Melayang */}
      <button
        type="button"
        aria-label="Tambah ruangan"
        className="fixed bottom-8 right-8 z-30 flex size-[54px] items-center justify-center rounded-xl bg-sidebar text-white shadow-lg transition-transform hover:scale-105 hover:brightness-110 active:scale-95 focus:outline-none"
      >
        <FaPlusCircle className="size-7" aria-hidden="true" />
      </button>
    </div>
  );
}
