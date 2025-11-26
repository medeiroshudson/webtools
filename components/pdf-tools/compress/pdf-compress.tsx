"use client"

import { useState } from "react"
import { FileText, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUploadZone } from "../shared/file-upload-zone"
import { useI18n } from "@/lib/i18n/i18n-context"
import { compressPDF } from "@/lib/pdf/pdf-operations"
import { downloadPDF, formatBytes, generateFilename, calculateCompressionRatio } from "@/lib/pdf/file-utils"
import { toast } from "sonner"

type CompressionLevel = "low" | "medium" | "high"

export function PdfCompress() {
    const { t } = useI18n()
    const [file, setFile] = useState<File | null>(null)
    const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("medium")
    const [isProcessing, setIsProcessing] = useState(false)
    const [compressedSize, setCompressedSize] = useState<number | null>(null)

    const handleFileSelected = (files: File[]) => {
        setFile(files[0])
        setCompressedSize(null)
    }

    const handleCompress = async () => {
        if (!file) {
            toast.error(t.pdfTools.errors.noFilesSelected)
            return
        }

        setIsProcessing(true)
        const toastId = toast.loading(t.pdfTools.compress.processing)

        try {
            const compressedPdf = await compressPDF(file, compressionLevel)
            setCompressedSize(compressedPdf.byteLength)

            const filename = generateFilename("compressed-pdf")
            downloadPDF(compressedPdf, filename)

            toast.dismiss(toastId)
            toast.success(t.pdfTools.success.compressed)

            // Don't clear file so user can see compression stats
        } catch (error) {
            toast.dismiss(toastId)
            toast.error(
                t.pdfTools.errors.processingError + ": " + (error instanceof Error ? error.message : "Unknown error")
            )
        } finally {
            setIsProcessing(false)
        }
    }

    const handleReset = () => {
        setFile(null)
        setCompressedSize(null)
        setCompressionLevel("medium")
    }

    const compressionRatio = file && compressedSize ? calculateCompressionRatio(file.size, compressedSize) : null

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t.pdfTools.compress.title}</CardTitle>
                    <CardDescription>{t.pdfTools.compress.description}</CardDescription>
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
                                    <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleReset} disabled={isProcessing}>
                                    {t.pdfTools.common.remove}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {file && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="compression-level">{t.pdfTools.compress.levelLabel}</Label>
                                <Select
                                    value={compressionLevel}
                                    onValueChange={(value) => {
                                        setCompressionLevel(value as CompressionLevel)
                                        setCompressedSize(null) // Reset compressed size when changing level
                                    }}
                                    disabled={isProcessing}
                                >
                                    <SelectTrigger id="compression-level">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">{t.pdfTools.compress.levels.low}</SelectItem>
                                        <SelectItem value="medium">{t.pdfTools.compress.levels.medium}</SelectItem>
                                        <SelectItem value="high">{t.pdfTools.compress.levels.high}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {compressedSize !== null && (
                                <Card className="bg-muted/50">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                {t.pdfTools.compress.originalSize}:
                                            </span>
                                            <span className="text-sm font-medium">{formatBytes(file.size)}</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <ArrowDown className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                {t.pdfTools.compress.compressedSize}:
                                            </span>
                                            <span className="text-sm font-medium">{formatBytes(compressedSize)}</span>
                                        </div>
                                        {compressionRatio !== null && compressionRatio > 0 && (
                                            <div className="pt-2 border-t">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">
                                                        {t.pdfTools.compress.compressionRatio}:
                                                    </span>
                                                    <span className="text-sm font-bold text-primary">
                                                        {compressionRatio}% {t.pdfTools.common.remove.toLowerCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        {compressionRatio !== null && compressionRatio === 0 && (
                                            <div className="pt-2 border-t">
                                                <p className="text-xs text-muted-foreground text-center">
                                                    Este PDF já está otimizado ou não pode ser comprimido mais
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            <div className="flex gap-2">
                                <Button onClick={handleCompress} disabled={isProcessing} className="flex-1">
                                    {isProcessing ? t.pdfTools.compress.processing : t.pdfTools.compress.compressButton}
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
