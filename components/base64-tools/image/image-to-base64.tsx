"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Copy, Check, Trash2, Upload, Download, Image as ImageIcon } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp", "image/svg+xml"]

export function ImageToBase64() {
    const { t } = useI18n()
    const [mode, setMode] = useState<"encode" | "decode">("decode")
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [base64Output, setBase64Output] = useState("")
    const [decodeInput, setDecodeInput] = useState("")
    const [decodePreview, setDecodePreview] = useState<string | null>(null)
    const [hasCopied, setHasCopied] = useState(false)
    const [isDragOver, setIsDragOver] = useState(false)
    const resetCopiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (resetCopiedTimeoutRef.current) {
                clearTimeout(resetCopiedTimeoutRef.current)
            }
        }
    }, [])

    // Validate image file
    const validateImageFile = (file: File): boolean => {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            toast.error(t.base64Tools.errors.invalidFileType)
            return false
        }
        if (file.size > MAX_FILE_SIZE) {
            toast.error(t.base64Tools.errors.fileTooLarge)
            return false
        }
        return true
    }

    // Handle file selection
    const handleFileSelect = (selectedFile: File) => {
        if (!validateImageFile(selectedFile)) return

        setFile(selectedFile)
        setBase64Output("")

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
            const result = e.target?.result as string
            setPreview(result)
            setBase64Output(result)
        }
        reader.onerror = () => {
            toast.error(t.base64Tools.errors.encodingError)
        }
        reader.readAsDataURL(selectedFile)
    }

    // Handle drop
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragOver(false)
        const files = e.dataTransfer.files
        if (files.length > 0) {
            handleFileSelect(files[0])
        }
    }

    // Handle drag events
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            handleFileSelect(files[0])
        }
    }

    // Decode Base64 to image
    const decode = () => {
        if (!decodeInput.trim()) {
            toast.error(t.base64Tools.errors.emptyInput)
            return
        }
        try {
            // Check if it has data URI prefix, if not add it
            let base64 = decodeInput.trim()
            if (!base64.startsWith("data:image/")) {
                // Try to detect image type from base64 or default to png
                base64 = "data:image/png;base64," + base64
            }

            // Validate by creating an image
            const img = new Image()
            img.onload = () => {
                setDecodePreview(base64)
                toast.success(t.base64Tools.common.decoded)
            }
            img.onerror = () => {
                toast.error(t.base64Tools.errors.invalidBase64)
                setDecodePreview(null)
            }
            img.src = base64
        } catch (e) {
            toast.error(t.base64Tools.errors.decodingError)
            setDecodePreview(null)
        }
    }

    // Download decoded image
    const downloadImage = () => {
        if (!decodePreview) return

        const link = document.createElement("a")
        link.href = decodePreview
        link.download = `decoded-image.${decodePreview.match(/data:image\/(\w+);/)?.[1] || "png"}`
        link.click()
    }

    // Copy to clipboard
    const copyToClipboard = () => {
        const textToCopy = mode === "encode" ? base64Output : decodeInput
        if (!textToCopy) return

        navigator.clipboard.writeText(textToCopy).then(() => {
            setHasCopied(true)
            toast.success(t.base64Tools.text.copySuccess)
            resetCopiedTimeoutRef.current = setTimeout(() => {
                setHasCopied(false)
            }, 2000)
        }).catch(() => {
            toast.error(t.base64Tools.errors.decodingError)
        })
    }

    // Clear encode mode
    const clearEncode = () => {
        setFile(null)
        setPreview(null)
        setBase64Output("")
    }

    // Clear decode mode
    const clearDecode = () => {
        setDecodeInput("")
        setDecodePreview(null)
    }

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{t.base64Tools.image.title}</CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant={mode === "encode" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setMode("encode")}
                        >
                            {t.base64Tools.image.encodeButton}
                        </Button>
                        <Button
                            variant={mode === "decode" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setMode("decode")}
                        >
                            {t.base64Tools.image.decodeButton}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 min-h-0 overflow-auto">
                {mode === "encode" ? (
                    <>
                        {/* Upload zone */}
                        {!file ? (
                            <div
                                className={cn(
                                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                                    isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                )}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                            >
                                <label className="block cursor-pointer">
                                    <input
                                        type="file"
                                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                        onChange={handleFileInputChange}
                                        className="sr-only"
                                    />
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="rounded-full bg-primary/10 p-4">
                                            <Upload className="h-8 w-8 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">{t.base64Tools.common.dragDrop}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {t.base64Tools.common.or}{" "}
                                                <span className="text-primary underline-offset-2 hover:underline">
                                                    {t.base64Tools.common.browse}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        ) : (
                            <>
                                {/* File info and preview */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <Label>{t.base64Tools.image.previewLabel}</Label>
                                        <div className="mt-2 rounded-lg border bg-muted/30 overflow-hidden flex items-center justify-center min-h-[200px]">
                                            {preview && (
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="max-w-full max-h-[300px] object-contain"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <Label>{t.base64Tools.image.fileName}</Label>
                                            <p className="text-sm text-muted-foreground mt-1">{file.name}</p>
                                        </div>
                                        <div>
                                            <Label>{t.base64Tools.image.fileSize}</Label>
                                            <p className="text-sm text-muted-foreground mt-1">{formatFileSize(file.size)}</p>
                                        </div>
                                        <Button onClick={clearEncode} variant="outline" size="sm" className="gap-2">
                                            <Trash2 className="h-4 w-4" />
                                            {t.base64Tools.image.clearButton}
                                        </Button>
                                    </div>
                                </div>

                                {/* Base64 output */}
                                <div className="flex flex-col gap-2 flex-1 min-h-0">
                                    <div className="flex items-center justify-between">
                                        <Label>{t.base64Tools.image.inputLabel}</Label>
                                        <Button
                                            onClick={copyToClipboard}
                                            variant="ghost"
                                            size="sm"
                                            disabled={!base64Output}
                                            className="gap-2 h-8"
                                        >
                                            {hasCopied ? (
                                                <>
                                                    <Check className="h-4 w-4" />
                                                    {t.base64Tools.text.copySuccess}
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-4 w-4" />
                                                    {t.base64Tools.image.copyButton}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <Textarea
                                        value={base64Output}
                                        readOnly
                                        placeholder={t.base64Tools.image.inputPlaceholder}
                                        className="flex-1 min-h-[120px] resize-none font-mono text-xs"
                                    />
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {/* Decode mode */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label>{t.base64Tools.image.inputLabel}</Label>
                                <Textarea
                                    placeholder={t.base64Tools.image.inputPlaceholder}
                                    value={decodeInput}
                                    onChange={(e) => setDecodeInput(e.target.value)}
                                    className="min-h-[120px] resize-none font-mono text-sm"
                                />
                                <div className="flex gap-2">
                                    <Button onClick={decode} variant="secondary" size="sm" disabled={!decodeInput}>
                                        {t.base64Tools.image.decodeButton}
                                    </Button>
                                    <Button onClick={clearDecode} variant="outline" size="sm" className="gap-2">
                                        <Trash2 className="h-4 w-4" />
                                        {t.base64Tools.image.clearButton}
                                    </Button>
                                    {decodePreview && (
                                        <Button onClick={downloadImage} variant="outline" size="sm" className="gap-2">
                                            <Download className="h-4 w-4" />
                                            {t.base64Tools.image.downloadButton}
                                        </Button>
                                    )}
                                    <Button
                                        onClick={copyToClipboard}
                                        variant="outline"
                                        size="sm"
                                        disabled={!decodeInput}
                                        className="gap-2 ml-auto"
                                    >
                                        {hasCopied ? (
                                            <>
                                                <Check className="h-4 w-4" />
                                                {t.base64Tools.text.copySuccess}
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" />
                                                {t.base64Tools.image.copyButton}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {decodePreview && (
                                <div className="flex flex-col gap-2">
                                    <Label>{t.base64Tools.image.previewLabel}</Label>
                                    <div className="rounded-lg border bg-muted/30 overflow-hidden flex items-center justify-center min-h-[200px]">
                                        <img
                                            src={decodePreview}
                                            alt="Decoded preview"
                                            className="max-w-full max-h-[400px] object-contain"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
