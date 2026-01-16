"use client"

import { useI18n } from "@/lib/i18n/i18n-context"

export default function Base64ToolsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { t } = useI18n()

    return (
        <div className="container mx-auto h-[calc(100vh-4rem)] flex flex-col py-6 md:py-8 px-4 md:px-6">
            <div className="mb-6 space-y-2 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t.base64Tools.title}</h1>
                <p className="text-muted-foreground text-sm md:text-base">{t.base64Tools.description}</p>
            </div>
            {children}
        </div>
    )
}
