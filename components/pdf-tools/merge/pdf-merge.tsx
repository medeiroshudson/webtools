"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { FileUploadZone } from "../shared/file-upload-zone"
import { PagesCanvas } from "./pages-canvas"
import { useI18n } from "@/lib/i18n/i18n-context"
import { usePdfMergeStore } from "@/lib/pdf/pdf-store"
import { mergePDFPages, type PageSelection } from "@/lib/pdf/pdf-operations"
import { downloadPDF, generateFilename, validateTotalSize, formatBytes } from "@/lib/pdf/file-utils"
import { clearAllThumbnails } from "@/lib/pdf/thumbnail-cache"
import { toast } from "sonner"
import { RotateCcw, Plus, FileText, X, Download } from "lucide-react"

export function PdfMerge() {
    const { t } = useI18n()
    const {
        documents,
        pages,
        isProcessing,
        addDocument,
        removeDocument,
        setIsProcessing,
        clear,
    } = usePdfMergeStore()

    // Clean up thumbnails when component unmounts
    useEffect(() => {
        return () => {
            clearAllThumbnails()
        }
    }, [])

    const handleFilesSelected = async (newFiles: File[]) => {
        // Validate total size
        const existingFiles = Array.from(documents.values()).map((d) => d.file)
        const allFiles = [...existingFiles, ...newFiles]
        if (!validateTotalSize(allFiles)) {
            toast.error(t.pdfTools.errors.totalSizeExceeded.replace("{size}", "100MB"))
            return
        }

        const toastId = toast.loading(t.pdfTools.common.loading ?? "Carregando...")

        try {
            for (const file of newFiles) {
                await addDocument(file)
            }

            toast.dismiss(toastId)
            toast.success(
                (t.pdfTools.merge.documentsAdded ?? "{count} documento(s) adicionado(s)").replace(
                    "{count}",
                    newFiles.length.toString()
                )
            )
        } catch (error) {
            toast.dismiss(toastId)
            toast.error(
                (t.pdfTools.errors.fileReadError ?? "Erro ao processar PDFs") +
                    ": " +
                    (error instanceof Error ? error.message : "Unknown error")
            )
        }
    }

    const handleMerge = async () => {
        if (pages.length === 0) {
            toast.error(t.pdfTools.errors.noFilesSelected)
            return
        }

        // Check if there's anything to merge
        const docsArray = Array.from(documents.values())
        if (docsArray.length === 1 && pages.length === docsArray[0].pageCount) {
            // Single document with all pages - check if reordered
            const isOriginalOrder = pages.every(
                (page, index) => page.pageNumber === index + 1
            )
            if (isOriginalOrder) {
                toast.error(
                    t.pdfTools.merge.needMoreFiles ??
                        "Adicione pelo menos 2 arquivos diferentes ou reorganize as páginas"
                )
                return
            }
        }

        setIsProcessing(true)
        const toastId = toast.loading(t.pdfTools.merge.processing)

        try {
            // Build page selections in the order they appear in the canvas
            const pageSelections: PageSelection[] = pages.map((page) => {
                const doc = documents.get(page.fileId)
                if (!doc) {
                    throw new Error(`Document not found: ${page.fileId}`)
                }
                return {
                    file: doc.file,
                    pageNumber: page.pageNumber,
                }
            })

            const mergedPdf = await mergePDFPages(pageSelections)
            const filename = generateFilename("merged-pdf")
            downloadPDF(mergedPdf, filename)

            toast.dismiss(toastId)
            toast.success(t.pdfTools.success.merged)
        } catch (error) {
            toast.dismiss(toastId)
            toast.error(
                t.pdfTools.errors.processingError +
                    ": " +
                    (error instanceof Error ? error.message : "Unknown error")
            )
        } finally {
            setIsProcessing(false)
        }
    }

    const handleReset = () => {
        clearAllThumbnails()
        clear()
    }

    const documentsArray = Array.from(documents.values())
    const hasPages = pages.length > 0

    // Empty state
    if (!hasPages) {
        return (
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>{t.pdfTools.merge.title}</CardTitle>
                    <CardDescription>{t.pdfTools.merge.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                    <FileUploadZone
                        onFilesSelected={handleFilesSelected}
                        multiple
                        disabled={isProcessing}
                        className="flex-1 min-h-0"
                    />
                </CardContent>
            </Card>
        )
    }

    // Main layout with pages
    return (
        <TooltipProvider>
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>{t.pdfTools.merge.title}</CardTitle>
                    <CardDescription>{t.pdfTools.merge.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
                    {/* Top Bar: Actions + Documents */}
                    <div className="flex flex-wrap items-center gap-3 bg-background shrink-0">
                        {/* Primary Action */}
                        <Button
                            onClick={handleMerge}
                            disabled={isProcessing || pages.length === 0}
                            size="default"
                            className="gap-2"
                        >
                            <Download className="h-4 w-4" />
                            {isProcessing
                                ? t.pdfTools.merge.processing
                                : t.pdfTools.merge.mergeButton}
                        </Button>

                        {/* Page Count Badge */}
                        <Badge variant="secondary" className="gap-1.5 py-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            {pages.length} {pages.length === 1 ? "página" : "páginas"}
                        </Badge>

                        {/* Separator */}
                        <div className="h-6 w-px bg-border" />

                        {/* Document Pills */}
                        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
                            {documentsArray.map((doc) => (
                                <Tooltip key={doc.fileId}>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center gap-1.5 bg-muted rounded-full pl-3 pr-1 py-1 max-w-[200px]">
                                            <span className="text-xs font-medium truncate">
                                                {doc.fileName}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                                                onClick={() => removeDocument(doc.fileId)}
                                                disabled={isProcessing}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{doc.fileName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatBytes(doc.fileSize)} • {doc.pageCount} página{doc.pageCount === 1 ? "" : "s"}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}

                            {/* Add Files Button */}
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    multiple
                                    onChange={(e) => {
                                        const files = e.target.files
                                        if (files && files.length > 0) {
                                            handleFilesSelected(Array.from(files))
                                        }
                                        e.target.value = ""
                                    }}
                                    disabled={isProcessing}
                                    className="sr-only"
                                />
                                <div className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full px-3 py-1.5 transition-colors">
                                    <Plus className="h-3.5 w-3.5" />
                                    <span className="text-xs font-medium">Adicionar</span>
                                </div>
                            </label>
                        </div>

                        {/* Reset Button */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleReset}
                                    variant="ghost"
                                    size="icon"
                                    disabled={isProcessing}
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {t.pdfTools.common.reset}
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    {/* Pages Canvas - fills remaining space */}
                    <Card className="flex-1 min-h-0 overflow-hidden">
                        <CardContent className="h-full p-4 overflow-auto">
                            <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                                <span>
                                    {t.pdfTools.merge.dragHint ?? "Arraste as páginas para reorganizar"}
                                </span>
                            </div>
                            <PagesCanvas thumbnailWidth={160} />
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}
