"use client"

import { useState, useEffect } from "react"
import { FileText, ArrowRight, Minimize2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { FileUploadZone } from "../shared/file-upload-zone"
import { useI18n } from "@/lib/i18n/i18n-context"
import {
    compressPDFWithImages,
    analyzePDF,
    type CompressionLevel,
} from "@/lib/pdf/pdf-compress"
import { downloadPDF, formatBytes, generateFilename, calculateCompressionRatio } from "@/lib/pdf/file-utils"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface CompressionOption {
    level: CompressionLevel
    label: string
    description: string
    qualityLabel: string
}

export function PdfCompress() {
    const { t } = useI18n()
    const [file, setFile] = useState<File | null>(null)
    const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("medium")
    const [isProcessing, setIsProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [progressStatus, setProgressStatus] = useState("")
    const [compressedSize, setCompressedSize] = useState<number | null>(null)
    const [pdfInfo, setPdfInfo] = useState<{
        pageCount: number
        estimatedSizes: Record<CompressionLevel, number>
    } | null>(null)

    const compressionOptions: CompressionOption[] = [
        {
            level: "low",
            label: t.pdfTools.compress.levels.low,
            description: "Qualidade visual preservada",
            qualityLabel: "~85%",
        },
        {
            level: "medium",
            label: t.pdfTools.compress.levels.medium,
            description: "Bom equilíbrio qualidade/tamanho",
            qualityLabel: "~65%",
        },
        {
            level: "high",
            label: t.pdfTools.compress.levels.high,
            description: "Máxima redução de tamanho",
            qualityLabel: "~45%",
        },
    ]

    // Analyze PDF when file is selected
    useEffect(() => {
        if (file) {
            analyzePDF(file)
                .then((info) => {
                    setPdfInfo({
                        pageCount: info.pageCount,
                        estimatedSizes: info.estimatedSizes,
                    })
                })
                .catch(() => {
                    setPdfInfo(null)
                })
        } else {
            setPdfInfo(null)
        }
    }, [file])

    const handleFileSelected = (files: File[]) => {
        setFile(files[0])
        setCompressedSize(null)
        setProgress(0)
        setProgressStatus("")
    }

    const handleCompress = async () => {
        if (!file) {
            toast.error(t.pdfTools.errors.noFilesSelected)
            return
        }

        setIsProcessing(true)
        setProgress(0)
        setCompressedSize(null)

        try {
            const compressedPdf = await compressPDFWithImages(
                file,
                compressionLevel,
                (prog, status) => {
                    setProgress(prog)
                    setProgressStatus(status)
                }
            )

            setCompressedSize(compressedPdf.byteLength)

            const filename = generateFilename("compressed-pdf")
            downloadPDF(compressedPdf, filename)

            toast.success(t.pdfTools.success.compressed)
        } catch (error) {
            toast.error(
                t.pdfTools.errors.processingError + ": " + (error instanceof Error ? error.message : "Unknown error")
            )
        } finally {
            setIsProcessing(false)
            setProgress(0)
            setProgressStatus("")
        }
    }

    const handleReset = () => {
        setFile(null)
        setCompressedSize(null)
        setCompressionLevel("medium")
        setPdfInfo(null)
        setProgress(0)
        setProgressStatus("")
    }

    const compressionRatio = file && compressedSize ? calculateCompressionRatio(file.size, compressedSize) : null
    const estimatedSize = pdfInfo?.estimatedSizes[compressionLevel]
    const estimatedReduction = file && estimatedSize
        ? calculateCompressionRatio(file.size, estimatedSize)
        : null

    return (
        <TooltipProvider>
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>{t.pdfTools.compress.title}</CardTitle>
                    <CardDescription>{t.pdfTools.compress.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-6">
                    {!file ? (
                        <FileUploadZone onFilesSelected={handleFileSelected} disabled={isProcessing} />
                    ) : (
                        <>
                            {/* File Info */}
                            <Card>
                                <CardContent className="flex items-center gap-3 p-4">
                                    <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatBytes(file.size)}
                                            {pdfInfo && ` • ${pdfInfo.pageCount} página${pdfInfo.pageCount === 1 ? "" : "s"}`}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleReset} disabled={isProcessing}>
                                        {t.pdfTools.common.remove}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Compression Level Selection */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Label>{t.pdfTools.compress.levelLabel}</Label>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                            <p>A compressão converte cada página em imagem JPEG. Níveis mais altos reduzem mais o tamanho, mas também a qualidade visual.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {compressionOptions.map((option) => {
                                        const estSize = pdfInfo?.estimatedSizes[option.level]
                                        const isSelected = compressionLevel === option.level

                                        return (
                                            <button
                                                key={option.level}
                                                onClick={() => {
                                                    setCompressionLevel(option.level)
                                                    setCompressedSize(null)
                                                }}
                                                disabled={isProcessing}
                                                className={cn(
                                                    "relative flex flex-col items-center p-4 rounded-lg border transition-all text-left",
                                                    isSelected
                                                        ? "border-primary bg-primary/5"
                                                        : "border-border hover:border-primary/50",
                                                    isProcessing && "opacity-50 cursor-not-allowed"
                                                )}
                                            >
                                                <span className={cn(
                                                    "text-sm font-medium",
                                                    isSelected && "text-primary"
                                                )}>
                                                    {option.label.split(" ")[0]}
                                                </span>
                                                <span className="text-xs text-muted-foreground mt-1">
                                                    {option.description}
                                                </span>
                                                {estSize && (
                                                    <span className={cn(
                                                        "text-xs font-medium mt-2",
                                                        isSelected ? "text-primary" : "text-muted-foreground"
                                                    )}>
                                                        ~{formatBytes(estSize)}
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Size Estimation */}
                            {estimatedSize && !compressedSize && !isProcessing && (
                                <Card className="bg-muted/30">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="text-center flex-1">
                                                <p className="text-xs text-muted-foreground mb-1">Original</p>
                                                <p className="text-lg font-semibold">{formatBytes(file.size)}</p>
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                            <div className="text-center flex-1">
                                                <p className="text-xs text-muted-foreground mb-1">Estimado</p>
                                                <p className="text-lg font-semibold text-primary">~{formatBytes(estimatedSize)}</p>
                                            </div>
                                            {estimatedReduction !== null && estimatedReduction > 0 && (
                                                <div className="text-center flex-shrink-0 bg-primary/10 rounded-lg px-3 py-2">
                                                    <p className="text-xs text-primary mb-0.5">Redução</p>
                                                    <p className="text-lg font-bold text-primary">~{estimatedReduction}%</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Progress */}
                            {isProcessing && (
                                <div className="space-y-2">
                                    <Progress value={progress} className="h-2" />
                                    <p className="text-xs text-muted-foreground text-center">
                                        {progressStatus}
                                    </p>
                                </div>
                            )}

                            {/* Results */}
                            {compressedSize !== null && (
                                <Card className="bg-rose-500/10 border-rose-500/30">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="text-center flex-1">
                                                <p className="text-xs text-muted-foreground mb-1">Original</p>
                                                <p className="text-lg font-semibold">{formatBytes(file.size)}</p>
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-rose-600 flex-shrink-0" />
                                            <div className="text-center flex-1">
                                                <p className="text-xs text-muted-foreground mb-1">Comprimido</p>
                                                <p className="text-lg font-semibold text-rose-600">{formatBytes(compressedSize)}</p>
                                            </div>
                                            {compressionRatio !== null && (
                                                <div className="text-center flex-shrink-0 bg-rose-500/20 rounded-lg px-3 py-2">
                                                    <p className="text-xs text-rose-700 mb-0.5">Redução</p>
                                                    <p className="text-lg font-bold text-rose-600">
                                                        {compressionRatio > 0 ? `${compressionRatio}%` : "0%"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {compressionRatio !== null && compressionRatio <= 0 && (
                                            <p className="text-xs text-muted-foreground text-center mt-3">
                                                Este PDF já está otimizado ou contém principalmente texto.
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleCompress}
                                    disabled={isProcessing}
                                    className="flex-1"
                                >
                                    <Minimize2 className="h-4 w-4 mr-2" />
                                    {isProcessing ? t.pdfTools.compress.processing : t.pdfTools.compress.compressButton}
                                </Button>
                                <Button onClick={handleReset} variant="outline" disabled={isProcessing}>
                                    {t.pdfTools.common.reset}
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}
