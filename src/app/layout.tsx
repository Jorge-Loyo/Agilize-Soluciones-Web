import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
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

// Using Syne as display font (similar weight to Clash Display)
// Replace with local Clash Display files when available from Fontshare
const displayFont = Syne({
  subsets: ["latin"],
  variable: "--font-clash-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
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
  metadataBase: new URL("https://agilizesoluciones.com"),
  openGraph: {
    title: "Agilize Soluciones | Tecnología que impulsa tu negocio",
    description:
      "E-commerce Inteligente y Sistemas ERP. Soluciones tecnológicas premium para empresas que buscan escalar.",
    type: "website",
    locale: "es_AR",
    url: "https://agilizesoluciones.com",
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
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192.png" },
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
