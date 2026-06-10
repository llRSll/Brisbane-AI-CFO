import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ChunkErrorRecovery from "@/components/ChunkErrorRecovery";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Brisbane AI CFO — Live",
  description: "Sign up, vote in live polls, and ask questions.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">
        <ChunkErrorRecovery />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
