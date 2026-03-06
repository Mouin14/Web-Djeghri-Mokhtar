"use client"

import * as React from "react"
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ErrorBar,
    Label,
    LabelList,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ReferenceArea,
    ReferenceDot,
    ReferenceLine,
    ResponsiveContainer,
    Sector,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

import { cn } from "@/lib/utils"

const THEMES = { light: "", dark: ".dark" }

const ChartContext = React.createContext(null)

function useChart() {
    const context = React.useContext(ChartContext)

    if (!context) {
        throw new Error("useChart must be used within a <ChartContainer />")
    }

    return context
}

const ChartContainer = ({
    id,
    config,
    children,
    className,
    ...props
}) => {
    const chartId = React.useId()
    const idToUse = id || `chart-${chartId.replace(/:/g, "")}`

    return (
        <ChartContext.Provider value={{ config }}>
            <div
                data-chart={idToUse}
                className={cn(
                    "flex aspect-video justify-center text-xs [&_.recharts-cartesian-grid-horizontal_line[stroke-dasharray]]:stroke-border [&_.recharts-cartesian-grid-vertical_line[stroke-dasharray]]:stroke-border [&_.recharts-curve.recharts-area]:fill-primary/10 [&_.recharts-curve.recharts-area]:stroke-primary [&_.recharts-curve.recharts-line]:stroke-primary [&_.recharts-dot]:fill-background [&_.recharts-dot]:stroke-primary [&_.recharts-layer]:outline-none [&_.recharts-polar-grid-[stroke-dasharray]]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line-line]:stroke-border [&_.recharts-pie-sector]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-sector.recharts-pie-sector]:stroke-background [&_.recharts-surface]:outline-none",
                    className
                )}
                {...props}
            >
                <ChartStyle id={idToUse} config={config} />
                <ResponsiveContainer>{children}</ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    )
}
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }) => {
    const colorConfig = Object.entries(config).filter(
        ([, config]) => config.theme || config.color
    )

    if (!colorConfig.length) {
        return null
    }

    return (
        <style
            dangerouslySetInnerHTML={{
                __html: Object.entries(THEMES)
                    .map(
                        ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
                                .map(([key, item]) => {
                                    const color = item.theme?.[theme] || item.color
                                    return color ? `  --color-${key}: ${color};` : null
                                })
                                .filter(Boolean)
                                .join("\n")}
}
`
                    )
                    .join("\n"),
            }}
        />
    )
}

const ChartTooltip = Tooltip

const ChartTooltipContent = ({
    active,
    payload,
    className,
    indicator = "dot",
    hideLabel = false,
    hideIndicator = false,
    label,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey,
}) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
        if (hideLabel || !payload?.length) {
            return null
        }

        const [item] = payload
        const key = `${labelKey || item.dataKey || item.name || "value"}`
        const itemConfig = getPayloadConfigFromCustomKey(config, item, key)
        const value =
            !labelKey && typeof label === "string"
                ? config[label]?.label || label
                : itemConfig?.label

        if (labelFormatter) {
            return (
                <div className={cn("font-medium", labelClassName)}>
                    {labelFormatter(value, payload)}
                </div>
            )
        }

        if (!value) {
            return null
        }

        return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
        label,
        labelFormatter,
        payload,
        hideLabel,
        labelClassName,
        config,
        labelKey,
    ])

    if (!active || !payload?.length) {
        return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
        <div
            className={cn(
                "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
                className
            )}
        >
            {!nestLabel ? tooltipLabel : null}
            <div className="grid gap-1.5">
                {payload.map((item, index) => {
                    const key = `${nameKey || item.name || item.dataKey || "value"}`
                    const itemConfig = getPayloadConfigFromCustomKey(config, item, key)
                    const indicatorColor = color || item.payload.fill || item.color

                    return (
                        <div
                            key={item.dataKey}
                            className={cn(
                                "flex w-full items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                                indicator === "dot" && "items-center"
                            )}
                        >
                            {formatter && item?.value !== undefined && item.name !== undefined ? (
                                formatter(item.value, item.name, item, index, payload)
                            ) : (
                                <>
                                    {itemConfig?.icon ? (
                                        <itemConfig.icon />
                                    ) : (
                                        !hideIndicator && (
                                            <div
                                                className={cn(
                                                    "shrink-0 rounded-[2px] border-[1.5px] border-[--color-border] bg-[--color-bg]",
                                                    {
                                                        "h-2.5 w-2.5": indicator === "dot",
                                                        "w-1": indicator === "line",
                                                        "w-0 border-[1.5px] border-dashed bg-transparent":
                                                            indicator === "dashed",
                                                        "my-0.5": nestLabel && indicator === "line",
                                                    }
                                                )}
                                                style={{
                                                    "--color-bg": indicatorColor,
                                                    "--color-border": indicatorColor,
                                                }}
                                            />
                                        )
                                    )}
                                    <div
                                        className={cn(
                                            "flex flex-1 justify-between leading-none",
                                            nestLabel ? "items-end" : "items-center"
                                        )}
                                    >
                                        <div className="grid gap-1.5">
                                            {nestLabel ? tooltipLabel : null}
                                            <span className="text-muted-foreground">
                                                {itemConfig?.label || item.name}
                                            </span>
                                        </div>
                                        {item.value !== undefined && (
                                            <span className="font-mono font-medium tabular-nums text-foreground">
                                                {item.value.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = Legend

const ChartLegendContent = ({
    className,
    hideIcon = false,
    payload,
    verticalAlign,
    nameKey,
}) => {
    const { config } = useChart()

    if (!payload?.length) {
        return null
    }

    return (
        <div
            className={cn(
                "flex items-center justify-center gap-4",
                verticalAlign === "top" ? "pb-3" : "pt-3",
                className
            )}
        >
            {payload.map((item) => {
                const key = `${nameKey || item.dataKey || "value"}`
                const itemConfig = getPayloadConfigFromCustomKey(config, item, key)

                return (
                    <div
                        key={item.value}
                        className={cn(
                            "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
                        )}
                    >
                        {itemConfig?.icon && !hideIcon ? (
                            <itemConfig.icon />
                        ) : (
                            <div
                                className="h-2 w-2 shrink-0 rounded-[2px]"
                                style={{
                                    backgroundColor: item.color,
                                }}
                            />
                        )}
                        {itemConfig?.label || item.value}
                    </div>
                )
            })}
        </div>
    )
}
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromCustomKey(config, item, key) {
    if (typeof item !== "object" || item === null) {
        return undefined
    }

    const configLabelKey =
        "labelKey" in item && item.labelKey ? item.labelKey : key

    let configItem = undefined

    if (configLabelKey in config) {
        configItem = config[configLabelKey]
    } else if (key in config) {
        configItem = config[key]
    }

    if (!configItem) {
        return undefined
    }

    if (Array.isArray(item.payload) || typeof item.payload !== "object") {
        return configItem
    }

    if (
        "dataKey" in item &&
        item.dataKey &&
        item.dataKey in item.payload &&
        config[item.payload[item.dataKey]]
    ) {
        return config[item.payload[item.dataKey]]
    }

    return configItem
}

export {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartStyle,
}
