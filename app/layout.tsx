import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ReactScan } from "@/components/react-scan";

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Metadata Generator - YouTube Music Metadata Tool",
  description:
    "Generate optimized YouTube metadata, descriptions, and tags for piano covers and sheet music videos. Streamline your music content workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReactScan />
      <body className={`${googleSans.variable} antialiased`}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
