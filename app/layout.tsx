import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BubbleCanvas from "@/components/BubbleCanvas";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://thebubbleheros.com"),
  title: {
    default: "TheBubbleHeros | Bubble & Foam Parties in Dallas Fort Worth",
    template: "%s | TheBubbleHeros",
  },
  description:
    "DFW's top-rated bubble and foam party service. We bring bubble machines, foam cannons, and the fun to your backyard, school, or event across Dallas-Fort Worth.",
  keywords: [
    "bubble party Dallas",
    "foam party DFW",
    "bubble truck Fort Worth",
    "foam cannon rental Dallas",
    "kids birthday party DFW",
    "bubble party near me",
    "foam party near me",
    "bubble bus Dallas Fort Worth",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TheBubbleHeros",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "TheBubbleHeros Bubble & Foam Parties in DFW" }],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <BubbleCanvas />
        <Navbar />
        <main className="relative z-10 flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
