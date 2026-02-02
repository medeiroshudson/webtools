"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ToolLayout } from "@/components/layout/tool-layout"
import { ToolHeader } from "@/components/layout/tool-header"
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
    () => import("./merge/pdf-merge").then((mod) => ({ default: mod.PdfMerge })),
    { ssr: false, loading: LoadingSkeleton }
)

const PdfSplit = dynamic(
    () => import("./split/pdf-split").then((mod) => ({ default: mod.PdfSplit })),
    { ssr: false, loading: LoadingSkeleton }
)

const PdfCompress = dynamic(
    () => import("./compress/pdf-compress").then((mod) => ({ default: mod.PdfCompress })),
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

interface PdfToolsLayoutProps {
    currentTab: ToolTab
}

export function PdfToolsLayout({ currentTab }: PdfToolsLayoutProps) {
    const { t } = useI18n()

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
        <ToolLayout
            variant="tabs"
            header={
                <ToolHeader
                    icon={<svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>}
                    title={t.pdfTools.title}
                    description={t.pdfTools.description}
                    color="rose"
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
                                <Link href={`/pdf-tools/${id}`}>
                                    <Icon className="h-4 w-4 mr-2" />
                                    {t.pdfTools.tabs[id]}
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
                                <Link href={`/pdf-tools/${id}`}>
                                    <Icon className="h-4 w-4 mr-2" />
                                    {t.pdfTools.tabs[id]}
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
