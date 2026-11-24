"use client";

import { useState, useCallback } from "react";

/**
 * Hook umum untuk mengontrol state buka/tutup modal secara terpusat,
 * sekaligus menampung data item yang sedang aktif/diedit di dalam modal.
 */
export function useModal<T = unknown>() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const openModal = useCallback((item?: T) => {
    if (item !== undefined) {
      setData(item);
    }
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    data,
    openModal,
    closeModal,
    toggleModal,
    setData,
  };
}

export default useModal;
