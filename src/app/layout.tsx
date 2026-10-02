import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Roomiez — Verified student rooms near campus",
  description:
    "Verified student rooms near campus — search, chat, visit. No brokers. Currently live in Adityapur–Jamshedpur.",
  icons: { icon: "/logo.png" },
  openGraph: {
    title: "Roomiez — Verified student rooms near campus",
    description:
      "Browse verified student rooms near your college. Real photos, honest rent, no brokers.",
    images: ["/og-cover.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-cream text-navy antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
