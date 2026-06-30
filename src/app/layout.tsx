import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { LenisProvider } from "@/components/ui/LenisProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import StructuredData from "@/components/ui/StructuredData";
import Analytics from "@/components/ui/Analytics";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const displayFont = localFont({
  src: [
    { path: "../../public/fonts/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Agilize Soluciones | Tecnología que impulsa tu negocio",
    template: "%s | Agilize Soluciones",
  },
  description:
    "Desarrollamos soluciones de E-commerce Inteligente y Sistemas ERP a medida. Automatización, APIs e infraestructura cloud para empresas que buscan escalar.",
  keywords: [
    "desarrollo web",
    "e-commerce",
    "ERP",
    "automatización",
    "software a medida",
    "consultoría tecnológica",
  ],
  metadataBase: new URL("https://agilizesoluciones.uk"),
  openGraph: {
    title: "Agilize Soluciones | Tecnología que impulsa tu negocio",
    description:
      "E-commerce Inteligente y Sistemas ERP. Soluciones tecnológicas premium para empresas que buscan escalar.",
    type: "website",
    locale: "es_AR",
    url: "https://agilizesoluciones.uk",
    siteName: "Agilize Soluciones",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Agilize Soluciones - Tecnología Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agilize Soluciones | Tecnología que impulsa tu negocio",
    description:
      "E-commerce Inteligente y Sistemas ERP a medida para empresas.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${displayFont.variable}`}
    >
      <body className="noise">
        <StructuredData />
        <Analytics />
        <LenisProvider>
          <CustomCursor />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
