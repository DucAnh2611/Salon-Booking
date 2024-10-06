import { IStatisticDashboard } from "@/interface/api/dashboard.interface";
import { joinString } from "@/utils/string";
import { format } from "date-fns";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card } from "./ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "./ui/chart";

interface IDashboardChartProps {
    statistic: IStatisticDashboard;
    month?: number;
    year: number;
    selectMonth: boolean;
}

const chartConfig = {
    product: {
        label: "Sản phẩm",
        color: "#eab308 ",
    },
    service: {
        label: "Dịch vụ",
        color: "#a855f7 ",
    },
} satisfies ChartConfig;

export default function DashboardChart({
    statistic,
    month,
    year,
    selectMonth,
}: IDashboardChartProps) {
    return (
        <Card className="w-full h-full">
            <div className="w-full h-full p-5 flex flex-col gap-2 box-border">
                <p className="text-xs text-muted-foreground w-full text-center">
                    {joinString({
                        joinString: " ",
                        strings: [
                            "Biểu đồ doanh thu",
                            selectMonth ? `tháng ${month}` : "",
                            "năm",
                            year.toString(),
                        ],
                    })}
                </p>
                <div className="flex-1 w-full">
                    <ChartContainer
                        config={chartConfig}
                        className="h-full w-full min-h-full"
                    >
                        <BarChart data={statistic.income.data}>
                            <XAxis
                                dataKey={statistic.income.groupBy}
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value: number) => {
                                    const date = new Date(statistic.start);
                                    if (statistic.income.groupBy === "year") {
                                        date.setMonth(value - 1);
                                        return format(date, "LL");
                                    } else {
                                        date.setDate(value);
                                        return format(date, "dd");
                                    }
                                }}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent className="w-fit" />
                                }
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            <CartesianGrid vertical={false} />
                            <Bar dataKey="product" fill="#eab308" radius={4} />
                            <Bar dataKey="service" fill="#a855f7" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
        </Card>
    );
}
