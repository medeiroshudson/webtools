"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GripVertical, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { PdfPageSkeleton } from "./pdf-page-skeleton"
import { useThumbnail } from "@/lib/pdf/use-thumbnail"

interface SortablePageProps {
    id: string
    fileId: string
    pageNumber: number
    fileName: string
    objectUrl: string
    thumbnailWidth?: number
    onRemove: (id: string) => void
}

export function SortablePage({
    id,
    fileId,
    pageNumber,
    fileName,
    objectUrl,
    thumbnailWidth = 120,
    onRemove,
}: Readonly<SortablePageProps>) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    // Use cached thumbnail instead of live react-pdf Document
    const { thumbnailUrl, isLoading, error } = useThumbnail(
        objectUrl,
        fileId,
        pageNumber,
        thumbnailWidth
    )

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1000 : "auto",
    }

    const thumbnailHeight = Math.round(thumbnailWidth * 1.4)

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "relative group touch-none",
                isDragging && "opacity-50"
            )}
        >
            <Card className="overflow-hidden relative">
                {/* Drag handle - covers entire card for better UX */}
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
                    aria-label={`Arrastar página ${pageNumber}`}
                />

                {/* Drag handle icon */}
                <div className="absolute top-1 left-1 bg-background/80 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                    <GripVertical className="h-3 w-3 text-muted-foreground" />
                </div>

                {/* Remove button */}
                <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove(id)
                    }}
                    aria-label={`Remover página ${pageNumber}`}
                >
                    <X className="h-3 w-3" />
                </Button>

                {/* Cached Thumbnail Image */}
                {isLoading && <PdfPageSkeleton width={thumbnailWidth} />}

                {error && (
                    <div
                        className="flex items-center justify-center bg-destructive/10 text-destructive text-xs"
                        style={{ width: thumbnailWidth, height: thumbnailHeight }}
                    >
                        Erro
                    </div>
                )}

                {thumbnailUrl && !isLoading && !error && (
                    <img
                        src={thumbnailUrl}
                        alt={`${fileName} - Página ${pageNumber}`}
                        width={thumbnailWidth}
                        height={thumbnailHeight}
                        className="block"
                        draggable={false}
                    />
                )}
            </Card>

            {/* Page info */}
            <div className="mt-1 text-center">
                <p className="text-xs font-medium truncate max-w-full" title={fileName}>
                    {fileName}
                </p>
                <p className="text-xs text-muted-foreground">Pág. {pageNumber}</p>
            </div>
        </div>
    )
}
