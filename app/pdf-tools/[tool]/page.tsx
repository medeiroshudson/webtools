import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PdfToolsClient } from "./pdf-tools-client"

const VALID_TOOLS = ["merge", "split", "compress"] as const
type ToolTab = (typeof VALID_TOOLS)[number]

function isValidTool(tool: string): tool is ToolTab {
    return VALID_TOOLS.includes(tool as ToolTab)
}

interface ToolMetadata {
    title: string
    description: string
    keywords: string[]
    ogTitle: string
}

const TOOL_METADATA: Record<ToolTab, ToolMetadata> = {
    merge: {
        title: "Juntar PDF - Merge Multiple PDFs | WebTools",
        description: "Combine múltiplos arquivos PDF em um único documento. Junte PDFs instantaneamente com processamento local gratuito. Reorganize páginas e baixe o resultado.",
        keywords: [
            "merge pdf",
            "juntar pdf",
            "combine pdf",
            "combinar pdf",
            "join pdf",
            "unir pdf",
            "pdf merger",
            "juntador de pdf",
            "concatenate pdf",
            "concatenar pdf",
        ],
        ogTitle: "Juntar PDF - Combine Multiple PDFs into One",
    },
    split: {
        title: "Dividir PDF - Split PDF by Pages | WebTools",
        description: "Divida um PDF em múltiplos arquivos por intervalos de páginas. Extraia páginas específicas ou separe por intervalos. Processamento local gratuito.",
        keywords: [
            "split pdf",
            "dividir pdf",
            "extract pdf pages",
            "extrair páginas pdf",
            "pdf splitter",
            "divisor de pdf",
            "separate pdf",
            "separar pdf",
            "pdf page extractor",
            "extrator de páginas pdf",
        ],
        ogTitle: "Dividir PDF - Split PDF into Multiple Files",
    },
    compress: {
        title: "Comprimir PDF - Reduce PDF File Size | WebTools",
        description: "Reduza o tamanho do arquivo PDF mantendo a qualidade. Comprima PDFs com níveis baixo, médio ou alto. Processamento local gratuito.",
        keywords: [
            "compress pdf",
            "comprimir pdf",
            "reduce pdf size",
            "reduzir tamanho pdf",
            "pdf compressor",
            "compressor de pdf",
            "optimize pdf",
            "otimizar pdf",
            "shrink pdf",
            "encolher pdf",
        ],
        ogTitle: "Comprimir PDF - Reduce PDF File Size",
    },
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ tool: string }>
}): Promise<Metadata> {
    const { tool } = await params
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webtools.example.com"

    if (!isValidTool(tool)) {
        return {
            title: "PDF Tools | WebTools",
        }
    }

    const metadata = TOOL_METADATA[tool]

    return {
        title: metadata.title,
        description: metadata.description,
        keywords: metadata.keywords,
        openGraph: {
            title: metadata.ogTitle,
            description: metadata.description,
            url: `${baseUrl}/pdf-tools/${tool}`,
            siteName: "WebTools",
            locale: "pt_BR",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: metadata.ogTitle,
            description: metadata.description,
        },
        alternates: {
            canonical: `${baseUrl}/pdf-tools/${tool}`,
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
}

export default async function PdfToolPage({
    params,
}: {
    params: Promise<{ tool: string }>
}) {
    const { tool } = await params

    if (!isValidTool(tool)) {
        notFound()
    }

    return <PdfToolsClient tool={tool} />
}
