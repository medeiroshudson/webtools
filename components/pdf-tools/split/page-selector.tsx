"use client"

import { useState, useEffect } from "react"
import { SelectablePage } from "../shared/selectable-page"
import { PdfPageSkeleton } from "../shared/pdf-page-skeleton"
import { getPDFInfo } from "@/lib/pdf/pdf-operations"

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
    thumbnailWidth = 160,
}: PageSelectorProps) {
    const [numPages, setNumPages] = useState<number>(0)
    const [fileUrl, setFileUrl] = useState<string>("")
    const [fileId, setFileId] = useState<string>("")
    const [lastSelectedPage, setLastSelectedPage] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const url = URL.createObjectURL(file)
        const id = `split-${file.name}-${file.size}-${file.lastModified}`
        setFileUrl(url)
        setFileId(id)
        setIsLoading(true)
        setError(null)

        getPDFInfo(file)
            .then((info) => {
                setNumPages(info.pageCount)
                setIsLoading(false)
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Erro ao carregar PDF")
                setIsLoading(false)
            })

        return () => URL.revokeObjectURL(url)
    }, [file])

    const handlePageClick = (pageNumber: number, shiftKey: boolean) => {
        if (shiftKey && lastSelectedPage !== null && onPageRangeSelect) {
            const start = Math.min(lastSelectedPage, pageNumber)
            const end = Math.max(lastSelectedPage, pageNumber)
            onPageRangeSelect(start, end)
        } else {
            onPageToggle(pageNumber)
            setLastSelectedPage(pageNumber)
        }
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <PdfPageSkeleton width={thumbnailWidth} />
                        <div className="h-4 w-16 bg-muted rounded mt-1.5 animate-pulse" />
                    </div>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8 border-2 border-dashed border-destructive/30 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: numPages }, (_, index) => {
                    const pageNumber = index + 1
                    return (
                        <SelectablePage
                            key={pageNumber}
                            fileId={fileId}
                            pageNumber={pageNumber}
                            objectUrl={fileUrl}
                            thumbnailWidth={thumbnailWidth}
                            isSelected={selectedPages.has(pageNumber)}
                            onToggle={handlePageClick}
                        />
                    )
                })}
            </div>

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
