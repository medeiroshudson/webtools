"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Base64ToolsLayout } from "@/components/base64-tools/base64-tools-layout"

const VALID_TOOLS = ["text", "image", "pdf", "file"] as const
type ToolTab = (typeof VALID_TOOLS)[number]

function isValidTool(tool: string): tool is ToolTab {
    return VALID_TOOLS.includes(tool as ToolTab)
}

export default function Base64ToolPage({
    params,
}: {
    params: Promise<{ tool: string }>
}) {
    const { tool } = use(params)

    if (!isValidTool(tool)) {
        notFound()
    }

    return <Base64ToolsLayout currentTab={tool} />
}
