import type { Metadata } from "next"
import { HomeContent } from "@/components/home/home-content"

export const metadata: Metadata = {
    title: "WebTools",
    description: "Ferramentas essenciais. Processamento local. Sem cadastro.",
    keywords: [
        "ferramentas web",
        "formatador json",
        "validador json",
        "juntar pdf",
        "dividir pdf",
        "comprimir pdf",
        "notas compartilhadas",
        "ferramentas online grátis",
        "web tools",
        "json formatter",
        "pdf merge",
        "pdf split",
        "pdf compress",
    ],
    openGraph: {
        title: "WebTools",
        description: "Ferramentas essenciais. Processamento local. Sem cadastro.",
        type: "website",
        locale: "pt_BR",
    },
    twitter: {
        card: "summary_large_image",
        title: "WebTools",
        description: "Ferramentas essenciais. Processamento local. Sem cadastro.",
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function HomePage() {
    return <HomeContent />
}
