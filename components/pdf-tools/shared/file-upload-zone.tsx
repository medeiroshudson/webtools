"use client"

import { useCallback, useState } from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/i18n-context"
import { validatePDFFile, validateFileSize, MAX_FILE_SIZE } from "@/lib/pdf/file-utils"

interface FileUploadZoneProps {
    onFilesSelected: (files: File[]) => void
    accept?: string
    multiple?: boolean
    maxSize?: number
    disabled?: boolean
    className?: string
    compact?: boolean
}

export function FileUploadZone({
    onFilesSelected,
    accept = ".pdf,application/pdf",
    multiple = false,
    maxSize = MAX_FILE_SIZE,
    disabled = false,
    className,
    compact = false,
}: FileUploadZoneProps) {
    const { t } = useI18n()
    const [isDragOver, setIsDragOver] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const validateFiles = useCallback(
        (files: FileList | null): File[] | null => {
            if (!files || files.length === 0) {
                setError(t.pdfTools.errors.noFilesSelected)
                return null
            }

            const fileArray = Array.from(files)

            // Validate each file
            for (const file of fileArray) {
                if (!validatePDFFile(file)) {
                    setError(t.pdfTools.errors.invalidFileType)
                    return null
                }

                if (!validateFileSize(file, maxSize)) {
                    setError(t.pdfTools.errors.fileSizeExceeded.replace("{size}", "50MB"))
                    return null
                }
            }

            setError(null)
            return fileArray
        },
        [maxSize, t.pdfTools.errors]
    )

    const handleDragEnter = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            e.stopPropagation()
            if (!disabled) {
                setIsDragOver(true)
            }
        },
        [disabled]
    )

    const handleDragLeave = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragOver(false)
        },
        []
    )

    const handleDragOver = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            e.stopPropagation()
        },
        []
    )

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragOver(false)

            if (disabled) return

            const files = validateFiles(e.dataTransfer.files)
            if (files) {
                onFilesSelected(files)
            }
        },
        [disabled, validateFiles, onFilesSelected]
    )

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = validateFiles(e.target.files)
            if (files) {
                onFilesSelected(files)
            }
            // Reset input value to allow selecting the same file again
            e.target.value = ""
        },
        [validateFiles, onFilesSelected]
    )

    return (
        <div className={className}>
            <Card
                className={cn(
                    "relative cursor-pointer border border-dashed transition-colors",
                    isDragOver && "border-primary bg-primary/5",
                    disabled && "cursor-not-allowed opacity-50",
                    error && "border-destructive",
                    !isDragOver && !error && "border-border hover:border-primary/50"
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <label className={cn(
                    "block text-center",
                    compact ? "p-4" : "p-8",
                    disabled && "cursor-not-allowed"
                )}>
                    <input
                        type="file"
                        accept={accept}
                        multiple={multiple}
                        onChange={handleFileInput}
                        disabled={disabled}
                        className="sr-only"
                    />
                    <div className={cn(
                        "flex items-center gap-3",
                        compact ? "flex-row justify-center" : "flex-col gap-4"
                    )}>
                        <div
                            className={cn(
                                "rounded-full bg-primary/10 transition-colors",
                                compact ? "p-2" : "p-4",
                                isDragOver && "bg-primary/20"
                            )}
                        >
                            <Upload className={cn(
                                "text-primary",
                                compact ? "h-5 w-5" : "h-8 w-8",
                                isDragOver && "scale-110 transition-transform"
                            )} />
                        </div>
                        <div className={compact ? "" : "space-y-2"}>
                            <p className={cn(
                                "font-medium",
                                compact ? "text-sm" : "text-base"
                            )}>
                                {compact ? t.pdfTools.common.browseFiles : t.pdfTools.common.dragDrop}
                            </p>
                            {!compact && (
                                <p className="text-sm text-muted-foreground">
                                    {t.pdfTools.common.or}{" "}
                                    <span className="text-primary underline-offset-2 hover:underline">
                                        {t.pdfTools.common.browseFiles}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </label>
            </Card>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>
    )
}
