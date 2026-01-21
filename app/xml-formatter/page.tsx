"use client"

import { XmlEditor } from "@/components/xml-formatter/xml-editor"
import { useI18n } from "@/lib/i18n/i18n-context"

export default function XmlFormatterPage() {
    const { t } = useI18n()

    return (
        <div className="container mx-auto h-[calc(100vh-6.5rem)] flex flex-col px-4 md:px-6 pt-[5.5rem]">
            <div className="mb-4 space-y-1 text-center md:text-left flex-shrink-0">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="p-2 rounded-lg bg-teal-500/10">
                        <svg className="h-6 w-6 text-teal-600 dark:text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="16 18 22 12 16 6" />
                            <polyline points="8 6 2 12 8 18" />
                        </svg>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t.xmlFormatter.title}</h1>
                </div>
                <p className="text-muted-foreground text-sm">{t.xmlFormatter.description}</p>
            </div>
            <div className="flex-1 overflow-hidden w-full min-h-0">
                <XmlEditor />
            </div>
        </div>
    )
}
