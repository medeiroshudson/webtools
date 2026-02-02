"use client"

import { CreateNoteForm } from "@/components/notes/create-note-form"
import { AccessAndHistory } from "@/components/notes/access-and-history"
import { ToolLayout } from "@/components/layout/tool-layout"
import { ToolHeader } from "@/components/layout/tool-header"
import { useI18n } from "@/lib/i18n/i18n-context"
import { StickyNote } from "lucide-react"

export function NotesClient() {
    const { t } = useI18n()

    return (
        <ToolLayout
            header={
                <ToolHeader
                    icon={<StickyNote className="h-6 w-6" />}
                    title={t.notes.title}
                    description={t.notes.description}
                    color="emerald"
                />
            }
        >
            {/* Main Content - 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 flex-1 min-h-0 h-full">
                {/* Left Column - Create Note */}
                <div className="lg:col-span-1 min-h-0 h-full">
                    <CreateNoteForm />
                </div>

                {/* Right Column - Access & History Combined */}
                <div className="lg:col-span-1 min-h-0 h-full">
                    <AccessAndHistory />
                </div>
            </div>
        </ToolLayout>
    )
}
