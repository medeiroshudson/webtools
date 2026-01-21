"use client"

import { useI18n } from "@/lib/i18n/i18n-context"
import { FileType } from "lucide-react"

export default function PdfToolsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { t } = useI18n()

    return (
        <div className="container mx-auto py-6 md:py-8 px-4 md:px-6">
            <div className="mb-6 md:mb-8 space-y-2 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="p-2 rounded-lg bg-rose-500/10">
                        <FileType className="h-6 w-6 text-rose-600 dark:text-rose-500" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t.pdfTools.title}</h1>
                </div>
                <p className="text-muted-foreground text-sm md:text-base">{t.pdfTools.description}</p>
            </div>
            {children}
        </div>
    )
}
