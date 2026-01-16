"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileJson, StickyNote, Home, FileType, Merge, Split, Minimize2, ChevronDown, FileCode } from "lucide-react"
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
            <div className="container flex h-14 items-center justify-between px-4">
                <div className="flex items-center">
                    <Link href="/" className="mr-4 md:mr-8 flex items-center space-x-2">
                        <span className="font-bold text-lg md:text-xl">WebTools</span>
                    </Link>
                    <nav className="flex items-center space-x-1 md:space-x-2 text-sm font-medium">
                    <Link
                        href="/"
                        className={cn(
                            "flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-md transition-colors",
                            isActive("/") && pathname === "/"
                                ? "bg-secondary text-foreground"
                                : "text-foreground/60 hover:text-foreground hover:bg-secondary/50"
                        )}
                    >
                        <Home className="h-4 w-4" />
                        <span className="hidden sm:inline">{t.common.home}</span>
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className={cn(
                                    "flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-md transition-colors",
                                    isActive("/pdf-tools")
                                        ? "bg-secondary text-foreground"
                                        : "text-foreground/60 hover:text-foreground hover:bg-secondary/50"
                                )}
                            >
                                <FileType className="h-4 w-4" />
                                <span className="hidden sm:inline">{t.common.pdfTools}</span>
                                <span className="sm:hidden">{t.common.pdfTools}</span>
                                <ChevronDown className="h-3 w-3 opacity-50" />
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
                    <Link
                        href="/json-formatter"
                        className={cn(
                            "flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-md transition-colors",
                            isActive("/json-formatter")
                                ? "bg-secondary text-foreground"
                                : "text-foreground/60 hover:text-foreground hover:bg-secondary/50"
                        )}
                    >
                        <FileJson className="h-4 w-4" />
                        <span className="hidden sm:inline">JSON</span>
                        <span className="sm:hidden">JSON</span>
                    </Link>
                    <Link
                        href="/xml-formatter"
                        className={cn(
                            "flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-md transition-colors",
                            isActive("/xml-formatter")
                                ? "bg-secondary text-foreground"
                                : "text-foreground/60 hover:text-foreground hover:bg-secondary/50"
                        )}
                    >
                        <FileCode className="h-4 w-4" />
                        <span className="hidden sm:inline">XML</span>
                        <span className="sm:hidden">XML</span>
                    </Link>
                    <Link
                        href="/notes"
                        className={cn(
                            "flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-md transition-colors",
                            isActive("/notes")
                                ? "bg-secondary text-foreground"
                                : "text-foreground/60 hover:text-foreground hover:bg-secondary/50"
                        )}
                    >
                        <StickyNote className="h-4 w-4" />
                        <span className="hidden sm:inline">{t.common.notes}</span>
                        <span className="sm:hidden">{t.common.notes}</span>
                    </Link>
                </nav>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2">
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
        </nav>
    )
}
