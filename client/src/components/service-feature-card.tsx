import { ISerivceItemFeature } from "@/interface/service.interface";
import { formatMoney } from "@/lib/money";
import { joinString } from "@/lib/string";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ThumbnailMedia from "./thumbnail-media";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

interface IServiceFeatureCardProps {
    service: ISerivceItemFeature;
}

export default function ServiceFeatureCard({
    service,
}: IServiceFeatureCardProps) {
    return (
        <Card className="w-full h-full box-border p-3 group hover:bg-muted">
            <div className="w-full h-full flex flex-col gap-2">
                <div className="w-full flex-1 overflow-hidden border rounded  relative">
                    <div className="w-full h-[200px] overflow-hidden rounded">
                        <div className="w-full h-full group-hover:scale-105 duration-100 ">
                            <ThumbnailMedia medias={service.media} />
                        </div>
                    </div>
                    <div className="absolute left-0 top-0 flex gap-2 w-full justify-end p-2 box-border">
                        {service.stepCounts ? (
                            <div className=" bg-primary px-2 py-1 rounded-md">
                                <p className="whitespace-normal text-background text-xs font-medium w-fit">
                                    {`${service.stepCounts} bước`}
                                </p>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
                <div>
                    <div className="w-full relative">
                        <p className="whitespace-normal break-words line-clamp-2 text-base w-full h-[50px] text-wrap">
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
                    <div className="flex justify-between mt-1">
                        <Badge variant="outline" className="border-primary">
                            {service.duration} phút
                        </Badge>

                        <Link
                            href={joinString({
                                joinString: "/",
                                strings: ["/s", service.id],
                            })}
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                            Xem chi tiết <ChevronRight size={15} />
                        </Link>
                    </div>
                </div>
            </div>
        </Card>
    );
}
