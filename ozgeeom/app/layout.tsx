import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { branding } from "@/lib/branding";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${branding.name} — ${branding.eventTitle}`,
  description: branding.description,
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
};

export default RootLayout;
