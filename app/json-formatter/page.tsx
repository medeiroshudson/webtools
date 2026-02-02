import type { Metadata } from "next"
import { JsonFormatterClient } from "./json-formatter-client"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webtools.example.com"

export const metadata: Metadata = {
  title: "JSON Formatter - Format, Validate & Minify JSON | WebTools",
  description: "Formate, valide e minifique dados JSON instantaneamente. Formatação com 2 espaços, 4 espaços ou tabs. Validação de sintaxe em tempo real. Processamento local gratuito.",
  keywords: [
    "json formatter",
    "formatador json",
    "json validator",
    "validador json",
    "json minify",
    "minificar json",
    "json pretty print",
    "json editor",
    "json tools",
    "ferramentas json",
  ],
  openGraph: {
    title: "JSON Formatter - Format, Validate & Minify JSON",
    description: "Formate, valide e minifique dados JSON instantaneamente. Processamento local gratuito.",
    url: `${baseUrl}/json-formatter`,
    siteName: "WebTools",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Formatter - Format, Validate & Minify JSON",
    description: "Formate, valide e minifique dados JSON instantaneamente. Processamento local gratuito.",
  },
  alternates: {
    canonical: `${baseUrl}/json-formatter`,
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

export default function JsonFormatterPage() {
  return <JsonFormatterClient />
}
