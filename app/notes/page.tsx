"use client"

import { CreateNoteForm } from "@/components/notes/create-note-form"
import { AccessAndHistory } from "@/components/notes/access-and-history"
import { useI18n } from "@/lib/i18n/i18n-context"

export default function NotesPage() {
    const { t } = useI18n()

    return (
        <div className="container h-[calc(100vh-3.5rem)] flex flex-col py-4 md:py-6">
            <div className="mx-auto w-full max-w-6xl flex flex-col h-full px-4 gap-4 md:gap-6">
                {/* Header */}
                <div className="space-y-2 text-center flex-shrink-0">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                        {t.notes.title}
                    </h1>
                    <p className="text-muted-foreground text-xs md:text-sm lg:text-base max-w-2xl mx-auto">
                        {t.notes.description}
                    </p>
                </div>

                {/* Main Content - 2 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 flex-1 min-h-0">
                    {/* Left Column - Create Note */}
                    <div className="lg:col-span-1">
                        <CreateNoteForm />
                    </div>

                    {/* Right Column - Access & History Combined */}
                    <div className="lg:col-span-1 overflow-hidden">
                        <AccessAndHistory />
                    </div>
                </div>
            </div>
        </div>
    )
}
