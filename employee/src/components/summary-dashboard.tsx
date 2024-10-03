import { IStatisticDashboard } from "@/interface/api/dashboard.interface";
import { formatMoney } from "@/utils/money";
import { CalendarClock, NotepadText, Package, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ISummaryDashboardProps {
    statistic: IStatisticDashboard;
}

export default function SummaryDashboard({
    statistic,
}: ISummaryDashboardProps) {
    return (
        <div className="w-full grid grid-cols-4 gap-5">
            <Card className="bg-green-500 text-green-900 border-green-500 bg-opacity-15 dark:text-white dark:bg-opacity-100 relative overflow-hidden flex flex-col justify-center py-2">
                <div className=" text-green-500 dark:text-white flex items-center justify-center absolute top-1/2 left-0 scale-150 z-[0] -translate-y-1/3 -translate-x-2 opacity-30">
                    <Wallet size={50} />
                </div>
                <div className="relative z-[1]">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xl font-medium flex gap-2 items-center">
                            Doanh thu
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="w-full overflow-hidden line-clamp-1 whitespace-nowrap text-3xl font-bold">
                            {formatMoney(statistic.totalIncome)}
                        </p>
                    </CardContent>
                </div>
            </Card>

            <Card className="bg-blue-500 text-blue-900 border-blue-500 bg-opacity-15 dark:text-white dark:bg-opacity-100 relative overflow-hidden flex flex-col justify-center py-2">
                <div className=" text-blue-500 dark:text-white flex items-center justify-center absolute top-1/2 left-0 scale-150 z-[0] -translate-y-1/3 -translate-x-2 opacity-30">
                    <NotepadText size={50} />
                </div>
                <div className="relative z-[1]">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xl font-medium flex gap-2 items-center">
                            Số lượng đơn hàng
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="w-full overflow-hidden line-clamp-1 whitespace-nowrap text-3xl font-bold">
                            {`${statistic.totalOrders}`}
                        </p>
                    </CardContent>
                </div>
            </Card>

            <Card className="bg-yellow-500 text-yellow-900 border-yellow-500 bg-opacity-15 dark:text-white dark:bg-opacity-100 relative overflow-hidden flex flex-col justify-center py-2">
                <div className=" text-yellow-500 dark:text-white flex items-center justify-center absolute top-1/2 left-0 scale-150 z-[0] -translate-y-1/3 -translate-x-2 opacity-30">
                    <Package size={50} />
                </div>
                <div className="relative z-[1]">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xl font-medium flex gap-2 items-center">
                            Sản phẩm
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="w-full overflow-hidden line-clamp-1 whitespace-nowrap text-3xl font-bold">
                            {statistic.totalProducts}
                        </p>
                    </CardContent>
                </div>
            </Card>

            <Card className="bg-purple-500 text-purple-900 border-purple-500 bg-opacity-15 dark:text-white dark:bg-opacity-100 relative overflow-hidden flex flex-col justify-center py-2">
                <div className=" text-purple-500 dark:text-white flex items-center justify-center absolute top-1/2 left-0 scale-150 z-[0] -translate-y-1/3 -translate-x-2 opacity-30">
                    <CalendarClock size={50} />
                </div>
                <div className="relative z-[1]">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xl font-medium flex gap-2 items-center">
                            Dịch vụ
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="w-full overflow-hidden line-clamp-1 whitespace-nowrap text-3xl font-bold">
                            {statistic.totalServices}
                        </p>
                    </CardContent>
                </div>
            </Card>
        </div>
    );
}
