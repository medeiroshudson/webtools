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
        <div className="container mx-auto h-[calc(100vh-6.5rem)] flex flex-col px-4 md:px-6 pt-[5.5rem]">
            <div className="mb-4 space-y-1 text-center md:text-left flex-shrink-0">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="p-2 rounded-lg bg-rose-500/10">
                        <FileType className="h-6 w-6 text-rose-600 dark:text-rose-500" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t.pdfTools.title}</h1>
                </div>
                <p className="text-muted-foreground text-sm">{t.pdfTools.description}</p>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
        </div>
    )
}
