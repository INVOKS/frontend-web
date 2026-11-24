"use client";

import { useState, useMemo, useCallback } from "react";
import { Building, Ruangan } from "@/types/ruangan";
import { buildings as defaultBuildings } from "@/lib/ruangan-data";

export function useRuangan(initialBuildings: Building[] = defaultBuildings) {
  const [buildingList, setBuildingList] = useState<Building[]>(initialBuildings);
  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState<number>(0);
  const [selectedFloorId, setSelectedFloorId] = useState<string>("basement");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Gedung yang sedang aktif
  const currentBuilding = useMemo(() => {
    return buildingList[selectedBuildingIndex] || buildingList[0];
  }, [buildingList, selectedBuildingIndex]);

  // Lantai yang sedang aktif di gedung terpilih
  const currentFloor = useMemo(() => {
    if (!currentBuilding) return null;
    return (
      currentBuilding.floors.find((f) => f.id === selectedFloorId) ||
      currentBuilding.floors[0]
    );
  }, [currentBuilding, selectedFloorId]);

  // Daftar ruangan di lantai aktif, diurutkan secara natural (B01, B02, 101, dst)
  const sortedRooms = useMemo(() => {
    if (!currentFloor?.rooms) return [];

    let list = [...currentFloor.rooms];

    // Filter pencarian jika ada
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (room) =>
          room.nama.toLowerCase().includes(q) ||
          room.gedung.toLowerCase().includes(q) ||
          room.deskripsi.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => {
      const nameA = (a.nama || a.name || "").toLowerCase();
      const nameB = (b.nama || b.name || "").toLowerCase();
      return nameA.localeCompare(nameB, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
  }, [currentFloor, searchQuery]);

  // Tambah ruangan baru
  const addRoom = useCallback(
    (newRoom: Ruangan) => {
      setBuildingList((prevBuildings) =>
        prevBuildings.map((building, bIdx) => {
          if (bIdx !== selectedBuildingIndex) return building;
          return {
            ...building,
            floors: building.floors.map((floor) => {
              if (floor.id !== selectedFloorId) return floor;
              return {
                ...floor,
                rooms: [...floor.rooms, newRoom],
              };
            }),
          };
        })
      );
    },
    [selectedBuildingIndex, selectedFloorId]
  );

  // Update ruangan
  const updateRoom = useCallback(
    (roomId: string | number, updatedData: Partial<Ruangan>) => {
      setBuildingList((prevBuildings) =>
        prevBuildings.map((building) => ({
          ...building,
          floors: building.floors.map((floor) => ({
            ...floor,
            rooms: floor.rooms.map((room) =>
              String(room.id) === String(roomId)
                ? { ...room, ...updatedData }
                : room
            ),
          })),
        }))
      );
    },
    []
  );

  // Hapus ruangan
  const deleteRoom = useCallback((roomId: string | number) => {
    setBuildingList((prevBuildings) =>
      prevBuildings.map((building) => ({
        ...building,
        floors: building.floors.map((floor) => ({
          ...floor,
          rooms: floor.rooms.filter(
            (room) => String(room.id) !== String(roomId)
          ),
        })),
      }))
    );
  }, []);

  return {
    buildingList,
    currentBuilding,
    currentFloor,
    sortedRooms,
    selectedBuildingIndex,
    selectedFloorId,
    searchQuery,
    isLoading,
    setSelectedBuildingIndex,
    setSelectedFloorId,
    setSearchQuery,
    setIsLoading,
    setBuildingList,
    addRoom,
    updateRoom,
    deleteRoom,
  };
}

export default useRuangan;
