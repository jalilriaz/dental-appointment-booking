import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elite Dental Centre",
  description: "Premium dental care management system",
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
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            richColors
            toastOptions={{
              className:
                "!bg-slate-900/90 !backdrop-blur-xl !border !border-slate-700 !text-slate-100 !shadow-2xl !rounded-xl",
              style: {
                background: "rgba(15, 23, 42, 0.92)",
                border: "1px solid rgba(100, 116, 139, 0.3)",
                color: "#f1f5f9",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
