import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RagChatbot from "@/components/RagChatbot";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const SITE_URL = "https://roomiez-web.onrender.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Roomiez — Verified student rooms near campus",
    template: "%s · Roomiez",
  },
  description:
    "Verified student rooms near campus — search, chat, visit. No brokers. Currently live in Adityapur–Jamshedpur.",
  icons: { icon: "/logo.png" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Roomiez",
    title: "Roomiez — Verified student rooms near campus",
    description:
      "Browse verified student rooms near your college. Real photos, honest rent, no brokers.",
    images: [{ url: "/og-cover.png", width: 1024, height: 500 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#101c34",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`h-full ${inter.variable} ${grotesk.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-full flex-col bg-cream font-sans text-navy antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <RagChatbot />
      </body>
    </html>
  );
}
