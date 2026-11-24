"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Terjadi kesalahan
        </h1>
        <p className="text-sm text-gray-600">
          Maaf, ada masalah saat memuat halaman ini.
        </p>
        <button
          onClick={() => reset()}
          className="mt-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Coba lagi
        </button>
      </div>
    </main>
  );
}