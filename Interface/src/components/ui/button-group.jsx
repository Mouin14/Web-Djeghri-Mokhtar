import * as React from "react"
import { cn } from "@/lib/utils"

const ButtonGroup = ({ className, ...props }) => {
    return (
        <div
            className={cn("flex w-full items-center justify-center", className)}
            {...props}
        />
    )
}
ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup }
