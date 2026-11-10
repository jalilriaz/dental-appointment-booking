import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Elite Dental Centre | Premier Dental Care",
  description: "Advanced dental implants, laser whitening, and painless treatments in Islamabad.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        suppressHydrationWarning
        className="font-sans antialiased bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white"
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
