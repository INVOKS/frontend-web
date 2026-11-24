import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-6xl font-extrabold tracking-tight text-gray-900">
          404
        </h1>
        <p className="text-base text-gray-600">
          Halaman yang kamu cari tidak ditemukan.
        </p>
        <Link
          href="/"
          className="mt-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}