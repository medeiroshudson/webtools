import * as pdfjs from "pdfjs-dist"

// Configure worker
if (globalThis.window !== undefined) {
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf-worker/pdf.worker.min.mjs"
}

// Cache for rendered thumbnails
const thumbnailCache = new Map<string, string>()

// Cache for loaded PDF documents
const documentCache = new Map<string, pdfjs.PDFDocumentProxy>()

/**
 * Generate a cache key for a thumbnail
 */
function getCacheKey(fileId: string, pageNumber: number, width: number): string {
    return `${fileId}-${pageNumber}-${width}`
}

/**
 * Get or create a PDF document from object URL
 */
async function getDocument(objectUrl: string, fileId: string): Promise<pdfjs.PDFDocumentProxy> {
    if (documentCache.has(fileId)) {
        return documentCache.get(fileId)!
    }

    const loadingTask = pdfjs.getDocument(objectUrl)
    const pdf = await loadingTask.promise
    documentCache.set(fileId, pdf)
    return pdf
}

/**
 * Render a PDF page to a data URL
 */
export async function renderThumbnail(
    objectUrl: string,
    fileId: string,
    pageNumber: number,
    width: number
): Promise<string> {
    const cacheKey = getCacheKey(fileId, pageNumber, width)

    // Return cached thumbnail if available
    if (thumbnailCache.has(cacheKey)) {
        return thumbnailCache.get(cacheKey)!
    }

    try {
        const pdf = await getDocument(objectUrl, fileId)
        const page = await pdf.getPage(pageNumber)

        // Calculate scale to achieve desired width
        const viewport = page.getViewport({ scale: 1 })
        const scale = width / viewport.width
        const scaledViewport = page.getViewport({ scale })

        // Create canvas
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")!
        canvas.width = scaledViewport.width
        canvas.height = scaledViewport.height

        // Render page to canvas
        await page.render({
            canvasContext: context,
            viewport: scaledViewport,
            canvas,
        }).promise

        // Convert to data URL
        const dataUrl = canvas.toDataURL("image/png")
        thumbnailCache.set(cacheKey, dataUrl)

        return dataUrl
    } catch (error) {
        console.error("Failed to render thumbnail:", error)
        throw error
    }
}

/**
 * Clear thumbnails for a specific document
 */
export function clearDocumentThumbnails(fileId: string): void {
    // Clear thumbnails
    for (const key of thumbnailCache.keys()) {
        if (key.startsWith(`${fileId}-`)) {
            thumbnailCache.delete(key)
        }
    }

    // Destroy and remove document from cache
    const doc = documentCache.get(fileId)
    if (doc) {
        doc.destroy()
        documentCache.delete(fileId)
    }
}

/**
 * Clear all cached thumbnails and documents
 */
export function clearAllThumbnails(): void {
    thumbnailCache.clear()

    for (const doc of documentCache.values()) {
        doc.destroy()
    }
    documentCache.clear()
}

/**
 * Check if a thumbnail is cached
 */
export function hasThumbnail(fileId: string, pageNumber: number, width: number): boolean {
    return thumbnailCache.has(getCacheKey(fileId, pageNumber, width))
}

/**
 * Get a cached thumbnail if available
 */
export function getCachedThumbnail(fileId: string, pageNumber: number, width: number): string | undefined {
    return thumbnailCache.get(getCacheKey(fileId, pageNumber, width))
}
