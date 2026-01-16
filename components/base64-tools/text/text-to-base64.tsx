"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Copy, Check, ArrowLeftRight, Trash2 } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"

export function TextToBase64() {
    const { t } = useI18n()
    const [base64Input, setBase64Input] = useState("")
    const [textOutput, setTextOutput] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [hasCopied, setHasCopied] = useState(false)
    const resetCopiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (resetCopiedTimeoutRef.current) {
                clearTimeout(resetCopiedTimeoutRef.current)
            }
        }
    }, [])

    // Decode Base64 to text with UTF-8 support
    const decode = () => {
        if (!base64Input.trim()) {
            toast.error(t.base64Tools.errors.emptyInput)
            return
        }
        try {
            const decoded = decodeURIComponent(escape(atob(base64Input)))
            setTextOutput(decoded)
            setError(null)
            toast.success(t.base64Tools.common.decoded)
        } catch (e) {
            const errorMsg = e instanceof Error ? e.message : String(e)
            setError(errorMsg)
            setTextOutput(t.base64Tools.errors.invalidBase64)
            toast.error(t.base64Tools.errors.decodingError)
        }
    }

    // Encode text to Base64 with UTF-8 support
    const encode = () => {
        if (!textOutput.trim()) {
            toast.error(t.base64Tools.errors.emptyInput)
            return
        }
        try {
            const encoded = btoa(unescape(encodeURIComponent(textOutput)))
            setBase64Input(encoded)
            setError(null)
            toast.success(t.base64Tools.common.encoded)
        } catch (e) {
            const errorMsg = e instanceof Error ? e.message : String(e)
            setError(errorMsg)
            toast.error(t.base64Tools.errors.encodingError)
        }
    }

    // Switch input and output
    const switchInputOutput = () => {
        if (!textOutput) return
        setBase64Input(textOutput)
        setTextOutput("")
        setError(null)
    }

    // Clear all
    const clear = () => {
        setBase64Input("")
        setTextOutput("")
        setError(null)
    }

    // Copy to clipboard
    const copyToClipboard = () => {
        if (!textOutput) return
        navigator.clipboard.writeText(textOutput).then(() => {
            setHasCopied(true)
            toast.success(t.base64Tools.text.copySuccess)
            resetCopiedTimeoutRef.current = setTimeout(() => {
                setHasCopied(false)
            }, 2000)
        }).catch(() => {
            toast.error(t.base64Tools.errors.decodingError)
        })
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>{t.base64Tools.text.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
                {/* Base64 Input section */}
                <div className="flex flex-col gap-2 flex-1 min-h-0">
                    <Label htmlFor="input">{t.base64Tools.text.inputLabel}</Label>
                    <Textarea
                        id="input"
                        placeholder={t.base64Tools.text.inputPlaceholder}
                        value={base64Input}
                        onChange={(e) => setBase64Input(e.target.value)}
                        className="flex-1 min-h-[120px] resize-none font-mono text-sm"
                    />
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2">
                    <Button onClick={decode} variant="secondary" size="sm">
                        {t.base64Tools.text.decodeButton}
                    </Button>
                    <Button onClick={encode} variant="secondary" size="sm" disabled={!textOutput}>
                        {t.base64Tools.text.encodeButton}
                    </Button>
                    <Button
                        onClick={switchInputOutput}
                        variant="outline"
                        size="sm"
                        disabled={!textOutput}
                        className="gap-2"
                    >
                        <ArrowLeftRight className="h-4 w-4" />
                        {t.base64Tools.text.switchButton}
                    </Button>
                    <Button onClick={clear} variant="outline" size="sm" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        {t.base64Tools.text.clearButton}
                    </Button>
                </div>

                {/* Text Output section */}
                <div className="flex flex-col gap-2 flex-1 min-h-0">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="output">{t.base64Tools.text.outputLabel}</Label>
                        <Button
                            onClick={copyToClipboard}
                            variant="ghost"
                            size="sm"
                            disabled={!textOutput}
                            className="gap-2 h-8"
                        >
                            {hasCopied ? (
                                <>
                                    <Check className="h-4 w-4" />
                                    {t.base64Tools.text.copySuccess}
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4" />
                                    {t.base64Tools.text.copyButton}
                                </>
                            )}
                        </Button>
                    </div>
                    <Textarea
                        id="output"
                        placeholder={t.base64Tools.text.outputPlaceholder}
                        value={textOutput}
                        onChange={(e) => setTextOutput(e.target.value)}
                        className={error
                            ? "flex-1 min-h-[120px] resize-none font-mono text-sm text-destructive"
                            : "flex-1 min-h-[120px] resize-none font-mono text-sm"
                        }
                    />
                    {error && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                            {error}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
