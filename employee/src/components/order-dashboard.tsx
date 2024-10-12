import { ORDER_STATUS } from "@/constants/order.constant";
import { EOrderStatus } from "@/enum/order.enum";
import { IStatisticDashboard } from "@/interface/api/dashboard.interface";
import { CartesianGrid, RadialBar, RadialBarChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "./ui/chart";

interface IOrderDashboardProps {
    statistic: IStatisticDashboard;
}

const chartConfig = {
    [ORDER_STATUS[EOrderStatus.PENDING]]: {
        label: ORDER_STATUS[EOrderStatus.PENDING],
        fill: "#FFD700",
    },
    [ORDER_STATUS[EOrderStatus.PENDING_PAYMENT]]: {
        label: ORDER_STATUS[EOrderStatus.PENDING_PAYMENT],
        fill: "#FFA500",
    },
    [ORDER_STATUS[EOrderStatus.PAID_PAYMENT]]: {
        label: ORDER_STATUS[EOrderStatus.PAID_PAYMENT],
        fill: "#9370DB",
    },
    [ORDER_STATUS[EOrderStatus.CONFIRMED]]: {
        label: ORDER_STATUS[EOrderStatus.CONFIRMED],
        fill: "#8A2BE2",
    },
    [ORDER_STATUS[EOrderStatus.CALL_CONFIRM]]: {
        label: ORDER_STATUS[EOrderStatus.CALL_CONFIRM],
        fill: "#421658",
    },
    [ORDER_STATUS[EOrderStatus.PROCESSING]]: {
        label: ORDER_STATUS[EOrderStatus.PROCESSING],
        fill: "#0077ff",
    },
    [ORDER_STATUS[EOrderStatus.SHIPPING]]: {
        label: ORDER_STATUS[EOrderStatus.SHIPPING],
        fill: "#003c8b",
    },
    [ORDER_STATUS[EOrderStatus.SHIPPED]]: {
        label: ORDER_STATUS[EOrderStatus.SHIPPED],
        fill: "#639263",
    },
    [ORDER_STATUS[EOrderStatus.RECEIVED]]: {
        label: ORDER_STATUS[EOrderStatus.RECEIVED],
        fill: "#008000",
    },
    [ORDER_STATUS[EOrderStatus.ARRIVED]]: {
        label: ORDER_STATUS[EOrderStatus.ARRIVED],
        fill: "#ADFF2F",
    },
    [ORDER_STATUS[EOrderStatus.ON_SERVICE]]: {
        label: ORDER_STATUS[EOrderStatus.ON_SERVICE],
        fill: "#BA55D3",
    },
    [ORDER_STATUS[EOrderStatus.FINISH]]: {
        label: ORDER_STATUS[EOrderStatus.FINISH],
        fill: "#32CD32",
    },
    [ORDER_STATUS[EOrderStatus.CANCELLED]]: {
        label: ORDER_STATUS[EOrderStatus.CANCELLED],
        fill: "#FF4500",
    },
    [ORDER_STATUS[EOrderStatus.RETURNED]]: {
        label: ORDER_STATUS[EOrderStatus.RETURNED],
        fill: "#DC143C",
    },
};

export default function OrderDashboard({ statistic }: IOrderDashboardProps) {
    let data = statistic.order.orderCountDetail.map((item) => ({
        name: chartConfig[ORDER_STATUS[item.status as EOrderStatus]].label,
        fill: chartConfig[ORDER_STATUS[item.status as EOrderStatus]].fill,
        "Số lượng": parseInt(item.count),
    }));

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Thống kê đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="px-5 h-full flex flex-1">
                {!!statistic.order.orderCount ? (
                    <ChartContainer
                        config={chartConfig}
                        className="w-full flex-1"
                    >
                        <RadialBarChart
                            data={data}
                            innerRadius="10%"
                            outerRadius="80%"
                            startAngle={180}
                            endAngle={0}
                            className="h-fit"
                        >
                            <RadialBar
                                label={{
                                    fill: "#666",
                                    position: "insideStart",
                                }}
                                background
                                dataKey={"Số lượng"}
                                radius={4}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent className="w-fit" />
                                }
                            />
                            <ChartLegend
                                content={<ChartLegendContent />}
                                className="flex-wrap h-fit w-full"
                            />
                            <CartesianGrid vertical={false} horizontal={true} />
                        </RadialBarChart>
                    </ChartContainer>
                ) : (
                    <p className="w-full text-center text-sm text-muted-foreground py-10">
                        Không có đơn hàng nào phù hợp
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
