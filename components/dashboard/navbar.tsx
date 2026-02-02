"use client"

import { useEffect, useState } from "react"
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
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/"
        return pathname?.startsWith(path)
    }

    const isHomePage = pathname === "/"

    return (
        <div className="navbar-container">
            <nav className={cn("navbar", isScrolled || !isHomePage ? "navbar-scrolled" : "navbar-transparent")}>
                {/* Logo */}
                <Link href="/" className="navbar-logo flex items-center gap-2 shrink-0">
                    <span className="font-bold text-lg">WebTools</span>
                </Link>

                {/* Navigation - centered */}
                <nav className="flex items-center justify-center gap-2 flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide">
                    <Link
                        href="/"
                        className={cn(
                            "navbar-link shrink-0",
                            isActive("/") && pathname === "/" ? "active" : ""
                        )}
                    >
                        <Home className="h-4 w-4 shrink-0" />
                        <span className="hidden sm:inline">{t.common.home}</span>
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className={cn(
                                    "navbar-link shrink-0",
                                    isActive("/pdf-tools") ? "active" : ""
                                )}
                            >
                                <FileType className="h-4 w-4 shrink-0" />
                                <span className="hidden sm:inline">{t.common.pdfTools}</span>
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
                                    "navbar-link shrink-0",
                                    isActive("/base64-tools") ? "active" : ""
                                )}
                            >
                                <Hash className="h-4 w-4 shrink-0" />
                                <span className="hidden sm:inline">{t.common.base64Tools}</span>
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
                            "navbar-link shrink-0",
                            isActive("/json-formatter") ? "active" : ""
                        )}
                    >
                        <FileJson className="h-4 w-4 shrink-0" />
                        <span>JSON</span>
                    </Link>
                    <Link
                        href="/xml-formatter"
                        className={cn(
                            "navbar-link shrink-0",
                            isActive("/xml-formatter") ? "active" : ""
                        )}
                    >
                        <FileCode className="h-4 w-4 shrink-0" />
                        <span>XML</span>
                    </Link>
                    <Link
                        href="/notes"
                        className={cn(
                            "navbar-link shrink-0",
                            isActive("/notes") ? "active" : ""
                        )}
                    >
                        <StickyNote className="h-4 w-4 shrink-0" />
                        <span className="hidden sm:inline">{t.common.notes}</span>
                    </Link>
                </nav>

                {/* Language selector */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2 shrink-0 hover:bg-secondary/50">
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
            </nav>
        </div>
    )
}
