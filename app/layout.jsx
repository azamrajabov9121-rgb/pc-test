import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Admin Panel",
  description: "Yon panelli admin panel — keshlanadigan ma'lumotlar bilan",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* Sidebar root layout ichida — sahifadan sahifaga o'tganda
            qayta render bo'lmaydi va holati saqlanadi. */}
        <Sidebar />
        <main className="p-6 pt-20 lg:ml-64 lg:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </body>
    </html>
  );
}
