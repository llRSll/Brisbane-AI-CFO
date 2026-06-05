import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Live Event",
  description: "Sign up, vote in live polls, and ask questions.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
};

export default RootLayout;
