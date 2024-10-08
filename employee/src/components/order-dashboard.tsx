import { ORDER_STATUS } from "@/constants/order.constant";
import { EOrderStatus } from "@/enum/order.enum";
import { IStatisticDashboard } from "@/interface/api/dashboard.interface";
import { Legend, RadialBar, RadialBarChart, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChartContainer } from "./ui/chart";

interface IOrderDashboardProps {
    statistic: IStatisticDashboard;
}

const chartConfig = {
    [EOrderStatus.PENDING]: {
        label: ORDER_STATUS[EOrderStatus.PENDING],
        fill: "#FFD700",
    },
    [EOrderStatus.PENDING_PAYMENT]: {
        label: ORDER_STATUS[EOrderStatus.PENDING_PAYMENT],
        fill: "#FFA500",
    },
    [EOrderStatus.PAID_PAYMENT]: {
        label: ORDER_STATUS[EOrderStatus.PAID_PAYMENT],
        fill: "#9370DB",
    },
    [EOrderStatus.CONFIRMED]: {
        label: ORDER_STATUS[EOrderStatus.CONFIRMED],
        fill: "#8A2BE2",
    },
    [EOrderStatus.CALL_CONFIRM]: {
        label: ORDER_STATUS[EOrderStatus.CALL_CONFIRM],
        fill: "#9932CC",
    },
    [EOrderStatus.PROCESSING]: {
        label: ORDER_STATUS[EOrderStatus.PROCESSING],
        fill: "#32CD32",
    },
    [EOrderStatus.SHIPPING]: {
        label: ORDER_STATUS[EOrderStatus.SHIPPING],
        fill: "#228B22",
    },
    [EOrderStatus.SHIPPED]: {
        label: ORDER_STATUS[EOrderStatus.SHIPPED],
        fill: "#006400",
    },
    [EOrderStatus.RECEIVED]: {
        label: ORDER_STATUS[EOrderStatus.RECEIVED],
        fill: "#008000",
    },
    [EOrderStatus.ARRIVED]: {
        label: ORDER_STATUS[EOrderStatus.ARRIVED],
        fill: "#ADFF2F",
    },
    [EOrderStatus.ON_SERVICE]: {
        label: ORDER_STATUS[EOrderStatus.ON_SERVICE],
        fill: "#BA55D3",
    },
    [EOrderStatus.FINISH]: {
        label: ORDER_STATUS[EOrderStatus.FINISH],
        fill: "#32CD32",
    },
    [EOrderStatus.CANCELLED]: {
        label: ORDER_STATUS[EOrderStatus.CANCELLED],
        fill: "#FF4500",
    },
    [EOrderStatus.RETURNED]: {
        label: ORDER_STATUS[EOrderStatus.RETURNED],
        fill: "#DC143C",
    },
    [EOrderStatus.REFUNDED]: {
        label: ORDER_STATUS[EOrderStatus.REFUNDED],
        fill: "#B22222",
    },
};

export default function OrderDashboard({ statistic }: IOrderDashboardProps) {
    let data = statistic.order.orderCountDetail.map((item) => ({
        name: chartConfig[item.status].label,
        fill: chartConfig[item.status].fill,
        "Số lượng": parseInt(item.count),
    }));

    return (
        <Card className="">
            <CardHeader>
                <CardTitle>Thống kê đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="px-5 max-h-[200px]">
                {!!statistic.order.orderCount ? (
                    <ChartContainer config={{}} className="w-full ">
                        <RadialBarChart
                            data={data}
                            innerRadius="10%"
                            outerRadius="80%"
                            startAngle={180}
                            endAngle={0}
                        >
                            <RadialBar
                                label={{
                                    fill: "#666",
                                    position: "insideStart",
                                }}
                                background
                                dataKey={"Số lượng"}
                            />
                            <Legend
                                iconSize={12}
                                width={200}
                                height={200}
                                layout="vertical"
                                verticalAlign="middle"
                                align="left"
                            />
                            <Tooltip />
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
