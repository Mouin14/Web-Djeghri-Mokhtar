import * as React from "react"
import { cn } from "@/lib/utils"

const Item = ({ className, ...props }) => {
    return (
        <div
            className={cn("flex items-center gap-4", className)}
            {...props}
        />
    )
}
Item.displayName = "Item"

const ItemContent = ({ className, ...props }) => {
    return (
        <div
            className={cn("grid gap-1", className)}
            {...props}
        />
    )
}
ItemContent.displayName = "ItemContent"

const ItemTitle = ({ className, ...props }) => {
    return (
        <h4
            className={cn("text-sm font-semibold leading-none", className)}
            {...props}
        />
    )
}
ItemTitle.displayName = "ItemTitle"

const ItemDescription = ({ className, ...props }) => {
    return (
        <p
            className={cn("text-xs text-muted-foreground", className)}
            {...props}
        />
    )
}
ItemDescription.displayName = "ItemDescription"

export { Item, ItemContent, ItemTitle, ItemDescription }
