import { cn } from "@/lib/utils"

interface ToolHeaderProps {
    icon: React.ReactNode
    title: string
    description: string
    color: "amber" | "emerald" | "purple" | "rose" | "blue" | "teal" | "indigo" | "cyan"
    className?: string
}

const colorVariants = {
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-500",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-500",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-500",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-500",
    teal: "bg-teal-500/10 text-teal-600 dark:text-teal-500",
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-500",
    cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-500",
}

/**
 * Standardized header component for tool pages.
 * Ensures consistent spacing, typography, and icon styling.
 */
export function ToolHeader({
    icon,
    title,
    description,
    color,
    className,
}: ToolHeaderProps) {
    return (
        <div className={cn("mb-4 space-y-1 text-center md:text-left", className)}>
            <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className={cn("p-2 rounded-lg", colorVariants[color])}>
                    {icon}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {title}
                </h1>
            </div>
            <p className="text-muted-foreground text-sm">{description}</p>
        </div>
    )
}
