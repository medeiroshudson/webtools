import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { StructuredData, generateBreadcrumbSchema } from "./structured-data"

export interface BreadcrumbItem {
    name: string
    href: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
    className?: string
}

/**
 * Breadcrumbs component with structured data for SEO
 * Displays navigation path and includes BreadcrumbList schema markup
 */
export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
    // Add home as the first item if not present
    const allItems = items[0]?.href === "/"
        ? items
        : [{ name: "Início", href: "/" }, ...items]

    return (
        <>
            <StructuredData
                data={generateBreadcrumbSchema(
                    allItems.map((item) => ({ name: item.name, url: item.href }))
                )}
            />
            <nav aria-label="Breadcrumb" className={`w-full ${className}`}>
                <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                    {allItems.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                            {index === 0 ? (
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                                >
                                    <Home className="h-4 w-4" />
                                </Link>
                            ) : (
                                <>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                                    {index === allItems.length - 1 ? (
                                        <span className="text-foreground font-medium">
                                            {item.name}
                                        </span>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className="hover:text-foreground transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    )
}

/**
 * Predefined breadcrumb configurations for different pages
 */
export const breadcrumbConfigs = {
    jsonFormatter: [
        { name: "JSON Formatter", href: "/json-formatter" },
    ],
    xmlFormatter: [
        { name: "XML Formatter", href: "/xml-formatter" },
    ],
    notes: [
        { name: "Notas Compartilhadas", href: "/notes" },
    ],
    pdfMerge: [
        { name: "Ferramentas PDF", href: "/pdf-tools" },
        { name: "Juntar PDF", href: "/pdf-tools/merge" },
    ],
    pdfSplit: [
        { name: "Ferramentas PDF", href: "/pdf-tools" },
        { name: "Dividir PDF", href: "/pdf-tools/split" },
    ],
    pdfCompress: [
        { name: "Ferramentas PDF", href: "/pdf-tools" },
        { name: "Comprimir PDF", href: "/pdf-tools/compress" },
    ],
    base64Text: [
        { name: "Ferramentas Base64", href: "/base64-tools" },
        { name: "Texto", href: "/base64-tools/text" },
    ],
    base64Image: [
        { name: "Ferramentas Base64", href: "/base64-tools" },
        { name: "Imagem", href: "/base64-tools/image" },
    ],
    base64Pdf: [
        { name: "Ferramentas Base64", href: "/base64-tools" },
        { name: "PDF", href: "/base64-tools/pdf" },
    ],
    base64File: [
        { name: "Ferramentas Base64", href: "/base64-tools" },
        { name: "Arquivo", href: "/base64-tools/file" },
    ],
} as const
