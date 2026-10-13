"use client";

import { useState } from "react";
import HeaderTabs from "@/components/HeaderTabs";
import RoomCard from "@/components/RoomCard";
import RoomDetailModal from "@/components/RoomDetailModal";
import RoomEditModal from "@/components/RoomEditModal";
import RoomAddModal from "@/components/RoomAddModal";
import { FaPlus } from "react-icons/fa";
import { buildings, Building, Floor, Ruangan } from "@/lib/ruangan-data";

export default function RuanganPage() {
  const [buildingList, setBuildingList] = useState<Building[]>(buildings);
  const [building, setBuilding] = useState<string>("GEDUNG BNI");
  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State pengelolaan modal terpusat (hanya satu modal yang aktif pada satu waktu)
  const [modalState, setModalState] = useState<{
    type: "detail" | "edit";
    room: Ruangan;
  } | null>(null);

  const tabs = buildingList.map((b) => b.name);
  const activeBuilding =
    buildingList.find((b) => b.name === building) ?? buildingList[0];

  const visibleFloors = selectedFloor
    ? activeBuilding.floors.filter((f) => f.id === selectedFloor)
    : activeBuilding.floors;

  // Ganti tab gedung: reset filter lantai
  const handleBuildingChange = (name: string) => {
    setBuilding(name);
    setSelectedFloor("");
  };

  // Klik card ruangan -> buka modal detail
  const handleCardClick = (room: Ruangan) => {
    setModalState({ type: "detail", room });
  };

  // Dari modal detail klik tombol Edit -> buka modal edit
  const handleEditFromDetail = (room: Ruangan) => {
    setModalState({ type: "edit", room });
  };

  // Tutup modal edit tanpa simpan -> kembali ke modal detail dengan data lama
  const handleCloseEdit = () => {
    if (modalState?.room) {
      setModalState({ type: "detail", room: modalState.room });
    } else {
      setModalState(null);
    }
  };

  // Tutup modal detail -> tutup semua modal
  const handleCloseDetail = () => {
    setModalState(null);
  };

  // Tambah ruangan baru
  const handleAddRoom = (newRoom: Ruangan) => {
    // TODO: ganti dengan API call saat backend sudah tersedia
    setBuildingList((prevBuildings) => {
      return prevBuildings.map((b) => {
        const targetBuildingName = newRoom.gedung || building;
        const isCurrentBuilding =
          b.name === targetBuildingName ||
          b.name.includes(targetBuildingName) ||
          targetBuildingName.includes(b.name.replace(/^GEDUNG\s+/i, ""));

        if (!isCurrentBuilding) return b;

        // 1. Tentukan target lantai
        const targetFloorId = String(newRoom.lantai)
          .toLowerCase()
          .includes("basement")
          ? "basement"
          : String(newRoom.lantai);
        const targetFloorLabel =
          targetFloorId === "basement"
            ? "Basement"
            : `Lantai ${newRoom.lantai}`;

        // 2. Cek apakah lantai sudah ada di gedung ini
        const targetFloorExists = b.floors.some((f) => f.id === targetFloorId);

        let updatedFloors: Floor[];
        if (targetFloorExists) {
          updatedFloors = b.floors.map((floor) =>
            floor.id === targetFloorId
              ? { ...floor, rooms: [...floor.rooms, newRoom] }
              : floor
          );
        } else {
          // Buat lantai baru jika belum ada dan urutkan
          const newFloor: Floor = {
            id: targetFloorId,
            label: targetFloorLabel,
            rooms: [newRoom],
          };
          updatedFloors = [...b.floors, newFloor].sort((f1, f2) => {
            if (f1.id === "basement") return -1;
            if (f2.id === "basement") return 1;
            return Number(f1.id) - Number(f2.id);
          });
        }

        return {
          ...b,
          floors: updatedFloors,
        };
      });
    });

    setIsAddModalOpen(false);
  };

  // Simpan hasil edit ruangan
  const handleSaveRoom = (updatedRoom: Ruangan) => {
    // TODO: ganti dengan API call saat backend sudah tersedia
    setBuildingList((prevBuildings) => {
      return prevBuildings.map((b) => {
        const isCurrentBuilding =
          b.name === updatedRoom.gedung ||
          b.name.includes(updatedRoom.gedung) ||
          updatedRoom.gedung.includes(b.name.replace(/^GEDUNG\s+/i, ""));

        if (!isCurrentBuilding) return b;

        // 1. Hapus ruangan dari lantai lamanya
        const cleanFloors = b.floors.map((floor) => ({
          ...floor,
          rooms: floor.rooms.filter((r) => r.id !== updatedRoom.id),
        }));

        // 2. Tentukan target lantai
        const targetFloorId = String(updatedRoom.lantai)
          .toLowerCase()
          .includes("basement")
          ? "basement"
          : String(updatedRoom.lantai);
        const targetFloorLabel =
          targetFloorId === "basement"
            ? "Basement"
            : `Lantai ${updatedRoom.lantai}`;

        // 3. Masukkan ke lantai tujuan
        const targetFloorExists = cleanFloors.some(
          (f) => f.id === targetFloorId
        );

        let updatedFloors = cleanFloors;
        if (targetFloorExists) {
          updatedFloors = cleanFloors.map((floor) =>
            floor.id === targetFloorId
              ? { ...floor, rooms: [...floor.rooms, updatedRoom] }
              : floor
          );
        } else {
          // Buat lantai baru jika belum ada dan urutkan
          const newFloor: Floor = {
            id: targetFloorId,
            label: targetFloorLabel,
            rooms: [updatedRoom],
          };
          updatedFloors = [...cleanFloors, newFloor].sort((f1, f2) => {
            if (f1.id === "basement") return -1;
            if (f2.id === "basement") return 1;
            return Number(f1.id) - Number(f2.id);
          });
        }

        return {
          ...b,
          floors: updatedFloors,
        };
      });
    });

    // Setelah simpan sukses, kembali ke modal detail dengan data terbaru
    setModalState({ type: "detail", room: updatedRoom });
  };

  // Hapus ruangan
  const handleDeleteRoom = (room: Ruangan) => {
    // TODO: ganti dengan API call saat backend sudah tersedia
    setBuildingList((prev) =>
      prev.map((b) => ({
        ...b,
        floors: b.floors.map((f) => ({
          ...f,
          rooms: f.rooms.filter((r) => r.id !== room.id),
        })),
      }))
    );
    setModalState(null);
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
      <div
        key={building + "-" + selectedFloor}
        className="flex flex-col gap-6 animate-fadeIn"
      >
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
                  key={room.id || room.name}
                  name={room.nama || room.name}
                  capacityMin={room.min}
                  capacityMax={room.max}
                  imageUrl={room.gambar || room.imageUrl}
                  onClick={() => handleCardClick(room)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 4. Tombol Tambah Melayang */}
      <button
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        aria-label="Tambah ruangan"
        className="fixed bottom-8 right-8 z-30 flex size-[56px] cursor-pointer items-center justify-center rounded-full bg-[#0F5A96] text-white shadow-xl transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5A96] focus-visible:ring-offset-2"
      >
        <FaPlus className="size-6" aria-hidden="true" />
      </button>

      {/* 5. Modal Pop-up Detail Ruangan */}
      <RoomDetailModal
        room={modalState?.type === "detail" ? modalState.room : null}
        open={modalState?.type === "detail"}
        onClose={handleCloseDetail}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteRoom}
      />

      {/* 6. Modal Pop-up Edit Ruangan */}
      <RoomEditModal
        room={modalState?.type === "edit" ? modalState.room : null}
        open={modalState?.type === "edit"}
        onClose={handleCloseEdit}
        onSave={handleSaveRoom}
      />

      {/* 7. Modal Pop-up Tambah Ruangan */}
      <RoomAddModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddRoom}
        defaultGedung={building}
      />
    </div>
  );
}
