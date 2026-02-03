"use client"

import { useState } from "react"
import { FileText, Scissors, Download, RotateCcw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { FileUploadZone } from "../shared/file-upload-zone"
import { PageSelector } from "./page-selector"
import { useI18n } from "@/lib/i18n/i18n-context"
import { splitPDF } from "@/lib/pdf/pdf-operations"
import { downloadMultiplePDFs, downloadAsZip, formatBytes, generateFilename } from "@/lib/pdf/file-utils"
import { getPDFInfo } from "@/lib/pdf/pdf-operations"
import { toast } from "sonner"

type DownloadMode = "individual" | "zip"

export function PdfSplit() {
    const { t } = useI18n()
    const [file, setFile] = useState<File | null>(null)
    const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set())
    const [downloadMode, setDownloadMode] = useState<DownloadMode>("zip")
    const [isProcessing, setIsProcessing] = useState(false)
    const [pageCount, setPageCount] = useState<number | null>(null)

    const handleFileSelected = async (files: File[]) => {
        const selectedFile = files[0]
        setFile(selectedFile)
        setSelectedPages(new Set())

        try {
            const info = await getPDFInfo(selectedFile)
            setPageCount(info.pageCount)
        } catch {
            toast.error(t.pdfTools.errors.fileReadError)
            setPageCount(null)
        }
    }

    const handlePageToggle = (pageNumber: number) => {
        setSelectedPages((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(pageNumber)) {
                newSet.delete(pageNumber)
            } else {
                newSet.add(pageNumber)
            }
            return newSet
        })
    }

    const handlePageRangeSelect = (start: number, end: number) => {
        setSelectedPages((prev) => {
            const newSet = new Set(prev)
            for (let i = start; i <= end; i++) {
                newSet.add(i)
            }
            return newSet
        })
    }

    const handleSelectAll = () => {
        if (!pageCount) return
        const allPages = new Set<number>()
        for (let i = 1; i <= pageCount; i++) {
            allPages.add(i)
        }
        setSelectedPages(allPages)
    }

    const handleClearSelection = () => {
        setSelectedPages(new Set())
    }

    const convertSelectionToRanges = (): [number, number][] => {
        const pages = Array.from(selectedPages).sort((a, b) => a - b)
        const ranges: [number, number][] = []

        if (pages.length === 0) return ranges

        let start = pages[0]
        let end = pages[0]

        for (let i = 1; i < pages.length; i++) {
            if (pages[i] === end + 1) {
                end = pages[i]
            } else {
                ranges.push([start, end])
                start = pages[i]
                end = pages[i]
            }
        }

        ranges.push([start, end])
        return ranges
    }

    const handleSplit = async () => {
        if (!file) {
            toast.error(t.pdfTools.errors.noFilesSelected)
            return
        }

        if (selectedPages.size === 0) {
            toast.error("Selecione pelo menos uma página")
            return
        }

        setIsProcessing(true)
        const toastId = toast.loading(t.pdfTools.split.processing)

        try {
            const ranges = convertSelectionToRanges()
            const splitPdfs = await splitPDF(file, ranges)

            const pdfFiles = splitPdfs.map((data, index) => ({
                data,
                name: generateFilename(`split-${index + 1}`),
            }))

            if (downloadMode === "zip") {
                await downloadAsZip(pdfFiles, generateFilename("split-pdfs", "zip"))
            } else {
                downloadMultiplePDFs(pdfFiles)
            }

            toast.dismiss(toastId)
            toast.success(t.pdfTools.success.split)
        } catch (error) {
            toast.dismiss(toastId)
            const errorMessage = error instanceof Error ? error.message : "Unknown error"
            toast.error(t.pdfTools.errors.processingError + ": " + errorMessage)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleReset = () => {
        setFile(null)
        setSelectedPages(new Set())
        setPageCount(null)
    }

    const getRangesText = (): string => {
        const ranges = convertSelectionToRanges()
        return ranges.map(([start, end]) => (start === end ? `${start}` : `${start}-${end}`)).join(", ")
    }

    const rangesCount = convertSelectionToRanges().length

    return (
        <TooltipProvider>
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>{t.pdfTools.split.title}</CardTitle>
                    <CardDescription>{t.pdfTools.split.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
                    {!file ? (
                        <FileUploadZone 
                            onFilesSelected={handleFileSelected} 
                            disabled={isProcessing} 
                            className="flex-1 min-h-0" 
                        />
                    ) : (
                        <>
                            {/* Top Bar: Actions + File Info */}
                            <div className="flex flex-wrap items-center gap-3 bg-background shrink-0">
                                {/* Primary Action */}
                                <Button
                                    onClick={handleSplit}
                                    disabled={isProcessing || selectedPages.size === 0}
                                    size="default"
                                    className="gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    {isProcessing ? t.pdfTools.split.processing : "Download"}
                                </Button>

                                {/* Selection Badge */}
                                <Badge variant="secondary" className="gap-1.5 py-1.5">
                                    <FileText className="h-3.5 w-3.5" />
                                    {selectedPages.size} de {pageCount ?? "?"} selecionada{selectedPages.size !== 1 ? "s" : ""}
                                </Badge>

                                {/* Separator */}
                                <div className="h-6 w-px bg-border" />

                                {/* File Pill */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center gap-1.5 bg-muted rounded-full pl-3 pr-1 py-1 max-w-[200px]">
                                            <span className="text-xs font-medium truncate">
                                                {file.name}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                                                onClick={handleReset}
                                                disabled={isProcessing}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{file.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatBytes(file.size)} • {pageCount} página{pageCount !== 1 ? "s" : ""}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>

                                {/* Spacer */}
                                <div className="flex-1" />

                                {/* Split Info - shows when pages selected */}
                                {selectedPages.size > 0 && (
                                    <>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <Scissors className="h-3.5 w-3.5 text-primary" />
                                                    <span className="font-medium">{rangesCount} arquivo{rangesCount > 1 ? "s" : ""}</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Intervalos: {getRangesText()}</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        {/* Separator */}
                                        <div className="h-6 w-px bg-border" />

                                        {/* Download Mode Toggle */}
                                        <RadioGroup
                                            value={downloadMode}
                                            onValueChange={(value) => setDownloadMode(value as DownloadMode)}
                                            className="flex gap-1"
                                        >
                                            <div className="flex items-center">
                                                <RadioGroupItem value="zip" id="zip" className="sr-only" />
                                                <Label
                                                    htmlFor="zip"
                                                    className={`cursor-pointer px-2 py-1 text-xs rounded-l-md border transition-colors ${
                                                        downloadMode === "zip"
                                                            ? "bg-primary text-primary-foreground border-primary"
                                                            : "bg-background border-border hover:bg-muted"
                                                    }`}
                                                >
                                                    ZIP
                                                </Label>
                                            </div>
                                            <div className="flex items-center">
                                                <RadioGroupItem value="individual" id="individual" className="sr-only" />
                                                <Label
                                                    htmlFor="individual"
                                                    className={`cursor-pointer px-2 py-1 text-xs rounded-r-md border-t border-b border-r transition-colors ${
                                                        downloadMode === "individual"
                                                            ? "bg-primary text-primary-foreground border-primary"
                                                            : "bg-background border-border hover:bg-muted"
                                                    }`}
                                                >
                                                    Individual
                                                </Label>
                                            </div>
                                        </RadioGroup>

                                        {/* Separator */}
                                        <div className="h-6 w-px bg-border" />
                                    </>
                                )}

                                {/* Selection Actions */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSelectAll}
                                    disabled={isProcessing}
                                >
                                    Todas
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleClearSelection}
                                    disabled={isProcessing || selectedPages.size === 0}
                                >
                                    Limpar
                                </Button>

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

                            {/* Pages Grid - fills remaining space */}
                            <Card className="flex-1 min-h-0 overflow-hidden">
                                <CardContent className="h-full p-4 overflow-auto">
                                    <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Clique para selecionar • Shift+clique para intervalo</span>
                                    </div>
                                    <PageSelector
                                        file={file}
                                        selectedPages={selectedPages}
                                        onPageToggle={handlePageToggle}
                                        onPageRangeSelect={handlePageRangeSelect}
                                        thumbnailWidth={160}
                                    />
                                </CardContent>
                            </Card>
                        </>
                    )}
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}
