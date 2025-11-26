import type { Metadata } from "next"
import { HomeContent } from "@/components/home/home-content"

export const metadata: Metadata = {
    title: "WebTools - Ferramentas Web Gratuitas | JSON, PDF, Notas",
    description:
        "Coleção de ferramentas web gratuitas: formatador JSON, mesclador e compressor de PDF, notas compartilhadas em tempo real. Tudo no navegador, sem upload de arquivos.",
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
        title: "WebTools - Ferramentas Web Gratuitas",
        description:
            "Formatador JSON, ferramentas PDF e notas compartilhadas. Gratuito e direto no navegador.",
        type: "website",
        locale: "pt_BR",
    },
    twitter: {
        card: "summary_large_image",
        title: "WebTools - Ferramentas Web Gratuitas",
        description:
            "Formatador JSON, ferramentas PDF e notas compartilhadas. Gratuito e direto no navegador.",
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function HomePage() {
    return <HomeContent />
}
