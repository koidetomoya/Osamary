"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
    const pathname = usePathname();

    // Hide footer on group pages (Main App)
    if (pathname?.startsWith("/group/")) {
        return null;
    }

    return (
        <footer className="w-full py-2 text-center text-xs text-slate-400/80 bg-background/50 backdrop-blur-sm">
            <div className="flex justify-center gap-4 mb-1 flex-wrap px-4">
                <Link href="/terms" className="hover:text-slate-600 transition-colors">
                    利用規約
                </Link>
                <Link href="/privacy" className="hover:text-slate-600 transition-colors">
                    プライバシーポリシー
                </Link>
                <Link href="/about" className="hover:text-slate-600 transition-colors">
                    運営者情報 / 問い合わせ
                </Link>
            </div>
            <p className="text-[10px] text-slate-300">
                &copy; {new Date().getFullYear()} Osamary. All rights reserved.
            </p>
        </footer>
    );
}
