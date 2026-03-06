import * as React from "react"
import { cn } from "@/lib/utils"

const Field = ({ className, ...props }) => {
    return (
        <div
            className={cn("grid gap-2", className)}
            {...props}
        />
    )
}
Field.displayName = "Field"

const FieldLabel = ({ className, ...props }) => {
    return (
        <label
            className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                className
            )}
            {...props}
        />
    )
}
FieldLabel.displayName = "FieldLabel"

const FieldDescription = ({ className, ...props }) => {
    return (
        <p
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    )
}
FieldDescription.displayName = "FieldDescription"

const FieldError = ({ className, children, ...props }) => {
    if (!children) return null

    return (
        <p
            className={cn("text-sm font-medium text-destructive", className)}
            {...props}
        >
            {children}
        </p>
    )
}
FieldError.displayName = "FieldError"

export { Field, FieldLabel, FieldDescription, FieldError }
