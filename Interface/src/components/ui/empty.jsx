import * as React from "react"
import { cn } from "@/lib/utils"

const Empty = ({
    className,
    icon: Icon,
    title,
    description,
    children,
    ...props
}) => {
    return (
        <div
            className={cn(
                "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50",
                className
            )}
            {...props}
        >
            {Icon && (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-10 w-10 text-muted-foreground" />
                </div>
            )}
            {title && (
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            )}
            {description && (
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    {description}
                </p>
            )}
            {children && <div className="mt-6">{children}</div>}
        </div>
    )
}
Empty.displayName = "Empty"

export { Empty }
