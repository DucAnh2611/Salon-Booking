import DashboardChart from "@/components/dashboard-chart";
import EmployeeDashboard from "@/components/employee-dashboard";
import OrderDashboard from "@/components/order-dashboard";
import ProductDashboard from "@/components/product-dasboard";
import { SelectMonth, SelectYear } from "@/components/select-birthday";
import ServiceDashboard from "@/components/service-dashboard";
import SummaryDashboard from "@/components/summary-dashboard";
import { Button } from "@/components/ui/button";
import { statisticDashboard } from "@/lib/redux/actions/dashboard.action";
import { dashboardSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { Loader, X } from "lucide-react";
import { useEffect, useState } from "react";

export function HomeScreen() {
    const { statistic, isCalling } = useAppSelector(dashboardSelector);
    const dispatch = useAppDispatch();

    const [selectMonth, SetSelectMonth] = useState<boolean>(false);
    const [year, SetYear] = useState<number>(new Date().getFullYear());
    const [month, SetMonth] = useState<number>(1);

    const getStatistic = async (year: number, month?: number) => {
        dispatch(statisticDashboard(year, month));
    };

    const handleSelectDate = (value: number, type: "d" | "m" | "y") => {
        switch (type) {
            case "d":
                return;

            case "m":
                SetMonth(value + 1);
                break;

            case "y":
                SetYear(value);
                SetMonth(1);
                SetSelectMonth(false);
                break;
            default:
                return;
        }
    };

    const toggleSelectMonth = () => {
        SetSelectMonth((m) => !m);
    };

    useEffect(() => {
        if (selectMonth) {
            getStatistic(year, month);
        } else {
            getStatistic(year);
        }
    }, [year, month, selectMonth]);
    document.title = "Trang chủ";

    if (!statistic) return <></>;

    return (
        <div className="w-full h-fit flex gap-5 relative">
            {isCalling && (
                <div className="w-full h-full absolute top-0 left-0 z-[2] backdrop-blur-sm">
                    <div className="w-full h-full absolute top-0 left-0 z-[0] bg-foreground opacity-15"></div>
                    <div className="w-full h-full flex items-center justify-center relative z-[1]">
                        <Loader size={15} className="animate-spin" />
                    </div>
                </div>
            )}
            <div className="flex-1 flex flex-col gap-5 h-full justify-start">
                <div className="h-fit w-full flex flex-col gap-5">
                    <div className="flex justify-end w-full h-fit gap-3">
                        <div className="w-auto flex gap-1">
                            {selectMonth ? (
                                <>
                                    <SelectMonth
                                        month={month - 1}
                                        year={year}
                                        onSelect={handleSelectDate}
                                    />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="aspect-square"
                                        onClick={toggleSelectMonth}
                                    >
                                        <X size={15} />
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant={"outline"}
                                    onClick={toggleSelectMonth}
                                >
                                    Chọn tháng
                                </Button>
                            )}
                        </div>
                        <div className="w-fit">
                            <SelectYear
                                year={year}
                                onSelect={handleSelectDate}
                            />
                        </div>
                    </div>
                    <SummaryDashboard statistic={statistic} />
                </div>
                <div className="h-fit w-full box-border">
                    <DashboardChart
                        selectMonth={selectMonth}
                        statistic={statistic}
                        year={year}
                        month={month}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-5 w-[450px] h-fit">
                <div className="h-fit">
                    <OrderDashboard statistic={statistic} />
                </div>
                <div className="h-fit">
                    <EmployeeDashboard statistic={statistic} />
                </div>
                <div className="h-fit">
                    <ProductDashboard statistic={statistic} />
                </div>
                <div className="h-fit">
                    <ServiceDashboard statistic={statistic} />
                </div>
            </div>
        </div>
    );
}
