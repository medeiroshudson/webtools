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
        <Card className="w-full shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl md:text-3xl">{t.notes.access.title}</CardTitle>
                <CardDescription className="text-sm md:text-base">
                    {t.notes.access.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <Label htmlFor="note-id" className="text-sm md:text-base">{t.notes.access.noteId}</Label>
                    <Input
                        id="note-id"
                        type="text"
                        placeholder={t.notes.access.noteIdPlaceholder}
                        value={noteId}
                        onChange={(e) => setNoteId(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-11 text-sm md:text-base"
                    />
                    <p className="text-xs md:text-sm text-muted-foreground">
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
