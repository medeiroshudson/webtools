"use client"

import { XmlEditor } from "@/components/xml-formatter/xml-editor"
import { ToolLayout } from "@/components/layout/tool-layout"
import { ToolHeader } from "@/components/layout/tool-header"
import { useI18n } from "@/lib/i18n/i18n-context"

export function XmlFormatterClient() {
    const { t } = useI18n()

    return (
        <ToolLayout
            header={
                <ToolHeader
                    icon={
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="16 18 22 12 16 6" />
                            <polyline points="8 6 2 12 8 18" />
                        </svg>
                    }
                    title={t.xmlFormatter.title}
                    description={t.xmlFormatter.description}
                    color="teal"
                />
            }
        >
            <div className="flex-1 overflow-hidden w-full min-h-0 h-full">
                <XmlEditor />
            </div>
        </ToolLayout>
    )
}
