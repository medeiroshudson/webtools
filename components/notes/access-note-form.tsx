"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"

export function AccessNoteForm() {
    const { t } = useI18n()
    const router = useRouter()
    const [noteId, setNoteId] = useState("")

    const accessNote = () => {
        if (!noteId.trim()) return
        router.push(`/notes/${noteId.trim()}`)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            accessNote()
        }
    }

    return (
        <Card className="w-full border-2 h-full flex flex-col hover:border-primary/50 transition-colors">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl md:text-2xl">{t.notes.access.title}</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                    {t.notes.access.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="note-id" className="text-sm font-medium">{t.notes.access.noteId}</Label>
                    <Input
                        id="note-id"
                        type="text"
                        placeholder={t.notes.access.noteIdPlaceholder}
                        value={noteId}
                        onChange={(e) => setNoteId(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-11 text-sm md:text-base font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                        {t.notes.access.noteIdHelp}
                    </p>
                </div>
                <Button
                    className="w-full h-11 text-sm md:text-base gap-2"
                    onClick={accessNote}
                    disabled={!noteId.trim()}
                    variant="secondary"
                >
                    <LogIn className="h-4 w-4" />
                    {t.notes.access.accessButton}
                </Button>
            </CardContent>
        </Card>
    )
}
