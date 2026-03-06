import * as React from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const Spinner = ({ className, ...props }) => {
    return (
        <Loader2
            className={cn("h-4 w-4 animate-spin text-muted-foreground", className)}
            {...props}
        />
    )
}
Spinner.displayName = "Spinner"

export { Spinner }
