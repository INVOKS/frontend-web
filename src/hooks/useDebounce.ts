"use client";

import { useEffect, useState } from "react";

/**
 * Hook untuk menunda pembaruan nilai (debounce).
 * Sangat berguna pada search input agar tidak memicu filter/fetch API di setiap ketikan keyboard.
 *
 * @param value Nilai yang ingin didebounce
 * @param delay Jeda waktu penundaan dalam milidetik (default: 400ms)
 * @returns Nilai yang telah didebounce
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
