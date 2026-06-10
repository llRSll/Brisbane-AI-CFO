import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Live Build",
  description: "On-stage build starter — connectors only.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
};

export default RootLayout;
