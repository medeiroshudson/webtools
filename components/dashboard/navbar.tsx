"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileJson, StickyNote, Home, FileType, Merge, Split, Minimize2, ChevronDown, FileCode, Hash, FileText, Image } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/i18n-context"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
    const pathname = usePathname()
    const { locale, setLocale, t } = useI18n()

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/"
        return pathname?.startsWith(path)
    }

    return (
        <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-14 items-center gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 shrink-0">
                        <span className="font-bold text-lg md:text-xl">WebTools</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-1 md:gap-2 text-sm font-medium flex-1 overflow-x-auto overflow-y-hidden">
                        <Link
                            href="/"
                            className={cn(
                                "flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-md transition-colors shrink-0",
                                isActive("/") && pathname === "/"
                                    ? "bg-secondary text-foreground"
                                    : "text-foreground/60 hover:text-foreground hover:bg-secondary/50"
                            )}
                        >
                            <Home className="h-4 w-4 shrink-0" />
                            <span className="hidden sm:inline">{t.common.home}</span>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className={cn(
                                        "flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-md transition-colors shrink-0",
                                        isActive("/pdf-tools")
                                            ? "bg-secondary text-foreground"
                                            : "text-foreground/60 hover:text-foreground hover:bg-secondary/50"
                                    )}
                                >
                                    <FileType className="h-4 w-4 shrink-0" />
                                    <span className="hidden sm:inline">{t.common.pdfTools}</span>
                                    <span className="sm:hidden">{t.common.pdfTools}</span>
                                    <ChevronDown className="h-3 w-3 opacity-50 shrink-0" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem asChild>
                                    <Link href="/pdf-tools?tab=merge" className="flex items-center gap-2 cursor-pointer">
                                        <Merge className="h-4 w-4" />
                                        {t.pdfTools.tabs.merge}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/pdf-tools?tab=split" className="flex items-center gap-2 cursor-pointer">
                                        <Split className="h-4 w-4" />
                                        {t.pdfTools.tabs.split}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/pdf-tools?tab=compress" className="flex items-center gap-2 cursor-pointer">
                                        <Minimize2 className="h-4 w-4" />
                                        {t.pdfTools.tabs.compress}
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className={cn(
                                        "flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-md transition-colors shrink-0",
                                        isActive("/base64-tools")
                                            ? "bg-secondary text-foreground"
                                            : "text-foreground/60 hover:text-foreground hover:bg-secondary/50"
                                    )}
                                >
                                    <Hash className="h-4 w-4 shrink-0" />
                                    <span className="hidden sm:inline">{t.common.base64Tools}</span>
                                    <span className="sm:hidden">{t.common.base64Tools}</span>
                                    <ChevronDown className="h-3 w-3 opacity-50 shrink-0" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem asChild>
                                    <Link href="/base64-tools/text" className="flex items-center gap-2 cursor-pointer">
                                        <FileText className="h-4 w-4" />
                                        {t.base64Tools.tabs.text}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/base64-tools/image" className="flex items-center gap-2 cursor-pointer">
                                        <Image className="h-4 w-4" />
                                        {t.base64Tools.tabs.image}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/base64-tools/pdf" className="flex items-center gap-2 cursor-pointer">
                                        <FileText className="h-4 w-4" />
                                        {t.base64Tools.tabs.pdf}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/base64-tools/file" className="flex items-center gap-2 cursor-pointer">
                                        <FileJson className="h-4 w-4" />
                                        {t.base64Tools.tabs.file}
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Link
                            href="/json-formatter"
                            className={cn(
                                "flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-md transition-colors shrink-0",
                                isActive("/json-formatter")
                                    ? "bg-secondary text-foreground"
                                    : "text-foreground/60 hover:text-foreground hover:bg-secondary/50"
                            )}
                        >
                            <FileJson className="h-4 w-4 shrink-0" />
                            <span className="hidden sm:inline">JSON</span>
                            <span className="sm:hidden">JSON</span>
                        </Link>
                        <Link
                            href="/xml-formatter"
                            className={cn(
                                "flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-md transition-colors shrink-0",
                                isActive("/xml-formatter")
                                    ? "bg-secondary text-foreground"
                                    : "text-foreground/60 hover:text-foreground hover:bg-secondary/50"
                            )}
                        >
                            <FileCode className="h-4 w-4 shrink-0" />
                            <span className="hidden sm:inline">XML</span>
                            <span className="sm:hidden">XML</span>
                        </Link>
                        <Link
                            href="/notes"
                            className={cn(
                                "flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-md transition-colors shrink-0",
                                isActive("/notes")
                                    ? "bg-secondary text-foreground"
                                    : "text-foreground/60 hover:text-foreground hover:bg-secondary/50"
                            )}
                        >
                            <StickyNote className="h-4 w-4 shrink-0" />
                            <span className="hidden sm:inline">{t.common.notes}</span>
                            <span className="sm:hidden">{t.common.notes}</span>
                        </Link>
                    </nav>

                    {/* Language selector - always aligned to the right */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-2 shrink-0">
                                <span className="hidden sm:inline">
                                    {locale === "pt-BR" ? "🇧🇷 Português" : "🇺🇸 English"}
                                </span>
                                <span className="sm:hidden">
                                    {locale === "pt-BR" ? "🇧🇷" : "🇺🇸"}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setLocale("pt-BR")}>
                                <span className={cn("flex items-center gap-2 w-full", locale === "pt-BR" && "font-bold")}>
                                    🇧🇷 Português
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLocale("en")}>
                                <span className={cn("flex items-center gap-2 w-full", locale === "en" && "font-bold")}>
                                    🇺🇸 English
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    )
}
