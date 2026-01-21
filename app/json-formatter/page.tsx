"use client"

import { JsonEditor } from "@/components/json-formatter/json-editor"
import { useI18n } from "@/lib/i18n/i18n-context"

export default function JsonFormatterPage() {
    const { t } = useI18n()

    return (
        <div className="container mx-auto h-[calc(100vh-4rem)] flex flex-col py-6 md:py-8 px-4 md:px-6">
            <div className="mb-6 space-y-2 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                        <svg className="h-6 w-6 text-amber-600 dark:text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t.jsonFormatter.title}</h1>
                </div>
                <p className="text-muted-foreground text-sm md:text-base">{t.jsonFormatter.description}</p>
            </div>
            <div className="flex-1 overflow-hidden w-full">
                <JsonEditor />
            </div>
        </div>
    )
}
