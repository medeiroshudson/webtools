import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { getPDFInfo } from "./pdf-operations"

export interface CachedDocument {
    fileId: string
    fileName: string
    fileSize: number
    objectUrl: string
    pageCount: number
    file: File
    createdAt: number
}

export interface PageReference {
    id: string
    fileId: string
    fileName: string
    pageNumber: number
}

interface PdfMergeState {
    // Document cache with stable object URLs
    documents: Map<string, CachedDocument>
    // Page references for ordering
    pages: PageReference[]
    // Processing state
    isProcessing: boolean

    // Document actions
    addDocument: (file: File) => Promise<string>
    removeDocument: (fileId: string) => void
    getObjectUrl: (fileId: string) => string | undefined
    getDocument: (fileId: string) => CachedDocument | undefined

    // Page actions
    reorderPages: (fromIndex: number, toIndex: number) => void
    removePage: (pageId: string) => void

    // Processing state
    setIsProcessing: (isProcessing: boolean) => void

    // Cleanup
    clear: () => void
}

export const usePdfMergeStore = create<PdfMergeState>()(
    devtools(
        (set, get) => ({
            documents: new Map(),
            pages: [],
            isProcessing: false,

            addDocument: async (file: File) => {
                const fileId = crypto.randomUUID()
                const objectUrl = URL.createObjectURL(file)

                try {
                    const info = await getPDFInfo(file)

                    const cachedDoc: CachedDocument = {
                        fileId,
                        fileName: file.name,
                        fileSize: file.size,
                        objectUrl,
                        pageCount: info.pageCount,
                        file,
                        createdAt: Date.now(),
                    }

                    // Create page references for all pages
                    const newPages: PageReference[] = []
                    for (let pageNum = 1; pageNum <= info.pageCount; pageNum++) {
                        newPages.push({
                            id: `${fileId}-page-${pageNum}`,
                            fileId,
                            fileName: file.name,
                            pageNumber: pageNum,
                        })
                    }

                    set((state) => {
                        const newDocuments = new Map(state.documents)
                        newDocuments.set(fileId, cachedDoc)
                        return {
                            documents: newDocuments,
                            pages: [...state.pages, ...newPages],
                        }
                    })

                    return fileId
                } catch (error) {
                    // Clean up object URL on error
                    URL.revokeObjectURL(objectUrl)
                    throw error
                }
            },

            removeDocument: (fileId: string) => {
                const doc = get().documents.get(fileId)
                if (doc) {
                    URL.revokeObjectURL(doc.objectUrl)
                }

                set((state) => {
                    const newDocuments = new Map(state.documents)
                    newDocuments.delete(fileId)
                    return {
                        documents: newDocuments,
                        pages: state.pages.filter((p) => p.fileId !== fileId),
                    }
                })
            },

            getObjectUrl: (fileId: string) => {
                return get().documents.get(fileId)?.objectUrl
            },

            getDocument: (fileId: string) => {
                return get().documents.get(fileId)
            },

            reorderPages: (fromIndex: number, toIndex: number) => {
                set((state) => {
                    const newPages = [...state.pages]
                    const [removed] = newPages.splice(fromIndex, 1)
                    newPages.splice(toIndex, 0, removed)
                    return { pages: newPages }
                })
            },

            removePage: (pageId: string) => {
                set((state) => ({
                    pages: state.pages.filter((p) => p.id !== pageId),
                }))
            },

            setIsProcessing: (isProcessing: boolean) => {
                set({ isProcessing })
            },

            clear: () => {
                // Clean up all object URLs
                get().documents.forEach((doc) => {
                    URL.revokeObjectURL(doc.objectUrl)
                })

                set({
                    documents: new Map(),
                    pages: [],
                    isProcessing: false,
                })
            },
        }),
        { name: "pdf-merge-store" }
    )
)
