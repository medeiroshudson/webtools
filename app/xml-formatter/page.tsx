import type { Metadata } from "next"
import { XmlFormatterClient } from "./xml-formatter-client"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webtools.example.com"

export const metadata: Metadata = {
  title: "XML Formatter - Format, Validate & Convert to JSON | WebTools",
  description: "Formate, valide, minifique e converta dados XML instantaneamente. Formatação com 2 espaços, 4 espaços ou tabs. Conversão XML para JSON. Processamento local gratuito.",
  keywords: [
    "xml formatter",
    "formatador xml",
    "xml validator",
    "validador xml",
    "xml to json",
    "xml converter",
    "xml minify",
    "minificar xml",
    "xml tools",
    "ferramentas xml",
    "xml parser",
    "xml editor",
  ],
  openGraph: {
    title: "XML Formatter - Format, Validate & Convert to JSON",
    description: "Formate, valide, minifique e converta dados XML instantaneamente. Conversão XML para JSON disponível.",
    url: `${baseUrl}/xml-formatter`,
    siteName: "WebTools",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "XML Formatter - Format, Validate & Convert to JSON",
    description: "Formate, valide, minifique e converta dados XML instantaneamente.",
  },
  alternates: {
    canonical: `${baseUrl}/xml-formatter`,
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
}

export default function XmlFormatterPage() {
  return <XmlFormatterClient />
}
