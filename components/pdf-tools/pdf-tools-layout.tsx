"use client"

import dynamic from "next/dynamic"
import { useSearchParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/i18n-context"
import { Merge, Split, Minimize2, Loader2 } from "lucide-react"

// Loading skeleton for PDF tools
function LoadingSkeleton() {
    return (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
    )
}

// Dynamic imports with SSR disabled for PDF tools
const PdfMerge = dynamic(
    () => import("./merge").then((mod) => ({ default: mod.PdfMerge })),
    { ssr: false, loading: LoadingSkeleton }
)

const PdfSplit = dynamic(
    () => import("./split").then((mod) => ({ default: mod.PdfSplit })),
    { ssr: false, loading: LoadingSkeleton }
)

const PdfCompress = dynamic(
    () => import("./compress").then((mod) => ({ default: mod.PdfCompress })),
    { ssr: false, loading: LoadingSkeleton }
)

type ToolTab = "merge" | "split" | "compress"

const TOOLS: Array<{
    id: ToolTab
    icon: React.ComponentType<{ className?: string }>
}> = [
    { id: "merge", icon: Merge },
    { id: "split", icon: Split },
    { id: "compress", icon: Minimize2 },
]

export function PdfToolsLayout() {
    const { t } = useI18n()
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentTab = (searchParams.get("tab") as ToolTab) || "merge"

    const setTab = (tab: ToolTab) => {
        router.push(`/pdf-tools?tab=${tab}`)
    }

    const renderTool = () => {
        switch (currentTab) {
            case "merge":
                return <PdfMerge />
            case "split":
                return <PdfSplit />
            case "compress":
                return <PdfCompress />
            default:
                return <PdfMerge />
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-6">
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
                                onClick={() => setTab(id)}
                                className="flex-1 min-w-fit"
                            >
                                <Icon className="h-4 w-4 mr-2" />
                                {t.pdfTools.tabs[id]}
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
                                onClick={() => setTab(id)}
                            >
                                <Icon className="h-4 w-4 mr-2" />
                                {t.pdfTools.tabs[id]}
                            </Button>
                        ))}
                    </nav>
                </Card>
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">{renderTool()}</div>
        </div>
    )
}
