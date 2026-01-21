"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Copy, Check, AlertCircle, Settings, ArrowLeftRight } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"
import { XMLParser, XMLBuilder } from "fast-xml-parser"

type IndentationType = "2" | "4" | "tab"

// Remove XML comments
function removeXmlComments(str: string): string {
    return str.replace(/<!--[\s\S]*?-->/g, "")
}

// Escape XML entities
function escapeXml(str: string): string {
    return str.replace(/[&<>"']/g, (char) => {
        const escapeMap: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&apos;",
        }
        return escapeMap[char]
    })
}

// Unescape XML entities
function unescapeXml(str: string): string {
    return str.replace(/&(amp|lt|gt|quot|apos);/g, (match) => {
        const unescapeMap: Record<string, string> = {
            "&amp;": "&",
            "&lt;": "<",
            "&gt;": ">",
            "&quot;": '"',
            "&apos;": "'",
        }
        return unescapeMap[match] || match
    })
}

// Remove XML declaration
function removeXmlDeclaration(str: string): string {
    return str.replace(/<\?xml[^?]*\?>\s*/g, "")
}

export function XmlEditor() {
    const { t } = useI18n()
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [indentation, setIndentation] = useState<IndentationType>("2")
    const [removeDeclaration, setRemoveDeclaration] = useState(false)
    const [removeComments, setRemoveComments] = useState(false)
    const [hasCopied, setHasCopied] = useState(false)
    const resetCopiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (resetCopiedTimeoutRef.current) {
                clearTimeout(resetCopiedTimeoutRef.current)
            }
        }
    }, [])

    const getIndentValue = (): string => {
        switch (indentation) {
            case "2":
                return "  "
            case "4":
                return "    "
            case "tab":
                return "\t"
            default:
                return "  "
        }
    }

    const processInput = (): string => {
        let processed = input
        if (removeComments) {
            processed = removeXmlComments(processed)
        }
        return processed
    }

    const format = () => {
        if (!input) return
        try {
            const processedInput = processInput()
            const parser = new XMLParser({
                ignoreAttributes: false,
                allowBooleanAttributes: true,
                parseTagValue: true,
                trimValues: true,
            })

            const jsonObj = parser.parse(processedInput)

            const builder = new XMLBuilder({
                format: true,
                indentBy: getIndentValue(),
                ignoreAttributes: false,
            })

            let result = builder.build(jsonObj)

            if (removeDeclaration) {
                result = removeXmlDeclaration(result)
            }

            setOutput(result)
            setError(null)
        } catch (e: unknown) {
            const errorMsg = e instanceof Error ? e.message : String(e)
            setError(errorMsg)
            setOutput(`${t.xmlFormatter.messages.invalidXml}: ${errorMsg}`)
        }
    }

    const minify = () => {
        if (!input) return
        try {
            const processedInput = processInput()
            const parser = new XMLParser({
                ignoreAttributes: false,
                allowBooleanAttributes: true,
                parseTagValue: true,
                trimValues: true,
            })

            const jsonObj = parser.parse(processedInput)

            const builder = new XMLBuilder({
                format: false,
                ignoreAttributes: false,
            })

            let result = builder.build(jsonObj)

            if (removeDeclaration) {
                result = removeXmlDeclaration(result)
            }

            setOutput(result)
            setError(null)
        } catch (e: unknown) {
            const errorMsg = e instanceof Error ? e.message : String(e)
            setError(errorMsg)
            setOutput(`${t.xmlFormatter.messages.invalidXml}: ${errorMsg}`)
        }
    }

    const escape = () => {
        if (!input) return
        try {
            const result = escapeXml(input)
            setOutput(result)
            setError(null)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e))
            toast.error(t.xmlFormatter.messages.invalidXml)
        }
    }

    const unescape = () => {
        if (!input) return
        try {
            const result = unescapeXml(input)
            setOutput(result)
            setError(null)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e))
            toast.error(t.xmlFormatter.messages.invalidXml)
        }
    }

    const toJson = () => {
        if (!input) return
        try {
            const processedInput = processInput()
            const parser = new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: "@_",
                textNodeName: "#text",
            })

            const jsonObj = parser.parse(processedInput)
            setOutput(JSON.stringify(jsonObj, null, 2))
            setError(null)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e))
            toast.error(t.xmlFormatter.messages.invalidXml)
        }
    }

    const copyToClipboard = () => {
        if (!output) return
        navigator.clipboard
            .writeText(output)
            .then(() => {
                toast.success(t.xmlFormatter.messages.copiedToClipboard)
                setHasCopied(true)
                if (resetCopiedTimeoutRef.current) {
                    clearTimeout(resetCopiedTimeoutRef.current)
                }
                resetCopiedTimeoutRef.current = setTimeout(() => {
                    setHasCopied(false)
                }, 1200)
            })
            .catch(() => {
                toast.error(t.xmlFormatter.messages.copyFailed)
            })
    }

    const switchInputOutput = () => {
        if (!output) return
        const temp = input
        setInput(output)
        setOutput(temp)
        setError(null)
    }

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="grid gap-4 md:grid-cols-2 flex-1 min-h-0">
                <Card className="flex flex-col overflow-hidden">
                    <CardHeader className="py-3 px-4 border-b">
                        <CardTitle className="text-sm md:text-base font-medium">{t.xmlFormatter.input}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <Textarea
                            className="h-full w-full resize-none border-0 focus-visible:ring-0 p-3 md:p-4 font-mono text-xs md:text-sm rounded-none"
                            placeholder={t.xmlFormatter.inputPlaceholder}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value)
                                if (e.target.value === "") {
                                    setError(null)
                                    setOutput("")
                                }
                            }}
                        />
                    </CardContent>
                </Card>

                <Card className="flex flex-col overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b space-y-0">
                        <CardTitle className="text-sm md:text-base font-medium">{t.xmlFormatter.output}</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyToClipboard} disabled={!output}>
                            {hasCopied ? (
                                <Check key="check" className="h-4 w-4 animate-in fade-in-0 zoom-in-95" />
                            ) : (
                                <Copy key="copy" className="h-4 w-4" />
                            )}
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <Textarea
                            className="h-full w-full resize-none border-0 focus-visible:ring-0 p-3 md:p-4 font-mono text-xs md:text-sm bg-transparent rounded-none"
                            readOnly
                            value={output}
                            placeholder={t.xmlFormatter.outputPlaceholder}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4 flex-1">
                        <Button variant="secondary" onClick={format} className="text-xs md:text-sm">
                            {t.xmlFormatter.actions.format}
                        </Button>
                        <Button variant="secondary" onClick={minify} className="text-xs md:text-sm">
                            {t.xmlFormatter.actions.minify}
                        </Button>
                        <Button variant="secondary" onClick={escape} className="text-xs md:text-sm">
                            {t.xmlFormatter.actions.escape}
                        </Button>
                        <Button variant="secondary" onClick={unescape} className="text-xs md:text-sm">
                            {t.xmlFormatter.actions.unescape}
                        </Button>
                        <Button variant="secondary" onClick={toJson} className="text-xs md:text-sm">
                            {t.xmlFormatter.actions.toJson}
                        </Button>
                        <Button variant="secondary" disabled className="text-xs md:text-sm opacity-50">
                            &nbsp;
                        </Button>
                        <Button variant="secondary" disabled className="text-xs md:text-sm opacity-50">
                            &nbsp;
                        </Button>
                        <Button variant="secondary" disabled className="text-xs md:text-sm opacity-50">
                            &nbsp;
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 flex-shrink-0"
                            onClick={switchInputOutput}
                            disabled={!output}
                        >
                            <ArrowLeftRight className="h-4 w-4" />
                        </Button>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72" align="end">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm">{t.xmlFormatter.settings.title}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            {t.xmlFormatter.settings.description}
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">{t.xmlFormatter.settings.indentation}</Label>
                                        <RadioGroup value={indentation} onValueChange={(value) => setIndentation(value as IndentationType)}>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="2" id="indent-2" />
                                                <Label htmlFor="indent-2" className="text-sm font-normal cursor-pointer">
                                                    {t.xmlFormatter.settings.indent2}
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="4" id="indent-4" />
                                                <Label htmlFor="indent-4" className="text-sm font-normal cursor-pointer">
                                                    {t.xmlFormatter.settings.indent4}
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="tab" id="indent-tab" />
                                                <Label htmlFor="indent-tab" className="text-sm font-normal cursor-pointer">
                                                    {t.xmlFormatter.settings.indentTab}
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div className="space-y-3 pt-2 border-t">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-px">
                                                <Label htmlFor="remove-declaration" className="text-sm font-medium cursor-pointer">
                                                    {t.xmlFormatter.settings.removeDeclaration}
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    {t.xmlFormatter.settings.removeDeclarationDescription}
                                                </p>
                                            </div>
                                            <Switch
                                                id="remove-declaration"
                                                checked={removeDeclaration}
                                                onCheckedChange={setRemoveDeclaration}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-px">
                                                <Label htmlFor="remove-comments" className="text-sm font-medium cursor-pointer">
                                                    {t.xmlFormatter.settings.removeComments}
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    {t.xmlFormatter.settings.removeCommentsDescription}
                                                </p>
                                            </div>
                                            <Switch
                                                id="remove-comments"
                                                checked={removeComments}
                                                onCheckedChange={setRemoveComments}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {error && (
                    <div className="rounded-md bg-destructive/15 p-3 text-xs md:text-sm text-destructive flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span className="break-all">{error}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
