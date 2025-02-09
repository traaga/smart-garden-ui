"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { HistoryMeasurements, MeasurementSetting } from "@/common"
import { useState } from "react"

interface HistoryChartProps {
    setting: MeasurementSetting,
    data: HistoryMeasurements
}

type TimeRange = keyof HistoryMeasurements;

export function HistoryChart(props: HistoryChartProps) {
    const [timeRange, setTimeRange] = useState<TimeRange>('day');

    const formatDateTime = (dateStr: string, includeDate?: true) => {
        const date = new Date(dateStr);

        const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        const timeFormatter = new Intl.DateTimeFormat(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        if(includeDate) {
            return dateTimeFormatter.format(date).replace(/\b at\b/, ',');
        }

        return timeFormatter.format(date);
    }

    return (
        <div>
            <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                    {props.setting.iconMedium}
                    <div>{props.setting.displayName} ({props.setting.unit})</div>
                </div>
                <Select
                    value={timeRange}
                    onValueChange={(value: string) => setTimeRange(value as TimeRange)}
                >
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 24 hoursss" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="day" className="rounded-lg">
                            Last 24 hours
                        </SelectItem>
                        <SelectItem value="week" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                        <SelectItem value="month" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <ChartContainer
                config={{}}
                className="aspect-auto h-[250px] w-full"
            >
                <AreaChart data={props.data[timeRange]}>
                    <defs>
                        <linearGradient id={`fillValue-${props.setting.type}`} x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="5%"
                                stopColor={props.setting.chartColor}
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor={props.setting.chartColor}
                                stopOpacity={0.1}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="datetime"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tickFormatter={(value) => formatDateTime(value)}
                    />
                    <YAxis
                        dataKey={props.setting.type}
                        tickLine={false}
                        axisLine={false}
                        width={24}
                    // tickMargin={8}
                    //minTickGap={32}
                    /*tickFormatter={(value) => {
                        return value;
                    }}*/
                    />
                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                labelFormatter={(value) => formatDateTime(value, true)}
                                indicator="dot"
                            />
                        }
                    />
                    <Area
                        dataKey={props.setting.type}
                        type="natural"
                        fill={`url(#fillValue-${props.setting.type})`}
                        stroke={props.setting.chartColor}
                        stackId="a"
                    />
                </AreaChart>
            </ChartContainer>
        </div>
    )
}
