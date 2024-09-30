import { ROUTER_PATH } from "@/constants/router.constant";
import { IStatisticDashboard } from "@/interface/api/dashboard.interface";
import { formatMoney } from "@/utils/money";
import { joinString } from "@/utils/string";
import MediaLoader from "./media-load";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

interface IServiceDashboardProps {
    statistic: IStatisticDashboard;
}

export default function ServiceDashboard({
    statistic,
}: IServiceDashboardProps) {
    const services = statistic.service.mostServiceBooked.map((service) => ({
        ...service,
        serviceSnapshot: service.serviceSnapshot[0],
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top 10 dịch vụ được đặt nhiều nhất</CardTitle>
            </CardHeader>
            <Separator orientation="horizontal" />
            <CardContent className="h-fit max-h-[500px] overflow-y-auto">
                {!!statistic.product.mostProductSold.length ? (
                    <div className="flex flex-col py-2 gap-2">
                        {services.map((serviceOrder) => (
                            <div key={serviceOrder.serviceId}>
                                <a
                                    href={joinString({
                                        joinString: "/",
                                        strings: [
                                            ROUTER_PATH.SERVICE,
                                            serviceOrder.serviceId,
                                        ],
                                    })}
                                    className="flex gap-5 w-full hover:bg-muted p-2 duration-150 cursor-pointer"
                                >
                                    <div className="flex gap-5 w-fit">
                                        <div className="h-[80px] w-[80px] rounded-md overflow-hidden">
                                            <MediaLoader
                                                media={
                                                    serviceOrder.serviceSnapshot.media.filter(
                                                        (i) => i.isThumbnail
                                                    )[0].media || null
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 h-fit">
                                        <p className="text-base line-clamp-2 w-full whitespace-normal break-words">
                                            {serviceOrder.serviceSnapshot.name}
                                        </p>
                                        <p className="text-lg font-bold text-primary line-clamp-1 w-full whitespace-normal break-words text-left">
                                            {formatMoney(
                                                serviceOrder.serviceSnapshot
                                                    .price
                                            )}
                                        </p>
                                        <div className="w-full grid grid-cols-5 text-xs">
                                            <span className="col-span-2 text-primary">
                                                Thời lượng
                                            </span>
                                            <span className="col-span-3">
                                                {joinString({
                                                    joinString: " ",
                                                    strings: [
                                                        serviceOrder.serviceSnapshot.duration.toString(),
                                                        "phút",
                                                    ],
                                                })}
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
                                                    serviceOrder.count.toString(),
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
                            Không có dịch vụ nào phù hợp
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
