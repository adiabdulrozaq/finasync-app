import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  title: "FinaSync - Sistem Manajemen Keuangan Pribadi",
  description:
    "Kelola keuangan Anda dengan aman dan mudah. Pantau pemasukan, pengeluaran, anggaran, tabungan, dan transaksi berulang dalam satu dashboard yang modern.",
  keywords: ["keuangan", "manajemen uang", "budget", "tabungan", "finance app"],
  openGraph: {
    title: "FinaSync - Sistem Manajemen Keuangan Pribadi",
    description: "Kelola keuangan Anda dengan aman dan mudah.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
