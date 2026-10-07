import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
	return (
		<section className="relative flex min-h-screen flex-col overflow-hidden text-white">

			<Image
				src="/images/vokasi.jpg"
				alt="Gedung Vokasi"
				fill
				priority
				sizes="100vw"
				className="object-cover"
			/>
			<div className="absolute inset-0 bg-[#000000]/55" />

			<header className="relative z-10 flex items-center justify-end gap-3 px-10 py-8">
				<p className="text-sm">
					Hello, <span className="font-semibold">Admin</span>
				</p>
				<Image
	            src="/images/deddydieng.png"
	            alt="Foto profil Admin"
	            width={56}
	            height={56}
	            className="size-14 rounded-full border-2 border-white object-cover"
                />
			</header>

			<div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
				<h1 className="text-4xl font-bold tracking-tight md:text-7xl">
					Selamat Datang
				</h1>
				<p className="mt-2 text-3xl font-semibold md:text-4xl">Admin!</p>

				<h2 className="mt-14 text-2xl font-medium md:text-4xl">
					Sistem Kelola Inventaris Vokasi (INVOKS)
				</h2>
				<p className="mt-2 max-w-xl text-base md:text-xl">
					Kelola data ruangan, barang, dan peminjaman dengan mudah
				</p>

				<Link
					href="/kelola"
					className="mt-10 inline-flex h-[45px] w-[200px] items-center justify-center rounded-xl bg-[#00629F] text-lg font-medium shadow-lg transition-colors hover:bg-[#0A74BA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
				>
					Mulai Kelola
				</Link>
			</div>
		</section>
	);
}