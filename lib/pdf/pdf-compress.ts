import { pdfjs } from "./pdfjs-config"
import { PDFDocument } from "pdf-lib"

export type CompressionLevel = "low" | "medium" | "high"

interface CompressionSettings {
    imageQuality: number // JPEG quality 0-1
    scale: number // Resolution scale factor
    estimatedReduction: number // Estimated % reduction for UI
}

const COMPRESSION_SETTINGS: Record<CompressionLevel, CompressionSettings> = {
    low: {
        imageQuality: 0.85,
        scale: 1.0,
        estimatedReduction: 15,
    },
    medium: {
        imageQuality: 0.65,
        scale: 0.85,
        estimatedReduction: 40,
    },
    high: {
        imageQuality: 0.45,
        scale: 0.7,
        estimatedReduction: 60,
    },
}

/**
 * Get compression settings for a level
 */
export function getCompressionSettings(level: CompressionLevel): CompressionSettings {
    return COMPRESSION_SETTINGS[level]
}

/**
 * Estimate compressed file size based on level
 */
export function estimateCompressedSize(originalSize: number, level: CompressionLevel): number {
    const settings = COMPRESSION_SETTINGS[level]
    const estimatedSize = originalSize * (1 - settings.estimatedReduction / 100)
    return Math.round(estimatedSize)
}

/**
 * Progress callback type
 */
export type CompressionProgressCallback = (progress: number, status: string) => void

/**
 * Compress a PDF by re-rendering pages as compressed JPEG images
 * This is the most effective browser-based compression method
 */
export async function compressPDFWithImages(
    file: File,
    level: CompressionLevel,
    onProgress?: CompressionProgressCallback
): Promise<Uint8Array> {
    const settings = COMPRESSION_SETTINGS[level]

    onProgress?.(0, "Carregando PDF...")

    // Load the PDF with pdf.js for rendering
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise
    const numPages = pdfDoc.numPages

    // Create new PDF document
    const newPdf = await PDFDocument.create()

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        onProgress?.(
            Math.round(((pageNum - 1) / numPages) * 90),
            `Comprimindo página ${pageNum} de ${numPages}...`
        )

        const page = await pdfDoc.getPage(pageNum)
        const viewport = page.getViewport({ scale: settings.scale * 1.5 }) // Base scale for quality

        // Create canvas for rendering
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")!
        canvas.width = viewport.width
        canvas.height = viewport.height

        // Render page to canvas
        await page.render({
            canvasContext: context,
            viewport,
            canvas,
        }).promise

        // Convert canvas to JPEG blob
        const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob(
                (b) => resolve(b!),
                "image/jpeg",
                settings.imageQuality
            )
        })

        // Convert blob to array buffer
        const imageData = await blob.arrayBuffer()
        const image = await newPdf.embedJpg(new Uint8Array(imageData))

        // Get original page dimensions to maintain aspect ratio
        const originalViewport = page.getViewport({ scale: 1.0 })
        const pageWidth = originalViewport.width * 0.75 // Convert to points (72 dpi)
        const pageHeight = originalViewport.height * 0.75

        // Add page with the compressed image
        const newPage = newPdf.addPage([pageWidth, pageHeight])
        newPage.drawImage(image, {
            x: 0,
            y: 0,
            width: pageWidth,
            height: pageHeight,
        })
    }

    onProgress?.(95, "Finalizando PDF...")

    // Save with object streams for additional compression
    const pdfBytes = await newPdf.save({
        useObjectStreams: true,
    })

    onProgress?.(100, "Concluído!")

    // Clean up
    pdfDoc.destroy()

    return pdfBytes
}

/**
 * Analyze PDF to get info for compression estimation
 */
export async function analyzePDF(file: File): Promise<{
    pageCount: number
    fileSize: number
    hasImages: boolean
    estimatedSizes: Record<CompressionLevel, number>
}> {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise

    // Simple heuristic: PDFs with images compress better
    // We can't easily detect images without parsing, so we estimate based on size per page
    const avgSizePerPage = file.size / pdfDoc.numPages
    const hasImages = avgSizePerPage > 50000 // If avg page > 50KB, likely has images

    const result = {
        pageCount: pdfDoc.numPages,
        fileSize: file.size,
        hasImages,
        estimatedSizes: {
            low: estimateCompressedSize(file.size, "low"),
            medium: estimateCompressedSize(file.size, "medium"),
            high: estimateCompressedSize(file.size, "high"),
        },
    }

    pdfDoc.destroy()

    return result
}
