import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-roboto-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SANAM OFFICIAL - Qarshi Tikuvchilik Fabrikasi | Garment Factory",
  description:
    "Qarshi shahridagi ishonchli va zamonaviy tikuvchilik fabrikasi - SANAM OFFICIAL. Textile mill, kiyim ishlab chiqarish, ulgurji va chakana savdo. Sifatli mahsulot, In-store shopping, Curbside pickup va yetkazib berish xizmati. Manzil: ул. И.Каримова 221, Qarshi.",
  keywords: [
    "SANAM OFFICIAL",
    "Garment Factory",
    "Textile mill",
    "Qarshi tikuvchilik fabrikasi",
    "Kiyim ishlab chiqarish Qarshi",
    "Qashqadaryo garment factory",
    "Ulgurji kiyim tikish",
    "Korporativ uniforma tikish",
    "ooosanam.uz",
  ],
  authors: [{ name: "SANAM OFFICIAL Garment Factory" }],
  openGraph: {
    title: "SANAM OFFICIAL - Qarshi Tikuvchilik Fabrikasi",
    description: "Qarshidagi Ishonchli Tikuvchilik Fabrikasi - Sifatli mahsulot, zamonaviy tikuv, ulgurji va chakana savdo.",
    url: "https://ooosanam.uz",
    siteName: "SANAM OFFICIAL",
    locale: "uz_UZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${inter.variable} ${robotoMono.variable} scroll-smooth antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
