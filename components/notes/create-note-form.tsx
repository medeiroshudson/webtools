"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/api/supabase"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n/i18n-context"

export function CreateNoteForm() {
    const { t } = useI18n()
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [isCollaborative, setIsCollaborative] = useState(false)
    const [expiration, setExpiration] = useState("never")
    const [loading, setLoading] = useState(false)

    const createNote = async () => {
        setLoading(true)
        try {
            let expiresAt = null
            const now = new Date()
            if (expiration === "1h") expiresAt = new Date(now.getTime() + 60 * 60 * 1000)
            if (expiration === "24h") expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)
            if (expiration === "7d") expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

            const { data, error } = await supabase
                .from("notes")
                .insert({
                    title: title.trim() || t.notes.editor.untitled,
                    content: "",
                    is_collaborative: isCollaborative,
                    expires_at: expiresAt ? expiresAt.toISOString() : null,
                })
                .select()
                .single()

            if (error) throw error

            router.push(`/notes/${data.id}`)
        } catch (error: any) {
            toast.error(t.notes.messages.createError + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full shadow-lg h-full flex flex-col">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl md:text-3xl">{t.notes.create.title}</CardTitle>
                <CardDescription className="text-sm md:text-base">
                    {t.notes.create.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center space-y-6">
                <div className="space-y-3">
                    <Label htmlFor="title" className="text-sm md:text-base">{t.notes.create.noteTitle}</Label>
                    <Input
                        id="title"
                        type="text"
                        placeholder={t.notes.create.noteTitlePlaceholder}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="space-y-3">
                    <Label className="text-sm md:text-base">{t.notes.create.expiration}</Label>
                    <Select value={expiration} onValueChange={setExpiration}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1h">{t.notes.create.expiration1h}</SelectItem>
                            <SelectItem value="24h">{t.notes.create.expiration24h}</SelectItem>
                            <SelectItem value="7d">{t.notes.create.expiration7d}</SelectItem>
                            <SelectItem value="never">{t.notes.create.expirationNever}</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs md:text-sm text-muted-foreground">
                        {t.notes.create.expirationDescription}
                    </p>
                </div>

                <div className="flex items-start justify-between gap-4">
                    <Label htmlFor="collaborative" className="flex flex-col space-y-1.5 cursor-pointer flex-1">
                        <span className="text-sm md:text-base font-medium">{t.notes.create.collaborative}</span>
                        <span className="font-normal text-xs md:text-sm text-muted-foreground">
                            {t.notes.create.collaborativeDescription}
                        </span>
                    </Label>
                    <Switch
                        id="collaborative"
                        checked={isCollaborative}
                        onCheckedChange={setIsCollaborative}
                        className="mt-1"
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full h-11 text-sm md:text-base" onClick={createNote} disabled={loading}>
                    {loading ? t.notes.create.creating : t.notes.create.createButton}
                </Button>
            </CardFooter>
        </Card>
    )
}
