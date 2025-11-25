"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/api/supabase"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, ArrowLeft, Share2, Copy, Edit2, Check } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/i18n-context"
import { addNoteToHistory } from "./access-and-history"

export function NoteEditor({ note }: { note: any }) {
    const { t } = useI18n()
    const [title, setTitle] = useState(note.title || t.notes.editor.untitled)
    const [content, setContent] = useState(note.content)
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [saving, setSaving] = useState(false)
    const isCollaborative = note.is_collaborative
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const titleInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // Add to history when note is opened
        addNoteToHistory(note.id, title)
    }, [note.id, title])

    useEffect(() => {
        if (isEditingTitle && titleInputRef.current) {
            titleInputRef.current.focus()
        }
    }, [isEditingTitle])

    useEffect(() => {
        if (!isCollaborative) return

        const channel = supabase
            .channel(`note:${note.id}`)
            .on("postgres_changes", { event: "UPDATE", schema: "public", table: "notes", filter: `id=eq.${note.id}` }, (payload) => {
                if (payload.new.content !== content) {
                    setContent(payload.new.content)
                }
                if (payload.new.title !== title) {
                    setTitle(payload.new.title)
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [note.id, isCollaborative, content, title])

    const save = async (newContent: string, newTitle?: string) => {
        setSaving(true)
        try {
            const updateData: any = {
                content: newContent,
                updated_at: new Date().toISOString()
            }

            if (newTitle !== undefined) {
                updateData.title = newTitle
            }

            const { error } = await supabase
                .from("notes")
                .update(updateData)
                .eq("id", note.id)

            if (error) throw error
        } catch (e: any) {
            toast.error("Failed to save")
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value
        setContent(newContent)

        if (isCollaborative) {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current)
            }
            saveTimeoutRef.current = setTimeout(() => {
                save(newContent)
            }, 1000)
        }
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        setTitle(newTitle)
    }

    const saveTitle = async () => {
        if (!isCollaborative) return

        const finalTitle = title.trim() || t.notes.editor.untitled
        setTitle(finalTitle)
        setIsEditingTitle(false)
        await save(content, finalTitle)
    }

    const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            saveTitle()
        } else if (e.key === "Escape") {
            setTitle(note.title || t.notes.editor.untitled)
            setIsEditingTitle(false)
        }
    }

    const copyUrl = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url)
        toast.success(t.notes.editor.linkCopied)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-background">
            <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b bg-background/95 backdrop-blur">
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <Link href="/notes" className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                        <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
                    </Link>
                    {isEditingTitle ? (
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Input
                                ref={titleInputRef}
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                                onKeyDown={handleTitleKeyDown}
                                onBlur={saveTitle}
                                className="h-8 text-sm md:text-base font-semibold"
                                disabled={!isCollaborative}
                            />
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={saveTitle}
                                className="flex-shrink-0 h-8 w-8 p-0"
                            >
                                <Check className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <h1 className="font-semibold text-sm md:text-base truncate">{title}</h1>
                            {isCollaborative && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIsEditingTitle(true)}
                                    className="flex-shrink-0 h-8 w-8 p-0"
                                >
                                    <Edit2 className="h-3 w-3 md:h-4 md:w-4" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        {saving ? (
                            <span className="flex items-center gap-1">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span className="hidden sm:inline">{t.notes.editor.saving}</span>
                            </span>
                        ) : (
                            <span className="hidden sm:inline">{t.notes.editor.saved}</span>
                        )}
                        {!isCollaborative && <span className="bg-secondary px-2 py-1 rounded text-xs">{t.notes.editor.readOnly}</span>}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={copyUrl}
                        className="gap-1.5 h-8 md:h-9 px-2 md:px-3"
                    >
                        <Copy className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="hidden sm:inline text-xs md:text-sm">{t.notes.editor.copyLink}</span>
                    </Button>
                </div>
            </header>
            <main className="flex-1 relative overflow-hidden">
                <Textarea
                    className="w-full h-full resize-none border-0 p-4 md:p-6 focus-visible:ring-0 text-sm md:text-base lg:text-lg leading-relaxed font-mono"
                    value={content}
                    onChange={handleChange}
                    readOnly={!isCollaborative}
                    placeholder={isCollaborative ? t.notes.editor.startTyping : t.notes.editor.readOnlyPlaceholder}
                />
            </main>
        </div>
    )
}
