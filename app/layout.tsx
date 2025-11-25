import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar } from "@/components/layout/conditional-navbar";
import { I18nProvider } from "@/lib/i18n/i18n-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WebTools - Essential Web Utilities",
  description: "A collection of simple, powerful tools for developers and everyone else.",
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
        <I18nProvider>
          <div className="flex min-h-screen flex-col">
            <ConditionalNavbar />
            <main className="flex-1">{children}</main>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
