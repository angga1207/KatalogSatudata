import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AOSProvider } from "@/components/AOSProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Katalog Satu Data - Kabupaten Ogan Ilir",
  description:
    "Portal Satu Data Kabupaten Ogan Ilir. Temukan dan unduh dataset terbuka dari Pemerintah Kabupaten Ogan Ilir.",
  icons: {
    icon: [
      { url: "/logo-satudata.webp", type: "image/webp", sizes: "any" },
    ],
    apple: [
      { url: "/logo-satudata.webp", sizes: "180x180" },
    ],
    shortcut: "/logo-satudata.webp",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Katalog Satu Data - Kabupaten Ogan Ilir",
    title: "Katalog Satu Data - Kabupaten Ogan Ilir",
    description: "Portal Satu Data Kabupaten Ogan Ilir. Temukan dan unduh dataset terbuka dari Pemerintah Kabupaten Ogan Ilir.",
    images: [
      {
        url: "/logo-satudata.webp",
        width: 512,
        height: 512,
        alt: "Katalog Satu Data - Kabupaten Ogan Ilir",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-gray-900" suppressHydrationWarning>
        <AOSProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AOSProvider>
      </body>
    </html>
  );
}
