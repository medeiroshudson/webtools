"use client"

import { notFound } from "next/navigation"
import { PdfToolsLayout } from "@/components/pdf-tools/pdf-tools-layout"

const VALID_TOOLS = ["merge", "split", "compress"] as const
type ToolTab = (typeof VALID_TOOLS)[number]

function isValidTool(tool: string): tool is ToolTab {
    return VALID_TOOLS.includes(tool as ToolTab)
}

export function PdfToolsClient({ tool }: { tool: string }) {
    if (!isValidTool(tool)) {
        notFound()
    }

    return <PdfToolsLayout currentTab={tool} />
}
