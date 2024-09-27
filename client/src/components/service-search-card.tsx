import { ISerivceItemSearch } from "@/interface/service.interface";
import { formatMoney } from "@/lib/money";
import { joinString } from "@/lib/string";
import Link from "next/link";
import ThumbnailMedia from "./thumbnail-media";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface IServiceSearchCard {
    service: ISerivceItemSearch;
}

export default function ServiceSearchCard({ service }: IServiceSearchCard) {
    return (
        <Card className="w-full h-full box-border p-3 cursor-pointer group hover:bg-muted">
            <div className="w-full h-full flex flex-col gap-2">
                <div className="w-full flex-1 overflow-hidden border rounded  relative">
                    <div className="group-hover:scale-110 duration-100 w-full h-full">
                        <ThumbnailMedia medias={service.serviceMedia} />
                    </div>
                    <div className="absolute left-0 top-0 flex gap-2 w-full justify-between p-2 box-border">
                        {service.stepCounts ? (
                            <div className=" bg-primary px-2 py-1 rounded-md">
                                <p className="whitespace-normal text-background text-xs font-medium w-fit">
                                    {`${service.stepCounts} bước`}
                                </p>
                            </div>
                        ) : (
                            <div></div>
                        )}
                        <div className=" bg-primary  px-2 py-1 rounded-md">
                            <p className="whitespace-normal text-background text-xs font-medium w-fit">
                                {service.duration} phút
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="w-full relative">
                        <p className="whitespace-normal text-ellipsis line-clamp-2 text-sm w-full h-[40px] overflow-hidden">
                            {service.name}
                        </p>
                    </div>
                    <div className="w-full relative">
                        <p className="whitespace-normal line-clamp-1 text-primary text-sm font-medium w-full text-nowrap text-ellipsis">
                            {formatMoney(service.price)}
                        </p>
                    </div>
                    <div className="w-full relative mt-2">
                        <p className=" whitespace-normal line-clamp-1 text-xs w-full text-nowrap text-ellipsis italic text-muted-foreground">
                            ({service.bookingCounts}) lượt đặt
                        </p>
                    </div>
                    <div className="w-full mt-2">
                        <Button
                            className="w-full text-primary hover:bg-primary hover:text-secondary"
                            size="sm"
                            variant="outline"
                            asChild
                        >
                            <Link
                                href={joinString({
                                    joinString: "/",
                                    strings: ["/s", service.id],
                                })}
                            >
                                Xem chi tiết
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
