import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import "./globals.css";

import { CartProvider } from "@/context/CartContext";
import { PostcodeProvider } from '@/context/PostcodeContext'; // ✅ your new context
import Layout from '@/components/Layout'; // ✅ layout with sidebar, cart, etc.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "GuardLAN Store",
  description: "Network security hardware and support.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <PostcodeProvider>
            <Layout>{children}</Layout>
          </PostcodeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
