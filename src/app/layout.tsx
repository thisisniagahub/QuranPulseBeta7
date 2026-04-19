import type { Metadata } from "next";
import { Geist, Geist_Mono, Amiri } from "next/font/google";
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

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#1a1a4a",
}

export const metadata: Metadata = {
  title: "QuranPulse - App Mengaji AI Pertama Malaysia",
  description: "Belajar baca Al-Quran dengan AI Ustaz. Iqra 1-6 lengkap, waktu solat JAKIM, dan 15+ tool ibadah. Percuma untuk mula.",
  keywords: ["app mengaji", "belajar quran", "iqra online", "waktu solat JAKIM", "AI ustaz", "quran malaysia", "quran pulse"],
  authors: [{ name: "QuranPulse" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/icons/icon-192x192.png",
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
        className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
