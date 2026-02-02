"use client"

import { JsonEditor } from "@/components/json-formatter/json-editor"
import { ToolLayout } from "@/components/layout/tool-layout"
import { ToolHeader } from "@/components/layout/tool-header"
import { useI18n } from "@/lib/i18n/i18n-context"
import { Braces } from "lucide-react"

export function JsonFormatterClient() {
    const { t } = useI18n()

    return (
        <ToolLayout
            header={
                <ToolHeader
                    icon={<Braces className="h-6 w-6" />}
                    title={t.jsonFormatter.title}
                    description={t.jsonFormatter.description}
                    color="amber"
                />
            }
        >
            <div className="flex-1 overflow-hidden w-full min-h-0 h-full">
                <JsonEditor />
            </div>
        </ToolLayout>
    )
}
