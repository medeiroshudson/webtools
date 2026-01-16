"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/i18n-context"
import { FileText, Image, File, Loader2 } from "lucide-react"

// Loading skeleton for Base64 tools
function LoadingSkeleton() {
    return (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
    )
}

// Dynamic imports with SSR disabled for Base64 tools
const TextToBase64 = dynamic(
    () => import("./text").then((mod) => ({ default: mod.TextToBase64 })),
    { ssr: false, loading: LoadingSkeleton }
)

const ImageToBase64 = dynamic(
    () => import("./image").then((mod) => ({ default: mod.ImageToBase64 })),
    { ssr: false, loading: LoadingSkeleton }
)

const PdfToBase64 = dynamic(
    () => import("./pdf").then((mod) => ({ default: mod.PdfToBase64 })),
    { ssr: false, loading: LoadingSkeleton }
)

const FileToBase64 = dynamic(
    () => import("./file").then((mod) => ({ default: mod.FileToBase64 })),
    { ssr: false, loading: LoadingSkeleton }
)

type ToolTab = "text" | "image" | "pdf" | "file"

const TOOLS: Array<{
    id: ToolTab
    icon: React.ComponentType<{ className?: string }>
}> = [
    { id: "text", icon: FileText },
    { id: "image", icon: Image },
    { id: "pdf", icon: FileText },
    { id: "file", icon: File },
]

interface Base64ToolsLayoutProps {
    currentTab: ToolTab
}

export function Base64ToolsLayout({ currentTab }: Base64ToolsLayoutProps) {
    const { t } = useI18n()

    const renderTool = () => {
        switch (currentTab) {
            case "text":
                return <TextToBase64 />
            case "image":
                return <ImageToBase64 />
            case "pdf":
                return <PdfToBase64 />
            case "file":
                return <FileToBase64 />
            default:
                return <TextToBase64 />
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
            {/* Sidebar for desktop / Tabs for mobile */}
            <div className="w-full md:w-64 flex-shrink-0">
                {/* Mobile: Horizontal tabs */}
                <div className="md:hidden">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {TOOLS.map(({ id, icon: Icon }) => (
                            <Button
                                key={id}
                                variant={currentTab === id ? "default" : "outline"}
                                size="sm"
                                className="flex-1 min-w-fit whitespace-nowrap"
                                asChild
                            >
                                <Link href={`/base64-tools/${id}`}>
                                    <Icon className="h-4 w-4 mr-2" />
                                    {t.base64Tools.tabs[id]}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Desktop: Vertical sidebar */}
                <Card className="hidden md:block">
                    <nav className="p-2 space-y-1">
                        {TOOLS.map(({ id, icon: Icon }) => (
                            <Button
                                key={id}
                                variant={currentTab === id ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    currentTab === id && "bg-secondary font-medium"
                                )}
                                asChild
                            >
                                <Link href={`/base64-tools/${id}`}>
                                    <Icon className="h-4 w-4 mr-2" />
                                    {t.base64Tools.tabs[id]}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </Card>
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0 overflow-hidden">{renderTool()}</div>
        </div>
    )
}
