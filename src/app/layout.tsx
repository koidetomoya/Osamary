import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { LiffProvider } from "@/lib/liff-provider";
import { Footer } from "@/components/footer";


const mplus = M_PLUS_Rounded_1c({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
  variable: "--font-mplus",
});

export const metadata: Metadata = {
  title: "Osamary - 最小回数で割り勘精算",
  description: "面倒な割り勘計算を一瞬で解決。旅行やイベントの精算アプリ。",
};

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevent zooming to feel more like an app
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${mplus.variable} font-sans antialiased`}
      >
        <LiffProvider>
          <div id="app-root" className="h-full w-full overflow-y-auto overflow-x-hidden flex flex-col bg-background text-foreground transition-colors duration-300">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
            <Toaster />
          </div>
        </LiffProvider>
      </body>
    </html>
  );
}
