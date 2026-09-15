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
  metadataBase: new URL("https://www.sanamfactory.uz"),
  title: {
    default: "SANAM - Qarshi Tikuvchilik Fabrikasi | Sanam Factory & Tikuvchilik Sexi",
    template: "%s | SANAM Tikuvchilik Fabrikasi",
  },
  description:
    "SANAM — Qarshi shahridagi zamonaviy tikuvchilik fabrikasi va tikuvchilik sexi (Sanam Factory). Sifatli kiyim ishlab chiqarish, korporativ formalar, maxsus ish kiyimlari va ulgurji tikuv xizmatlari. Manzil: ul. I.Karimova 221, Qarshi.",
  keywords: [
    "sanam",
    "sanam fabrika",
    "sanam factory",
    "tikuvchilik sexi",
    "qarshi tikuvchilik sexi",
    "sanam tikuvchilik sexi",
    "sanam tikuvchilik fabrikasi",
    "tikuvchilik fabrikasi",
    "SANAM OFFICIAL",
    "sanamfabrikasi",
    "sanamfactory.uz",
    "ooosanam.uz",
    "kiyim ishlab chiqarish",
    "kiyim ishlab chiqarish qarshi",
    "ulgurji kiyim tikish",
    "korporativ uniforma tikish",
    "maxsus ish kiyimlari",
    "forma tikish qarshi",
    "qashqadaryo tikuvchilik sexi",
    "tikuv sexi",
    "tikuvchilik",
    "garment factory qarshi",
    "textile mill qarshi",
    "швейная фабрика санам",
    "швейный цех",
    "швейный цех карши",
    "санам фабрика",
    "санам фабрика карши",
  ],
  authors: [{ name: "SANAM OFFICIAL Garment Factory", url: "https://www.sanamfactory.uz" }],
  creator: "SANAM",
  publisher: "SANAM OFFICIAL",
  alternates: {
    canonical: "https://www.sanamfactory.uz",
  },
  openGraph: {
    title: "SANAM - Qarshi Tikuvchilik Fabrikasi | Sanam Factory & Tikuvchilik Sexi",
    description:
      "Qarshi shahridagi ishonchli tikuvchilik fabrikasi va zamonaviy tikuvchilik sexi — Sanam Factory. Sifatli mahsulot, korporativ kiyimlar va ulgurji xizmat.",
    url: "https://www.sanamfactory.uz",
    siteName: "SANAM - Qarshi Tikuvchilik Fabrikasi",
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SANAM - Qarshi Tikuvchilik Fabrikasi | Sanam Factory & Tikuvchilik Sexi",
    description:
      "Qarshidagi yetakchi tikuvchilik fabrikasi va zamonaviy tikuvchilik sexi. Kiyim ishlab chiqarish va ulgurji savdo.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "2UZijNBxI0TzwmiR9KcDdYPENA1z7ZZaXNTxthUhiGE",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "SANAM",
  alternateName: [
    "Sanam Fabrika",
    "Sanam Factory",
    "SANAM Tikuvchilik Fabrikasi",
    "Tikuvchilik Sexi Sanam",
    "SANAM OFFICIAL",
    "Qarshi Tikuvchilik Fabrikasi",
  ],
  url: "https://www.sanamfactory.uz",
  logo: "https://www.sanamfactory.uz/globe.svg",
  description:
    "SANAM — Qarshi shahridagi yetakchi tikuvchilik fabrikasi va zamonaviy tikuvchilik sexi (Sanam Factory). Sifatli kiyim ishlab chiqarish, korporativ uniforma va ulgurji tikuv xizmatlari.",
  telephone: "+998878056666",
  address: {
    "@type": "PostalAddress",
    streetAddress: "ul. I.Karimova 221",
    addressLocality: "Qarshi",
    addressRegion: "Qashqadaryo",
    postalCode: "180100",
    addressCountry: "UZ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 38.8612,
    longitude: 65.7847,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${inter.variable} ${robotoMono.variable} scroll-smooth antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
