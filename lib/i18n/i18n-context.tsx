"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { translations, Locale } from "./translations"

type I18nContextType = {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: typeof translations[Locale]
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("pt-BR")

    useEffect(() => {
        const savedLocale = localStorage.getItem("locale") as Locale
        if (savedLocale && (savedLocale === "pt-BR" || savedLocale === "en")) {
            setLocaleState(savedLocale)
        }
    }, [])

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale)
        localStorage.setItem("locale", newLocale)
    }

    const value: I18nContextType = {
        locale,
        setLocale,
        t: translations[locale],
    }

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
    const context = useContext(I18nContext)
    if (!context) {
        throw new Error("useI18n must be used within I18nProvider")
    }
    return context
}
