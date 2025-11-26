"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileJson, StickyNote, FileType } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"

export default function Home() {
  const { t } = useI18n()

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      <section className="w-full flex-1 flex items-center justify-center py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 lg:gap-12 max-w-7xl mx-auto">
            <Link href="/json-formatter" className="group">
              <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
                <CardHeader className="space-y-4">
                  <div className="p-3 w-fit rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <FileJson className="h-8 w-8 md:h-10 md:w-10" />
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl mb-2">{t.home.jsonFormatter.title}</CardTitle>
                    <CardDescription className="text-sm md:text-base">
                      {t.home.jsonFormatter.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ul className="space-y-2 text-sm md:text-base text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{t.home.jsonFormatter.features.prettyPrint}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{t.home.jsonFormatter.features.minify}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{t.home.jsonFormatter.features.validate}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            <Link href="/notes" className="group">
              <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
                <CardHeader className="space-y-4">
                  <div className="p-3 w-fit rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <StickyNote className="h-8 w-8 md:h-10 md:w-10" />
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl mb-2">{t.home.sharedNotes.title}</CardTitle>
                    <CardDescription className="text-sm md:text-base">
                      {t.home.sharedNotes.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ul className="space-y-2 text-sm md:text-base text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{t.home.sharedNotes.features.realtime}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{t.home.sharedNotes.features.expiration}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{t.home.sharedNotes.features.readonly}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            <Link href="/pdf-tools" className="group">
              <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
                <CardHeader className="space-y-4">
                  <div className="p-3 w-fit rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <FileType className="h-8 w-8 md:h-10 md:w-10" />
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl mb-2">{t.home.pdfTools.title}</CardTitle>
                    <CardDescription className="text-sm md:text-base">
                      {t.home.pdfTools.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ul className="space-y-2 text-sm md:text-base text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{t.home.pdfTools.features.merge}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{t.home.pdfTools.features.split}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{t.home.pdfTools.features.compress}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
