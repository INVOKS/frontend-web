"use client";

import { useState } from "react";
import RoomCard from "./components/RoomCard";
import RoomDetailModal from "./components/RoomDetailModal";
import RoomEditModal from "./components/RoomEditModal";
import RoomAddModal from "./components/RoomAddModal";
import { FaPlus, FaUserCircle } from "react-icons/fa";
import {
  buildings,
  Building,
  Floor,
  Ruangan,
} from "@/lib/ruangan-data";

export default function RuanganPage() {
  const [buildingList, setBuildingList] = useState<Building[]>(buildings);
  const [building, setBuilding] = useState<string>("GEDUNG BNI");
  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Hanya satu modal detail/edit aktif dalam satu waktu
  const [modalState, setModalState] = useState<{
    type: "detail" | "edit";
    room: Ruangan;
  } | null>(null);

  const activeBuilding =
    buildingList.find((item) => item.name === building) ?? buildingList[0];

  const visibleFloors = selectedFloor
    ? activeBuilding.floors.filter((floor) => floor.id === selectedFloor)
    : activeBuilding.floors;

  // Ganti gedung dan reset filter lantai
  const handleBuildingChange = (name: string) => {
    setBuilding(name);
    setSelectedFloor("");
  };

  // Klik card ruangan -> buka modal detail
  const handleCardClick = (room: Ruangan) => {
    setModalState({
      type: "detail",
      room,
    });
  };

  // Dari modal detail -> edit
  const handleEditFromDetail = (room: Ruangan) => {
    setModalState({
      type: "edit",
      room,
    });
  };

  // Tutup modal edit -> kembali ke detail
  const handleCloseEdit = () => {
    if (modalState?.room) {
      setModalState({
        type: "detail",
        room: modalState.room,
      });
    } else {
      setModalState(null);
    }
  };

  const handleCloseDetail = () => {
    setModalState(null);
  };

  // Tambah ruangan
  const handleAddRoom = (newRoom: Ruangan) => {
    setBuildingList((prevBuildings) => {
      return prevBuildings.map((currentBuilding) => {
        const targetBuildingName = newRoom.gedung || building;

        const isCurrentBuilding =
          currentBuilding.name === targetBuildingName ||
          currentBuilding.name.includes(targetBuildingName) ||
          targetBuildingName.includes(
            currentBuilding.name.replace(/^GEDUNG\s+/i, ""),
          );

        if (!isCurrentBuilding) {
          return currentBuilding;
        }

        const targetFloorId = String(newRoom.lantai)
          .toLowerCase()
          .includes("basement")
          ? "basement"
          : String(newRoom.lantai);

        const targetFloorLabel =
          targetFloorId === "basement"
            ? "Basement"
            : `Lantai ${newRoom.lantai}`;

        const targetFloorExists = currentBuilding.floors.some(
          (floor) => floor.id === targetFloorId,
        );

        let updatedFloors: Floor[];

        if (targetFloorExists) {
          updatedFloors = currentBuilding.floors.map((floor) =>
            floor.id === targetFloorId
              ? {
                  ...floor,
                  rooms: [...floor.rooms, newRoom],
                }
              : floor,
          );
        } else {
          const newFloor: Floor = {
            id: targetFloorId,
            label: targetFloorLabel,
            rooms: [newRoom],
          };

          updatedFloors = [...currentBuilding.floors, newFloor].sort(
            (floorA, floorB) => {
              if (floorA.id === "basement") return -1;
              if (floorB.id === "basement") return 1;

              return Number(floorA.id) - Number(floorB.id);
            },
          );
        }

        return {
          ...currentBuilding,
          floors: updatedFloors,
        };
      });
    });

    setIsAddModalOpen(false);
  };

  // Simpan hasil edit ruangan
  const handleSaveRoom = (updatedRoom: Ruangan) => {
    setBuildingList((prevBuildings) => {
      return prevBuildings.map((currentBuilding) => {
        const isCurrentBuilding =
          currentBuilding.name === updatedRoom.gedung ||
          currentBuilding.name.includes(updatedRoom.gedung) ||
          updatedRoom.gedung.includes(
            currentBuilding.name.replace(/^GEDUNG\s+/i, ""),
          );

        if (!isCurrentBuilding) {
          return currentBuilding;
        }

        // Hapus ruangan dari posisi sebelumnya
        const cleanFloors = currentBuilding.floors.map((floor) => ({
          ...floor,
          rooms: floor.rooms.filter((room) => room.id !== updatedRoom.id),
        }));

        // Tentukan lantai tujuan
        const targetFloorId = String(updatedRoom.lantai)
          .toLowerCase()
          .includes("basement")
          ? "basement"
          : String(updatedRoom.lantai);

        const targetFloorLabel =
          targetFloorId === "basement"
            ? "Basement"
            : `Lantai ${updatedRoom.lantai}`;

        const targetFloorExists = cleanFloors.some(
          (floor) => floor.id === targetFloorId,
        );

        let updatedFloors = cleanFloors;

        if (targetFloorExists) {
          updatedFloors = cleanFloors.map((floor) =>
            floor.id === targetFloorId
              ? {
                  ...floor,
                  rooms: [...floor.rooms, updatedRoom],
                }
              : floor,
          );
        } else {
          const newFloor: Floor = {
            id: targetFloorId,
            label: targetFloorLabel,
            rooms: [updatedRoom],
          };

          updatedFloors = [...cleanFloors, newFloor].sort(
            (floorA, floorB) => {
              if (floorA.id === "basement") return -1;
              if (floorB.id === "basement") return 1;

              return Number(floorA.id) - Number(floorB.id);
            },
          );
        }

        return {
          ...currentBuilding,
          floors: updatedFloors,
        };
      });
    });

    // Setelah save kembali ke modal detail
    setModalState({
      type: "detail",
      room: updatedRoom,
    });
  };

  // Hapus ruangan
  const handleDeleteRoom = (room: Ruangan) => {
    setBuildingList((prevBuildings) =>
      prevBuildings.map((currentBuilding) => ({
        ...currentBuilding,
        floors: currentBuilding.floors.map((floor) => ({
          ...floor,
          rooms: floor.rooms.filter(
            (currentRoom) => currentRoom.id !== room.id,
          ),
        })),
      })),
    );

    setModalState(null);
  };

  return (
    <div className="relative min-h-screen bg-white pb-24">
      {/* =====================================================
          HEADER GEDUNG
      ===================================================== */}
      <header className="flex h-[84px] w-full items-center justify-between bg-[#213F6B] px-10">
        {/* Tabs Gedung */}
        <div className="flex h-full items-end gap-1">
          {buildingList.map((item) => {
            const isActive = building === item.name;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleBuildingChange(item.name)}
                className={`
                  relative
                  flex
                  h-full
                  items-center
                  px-7
                  text-[18px]
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-white/5
                  ${
                    isActive
                      ? "after:absolute after:bottom-0 after:left-0 after:h-[8px] after:w-full after:bg-[#AAB0BA]"
                      : ""
                  }
                `}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Admin */}
        <div className="flex items-center gap-4">
          <span className="text-base text-white">
            Hello, <strong>Admin</strong>
          </span>

          <div className="flex size-[52px] items-center justify-center rounded-full border-[3px] border-white bg-white text-[#213F6B]">
            <FaUserCircle className="size-[46px]" aria-hidden="true" />
          </div>
        </div>
      </header>

      {/* =====================================================
          FILTER LANTAI
      ===================================================== */}
      <div className="flex justify-end px-[24px] py-[35px]">
        <select
          value={selectedFloor}
          onChange={(event) => setSelectedFloor(event.target.value)}
          aria-label="Pilih lantai"
          className="
            h-[38px]
            w-[237px]
            rounded-md
            border
            border-gray-300
            bg-white
            px-4
            text-sm
            text-gray-800
            shadow-sm
            outline-none
            transition
            focus:border-[#213F6B]
          "
        >
          <option value="">Pilih lantai</option>

          {activeBuilding.floors.map((floor) => (
            <option key={floor.id} value={floor.id}>
              {floor.label}
            </option>
          ))}
        </select>
      </div>

      {/* =====================================================
          LIST LANTAI
      ===================================================== */}
      <div
        key={`${building}-${selectedFloor}`}
        className="flex flex-col animate-fadeIn"
      >
        {visibleFloors.map((floorData) => (
          <section key={floorData.id} className="w-full">
            {/* Banner lantai */}
            <div
              className="
                flex
                h-[30px]
                w-full
                items-center
                justify-center
                bg-[#FFC400]
                text-base
                font-bold
                text-black
              "
            >
              {floorData.label}
            </div>

            {/* Grid kartu ruangan */}
            <div
              className="
                grid
                grid-cols-2
                gap-8
                px-8
                py-[34px]
                md:grid-cols-3
                xl:grid-cols-5
                xl:px-[56px]
              "
            >
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

      {/* =====================================================
          TOMBOL TAMBAH
      ===================================================== */}
      <button
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        aria-label="Tambah ruangan"
        className="
          fixed
          bottom-8
          right-8
          z-30
          flex
          size-[56px]
          cursor-pointer
          items-center
          justify-center
          rounded-2xl
          bg-[#0672A6]
          text-white
          shadow-lg
          transition
          hover:scale-105
          hover:brightness-110
          active:scale-95
          focus:outline-none
        "
      >
        <div className="flex size-[32px] items-center justify-center rounded-full border-[4px] border-white">
          <FaPlus className="size-4" aria-hidden="true" />
        </div>
      </button>

      {/* =====================================================
          MODAL DETAIL
      ===================================================== */}
      <RoomDetailModal
        room={modalState?.type === "detail" ? modalState.room : null}
        open={modalState?.type === "detail"}
        onClose={handleCloseDetail}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteRoom}
      />

      {/* =====================================================
          MODAL EDIT
      ===================================================== */}
      <RoomEditModal
        room={modalState?.type === "edit" ? modalState.room : null}
        open={modalState?.type === "edit"}
        onClose={handleCloseEdit}
        onSave={handleSaveRoom}
      />

      {/* =====================================================
          MODAL TAMBAH
      ===================================================== */}
      <RoomAddModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddRoom}
        defaultGedung={building}
      />
    </div>
  );
}