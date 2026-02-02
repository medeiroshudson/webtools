"use client"

export default function Base64ToolsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="container mx-auto h-[calc(100vh-5.5rem)] flex flex-col px-4 md:px-6">
            <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
        </div>
    )
}
