import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingActions from "@/components/FloatAction";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Prodigies | Class of 2026 Archive",
  description: "The official digital registry and event portal for the Class of 2026. Celebrating excellence, legacy, and divine transition.",
  openGraph: {
    title: "The Prodigies '26",
    description: "Official Event & Archive Portal",
    images: ["/og-image.jpg"], // Create a gold/brown themed image later
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <FloatingActions />
      </body>
    </html>
  );
}
