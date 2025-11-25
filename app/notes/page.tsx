"use client"

import { CreateNoteForm } from "@/components/notes/create-note-form"
import { AccessNoteForm } from "@/components/notes/access-note-form"
import { NotesHistory } from "@/components/notes/notes-history"
import { useI18n } from "@/lib/i18n/i18n-context"

export default function NotesPage() {
    const { t } = useI18n()

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8 md:py-16">
            <div className="w-full max-w-4xl space-y-6 lg:space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t.notes.title}</h1>
                    <p className="text-muted-foreground text-sm md:text-base">{t.notes.description}</p>
                </div>
                <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
                    <CreateNoteForm />
                    <AccessNoteForm />
                </div>
                <NotesHistory />
            </div>
        </div>
    )
}
