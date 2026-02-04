import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar } from "@/components/layout/conditional-navbar";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { ThemeProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webtools.example.com"

export const metadata: Metadata = {
  title: {
    default: "WebTools - Ferramentas Web Essenciais",
    template: "%s | WebTools",
  },
  description: "Ferramentas essenciais. Processamento local. Sem cadastro. JSON Formatter, XML Formatter, PDF Tools, Base64 Converter e Notas Compartilhadas.",
  keywords: [
    "ferramentas web",
    "web tools",
    "formatador json",
    "json formatter",
    "validador json",
    "json validator",
    "juntar pdf",
    "merge pdf",
    "dividir pdf",
    "split pdf",
    "comprimir pdf",
    "compress pdf",
    "base64 converter",
    "ferramentas online grátis",
    "free online tools",
    "xml formatter",
    "formatador xml",
  ],
  authors: [{ name: "WebTools" }],
  creator: "WebTools",
  publisher: "WebTools",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "WebTools - Ferramentas Web Essenciais",
    description: "Ferramentas essenciais. Processamento local. Sem cadastro.",
    url: baseUrl,
    siteName: "WebTools",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebTools - Ferramentas Web Essenciais",
    description: "Ferramentas essenciais. Processamento local. Sem cadastro.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-search-console-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <I18nProvider>
            <div className="flex min-h-screen flex-col">
              <ConditionalNavbar />
              <main className="flex-1">{children}</main>
            </div>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
