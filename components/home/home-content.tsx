"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    FileJson,
    StickyNote,
    FileType,
    ArrowRight,
    Merge,
    Split,
    Minimize2,
    Zap,
    Shield,
    Globe,
    FileCode,
} from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"

const TOOLS = [
    {
        id: "json-formatter",
        href: "/json-formatter",
        icon: FileJson,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        hoverBg: "group-hover:bg-amber-500",
    },
    {
        id: "notes",
        href: "/notes",
        icon: StickyNote,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        hoverBg: "group-hover:bg-emerald-500",
    },
    {
        id: "pdf-tools",
        href: "/pdf-tools",
        icon: FileType,
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
        hoverBg: "group-hover:bg-rose-500",
    },
]

const PDF_SUB_TOOLS = [
    { id: "merge", href: "/pdf-tools/merge", icon: Merge },
    { id: "split", href: "/pdf-tools/split", icon: Split },
    { id: "compress", href: "/pdf-tools/compress", icon: Minimize2 },
]

const FEATURES = [
    {
        icon: Zap,
        titleKey: "fast" as const,
        descKey: "fastDesc" as const,
    },
    {
        icon: Shield,
        titleKey: "secure" as const,
        descKey: "secureDesc" as const,
    },
    {
        icon: Globe,
        titleKey: "free" as const,
        descKey: "freeDesc" as const,
    },
]

export function HomeContent() {
    const { t } = useI18n()

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="w-full py-12 md:py-20 lg:py-28 border-b bg-gradient-to-b from-background to-muted/20">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
                        <Badge variant="secondary" className="px-4 py-1.5">
                            {t.home.hero?.badge ?? "100% Gratuito • Sem cadastro"}
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                            {t.home.title}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                            {t.home.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Tools Grid */}
            <section className="w-full py-12 md:py-20">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center mb-10 md:mb-14">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">
                            {t.home.tools?.title ?? "Ferramentas Disponíveis"}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t.home.tools?.description ?? "Escolha uma ferramenta para começar. Todas funcionam diretamente no seu navegador."}
                        </p>
                    </div>

                    <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                        {/* PDF Tools */}
                        <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-rose-500/50 md:col-span-2 lg:col-span-1 overflow-hidden">
                            <CardHeader className="space-y-4">
                                <div className={`p-3 w-fit rounded-xl bg-rose-500/10 text-rose-500`}>
                                    <FileType className="h-8 w-8" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl mb-2">
                                        {t.home.pdfTools.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {t.home.pdfTools.description}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {PDF_SUB_TOOLS.map(({ id, href, icon: Icon }) => (
                                        <Link key={id} href={href} className="block">
                                            <div className="flex items-center gap-3 p-3 rounded-lg border hover:border-rose-500/50 hover:bg-rose-500/5 transition-colors group">
                                                <div className="p-1.5 rounded-md bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm">{t.pdfTools.tabs[id as keyof typeof t.pdfTools.tabs]}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {t.home.pdfTools.features[id as keyof typeof t.home.pdfTools.features]}
                                                    </p>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* JSON Formatter */}
                        <Link href="/json-formatter" className="group">
                            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-amber-500/50 hover:-translate-y-1">
                                <CardHeader className="space-y-4">
                                    <div className={`p-3 w-fit rounded-xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors`}>
                                        <FileJson className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl mb-2 flex items-center gap-2">
                                            {t.home.jsonFormatter.title}
                                            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </CardTitle>
                                        <CardDescription>
                                            {t.home.jsonFormatter.description}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                            {t.home.jsonFormatter.features.prettyPrint}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                            {t.home.jsonFormatter.features.minify}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                            {t.home.jsonFormatter.features.validate}
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* XML Formatter */}
                        <Link href="/xml-formatter" className="group">
                            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-teal-500/50 hover:-translate-y-1">
                                <CardHeader className="space-y-4">
                                    <div className="p-3 w-fit rounded-xl bg-teal-500/10 text-teal-500 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                                        <FileCode className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl mb-2 flex items-center gap-2">
                                            {t.home.xmlFormatter.title}
                                            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </CardTitle>
                                        <CardDescription>
                                            {t.home.xmlFormatter.description}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                                            {t.home.xmlFormatter.features.format}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                                            {t.home.xmlFormatter.features.minify}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                                            {t.home.xmlFormatter.features.toJson}
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Shared Notes */}
                        <Link href="/notes" className="group">
                            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-emerald-500/50 hover:-translate-y-1">
                                <CardHeader className="space-y-4">
                                    <div className={`p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors`}>
                                        <StickyNote className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl mb-2 flex items-center gap-2">
                                            {t.home.sharedNotes.title}
                                            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </CardTitle>
                                        <CardDescription>
                                            {t.home.sharedNotes.description}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            {t.home.sharedNotes.features.realtime}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            {t.home.sharedNotes.features.expiration}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            {t.home.sharedNotes.features.readonly}
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="w-full py-12 md:py-20 bg-muted/30 border-t">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="p-3 rounded-full bg-primary/10">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold">{t.home.features?.fast ?? "Rápido"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {t.home.features?.fastDesc ?? "Processamento local no navegador. Sem espera por servidores."}
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="p-3 rounded-full bg-primary/10">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold">{t.home.features?.secure ?? "Seguro"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {t.home.features?.secureDesc ?? "Seus arquivos nunca saem do seu computador."}
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="p-3 rounded-full bg-primary/10">
                                <Globe className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold">{t.home.features?.free ?? "Gratuito"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {t.home.features?.freeDesc ?? "Todas as ferramentas são gratuitas. Sem limites, sem cadastro."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-6 border-t">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                        <p>© {new Date().getFullYear()} WebTools. {t.home.footer?.rights ?? "Todos os direitos reservados."}</p>
                        <div className="flex items-center gap-4">
                            <Link href="/json-formatter" className="hover:text-foreground transition-colors">
                                JSON
                            </Link>
                            <Link href="/xml-formatter" className="hover:text-foreground transition-colors">
                                XML
                            </Link>
                            <Link href="/notes" className="hover:text-foreground transition-colors">
                                Notas
                            </Link>
                            <Link href="/pdf-tools" className="hover:text-foreground transition-colors">
                                PDF
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
