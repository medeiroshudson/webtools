"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ToolLayout } from "@/components/layout/tool-layout"
import { ToolHeader } from "@/components/layout/tool-header"
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
    () => import("./text/text-to-base64").then((mod) => ({ default: mod.TextToBase64 })),
    { ssr: false, loading: LoadingSkeleton }
)

const ImageToBase64 = dynamic(
    () => import("./image/image-to-base64").then((mod) => ({ default: mod.ImageToBase64 })),
    { ssr: false, loading: LoadingSkeleton }
)

const FileConverter = dynamic(
    () => import("./file-converter").then((mod) => ({ default: mod.FileConverter })),
    { ssr: false, loading: LoadingSkeleton }
)

type ToolTab = "text" | "image" | "file"

const TOOLS: Array<{
    id: ToolTab
    icon: React.ComponentType<{ className?: string }>
}> = [
    { id: "text", icon: FileText },
    { id: "image", icon: Image },
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
            case "file":
                return <FileConverter />
            default:
                return <TextToBase64 />
        }
    }

    return (
        <ToolLayout
            variant="tabs"
            header={
                <ToolHeader
                    icon={
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="14 2 14 8 20 8" />
                            <path d="M8 16.5a3.5 3.5 0 0 1 3.5-3.5H14" />
                            <path d="M14 16.5a3.5 3.5 0 0 0 3.5-3.5V10" />
                            <path d="M8 16.5v2a3.5 3.5 0 0 0 3.5 3.5H14" />
                            <path d="M14 16.5h2a3.5 3.5 0 0 0 3.5-3.5" />
                            <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" />
                        </svg>
                    }
                    title={t.base64Tools.title}
                    description={t.base64Tools.description}
                    color="indigo"
                />
            }
        >
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
            <div className="flex-1 min-w-0 overflow-hidden h-full">{renderTool()}</div>
        </ToolLayout>
    )
}
