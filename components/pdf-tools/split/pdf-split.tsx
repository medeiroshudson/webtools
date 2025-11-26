"use client"

import { useState } from "react"
import { FileText, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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

        // Get page count
        try {
            const info = await getPDFInfo(selectedFile)
            setPageCount(info.pageCount)
        } catch (error) {
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

        if (pages.length > 0) {
            ranges.push([start, end])
        }

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

            // Create file data for download
            const pdfFiles = splitPdfs.map((data, index) => ({
                data,
                name: generateFilename(`split-${index + 1}`),
            }))

            // Download based on selected mode
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

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t.pdfTools.split.title}</CardTitle>
                    <CardDescription>{t.pdfTools.split.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!file ? (
                        <FileUploadZone onFilesSelected={handleFileSelected} disabled={isProcessing} />
                    ) : (
                        <Card>
                            <CardContent className="flex items-center gap-3 p-4">
                                <FileText className="h-8 w-8 text-primary" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatBytes(file.size)}
                                        {pageCount !== null && ` • ${pageCount} ${t.pdfTools.common.pages.toLowerCase()}`}
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleReset} disabled={isProcessing}>
                                    {t.pdfTools.common.remove}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {file && (
                        <div className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Selecione as páginas para dividir</Label>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleSelectAll}
                                            disabled={isProcessing}
                                        >
                                            Selecionar todas
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleClearSelection}
                                            disabled={isProcessing || selectedPages.size === 0}
                                        >
                                            Limpar seleção
                                        </Button>
                                    </div>
                                </div>

                                <PageSelector
                                    file={file}
                                    selectedPages={selectedPages}
                                    onPageToggle={handlePageToggle}
                                    onPageRangeSelect={handlePageRangeSelect}
                                    thumbnailWidth={120}
                                />

                                {selectedPages.size > 0 && (
                                    <Card className="bg-muted/50">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-2">
                                                <Scissors className="h-4 w-4 mt-0.5 text-primary" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium mb-1">
                                                        {convertSelectionToRanges().length} arquivo
                                                        {convertSelectionToRanges().length > 1 ? "s" : ""} será
                                                        {convertSelectionToRanges().length > 1 ? "ão" : ""} gerado
                                                        {convertSelectionToRanges().length > 1 ? "s" : ""}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Intervalos: {getRangesText()}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>{t.pdfTools.split.downloadOptions}</Label>
                                <RadioGroup
                                    value={downloadMode}
                                    onValueChange={(value) => setDownloadMode(value as DownloadMode)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="zip" id="zip" />
                                        <Label htmlFor="zip" className="font-normal cursor-pointer">
                                            {t.pdfTools.split.downloadZip}
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="individual" id="individual" />
                                        <Label htmlFor="individual" className="font-normal cursor-pointer">
                                            {t.pdfTools.split.downloadIndividual}
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSplit}
                                    disabled={isProcessing || selectedPages.size === 0}
                                    className="flex-1"
                                >
                                    {isProcessing ? t.pdfTools.split.processing : t.pdfTools.split.splitButton}
                                </Button>
                                <Button onClick={handleReset} variant="outline" disabled={isProcessing}>
                                    {t.pdfTools.common.reset}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
