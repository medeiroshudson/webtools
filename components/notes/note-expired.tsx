"use client"

import { useI18n } from "@/lib/i18n/i18n-context"

export function NoteExpired() {
    const { t } = useI18n()

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">{t.notes.editor.expired}</h1>
                <p className="text-muted-foreground text-lg">{t.notes.editor.expiredDescription}</p>
            </div>
        </div>
    )
}
