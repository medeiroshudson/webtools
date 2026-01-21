"use client"

import { useI18n } from "@/lib/i18n/i18n-context"
import { Hash } from "lucide-react"

export default function Base64ToolsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { t } = useI18n()

    return (
        <div className="container mx-auto h-[calc(100vh-4rem)] flex flex-col py-6 md:py-8 px-4 md:px-6">
            <div className="mb-6 space-y-2 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                        <Hash className="h-6 w-6 text-purple-600 dark:text-purple-500" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t.base64Tools.title}</h1>
                </div>
                <p className="text-muted-foreground text-sm md:text-base">{t.base64Tools.description}</p>
            </div>
            {children}
        </div>
    )
}
