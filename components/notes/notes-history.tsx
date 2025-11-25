"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Trash2 } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"

interface NoteHistoryItem {
    id: string
    title: string
    lastAccessed: number
}

const HISTORY_KEY = "notes-history"
const MAX_HISTORY_ITEMS = 5

export function NotesHistory() {
    const { t, locale } = useI18n()
    const router = useRouter()
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
        <Card className="w-full border-2 h-full flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            {t.notes.history.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                            {t.notes.history.description}
                        </CardDescription>
                    </div>
                    {history.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearHistory}
                            className="gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 h-8"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline text-xs">{t.notes.history.clearHistory}</span>
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pt-0 space-y-2">
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                        <Clock className="h-12 w-12 text-muted-foreground/30 mb-3" />
                        <p className="text-sm text-muted-foreground">{t.notes.history.empty}</p>
                    </div>
                ) : (
                    history.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => router.push(`/notes/${item.id}`)}
                            className="w-full text-left p-3 rounded-lg border-2 hover:border-primary hover:bg-accent transition-all duration-200 group"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                        {item.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {formatDate(item.lastAccessed)}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary text-xs">→</span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))
                )}
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
