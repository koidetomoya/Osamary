import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full py-4 text-center text-sm text-slate-500">
            <div className="flex justify-center gap-6 mb-2 flex-wrap px-4">
                <Link href="/terms" className="hover:text-slate-900 transition-colors">
                    利用規約
                </Link>
                <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                    プライバシーポリシー
                </Link>
                <Link href="/about" className="hover:text-slate-900 transition-colors">
                    運営者情報 / 問い合わせ
                </Link>
            </div>
            <p className="text-xs text-slate-400">
                &copy; {new Date().getFullYear()} Osamari. All rights reserved.
            </p>
        </footer>
    );
}
