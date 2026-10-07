"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBuilding, FaHome, FaInbox, FaShoppingBag, FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const navigationItems = [
	{ label: "Dashboard", href: "/dashboard", icon: FaHome },
	{ label: "Profil", href: "/profil", icon: FaUserCircle },
	{ label: "Ruangan", href: "/ruangan", icon: FaBuilding },
	{ label: "Barang", href: "/barang", icon: FaInbox },
	{ label: "Kelola Peminjaman", href: "/peminjaman", icon: FaShoppingBag },
];

export function Sidebar() {
	const pathname = usePathname();

	const handleLogout = () => {
		// TODO: clear session/token, then redirect to /login
		console.log("logout");
	};

	return (
		<aside className="fixed inset-y-0 left-0 z-40 flex w-[274px] flex-col bg-[#00629F] text-white">
			<Link href="/dashboard" className="flex items-center gap-3 px-6 pb-6 pt-5">
				<Image
					src="/images/logoinvoks.png"
					alt="Logo INVOKS"
					width={42}
					height={42}
					priority
				/>
				<span className="text-xl font-bold tracking-wide">INVOKS</span>
			</Link>

			<nav aria-label="Navigasi utama" className="flex-1 px-3">
				<ul className="space-y-2">
					{navigationItems.map(({ label, href, icon: Icon }) => {
						const isActive = pathname === href || pathname.startsWith(`${href}/`);

						return (
							<li key={href}>
								<Link
									href={href}
									aria-current={isActive ? "page" : undefined}
									className={`flex items-center gap-3 rounded-lg border px-5 py-2.5 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
										isActive
											? "border-white/30 bg-white/15"
											: "border-transparent hover:bg-white/10"
									}`}
								>
									<Icon aria-hidden="true" className="size-[18px] shrink-0" />
									<span>{label}</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			<div className="flex justify-center pb-16">
				<button
					type="button"
					onClick={handleLogout}
					className="flex items-center gap-2 rounded-lg px-4 py-2 text-base font-medium transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
				>
					<FiLogOut aria-hidden="true" className="size-5" />
					<span>Logout</span>
				</button>
			</div>
		</aside>
	);
}