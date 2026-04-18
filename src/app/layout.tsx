import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuranPulse - App Mengaji AI Pertama Malaysia",
  description: "Belajar baca Al-Quran dengan AI Ustaz. Iqra 1-6 lengkap, waktu solat JAKIM, dan 15+ tool ibadah. Percuma untuk mula.",
  keywords: ["app mengaji", "belajar quran", "iqra online", "waktu solat JAKIM", "AI ustaz", "quran malaysia", "quran pulse"],
  authors: [{ name: "QuranPulse" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "QuranPulse - App Mengaji AI Pertama Malaysia",
    description: "Belajar baca Al-Quran dengan AI Ustaz. Iqra 1-6 lengkap, waktu solat JAKIM.",
    siteName: "QuranPulse",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuranPulse - App Mengaji AI Pertama Malaysia",
    description: "Belajar baca Al-Quran dengan AI Ustaz. Iqra 1-6 lengkap.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
