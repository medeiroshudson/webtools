"use client"

import { PdfToolsLayout } from "@/components/pdf-tools/pdf-tools-layout"
import { useI18n } from "@/lib/i18n/i18n-context"
import { Suspense } from "react"

export default function PdfToolsPage() {
    const { t } = useI18n()

    return (
        <div className="container mx-auto py-6 md:py-8 px-4 md:px-6">
            <div className="mb-6 md:mb-8 space-y-2 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t.pdfTools.title}</h1>
                <p className="text-muted-foreground text-sm md:text-base">{t.pdfTools.description}</p>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <PdfToolsLayout />
            </Suspense>
        </div>
    )
}
