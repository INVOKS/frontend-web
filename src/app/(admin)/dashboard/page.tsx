"use client";

import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
	return (
		<section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center text-white">
			{/* Background Image & Overlay */}
			<Image
				src="/images/vokasi.jpg"
				alt="Gedung Vokasi"
				fill
				priority
				sizes="100vw"
				className="object-cover"
			/>
			<div className="absolute inset-0 bg-black/60" />

			{/* Center Content sesuai Desain */}
			<div className="relative z-10 flex flex-col items-center justify-center max-w-3xl">
				{/* Judul Selamat Datang Admin! */}
				<h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
					Selamat Datang
				</h1>
				<p className="mt-2 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
					Admin!
				</p>

				{/* Subtitle & Deskripsi */}
				<h2 className="mt-8 text-xl font-bold text-white sm:text-2xl tracking-normal">
					Sistem Kelola Inventaris Vokasi (INVOKS)
				</h2>
				<p className="mt-2 text-sm text-gray-200 sm:text-base font-normal">
					Kelola data ruangan, barang, dan peminjaman dengan mudah
				</p>

				{/* Tombol Mulai Kelola */}
				<div className="mt-8">
					<Link
						href="/ruangan"
						className="inline-flex items-center justify-center rounded-lg bg-[#00629B] px-10 py-3 text-base font-semibold text-white shadow-md transition-all duration-150 hover:bg-[#005282] hover:shadow-lg active:scale-95"
					>
						Mulai Kelola
					</Link>
				</div>
			</div>
		</section>
	);
}
