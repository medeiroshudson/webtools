"use client"

import { cn } from "@/lib/utils"

interface ToolLayoutProps {
    children: React.ReactNode
    header?: React.ReactNode
    className?: string
    variant?: "default" | "tabs"
}

/**
 * Unified layout component for full-height tool pages.
 * Ensures consistent spacing and height calculations across all tools.
 *
 * Spacing calculation:
 * - Navbar: ~5.5rem (88px) effective height including sticky positioning
 * - Container: h-screen ensures full viewport height
 * - Padding: pt-[5.5rem] pushes content below sticky navbar
 */
export function ToolLayout({
    children,
    header,
    className,
    variant = "default",
}: ToolLayoutProps) {
    return (
        <div
            className={cn(
                "container mx-auto flex flex-col px-4 md:px-6",
                // Height calculation: viewport minus navbar padding
                "h-[calc(100vh-5.5rem)]",
                // Consistent top padding for all pages
                "pt-[5.5rem]",
                className
            )}
        >
            {header && <div className="flex-shrink-0">{header}</div>}
            <div
                className={cn(
                    "flex-1 min-h-0 overflow-hidden",
                    variant === "tabs" && "flex flex-col md:flex-row gap-6"
                )}
            >
                {children}
            </div>
        </div>
    )
}
