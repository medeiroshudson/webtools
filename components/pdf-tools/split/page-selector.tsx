"use client"

import { useState, useEffect } from "react"
import { Document, Page } from "react-pdf"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import "@/lib/pdf/pdf-worker-config"

interface PageSelectorProps {
    file: File
    selectedPages: Set<number>
    onPageToggle: (pageNumber: number) => void
    onPageRangeSelect?: (start: number, end: number) => void
    thumbnailWidth?: number
}

export function PageSelector({
    file,
    selectedPages,
    onPageToggle,
    onPageRangeSelect,
    thumbnailWidth = 120,
}: PageSelectorProps) {
    const [numPages, setNumPages] = useState<number>(0)
    const [fileUrl, setFileUrl] = useState<string>("")
    const [lastSelectedPage, setLastSelectedPage] = useState<number | null>(null)

    useEffect(() => {
        const url = URL.createObjectURL(file)
        setFileUrl(url)
        return () => URL.revokeObjectURL(url)
    }, [file])

    const handlePageClick = (pageNumber: number, shiftKey: boolean) => {
        if (shiftKey && lastSelectedPage !== null && onPageRangeSelect) {
            // Range selection with Shift key
            const start = Math.min(lastSelectedPage, pageNumber)
            const end = Math.max(lastSelectedPage, pageNumber)
            onPageRangeSelect(start, end)
        } else {
            // Single page toggle
            onPageToggle(pageNumber)
            setLastSelectedPage(pageNumber)
        }
    }

    return (
        <div className="space-y-4">
            <Document
                file={fileUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={
                    <div className="flex items-center justify-center p-8">
                        <p className="text-sm text-muted-foreground">Carregando páginas...</p>
                    </div>
                }
                error={
                    <div className="flex items-center justify-center p-8">
                        <p className="text-sm text-destructive">Erro ao carregar PDF</p>
                    </div>
                }
            >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {Array.from(new Array(numPages), (el, index) => {
                        const pageNumber = index + 1
                        const isSelected = selectedPages.has(pageNumber)

                        return (
                            <div
                                key={`page_${pageNumber}`}
                                className="flex flex-col items-center"
                                onClick={(e) => handlePageClick(pageNumber, e.shiftKey)}
                            >
                                <Card
                                    className={cn(
                                        "overflow-hidden cursor-pointer transition-all relative",
                                        isSelected
                                            ? "ring-2 ring-primary shadow-lg"
                                            : "hover:ring-2 hover:ring-primary/50"
                                    )}
                                >
                                    <Page
                                        pageNumber={pageNumber}
                                        width={thumbnailWidth}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />
                                    <div
                                        className={cn(
                                            "absolute top-2 left-2 transition-opacity",
                                            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                        )}
                                    >
                                        <Checkbox checked={isSelected} className="bg-background" />
                                    </div>
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
                                    )}
                                </Card>
                                <p className={cn("text-xs mt-1", isSelected ? "text-primary font-medium" : "text-muted-foreground")}>
                                    Página {pageNumber}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </Document>

            {numPages > 0 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
                    <p>
                        Total: {numPages} página{numPages > 1 ? "s" : ""}
                    </p>
                    <p>
                        Selecionadas: {selectedPages.size} página{selectedPages.size !== 1 ? "s" : ""}
                    </p>
                </div>
            )}
        </div>
    )
}
