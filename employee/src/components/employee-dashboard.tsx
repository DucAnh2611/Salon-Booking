import { ROUTER_PATH } from "@/constants/router.constant";
import { IStatisticDashboard } from "@/interface/api/dashboard.interface";
import { joinString } from "@/utils/string";
import MediaLoader from "./media-load";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

interface IEmployeeDashboardProps {
    statistic: IStatisticDashboard;
}

export default function EmployeeDashboard({
    statistic,
}: IEmployeeDashboardProps) {
    const employees = statistic.service.mostEmployeeBooked.map(
        ({ count, employeeId, employeeSnapShot }) => ({
            count,
            employeeId,
            employeeSnapshot: employeeSnapShot[0],
        })
    );

    console.log(employees);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top 10 nhân viên được đặt nhiều nhất</CardTitle>
            </CardHeader>
            <Separator orientation="horizontal" />
            <CardContent className="h-fit max-h-[500px] overflow-y-auto">
                {!!statistic.product.mostProductSold.length ? (
                    <div className="flex flex-col py-2 gap-2">
                        {employees.map((employeeOrder) => (
                            <div key={employeeOrder.employeeId}>
                                <a
                                    href={joinString({
                                        joinString: "/",
                                        strings: [
                                            ROUTER_PATH.EMPLOYEE,
                                            employeeOrder.employeeId,
                                        ],
                                    })}
                                    className="flex gap-5 w-full hover:bg-muted p-2 duration-150 cursor-pointer"
                                >
                                    <div className="flex gap-5 w-fit">
                                        <div className="h-[80px] w-[80px] rounded-md overflow-hidden">
                                            <MediaLoader
                                                media={
                                                    employeeOrder
                                                        .employeeSnapshot
                                                        .employee.userBase
                                                        ?.userAvatar || null
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 h-fit">
                                        <p className="text-base w-full whitespace-normal break-words">
                                            {joinString({
                                                joinString: " ",
                                                strings: [
                                                    employeeOrder
                                                        .employeeSnapshot
                                                        .employee.userBase
                                                        .lastname,

                                                    employeeOrder
                                                        .employeeSnapshot
                                                        .employee.userBase
                                                        .firstname,
                                                ],
                                            })}
                                        </p>
                                        <div className="w-full grid grid-cols-5 text-xs mt-2">
                                            <span className="col-span-2 text-primary">
                                                Tên đăng nhập
                                            </span>
                                            <span className="col-span-3">
                                                {
                                                    employeeOrder
                                                        .employeeSnapshot
                                                        .employee.username
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <Separator
                                        orientation="vertical"
                                        className="h-auto"
                                    />
                                    <div className="h-auto flex items-center justify-end">
                                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                                            {joinString({
                                                joinString: " ",
                                                strings: [
                                                    "SL:",
                                                    employeeOrder.count.toString(),
                                                ],
                                            })}
                                        </p>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="">
                        <p className="w-full text-center text-sm text-muted-foreground py-10">
                            Không có nhân viên nào phù hợp
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
