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

type IndentationType = "2" | "4" | "tab"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function removeNullValues(obj: any): any {
    if (obj === null) return undefined
    if (Array.isArray(obj)) {
        return obj.map(removeNullValues).filter((item) => item !== undefined)
    }
    if (typeof obj === "object") {
        const result: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(obj)) {
            const cleaned = removeNullValues(value)
            if (cleaned !== undefined) {
                result[key] = cleaned
            }
        }
        return result
    }
    return obj
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function removeZeroValues(obj: any): any {
    if (typeof obj === "number" && obj === 0) return undefined
    if (Array.isArray(obj)) {
        return obj.map(removeZeroValues).filter((item) => item !== undefined)
    }
    if (obj !== null && typeof obj === "object") {
        const result: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(obj)) {
            const cleaned = removeZeroValues(value)
            if (cleaned !== undefined) {
                result[key] = cleaned
            }
        }
        return result
    }
    return obj
}

export function JsonEditor() {
    const { t } = useI18n()
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [indentation, setIndentation] = useState<IndentationType>("2")
    const [removeNulls, setRemoveNulls] = useState(false)
    const [removeZeros, setRemoveZeros] = useState(false)
    const [hasCopied, setHasCopied] = useState(false)
    const resetCopiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (resetCopiedTimeoutRef.current) {
                clearTimeout(resetCopiedTimeoutRef.current)
            }
        }
    }, [])

    const getIndentValue = () => {
        switch (indentation) {
            case "2":
                return 2
            case "4":
                return 4
            case "tab":
                return "\t"
            default:
                return 2
        }
    }

    const format = () => {
        if (!input) return
        try {
            let parsed = JSON.parse(input)
            if (removeNulls) {
                parsed = removeNullValues(parsed)
            }
            if (removeZeros) {
                parsed = removeZeroValues(parsed)
            }
            setOutput(JSON.stringify(parsed, null, getIndentValue()))
            setError(null)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e))
            toast.error(t.jsonFormatter.messages.invalidJson)
        }
    }

    const minify = () => {
        if (!input) return
        try {
            let parsed = JSON.parse(input)
            if (removeNulls) {
                parsed = removeNullValues(parsed)
            }
            if (removeZeros) {
                parsed = removeZeroValues(parsed)
            }
            setOutput(JSON.stringify(parsed))
            setError(null)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e))
            toast.error(t.jsonFormatter.messages.invalidJson)
        }
    }

    const stringify = () => {
        if (!input) return
        try {
            let parsed = JSON.parse(input)
            if (removeNulls) {
                parsed = removeNullValues(parsed)
            }
            if (removeZeros) {
                parsed = removeZeroValues(parsed)
            }
            const jsonString = JSON.stringify(parsed)
            setOutput(JSON.stringify(jsonString))
            setError(null)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e))
            toast.error(t.jsonFormatter.messages.invalidJson)
        }
    }

    const unstringify = () => {
        if (!input) return
        try {
            const parsed = JSON.parse(input)
            if (typeof parsed === "string") {
                let unstringified = JSON.parse(parsed)
                if (removeNulls) {
                    unstringified = removeNullValues(unstringified)
                }
                if (removeZeros) {
                    unstringified = removeZeroValues(unstringified)
                }
                setOutput(JSON.stringify(unstringified, null, getIndentValue()))
                setError(null)
            } else {
                toast.error(t.jsonFormatter.messages.notStringified)
                setError(t.jsonFormatter.messages.notStringified)
            }
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e))
            toast.error(t.jsonFormatter.messages.invalidOrNotStringified)
        }
    }

    const copyToClipboard = () => {
        if (!output) return
        navigator.clipboard
            .writeText(output)
            .then(() => {
                toast.success(t.jsonFormatter.messages.copiedToClipboard)
                setHasCopied(true)
                if (resetCopiedTimeoutRef.current) {
                    clearTimeout(resetCopiedTimeoutRef.current)
                }
                resetCopiedTimeoutRef.current = setTimeout(() => {
                    setHasCopied(false)
                }, 1200)
            })
            .catch(() => {
                toast.error(t.jsonFormatter.messages.copyFailed)
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
            <div className="grid gap-4 md:grid-cols-2 h-full min-h-0">
                <Card className="h-full">
                    <CardHeader className="py-3 px-4 border-b shrink-0">
                        <CardTitle className="text-sm md:text-base font-medium">{t.jsonFormatter.input}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 min-h-0 overflow-hidden">
                        <Textarea
                            className="h-full w-full resize-none border-0 focus-visible:ring-0 p-3 md:p-4 font-mono text-xs md:text-sm rounded-none overflow-auto field-sizing-fixed"
                            placeholder={t.jsonFormatter.inputPlaceholder}
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

                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b space-y-0 shrink-0">
                        <CardTitle className="text-sm md:text-base font-medium">{t.jsonFormatter.output}</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyToClipboard} disabled={!output}>
                            {hasCopied ? (
                                <Check key="check" className="h-4 w-4 animate-in fade-in-0 zoom-in-95" />
                            ) : (
                                <Copy key="copy" className="h-4 w-4" />
                            )}
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 min-h-0 overflow-hidden">
                        <Textarea
                            className="h-full w-full resize-none border-0 focus-visible:ring-0 p-3 md:p-4 font-mono text-xs md:text-sm bg-transparent rounded-none overflow-auto field-sizing-fixed"
                            readOnly
                            value={output}
                            placeholder={t.jsonFormatter.outputPlaceholder}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-3 flex-shrink-0">
                <div className="flex items-center justify-between gap-2">
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4 flex-1">
                        <Button variant="secondary" onClick={format} className="text-xs md:text-sm">
                            {t.jsonFormatter.actions.format}
                        </Button>
                        <Button variant="secondary" onClick={minify} className="text-xs md:text-sm">
                            {t.jsonFormatter.actions.minify}
                        </Button>
                        <Button variant="secondary" onClick={stringify} className="text-xs md:text-sm">
                            {t.jsonFormatter.actions.stringify}
                        </Button>
                        <Button variant="secondary" onClick={unstringify} className="text-xs md:text-sm">
                            {t.jsonFormatter.actions.unstringify}
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
                                        <h4 className="font-medium text-sm">{t.jsonFormatter.settings.title}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            {t.jsonFormatter.settings.description}
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">{t.jsonFormatter.settings.indentation}</Label>
                                        <RadioGroup value={indentation} onValueChange={(value) => setIndentation(value as IndentationType)}>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="2" id="indent-2" />
                                                <Label htmlFor="indent-2" className="text-sm font-normal cursor-pointer">
                                                    {t.jsonFormatter.settings.indent2}
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="4" id="indent-4" />
                                                <Label htmlFor="indent-4" className="text-sm font-normal cursor-pointer">
                                                    {t.jsonFormatter.settings.indent4}
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="tab" id="indent-tab" />
                                                <Label htmlFor="indent-tab" className="text-sm font-normal cursor-pointer">
                                                    {t.jsonFormatter.settings.indentTab}
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div className="space-y-3 pt-2 border-t">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-px">
                                                <Label htmlFor="remove-nulls" className="text-sm font-medium cursor-pointer">
                                                    {t.jsonFormatter.settings.removeNulls}
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    {t.jsonFormatter.settings.removeNullsDescription}
                                                </p>
                                            </div>
                                            <Switch
                                                id="remove-nulls"
                                                checked={removeNulls}
                                                onCheckedChange={setRemoveNulls}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-px">
                                                <Label htmlFor="remove-zeros" className="text-sm font-medium cursor-pointer">
                                                    {t.jsonFormatter.settings.removeZeros}
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    {t.jsonFormatter.settings.removeZerosDescription}
                                                </p>
                                            </div>
                                            <Switch
                                                id="remove-zeros"
                                                checked={removeZeros}
                                                onCheckedChange={setRemoveZeros}
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
