"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/dashboard/navbar"

export function ConditionalNavbar() {
    const pathname = usePathname()

    // Hide navbar on individual note pages
    const shouldHideNavbar = pathname.startsWith("/notes/") && pathname !== "/notes"

    if (shouldHideNavbar) {
        return null
    }

    return <Navbar />
}
