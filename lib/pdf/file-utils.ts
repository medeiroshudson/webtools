import JSZip from "jszip"

// Read from environment variables with fallback defaults
export const MAX_FILE_SIZE = parseInt(process.env.NEXT_PUBLIC_MAX_PDF_FILE_SIZE || "52428800") // 50MB default
export const MAX_TOTAL_SIZE = parseInt(process.env.NEXT_PUBLIC_MAX_PDF_TOTAL_SIZE || "104857600") // 100MB default

/**
 * Validate if a file is a PDF
 * @param file File object to validate
 * @returns true if file is a PDF
 */
export function validatePDFFile(file: File): boolean {
    return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
}

/**
 * Validate if file size is within limits
 * @param file File object to validate
 * @param maxSize Maximum allowed size in bytes (defaults to MAX_FILE_SIZE)
 * @returns true if file size is valid
 */
export function validateFileSize(file: File, maxSize: number = MAX_FILE_SIZE): boolean {
    return file.size <= maxSize
}

/**
 * Validate total size of multiple files
 * @param files Array of File objects
 * @param maxTotal Maximum total size in bytes (defaults to MAX_TOTAL_SIZE)
 * @returns true if total size is valid
 */
export function validateTotalSize(files: File[], maxTotal: number = MAX_TOTAL_SIZE): boolean {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    return totalSize <= maxTotal
}

/**
 * Parse page ranges string into array of [start, end] tuples
 * Examples: "1-5, 8, 10-15" -> [[1,5], [8,8], [10,15]]
 * @param input Page ranges string
 * @returns Array of [start, end] tuples (1-indexed)
 */
export function parsePageRanges(input: string): [number, number][] {
    if (!input || input.trim() === "") {
        throw new Error("Page ranges cannot be empty")
    }

    const ranges: [number, number][] = []
    const parts = input.split(",").map((s) => s.trim())

    for (const part of parts) {
        if (part.includes("-")) {
            const [startStr, endStr] = part.split("-").map((s) => s.trim())
            const start = parseInt(startStr)
            const end = parseInt(endStr)

            if (isNaN(start) || isNaN(end)) {
                throw new Error(`Invalid page range: "${part}"`)
            }

            if (start < 1) {
                throw new Error(`Page numbers must be greater than 0: "${part}"`)
            }

            if (end < start) {
                throw new Error(`Invalid range (end < start): "${part}"`)
            }

            ranges.push([start, end])
        } else {
            const page = parseInt(part)

            if (isNaN(page)) {
                throw new Error(`Invalid page number: "${part}"`)
            }

            if (page < 1) {
                throw new Error(`Page numbers must be greater than 0: "${part}"`)
            }

            ranges.push([page, page])
        }
    }

    return ranges
}

/**
 * Download a single PDF file
 * @param data PDF data as Uint8Array
 * @param filename Desired filename (without extension)
 */
export function downloadPDF(data: Uint8Array, filename: string): void {
    const blob = new Blob([data.buffer as ArrayBuffer], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

/**
 * Download multiple PDFs as individual files
 * @param pdfs Array of {data, name} objects
 * @param delay Delay between downloads in milliseconds (default: 100ms)
 */
export function downloadMultiplePDFs(pdfs: Array<{ data: Uint8Array; name: string }>, delay: number = 100): void {
    pdfs.forEach((pdf, index) => {
        setTimeout(() => {
            downloadPDF(pdf.data, pdf.name)
        }, index * delay)
    })
}

/**
 * Download multiple PDFs as a ZIP file
 * @param pdfs Array of {data, name} objects
 * @param zipName Name of the ZIP file (without extension)
 */
export async function downloadAsZip(pdfs: Array<{ data: Uint8Array; name: string }>, zipName: string): Promise<void> {
    const zip = new JSZip()

    // Add each PDF to the ZIP
    pdfs.forEach((pdf) => {
        const filename = pdf.name.endsWith(".pdf") ? pdf.name : `${pdf.name}.pdf`
        zip.file(filename, pdf.data)
    })

    // Generate ZIP file
    const zipBlob = await zip.generateAsync({ type: "blob" })

    // Download ZIP
    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = zipName.endsWith(".zip") ? zipName : `${zipName}.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

/**
 * Format bytes to human-readable string
 * @param bytes Number of bytes
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * Generate a timestamp-based filename
 * @param prefix Filename prefix
 * @param extension File extension (default: "pdf")
 * @returns Filename with timestamp
 */
export function generateFilename(prefix: string, extension: string = "pdf"): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)
    return `${prefix}-${timestamp}.${extension}`
}

/**
 * Calculate compression ratio
 * @param originalSize Original file size in bytes
 * @param compressedSize Compressed file size in bytes
 * @returns Compression ratio as percentage (e.g., 25 means 25% reduction)
 */
export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
    if (originalSize === 0) return 0
    const ratio = ((originalSize - compressedSize) / originalSize) * 100
    return Math.max(0, Math.round(ratio))
}
