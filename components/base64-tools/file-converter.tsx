"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Copy, Check, Trash2, Upload, Download, File } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// MIME type mapping by extension
const MIME_TYPES: Record<string, string> = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".bmp": "image/bmp",
    ".zip": "application/zip",
    ".txt": "text/plain",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".json": "application/json",
    ".xml": "application/xml",
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
    ".wav": "audio/wav",
}

// Get MIME type from filename
const getMimeTypeFromFileName = (filename: string): string => {
    const ext = filename.toLowerCase().substring(filename.lastIndexOf("."))
    return MIME_TYPES[ext] || "application/octet-stream"
}

// File type options
const FILE_TYPES = [
    { value: "any", label: "Qualquer arquivo", mimeType: "", extensions: "*" },
    { value: "pdf", label: "PDF (.pdf)", mimeType: "application/pdf", extensions: ".pdf" },
    { value: "image", label: "Imagem (.jpg, .png, .gif, .webp)", mimeType: "image/", extensions: ".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp" },
    { value: "zip", label: "ZIP (.zip)", mimeType: "application/zip", extensions: ".zip" },
    { value: "txt", label: "Texto (.txt)", mimeType: "text/plain", extensions: ".txt" },
    { value: "doc", label: "Documento Word (.doc, .docx)", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", extensions: ".doc,.docx" },
    { value: "xls", label: "Planilha Excel (.xls, .xlsx)", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", extensions: ".xls,.xlsx" },
    { value: "ppt", label: "Apresentação PowerPoint (.ppt, .pptx)", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", extensions: ".ppt,.pptx" },
]

export function FileConverter() {
    const { t } = useI18n()
    const [mode, setMode] = useState<"encode" | "decode">("decode")
    const [selectedFileType, setSelectedFileType] = useState("any")
    const [file, setFile] = useState<File | null>(null)
    const [base64Output, setBase64Output] = useState("")
    const [decodeInput, setDecodeInput] = useState("")
    const [fileName, setFileName] = useState("")
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

    const getSelectedTypeInfo = () => FILE_TYPES.find(t => t.value === selectedFileType) || FILE_TYPES[0]

    // Validate file size
    const validateFileSize = (file: File): boolean => {
        if (file.size > MAX_FILE_SIZE) {
            toast.error(t.base64Tools.errors.fileTooLarge)
            return false
        }
        return true
    }

    // Validate file type
    const validateFileType = (file: File): boolean => {
        const typeInfo = getSelectedTypeInfo()
        if (typeInfo.value === "any") return true
        
        if (typeInfo.value === "image") {
            if (!file.type.startsWith("image/")) {
                toast.error(t.base64Tools.errors.invalidFileType)
                return false
            }
        } else if (typeInfo.mimeType && file.type !== typeInfo.mimeType) {
            toast.error(t.base64Tools.errors.invalidFileType)
            return false
        }
        
        return true
    }

    // Handle file selection
    const handleFileSelect = (selectedFile: File) => {
        if (!validateFileSize(selectedFile)) return
        if (!validateFileType(selectedFile)) return

        setFile(selectedFile)
        setBase64Output("")

        // Read file as Base64
        const reader = new FileReader()
        reader.onload = (e) => {
            const result = e.target?.result as string
            setBase64Output(result)
            toast.success(t.base64Tools.common.encoded)
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

    // Decode Base64 to file
    const decode = () => {
        if (!decodeInput.trim()) {
            toast.error(t.base64Tools.errors.emptyInput)
            return
        }
        if (!fileName.trim()) {
            toast.error(t.base64Tools.errors.noFile)
            return
        }
        try {
            let base64 = decodeInput.trim()

            // Remove data URI prefix if present
            if (base64.includes(",")) {
                base64 = base64.split(",")[1]
            }

            // Try to decode to validate
            atob(base64)
            toast.success(t.base64Tools.common.decoded)
        } catch (e) {
            toast.error(t.base64Tools.errors.invalidBase64)
        }
    }

    // Get extension from selected file type
    const getExtensionFromFileType = (): string => {
        const typeInfo = getSelectedTypeInfo()
        console.log("Selected type:", selectedFileType)
        console.log("Type info:", typeInfo)
        if (typeInfo.value === "any") return ""
        if (typeInfo.value === "image") return ".png"
        return typeInfo.extensions.split(",")[0]
    }

    // Download decoded file
    const downloadFile = () => {
        if (!decodeInput.trim() || !fileName.trim()) return

        try {
            let base64 = decodeInput.trim()

            // Remove data URI prefix if present to get raw base64
            if (base64.includes(",")) {
                base64 = base64.split(",")[1]
            }

            // Decode base64 to binary
            const byteCharacters = atob(base64)
            const byteNumbers = new Array(byteCharacters.length)
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            const byteArray = new Uint8Array(byteNumbers)

            // Ensure filename has extension
            let downloadFileName = fileName.trim()
            
            // DEBUG
            alert("Filename: " + downloadFileName + "\nSelected type: " + selectedFileType)
            
            if (!downloadFileName.includes(".")) {
                const extension = getExtensionFromFileType()
                alert("Extension found: " + extension)
                if (extension) {
                    downloadFileName += extension
                    alert("New filename: " + downloadFileName)
                }
            } else {
                alert("Filename already has extension")
            }

            // Get MIME type from filename
            const mimeType = getMimeTypeFromFileName(downloadFileName)

            // Create blob with correct MIME type and download
            const blob = new Blob([byteArray], { type: mimeType })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = downloadFileName
            link.click()
            URL.revokeObjectURL(url)
        } catch (e) {
            toast.error(t.base64Tools.errors.decodingError)
        }
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
        setBase64Output("")
    }

    // Clear decode mode
    const clearDecode = () => {
        setDecodeInput("")
        setFileName("")
    }

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
    }

    const getAcceptedFileTypes = () => {
        const typeInfo = getSelectedTypeInfo()
        if (typeInfo.value === "any") return ""
        if (typeInfo.value === "image") return "image/*"
        return typeInfo.mimeType
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="shrink-0">
                <div className="flex items-center justify-between">
                    <CardTitle>{t.base64Tools.file.title}</CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant={mode === "encode" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setMode("encode")}
                        >
                            {t.base64Tools.file.encodeButton}
                        </Button>
                        <Button
                            variant={mode === "decode" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setMode("decode")}
                        >
                            {t.base64Tools.file.decodeButton}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden">
                {/* File type selector */}
                <div className="flex flex-col gap-2 shrink-0">
                    <Label>{t.base64Tools.file.fileType}</Label>
                    <Select value={selectedFileType} onValueChange={setSelectedFileType}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {FILE_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {mode === "encode" ? (
                    <>
                        {/* Upload zone */}
                        {!file ? (
                            <div
                                className={cn(
                                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors shrink-0",
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
                                        onChange={handleFileInputChange}
                                        className="sr-only"
                                        accept={getAcceptedFileTypes()}
                                    />
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="rounded-full bg-primary/10 p-4">
                                            <Upload className="h-8 w-8 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">{t.base64Tools.file.uploadPrompt}</p>
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
                                {/* File info */}
                                <div className="flex items-center gap-4 p-4 rounded-lg border-2 bg-muted/30 shrink-0">
                                    <div className="rounded-full bg-primary/10 p-3">
                                        <File className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{file.name}</p>
                                        <div className="flex gap-3 text-sm text-muted-foreground">
                                            <span>{file.type || t.base64Tools.file.fileType}</span>
                                            <span>{formatFileSize(file.size)}</span>
                                        </div>
                                    </div>
                                    <Button onClick={clearEncode} variant="outline" size="sm" className="gap-2">
                                        <Trash2 className="h-4 w-4" />
                                        {t.base64Tools.file.clearButton}
                                    </Button>
                                </div>
                            </>
                        )}

                        {/* Base64 output - scrollable area */}
                        <div className="flex flex-col gap-2 flex-1 min-h-0">
                            <div className="flex items-center justify-between shrink-0">
                                <Label>{t.base64Tools.file.inputLabel}</Label>
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
                                            {t.base64Tools.file.copyButton}
                                        </>
                                    )}
                                </Button>
                            </div>
                            <Textarea
                                value={base64Output}
                                readOnly
                                placeholder={t.base64Tools.file.inputPlaceholder}
                                className="flex-1 min-h-0 resize-none font-mono text-xs overflow-auto"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        {/* Decode mode - fixed layout with scrollable textarea */}
                        <div className="flex flex-col gap-4 flex-1 min-h-0">
                            {/* Filename input */}
                            <div className="flex flex-col gap-2 shrink-0">
                                <Label htmlFor="filename">{t.base64Tools.file.fileName}</Label>
                                <Input
                                    id="filename"
                                    placeholder={t.base64Tools.file.fileNamePlaceholder}
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    className="font-mono text-sm"
                                />
                            </div>

                            {/* Base64 input - scrollable area */}
                            <div className="flex flex-col gap-2 flex-1 min-h-0">
                                <Label>{t.base64Tools.file.inputLabel}</Label>
                                <Textarea
                                    placeholder={t.base64Tools.file.inputPlaceholder}
                                    value={decodeInput}
                                    onChange={(e) => setDecodeInput(e.target.value)}
                                    className="flex-1 min-h-0 resize-none font-mono text-sm overflow-auto"
                                />
                            </div>

                            {/* Action buttons - always visible at bottom */}
                            <div className="flex gap-2 flex-wrap shrink-0 pt-2 border-t">
                                <Button onClick={decode} variant="secondary" size="sm" disabled={!decodeInput || !fileName}>
                                    {t.base64Tools.file.decodeButton}
                                </Button>
                                <Button onClick={clearDecode} variant="outline" size="sm" className="gap-2">
                                    <Trash2 className="h-4 w-4" />
                                    {t.base64Tools.file.clearButton}
                                </Button>
                                <Button
                                    onClick={downloadFile}
                                    variant="outline"
                                    size="sm"
                                    disabled={!decodeInput || !fileName}
                                    className="gap-2 ml-auto"
                                >
                                    <Download className="h-4 w-4" />
                                    {t.base64Tools.file.downloadButton}
                                </Button>
                                <Button
                                    onClick={copyToClipboard}
                                    variant="outline"
                                    size="sm"
                                    disabled={!decodeInput}
                                    className="gap-2"
                                >
                                    {hasCopied ? (
                                        <>
                                            <Check className="h-4 w-4" />
                                            {t.base64Tools.text.copySuccess}
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4" />
                                            {t.base64Tools.file.copyButton}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
