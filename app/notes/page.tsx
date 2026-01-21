"use client"

import { CreateNoteForm } from "@/components/notes/create-note-form"
import { AccessAndHistory } from "@/components/notes/access-and-history"
import { useI18n } from "@/lib/i18n/i18n-context"
import { StickyNote } from "lucide-react"

export default function NotesPage() {
    const { t } = useI18n()

    return (
        <div className="container mx-auto h-[calc(100vh-6.5rem)] flex flex-col px-4 md:px-6 pt-[5.5rem]">
            {/* Header */}
            <div className="mb-4 space-y-1 text-center md:text-left flex-shrink-0">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                        <StickyNote className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        {t.notes.title}
                    </h1>
                </div>
                <p className="text-muted-foreground text-sm">{t.notes.description}</p>
            </div>

            {/* Main Content - 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 flex-1 min-h-0 items-stretch">
                {/* Left Column - Create Note */}
                <div className="lg:col-span-1 min-h-0">
                    <CreateNoteForm />
                </div>

                {/* Right Column - Access & History Combined */}
                <div className="lg:col-span-1 min-h-0">
                    <AccessAndHistory />
                </div>
            </div>
        </div>
    )
}
