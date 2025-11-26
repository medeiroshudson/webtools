"use client"

import { FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatBytes } from "@/lib/pdf/file-utils"

export interface DocumentInfo {
    id: string
    file: File
    pageCount: number
}

interface DocumentListProps {
    documents: DocumentInfo[]
    onRemove: (documentId: string) => void
    disabled?: boolean
}

export function DocumentList({ documents, onRemove, disabled = false }: DocumentListProps) {
    if (documents.length === 0) {
        return null
    }

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium">
                Documentos anexados ({documents.length})
            </h3>
            <div className="space-y-2">
                {documents.map((doc) => (
                    <Card key={doc.id}>
                        <CardContent className="flex items-center gap-3 p-3">
                            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{doc.file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {formatBytes(doc.file.size)} • {doc.pageCount} página{doc.pageCount !== 1 ? "s" : ""}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onRemove(doc.id)}
                                disabled={disabled}
                                className="h-8 w-8 flex-shrink-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
