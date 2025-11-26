"use client"

import { useState, useEffect } from "react"
import { renderThumbnail, hasThumbnail, getCachedThumbnail } from "./thumbnail-cache"

interface UseThumbnailResult {
    thumbnailUrl: string | null
    isLoading: boolean
    error: Error | null
}

/**
 * Hook to get a cached thumbnail for a PDF page
 * Renders the thumbnail on first request and caches it for subsequent uses
 */
export function useThumbnail(
    objectUrl: string | null,
    fileId: string,
    pageNumber: number,
    width: number
): UseThumbnailResult {
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(() => {
        // Check if already cached on initial render
        if (objectUrl && hasThumbnail(fileId, pageNumber, width)) {
            return getCachedThumbnail(fileId, pageNumber, width) ?? null
        }
        return null
    })
    const [isLoading, setIsLoading] = useState(!thumbnailUrl && !!objectUrl)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!objectUrl) {
            setThumbnailUrl(null)
            setIsLoading(false)
            return
        }

        // Check cache first
        const cached = getCachedThumbnail(fileId, pageNumber, width)
        if (cached) {
            setThumbnailUrl(cached)
            setIsLoading(false)
            return
        }

        // Render thumbnail
        let isMounted = true
        setIsLoading(true)
        setError(null)

        renderThumbnail(objectUrl, fileId, pageNumber, width)
            .then((dataUrl) => {
                if (isMounted) {
                    setThumbnailUrl(dataUrl)
                    setIsLoading(false)
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error(String(err)))
                    setIsLoading(false)
                }
            })

        return () => {
            isMounted = false
        }
    }, [objectUrl, fileId, pageNumber, width])

    return { thumbnailUrl, isLoading, error }
}
