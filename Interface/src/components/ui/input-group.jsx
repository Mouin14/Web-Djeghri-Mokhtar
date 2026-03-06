import * as React from "react"
import { cn } from "@/lib/utils"

const InputGroup = ({ className, ...props }) => {
    return (
        <div
            className={cn("relative flex w-full items-center", className)}
            {...props}
        />
    )
}
InputGroup.displayName = "InputGroup"

const InputGroupText = ({ className, ...props }) => {
    return (
        <div
            className={cn(
                "flex items-center px-3 text-sm text-muted-foreground",
                className
            )}
            {...props}
        />
    )
}
InputGroupText.displayName = "InputGroupText"

export { InputGroup, InputGroupText }
