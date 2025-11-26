import { PDFDocument } from "pdf-lib"

/**
 * Page selection for merging
 */
export interface PageSelection {
    file: File
    pageNumber: number // 1-indexed
}

/**
 * Merge multiple PDF files into a single PDF
 * @param files Array of PDF File objects to merge
 * @returns Merged PDF as Uint8Array
 */
export async function mergePDFs(files: File[]): Promise<Uint8Array> {
    if (files.length === 0) {
        throw new Error("No files provided for merging")
    }

    const mergedPdf = await PDFDocument.create()

    for (const file of files) {
        try {
            const arrayBuffer = await file.arrayBuffer()
            const pdf = await PDFDocument.load(arrayBuffer)
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
            copiedPages.forEach((page) => mergedPdf.addPage(page))
        } catch (error) {
            throw new Error(`Failed to merge file "${file.name}": ${error instanceof Error ? error.message : "Unknown error"}`)
        }
    }

    return await mergedPdf.save()
}

/**
 * Merge specific pages from multiple PDF files in a custom order
 * @param pageSelections Array of page selections with file and page number
 * @returns Merged PDF as Uint8Array
 */
export async function mergePDFPages(pageSelections: PageSelection[]): Promise<Uint8Array> {
    if (pageSelections.length === 0) {
        throw new Error("No pages provided for merging")
    }

    const mergedPdf = await PDFDocument.create()

    // Cache loaded PDFs to avoid reloading the same file
    const pdfCache = new Map<string, PDFDocument>()

    for (const selection of pageSelections) {
        try {
            // Get or load the PDF document
            let pdf = pdfCache.get(selection.file.name)
            if (!pdf) {
                const arrayBuffer = await selection.file.arrayBuffer()
                pdf = await PDFDocument.load(arrayBuffer)
                pdfCache.set(selection.file.name, pdf)
            }

            // Copy the specific page (convert 1-indexed to 0-indexed)
            const pageIndex = selection.pageNumber - 1
            const [copiedPage] = await mergedPdf.copyPages(pdf, [pageIndex])
            mergedPdf.addPage(copiedPage)
        } catch (error) {
            throw new Error(
                `Failed to add page ${selection.pageNumber} from "${selection.file.name}": ${error instanceof Error ? error.message : "Unknown error"}`
            )
        }
    }

    return await mergedPdf.save()
}

/**
 * Split a PDF into multiple PDFs based on page ranges
 * @param file PDF File object to split
 * @param pageRanges Array of [start, end] page number tuples (1-indexed)
 * @returns Array of split PDFs as Uint8Array
 */
export async function splitPDF(file: File, pageRanges: [number, number][]): Promise<Uint8Array[]> {
    if (pageRanges.length === 0) {
        throw new Error("No page ranges provided for splitting")
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const totalPages = pdf.getPageCount()

    // Validate page ranges
    for (const [start, end] of pageRanges) {
        if (start < 1 || end < start || end > totalPages) {
            throw new Error(`Invalid page range: ${start}-${end}. PDF has ${totalPages} pages.`)
        }
    }

    const splitPdfs: Uint8Array[] = []

    for (const [start, end] of pageRanges) {
        try {
            const newPdf = await PDFDocument.create()
            const pageIndices = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i)
            const pages = await newPdf.copyPages(pdf, pageIndices)
            pages.forEach((page) => newPdf.addPage(page))
            splitPdfs.push(await newPdf.save())
        } catch (error) {
            throw new Error(
                `Failed to extract pages ${start}-${end}: ${error instanceof Error ? error.message : "Unknown error"}`
            )
        }
    }

    return splitPdfs
}

/**
 * Compress a PDF by removing metadata and optimizing structure
 * @param file PDF File object to compress
 * @param level Compression level: 'low', 'medium', or 'high'
 * @returns Compressed PDF as Uint8Array
 */
export async function compressPDF(file: File, level: "low" | "medium" | "high" = "medium"): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)

    // Remove metadata to reduce size
    pdf.setTitle("")
    pdf.setAuthor("")
    pdf.setSubject("")
    pdf.setCreator("")
    pdf.setProducer("")
    pdf.setKeywords([])
    pdf.setCreationDate(new Date(0))
    pdf.setModificationDate(new Date(0))

    // Save options based on compression level
    const saveOptions =
        level === "high"
            ? {
                  useObjectStreams: false,
                  addDefaultPage: false,
              }
            : level === "medium"
              ? {
                    useObjectStreams: true,
                    addDefaultPage: false,
                }
              : {
                    useObjectStreams: true,
                    addDefaultPage: false,
                }

    return await pdf.save(saveOptions)
}

/**
 * Get PDF metadata and page count
 * @param file PDF File object
 * @returns Object with page count and file size
 */
export async function getPDFInfo(file: File): Promise<{ pageCount: number; fileSize: number }> {
    try {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        return {
            pageCount: pdf.getPageCount(),
            fileSize: file.size,
        }
    } catch (error) {
        throw new Error(`Failed to read PDF info: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
}
