"use client"

import { JsonEditor } from "@/components/json-formatter/json-editor"
import { useI18n } from "@/lib/i18n/i18n-context"

export default function JsonFormatterPage() {
    const { t } = useI18n()

    return (
        <div className="container mx-auto h-[calc(100vh-4rem)] flex flex-col py-6 md:py-8 px-4 md:px-6">
            <div className="mb-6 space-y-2 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t.jsonFormatter.title}</h1>
                <p className="text-muted-foreground text-sm md:text-base">{t.jsonFormatter.description}</p>
            </div>
            <div className="flex-1 overflow-hidden w-full">
                <JsonEditor />
            </div>
        </div>
    )
}
