import Link from "next/link"
import { ArrowRight } from "lucide-react"

export interface RelatedTool {
    name: string
    description: string
    href: string
    icon: React.ReactNode
}

interface RelatedToolsProps {
    tools: RelatedTool[]
    title?: string
    className?: string
}

/**
 * RelatedTools component for internal linking
 * Helps with SEO by providing relevant internal links between tools
 */
export function RelatedTools({
    tools,
    title = "Ferramentas Relacionadas",
    className = "",
}: RelatedToolsProps) {
    if (tools.length === 0) return null

    return (
        <section className={`w-full max-w-4xl mx-auto ${className}`}>
            <h2 className="text-2xl font-bold mb-6">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map((tool) => (
                    <Link
                        key={tool.href}
                        href={tool.href}
                        className="group flex flex-col p-6 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                {tool.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                                    {tool.name}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {tool.description}
                                </p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

/**
 * Icon components for tools
 */
export const ToolIcons = {
    json: () => (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    ),
    xml: () => (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
        </svg>
    ),
    pdf: () => (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M12 18v-6" />
            <path d="M9 15l3 3 3-3" />
        </svg>
    ),
    base64: () => (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M8 13h8" />
            <path d="M8 17h8" />
            <path d="M8 9h2" />
        </svg>
    ),
}

/**
 * Predefined related tools for each page
 */
export const relatedToolsMap = {
    jsonFormatter: [
        {
            name: "XML Formatter",
            description: "Formate, valide e converta dados XML para JSON",
            href: "/xml-formatter",
            icon: <ToolIcons.xml />,
        },
        {
            name: "Base64 ↔ Texto",
            description: "Codifique ou decodifique texto de/para Base64",
            href: "/base64-tools/text",
            icon: <ToolIcons.base64 />,
        },
        {
            name: "Juntar PDF",
            description: "Combine múltiplos arquivos PDF em um único documento",
            href: "/pdf-tools/merge",
            icon: <ToolIcons.pdf />,
        },
    ],
    xmlFormatter: [
        {
            name: "JSON Formatter",
            description: "Formate, valide e minifique dados JSON instantaneamente",
            href: "/json-formatter",
            icon: <ToolIcons.json />,
        },
        {
            name: "Base64 ↔ Texto",
            description: "Codifique ou decodifique texto de/para Base64",
            href: "/base64-tools/text",
            icon: <ToolIcons.base64 />,
        },
    ],
    pdfMerge: [
        {
            name: "Dividir PDF",
            description: "Divida um PDF em múltiplos arquivos",
            href: "/pdf-tools/split",
            icon: <ToolIcons.pdf />,
        },
        {
            name: "Comprimir PDF",
            description: "Reduza o tamanho do arquivo PDF",
            href: "/pdf-tools/compress",
            icon: <ToolIcons.pdf />,
        },
    ],
    pdfSplit: [
        {
            name: "Juntar PDF",
            description: "Combine múltiplos arquivos PDF em um único documento",
            href: "/pdf-tools/merge",
            icon: <ToolIcons.pdf />,
        },
        {
            name: "Comprimir PDF",
            description: "Reduza o tamanho do arquivo PDF",
            href: "/pdf-tools/compress",
            icon: <ToolIcons.pdf />,
        },
    ],
    pdfCompress: [
        {
            name: "Juntar PDF",
            description: "Combine múltiplos arquivos PDF em um único documento",
            href: "/pdf-tools/merge",
            icon: <ToolIcons.pdf />,
        },
        {
            name: "Dividir PDF",
            description: "Divida um PDF em múltiplos arquivos",
            href: "/pdf-tools/split",
            icon: <ToolIcons.pdf />,
        },
    ],
    base64Text: [
        {
            name: "JSON Formatter",
            description: "Formate, valide e minifique dados JSON instantaneamente",
            href: "/json-formatter",
            icon: <ToolIcons.json />,
        },
        {
            name: "Base64 ↔ Imagem",
            description: "Converta imagens para Base64 ou decodifique para imagem",
            href: "/base64-tools/image",
            icon: <ToolIcons.base64 />,
        },
        {
            name: "Base64 ↔ PDF",
            description: "Converta PDFs para Base64 ou decodifique para PDF",
            href: "/base64-tools/pdf",
            icon: <ToolIcons.base64 />,
        },
    ],
    base64Image: [
        {
            name: "Base64 ↔ Texto",
            description: "Codifique ou decodifique texto de/para Base64",
            href: "/base64-tools/text",
            icon: <ToolIcons.base64 />,
        },
        {
            name: "Base64 ↔ PDF",
            description: "Converta PDFs para Base64 ou decodifique para PDF",
            href: "/base64-tools/pdf",
            icon: <ToolIcons.base64 />,
        },
    ],
    base64Pdf: [
        {
            name: "Juntar PDF",
            description: "Combine múltiplos arquivos PDF em um único documento",
            href: "/pdf-tools/merge",
            icon: <ToolIcons.pdf />,
        },
        {
            name: "Base64 ↔ Texto",
            description: "Codifique ou decodifique texto de/para Base64",
            href: "/base64-tools/text",
            icon: <ToolIcons.base64 />,
        },
    ],
    base64File: [
        {
            name: "Base64 ↔ Texto",
            description: "Codifique ou decodifique texto de/para Base64",
            href: "/base64-tools/text",
            icon: <ToolIcons.base64 />,
        },
        {
            name: "Base64 ↔ PDF",
            description: "Converta PDFs para Base64 ou decodifique para PDF",
            href: "/base64-tools/pdf",
            icon: <ToolIcons.base64 />,
        },
    ],
} as const
