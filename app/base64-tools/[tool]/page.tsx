import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Base64ToolsClient } from "./base64-tools-client"

const VALID_TOOLS = ["text", "image", "file"] as const
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
    text: {
        title: "Base64 ↔ Text - Encode & Decode Text | WebTools",
        description: "Codifique ou decodifique texto de/para Base64 instantaneamente. Conversão rápida e fácil com processamento local gratuito. Suporte a UTF-8 completo.",
        keywords: [
            "base64 encode",
            "codificar base64",
            "base64 decode",
            "decodificar base64",
            "base64 text",
            "texto base64",
            "base64 converter",
            "conversor base64",
            "base64 online",
            "base64 encoder decoder",
        ],
        ogTitle: "Base64 ↔ Text - Encode and Decode Text Instantly",
    },
    image: {
        title: "Base64 ↔ Image - Convert Images to Base64 | WebTools",
        description: "Converta imagens para Base64 ou decodifique Base64 para imagem. Suporta PNG, JPG, GIF, WebP e mais. Processamento local gratuito.",
        keywords: [
            "image to base64",
            "imagem para base64",
            "base64 image",
            "imagem base64",
            "img to base64",
            "base64 encoder image",
            "convert image base64",
            "converter imagem base64",
            "base64 img converter",
            "picture to base64",
        ],
        ogTitle: "Base64 ↔ Image - Convert Images to Base64",
    },
    file: {
        title: "Base64 ↔ File - Convert Files to Base64 | WebTools",
        description: "Converta arquivos para Base64 ou decodifique Base64 para arquivo. Suporta PDF, imagens, ZIP, documentos Office e mais. Processamento local gratuito.",
        keywords: [
            "file to base64",
            "arquivo para base64",
            "base64 file",
            "arquivo base64",
            "pdf to base64",
            "pdf para base64",
            "image to base64",
            "imagem para base64",
            "convert file base64",
            "converter arquivo base64",
            "base64 file converter",
            "file encoder decoder",
        ],
        ogTitle: "Base64 ↔ File - Convert Files to Base64",
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
            title: "Base64 Tools | WebTools",
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
            url: `${baseUrl}/base64-tools/${tool}`,
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
            canonical: `${baseUrl}/base64-tools/${tool}`,
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

export default async function Base64ToolPage({
    params,
}: {
    params: Promise<{ tool: string }>
}) {
    const { tool } = await params

    if (!isValidTool(tool)) {
        notFound()
    }

    return <Base64ToolsClient tool={tool} />
}
