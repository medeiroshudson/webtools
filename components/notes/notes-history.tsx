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
    const { t } = useI18n()
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

        if (diffMins < 1) return t.locale === "pt-BR" ? "Agora" : "Now"
        if (diffMins < 60) return t.locale === "pt-BR" ? `${diffMins} min atrás` : `${diffMins} min ago`
        if (diffHours < 24) return t.locale === "pt-BR" ? `${diffHours}h atrás` : `${diffHours}h ago`
        if (diffDays < 7) return t.locale === "pt-BR" ? `${diffDays}d atrás` : `${diffDays}d ago`

        return date.toLocaleDateString(t.locale === "pt-BR" ? "pt-BR" : "en-US", {
            month: "short",
            day: "numeric"
        })
    }

    if (history.length === 0) {
        return null
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl md:text-3xl">{t.notes.history.title}</CardTitle>
                        <CardDescription className="text-sm md:text-base">
                            {t.notes.history.description}
                        </CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearHistory}
                        className="gap-2 text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden md:inline">{t.notes.history.clearHistory}</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                {history.map((item) => (
                    <Button
                        key={item.id}
                        variant="outline"
                        className="w-full justify-start h-auto py-3 px-4 hover:bg-secondary"
                        onClick={() => router.push(`/notes/${item.id}`)}
                    >
                        <div className="flex items-center gap-3 w-full">
                            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex flex-col items-start flex-1 min-w-0">
                                <span className="font-medium text-sm md:text-base truncate w-full text-left">
                                    {item.title}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {formatDate(item.lastAccessed)}
                                </span>
                            </div>
                        </div>
                    </Button>
                ))}
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
