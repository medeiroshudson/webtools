"use client"

import { cn } from "@/lib/utils"

interface PdfPageSkeletonProps {
    width?: number
    className?: string
}

export function PdfPageSkeleton({ width = 120, className }: Readonly<PdfPageSkeletonProps>) {
    const height = Math.round(width * 1.4) // A4 aspect ratio approximation

    return (
        <div
            className={cn(
                "animate-pulse bg-muted rounded-lg flex items-center justify-center",
                className
            )}
            style={{ width, height }}
        >
            <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
        </div>
    )
}
