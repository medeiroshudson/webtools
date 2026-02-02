import type { Metadata } from "next"
import { NotesClient } from "./notes-client"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webtools.example.com"

export const metadata: Metadata = {
  title: "Notas Compartilhadas - Real-time Collaborative Notes | WebTools",
  description: "Crie notas temporárias e compartilháveis com colaboração em tempo real. Edição colaborativa, temporizadores de expiração (1h, 24h, 7d) e modo somente leitura.",
  keywords: [
    "shared notes",
    "notas compartilhadas",
    "collaborative notes",
    "notas colaborativas",
    "real-time notes",
    "notas em tempo real",
    "temporary notes",
    "notas temporárias",
    "online notes",
    "notas online",
    "share notes",
    "compartilhar notas",
  ],
  openGraph: {
    title: "Notas Compartilhadas - Real-time Collaborative Notes",
    description: "Crie notas temporárias e compartilháveis com colaboração em tempo real.",
    url: `${baseUrl}/notes`,
    siteName: "WebTools",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notas Compartilhadas - Real-time Collaborative Notes",
    description: "Crie notas temporárias e compartilháveis com colaboração em tempo real.",
  },
  alternates: {
    canonical: `${baseUrl}/notes`,
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

export default function NotesPage() {
  return <NotesClient />
}
