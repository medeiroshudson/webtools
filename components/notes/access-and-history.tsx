"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LogIn, Clock, Trash2 } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"

interface NoteHistoryItem {
    id: string
    title: string
    lastAccessed: number
}

const HISTORY_KEY = "notes-history"
const MAX_HISTORY_ITEMS = 5

export function AccessAndHistory() {
    const { t, locale } = useI18n()
    const router = useRouter()
    const [noteId, setNoteId] = useState("")
    const [history, setHistory] = useState<NoteHistoryItem[]>([])

    useEffect(() => {
        const loadHistory = () => {
            try {
                const stored = localStorage.getItem(HISTORY_KEY)
                if (stored) {
                    const items = JSON.parse(stored) as NoteHistoryItem[]
                    setHistory(items)
                }
            } catch (error) {
                console.error("Failed to load history:", error)
            }
        }

        loadHistory()
    }, [])

    const accessNote = () => {
        if (!noteId.trim()) return
        router.push(`/notes/${noteId.trim()}`)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            accessNote()
        }
    }

    const clearHistory = () => {
        localStorage.removeItem(HISTORY_KEY)
        setHistory([])
    }

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return locale === "pt-BR" ? "Agora" : "Now"
        if (diffMins < 60) return locale === "pt-BR" ? `${diffMins} min atrás` : `${diffMins} min ago`
        if (diffHours < 24) return locale === "pt-BR" ? `${diffHours}h atrás` : `${diffHours}h ago`
        if (diffDays < 7) return locale === "pt-BR" ? `${diffDays}d atrás` : `${diffDays}d ago`

        return date.toLocaleDateString(locale === "pt-BR" ? "pt-BR" : "en-US", {
            month: "short",
            day: "numeric"
        })
    }

    return (
        <Card className="w-full border h-full flex flex-col">
            <CardHeader className="pb-4 flex-shrink-0">
                <CardTitle className="text-xl md:text-2xl">{t.notes.access.title}</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                    {t.notes.access.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                {/* Access Form */}
                <div className="space-y-3 flex-shrink-0">
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
                </div>

                {/* Separator */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {locale === "pt-BR" ? "ou" : "or"}
                    </span>
                    <Separator className="flex-1" />
                </div>

                {/* History Section */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-3 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-medium">{t.notes.history.title}</h3>
                        </div>
                        {history.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearHistory}
                                className="gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 px-2"
                            >
                                <Trash2 className="h-3 w-3" />
                                <span className="hidden sm:inline text-xs">{t.notes.history.clearHistory}</span>
                            </Button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                        {history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-6">
                                <Clock className="h-10 w-10 text-muted-foreground/30 mb-2" />
                                <p className="text-xs text-muted-foreground">{t.notes.history.empty}</p>
                            </div>
                        ) : (
                            history.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => router.push(`/notes/${item.id}`)}
                                    className="w-full text-left p-2 rounded-lg border hover:border-primary hover:bg-accent transition-all duration-200 group"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-xs truncate group-hover:text-primary transition-colors">
                                                {item.title}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground mt-px">
                                                {formatDate(item.lastAccessed)}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-primary text-[10px]">→</span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function addNoteToHistory(id: string, title: string) {
    try {
        const stored = localStorage.getItem(HISTORY_KEY)
        let history: NoteHistoryItem[] = stored ? JSON.parse(stored) : []

        // Remove if already exists
        history = history.filter(item => item.id !== id)

        // Add to beginning
        history.unshift({
            id,
            title,
            lastAccessed: Date.now()
        })

        // Keep only MAX_HISTORY_ITEMS
        history = history.slice(0, MAX_HISTORY_ITEMS)

        localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    } catch (error) {
        console.error("Failed to save to history:", error)
    }
}
