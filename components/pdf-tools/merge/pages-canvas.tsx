"use client"

import { useState } from "react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    type DragStartEvent,
    type DragEndEvent,
} from "@dnd-kit/core"
import {
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from "@dnd-kit/sortable"
import { Card } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/i18n-context"
import { usePdfMergeStore, type PageReference } from "@/lib/pdf/pdf-store"
import { SortablePage } from "../shared/sortable-page"
import { getCachedThumbnail } from "@/lib/pdf/thumbnail-cache"
import { PdfPageSkeleton } from "../shared/pdf-page-skeleton"

// Re-export types for backwards compatibility
export type { PageReference } from "@/lib/pdf/pdf-store"

interface PagesCanvasProps {
    readonly thumbnailWidth?: number
}

// Separate component for drag overlay to use cached thumbnail
function DragOverlayContent({
    page,
    thumbnailWidth,
}: Readonly<{
    page: PageReference
    thumbnailWidth: number
}>) {
    const cachedThumbnail = getCachedThumbnail(page.fileId, page.pageNumber, thumbnailWidth)
    const thumbnailHeight = Math.round(thumbnailWidth * 1.4)

    return (
        <div className="opacity-90">
            <Card className="overflow-hidden shadow-xl">
                {cachedThumbnail ? (
                    <img
                        src={cachedThumbnail}
                        alt={`${page.fileName} - Página ${page.pageNumber}`}
                        width={thumbnailWidth}
                        height={thumbnailHeight}
                        className="block"
                        draggable={false}
                    />
                ) : (
                    <PdfPageSkeleton width={thumbnailWidth} />
                )}
            </Card>
            <div className="mt-1 text-center">
                <p className="text-xs font-medium truncate">{page.fileName}</p>
                <p className="text-xs text-muted-foreground">
                    Pág. {page.pageNumber}
                </p>
            </div>
        </div>
    )
}

export function PagesCanvas({ thumbnailWidth = 120 }: PagesCanvasProps) {
    const { t } = useI18n()
    const { pages, documents, reorderPages, removePage } = usePdfMergeStore()
    const [activeId, setActiveId] = useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement before drag starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = pages.findIndex((p) => p.id === active.id)
            const newIndex = pages.findIndex((p) => p.id === over.id)
            reorderPages(oldIndex, newIndex)
        }

        setActiveId(null)
    }

    const handleDragCancel = () => {
        setActiveId(null)
    }

    // Get active page for drag overlay
    const activePage = activeId ? pages.find((p) => p.id === activeId) : null

    if (pages.length === 0) {
        return (
            <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center">
                <p className="text-sm text-muted-foreground">
                    {t.pdfTools.merge.noPages ?? "Nenhuma página adicionada"}
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <p>
                    {(t.pdfTools.merge.totalPages ?? "Total: {count} página(s)").replace(
                        "{count}",
                        pages.length.toString()
                    )}
                </p>
                <p className="text-xs">
                    {t.pdfTools.merge.dragHint ?? "Arraste as páginas para reorganizar"}
                </p>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <SortableContext
                    items={pages.map((p) => p.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {pages.map((pageRef) => {
                            const objectUrl = documents.get(pageRef.fileId)?.objectUrl
                            if (!objectUrl) return null

                            return (
                                <SortablePage
                                    key={pageRef.id}
                                    id={pageRef.id}
                                    fileId={pageRef.fileId}
                                    pageNumber={pageRef.pageNumber}
                                    fileName={pageRef.fileName}
                                    objectUrl={objectUrl}
                                    thumbnailWidth={thumbnailWidth}
                                    onRemove={removePage}
                                />
                            )
                        })}
                    </div>
                </SortableContext>

                {/* Drag Overlay - Shows a preview of the dragged item */}
                <DragOverlay adjustScale={false}>
                    {activePage ? (
                        <DragOverlayContent
                            page={activePage}
                            thumbnailWidth={thumbnailWidth}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    )
}
