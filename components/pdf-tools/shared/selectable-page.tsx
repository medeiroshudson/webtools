"use client"

import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { PdfPageSkeleton } from "./pdf-page-skeleton"
import { useThumbnail } from "@/lib/pdf/use-thumbnail"

interface SelectablePageProps {
    fileId: string
    pageNumber: number
    objectUrl: string
    thumbnailWidth?: number
    isSelected: boolean
    onToggle: (pageNumber: number, shiftKey: boolean) => void
}

export function SelectablePage({
    fileId,
    pageNumber,
    objectUrl,
    thumbnailWidth = 160,
    isSelected,
    onToggle,
}: Readonly<SelectablePageProps>) {
    const { thumbnailUrl, isLoading, error } = useThumbnail(
        objectUrl,
        fileId,
        pageNumber,
        thumbnailWidth
    )

    const thumbnailHeight = Math.round(thumbnailWidth * 1.4)

    return (
        <div
            className="relative group cursor-pointer"
            onClick={(e) => onToggle(pageNumber, e.shiftKey)}
        >
            <Card
                className={cn(
                    "overflow-hidden relative transition-all",
                    isSelected
                        ? "ring-2 ring-primary shadow-lg"
                        : "hover:ring-2 hover:ring-primary/50"
                )}
            >
                {/* Checkbox */}
                <div
                    className={cn(
                        "absolute top-2 left-2 z-20 transition-opacity",
                        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                >
                    <Checkbox
                        checked={isSelected}
                        className="bg-background border-2"
                        onClick={(e) => e.stopPropagation()}
                        onCheckedChange={() => onToggle(pageNumber, false)}
                    />
                </div>

                {/* Selection overlay */}
                {isSelected && (
                    <div className="absolute inset-0 bg-primary/10 pointer-events-none z-10" />
                )}

                {/* Thumbnail */}
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
                        alt={`Página ${pageNumber}`}
                        width={thumbnailWidth}
                        height={thumbnailHeight}
                        className="block"
                        draggable={false}
                    />
                )}
            </Card>

            {/* Page number */}
            <p
                className={cn(
                    "text-xs mt-1.5 text-center",
                    isSelected ? "text-primary font-medium" : "text-muted-foreground"
                )}
            >
                Página {pageNumber}
            </p>
        </div>
    )
}
